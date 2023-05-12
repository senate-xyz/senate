#[allow(warnings, unused)]
pub mod prisma;

use crate::prisma::{user, proposal, notification, dao};
use prisma_client_rust::chrono::{self, Utc};
use dotenv::dotenv;
use std::env;

use reqwest::header::{HeaderMap, CONTENT_TYPE, ACCEPT};
use reqwest::Error;
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
            proposal::dao::is(vec![
                dao::name::equals("Aave".to_string()) 
            ])
        ])
        .include(proposal::include!({
            dao
        }))
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
            db.notification().upsert(
                notification::userid_proposalid(user.id.to_string(), proposal.id.to_string()),
                notification::create(
                    prisma::user::UniqueWhereParam::IdEquals(user.id.clone()),
                    prisma::proposal::UniqueWhereParam::IdEquals(proposal.id.clone()),
                    vec![notification::dispatched::set(false)]
                ),
                vec![]
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
            notification::proposal::is(vec![
                proposal::dao::is(vec![
                    dao::name::equals("Aave".to_string()),
                ])
            ])
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

    
    for n in notifications.iter() {
        // Send email to n.user.email
        // send_email().await;

        // If email was successfully sent, set dispatched=true
    }
  
    println!("Finished");
}

async fn send_email() {
    let client = reqwest::Client::new();

    let mut headers = HeaderMap::new();
    headers.insert(ACCEPT, "application/json".parse().unwrap());
    headers.insert(CONTENT_TYPE, "application/json".parse().unwrap());
    headers.insert("X-Postmark-Server-Token", env::var("POSTMARK_TOKEN").expect("Missing Postmark Token").parse().unwrap());

    let res = client.post("https://api.postmarkapp.com/email")
        .headers(headers)
        .json(&json!({
            "From": "info@senatelabs.xyz",
            "To": "info@senatelabs.xyz",
            "Subject": "Postmark test",
            "TextBody": "Hello dear Postmark user.",
            "HtmlBody": "<html><body><strong>Hello</strong> dear Postmark user.</body></html>",
            "MessageStream": "outbound"
        }))
        .send()
        .await;

    let body = res.expect("Missing response").text().await;

    println!("Body:\n\n{:#?}", body);
}