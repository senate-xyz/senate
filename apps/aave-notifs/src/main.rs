#![allow(unused_imports)]
#![allow(unused_parens)]

pub mod prisma;

use crate::prisma::{dao, notification, proposal, user, NotificationType};
use dotenv::dotenv;
use prisma_client_rust::chrono::{self, Utc};
use std::env;

use reqwest::header::{HeaderMap, ACCEPT, CONTENT_TYPE};
use reqwest::Error;
use serde::{Deserialize, Serialize};
use serde_json::json;

/*
    Plan B (assumption: the notifications table has composite key (userId, proposalId))
        - we fetch proposals which
                - are ending in the next 12 hours
                - haven't reached quorum / differential yet
        - push all proposal notifications to the notifications table.
             Note: Some of them won't be added because they already exist
                       ,whether they have been dispatched or not
        - fetch all notifications which haven't been dispatched
        - send email. if successful -> set dispatched = true
*/
#[derive(Serialize, Deserialize)]
struct TemplateModel {
    quorum: String,
    total_score: String,
    countdown_url: String,
}

#[derive(Serialize, Deserialize)]
struct EmailBody {
    to: String,
    from: String,
    template_alias: String,
    template_model: TemplateModel,
}

#[derive(Clone)]
struct NotificationId {
    userid: String,
    proposalid: String,
}

#[tokio::main]
async fn main() {
    dotenv().ok();
    println!("Starting scheduler!");

    // Fetch users to be notified
    let db = prisma::new_client()
        .await
        .expect("Failed to create Prisma client");

    let users_to_be_notified = db
        .user()
        .find_many(vec![user::isaaveuser::equals(true)])
        .exec()
        .await
        .unwrap();

    // Fetch proposals to notify about
    let proposals_ending_soon = db
        .proposal()
        .find_many(vec![
            proposal::timeend::gt(Utc::now().into()),
            proposal::timeend::lte((Utc::now() + chrono::Duration::hours(12)).into()),
            proposal::dao::is(vec![dao::name::equals("Aave".to_string())]),
        ])
        .include(proposal::include!({ dao }))
        .exec()
        .await
        .unwrap();

    let proposals_to_notify_about: Vec<_> = proposals_ending_soon
        .iter()
        .filter(|&p| p.quorum.as_f64().unwrap() > p.scorestotal.as_f64().unwrap())
        .collect();

    // Insert notifications to be dispatched
    for proposal in proposals_to_notify_about.iter() {
        for user in users_to_be_notified.iter() {
            db.notification()
                .upsert(
                    notification::userid_proposalid_type(
                        user.id.to_string(),
                        proposal.id.to_string(),
                        NotificationType::QuorumNotReachedEmail,
                    ),
                    notification::create(
                        prisma::user::UniqueWhereParam::IdEquals(user.id.clone()),
                        prisma::proposal::UniqueWhereParam::IdEquals(proposal.id.clone()),
                        NotificationType::QuorumNotReachedEmail,
                        vec![notification::dispatched::set(false)],
                    ),
                    vec![],
                )
                .exec()
                .await
                .unwrap();
        }
    }

    // Fetch all notifications to dispatch
    let notifications = db
        .notification()
        .find_many(vec![
            notification::dispatched::equals(false),
            notification::proposal::is(vec![proposal::dao::is(vec![dao::name::equals(
                "Aave".to_string(),
            )])]),
            notification::r#type::equals(NotificationType::QuorumNotReachedEmail),
        ])
        .include(notification::include!({
            proposal: include {
                dao
            }
            user
        }))
        .exec()
        .await
        .unwrap();

    let mut dispatched: Vec<NotificationId> = Vec::new();

    for n in notifications.clone().into_iter() {
        // Send email to n.user.email
        let email_body: EmailBody = EmailBody {
            to: n.user.email.clone(),
            from: "info@senatelabs.xyz".to_string(),
            template_alias: "aave-quorum".to_string(),
            template_model: TemplateModel {
                quorum: n.proposal.quorum.clone().to_string(),
                total_score: n.proposal.scorestotal.clone().to_string(),
                countdown_url: "".to_string(),
            },
        };

        let was_successfully_sent: Result<bool, Error> =
            send_email(serde_json::to_value(&email_body).unwrap()).await;

        match was_successfully_sent {
            Ok(true) => dispatched.push(NotificationId {
                userid: n.user.id.clone(),
                proposalid: n.proposal.id.clone(),
            }),
            Ok(false) => {}
            Err(_) => {}
        }
    }

    db.notification().update_many(
        vec![
            prisma::notification::userid::in_vec(
                dispatched.iter().map(|id| id.clone().userid).collect(),
            ),
            prisma::notification::proposalid::in_vec(
                dispatched.iter().map(|id| id.clone().proposalid).collect(),
            ),
            prisma::notification::r#type::equals(NotificationType::QuorumNotReachedEmail),
        ],
        vec![prisma::notification::dispatched::set(true)],
    );

    println!("Finished");
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
