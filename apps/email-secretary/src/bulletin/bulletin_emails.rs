use std::{cmp::Ordering, env, sync::Arc};

use anyhow::Result;
use chrono::{Duration, Utc};
use prisma_client_rust::{serde_json::Value, Direction};
use reqwest::header::{HeaderMap, ACCEPT, CONTENT_TYPE};
use serde::{Deserialize, Serialize};
use serde_json::json;

use crate::{
    prisma::{self, proposal, user, DaoHandlerType, MagicUserState, ProposalState},
    utils::{countdown::countdown_gif, vote::get_vote},
};

prisma::proposal::include!(proposal_with_dao { dao daohandler });
prisma::user::include!(user_with_voters_and_subscriptions { subscriptions voters});

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
    voteStatus: String,
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
    voteStatus: String,
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
    voteStatus: String,
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

pub async fn send_bulletin_emails(db: &Arc<prisma::PrismaClient>) {
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

    for user in users {
        send_bulletin(user, &db).await.unwrap();
    }
}

async fn send_bulletin(
    user: user_with_voters_and_subscriptions::Data,
    db: &Arc<prisma::PrismaClient>,
) -> Result<bool> {
    let user_data = get_user_bulletin_data(user.clone(), db).await?;
    let user_email = user.email.unwrap().clone();
    let bulletin_template = if user.isaaveuser == MagicUserState::Enabled {
        "aave-bulletin"
    } else if user.isuniswapuser == MagicUserState::Enabled {
        "uniswap-bulletin"
    } else {
        "senate-bulletin"
    };

    // let client = reqwest::Client::new();
    // let mut headers = HeaderMap::new();
    // headers.insert(ACCEPT, "application/json".parse().unwrap());
    // headers.insert(CONTENT_TYPE, "application/json".parse().unwrap());
    // headers.insert(
    //     "X-Postmark-Server-Token",
    //     env::var("POSTMARK_TOKEN")
    //         .expect("Missing Postmark Token")
    //         .parse()
    //         .unwrap(),
    // );
    // let res = client
    //     .post("https://api.postmarkapp.com/email/withTemplate")
    //     .headers(headers)
    //     .json(&EmailBody {
    //         To: user_email,
    //         From: "info@senatelabs.xyz".to_string(),
    //         TemplateAlias: bulletin_template.to_string(),
    //         TemplateModel: user_data,
    //     })
    //     .send()
    //     .await
    //     .unwrap();
    //let _success = res.status().is_success();

    // println!(
    //     "{:?}",
    //     &EmailBody {
    //         To: user_email,
    //         From: "info@senatelabs.xyz".to_string(),
    //         TemplateAlias: bulletin_template.to_string(),
    //         TemplateModel: user_data.clone(),
    //     }
    // );

    println!("{}", serde_json::to_string(&user_data).unwrap());

    Ok((true))
}

async fn get_user_bulletin_data(
    user: user_with_voters_and_subscriptions::Data,
    db: &Arc<prisma::PrismaClient>,
) -> Result<BulletinData> {
    let ending_soon_proposals = get_ending_soon_proposals(user.clone(), db).await?;
    let new_proposals = get_new_proposals(user.clone(), db).await?;
    let ended_proposals = get_ended_proposals(user.clone(), db).await?;

    Ok(BulletinData {
        todaysDate: Utc::now().format("%A, %B %e, %Y").to_string(),
        endingSoonProposals: ending_soon_proposals,
        newProposals: new_proposals,
        endedProposals: ended_proposals,
    })
}

async fn get_ending_soon_proposals(
    user: user_with_voters_and_subscriptions::Data,
    db: &Arc<prisma::PrismaClient>,
) -> Result<Vec<EndingSoonProposals>> {
    let proposals = db
        .proposal()
        .find_many(vec![
            proposal::timeend::lte((Utc::now() + Duration::from(Duration::days(3))).into()),
            proposal::timeend::gt(Utc::now().into()),
            proposal::daoid::in_vec(
                user.subscriptions
                    .clone()
                    .into_iter()
                    .map(|s| s.daoid)
                    .collect(),
            ),
            proposal::state::not(ProposalState::Canceled),
        ])
        .order_by(proposal::timeend::order(Direction::Asc))
        .include(proposal_with_dao::include())
        .exec()
        .await
        .unwrap();

    let ending_proposals = futures::future::join_all(proposals.iter().map(|p| async {
        let countdown_url = countdown_gif(p.timeend.into()).await.unwrap();
        let voted = get_vote(user.clone().id, p.clone().id, db).await.unwrap();

        let shortner_url = match env::var_os("NEXT_PUBLIC_URL_SHORTNER") {
            Some(v) => v.into_string().unwrap(),
            None => panic!("$NEXT_PUBLIC_URL_SHORTNER is not set"),
        };
        let short_url = format!(
            "{}{}",
            shortner_url,
            p.id.chars()
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
                "https://senatelabs.xyz", p.dao.picture, "_medium.png"
            ),
            chainLogoUrl: format!(
                "{}{}",
                "https://senatelabs.xyz",
                if p.daohandler.r#type == DaoHandlerType::Snapshot {
                    "/assets/Icon/off-chain.png"
                } else {
                    "/assets/Icon/on-chain.png"
                }
            ),
            url: short_url,
            proposalName: p.clone().name,
            countdownUrl: countdown_url,
            countdownString: p.timeend.format("on %b %e, %Y at %H:%M UTC").to_string(),
            voteStatusIconUrl: if voted {
                "https://senatelabs.xyz/assets/Emails/voted.png".to_string()
            } else {
                "https://senatelabs.xyz/assets/Emails/not-voted-yet.png".to_string()
            },
            voteStatus: if voted {
                "Voted".to_string()
            } else {
                "Not voted yet".to_string()
            },
        }
    }))
    .await;

    Ok(ending_proposals)
}

async fn get_new_proposals(
    user: user_with_voters_and_subscriptions::Data,
    db: &Arc<prisma::PrismaClient>,
) -> Result<Vec<NewProposals>> {
    let proposals = db
        .proposal()
        .find_many(vec![
            proposal::timecreated::gte((Utc::now() - Duration::from(Duration::days(1))).into()),
            proposal::daoid::in_vec(
                user.subscriptions
                    .clone()
                    .into_iter()
                    .map(|s| s.daoid)
                    .collect(),
            ),
            proposal::state::not(ProposalState::Canceled),
        ])
        .order_by(proposal::timeend::order(Direction::Asc))
        .include(proposal_with_dao::include())
        .exec()
        .await
        .unwrap();

    let new_proposals = futures::future::join_all(proposals.iter().map(|p| async {
        let countdown_url = countdown_gif(p.timeend.into()).await.unwrap();
        let voted = get_vote(user.clone().id, p.clone().id, db).await.unwrap();
        let shortner_url = match env::var_os("NEXT_PUBLIC_URL_SHORTNER") {
            Some(v) => v.into_string().unwrap(),
            None => panic!("$NEXT_PUBLIC_URL_SHORTNER is not set"),
        };
        let short_url = format!(
            "{}{}",
            shortner_url,
            p.id.chars()
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
                "https://senatelabs.xyz", p.dao.picture, "_medium.png"
            ),
            chainLogoUrl: format!(
                "{}{}",
                "https://senatelabs.xyz",
                if p.daohandler.r#type == DaoHandlerType::Snapshot {
                    "/assets/Icon/off-chain.png"
                } else {
                    "/assets/Icon/on-chain.png"
                }
            ),
            url: short_url,
            proposalName: p.clone().name,
            countdownUrl: countdown_url,
            countdownString: p.timeend.format("on %b %e, %Y at %H:%M UTC").to_string(),
            voteStatusIconUrl: if voted {
                "https://senatelabs.xyz/assets/Emails/voted.png".to_string()
            } else {
                "https://senatelabs.xyz/assets/Emails/not-voted-yet.png".to_string()
            },
            voteStatus: if voted {
                "Voted".to_string()
            } else {
                "Not voted yet".to_string()
            },
        }
    }))
    .await;

    Ok(new_proposals)
}

async fn get_ended_proposals(
    user: user_with_voters_and_subscriptions::Data,
    db: &Arc<prisma::PrismaClient>,
) -> Result<Vec<EndedProposals>> {
    let proposals = db
        .proposal()
        .find_many(vec![
            proposal::timeend::lte(Utc::now().into()),
            proposal::timeend::gt((Utc::now() - Duration::from(Duration::days(10))).into()),
            proposal::daoid::in_vec(
                user.subscriptions
                    .clone()
                    .into_iter()
                    .map(|s| s.daoid)
                    .collect(),
            ),
            proposal::state::not(ProposalState::Canceled),
        ])
        .order_by(proposal::timeend::order(Direction::Asc))
        .include(proposal_with_dao::include())
        .exec()
        .await
        .unwrap();

    let ended_proposals = futures::future::join_all(proposals.iter().map(|p| async {
        let voted = get_vote(user.clone().id, p.clone().id, db).await.unwrap();
        let shortner_url = match env::var_os("NEXT_PUBLIC_URL_SHORTNER") {
            Some(v) => v.into_string().unwrap(),
            None => panic!("$NEXT_PUBLIC_URL_SHORTNER is not set"),
        };
        let short_url = format!(
            "{}{}",
            shortner_url,
            p.id.chars()
                .rev()
                .take(7)
                .collect::<Vec<char>>()
                .into_iter()
                .rev()
                .collect::<String>()
        );

        let (result_index, max_score) = p
            .scores
            .as_array()
            .unwrap()
            .iter()
            .map(|score| score.as_f64().unwrap())
            .enumerate()
            .max_by(|(_, a), (_, b)| a.partial_cmp(b).unwrap_or(Ordering::Equal))
            .unwrap_or((100, 0.0));

        EndedProposals {
            daoLogoUrl: format!(
                "{}{}{}",
                "https://senatelabs.xyz", p.dao.picture, "_medium.png"
            ),
            chainLogoUrl: format!(
                "{}{}",
                "https://senatelabs.xyz",
                if p.daohandler.r#type == DaoHandlerType::Snapshot {
                    "/assets/Icon/off-chain.png"
                } else {
                    "/assets/Icon/on-chain.png"
                }
            ),
            url: short_url,
            proposalName: p.clone().name,
            countdownString: p.timeend.format("on %b %e, %Y at %H:%M UTC").to_string(),
            voteStatusIconUrl: if voted {
                "https://senatelabs.xyz/assets/Emails/voted.png".to_string()
            } else {
                "https://senatelabs.xyz/assets/Emails/did-not-vote.png".to_string()
            },
            voteStatus: if voted {
                "Voted".to_string()
            } else {
                "Did not vote".to_string()
            },
            hiddenResult: if p.state == ProposalState::Hidden {
                true
            } else {
                false
            },
            result: if p.scorestotal.as_f64() > p.quorum.as_f64()
                && p.state != ProposalState::Hidden
            {
                Some(NormalResult {
                    choiceName: p.choices.as_array().unwrap()[result_index].to_string(),
                    choicePercentage: (max_score / p.scorestotal.as_f64().unwrap() * 100.0).round()
                        as i64,
                })
            } else {
                None
            },
            noqorum: if p.scorestotal.as_f64() < p.quorum.as_f64()
                && p.state != ProposalState::Hidden
            {
                true
            } else {
                false
            },
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
