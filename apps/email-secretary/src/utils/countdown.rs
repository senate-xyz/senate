use std::{env, sync::Arc};

use anyhow::{bail, Result};
use chrono::{DateTime, Duration, Utc};
use once_cell::sync::Lazy;
use reqwest::{Client, StatusCode};
use reqwest_middleware::{ClientBuilder, ClientWithMiddleware};
use reqwest_retry::{policies::ExponentialBackoff, RetryTransientMiddleware};
use serde::Deserialize;
use serde_json::json;
use tokio::{sync::Mutex, time::sleep};
use tracing::{info, instrument, warn};

#[derive(Deserialize, Debug)]
struct CountdownResponse {
    message: Option<Message>,
}

#[derive(Deserialize, Debug)]
struct Message {
    src: Option<String>,
}

pub struct CountdownCache {
    pub end_time: DateTime<Utc>,
    pub with_days: bool,
    pub url: String,
}

pub static COUNTDOWN_CACHE: Lazy<Arc<Mutex<Vec<CountdownCache>>>> =
    Lazy::new(|| Arc::new(Mutex::new(Vec::new())));

#[instrument(ret, level = "debug")]
pub async fn countdown_gif(end_time: DateTime<Utc>, with_days: bool) -> Result<String> {
    let mut countdown_cache = COUNTDOWN_CACHE.lock().await;

    countdown_cache.retain(|c| c.end_time >= Utc::now() - chrono::Duration::hours(1));

    if let Some(cache_entry) = countdown_cache
        .iter()
        .find(|c| c.end_time == end_time && c.with_days == with_days)
    {
        return Ok(cache_entry.url.clone());
    }

    let retry_policy = ExponentialBackoff::builder().build_with_max_retries(10);
    let http_client = ClientBuilder::new(reqwest::Client::new())
        .with(RetryTransientMiddleware::new_with_policy(retry_policy))
        .build();

    let token = env::var("VOTING_COUNTDOWN_TOKEN")?;

    let end_time_string = end_time.format("%Y-%m-%d %H:%M:%S").to_string();

    let url = "https://countdownmail.com/api/create";

    let more_than_one_day = end_time.signed_duration_since(Utc::now()) > Duration::days(1);
    loop {
        match http_client
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
                            Some(src) => {
                                countdown_cache.push(CountdownCache {
                                    end_time,
                                    with_days,
                                    url: src.to_string(),
                                });
                                return Ok(src.to_string());
                            }
                            None => {}
                        },
                        None => {}
                    }
                    break;
                }
            }
            Err(e) => {
                warn!("countdown api err: {:?}", e);
            }
        }
    }

    bail!("Unable to fetch countdown gif url")
}
