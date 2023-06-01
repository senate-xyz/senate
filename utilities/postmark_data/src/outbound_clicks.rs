use std::env;

use reqwest_middleware::ClientBuilder;
use reqwest_retry::{policies::ExponentialBackoff, RetryTransientMiddleware};
use serde_derive::Deserialize;
use serde_json::Value;

#[allow(non_snake_case)]
#[derive(Debug, Clone, Deserialize)]
struct OutboundClicks {
    Clicks: Vec<Click>,
}

#[allow(non_snake_case)]
#[derive(Debug, Clone, Deserialize)]
struct Click {
    MessageID: Value,
    Recipient: Value,
    ReceivedAt: Value,
    ClickLocation: Value,
    OriginalLink: Value,
    Client: Value,
    OS: Value,
    Platform: Value,
    UserAgent: Value,
    Geo: Value,
}

pub async fn outbound_clicks() {
    let mut wtr = csv::Writer::from_path("outbound_clicks.csv").unwrap();
    let mut end = false;
    let mut offset = 0;

    wtr.write_record(&[
        "MessageID",
        "Recipient",
        "ReceivedAt",
        "ClickLocation",
        "OriginalLink",
        "Client",
        "Os",
        "Platform",
        "Agent",
        "Geo",
    ])
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
                "https://api.postmarkapp.com/messages/outbound/clicks?count=500&offset={}",
                offset
            ))
            .header("X-Postmark-Server-Token", token)
            .header("Accept", "application/json")
            .send()
            .await;

        let postmark_data: OutboundClicks = postmark_response.unwrap().json().await.unwrap();

        for row in postmark_data.clone().Clicks {
            wtr.write_record(vec![
                row.MessageID.as_str().unwrap_or("unknown"),
                row.Recipient.as_str().unwrap_or("unknown"),
                row.ReceivedAt.as_str().unwrap_or("unknown"),
                row.ClickLocation.as_str().unwrap_or("unknown"),
                row.OriginalLink.as_str().unwrap_or("unknown"),
                row.Client.as_str().unwrap_or("unknown"),
                row.OS.as_str().unwrap_or("unknown"),
                row.Platform.as_str().unwrap_or("unknown"),
                row.UserAgent.as_str().unwrap_or("unknown"),
                row.Geo.as_str().unwrap_or("unknown"),
            ])
            .unwrap();
        }

        if postmark_data.Clicks.len() > 0 {
            offset = offset + 500;
        } else {
            end = true;
        }
        println!("{:?}", postmark_data);
    }
    wtr.flush().unwrap();
}
