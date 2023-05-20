#![allow(unused_imports)]
#![allow(unused_parens)]

pub mod prisma;

use crate::prisma::{user, MagicUserState};
use dotenv::dotenv;
use std::env;

use reqwest::header::{HeaderMap, ACCEPT, CONTENT_TYPE};
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
        .find_many(vec![user::isaaveuser::equals(MagicUserState::Enabled)])
        .exec()
        .await
        .unwrap();

    // ================================
    // Fetch aave proposals
    // ================================

    // ================================
    // Generate countdown
    // ================================

    // Send email
    send_email().await;

    println!("Finished");
}

async fn send_email() {
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
        .post("https://api.postmarkapp.com/email")
        .headers(headers)
        .json(&json!({
            "From": "info@senatelabs.xyz",
            "To": "infor@senatelabs.xyz",
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
