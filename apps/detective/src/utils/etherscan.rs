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

#[instrument(skip(ctx), ret, level = "info")]
pub async fn estimate_timestamp(block_number: i64, ctx: &Context) -> Result<DateTime<Utc>> {
    let etherscan_api_key = env::var("ETHERSCAN_API_KEY").expect("$ETHERSCAN_API_KEY is not set");
    let rpc_url = env::var("ALCHEMY_NODE_URL").expect("$ALCHEMY_NODE_URL is not set");

    let provider = Provider::<Http>::try_from(rpc_url).unwrap();

    let current_block = provider.get_block_number().await.unwrap();

    if block_number < current_block.as_u64().to_i64().unwrap() {
        let block = provider
            .get_block(block_number.to_u64().unwrap())
            .await
            .unwrap();

        let result: DateTime<Utc> = DateTime::from_utc(
            NaiveDateTime::from_timestamp_millis(
                block.unwrap().timestamp.as_u64().to_i64().unwrap() * 1000,
            )
            .expect("bad timestamp"),
            Utc,
        );

        event!(Level::DEBUG, "{:?}", result);
        return Ok(result);
    }

    let mut retries = 0;

    let retry_policy = ExponentialBackoff::builder().build_with_max_retries(5);
    let http_client = ClientBuilder::new(reqwest::Client::new())
        .with(RetryTransientMiddleware::new_with_policy(retry_policy))
        .build();

    loop {
        let response = http_client
            .get(format!(
                "https://api.etherscan.io/api?module=block&action=getblockcountdown&blockno={}&apikey={}",
                block_number, etherscan_api_key
            ))
            .timeout(std::time::Duration::from_secs(10))
            .send()
            .instrument(debug_span!("etherscan_api_call"))
            .await;

        match response {
            Ok(res) => {
                let contents = res.text().await?;
                let data = match serde_json::from_str::<EstimateTimestamp>(&contents) {
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
                    Err(_) => bail!("Unable to deserialize etherscan response."),
                };

                event!(Level::DEBUG, "{:?}", data);
                return Ok(data);
            }

            _ if retries < 15 => {
                retries += 1;
                let backoff_duration = std::time::Duration::from_millis(2u64.pow(retries as u32));
                tokio::time::sleep(backoff_duration).await;
            }
            _ => {
                event!(Level::WARN, "Could not get result");
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

#[instrument(skip(ctx), ret, level = "info")]
pub async fn estimate_block(timestamp: i64, ctx: &Context) -> Result<i64> {
    let etherscan_api_key = match env::var_os("ETHERSCAN_API_KEY") {
        Some(v) => v.into_string().unwrap(),
        None => panic!("$ETHERSCAN_API_KEY is not set"),
    };

    let mut retries = 0;

    let retry_policy = ExponentialBackoff::builder().build_with_max_retries(5);
    let http_client = ClientBuilder::new(reqwest::Client::new())
        .with(RetryTransientMiddleware::new_with_policy(retry_policy))
        .build();

    loop {
        let response = http_client
            .get(format!(
                "https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp={}&closest=before&apikey={}",
                timestamp, etherscan_api_key
            ))
            .timeout(std::time::Duration::from_secs(10))
            .send()
            .instrument(debug_span!("etherscan_api_call"))
            .await;

        match response {
            Ok(res) => {
                let contents = res.text().await?;
                let data = match serde_json::from_str::<EstimateBlock>(&contents) {
                    Ok(d) => d.result.parse::<i64>().unwrap(),
                    Err(_) => i64::from(0),
                };

                event!(Level::DEBUG, "{}", data);
                return Ok(data);
            }

            _ if retries < 5 => {
                retries += 1;
                let backoff_duration = std::time::Duration::from_millis(2u64.pow(retries as u32));
                tokio::time::sleep(backoff_duration).await;
            }
            _ => {
                event!(Level::WARN, "Could not get result");
                return Ok(i64::from(0));
            }
        }
    }
}

// #[cfg(test)]
// mod tests {
//     use crate::utils::etherscan::{estimate_block, estimate_timestamp};
//     use chrono::{DateTime, NaiveDateTime, Utc};
//     use dotenv::dotenv;

//     #[tokio::test]
//     async fn get_block_timestamp() {
//         dotenv().ok();

//         let result = estimate_timestamp(18000000).await.unwrap();

//         assert_eq!(
//             result,
//             DateTime::<Utc>::from_utc(
//                 NaiveDateTime::from_timestamp_millis(Utc::now().timestamp() * 1000)
//                     .expect("bad timestamp"),
//                 Utc,
//             ),
//         );
//     }

//     #[tokio::test]
//     async fn get_block() {
//         dotenv().ok();

//         let result = estimate_block(1681908547).await.unwrap();

//         assert_eq!(result, 17080747);
//     }
// }
