use std::{cmp::Ordering, collections::HashMap, env, sync::Arc};

use anyhow::Result;
use chrono::{Duration, Utc};
use log::debug;
use prisma_client_rust::{serde_json::Value, Direction};
use reqwest::header::{HeaderMap, ACCEPT, CONTENT_TYPE};
use serde::{Deserialize, Serialize};
use serde_json::json;
use tokio::{sync::Semaphore, task::spawn_blocking};
use tracing::{debug_span, event, info, instrument, warn, Instrument, Level};

use crate::{
    prisma::{
        self, notification, proposal, user, DaoHandlerType, MagicUserState,
        NotificationDispatchedState, NotificationType, ProposalState,
    },
    utils::{countdown::countdown_gif, posthog::posthog_bulletin_event, vote::get_vote},
};

prisma::proposal::include!(proposal_with_dao { dao daohandler });
prisma::user::include!(user_with_voters_and_subscriptions { subscriptions voters });

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug, Clone)]
struct EmailBody {
    To: String,
    From: String,
    TemplateAlias: String,
    TemplateModel: BulletinData,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug, Clone)]
struct BulletinData {
    todaysDate: String,
    endingSoonProposals: Vec<EndingSoonProposals>,
    newProposals: Vec<NewProposals>,
    endedProposals: Vec<EndedProposals>,
    env: Option<Value>,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug, Clone)]
struct EndingSoonProposals {
    daoLogoUrl: String,
    chainLogoUrl: String,
    url: String,
    proposalName: String,
    countdownUrl: String,
    countdownString: String,
    voteStatusIconUrl: String,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug, Clone)]
struct NewProposals {
    daoLogoUrl: String,
    chainLogoUrl: String,
    url: String,
    proposalName: String,
    countdownUrl: String,
    countdownString: String,
    voteStatusIconUrl: String,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug, Clone)]
struct EndedProposals {
    daoLogoUrl: String,
    chainLogoUrl: String,
    url: String,
    proposalName: String,
    hiddenResult: bool,
    result: Option<NormalResult>,
    noqorum: bool,
    makerResult: Option<MakerResult>,
    countdownString: String,
    voteStatusIconUrl: String,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug, Clone)]
struct NormalResult {
    choiceName: String,
    choicePercentage: i64,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug, Clone)]
struct MakerResult {
    choiceName: String,
    mkrAmount: i64,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug, Clone)]
struct PostmarkResult {
    Message: String,
    MessageID: Option<String>,
}

#[instrument(skip_all)]
pub async fn send_triggered_emails(db: &Arc<prisma::PrismaClient>) -> Result<()> {
    let notifications = db
        .notification()
        .find_many(vec![
            notification::r#type::equals(NotificationType::BulletinEmail),
            notification::dispatchstatus::in_vec(vec![NotificationDispatchedState::NotDispatched]),
        ])
        .exec()
        .await?;

    for notification in notifications {
        let user = db
            .user()
            .find_first(vec![user::id::equals(notification.clone().userid)])
            .include(user_with_voters_and_subscriptions::include())
            .exec()
            .await?
            .unwrap();

        match send_bulletin(user, db).await {
            Ok(_) => event!(Level::INFO, "sent triggered bulletin"),
            Err(e) => event!(
                Level::ERROR,
                err = e.to_string(),
                "failed to send triggered bulletin"
            ),
        };

        db.notification()
            .delete(notification::id::equals(notification.id))
            .exec()
            .await?;
    }

    Ok(())
}

#[instrument(skip_all)]
pub async fn send_bulletin_emails(db: Arc<prisma::PrismaClient>) {
    let users = db
        .user()
        .find_many(vec![
            user::emaildailybulletin::equals(true),
            user::verifiedemail::equals(true),
            user::verifiedaddress::equals(true),
        ])
        .include(user_with_voters_and_subscriptions::include())
        .exec()
        .await
        .unwrap();

    let mut tasks = Vec::new();
    let semaphore = Arc::new(Semaphore::new(10));

    for user in users {
        let db = Arc::clone(&db);
        let semaphore = Arc::clone(&semaphore);
        let permit = semaphore
            .acquire_owned()
            .await
            .expect("Failed to acquire permit");

        tasks.push(tokio::spawn(async move {
            let result = send_bulletin(user, &db).await;
            drop(permit);
            match result {
                Ok(_) => event!(Level::INFO, "sent bulletin"),
                Err(e) => event!(Level::ERROR, err = e.to_string(), "failed to send bulletin"),
            }
        }));
    }

    futures::future::join_all(tasks).await;
}

#[instrument(skip(db))]
async fn send_bulletin(
    user: user_with_voters_and_subscriptions::Data,
    db: &Arc<prisma::PrismaClient>,
) -> Result<bool> {
    let user_data = get_user_bulletin_data(user.clone(), db).await?;

    if user.email.is_none() {
        return Ok(false);
    }

    if user_data.newProposals.is_empty()
        && user_data.endedProposals.is_empty()
        && user_data.endingSoonProposals.is_empty()
        && !user.emptydailybulletin
    {
        return Ok(false);
    }

    let bulletin_template = if user.isaaveuser == MagicUserState::Enabled
        && user.isuniswapuser == MagicUserState::Enabled
    {
        "senate-bulletin"
    } else if user.isaaveuser == MagicUserState::Enabled {
        "aave-bulletin"
    } else if user.isuniswapuser == MagicUserState::Enabled {
        "uniswap-bulletin"
    } else if user.subscriptions.len() > 1 {
        "senate-bulletin"
    } else {
        "senate-bulletin"
    };

    let user_email = user.email.unwrap();

    let content = &EmailBody {
        To: user_email.clone(),
        From: "info@senatelabs.xyz".to_string(),
        TemplateAlias: bulletin_template.to_string(),
        TemplateModel: user_data.clone(),
    };

    event!(
        Level::INFO,
        to = user_email.clone(),
        from = "info@senatelabs.xyz".to_string(),
        template_alias = bulletin_template.to_string(),
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
        .await
        .unwrap();

    let result: Result<PostmarkResult, reqwest::Error> = response.json().await;

    match result {
        Ok(postmark_result) => {
            if postmark_result.Message == "OK" {
                event!(
                    Level::INFO,
                    to = user_email.clone(),
                    from = "info@senatelabs.xyz".to_string(),
                    template_alias = bulletin_template.to_string(),
                    "email sent"
                );

                db.notification()
                    .create_many(vec![notification::create_unchecked(
                        user.id,
                        NotificationType::BulletinEmail,
                        vec![
                            notification::dispatchstatus::set(
                                NotificationDispatchedState::Dispatched,
                            ),
                            notification::emailmessageid::set(postmark_result.clone().MessageID),
                            notification::emailtemplate::set(bulletin_template.to_string().into()),
                        ],
                    )])
                    .skip_duplicates()
                    .exec()
                    .await?;

                spawn_blocking(move || {
                    posthog_bulletin_event(
                        "email_bulletin_sent",
                        user.address.unwrap(),
                        bulletin_template,
                        postmark_result.MessageID.unwrap().as_str(),
                    );
                })
                .await?;
            } else {
                event!(
                    Level::WARN,
                    to = user_email.clone(),
                    from = "info@senatelabs.xyz".to_string(),
                    template_alias = bulletin_template.to_string(),
                    err = postmark_result.Message,
                    "email failed to send"
                );

                db.notification()
                    .create_many(vec![notification::create_unchecked(
                        user.id,
                        NotificationType::BulletinEmail,
                        vec![notification::dispatchstatus::set(
                            NotificationDispatchedState::Failed,
                        )],
                    )])
                    .skip_duplicates()
                    .exec()
                    .await?;

                spawn_blocking(move || {
                    posthog_bulletin_event(
                        "email_bulletin_fail",
                        user.address.unwrap(),
                        "",
                        postmark_result.Message.as_str(),
                    );
                })
                .await?;
            }
        }
        Err(e) => {
            event!(
                Level::WARN,
                to = user_email.clone(),
                from = "info@senatelabs.xyz".to_string(),
                template_alias = bulletin_template.to_string(),
                err = e.to_string(),
                "email failed to send"
            );

            db.notification()
                .create_many(vec![notification::create_unchecked(
                    user.id,
                    NotificationType::BulletinEmail,
                    vec![notification::dispatchstatus::set(
                        NotificationDispatchedState::Failed,
                    )],
                )])
                .skip_duplicates()
                .exec()
                .await?;

            spawn_blocking(move || {
                posthog_bulletin_event("email_bulletin_fail", user.address.unwrap(), "", "");
            })
            .await?;
        }
    }

    Ok(true)
}

#[instrument(skip(db))]
async fn get_user_bulletin_data(
    user: user_with_voters_and_subscriptions::Data,
    db: &Arc<prisma::PrismaClient>,
) -> Result<BulletinData> {
    let ending_soon_proposals = get_ending_soon_proposals(user.clone(), db).await?;
    let new_proposals = get_new_proposals(user.clone(), db).await?;
    let ended_proposals = get_ended_proposals(user.clone(), db).await?;
    let exec_env = env::var("EXEC_ENV").expect("$EXEC_ENV is not set");

    Ok(BulletinData {
        todaysDate: Utc::now().format("%A, %B %e, %Y").to_string(),
        endingSoonProposals: ending_soon_proposals,
        newProposals: new_proposals,
        endedProposals: ended_proposals,
        env: if exec_env == "prod" {
            None
        } else {
            Some(json!({ "env": exec_env }))
        },
    })
}

#[instrument(skip(db))]
async fn get_ending_soon_proposals(
    user: user_with_voters_and_subscriptions::Data,
    db: &Arc<prisma::PrismaClient>,
) -> Result<Vec<EndingSoonProposals>> {
    let proposals = db
        .proposal()
        .find_many(vec![
            proposal::timeend::lte((Utc::now() + Duration::days(3)).into()),
            proposal::timeend::gt(Utc::now().into()),
            proposal::daoid::in_vec(
                user.subscriptions
                    .clone()
                    .into_iter()
                    .map(|s| s.daoid)
                    .collect(),
            ),
            proposal::state::not_in_vec(vec![ProposalState::Canceled]),
            proposal::visible::equals(true),
        ])
        .order_by(proposal::timeend::order(Direction::Asc))
        .include(proposal_with_dao::include())
        .exec()
        .await?;

    let ending_proposals = futures::future::join_all(proposals.iter().map(|p| async {
        let countdown_url = countdown_gif(p.timeend.into(), true).await.unwrap();

        let shortner_url = match env::var_os("NEXT_PUBLIC_URL_SHORTNER") {
            Some(v) => v.into_string().unwrap(),
            None => panic!("$NEXT_PUBLIC_URL_SHORTNER is not set"),
        };
        let short_url = format!(
            "{}/{}/{}/{}",
            shortner_url,
            p.id.chars()
                .rev()
                .take(7)
                .collect::<Vec<char>>()
                .into_iter()
                .rev()
                .collect::<String>(),
            "b",
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
        EndingSoonProposals {
            daoLogoUrl: format!(
                "{}{}{}",
                env::var_os("NEXT_PUBLIC_WEB_URL")
                    .unwrap()
                    .into_string()
                    .unwrap(),
                p.dao.picture,
                "_medium.png"
            ),
            chainLogoUrl: format!(
                "{}{}",
                env::var_os("NEXT_PUBLIC_WEB_URL")
                    .unwrap()
                    .into_string()
                    .unwrap(),
                if p.daohandler.r#type == DaoHandlerType::Snapshot {
                    "/assets/Emails/off-chain-rectangle.png"
                } else {
                    "/assets/Emails/on-chain-rectangle.png"
                }
            ),
            url: short_url,
            proposalName: p.clone().name,
            countdownUrl: countdown_url,
            countdownString: p.timeend.format("on %b %e, %Y at %H:%M UTC").to_string(),
            voteStatusIconUrl: format!(
                "{}/api/vote/{}/{}/{}?t={}",
                env::var_os("NEXT_PUBLIC_WEB_URL")
                    .unwrap()
                    .into_string()
                    .unwrap(),
                user.clone().email.unwrap(),
                p.id,
                Utc::now().timestamp_micros(),
                Utc::now().timestamp_micros()
            ),
        }
    }))
    .await;

    Ok(ending_proposals)
}

#[instrument(skip(db))]
async fn get_new_proposals(
    user: user_with_voters_and_subscriptions::Data,
    db: &Arc<prisma::PrismaClient>,
) -> Result<Vec<NewProposals>> {
    let proposals = db
        .proposal()
        .find_many(vec![
            proposal::timecreated::gte((Utc::now() - Duration::days(1)).into()),
            proposal::daoid::in_vec(
                user.subscriptions
                    .clone()
                    .into_iter()
                    .map(|s| s.daoid)
                    .collect(),
            ),
            proposal::state::not_in_vec(vec![ProposalState::Canceled]),
            proposal::visible::equals(true),
        ])
        .order_by(proposal::timeend::order(Direction::Asc))
        .include(proposal_with_dao::include())
        .exec()
        .await?;

    let new_proposals = futures::future::join_all(proposals.iter().map(|p| async {
        let countdown_url = countdown_gif(p.timeend.into(), true).await.unwrap();

        let shortner_url = match env::var_os("NEXT_PUBLIC_URL_SHORTNER") {
            Some(v) => v.into_string().unwrap(),
            None => panic!("$NEXT_PUBLIC_URL_SHORTNER is not set"),
        };
        let short_url = format!(
            "{}/{}/{}/{}",
            shortner_url,
            p.id.chars()
                .rev()
                .take(7)
                .collect::<Vec<char>>()
                .into_iter()
                .rev()
                .collect::<String>(),
            "b",
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

        NewProposals {
            daoLogoUrl: format!(
                "{}{}{}",
                env::var_os("NEXT_PUBLIC_WEB_URL")
                    .unwrap()
                    .into_string()
                    .unwrap(),
                p.dao.picture,
                "_medium.png"
            ),
            chainLogoUrl: format!(
                "{}{}",
                env::var_os("NEXT_PUBLIC_WEB_URL")
                    .unwrap()
                    .into_string()
                    .unwrap(),
                if p.daohandler.r#type == DaoHandlerType::Snapshot {
                    "/assets/Emails/off-chain-rectangle.png"
                } else {
                    "/assets/Emails/on-chain-rectangle.png"
                }
            ),
            url: short_url,
            proposalName: p.clone().name,
            countdownUrl: countdown_url,
            countdownString: p.timeend.format("on %b %e, %Y at %H:%M UTC").to_string(),
            voteStatusIconUrl: format!(
                "{}/api/vote/{}/{}/{}?t={}",
                env::var_os("NEXT_PUBLIC_WEB_URL")
                    .unwrap()
                    .into_string()
                    .unwrap(),
                user.clone().email.unwrap(),
                p.id,
                Utc::now().timestamp_micros(),
                Utc::now().timestamp_micros()
            ),
        }
    }))
    .await;

    Ok(new_proposals)
}

#[instrument(skip(db))]
async fn get_ended_proposals(
    user: user_with_voters_and_subscriptions::Data,
    db: &Arc<prisma::PrismaClient>,
) -> Result<Vec<EndedProposals>> {
    let proposals = db
        .proposal()
        .find_many(vec![
            proposal::timeend::lte(Utc::now().into()),
            proposal::timeend::gte((Utc::now() - Duration::days(1)).into()),
            proposal::daoid::in_vec(
                user.subscriptions
                    .clone()
                    .into_iter()
                    .map(|s| s.daoid)
                    .collect(),
            ),
            proposal::state::not_in_vec(vec![ProposalState::Canceled]),
            proposal::visible::equals(true),
        ])
        .order_by(proposal::timeend::order(Direction::Desc))
        .include(proposal_with_dao::include())
        .exec()
        .await?;

    let ended_proposals = futures::future::join_all(proposals.iter().map(|p| async {
        let shortner_url = match env::var_os("NEXT_PUBLIC_URL_SHORTNER") {
            Some(v) => v.into_string().unwrap(),
            None => panic!("$NEXT_PUBLIC_URL_SHORTNER is not set"),
        };
        let short_url = format!(
            "{}/{}/{}/{}",
            shortner_url,
            p.id.chars()
                .rev()
                .take(7)
                .collect::<Vec<char>>()
                .into_iter()
                .rev()
                .collect::<String>(),
            "b",
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

        let (result_index, max_score) = match p.scores.as_array() {
            Some(scores) => scores
                .iter()
                .map(|score| score.as_f64().unwrap())
                .enumerate()
                .max_by(|(_, a), (_, b)| a.partial_cmp(b).unwrap_or(Ordering::Equal))
                .unwrap_or((100, 0.0)),
            None => (0, p.scores.as_f64().unwrap()),
        };

        EndedProposals {
            daoLogoUrl: format!(
                "{}{}{}",
                env::var_os("NEXT_PUBLIC_WEB_URL")
                    .unwrap()
                    .into_string()
                    .unwrap(),
                p.dao.picture,
                "_medium.png"
            ),
            chainLogoUrl: format!(
                "{}{}",
                env::var_os("NEXT_PUBLIC_WEB_URL")
                    .unwrap()
                    .into_string()
                    .unwrap(),
                if p.daohandler.r#type == DaoHandlerType::Snapshot {
                    "/assets/Emails/off-chain-rectangle.png"
                } else {
                    "/assets/Emails/on-chain-rectangle.png"
                }
            ),
            url: short_url,
            proposalName: p.clone().name,
            countdownString: p.timeend.format("on %b %e, %Y at %H:%M UTC").to_string(),
            voteStatusIconUrl: format!(
                "{}/api/vote/{}/{}/{}?t={}",
                env::var_os("NEXT_PUBLIC_WEB_URL")
                    .unwrap()
                    .into_string()
                    .unwrap(),
                user.clone().email.unwrap(),
                p.id,
                Utc::now().timestamp_micros(),
                Utc::now().timestamp_micros()
            ),
            hiddenResult: p.state == ProposalState::Hidden,
            result: if p.scorestotal.as_f64() > p.quorum.as_f64()
                && p.state != ProposalState::Hidden
                && p.dao.name != "MakerDAO"
            {
                Some(NormalResult {
                    choiceName: p.choices.as_array().unwrap()[result_index].to_string(),
                    choicePercentage: (max_score / p.scorestotal.as_f64().unwrap() * 100.0).round()
                        as i64,
                })
            } else {
                None
            },
            noqorum: p.scorestotal.as_f64() < p.quorum.as_f64() && p.state != ProposalState::Hidden,
            makerResult: if p.dao.name == "MakerDAO" {
                Some(MakerResult {
                    choiceName: "Yes".to_string(),
                    mkrAmount: 1,
                })
            } else {
                None
            },
        }
    }))
    .await;

    Ok(ended_proposals)
}
