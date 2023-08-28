use std::{env, sync::Arc, time::Duration};

use tokio::time::sleep;
use tracing::{debug_span, event, instrument, warn, Instrument, Level};

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
    let reqwest_client = reqwest::Client::new();

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
                notification::r#type::equals(NotificationType::NewProposalDiscord),
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

        let repsonse = reqwest_client
            .post(user.clone().slackwebhook)
            .body("this is an ending soon proposal message")
            .header("Content-Type", "application/json")
            .send()
            .await?
            .text()
            .await?;

        let update_data = match repsonse.as_str() {
            "ok" => {
                event!(
                    Level::INFO,
                    user = user.address.clone().unwrap(),
                    proposal_name = proposal.clone().unwrap().name,
                    dao = proposal.clone().unwrap().dao.name,
                    "new notification"
                );

                posthog_event(
                    "slack_ending_soon_notification",
                    user.address.unwrap(),
                    proposal.clone().unwrap().name,
                    proposal.clone().unwrap().dao.name,
                );

                vec![notification::dispatchstatus::set(
                    NotificationDispatchedState::Dispatched,
                )]
            }
            _ => {
                posthog_event(
                    "slack_ending_soon_notification_fail",
                    user.address.unwrap(),
                    proposal.clone().unwrap().name,
                    proposal.clone().unwrap().dao.name,
                );

                match notification.dispatchstatus {
                    NotificationDispatchedState::NotDispatched => {
                        vec![notification::dispatchstatus::set(
                            NotificationDispatchedState::FirstRetry,
                        )]
                    }
                    NotificationDispatchedState::FirstRetry => {
                        vec![notification::dispatchstatus::set(
                            NotificationDispatchedState::SecondRetry,
                        )]
                    }
                    NotificationDispatchedState::SecondRetry => {
                        vec![notification::dispatchstatus::set(
                            NotificationDispatchedState::ThirdRetry,
                        )]
                    }
                    NotificationDispatchedState::ThirdRetry => {
                        vec![notification::dispatchstatus::set(
                            NotificationDispatchedState::Failed,
                        )]
                    }
                    NotificationDispatchedState::Dispatched => todo!(),
                    NotificationDispatchedState::Deleted => todo!(),
                    NotificationDispatchedState::Failed => todo!(),
                }
            }
        };

        client
            .notification()
            .update_many(
                vec![
                    notification::userid::equals(notification.clone().userid),
                    notification::proposalid::equals(notification.clone().proposalid),
                    notification::r#type::equals(notification.clone().r#type),
                ],
                update_data,
            )
            .exec()
            .await?;

        sleep(Duration::from_millis(100)).await;
    }

    Ok(())
}
