use std::{env, sync::Arc, time::Duration};

use slack_morphism::{
    prelude::{SlackApiPostWebhookMessageRequest, SlackClientHyperConnector},
    SlackClient,
    SlackMessageContent,
};
use tokio::time::sleep;
use tracing::{debug_span, event, instrument, warn, Instrument, Level};
use url::Url;

use crate::{
    dispatch::new_proposals,
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
    utils::posthog::posthog_event,
};

use super::utils::notification_retry::update_notification_retry;
use anyhow::Result;

prisma::proposal::include!(proposal_with_dao { dao daohandler });

pub async fn dispatch_ending_soon_notifications(client: &Arc<PrismaClient>) -> Result<()> {
    let notifications = client
        .notification()
        .find_many(vec![
            notification::dispatchstatus::in_vec(vec![
                NotificationDispatchedState::NotDispatched,
                NotificationDispatchedState::FirstRetry,
                NotificationDispatchedState::SecondRetry,
                NotificationDispatchedState::ThirdRetry,
            ]),
            notification::r#type::in_vec(vec![
                NotificationType::FirstReminderSlack,
                NotificationType::SecondReminderSlack,
            ]),
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
            ])
            .exec()
            .await?;

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

        if proposal.is_none() {
            client
                .notification()
                .update_many(
                    vec![
                        notification::userid::equals(notification.clone().userid),
                        notification::proposalid::equals(notification.clone().proposalid),
                        notification::r#type::equals(notification.clone().r#type),
                    ],
                    vec![notification::dispatchstatus::set(
                        NotificationDispatchedState::Deleted,
                    )],
                )
                .exec()
                .await?;

            continue;
        }

        let shortner_url = match env::var_os("NEXT_PUBLIC_URL_SHORTNER") {
            Some(v) => v.into_string().unwrap(),
            None => panic!("$NEXT_PUBLIC_URL_SHORTNER is not set"),
        };

        let short_url = format!(
            "{}{}/{}/{}",
            shortner_url,
            proposal
                .clone()
                .unwrap()
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

        let message_content = match notification.r#type {
            NotificationType::QuorumNotReachedEmail => todo!(),
            NotificationType::NewProposalDiscord => todo!(),
            NotificationType::FirstReminderDiscord => todo!(),
            NotificationType::SecondReminderDiscord => todo!(),
            NotificationType::ThirdReminderDiscord => todo!(),
            NotificationType::EndedProposalDiscord => todo!(),
            NotificationType::NewProposalTelegram => todo!(),
            NotificationType::FirstReminderTelegram => todo!(),
            NotificationType::SecondReminderTelegram => todo!(),
            NotificationType::ThirdReminderTelegram => todo!(),
            NotificationType::EndedProposalTelegram => todo!(),
            NotificationType::BulletinEmail => todo!(),
            NotificationType::NewProposalSlack => todo!(),
            NotificationType::FirstReminderSlack => {
                format!(
                    "⌛ **{}** {} proposal {} **ends in 2️⃣4️⃣ hours.** 🕒 \nVote here 👉 <{}>",
                    proposal.clone().unwrap().dao.name,
                    if proposal.clone().unwrap().daohandler.r#type == DaoHandlerType::Snapshot {
                        "offchain"
                    } else {
                        "on-chain"
                    },
                    match new_notification {
                        Some(new_notification) => new_notification
                            .discordmessagelink
                            .unwrap_or(proposal.clone().unwrap().name),
                        None => proposal.clone().unwrap().name,
                    },
                    short_url
                )
            }
            NotificationType::SecondReminderSlack => {
                format!(
                    "🚨 **{}** {} proposal {} **ends in :six: hours.** 🕒 \nVote here 👉 <{}>",
                    proposal.clone().unwrap().dao.name,
                    if proposal.clone().unwrap().daohandler.r#type == DaoHandlerType::Snapshot {
                        "offchain"
                    } else {
                        "on-chain"
                    },
                    match new_notification {
                        Some(new_notification) => new_notification
                            .discordmessagelink
                            .unwrap_or(proposal.clone().unwrap().name),
                        None => proposal.clone().unwrap().name,
                    },
                    short_url
                )
            }
            NotificationType::ThirdReminderSlack => todo!(),
            NotificationType::EndedProposalSlack => todo!(),
        };

        slack_client
            .post_webhook_message(
                &webhook_url,
                &SlackApiPostWebhookMessageRequest::new(
                    SlackMessageContent::new().with_text(message_content),
                ),
            )
            .await?;

        event!(
            Level::INFO,
            user = user.address.clone().unwrap(),
            proposal_name = proposal.clone().unwrap().name,
            dao = proposal.clone().unwrap().dao.name,
            "new notification"
        );

        // posthog_event(
        //     "slack_ending_soon_notification",
        //     user.address.unwrap(),
        //     proposal.clone().unwrap().name,
        //     proposal.clone().unwrap().dao.name,
        // );

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

        sleep(Duration::from_millis(100)).await;
    }

    Ok(())
}
