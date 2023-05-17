use std::{sync::Arc, time::Duration};

use serenity::{
    http::Http,
    model::{prelude::Embed, webhook::Webhook},
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
                        .thumbnail(format!(
                            "https://www.senatelabs.xyz/{}_medium.png",
                            proposal.dao.picture
                        ))
                        .image("https://placehold.co/2000x1/png")
                })])
                .username("Senate Butler")
                .avatar_url("https://www.senatelabs.xyz/assets/Discord/Profile_picture.gif")
                .components(|c| {
                    c.create_action_row(|row| {
                        // An action row can only contain one select menu!
                        row.create_select_menu(|menu| {
                            menu.custom_id("vote_select");
                            menu.options(|f| {
                                f.create_option(|o| o.label("👍").value("Yay"));
                                f.create_option(|o| o.label("👎").value("Nay"))
                            })
                        })
                    })
                })
            })
            .await
            .expect("Could not execute webhook.");

        match message {
            Some(msg) => {
                client
                    .notification()
                    .update(
                        notification::userid_proposalid(user.id, proposal.id),
                        vec![
                            notification::dispatched::set(true),
                            notification::discordmessage::set(msg.link().into()),
                        ],
                    )
                    .exec()
                    .await
                    .unwrap();
            }
            None => {}
        }

        sleep(Duration::from_secs(1)).await;
    }
}
