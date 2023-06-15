use std::{env, sync::Arc, time::Duration};

use serenity::{
    http::Http,
    model::{prelude::Embed, webhook::Webhook},
    utils::Colour,
};
use tokio::time::sleep;
use tracing::{debug_span, instrument, Instrument};

use crate::{
    prisma::{
        self, notification, proposal, user, DaoHandlerType, NotificationDispatchedState,
        NotificationType, PrismaClient,
    },
    utils::vote::get_vote,
};

prisma::proposal::include!(proposal_with_dao { dao daohandler });

pub async fn dispatch_new_proposal_notifications(client: &Arc<PrismaClient>) {
    let notifications = client
        .notification()
        .find_many(vec![
            notification::dispatchedstatus::in_vec(vec![
                NotificationDispatchedState::NotDispatched,
                NotificationDispatchedState::FirstRetry,
                NotificationDispatchedState::SecondRetry,
                NotificationDispatchedState::ThirdRetry,
            ]),
            notification::r#type::equals(NotificationType::NewProposalDiscord),
        ])
        .exec()
        .instrument(debug_span!("get_notifications"))
        .await
        .unwrap();

    for notification in notifications {
        let user = client
            .user()
            .find_first(vec![user::id::equals(notification.clone().userid)])
            .exec()
            .instrument(debug_span!("get_user"))
            .await
            .unwrap()
            .unwrap();

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

        match proposal {
            Some(proposal) => {
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
                        .username("Senate Secretary")
                        .avatar_url("https://www.senatelabs.xyz/assets/Discord/Profile_picture.gif")
                    })
                    .instrument(debug_span!("send_message"))
                    .await;

                let update_data = match message {
                    Ok(msg) => {
                        vec![
                            notification::dispatchedstatus::set(
                                NotificationDispatchedState::Dispatched,
                            ),
                            notification::discordmessagelink::set(
                                msg.clone().unwrap().link().into(),
                            ),
                            notification::discordmessageid::set(
                                msg.clone().unwrap().id.to_string().into(),
                            ),
                        ]
                    }
                    Err(_) => match notification.dispatchedstatus {
                        NotificationDispatchedState::NotDispatched => {
                            vec![notification::dispatchedstatus::set(
                                NotificationDispatchedState::FirstRetry,
                            )]
                        }
                        NotificationDispatchedState::FirstRetry => {
                            vec![notification::dispatchedstatus::set(
                                NotificationDispatchedState::SecondRetry,
                            )]
                        }
                        NotificationDispatchedState::SecondRetry => {
                            vec![notification::dispatchedstatus::set(
                                NotificationDispatchedState::ThirdRetry,
                            )]
                        }
                        NotificationDispatchedState::ThirdRetry => {
                            vec![notification::dispatchedstatus::set(
                                NotificationDispatchedState::Failed,
                            )]
                        }
                        NotificationDispatchedState::Dispatched => todo!(),
                        NotificationDispatchedState::Deleted => todo!(),
                        NotificationDispatchedState::Failed => todo!(),
                    },
                };

                client
                    .notification()
                    .update_many(
                        vec![
                            notification::userid::equals(user.id),
                            notification::proposalid::equals(proposal.id.into()),
                            notification::r#type::equals(NotificationType::NewProposalDiscord),
                        ],
                        update_data,
                    )
                    .exec()
                    .instrument(debug_span!("update_notification"))
                    .await
                    .unwrap();

                sleep(Duration::from_millis(100)).await;
            }
            None => {
                client
                    .notification()
                    .update_many(
                        vec![
                            notification::userid::equals(notification.clone().userid),
                            notification::proposalid::equals(notification.clone().proposalid),
                            notification::r#type::equals(NotificationType::NewProposalDiscord),
                        ],
                        vec![notification::dispatchedstatus::set(
                            NotificationDispatchedState::Deleted,
                        )],
                    )
                    .exec()
                    .instrument(debug_span!("update_notification"))
                    .await
                    .unwrap();
            }
        }
    }
}
