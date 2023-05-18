use std::{sync::Arc, time::Duration};

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
            .unwrap()
            .unwrap();

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

            webhook
                .edit_message(&http, MessageId::from(initial_message_id), |w| {
                    w.embeds(vec![Embed::fake(|e| {
                        e.title(proposal.name)
                            .description(format!(
                                "**{}** {} proposal ended with results {}",
                                proposal.dao.name,
                                if proposal.daohandler.r#type == DaoHandlerType::Snapshot {
                                    "off-chain"
                                } else {
                                    "on-chain"
                                },
                                proposal.scores
                            ))
                            .url(proposal.url)
                            .color(Colour::DARK_GREEN)
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
                    .avatar_url("https://www.senatelabs.xyz/assets/Discord/Profile_picture.gif")
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
                                notification::discordmessageid::set(msg.id.to_string().into()),
                            ],
                        )
                        .exec()
                        .await
                        .unwrap();
                }
                None => {}
            }
        }

        sleep(Duration::from_millis(100)).await;
    }
}
