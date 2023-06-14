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
        notification::{self, dispatched::not},
        proposal, subscription, user, DaoHandlerType, MagicUserState, NotificationType,
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
            notification::dispatched::equals(false),
        ])
        .exec()
        .instrument(debug_span!("get_notifications"))
        .await
        .unwrap();

    for notification in notifications {
        let proposal = db
            .proposal()
            .find_first(vec![proposal::id::equals(notification.clone().proposalid)])
            .include(proposal::include!({ dao daohandler }))
            .exec()
            .instrument(debug_span!("get_proposal"))
            .await
            .unwrap()
            .unwrap();

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
                (proposal.quorum.as_f64().unwrap().round().to_i128().unwrap() / 1000000000000000000)
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
            client
                .post("https://api.postmarkapp.com/email/withTemplate")
                .headers(headers)
                .json(content)
                .send()
                .instrument(debug_span!("send_email"))
                .await
                .unwrap();
        }

        let _ = db
            .notification()
            .update(
                notification::userid_proposalid_type(
                    notification.userid,
                    notification.proposalid,
                    NotificationType::QuorumNotReachedEmail,
                ),
                vec![notification::dispatched::set(true)],
            )
            .exec()
            .instrument(debug_span!("update notification"))
            .await
            .unwrap();
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
                        .upsert(
                            notification::userid_proposalid_type(
                                sub.userid.to_string(),
                                proposal.id.to_string(),
                                NotificationType::QuorumNotReachedEmail,
                            ),
                            notification::create(
                                prisma::user::UniqueWhereParam::IdEquals(sub.userid.clone()),
                                prisma::proposal::UniqueWhereParam::IdEquals(proposal.id.clone()),
                                NotificationType::QuorumNotReachedEmail,
                                vec![notification::dispatched::set(false)],
                            ),
                            vec![],
                        )
                        .exec()
                        .instrument(debug_span!("insert_notifications"))
                        .await
                        .unwrap();
                }
            }
        }
    }
}
