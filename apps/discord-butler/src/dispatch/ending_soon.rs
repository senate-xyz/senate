use std::{env, sync::Arc, time::Duration};

use serenity::{http::Http, model::webhook::Webhook};
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

pub async fn dispatch_ending_soon_notifications(client: &Arc<PrismaClient>) {
    println!("dispatch_ending_soon_notifications");
    let notifications = client
        .notification()
        .find_many(vec![
            notification::dispatched::equals(false),
            notification::r#type::in_vec(vec![
                NotificationType::FirstReminderDiscord,
                NotificationType::SecondReminderDiscord,
            ]),
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

            let http = Http::new("");

            let webhook = Webhook::from_url(&http, user.discordwebhook.as_str())
                .await
                .expect("Missing webhook");

            let proposal = client
                .proposal()
                .find_first(vec![proposal::id::equals(notification.clone().proposalid)])
                .include(proposal_with_dao::include())
                .exec()
                .await
                .unwrap()
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

            let message_content = match notification.r#type {
                NotificationType::QuorumNotReachedEmail => todo!(),
                NotificationType::NewProposalDiscord => todo!(),
                NotificationType::FirstReminderDiscord => {
                    format!(
                        "⌛ **{}** {} proposal {} **ends in 2️⃣4️⃣ hours.** 🕒 \nVote here 👉 <{}>",
                        proposal.dao.name,
                        if proposal.daohandler.r#type == DaoHandlerType::Snapshot {
                            "off-chain"
                        } else {
                            "on-chain"
                        },
                        new_notification.discordmessagelink.unwrap(),
                        short_url
                    )
                }
                NotificationType::SecondReminderDiscord => {
                    format!(
                        "🚨 **{}** {} proposal {} **ends in :six: hours.** 🕒 \nVote here 👉 <{}>",
                        proposal.dao.name,
                        if proposal.daohandler.r#type == DaoHandlerType::Snapshot {
                            "off-chain"
                        } else {
                            "on-chain"
                        },
                        new_notification.discordmessagelink.unwrap(),
                        short_url
                    )
                }
                NotificationType::ThirdReminderDiscord => todo!(),
                NotificationType::EndedProposalDiscord => todo!(),
            };

            let message = webhook
                .execute(&http, true, |w| {
                    w.content(message_content)
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
