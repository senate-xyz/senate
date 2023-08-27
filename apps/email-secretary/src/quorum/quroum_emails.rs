use std::{collections::HashMap, env, sync::Arc};

use anyhow::{bail, Result};
use chrono::{Duration, Utc};
use log::info;
use num_format::{Locale, ToFormattedString};
use prisma_client_rust::bigdecimal::ToPrimitive;
use reqwest::header::{HeaderMap, ACCEPT, CONTENT_TYPE};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use tokio::task::spawn_blocking;
use tracing::{debug, debug_span, event, instrument, warn, Instrument, Level};

use crate::{
    prisma::{
        self,
        dao,
        notification::{self},
        proposal,
        subscription,
        user,
        DaoHandlerType,
        MagicUserState,
        NotificationDispatchedState,
        NotificationType,
        ProposalState,
    },
    utils::{countdown::countdown_gif, posthog::posthog_quorum_event, vote::get_vote},
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
    env: Option<Value>,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug, Clone)]
struct PostmarkResult {
    Message: String,
    MessageID: Option<String>,
}

prisma::proposal::include!(proposal_with_dao { dao });
prisma::user::include!(user_with_voters_and_subscriptions { subscriptions voters });

#[instrument(skip(db))]
pub async fn send_quorum_email(db: &Arc<prisma::PrismaClient>) -> Result<()> {
    let _ = generate_quorum_notifications(db).await;
    let _ = dispatch_quorum_notifications(db).await;

    Ok(())
}

#[instrument(skip(db))]
pub async fn dispatch_quorum_notifications(db: &Arc<prisma::PrismaClient>) -> Result<()> {
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
        .await?;

    for notification in notifications {
        let proposal = db
            .proposal()
            .find_first(vec![proposal::id::equals(
                notification.clone().proposalid.unwrap(),
            )])
            .include(proposal::include!({
                dao
                daohandler
            }))
            .exec()
            .await?;

        let user = db
            .user()
            .find_first(vec![user::id::equals(notification.clone().userid)])
            .exec()
            .await?
            .unwrap();

        if user.email.is_none() || proposal.is_none() {
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
                .await?;

            continue;
        }

        let quorum_template = if proposal.clone().unwrap().dao.name == "Aave" {
            "aave-quorum"
        } else if proposal.clone().unwrap().dao.name == "Uniswap" {
            "uniswap-quorum"
        } else {
            "senate-quorum"
        };

        let countdown_url = countdown_gif(proposal.clone().unwrap().timeend.into(), false)
            .await
            .unwrap();

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
            "q",
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

        let exec_env = env::var("EXEC_ENV").expect("$EXEC_ENV is not set");
        let data = QuorumWarningData {
            daoName: proposal.clone().unwrap().dao.name,
            chain: if proposal.clone().unwrap().daohandler.r#type == DaoHandlerType::Snapshot {
                "off-chain".to_string()
            } else {
                "on-chain".to_string()
            },
            daoLogoUrl: format!(
                "{}/{}{}",
                env::var_os("NEXT_PUBLIC_WEB_URL")
                    .unwrap()
                    .into_string()
                    .unwrap(),
                proposal.clone().unwrap().dao.picture,
                "_medium.png"
            ),
            proposalName: proposal.clone().unwrap().name,
            countdownUrl: countdown_url,
            voteUrl: short_url,
            currentQuorum: if proposal.clone().unwrap().daohandler.r#type
                == DaoHandlerType::Snapshot
            {
                proposal
                    .clone()
                    .unwrap()
                    .scorestotal
                    .as_f64()
                    .unwrap()
                    .round()
                    .to_i128()
                    .unwrap()
                    .to_formatted_string(&Locale::en)
            } else {
                (proposal
                    .clone()
                    .unwrap()
                    .scorestotal
                    .as_f64()
                    .unwrap()
                    .round()
                    .to_i128()
                    .unwrap()
                    / 1000000000000000000)
                    .to_formatted_string(&Locale::en)
            },
            requiredQuroum: if proposal.clone().unwrap().daohandler.r#type
                == DaoHandlerType::Snapshot
            {
                proposal
                    .clone()
                    .unwrap()
                    .quorum
                    .as_f64()
                    .unwrap()
                    .round()
                    .to_i128()
                    .unwrap()
                    .to_formatted_string(&Locale::en)
            } else {
                (proposal
                    .clone()
                    .unwrap()
                    .quorum
                    .as_f64()
                    .unwrap()
                    .round()
                    .to_i128()
                    .unwrap()
                    / 1000000000000000000)
                    .to_formatted_string(&Locale::en)
            },
            env: if exec_env == "prod" {
                None
            } else {
                Some(json!({ "env": exec_env }))
            },
        };

        let content = &EmailBody {
            To: user.email.clone().unwrap(),
            From: "info@senatelabs.xyz".to_string(),
            TemplateAlias: quorum_template.to_string(),
            TemplateModel: data.clone(),
        };

        event!(
            Level::INFO,
            to = user.email.unwrap(),
            from = "info@senatelabs.xyz".to_string(),
            template_alias = quorum_template.to_string(),
            "email body"
        );

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
            .await;

        match response {
            Ok(response) => {
                let result: Result<PostmarkResult, reqwest::Error> = response.json().await;
                match result {
                    Ok(postmark_result) => {
                        if postmark_result.Message == "OK" {
                            db.notification()
                                .update_many(
                                    vec![
                                        notification::userid::equals(notification.clone().userid),
                                        notification::proposalid::equals(
                                            notification.clone().proposalid,
                                        ),
                                        notification::r#type::equals(notification.clone().r#type),
                                    ],
                                    vec![
                                        notification::dispatchstatus::set(
                                            NotificationDispatchedState::Dispatched,
                                        ),
                                        notification::emailmessageid::set(
                                            postmark_result.clone().MessageID,
                                        ),
                                        notification::emailtemplate::set(
                                            quorum_template.to_string().into(),
                                        ),
                                    ],
                                )
                                .exec()
                                .await?;

                            spawn_blocking(move || {
                                posthog_quorum_event(
                                    "email_quorum_sent",
                                    user.address.unwrap(),
                                    quorum_template,
                                    proposal.clone().unwrap().name,
                                    proposal.clone().unwrap().dao.name,
                                    postmark_result.MessageID.unwrap().as_str(),
                                );
                            })
                            .await?;
                        } else {
                            event!(
                                Level::WARN,
                                err = postmark_result.Message,
                                "email failed to send"
                            );

                            spawn_blocking(move || {
                                posthog_quorum_event(
                                    "email_quorum_fail",
                                    user.address.unwrap(),
                                    quorum_template,
                                    proposal.clone().unwrap().name,
                                    proposal.unwrap().dao.name,
                                    postmark_result.Message.as_str(),
                                );
                            })
                            .await?;

                            db.notification()
                                .update_many(
                                    vec![
                                        notification::userid::equals(notification.clone().userid),
                                        notification::proposalid::equals(
                                            notification.clone().proposalid,
                                        ),
                                        notification::r#type::equals(notification.clone().r#type),
                                    ],
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
                                    },
                                )
                                .exec()
                                .await?;
                        }
                    }
                    Err(e) => {
                        event!(Level::WARN, err = e.to_string(), "email failed to send");

                        spawn_blocking(move || {
                            posthog_quorum_event(
                                "email_quorum_fail",
                                user.address.unwrap(),
                                quorum_template,
                                proposal.clone().unwrap().name,
                                proposal.unwrap().dao.name,
                                "",
                            );
                        })
                        .await?;

                        db.notification()
                            .update_many(
                                vec![
                                    notification::userid::equals(notification.clone().userid),
                                    notification::proposalid::equals(
                                        notification.clone().proposalid,
                                    ),
                                    notification::r#type::equals(notification.clone().r#type),
                                ],
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
                                },
                            )
                            .exec()
                            .await?;
                    }
                }
            }
            Err(e) => {
                event!(Level::WARN, err = e.to_string(), "email failed to send");

                spawn_blocking(move || {
                    posthog_quorum_event(
                        "email_quorum_fail",
                        user.address.unwrap(),
                        quorum_template,
                        proposal.clone().unwrap().name,
                        proposal.unwrap().dao.name,
                        "",
                    );
                })
                .await?;

                db.notification()
                    .update_many(
                        vec![
                            notification::userid::equals(notification.clone().userid),
                            notification::proposalid::equals(notification.clone().proposalid),
                            notification::r#type::equals(notification.clone().r#type),
                        ],
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
                        },
                    )
                    .exec()
                    .await?;
            }
        };
    }
    Ok(())
}

#[instrument(skip(db))]
pub async fn generate_quorum_notifications(db: &Arc<prisma::PrismaClient>) -> Result<()> {
    let proposals_ending_soon = db
        .proposal()
        .find_many(vec![
            proposal::timeend::gt(Utc::now().into()),
            proposal::timeend::lte((Utc::now() + Duration::hours(12)).into()),
            proposal::state::not_in_vec(vec![ProposalState::Canceled]),
            proposal::visible::equals(true),
        ])
        .include(proposal_with_dao::include())
        .exec()
        .await?;

    let proposals_to_send_notifications: Vec<_> = proposals_ending_soon
        .iter()
        .filter(|&p| {
            p.quorum.as_f64().unwrap() > p.scorestotal.as_f64().unwrap()
                && p.dao.quorumwarningemailsupport
        })
        .collect();

    for proposal in proposals_to_send_notifications.iter() {
        let subscriptions = db
            .subscription()
            .find_many(vec![subscription::daoid::equals(
                proposal.daoid.to_string(),
            )])
            .include(subscription::include!({
                user
                dao
            }))
            .exec()
            .await?;

        let subscriptions_with_email: Vec<_> = subscriptions
            .iter()
            .filter(|s| {
                s.user.verifiedaddress
                    && s.user.verifiedemail
                    && s.user.emaildailybulletin
                    && s.user.emailquorumwarning
                    && s.user.email.clone().unwrap().contains('@')
            })
            .collect();

        for sub in subscriptions_with_email.iter() {
            let voted = get_vote(sub.userid.clone(), proposal.id.clone(), db).await?;
            if !voted {
                db.notification()
                    .create_many(vec![notification::create_unchecked(
                        sub.userid.to_string(),
                        NotificationType::QuorumNotReachedEmail,
                        vec![notification::proposalid::set(proposal.id.clone().into())],
                    )])
                    .skip_duplicates()
                    .exec()
                    .await?;
            }
        }
    }
    Ok(())
}
