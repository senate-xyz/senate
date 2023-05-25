#![allow(unused_imports)]
#![allow(unused_parens)]

pub mod prisma;

use validator::{validate_email}
use std::collections::HashMap;
use crate::prisma::{
    dao, notification, proposal, user, DaoHandlerType, MagicUserState, NotificationType,
};
use chrono::prelude::*;
use dotenv::dotenv;
use std::env;
use std::time::Duration;

use reqwest::header::{HeaderMap, ACCEPT, CONTENT_TYPE};
use reqwest::Error;
use serde::{Deserialize, Serialize};
use serde_json::json;
use tokio::time::sleep;

use num_format::{Locale, ToFormattedString};

#[derive(Serialize, Deserialize, Debug)]
pub struct GenericResult {
    checkbox_img_url: String,
    result_text: String,
    highest_score_percentage_display: String,
    highest_score_percentage: String,
    bar_width_percentage: f64,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct MakerExecutiveResult {
    checkbox_img_url: String,
    result_text: String,
    mkr_support: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct HighestScore {
    choice: String,
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
    end_hours_utc: String,
    end_minutes_utc: String,
    end_date_string: String,
    countdown_url: String,
    result: GenericResult,
    maker_result: MakerExecutiveResult,
    result_display: String,
    maker_result_display: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct BulletinData {
    todays_date: String,
    new_proposals: Vec<EmailTemplateRow>,
    ending_proposals: Vec<EmailTemplateRow>,
    past_proposals: Vec<EmailTemplateRow>,
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

#[tokio::main]
async fn main() {
    dotenv().ok();
    println!("Starting scheduler!");

    // Fetch users to be notified
    let db = prisma::new_client()
        .await
        .expect("Failed to create Prisma client");

    let user_email_data : HashMap<String, BulletinData> = HashMap::new();
    let proposal_countdown_url: HashMap<String, String> = HashMap::new();
    
    let users_to_be_notified = fetch_users_to_be_notified(&db).await.unwrap();
}

async fn fetch_users_to_be_notified(db: &prisma:PrismaClient) {
    // - email has email format (not empty does not work because now we have uuid() as placeholder)
    // - emaildailybulletin is true
    return db.user()
        .find_many(vec![
            user::emaildailybulletin::equals(true),
            user::subscriptions::some(subscriptions::notificationsenabled::equals(true))
        ])
        .include(user::include!({
            subscriptions: true
            voters: true
        }))
        .exec()
        .await
}
// async fn aave_quorum_email(db: &prisma::PrismaClient) {
//     let users_to_be_notified = db
//         .user()
//         .find_many(vec![user::isaaveuser::equals(MagicUserState::Enabled)])
//         .exec()
//         .await
//         .unwrap();

//     let proposals_ending_soon = db
//         .proposal()
//         .find_many(vec![
//             proposal::timeend::gt(Utc::now().into()),
//             proposal::timeend::lte((Utc::now() + chrono::Duration::hours(12)).into()),
//             proposal::dao::is(vec![dao::name::equals("Aave".to_string())]),
//         ])
//         .include(proposal::include!({ dao }))
//         .exec()
//         .await
//         .unwrap();

//     let proposals_to_notify_about: Vec<_> = proposals_ending_soon
//         .iter()
//         .filter(|&p| p.quorum.as_f64().unwrap() > p.scorestotal.as_f64().unwrap())
//         .collect();

//     // Insert notifications to be dispatched
//     for proposal in proposals_to_notify_about.iter() {
//         for user in users_to_be_notified.iter() {
//             db.notification()
//                 .upsert(
//                     notification::userid_proposalid_type(
//                         user.id.to_string(),
//                         proposal.id.to_string(),
//                         NotificationType::QuorumNotReachedEmail,
//                     ),
//                     notification::create(
//                         prisma::user::UniqueWhereParam::IdEquals(user.id.clone()),
//                         prisma::proposal::UniqueWhereParam::IdEquals(proposal.id.clone()),
//                         NotificationType::QuorumNotReachedEmail,
//                         vec![notification::dispatched::set(false)],
//                     ),
//                     vec![],
//                 )
//                 .exec()
//                 .await
//                 .unwrap();
//         }
//     }

//     // Fetch all notifications to dispatch
//     let notifications = db
//         .notification()
//         .find_many(vec![
//             notification::dispatched::equals(false),
//             notification::proposal::is(vec![proposal::dao::is(vec![dao::name::equals(
//                 "Aave".to_string(),
//             )])]),
//             notification::r#type::equals(NotificationType::QuorumNotReachedEmail),
//         ])
//         .include(notification::include!({
//             proposal: include {
//                 dao
//                 daohandler
//             }
//             user
//         }))
//         .exec()
//         .await
//         .unwrap();

//     let mut dispatched: Vec<NotificationId> = Vec::new();

//     for n in notifications.clone().into_iter() {
//         let countdown_gif_url = generate_countdown_gif_url(n.proposal.timeend.clone().into())
//             .await
//             .unwrap();

//         let email_body: EmailBody = EmailBody {
//             To: n.user.email.clone().expect("Empty email").to_string(),
//             From: "info@senatelabs.xyz".to_string(),
//             TemplateAlias: "aave-quorum".to_string(),
//             TemplateModel: 
//         };

//         let was_successfully_sent: Result<bool, Error> =
//             send_email(serde_json::to_value(&email_body).unwrap()).await;

//         match was_successfully_sent {
//             Ok(true) => {}
//             Ok(false) => {}
//             Err(_) => {}
//         }
//     }

//     let update_res = db
//         .notification()
//         .update_many(
//             vec![
//                 prisma::notification::userid::in_vec(
//                     dispatched.iter().map(|id| id.clone().userid).collect(),
//                 ),
//                 prisma::notification::proposalid::in_vec(
//                     dispatched.iter().map(|id| id.clone().proposalid).collect(),
//                 ),
//                 prisma::notification::r#type::equals(NotificationType::QuorumNotReachedEmail),
//             ],
//             vec![prisma::notification::dispatched::set(true)],
//         )
//         .exec()
//         .await
//         .unwrap();

//     println!("Finished");
// }

// async fn send_email(email_body: serde_json::Value) -> Result<bool, reqwest::Error> {
//     let client = reqwest::Client::new();

//     let mut headers = HeaderMap::new();
//     headers.insert(ACCEPT, "application/json".parse().unwrap());
//     headers.insert(CONTENT_TYPE, "application/json".parse().unwrap());
//     headers.insert(
//         "X-Postmark-Server-Token",
//         env::var("POSTMARK_TOKEN")
//             .expect("Missing Postmark Token")
//             .parse()
//             .unwrap(),
//     );

//     let res = client
//         .post("https://api.postmarkapp.com/email/withTemplate")
//         .headers(headers)
//         .json(&email_body)
//         .send()
//         .await?;

//     let was_successful = res.status().is_success();

//     let body = res.text().await?;

//     println!("Body:\n\n{:#?}", body);

//     return Ok(was_successful);
// }

// async fn generate_countdown_gif_url(
//     end_time: DateTime<Utc>,
// ) -> Result<String, Box<dyn std::error::Error>> {
//     let client = reqwest::Client::new();
//     let token = env::var("VOTING_COUNTDOWN_TOKEN")?;
//     let mut retries = 10;

//     let end_time_string = end_time.format("%Y-%m-%d %H:%M:%S").to_string();

//     let url = "https://countdownmail.com/api/create";

//     loop {
//         match client
//             .post(url)
//             .header(reqwest::header::CONTENT_TYPE, "application/json")
//             .header(reqwest::header::ACCEPT, "application/json")
//             .header(reqwest::header::AUTHORIZATION, &token)
//             .json(&json!({
//                 "skin_id": 6,
//                 "name": "Voting countdown",
//                 "time_end": &end_time_string,
//                 "time_zone": "UTC",
//                 "font_family": "Roboto-Medium",
//                 "label_font_family": "RobotoCondensed-Light",
//                 "color_primary": "000000",
//                 "color_text": "000000",
//                 "color_bg": "FFFFFF",
//                 "transparent": "0",
//                 "font_size": 26,
//                 "label_font_size": 8,
//                 "expired_mes_on": 1,
//                 "expired_mes": "Proposal Ended",
//                 "day": 0,
//                 "hours": "hours",
//                 "minutes": "minutes",
//                 "seconds": "seconds",
//                 "advanced_params": {
//                     "separator_color": "FFFFFF",
//                     "labels_color": "000000"
//                 }
//             }))
//             .send()
//             .await
//         {
//             Ok(response) => {
//                 if response.status() == reqwest::StatusCode::OK {
//                     let result: CountdownResponse = response.json().await?;
//                     match &result.message {
//                         Some(message) => match &message.src {
//                             Some(src) => return Ok(src.to_string()),
//                             None => {}
//                         },
//                         None => {}
//                     }
//                     break;
//                 }
//             }
//             Err(_) => {
//                 retries -= 1;
//                 if retries == 0 {
//                     return Err("Max retries exceeded".into());
//                 }
//                 sleep(Duration::from_secs(10)).await;
//             }
//         }
//     }

//     Err("Unable to fetch countdown gif url".into())
// }
