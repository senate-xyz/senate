use std::{sync::Arc, time::Duration};

use serenity::{http::Http, model::webhook::Webhook};
use tokio::time::sleep;

use crate::prisma::{self, notification, user, NotificationType, PrismaClient};

prisma::proposal::include!(proposal_with_dao { dao daohandler });

pub async fn dispatch_ending_soon_notifications(client: &Arc<PrismaClient>) {
    let notifications = client
        .notification()
        .find_many(vec![
            notification::dispatched::equals(false),
            notification::r#type::in_vec(vec![
                NotificationType::Remaining1Discord,
                NotificationType::Remaining3Discord,
                NotificationType::Remaining6Discord,
                NotificationType::Remaining12Discord,
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

            let message = webhook
                .execute(&http, true, |w| {
                    w.content(format!(
                        "{} ends in {}",
                        new_notification.discordmessage.unwrap(),
                        match notification.r#type {
                            NotificationType::Remaining12Discord => "12 hours!",
                            NotificationType::Remaining6Discord => "6 hours!",
                            NotificationType::Remaining3Discord => "3 hours!",
                            NotificationType::Remaining1Discord => "1 hour!",
                            NotificationType::EndedProposalDiscord => todo!(),
                            NotificationType::QuorumNotReachedEmail => todo!(),
                            NotificationType::NewProposalDiscord => todo!(),
                        }
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
                                notification::discordmessage::set(msg.link().into()),
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
