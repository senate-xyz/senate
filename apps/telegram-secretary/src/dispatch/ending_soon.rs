use std::{env, sync::Arc, time::Duration};

use prisma_client_rust::serde_json;
use serde::Deserialize;
use teloxide::types::InlineKeyboardButtonKind;
use teloxide::{
    adaptors::{DefaultParseMode, Throttle},
    payloads::SendMessageSetters,
    requests::Requester,
    types::{ChatId, InlineKeyboardButton, InlineKeyboardMarkup},
    Bot,
};

use tokio::time::sleep;
use tracing::{debug, debug_span, event, instrument, warn, Instrument, Level};

use crate::prisma::{
    self, notification, proposal, user, DaoHandlerType, NotificationDispatchedState,
    NotificationType, PrismaClient,
};
use crate::utils::vote::get_vote;

use anyhow::Result;

prisma::proposal::include!(proposal_with_dao { dao daohandler });

#[instrument(skip(client))]
pub async fn dispatch_ending_soon_notifications(
    client: &Arc<PrismaClient>,
    bot: &Arc<DefaultParseMode<Throttle<teloxide::Bot>>>,
) -> Result<()> {
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
                NotificationType::FirstReminderTelegram,
                NotificationType::SecondReminderTelegram,
            ]),
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

        match proposal {
            Some(proposal) => {
                let shortner_url = match env::var_os("NEXT_PUBLIC_URL_SHORTNER") {
                    Some(v) => v.into_string().unwrap(),
                    None => panic!("$NEXT_PUBLIC_URL_SHORTNER is not set"),
                };

                let short_url = format!(
                    "{}/{}/{}/{}",
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
                    "t",
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

                let voted = get_vote(
                    notification.clone().userid,
                    notification.clone().proposalid.unwrap(),
                    client,
                )
                .await?;

                #[allow(non_snake_case)]
                #[derive(Debug, Deserialize)]
                struct Decoder {
                    governancePortal: String,
                }

                let decoder: Decoder = match serde_json::from_value(proposal.daohandler.decoder) {
                    Ok(data) => data,
                    Err(_) => Decoder {
                        governancePortal: "https://senate.app".to_string(),
                    },
                };

                let message_content = match notification.r#type {
                    NotificationType::QuorumNotReachedEmail => todo!(),
                    NotificationType::NewProposalDiscord => todo!(),
                    NotificationType::FirstReminderDiscord => todo!(),
                    NotificationType::SecondReminderDiscord => todo!(),
                    NotificationType::ThirdReminderDiscord => todo!(),
                    NotificationType::EndedProposalDiscord => todo!(),
                    NotificationType::NewProposalTelegram => todo!(),
                    NotificationType::FirstReminderTelegram => {
                        format!(
                            "⌛ <a href=\"{}\"><b>{}</b></a> {} proposal <b>ends in 2️⃣4️⃣ hours.</b> 🕒 \n<a href=\"{}\"><i>{}</i></a> \n<b>{}</b>",
                            decoder.governancePortal,
                            proposal.dao.name,
                            if proposal.daohandler.r#type == DaoHandlerType::Snapshot {
                                "offchain"
                            } else {
                                "onchain"
                            },
                            short_url,
                            proposal
                                .name
                                .replace('&', "&amp;")
                                .replace('<', "&lt;")
                                .replace('>', "&gt;")
                                .replace('\"', "&quot;")
                                .replace('\'', "&#39;"),
                            if voted {"⚫️ Voted"} else {"⭕️ Didn't vote yet"}
                        )
                    }
                    NotificationType::SecondReminderTelegram => {
                        format!(
                            "🚨 <a href=\"{}\"><b>{}</b></a> {} proposal <b>ends in 6️⃣ hours.</b> 🕒 \n<a href=\"{}\"><i>{}</i></a> \n<b>{}</b>",
                            decoder.governancePortal,
                            proposal.dao.name,
                            if proposal.daohandler.r#type == DaoHandlerType::Snapshot {
                                "offchain"
                            } else {
                                "onchain"
                            },
                            short_url,
                            proposal
                                .name
                                .replace('&', "&amp;")
                                .replace('<', "&lt;")
                                .replace('>', "&gt;")
                                .replace('\"', "&quot;")
                                .replace('\'', "&#39;"),
                            if voted {"⚫️ Voted"} else {"⭕️ Didn't vote yet"}
                        )
                    }
                    NotificationType::ThirdReminderTelegram => todo!(),
                    NotificationType::EndedProposalTelegram => todo!(),
                    NotificationType::BulletinEmail => todo!(),
                };

                let message = bot
                    .send_message(
                        ChatId(user.telegramchatid.parse().unwrap()),
                        message_content,
                    )
                    .reply_markup(InlineKeyboardMarkup::default().append_row(vec![
                        InlineKeyboardButton::url(
                            if !voted {
                                "🗳️ Vote".to_string()
                            } else {
                                "🗳️ See Proposal".to_string()
                            },
                            url::Url::parse(short_url.as_str()).unwrap(),
                        ),
                    ]))
                    .disable_web_page_preview(true)
                    .await;

                let update_data = match message {
                    Ok(msg) => {
                        event!(Level::INFO, "ending notification");
                        vec![
                            notification::dispatchstatus::set(
                                NotificationDispatchedState::Dispatched,
                            ),
                            notification::telegramchatid::set(msg.chat.id.to_string().into()),
                            notification::telegrammessageid::set(msg.id.to_string().into()),
                        ]
                    }
                    Err(e) => {
                        event!(Level::ERROR, err = e.to_string(), "failed new notification");
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
            }
            None => {
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
            }
        }

        sleep(Duration::from_millis(100)).await;
    }
    Ok(())
}
