use std::{env, sync::Arc, time::Duration};

use anyhow::Result;

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

#[instrument(skip_all)]
pub async fn dispatch_new_proposal_notifications(client: &Arc<PrismaClient>) -> Result<()> {
    let notifications = client
        .notification()
        .find_many(vec![
            notification::dispatchstatus::in_vec(vec![
                NotificationDispatchedState::NotDispatched,
                NotificationDispatchedState::FirstRetry,
                NotificationDispatchedState::SecondRetry,
                NotificationDispatchedState::ThirdRetry,
            ]),
            notification::r#type::equals(NotificationType::NewProposalSlack),
        ])
        .exec()
        .await?;

    for notification in notifications {
        let user = client
            .user()
            .find_first(vec![user::id::equals(notification.clone().userid)])
            .exec()
            .await?
            .unwrap();

        let slack_client = SlackClient::new(SlackClientHyperConnector::new());
        let webhook_url: Url = Url::parse(user.slackwebhook.as_str())?;

        let proposal = client
            .proposal()
            .find_first(vec![proposal::id::equals(
                notification.clone().proposalid.unwrap(),
            )])
            .include(proposal_with_dao::include())
            .exec()
            .await?;

        match proposal {
            Some(proposal) => {
                let voted = get_vote(user.clone().id, proposal.clone().id, client).await?;

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
                        "https://www.senatelabs.xyz/assets/Discord/active-vote2x.png"
                    } else {
                        "https://www.senatelabs.xyz/assets/Discord/active-no-vote2x.png"
                    }
                } else {
                    "https://www.senatelabs.xyz/assets/Discord/placeholder2x.png"
                };

                slack_client
                    .post_webhook_message(
                        &webhook_url,
                        &SlackApiPostWebhookMessageRequest::new(
                            SlackMessageContent::new().with_text(format!(
                                "**{}** {} proposal ending **<t:{}:R>**",
                                proposal.dao.name,
                                if proposal.daohandler.r#type == DaoHandlerType::Snapshot {
                                    "offchain"
                                } else {
                                    "onchain"
                                },
                                proposal.timeend.timestamp()
                            )),
                        ),
                    )
                    .await?;

                event!(
                    Level::INFO,
                    user = user.address.clone().unwrap(),
                    proposal_name = proposal.name,
                    dao = proposal.dao.name,
                    "new notification"
                );

                // posthog_event(
                //     "slack_new_notification",
                //     user.address.unwrap(),
                //     proposal.name,
                //     proposal.dao.name,
                // );

                client
                    .notification()
                    .update_many(
                        vec![
                            notification::userid::equals(user.id),
                            notification::proposalid::equals(proposal.id.into()),
                            notification::r#type::equals(NotificationType::NewProposalSlack),
                        ],
                        vec![notification::dispatchstatus::set(
                            NotificationDispatchedState::Dispatched,
                        )],
                    )
                    .exec()
                    .await?;

                sleep(Duration::from_millis(100)).await;
            }
            None => {
                client
                    .notification()
                    .update_many(
                        vec![
                            notification::userid::equals(notification.clone().userid),
                            notification::proposalid::equals(notification.clone().proposalid),
                            notification::r#type::equals(NotificationType::NewProposalSlack),
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
    Ok(())
}
