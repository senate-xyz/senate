use std::{cmp::Ordering, env, result, sync::Arc, time::Duration};

use prisma_client_rust::{bigdecimal::ToPrimitive, chrono::Utc};
use teloxide::{
    adaptors::{DefaultParseMode, Throttle},
    payloads::SendMessageSetters,
    requests::Requester,
    types::{ChatId, MessageId},
    Bot,
};
use tokio::time::sleep;
use tracing::{debug, debug_span, instrument, Instrument};

use crate::{
    prisma::{
        self, notification, proposal, user, DaoHandlerType, NotificationDispatchedState,
        NotificationType, PrismaClient,
    },
    utils::vote::get_vote,
};

prisma::proposal::include!(proposal_with_dao { dao daohandler });

#[instrument(skip_all, level = "info")]
pub async fn dispatch_ended_proposal_notifications(
    client: &Arc<PrismaClient>,
    bot: &Arc<DefaultParseMode<Throttle<teloxide::Bot>>>,
) {
    let ended_notifications = client
        .notification()
        .find_many(vec![
            notification::dispatchstatus::in_vec(vec![
                NotificationDispatchedState::NotDispatched,
                NotificationDispatchedState::FirstRetry,
                NotificationDispatchedState::SecondRetry,
                NotificationDispatchedState::ThirdRetry,
            ]),
            notification::r#type::equals(NotificationType::EndedProposalTelegram),
        ])
        .exec()
        .instrument(debug_span!("get_notifications"))
        .await
        .unwrap();

    for notification in ended_notifications {
        let user = client
            .user()
            .find_first(vec![user::id::equals(notification.clone().userid)])
            .exec()
            .instrument(debug_span!("get_user"))
            .await
            .unwrap()
            .unwrap();

        let proposal = client
            .proposal()
            .find_first(vec![proposal::id::equals(
                notification.clone().proposalid.unwrap(),
            )])
            .include(proposal_with_dao::include())
            .exec()
            .instrument(debug_span!("get_proposal"))
            .await
            .unwrap();

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
                    .unwrap();

                let shortner_url = match env::var_os("NEXT_PUBLIC_URL_SHORTNER") {
                    Some(v) => v.into_string().unwrap(),
                    None => panic!("$NEXT_PUBLIC_URL_SHORTNER is not set"),
                };

                let short_url = format!(
                    "{}/{}/{}/{}",
                    shortner_url,
                    "t",
                    proposal
                        .id
                        .chars()
                        .rev()
                        .take(7)
                        .collect::<Vec<char>>()
                        .into_iter()
                        .rev()
                        .collect::<String>(),
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
                .await
                .unwrap();

                let message = if proposal.scorestotal.as_f64() > proposal.quorum.as_f64() {
                    let result = format!(
                        "{} {}%",
                        proposal.choices.as_array().unwrap()[result_index]
                            .as_str()
                            .unwrap(),
                        (max_score / proposal.scorestotal.as_f64().unwrap() * 100.0).round()
                    );

                    bot
                        .send_message(
                            ChatId(user.telegramchatid.parse().unwrap()),
                            format!(
                                "🗳️ <b>{}</b> {} proposal <b>just ended.</b> \n<b>{}</b> \n<i>✅ {}</i> - <a href=\"{}\"><i>{}</i></a>",
                                proposal.dao.name,
                                if proposal.daohandler.r#type == DaoHandlerType::Snapshot {
                                    "off-chain"
                                } else {
                                    "on-chain"
                                },
                                if voted { "🟢 Voted" } else { "🔴 Did not vote" },
                                result,
                                short_url,
                                proposal.name
                                    .replace('&', "&amp;")
                                    .replace('<', "&lt;")
                                    .replace('>', "&gt;")
                                    .replace('\"', "&quot;")
                                    .replace('\'', "&#39;"),
                            ),
                        ).disable_web_page_preview(true)
                        .await
                } else {
                    bot
                        .send_message(
                            ChatId(user.telegramchatid.parse().unwrap()),
                            format!(
                                "🗳️ <b>{}</b> {} proposal <b>just ended.</b> \n<b>{}</b> \n<i>🚫 No Quorum</i> - <a href=\"{}\"><i>{}</i></a>",
                                proposal.dao.name,
                                if proposal.daohandler.r#type == DaoHandlerType::Snapshot {
                                    "off-chain"
                                } else {
                                    "on-chain"
                                },
                                if voted { "🟢 Voted" } else { "🔴 Did not vote" },
                                short_url,
                                proposal.name
                                    .replace('&', "&amp;")
                                    .replace('<', "&lt;")
                                    .replace('>', "&gt;")
                                    .replace('\"', "&quot;")
                                    .replace('\'', "&#39;"),
                            ),
                        ).disable_web_page_preview(true)
                        .await
                };

                let update_data = match message {
                    Ok(msg) => {
                        vec![
                            notification::dispatchstatus::set(
                                NotificationDispatchedState::Dispatched,
                            ),
                            notification::telegramchatid::set(msg.chat.id.to_string().into()),
                            notification::telegrammessageid::set(msg.id.to_string().into()),
                        ]
                    }
                    Err(_) => match notification.dispatchstatus {
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
                    .instrument(debug_span!("update_notification"))
                    .await
                    .unwrap();
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
                    .instrument(debug_span!("update_notification"))
                    .await
                    .unwrap();
            }
        }

        sleep(Duration::from_millis(100)).await;
    }
}
