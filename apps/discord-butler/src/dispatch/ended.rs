use std::{sync::Arc, time::Duration};

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

use crate::prisma::{
    self,
    notification,
    proposal,
    user,
    DaoHandlerType,
    NotificationType,
    PrismaClient,
};

prisma::proposal::include!(proposal_with_dao { dao daohandler });

pub async fn dispatch_ended_proposal_notifications(client: &Arc<PrismaClient>) {
    let notifications = client
        .notification()
        .find_many(vec![
            notification::dispatched::equals(false),
            notification::r#type::equals(NotificationType::EndedProposalDiscord),
        ])
        .exec()
        .await
        .unwrap();

    for notification in notifications {
        let new_notification = client
            .notification()
            .find_unique(notification::userid_proposalid_type(
                notification.clone().userid,
                notification.clone().proposalid,
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
                        .find_first(vec![user::id::equals(notification.clone().userid)])
                        .exec()
                        .await
                        .unwrap()
                        .unwrap();

                    let proposal = client
                        .proposal()
                        .find_first(vec![proposal::id::equals(notification.clone().proposalid)])
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

                    let result_index = match proposal
                        .scores
                        .as_array()
                        .unwrap()
                        .iter()
                        .enumerate()
                        .max_by_key(|&(_index, item)| {
                            item.as_f64().unwrap().to_u64().unwrap_or(std::u64::MIN)
                        }) {
                        Some((index, _)) => index,
                        None => 0,
                    };

                    let message_content =
                        if proposal.scorestotal.as_f64() > proposal.quorum.as_f64() {
                            format!(
                                "☑️ **{}** {}%",
                                &proposal.choices.as_array().unwrap()[result_index]
                                    .as_str()
                                    .unwrap(),
                                proposal.scores.as_array().unwrap()[result_index]
                                    .as_f64()
                                    .unwrap()
                                    / proposal.scorestotal.as_f64().unwrap()
                                    * 100.0
                            )
                        } else {
                            format!("🇽 No Quorum",)
                        };

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
                                    .url(proposal.url)
                                    .color(Colour(0x23272A))
                                    .thumbnail(format!(
                                        "https://www.senatelabs.xyz/{}_medium.png",
                                        proposal.dao.picture
                                    ))
                                    .image("https://placehold.co/2000x1/png")
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
                                        notification.clone().userid,
                                        notification.clone().proposalid,
                                        notification.clone().r#type,
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
                }
            }
            None => {}
        }

        sleep(Duration::from_millis(100)).await;
    }
}
