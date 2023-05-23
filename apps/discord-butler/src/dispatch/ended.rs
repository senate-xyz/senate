use std::{cmp::Ordering, env, result, sync::Arc, time::Duration};

use prisma_client_rust::bigdecimal::ToPrimitive;
use serenity::{
    http::Http,
    model::{
        prelude::{Embed, MessageId},
        webhook::Webhook,
    },
    utils::Colour,
};
use tokio::time::sleep;

use crate::{
    prisma::{self, notification, proposal, user, DaoHandlerType, NotificationType, PrismaClient},
    utils::vote::get_vote,
};

prisma::proposal::include!(proposal_with_dao { dao daohandler });

pub async fn dispatch_ended_proposal_notifications(client: &Arc<PrismaClient>) {
    println!("dispatch_ended_proposal_notifications");
    let ended_notifications = client
        .notification()
        .find_many(vec![
            notification::dispatched::equals(false),
            notification::r#type::equals(NotificationType::EndedProposalDiscord),
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
                NotificationType::NewProposalDiscord,
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

                    let initial_message_id: u64 =
                        new_notification.discordmessageid.unwrap().parse().unwrap();

                    let http = Http::new("");

                    let webhook = Webhook::from_url(&http, user.discordwebhook.as_str())
                        .await
                        .expect("Missing webhook");

                    let (result_index, max_score) = proposal
                        .scores
                        .as_array()
                        .unwrap()
                        .iter()
                        .map(|score| score.as_f64().unwrap())
                        .enumerate()
                        .max_by(|(_, a), (_, b)| a.partial_cmp(b).unwrap_or(Ordering::Equal))
                        .unwrap();

                    let message_content = if proposal.scorestotal.as_f64()
                        > proposal.quorum.as_f64()
                    {
                        format!(
                            "☑️ **{}** {}%",
                            &proposal.choices.as_array().unwrap()[result_index]
                                .as_str()
                                .unwrap(),
                            (max_score / proposal.scorestotal.as_f64().unwrap() * 100.0).round()
                        )
                    } else {
                        format!("🇽 No Quorum",)
                    };

                    let voted =
                        get_vote(new_notification.userid, new_notification.proposalid, client)
                            .await
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

                    webhook
                        .edit_message(&http, MessageId::from(initial_message_id), |w| {
                            w.embeds(vec![Embed::fake(|e| {
                                e.title(proposal.name)
                                    .description(format!(
                                        "**{}** {} proposal ended on {}",
                                        proposal.dao.name,
                                        if proposal.daohandler.r#type == DaoHandlerType::Snapshot {
                                            "off-chain"
                                        } else {
                                            "on-chain"
                                        },
                                        format!("{}", proposal.timeend.format("%B %e").to_string())
                                    ))
                                    .field("", message_content, false)
                                    .url(short_url)
                                    .color(Colour(0x23272A))
                                    .thumbnail(format!(
                                        "https://www.senatelabs.xyz/{}_medium.png",
                                        proposal.dao.picture
                                    ))
                                    .image(if voted {
                                        "https://senatelabs.xyz/assets/Discord/past-vote2x.png"
                                    } else {
                                        "https://senatelabs.xyz/assets/Discord/past-no-vote2x.png"
                                    })
                            })])
                        })
                        .await
                        .unwrap();

                    let message = webhook
                        .execute(&http, true, |w| {
                            w.content(format!(
                                "🗳️ **{}** {} proposal {} **just ended.** ☑️",
                                proposal.dao.name,
                                if proposal.daohandler.r#type == DaoHandlerType::Snapshot {
                                    "off-chain"
                                } else {
                                    "on-chain"
                                },
                                new_notification.discordmessagelink.unwrap(),
                            ))
                            .username("Senate Butler")
                            .avatar_url(
                                "https://www.senatelabs.xyz/assets/Discord/Profile_picture.gif",
                            )
                        })
                        .await
                        .expect("Could not execute webhook.");

                    match message {
                        Some(msg) => {
                            client
                                .notification()
                                .update(
                                    notification::userid_proposalid_type(
                                        ended_notification.clone().userid,
                                        ended_notification.clone().proposalid,
                                        NotificationType::EndedProposalDiscord,
                                    ),
                                    vec![
                                        notification::dispatched::set(true),
                                        notification::discordmessagelink::set(msg.link().into()),
                                        notification::discordmessageid::set(
                                            msg.id.to_string().into(),
                                        ),
                                    ],
                                )
                                .exec()
                                .await
                                .unwrap();
                        }
                        None => {}
                    }
                } else {
                    client
                        .notification()
                        .delete(notification::userid_proposalid_type(
                            ended_notification.userid,
                            ended_notification.proposalid,
                            NotificationType::EndedProposalDiscord,
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
