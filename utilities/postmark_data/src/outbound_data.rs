use std::env;

use reqwest_middleware::ClientBuilder;
use reqwest_retry::{policies::ExponentialBackoff, RetryTransientMiddleware};
use serde_derive::Deserialize;
use serde_json::Value;

#[allow(non_snake_case)]
#[derive(Debug, Clone, Deserialize)]
struct OutboundData {
    Messages: Vec<OutboundMessage>,
}

#[allow(non_snake_case)]
#[derive(Debug, Clone, Deserialize)]
struct OutboundMessage {
    MessageID: Value,
    To: Vec<OutboundMessageTo>,
    Subject: Value,
    ReceivedAt: Value,
    Status: Value,
}

#[allow(non_snake_case)]
#[derive(Debug, Clone, Deserialize)]
struct OutboundMessageTo {
    Email: Value,
}

pub async fn outbound_data() {
    let mut wtr = csv::Writer::from_path("outbound_data.csv").unwrap();
    let mut end = false;
    let mut offset = 0;

    wtr.write_record(&["MessageID", "To", "Subject", "ReceivedAt", "Status"])
        .unwrap();

    while !end {
        let token = match env::var_os("POSTMARK_TOKEN") {
            Some(v) => v.into_string().unwrap(),
            None => panic!("$POSTMARK_TOKEN is not set"),
        };

        let retry_policy = ExponentialBackoff::builder().build_with_max_retries(5);

        let http_client = ClientBuilder::new(reqwest::Client::new())
            .with(RetryTransientMiddleware::new_with_policy(retry_policy))
            .build();

        let postmark_response = http_client
            .get(format!(
                "https://api.postmarkapp.com/messages/outbound?count=500&offset={}",
                offset
            ))
            .header("X-Postmark-Server-Token", token)
            .header("Accept", "application/json")
            .send()
            .await;

        let postmark_data: OutboundData = postmark_response.unwrap().json().await.unwrap();

        for row in postmark_data.clone().Messages {
            wtr.write_record(vec![
                row.MessageID.as_str().unwrap(),
                row.To[0].Email.as_str().unwrap(),
                row.Subject.as_str().unwrap(),
                row.ReceivedAt.as_str().unwrap(),
                row.Status.as_str().unwrap(),
            ])
                .unwrap();
        }

        if postmark_data.Messages.len() > 0 {
            offset = offset + 500;
        } else {
            end = true;
        }
    }
    wtr.flush().unwrap();
}
