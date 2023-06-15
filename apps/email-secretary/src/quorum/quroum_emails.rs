use std::{env, sync::Arc};

use chrono::{Duration, Utc};
use log::info;
use num_format::{Locale, ToFormattedString};
use prisma_client_rust::bigdecimal::ToPrimitive;
use reqwest::header::{HeaderMap, ACCEPT, CONTENT_TYPE};
use serde::{Deserialize, Serialize};
use tracing::{debug, debug_span, instrument, Instrument};

use crate::{
    prisma::{
        self, dao,
        notification::{self},
        proposal, subscription, user, DaoHandlerType, MagicUserState, NotificationDispatchedState,
        NotificationType,
    },
    utils::{countdown::countdown_gif, vote::get_vote},
};

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug, Clone)]
struct EmailBody {
    To: String,
    From: String,
    TemplateAlias: String,
    TemplateModel: QuorumWarningData,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug, Clone)]
struct QuorumWarningData {
    daoName: String,
    chain: String,
    daoLogoUrl: String,
    proposalName: String,
    countdownUrl: String,
    voteUrl: String,
    currentQuorum: String,
    requiredQuroum: String,
}

prisma::proposal::include!(proposal_with_dao { dao });
prisma::user::include!(user_with_voters_and_subscriptions { subscriptions voters});

#[instrument(skip(db), level = "info")]
pub async fn send_quorum_email(db: &Arc<prisma::PrismaClient>) {
    generate_quorum_notifications(db).await;

    dispatch_quorum_notifications(db).await;
}

#[instrument(skip(db), level = "info")]
pub async fn dispatch_quorum_notifications(db: &Arc<prisma::PrismaClient>) {
    let notifications = db
        .notification()
        .find_many(vec![
            notification::r#type::equals(NotificationType::QuorumNotReachedEmail),
            notification::dispatchstatus::in_vec(vec![
                NotificationDispatchedState::NotDispatched,
                NotificationDispatchedState::FirstRetry,
                NotificationDispatchedState::SecondRetry,
                NotificationDispatchedState::ThirdRetry,
            ]),
        ])
        .exec()
        .instrument(debug_span!("get_notifications"))
        .await
        .unwrap();

    for notification in notifications {
        let proposal = db
            .proposal()
            .find_first(vec![proposal::id::equals(
                notification.clone().proposalid.unwrap(),
            )])
            .include(proposal::include!({ dao daohandler }))
            .exec()
            .instrument(debug_span!("get_proposal"))
            .await
            .unwrap();

        match proposal {
            Some(proposal) => {
                let user = db
                    .user()
                    .find_first(vec![user::id::equals(notification.clone().userid)])
                    .exec()
                    .instrument(debug_span!("get_user"))
                    .await
                    .unwrap()
                    .unwrap();

                let quorum_template = if proposal.dao.name == "Aave" {
                    "aave-quorum"
                } else if proposal.dao.name == "Uniswap" {
                    "uniswap-quorum"
                } else {
                    "senate-quorum"
                };

                let countdown_url = countdown_gif(proposal.timeend.into(), false).await.unwrap();

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

                let data = QuorumWarningData {
                    daoName: proposal.dao.name,
                    chain: if proposal.daohandler.r#type == DaoHandlerType::Snapshot {
                        "off-chain".to_string()
                    } else {
                        "on-chain".to_string()
                    },
                    daoLogoUrl: format!(
                        "{}{}{}",
                        "https://senatelabs.xyz", proposal.dao.picture, "_medium.png"
                    ),
                    proposalName: proposal.name,
                    countdownUrl: countdown_url,
                    voteUrl: short_url,
                    currentQuorum: if proposal.daohandler.r#type == DaoHandlerType::Snapshot {
                        proposal
                            .scorestotal
                            .as_f64()
                            .unwrap()
                            .round()
                            .to_i128()
                            .unwrap()
                            .to_formatted_string(&Locale::en)
                    } else {
                        (proposal
                            .scorestotal
                            .as_f64()
                            .unwrap()
                            .round()
                            .to_i128()
                            .unwrap()
                            / 1000000000000000000)
                            .to_formatted_string(&Locale::en)
                    },
                    requiredQuroum: if proposal.daohandler.r#type == DaoHandlerType::Snapshot {
                        proposal
                            .quorum
                            .as_f64()
                            .unwrap()
                            .round()
                            .to_i128()
                            .unwrap()
                            .to_formatted_string(&Locale::en)
                    } else {
                        (proposal.quorum.as_f64().unwrap().round().to_i128().unwrap()
                            / 1000000000000000000)
                            .to_formatted_string(&Locale::en)
                    },
                };

                if user.email.is_some() {
                    let content = &EmailBody {
                        To: user.email.unwrap(),
                        From: "info@senatelabs.xyz".to_string(),
                        TemplateAlias: quorum_template.to_string(),
                        TemplateModel: data.clone(),
                    };

                    debug!("{:?}", content);

                    let client = reqwest::Client::new();
                    let mut headers = HeaderMap::new();
                    headers.insert(ACCEPT, "application/json".parse().unwrap());
                    headers.insert(CONTENT_TYPE, "application/json".parse().unwrap());
                    headers.insert(
                        "X-Postmark-Server-Token",
                        env::var("POSTMARK_TOKEN")
                            .expect("Missing Postmark Token")
                            .parse()
                            .unwrap(),
                    );
                    let response = client
                        .post("https://api.postmarkapp.com/email/withTemplate")
                        .headers(headers)
                        .json(content)
                        .send()
                        .instrument(debug_span!("send_email"))
                        .await;

                    let update_data = match response {
                        Ok(_) => {
                            let mut event =
                                posthog_rs::Event::new("sent_quorum_email", user.address.as_str());
                            event.insert_prop("type", quorum_template).unwrap();

                            posthog_rs::client(
                                env::var("NEXT_PUBLIC_POSTHOG_KEY")
                                    .expect("$NEXT_PUBLIC_POSTHOG_KEY is not set")
                                    .as_str(),
                            )
                            .capture(event)
                            .unwrap();

                            vec![notification::dispatchstatus::set(
                                NotificationDispatchedState::Dispatched,
                            )]
                        }
                        Err(_) => {
                            let mut event =
                                posthog_rs::Event::new("fail_quorum_email", user.address.as_str());
                            event.insert_prop("type", quorum_template).unwrap();

                            posthog_rs::client(
                                env::var("NEXT_PUBLIC_POSTHOG_KEY")
                                    .expect("$NEXT_PUBLIC_POSTHOG_KEY is not set")
                                    .as_str(),
                            )
                            .capture(event)
                            .unwrap();
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

                    db.notification()
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
                        .unwrap()
                } else {
                    db.notification()
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
                        .unwrap()
                }
            }
            None => db
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
                .unwrap(),
        };
    }
}

#[instrument(skip(db), level = "info")]
pub async fn generate_quorum_notifications(db: &Arc<prisma::PrismaClient>) {
    let proposals_ending_soon = db
        .proposal()
        .find_many(vec![
            proposal::timeend::gt(Utc::now().into()),
            proposal::timeend::lte((Utc::now() + Duration::hours(12)).into()),
        ])
        .include(proposal_with_dao::include())
        .exec()
        .instrument(debug_span!("get_proposals"))
        .await
        .unwrap();

    let proposals_ending_no_quorum: Vec<_> = proposals_ending_soon
        .iter()
        .filter(|&p| p.quorum.as_f64().unwrap() > p.scorestotal.as_f64().unwrap())
        .collect();

    for proposal in proposals_ending_no_quorum.iter() {
        if proposal.dao.quorumwarningemail {
            let subscriptions = db
                .subscription()
                .find_many(vec![subscription::daoid::equals(
                    proposal.daoid.to_string(),
                )])
                .include(subscription::include!({ user dao }))
                .exec()
                .instrument(debug_span!("get_subscriptions"))
                .await
                .unwrap();

            let subscriptions_with_email: Vec<_> = subscriptions
                .iter()
                .filter(|s| {
                    s.user.verifiedaddress
                        && s.user.verifiedemail
                        && s.user.email.clone().unwrap().len() > 0
                })
                .collect();

            for sub in subscriptions_with_email.iter() {
                let voted = get_vote(sub.userid.clone(), proposal.id.clone(), &db)
                    .await
                    .unwrap();
                if sub.dao.quorumwarningemail && !voted {
                    db.notification()
                        .create_many(vec![notification::create_unchecked(
                            sub.userid.to_string(),
                            NotificationType::QuorumNotReachedEmail,
                            vec![notification::proposalid::set(proposal.id.clone().into())],
                        )])
                        .skip_duplicates()
                        .exec()
                        .instrument(debug_span!("create_notifications"))
                        .await
                        .unwrap();
                }
            }
        }
    }
}
