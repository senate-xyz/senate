use std::{cmp::Ordering, env, result, sync::Arc, time::Duration};

use anyhow::Result;
use prisma_client_rust::bigdecimal::ToPrimitive;
use slack_morphism::{
    prelude::{SlackApiPostWebhookMessageRequest, SlackClientHyperConnector},
    SlackClient,
    SlackMessageContent,
};
use tokio::time::sleep;
use tracing::{debug_span, event, instrument, warn, Instrument, Level};
use url::Url;

use crate::{
    prisma::{
        self,
        notification,
        proposal,
        user,
        DaoHandlerType,
        NotificationDispatchedState,
        NotificationType,
        PrismaClient,
    },
    utils::{posthog::posthog_event, vote::get_vote},
};

use super::utils::notification_retry::update_notification_retry;

prisma::proposal::include!(proposal_with_dao { dao daohandler });

#[instrument(skip(client))]
pub async fn dispatch_ended_proposal_notifications(client: &Arc<PrismaClient>) -> Result<()> {
    let notifications = client
        .notification()
        .find_many(vec![
            notification::dispatchstatus::in_vec(vec![
                NotificationDispatchedState::NotDispatched,
                NotificationDispatchedState::FirstRetry,
                NotificationDispatchedState::SecondRetry,
                NotificationDispatchedState::ThirdRetry,
            ]),
            notification::r#type::equals(NotificationType::EndedProposalSlack),
        ])
        .exec()
        .await?;

    for notification in notifications {
        let new_notification = client
            .notification()
            .find_first(vec![
                notification::userid::equals(notification.clone().userid),
                notification::proposalid::equals(notification.clone().proposalid),
                notification::r#type::equals(NotificationType::NewProposalSlack),
                notification::dispatchstatus::equals(NotificationDispatchedState::Dispatched),
            ])
            .exec()
            .await?;

        let user = client
            .user()
            .find_first(vec![user::id::equals(notification.clone().userid)])
            .exec()
            .await?
            .unwrap();

        let proposal = client
            .proposal()
            .find_first(vec![proposal::id::equals(
                notification.clone().proposalid.unwrap(),
            )])
            .include(proposal_with_dao::include())
            .exec()
            .await?;

        let slack_client = SlackClient::new(SlackClientHyperConnector::new());
        let webhook_url: Url = Url::parse(user.slackwebhook.as_str())?;

        match new_notification {
            Some(new_notification) => {
                // let initial_message_id: u64 =
                //     new_notification.slackmessageid.unwrap().parse().unwrap();

                match proposal {
                    Some(proposal) => {
                        let (result_index, max_score) = proposal
                            .scores
                            .as_array()
                            .unwrap()
                            .iter()
                            .map(|score| score.as_f64().unwrap())
                            .enumerate()
                            .max_by(|(_, a), (_, b)| a.partial_cmp(b).unwrap_or(Ordering::Equal))
                            .unwrap_or((100, 0.0));

                        let message_content = if result_index == 100 {
                            "❓ Could not fetch results".to_string()
                        } else if proposal.scorestotal.as_f64().unwrap()
                            >= proposal.quorum.as_f64().unwrap()
                            && proposal.scorestotal.as_f64().unwrap() > 0.0
                        {
                            format!(
                                ":ballot_box_with_check: **{}** {}%",
                                &proposal.choices.as_array().unwrap()[result_index]
                                    .as_str()
                                    .unwrap(),
                                (max_score / proposal.scorestotal.as_f64().unwrap() * 100.0)
                                    .round()
                            )
                        } else {
                            ":regional_indicator_x: No Quorum".to_string()
                        };

                        let voted = get_vote(
                            new_notification.userid,
                            new_notification.proposalid.unwrap(),
                            client,
                        )
                        .await?;

                        let shortner_url = match env::var_os("NEXT_PUBLIC_URL_SHORTNER") {
                            Some(v) => v.into_string().unwrap(),
                            None => panic!("$NEXT_PUBLIC_URL_SHORTNER is not set"),
                        };

                        let short_url = format!(
                            "{}{}/{}/{}",
                            shortner_url,
                            proposal
                                .id
                                .chars()
                                .rev()
                                .take(7)
                                .collect::<Vec<char>>()
                                .into_iter()
                                .rev()
                                .collect::<String>(),
                            "d",
                            user.clone()
                                .id
                                .chars()
                                .rev()
                                .take(7)
                                .collect::<Vec<char>>()
                                .into_iter()
                                .rev()
                                .collect::<String>()
                        );

                        let image = if user.slackincludevotes {
                            if voted {
                                "https://www.senatelabs.xyz/assets/Discord/past-vote2x.png"
                            } else {
                                "https://www.senatelabs.xyz/assets/Discord/past-no-vote2x.png"
                            }
                        } else {
                            "https://www.senatelabs.xyz/assets/Discord/placeholder2x.png"
                        };

                        slack_client
                            .post_webhook_message(
                                &webhook_url,
                                &SlackApiPostWebhookMessageRequest::new(
                                    SlackMessageContent::new().with_text(format!(
                                        "🗳️ **{}** {} proposal {} **just ended.** ☑️",
                                        proposal.dao.name,
                                        if proposal.daohandler.r#type == DaoHandlerType::Snapshot {
                                            "offchain"
                                        } else {
                                            "onchain"
                                        },
                                        new_notification.discordmessagelink.unwrap(),
                                    )),
                                ),
                            )
                            .await?;

                        client
                            .notification()
                            .update_many(
                                vec![
                                    notification::userid::equals(notification.clone().userid),
                                    notification::proposalid::equals(
                                        notification.clone().proposalid,
                                    ),
                                    notification::r#type::equals(notification.clone().r#type),
                                ],
                                vec![notification::dispatchstatus::set(
                                    NotificationDispatchedState::Dispatched,
                                )],
                            )
                            .exec()
                            .await?;
                    }
                    None => {
                        client
                            .notification()
                            .update_many(
                                vec![
                                    notification::userid::equals(notification.clone().userid),
                                    notification::proposalid::equals(
                                        notification.clone().proposalid,
                                    ),
                                    notification::r#type::equals(notification.clone().r#type),
                                ],
                                vec![notification::dispatchstatus::set(
                                    NotificationDispatchedState::Deleted,
                                )],
                            )
                            .exec()
                            .await?;
                    }
                }
            }
            None => {
                if let Some(proposal) = proposal {
                    slack_client
                        .post_webhook_message(
                            &webhook_url,
                            &SlackApiPostWebhookMessageRequest::new(
                                SlackMessageContent::new().with_text(format!(
                                    "🗳️ **{}** {} proposal {} **just ended.** ☑️",
                                    proposal.dao.name,
                                    if proposal.daohandler.r#type == DaoHandlerType::Snapshot {
                                        "offchain"
                                    } else {
                                        "onchain"
                                    },
                                    proposal.name,
                                )),
                            ),
                        )
                        .await?;

                    client
                        .notification()
                        .update_many(
                            vec![
                                notification::userid::equals(notification.clone().userid),
                                notification::proposalid::equals(notification.clone().proposalid),
                                notification::r#type::equals(notification.clone().r#type),
                            ],
                            vec![notification::dispatchstatus::set(
                                NotificationDispatchedState::Dispatched,
                            )],
                        )
                        .exec()
                        .await?;
                }
            }
        }

        sleep(Duration::from_millis(100)).await;
    }

    Ok(())
}
