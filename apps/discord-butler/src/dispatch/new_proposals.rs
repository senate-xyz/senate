use std::{sync::Arc, time::Duration};

use serenity::{
    http::Http,
    model::{prelude::Embed, webhook::Webhook},
    utils::Colour,
};
use tokio::time::sleep;

use crate::{
    prisma::{self, notification, proposal, user, DaoHandlerType, NotificationType, PrismaClient},
    utils::vote::get_vote,
};

prisma::proposal::include!(proposal_with_dao { dao daohandler });

pub async fn dispatch_new_proposal_notifications(client: &Arc<PrismaClient>) {
    println!("dispatch_new_proposal_notifications");
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

        let voted = get_vote(user.clone().id, proposal.clone().id, client)
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

        let message = webhook
            .execute(&http, true, |w| {
                w.embeds(vec![Embed::fake(|e| {
                    e.title(proposal.name)
                        .description(format!(
                            "**{}** {} proposal ending **<t:{}:R>**",
                            proposal.dao.name,
                            if proposal.daohandler.r#type == DaoHandlerType::Snapshot {
                                "off-chain"
                            } else {
                                "on-chain"
                            },
                            proposal.timeend.timestamp()
                        ))
                        .url(short_url)
                        .color(Colour(0xFFFFFF))
                        .thumbnail(format!(
                            "https://www.senatelabs.xyz/{}_medium.png",
                            proposal.dao.picture
                        ))
                        .image(if voted {
                            "https://senatelabs.xyz/assets/Discord/active-vote2x.png"
                        } else {
                            "https://senatelabs.xyz/assets/Discord/active-no-vote2x.png"
                        })
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
