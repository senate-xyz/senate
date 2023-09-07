use std::{env, sync::Arc, time::Duration};

use anyhow::Result;

use prisma_client_rust::serde_json;
use tokio::time::sleep;
use tracing::{debug_span, event, instrument, warn, Instrument, Level};

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
    utils::vote::get_vote,
};

use super::utils::notification_retry::update_notification_retry;

prisma::proposal::include!(proposal_with_dao { dao daohandler });

#[instrument(skip_all)]
pub async fn dispatch_new_proposal_notifications(client: &Arc<PrismaClient>) -> Result<()> {
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

        let proposal = client
            .proposal()
            .find_first(vec![proposal::id::equals(
                notification.clone().proposalid.unwrap(),
            )])
            .include(proposal_with_dao::include())
            .exec()
            .await?;

        let shortner_url = match env::var_os("NEXT_PUBLIC_URL_SHORTNER") {
            Some(v) => v.into_string().unwrap(),
            None => panic!("$NEXT_PUBLIC_URL_SHORTNER is not set"),
        };

        match proposal {
            Some(proposal) => {
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
                                "text": format!("*<{}|{}>*\n📢 New *{}* {} proposal ending on *<!date^{}^{{date}} at {{time}}|February 18th, 2014 at 6:39 AM PST>*", proposal.url, proposal.name,proposal.dao.name,if proposal.daohandler.r#type == DaoHandlerType::Snapshot {
                                        "offchain"
                                    } else {
                                        "onchain"
                                    }, proposal.timeend.timestamp())
                            },
                            "accessory": {
                                "type": "image",
                                "image_url": format!(
                                    "https://www.senatelabs.xyz/{}_medium.png",
                                    proposal.dao.picture
                                ),
                                "alt_text": proposal.dao.name
                            }
                        },
                        {
                            "type": "actions",
                            "elements": [
                                {
                                    "type": "button",
                                    "text": {
                                        "type": "plain_text",
                                        "text": "🗳️ Vote on this proposal",
                                        "emoji": true
                                    },
                                    "url": short_url
                                }
                            ]
                        }
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
                            proposal_name = proposal.name,
                            dao = proposal.dao.name,
                            "new notification"
                        );

                        vec![notification::dispatchstatus::set(
                            NotificationDispatchedState::Dispatched,
                        )]
                    }
                    _ => {
                        event!(
                            Level::WARN,
                            user = user.address.clone().unwrap(),
                            proposal_name = proposal.name,
                            dao = proposal.dao.name,
                            "new notification"
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
                            notification::userid::equals(user.id),
                            notification::proposalid::equals(proposal.id.into()),
                            notification::r#type::equals(NotificationType::NewProposalSlack),
                        ],
                        update_data,
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
