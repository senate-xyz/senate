use anyhow::{Context, Result};
use chrono::{DateTime, NaiveDateTime, Utc};
use prisma_client_rust::bigdecimal::ToPrimitive;
use reqwest::Client;
use serde::Deserialize;
use std::env;

#[allow(dead_code, non_snake_case)]
#[derive(Deserialize, PartialEq, Debug)]
pub struct EstimateTimestampResult {
    CurrentBlock: String,
    CountdownBlock: String,
    RemainingBlock: String,
    EstimateTimeInSec: String,
}

#[allow(dead_code, non_snake_case)]
#[derive(Deserialize, PartialEq, Debug)]
pub struct EstimateTimestamp {
    status: String,
    message: String,
    result: EstimateTimestampResult,
}

pub async fn estimate_timestamp(block_number: i64) -> Result<DateTime<Utc>> {
    let etherscan_api_key = match env::var_os("ETHERSCAN_API_KEY") {
        Some(v) => v.into_string().unwrap(),
        None => panic!("$ETHERSCAN_API_KEY is not set"),
    };

    let client = Client::new();
    let mut retries = 0;

    println!(
        "https://api.etherscan.io/api?module=block&action=getblockcountdown&blockno={}&apikey={}",
        block_number, etherscan_api_key
    );

    loop {
        let response = client
            .get(format!(
                "https://api.etherscan.io/api?module=block&action=getblockcountdown&blockno={}&apikey={}",
                block_number, etherscan_api_key
            ))
            .timeout(std::time::Duration::from_secs(5))
            .send()
            .await;

        match response {
            Ok(res) => {
                let contents = res.text().await?;
                let data =
                    match serde_json::from_str::<EstimateTimestamp>(&contents).with_context(|| {
                        format!("Unable to deserialise response. Body was: \"{}\"", contents)
                    }) {
                        Ok(d) => DateTime::from_utc(
                            NaiveDateTime::from_timestamp_millis(
                                Utc::now().timestamp() * 1000
                                    + d.result
                                        .EstimateTimeInSec
                                        .parse::<f64>()
                                        .unwrap()
                                        .to_i64()
                                        .unwrap()
                                        * 1000,
                            )
                            .expect("bad timestamp"),
                            Utc,
                        ),
                        Err(_) => DateTime::from_utc(
                            NaiveDateTime::from_timestamp_millis(Utc::now().timestamp() * 1000)
                                .expect("bad timestamp"),
                            Utc,
                        ),
                    };

                return Ok(data);
            }

            _ if retries < 5 => {
                retries += 1;
                let backoff_duration = std::time::Duration::from_millis(2u64.pow(retries as u32));
                tokio::time::sleep(backoff_duration).await;
            }
            _ => {
                return Ok(DateTime::from_utc(
                    NaiveDateTime::from_timestamp_millis(Utc::now().timestamp() * 1000)
                        .expect("bad timestamp"),
                    Utc,
                ));
            }
        }
    }
}

#[allow(dead_code, non_snake_case)]
#[derive(Deserialize, PartialEq, Debug)]
pub struct EstimateBlock {
    status: String,
    message: String,
    result: String,
}

pub async fn estimate_block(timestamp: i64) -> Result<i64> {
    let etherscan_api_key = match env::var_os("ETHERSCAN_API_KEY") {
        Some(v) => v.into_string().unwrap(),
        None => panic!("$ETHERSCAN_API_KEY is not set"),
    };

    let client = Client::new();
    let mut retries = 0;

    loop {
        let response = client
            .get(format!(
                "https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp={}&closest=before&apikey={}",
                timestamp, etherscan_api_key
            ))
            .timeout(std::time::Duration::from_secs(5))
            .send()
            .await;

        match response {
            Ok(res) => {
                let contents = res.text().await?;
                let data =
                    match serde_json::from_str::<EstimateBlock>(&contents).with_context(|| {
                        format!("Unable to deserialise response. Body was: \"{}\"", contents)
                    }) {
                        Ok(d) => d.result.parse::<i64>().unwrap(),
                        Err(_) => i64::from(0),
                    };

                return Ok(data);
            }

            _ if retries < 5 => {
                retries += 1;
                let backoff_duration = std::time::Duration::from_millis(2u64.pow(retries as u32));
                tokio::time::sleep(backoff_duration).await;
            }
            _ => {
                return Ok(i64::from(0));
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::utils::etherscan::{estimate_block, estimate_timestamp};
    use chrono::{DateTime, NaiveDateTime, Utc};
    use dotenv::dotenv;

    #[tokio::test]
    async fn get_block_timestamp() {
        dotenv().ok();

        let result = estimate_timestamp(18000000).await.unwrap();

        assert_eq!(
            result,
            DateTime::<Utc>::from_utc(
                NaiveDateTime::from_timestamp_millis(Utc::now().timestamp() * 1000)
                    .expect("bad timestamp"),
                Utc,
            ),
        );
    }

    #[tokio::test]
    async fn get_block() {
        dotenv().ok();

        let result = estimate_block(1681908547).await.unwrap();

        assert_eq!(result, 17080747);
    }
}
