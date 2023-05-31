#![allow(unused_imports)]
#![allow(unused_parens)]

pub mod prisma;

use crate::prisma::{
    dao, notification, proposal, subscription, user, vote, voter, DaoHandlerType, MagicUserState,
    NotificationType, ProposalState,
};
use crate::proposal_with_dao::Data as proposal_w_dao;
use crate::user_with_proxies_and_subscriptions::Data as user_w_proxies_and_subs;
use chrono::prelude::*;
use dotenv::dotenv;
use prisma_client_rust::chrono::{Duration, Utc};
use prisma_client_rust::{Direction, QueryError};
use std::ptr::null;
use std::{cmp::Ordering, collections::HashMap, env};

use num_format::{Locale, ToFormattedString};
use reqwest::header::{HeaderMap, ACCEPT, CONTENT_TYPE};
use reqwest::Error;
use serde::{Deserialize, Serialize};
use serde_json::json;
use tokio::time::sleep;
use urlencoding::encode;

#[derive(Serialize, Deserialize, Debug)]
pub struct BulletinResult {
    passed_icon_url: String,
    highest_score_choice: String,
    highest_score_support: f64,
    highest_score_percentage_display: String,
    highest_score_percentage: f64,
    bar_width_percentage: i64,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct HighestScore {
    choice: String,
    support: f64,
    percentage: f64,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct EmailTemplateRow {
    voting_status: String,
    voting_status_icon_url: String,
    proposal_name: String,
    proposal_url: String,
    dao_logo_url: String,
    chain_logo_url: String,
    dao_name: String,
    end_date_string: String,
    countdown_url: String,
    result: BulletinResult,
    generic_result_display: String,
    maker_result_display: String,
    hidden_result_display: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct BulletinData {
    todays_date: String,
    new_proposals: Vec<EmailTemplateRow>,
    ending_proposals: Vec<EmailTemplateRow>,
    past_proposals: Vec<EmailTemplateRow>,
    ending_proposals_table_display: String,
    ending_proposals_no_data_display: String,
    new_proposals_table_display: String,
    new_proposals_no_data_display: String,
    past_proposals_table_display: String,
    past_proposals_no_data_display: String,
}

#[derive(Serialize, Deserialize)]
struct EmailBody {
    To: String,
    From: String,
    TemplateAlias: String,
    TemplateModel: BulletinData,
}

#[derive(Deserialize, Debug)]
struct CountdownResponse {
    message: Option<Message>,
}

#[derive(Deserialize, Debug)]
struct Message {
    src: Option<String>,
}

#[derive(PartialEq, Eq)]
enum BulletinSection {
    EndingSoon = 0,
    New = 1,
    Past = 2,
}

#[tokio::main]
async fn main() {
    dotenv().ok();
    println!("Starting scheduler!");

    if (env::var("BULLETIN_ENABLE").unwrap() != "true".to_string()) {
        println!("Bulletin is disabled");
        return;
    }

    // Fetch users to be notified
    let db = prisma::new_client()
        .await
        .expect("Failed to create Prisma client");

    let users_to_be_notified = fetch_users_to_be_notified(&db).await.unwrap();

    for user in users_to_be_notified.iter() {
        let ending_proposals = fetch_ending_proposals(&db, user).await.unwrap();
        let new_proposals = fetch_new_proposals(&db, &user).await.unwrap();
        let past_proposals = fetch_past_proposals(&db, &user).await.unwrap();

        // If proposal data is empty, and user has enabled the setting, skip this iteration
        if user.emptydailybulletin == false
            && ending_proposals.len() == 0
            && new_proposals.len() == 0
            && past_proposals.len() == 0
        {
            continue;
        }

        let bulletin_data = BulletinData {
            todays_date: Utc::now().format("%A, %B %d, %Y").to_string(),
            ending_proposals: format_email_table_data(
                &db,
                &user,
                &ending_proposals,
                BulletinSection::EndingSoon,
            )
            .await
            .unwrap(),
            ending_proposals_table_display: match ending_proposals.len() {
                0 => "hide".to_string(),
                _ => "show".to_string(),
            },
            ending_proposals_no_data_display: match ending_proposals.len() {
                0 => "show".to_string(),
                _ => "hide".to_string(),
            },
            new_proposals: format_email_table_data(
                &db,
                &user,
                &new_proposals,
                BulletinSection::New,
            )
            .await
            .unwrap(),
            new_proposals_table_display: match new_proposals.len() {
                0 => "hide".to_string(),
                _ => "show".to_string(),
            },
            new_proposals_no_data_display: match new_proposals.len() {
                0 => "show".to_string(),
                _ => "hide".to_string(),
            },
            past_proposals: format_email_table_data(
                &db,
                &user,
                &past_proposals,
                BulletinSection::Past,
            )
            .await
            .unwrap(),
            past_proposals_table_display: match past_proposals.len() {
                0 => "hide".to_string(),
                _ => "show".to_string(),
            },
            past_proposals_no_data_display: match past_proposals.len() {
                0 => "show".to_string(),
                _ => "hide".to_string(),
            },
        };

        let email_template_alias = select_email_template(&user);

        let recipient = match env::var("EXEC_ENV").unwrap().as_str() {
            "PROD" => user.email.clone().unwrap(),
            _ => env::var("TEST_EMAIL").unwrap(),
        };

        let email_body = EmailBody {
            To: recipient,
            From: "info@senatelabs.xyz".to_string(),
            TemplateAlias: email_template_alias,
            TemplateModel: bulletin_data,
        };

        println!(
            "Sending email to {}",
            user.email.clone().unwrap().to_string()
        );
        send_email(serde_json::to_value(email_body).unwrap())
            .await
            .unwrap();
    }

    println!("Scheduler finished");
}

prisma::user::include!(user_with_proxies_and_subscriptions { subscriptions voters});

async fn fetch_users_to_be_notified(
    db: &prisma::PrismaClient,
) -> Result<Vec<user_w_proxies_and_subs>, QueryError> {
    return db
        .user()
        .find_many(vec![
            user::verifiedemail::equals(true),
            user::emaildailybulletin::equals(true),
            user::subscriptions::some(vec![subscription::notificationsenabled::equals(true)]),
        ])
        .include(user_with_proxies_and_subscriptions::include())
        .exec()
        .await;
}

prisma::proposal::include!(proposal_with_dao { dao daohandler });

async fn fetch_ending_proposals(
    db: &prisma::PrismaClient,
    user: &user_w_proxies_and_subs,
) -> Result<Vec<proposal_w_dao>, QueryError> {
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
        ])
        .order_by(proposal::timeend::order(Direction::Asc))
        .include(proposal_with_dao::include())
        .exec()
        .await
        .unwrap();

    return Ok(proposals);
}

async fn fetch_new_proposals(
    db: &prisma::PrismaClient,
    user: &user_w_proxies_and_subs,
) -> Result<Vec<proposal_w_dao>, QueryError> {
    let proposals = db
        .proposal()
        .find_many(vec![
            proposal::timeend::gte((Utc::now() - Duration::from(Duration::days(1))).into()),
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

    return Ok(proposals);
}

async fn fetch_past_proposals(
    db: &prisma::PrismaClient,
    user: &user_w_proxies_and_subs,
) -> Result<Vec<proposal_with_dao::Data>, QueryError> {
    let proposals = db
        .proposal()
        .find_many(vec![
            proposal::timeend::lte(Utc::now().into()),
            proposal::timeend::gt((Utc::now() - Duration::from(Duration::days(1))).into()),
            proposal::daoid::in_vec(
                user.subscriptions
                    .clone()
                    .into_iter()
                    .map(|s| s.daoid)
                    .collect(),
            ),
        ])
        .order_by(proposal::timeend::order(Direction::Asc))
        .include(proposal_with_dao::include())
        .exec()
        .await
        .unwrap();

    return Ok(proposals);
}

fn select_email_template(user: &user_w_proxies_and_subs) -> String {
    let template_alias = if user.isaaveuser == MagicUserState::Enabled {
        "aave-bulletin"
    } else if user.isuniswapuser == MagicUserState::Enabled {
        "uni-bulletin"
    } else {
        "senate-daily-bulletin"
    };

    return template_alias.to_string();
}

async fn format_email_table_data(
    db: &prisma::PrismaClient,
    user: &user_w_proxies_and_subs,
    proposals: &Vec<proposal_w_dao>,
    section: BulletinSection,
) -> Result<Vec<EmailTemplateRow>, Error> {
    // fetch or generate countdown
    let mut table_rows: Vec<EmailTemplateRow> = Vec::new();

    for proposal in proposals.into_iter() {
        table_rows.push(
            format_email_template_row(db, &user, &proposal, &section)
                .await
                .unwrap(),
        );
    }

    return Ok(table_rows);
}

async fn format_email_template_row(
    db: &prisma::PrismaClient,
    user: &user_w_proxies_and_subs,
    proposal: &proposal_w_dao,
    section: &BulletinSection,
) -> Result<EmailTemplateRow, Error> {
    let countdown_url = generate_countdown_gif_url(proposal.timeend.into())
        .await
        .unwrap();
    let voted = user_voted(db, user, proposal).await.unwrap();

    let voting_status = if voted {
        "Voted".to_string()
    } else if &BulletinSection::Past == section {
        "Didn't vote".to_string()
    } else {
        "Not voted yet".to_string()
    };

    let voting_status_icon_url: String = if voted {
        format!(
            "{}{}",
            env::var("NEXT_PUBLIC_WEB_URL").unwrap(),
            "/assets/Icon/Voted.png"
        )
    } else if &BulletinSection::Past == section {
        format!(
            "{}{}",
            env::var("NEXT_PUBLIC_WEB_URL").unwrap(),
            "/assets/Icon/DidntVote.png"
        )
    } else {
        format!(
            "{}{}",
            env::var("NEXT_PUBLIC_WEB_URL").unwrap(),
            "/assets/Icon/NotVotedYet.png"
        )
    };

    let dao_logo_url = format!(
        "{}{}{}",
        env::var("NEXT_PUBLIC_WEB_URL").unwrap(),
        proposal.dao.picture,
        "_medium.png"
    );

    let chain_logo_url: String = if proposal.daohandler.r#type == DaoHandlerType::Snapshot {
        format!(
            "{}{}",
            env::var("NEXT_PUBLIC_WEB_URL").unwrap(),
            "/assets/Chain/Snapshot/snapshot.png"
        )
    } else {
        format!(
            "{}{}",
            env::var("NEXT_PUBLIC_WEB_URL").unwrap(),
            "/assets/Chain/Ethereum/eth.png"
        )
    };

    println!("Links");
    println!("{}", chain_logo_url);
    println!("{}", dao_logo_url);
    println!("{}", voting_status_icon_url);

    let highest_score: HighestScore = get_highest_score(&proposal);
    let result = format_result(&proposal, highest_score.clone());

    let mut result_display = "hide".to_string();
    let mut maker_result_display = "hide".to_string();
    let mut hidden_result_display = "hide".to_string();

    if section == &BulletinSection::Past {
        if (highest_score.percentage == 0.0 && proposal.scorestotal.as_f64().unwrap() > 0.0) {
            hidden_result_display = "show".to_string();
            maker_result_display = "hide".to_string();
            result_display = "hide".to_string();
        } else if is_maker_executive_proposal(&proposal) {
            hidden_result_display = "hide".to_string();
            maker_result_display = "show".to_string();
            result_display = "hide".to_string();
        } else {
            hidden_result_display = "hide".to_string();
            maker_result_display = "hide".to_string();
            result_display = "show".to_string();
        }
    };

    let end_date_string = format!(
        "{}",
        proposal.timeend.format("%B %e, %y at %H:%M").to_string()
    );

    return Ok(EmailTemplateRow {
        voting_status: voting_status,
        voting_status_icon_url: voting_status_icon_url,
        proposal_name: proposal.name.clone(),
        proposal_url: proposal.url.clone(),
        dao_logo_url: dao_logo_url,
        chain_logo_url: chain_logo_url,
        dao_name: proposal.dao.name.clone(),
        end_date_string: end_date_string,
        countdown_url: countdown_url,
        result: result,
        generic_result_display: result_display,
        maker_result_display: maker_result_display,
        hidden_result_display: hidden_result_display,
    });
}

// fn format_maker_executive_result(
//     proposal: &proposal_w_dao,
//     highest_score: HighestScore,
// ) -> MakerExecutiveResult {
//     let result =
//         if proposal.state == ProposalState::Queued || proposal.state == ProposalState::Executed {
//             MakerExecutiveResult {
//                 checkbox_img_url: encode(
//                     format!(
//                         "{:?}{:?}",
//                         env::var("NEXT_PUBLIC_WEB_URL"),
//                         "/assets/Icon/VoteIcon-Check.png"
//                     )
//                     .as_str(),
//                 )
//                 .to_string(),
//                 result_text: "Passed".to_string(),
//                 mkr_support: (proposal.scorestotal.as_f64().unwrap() / 1e18).to_string(),
//             }
//         } else {
//             MakerExecutiveResult {
//                 checkbox_img_url: encode(
//                     format!(
//                         "{:?}{:?}",
//                         env::var("NEXT_PUBLIC_WEB_URL"),
//                         "/assets/Icon/VoteIcon-Cross.png"
//                     )
//                     .as_str(),
//                 )
//                 .to_string(),
//                 result_text: "Did not pass".to_string(),
//                 mkr_support: (proposal.scorestotal.as_f64().unwrap() / 1e18).to_string(),
//             }
//         };

//     return result;
// }

fn format_result(proposal: &proposal_w_dao, highest_score: HighestScore) -> BulletinResult {
    let result: BulletinResult = if is_maker_executive_proposal(&proposal) {
        if proposal.state == ProposalState::Queued || proposal.state == ProposalState::Executed {
            BulletinResult {
                passed_icon_url: format!(
                    "{}{}",
                    env::var("NEXT_PUBLIC_WEB_URL").unwrap(),
                    "/assets/Icon/VoteIcon-Check.png"
                ),
                highest_score_choice: "Passed".to_string(),
                highest_score_support: highest_score.support / 1e18,
                highest_score_percentage_display: "hide".to_string(),
                highest_score_percentage: 0.0,
                bar_width_percentage: 0,
            }
        } else {
            BulletinResult {
                passed_icon_url: format!(
                    "{}{}",
                    env::var("NEXT_PUBLIC_WEB_URL").unwrap(),
                    "/assets/Icon/VoteIcon-Cross.png"
                ),
                highest_score_choice: "Did not pass".to_string(),
                highest_score_support: highest_score.support / 1e18,
                highest_score_percentage_display: "hide".to_string(),
                highest_score_percentage: 0.0,
                bar_width_percentage: 0,
            }
        }
    } else {
        if proposal.scorestotal.as_f64() > proposal.quorum.as_f64() {
            BulletinResult {
                passed_icon_url: format!(
                    "{}{}",
                    env::var("NEXT_PUBLIC_WEB_URL").unwrap(),
                    "/assets/Icon/VoteIcon-Check.png"
                ),
                highest_score_choice: highest_score.choice,
                highest_score_support: highest_score.support,
                highest_score_percentage_display: "hide".to_string(),
                highest_score_percentage: highest_score.percentage,
                bar_width_percentage: highest_score.percentage as i64,
            }
        } else {
            BulletinResult {
                passed_icon_url: format!(
                    "{}{}",
                    env::var("NEXT_PUBLIC_WEB_URL").unwrap(),
                    "/assets/Icon/VoteIcon-Cross.png"
                ),
                highest_score_choice: highest_score.choice,
                highest_score_support: highest_score.support,
                highest_score_percentage_display: "hide".to_string(),
                highest_score_percentage: highest_score.percentage,
                bar_width_percentage: highest_score.percentage as i64,
            }
        }
    };

    return result;
}

fn get_highest_score(proposal: &proposal_w_dao) -> HighestScore {
    let (result_index, max_score) = proposal
        .scores
        .as_array()
        .unwrap()
        .iter()
        .map(|score| score.as_f64().unwrap())
        .enumerate()
        .max_by(|(_, a), (_, b)| a.partial_cmp(b).unwrap_or(Ordering::Equal))
        .unwrap_or((0, 0.0));

    if (max_score == 0.0 && proposal.scores.as_array().unwrap().len() == 0) {
        return HighestScore {
            choice: "".to_string(),
            support: 0.0,
            percentage: 0.0,
        };
    }

    HighestScore {
        choice: proposal.choices.as_array().unwrap()[result_index].to_string(),
        support: max_score,
        percentage: (max_score / proposal.scorestotal.as_f64().unwrap() * 100.0).round(),
    }
}

fn is_maker_executive_proposal(proposal: &proposal_w_dao) -> bool {
    return proposal.daohandler.r#type == DaoHandlerType::MakerExecutive;
}

async fn user_voted(
    db: &prisma::PrismaClient,
    user: &user_w_proxies_and_subs,
    proposal: &proposal_w_dao,
) -> Result<bool, Error> {
    let mut voted = false;
    for voter in user.voters.clone().into_iter() {
        let vote = db
            .vote()
            .find_first(vec![
                vote::voteraddress::equals(voter.address),
                vote::daoid::equals(proposal.daoid.clone()),
                vote::proposalid::equals(proposal.id.clone()),
            ])
            .exec()
            .await
            .unwrap();

        if (Option::is_some(&vote)) {
            voted = true;
        }
    }
    Ok(voted)
}

async fn generate_countdown_gif_url(
    end_time: DateTime<Utc>,
) -> Result<String, Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();
    let token = env::var("VOTING_COUNTDOWN_TOKEN")?;
    let mut retries = 10;

    let end_time_string = end_time.format("%Y-%m-%d %H:%M:%S").to_string();

    let url = "https://countdownmail.com/api/create";

    loop {
        match client
            .post(url)
            .header(reqwest::header::CONTENT_TYPE, "application/json")
            .header(reqwest::header::ACCEPT, "application/json")
            .header(reqwest::header::AUTHORIZATION, &token)
            .json(&json!({
                "skin_id": 6,
                "name": "Voting countdown",
                "time_end": &end_time_string,
                "time_zone": "UTC",
                "font_family": "Roboto-Medium",
                "label_font_family": "RobotoCondensed-Light",
                "color_primary": "000000",
                "color_text": "000000",
                "color_bg": "FFFFFF",
                "transparent": "0",
                "font_size": 26,
                "label_font_size": 8,
                "expired_mes_on": 1,
                "expired_mes": "Proposal Ended",
                "day": 1,
                "days": "days",
                "hours": "hours",
                "minutes": "minutes",
                "seconds": "seconds",
                "advanced_params": {
                    "separator_color": "FFFFFF",
                    "labels_color": "000000"
                }
            }))
            .send()
            .await
        {
            Ok(response) => {
                if response.status() == reqwest::StatusCode::OK {
                    let result: CountdownResponse = response.json().await?;
                    match &result.message {
                        Some(message) => match &message.src {
                            Some(src) => return Ok(src.to_string()),
                            None => {}
                        },
                        None => {}
                    }
                    break;
                }
            }
            Err(_) => {
                retries -= 1;
                if retries == 0 {
                    return Err("Max retries exceeded".into());
                }
                sleep(std::time::Duration::from_secs(60)).await;
            }
        }
    }

    Err("Unable to fetch countdown gif url".into())
}

async fn send_email(email_body: serde_json::Value) -> Result<bool, reqwest::Error> {
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

    let res = client
        .post("https://api.postmarkapp.com/email/withTemplate")
        .headers(headers)
        .json(&email_body)
        .send()
        .await?;

    let was_successful = res.status().is_success();

    let body = res.text().await?;

    println!("Body:\n\n{:#?}", body);

    return Ok(was_successful);
}
