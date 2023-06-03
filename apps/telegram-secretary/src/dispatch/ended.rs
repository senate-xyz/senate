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

use crate::{
    prisma::{self, notification, proposal, user, DaoHandlerType, NotificationType, PrismaClient},
    utils::vote::get_vote,
};

prisma::proposal::include!(proposal_with_dao { dao daohandler });

pub async fn dispatch_ended_proposal_notifications(
    client: &Arc<PrismaClient>,
    bot: &Arc<DefaultParseMode<Throttle<teloxide::Bot>>>,
) {
    println!("dispatch_ended_proposal_notifications");
    let ended_notifications = client
        .notification()
        .find_many(vec![
            notification::dispatched::equals(false),
            notification::r#type::equals(NotificationType::EndedProposalTelegram),
        ])
        .exec()
        .await
        .unwrap();

    for ended_notification in ended_notifications {
        let new_notification = client
            .notification()
            .find_unique(notification::userid_proposalid_type(
                ended_notification.clone().userid,
                ended_notification.clone().proposalid,
                NotificationType::NewProposalTelegram,
            ))
            .exec()
            .await
            .unwrap();

        match new_notification {
            Some(new_notification) => {
                if new_notification.dispatched {
                    let user = client
                        .user()
                        .find_first(vec![user::id::equals(ended_notification.clone().userid)])
                        .exec()
                        .await
                        .unwrap()
                        .unwrap();

                    let proposal = client
                        .proposal()
                        .find_first(vec![proposal::id::equals(
                            ended_notification.clone().proposalid,
                        )])
                        .include(proposal_with_dao::include())
                        .exec()
                        .await
                        .unwrap()
                        .unwrap();

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
                        "{}{}",
                        shortner_url,
                        proposal
                            .id
                            .chars()
                            .rev()
                            .take(7)
                            .collect::<Vec<char>>()
                            .into_iter()
                            .rev()
                            .collect::<String>()
                    );

                    let voted =
                        get_vote(new_notification.userid, new_notification.proposalid, client)
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
                                if voted {"🟢 Voted"} else {"🔴 Did not vote"},
                                result,
                                short_url,
                                proposal.name
                                .replace("&", "&amp;")
                                .replace("<", "&lt;")
                                .replace(">", "&gt;")
                                .replace("\"", "&quot;")
                                .replace("'", "&#39;"),
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
                                if voted {"🟢 Voted"} else {"🔴 Did not vote"},
                                short_url,
                                proposal.name
                                .replace("&", "&amp;")
                                .replace("<", "&lt;")
                                .replace(">", "&gt;")
                                .replace("\"", "&quot;")
                                .replace("'", "&#39;"),
                            ),
                        ).disable_web_page_preview(true)
                        .await
                    };

                    match message {
                        Ok(msg) => {
                            client
                                .notification()
                                .update(
                                    notification::userid_proposalid_type(
                                        ended_notification.clone().userid,
                                        ended_notification.clone().proposalid,
                                        NotificationType::EndedProposalTelegram,
                                    ),
                                    vec![
                                        notification::dispatched::set(true),
                                        notification::telegramchatid::set(
                                            msg.chat.id.to_string().into(),
                                        ),
                                        notification::telegrammessageid::set(
                                            msg.id.to_string().into(),
                                        ),
                                    ],
                                )
                                .exec()
                                .await
                                .unwrap();
                        }
                        Err(e) => {
                            println!("ended error: {}", e)
                        }
                    }
                } else {
                    client
                        .notification()
                        .delete(notification::userid_proposalid_type(
                            ended_notification.userid,
                            ended_notification.proposalid,
                            NotificationType::EndedProposalTelegram,
                        ))
                        .exec()
                        .await
                        .unwrap();
                }
            }
            None => {}
        }

        sleep(Duration::from_millis(100)).await;
    }
}