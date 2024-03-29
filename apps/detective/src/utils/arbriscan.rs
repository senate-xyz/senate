use std::env;

use anyhow::{bail, Result};
use chrono::{DateTime, NaiveDateTime, Utc};
use ethers::providers::{Http, Middleware, Provider};
use prisma_client_rust::bigdecimal::ToPrimitive;
use reqwest::Client;
use reqwest_middleware::ClientBuilder;
use reqwest_retry::{policies::ExponentialBackoff, RetryTransientMiddleware};
use serde::Deserialize;
use tracing::{debug_span, event, info, instrument, Instrument, Level};

use crate::Context;

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

#[instrument(ret)]
pub async fn estimate_timestamp(block_number: i64) -> Result<DateTime<Utc>> {
    let etherscan_api_key = env::var("ARBISCAN_API_KEY").expect("$ARBISCAN_API_KEY is not set");
    let rpc_url = env::var("ARBITRUM_NODE_URL").expect("$ARBITRUM_NODE_URL is not set");

    let provider = Provider::<Http>::try_from(rpc_url)?;

    let current_block = provider.get_block_number().await?;

    if block_number < current_block.as_u64().to_i64().unwrap() {
        let block = provider.get_block(block_number.to_u64().unwrap()).await?;

        let result: DateTime<Utc> = DateTime::from_naive_utc_and_offset(
            NaiveDateTime::from_timestamp_millis(
                block.unwrap().timestamp.as_u64().to_i64().unwrap() * 1000,
            )
            .expect("bad timestamp"),
            Utc,
        );

        return Ok(result);
    }

    let mut retries = 0;

    let retry_policy = ExponentialBackoff::builder().build_with_max_retries(5);
    let http_client = ClientBuilder::new(reqwest::Client::new())
        .with(RetryTransientMiddleware::new_with_policy(retry_policy))
        .build();

    event!(
        Level::INFO,
        block_number = block_number,
        url = format!(
                "https://api.arbiscan.io/api?module=block&action=getblockcountdown&blockno={}&apikey={}",
                block_number, etherscan_api_key
            ),
        "estimate_timestamp"
        );

    loop {
        let response = http_client
            .get(format!(
                "https://api.arbiscan.io/api?module=block&action=getblockcountdown&blockno={}&apikey={}",
                block_number, etherscan_api_key
            ))
            .timeout(std::time::Duration::from_secs(10))
            .send()
            .await;

        match response {
            Ok(res) => {
                let contents = res.text().await?;
                let data = match serde_json::from_str::<EstimateTimestamp>(&contents) {
                    Ok(d) => DateTime::from_naive_utc_and_offset(
                        NaiveDateTime::from_timestamp_millis(
                            Utc::now().timestamp() * 1000
                                + d.result.EstimateTimeInSec.parse::<f64>()?.to_i64().unwrap()
                                    * 1000,
                        )
                        .expect("bad timestamp"),
                        Utc,
                    ),
                    Err(_) => bail!("Unable to deserialize etherscan response."),
                };

                return Ok(data);
            }

            _ if retries < 15 => {
                retries += 1;
                let backoff_duration = std::time::Duration::from_millis(2u64.pow(retries as u32));
                tokio::time::sleep(backoff_duration).await;
            }
            _ => {
                return Ok(DateTime::from_naive_utc_and_offset(
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

#[instrument(ret)]
pub async fn estimate_block(timestamp: i64) -> Result<i64> {
    let etherscan_api_key = match env::var_os("ARBISCAN_API_KEY") {
        Some(v) => v.into_string().unwrap(),
        None => panic!("$ARBISCAN_API_KEY is not set"),
    };

    let mut retries = 0;

    let retry_policy = ExponentialBackoff::builder().build_with_max_retries(5);
    let http_client = ClientBuilder::new(reqwest::Client::new())
        .with(RetryTransientMiddleware::new_with_policy(retry_policy))
        .build();

    event!(
            Level::INFO,
            timestamp = timestamp,
            url = format!(
                "https://api.arbiscan.io/api?module=block&action=getblocknobytime&timestamp={}&closest=before&apikey={}",
                timestamp, etherscan_api_key
            ),
            "estimate_block"
        );

    loop {
        let response = http_client
            .get(format!(
                "https://api.arbiscan.io/api?module=block&action=getblocknobytime&timestamp={}&closest=before&apikey={}",
                timestamp, etherscan_api_key
            ))
            .timeout(std::time::Duration::from_secs(10))
            .send()
            .await;

        match response {
            Ok(res) => {
                let contents = res.text().await?;
                let data = match serde_json::from_str::<EstimateBlock>(&contents) {
                    Ok(d) => d.result.parse::<i64>().unwrap_or(0),
                    Err(_) => {
                        event!(
                            Level::ERROR,
                            timestamp = timestamp,
                            url = format!(
                                "https://api.arbiscan.io/api?module=block&action=getblocknobytime&timestamp={}&closest=before&apikey={}",
                                timestamp, etherscan_api_key
                            ),
                            "estimate_block"
                        );

                        i64::from(0)
                    }
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
