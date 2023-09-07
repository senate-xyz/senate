use std::{env, sync::Arc, time::Duration};

use prisma_client_rust::serde_json;
use serde::Deserialize;
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
    utils::vote::get_vote,
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

    let shortner_url = match env::var_os("NEXT_PUBLIC_URL_SHORTNER") {
        Some(v) => v.into_string().unwrap(),
        None => panic!("$NEXT_PUBLIC_URL_SHORTNER is not set"),
    };

    for notification in notifications {
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

        #[allow(non_snake_case)]
        #[derive(Debug, Deserialize)]
        struct Decoder {
            governancePortal: String,
        }

        let decoder: Decoder =
            match serde_json::from_value(proposal.clone().unwrap().daohandler.decoder) {
                Ok(data) => data,
                Err(_) => Decoder {
                    governancePortal: "https://senate.app".to_string(),
                },
            };

        let voted = get_vote(
            notification.clone().userid,
            notification.clone().proposalid.unwrap(),
            client,
        )
        .await?;

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
            "s",
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

        let payload = serde_json::json!({
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": format!("⌛ *<{}|{}>* {} proposal ends in 2️⃣4️⃣ *hours*. 🕒\n_<{}|{}>_", decoder.governancePortal, proposal.clone().unwrap().dao.name,if proposal.clone().unwrap().daohandler.r#type == DaoHandlerType::Snapshot {
                                        "offchain"
                                    } else {
                                        "onchain"
                                    }, proposal.clone().unwrap().url,proposal.clone().unwrap().name)
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": if voted {"⚫️ *Voted*"} else {"⭕️ *Didn't vote yet*"}
                    }
                },
                if user.slackincludevotes {
                    serde_json::json!({
                    "type": "actions",
                    "elements": [
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": if voted {"🗳️ See Proposal"} else {"🗳️ Vote on this proposal"},
                                "emoji": true
                            },
                            "url": short_url
                        }
                    ]
                }
            )}
            else{serde_json::json!({})}
            ]
        });

        let repsonse = reqwest_client
            .post(user.clone().slackwebhook)
            .json(&payload)
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

                vec![notification::dispatchstatus::set(
                    NotificationDispatchedState::Dispatched,
                )]
            }
            _ => match notification.dispatchstatus {
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
            },
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
