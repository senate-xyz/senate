use std::{env, sync::Arc, time::Duration};

use serenity::{http::Http, model::webhook::Webhook};
use tokio::time::sleep;
use tracing::{debug_span, instrument, warn, Instrument};

use crate::{
    dispatch::new_proposals,
    prisma::{
        self,
        notification,
        proposal,
        user,
        DaoHandlerType,
        NotificationDispatchedState,
        NotificationType,
        PrismaClient,
    },
    utils::posthog::posthog_event,
};

use super::utils::notification_retry::update_notification_retry;

prisma::proposal::include!(proposal_with_dao { dao daohandler });

pub async fn dispatch_ending_soon_notifications(client: &Arc<PrismaClient>) {
    let notifications = client
        .notification()
        .find_many(vec![
            notification::dispatchstatus::in_vec(vec![
                NotificationDispatchedState::NotDispatched,
                NotificationDispatchedState::FirstRetry,
                NotificationDispatchedState::SecondRetry,
                NotificationDispatchedState::ThirdRetry,
            ]),
            notification::r#type::in_vec(vec![
                NotificationType::FirstReminderDiscord,
                NotificationType::SecondReminderDiscord,
            ]),
        ])
        .exec()
        .instrument(debug_span!("get_notifications"))
        .await
        .unwrap();

    for notification in notifications {
        let new_notification = client
            .notification()
            .find_first(vec![
                notification::userid::equals(notification.clone().userid),
                notification::proposalid::equals(notification.clone().proposalid),
                notification::r#type::equals(NotificationType::NewProposalDiscord),
            ])
            .exec()
            .instrument(debug_span!("get_notification"))
            .await
            .unwrap();

        let user = client
            .user()
            .find_first(vec![user::id::equals(notification.clone().userid)])
            .exec()
            .instrument(debug_span!("get_user"))
            .await
            .unwrap()
            .unwrap();

        let http = Http::new("");

        let webhook_response = Webhook::from_url(&http, user.discordwebhook.as_str()).await;

        let webhook = match webhook_response {
            Ok(w) => w,
            Err(e) => {
                warn!("{:?}", e);
                update_notification_retry(client, notification).await;
                continue;
            }
        };

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

        if proposal.is_none() {
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

            continue;
        }

        let shortner_url = match env::var_os("NEXT_PUBLIC_URL_SHORTNER") {
            Some(v) => v.into_string().unwrap(),
            None => panic!("$NEXT_PUBLIC_URL_SHORTNER is not set"),
        };

        let short_url = format!(
            "{}/{}/{}/{}",
            shortner_url,
            proposal
                .clone()
                .unwrap()
                .id
                .chars()
                .rev()
                .take(7)
                .collect::<Vec<char>>()
                .into_iter()
                .rev()
                .collect::<String>(),
            "d",
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

        let message_content = match notification.r#type {
            NotificationType::QuorumNotReachedEmail => todo!(),
            NotificationType::NewProposalDiscord => todo!(),
            NotificationType::FirstReminderDiscord => {
                format!(
                    "⌛ **{}** {} proposal {} **ends in 2️⃣4️⃣ hours.** 🕒 \nVote here 👉 <{}>",
                    proposal.clone().unwrap().dao.name,
                    if proposal.clone().unwrap().daohandler.r#type == DaoHandlerType::Snapshot {
                        "off-chain"
                    } else {
                        "on-chain"
                    },
                    match new_notification {
                        Some(new_notification) => new_notification
                            .discordmessagelink
                            .unwrap_or(proposal.clone().unwrap().name),
                        None => proposal.clone().unwrap().name,
                    },
                    short_url
                )
            }
            NotificationType::SecondReminderDiscord => {
                format!(
                    "🚨 **{}** {} proposal {} **ends in :six: hours.** 🕒 \nVote here 👉 <{}>",
                    proposal.clone().unwrap().dao.name,
                    if proposal.clone().unwrap().daohandler.r#type == DaoHandlerType::Snapshot {
                        "off-chain"
                    } else {
                        "on-chain"
                    },
                    match new_notification {
                        Some(new_notification) => new_notification
                            .discordmessagelink
                            .unwrap_or(proposal.clone().unwrap().name),
                        None => proposal.clone().unwrap().name,
                    },
                    short_url
                )
            }
            NotificationType::ThirdReminderDiscord => todo!(),
            NotificationType::EndedProposalDiscord => todo!(),
            NotificationType::NewProposalTelegram => todo!(),
            NotificationType::FirstReminderTelegram => todo!(),
            NotificationType::SecondReminderTelegram => todo!(),
            NotificationType::ThirdReminderTelegram => todo!(),
            NotificationType::EndedProposalTelegram => todo!(),
            NotificationType::BulletinEmail => todo!(),
        };

        let message = webhook
            .execute(&http, true, |w| {
                w.content(message_content)
                    .username("Senate Secretary")
                    .avatar_url("https://www.senatelabs.xyz/assets/Discord/Profile_picture.gif")
            })
            .instrument(debug_span!("send_message"))
            .await;

        let update_data = match message {
            Ok(msg) => {
                posthog_event(
                    "discord_ending_soon_notification",
                    user.address.unwrap(),
                    proposal.clone().unwrap().name,
                    proposal.clone().unwrap().dao.name,
                );

                vec![
                    notification::dispatchstatus::set(NotificationDispatchedState::Dispatched),
                    notification::discordmessagelink::set(msg.clone().unwrap().link().into()),
                    notification::discordmessageid::set(msg.clone().unwrap().id.to_string().into()),
                ]
            }
            Err(e) => {
                warn!("{:?}", e);

                posthog_event(
                    "discord_ending_soon_notification_fail",
                    user.address.unwrap(),
                    proposal.clone().unwrap().name,
                    proposal.clone().unwrap().dao.name,
                );

                match notification.dispatchstatus {
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
                }
            }
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

        sleep(Duration::from_millis(100)).await;
    }
}
