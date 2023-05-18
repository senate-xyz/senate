use std::{sync::Arc, time::Duration};

use serenity::{
    http::Http,
    model::{prelude::Embed, webhook::Webhook},
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

pub async fn dispatch_new_proposal_notifications(client: &Arc<PrismaClient>) {
    let notifications = client
        .notification()
        .find_many(vec![
            notification::dispatched::equals(false),
            notification::r#type::equals(NotificationType::NewProposalDiscord),
        ])
        .exec()
        .await
        .unwrap();

    for notification in notifications {
        let user = client
            .user()
            .find_first(vec![user::id::equals(notification.userid)])
            .exec()
            .await
            .unwrap()
            .unwrap();

        let proposal = client
            .proposal()
            .find_first(vec![proposal::id::equals(notification.proposalid)])
            .include(proposal_with_dao::include())
            .exec()
            .await
            .unwrap()
            .unwrap();

        let http = Http::new("");

        let webhook = Webhook::from_url(&http, user.discordwebhook.as_str())
            .await
            .expect("Missing webhook");

        let message = webhook
            .execute(&http, true, |w| {
                w.embeds(vec![Embed::fake(|e| {
                    e.title(proposal.name)
                        .description(format!(
                            "**{}** {} proposal ending <t:{}:R>",
                            proposal.dao.name,
                            if proposal.daohandler.r#type == DaoHandlerType::Snapshot {
                                "off-chain"
                            } else {
                                "on-chain"
                            },
                            proposal.timeend.timestamp()
                        ))
                        .url(proposal.url)
                        .color(Colour::RED)
                        .thumbnail(format!(
                            "https://www.senatelabs.xyz/{}_medium.png",
                            proposal.dao.picture
                        ))
                        .image("https://placehold.co/2000x1/png")
                })])
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
                            user.id,
                            proposal.id,
                            NotificationType::NewProposalDiscord,
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

        sleep(Duration::from_millis(100)).await;
    }
}
