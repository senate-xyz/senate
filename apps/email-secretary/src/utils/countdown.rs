use std::env;

use anyhow::{bail, Result};
use chrono::{DateTime, Duration, Utc};
use serde::Deserialize;
use serde_json::json;
use tokio::time::sleep;

#[derive(Deserialize, Debug)]
struct CountdownResponse {
    message: Option<Message>,
}

#[derive(Deserialize, Debug)]
struct Message {
    src: Option<String>,
}

pub async fn countdown_gif(end_time: DateTime<Utc>, with_days: bool) -> Result<String> {
    let client = reqwest::Client::new();
    let token = env::var("VOTING_COUNTDOWN_TOKEN")?;
    let mut retries = 10;

    let end_time_string = end_time.format("%Y-%m-%d %H:%M:%S").to_string();

    let url = "https://countdownmail.com/api/create";

    let more_than_one_day = end_time.signed_duration_since(Utc::now()) > Duration::days(1);
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
                "day": if !with_days && !more_than_one_day {0} else {1},
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
                    bail!("Max retries exceeded");
                }
                sleep(std::time::Duration::from_secs(60)).await;
            }
        }
    }

    bail!("Unable to fetch countdown gif url")
}
