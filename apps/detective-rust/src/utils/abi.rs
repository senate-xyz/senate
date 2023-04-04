use std::{ env, time::Duration };

use reqwest_middleware::ClientBuilder;
use reqwest_retry::{ policies::ExponentialBackoff, RetryTransientMiddleware };
use serde::Deserialize;
use serde_json::Value;

use crate::{ Ctx, prisma::contract };

pub enum Network {
    ETHEREUM,
    ARBITRUM,
}

#[derive(Deserialize, Debug)]
struct ApiResponse {
    status: String,
    message: String,
    result: Value,
}

pub async fn get_abi(address: String, network: Network, ctx: &Ctx) -> String {
    let contract = ctx.db
        .contract()
        .find_first(vec![contract::address::equals(address.clone())])
        .exec().await
        .unwrap();

    match contract {
        Some(contract) => contract.abi,
        None => {
            let base_url = match network {
                Network::ETHEREUM => "https://api.etherscan.io",
                Network::ARBITRUM => "https://api.arbiscan.io",
            };

            let api_key = match network {
                Network::ETHEREUM =>
                    match env::var_os("ETHERSCAN_API_KEY") {
                        Some(v) => v.into_string().unwrap(),
                        None => panic!("$ETHERSCAN_API_KEY is not set"),
                    }
                Network::ARBITRUM =>
                    match env::var_os("ARBISCAN_API_KEY") {
                        Some(v) => v.into_string().unwrap(),
                        None => panic!("$ARBISCAN_API_KEY is not set"),
                    }
            };

            let api_url = format!(
                "{}/api?module=contract&action=getabi&address={}&apikey={}",
                base_url,
                address,
                api_key
            ).to_string();

            let retry_policy = ExponentialBackoff::builder().build_with_max_retries(3);
            let http_client = ClientBuilder::new(reqwest::Client::new())
                .with(RetryTransientMiddleware::new_with_policy(retry_policy))
                .build();
            println!("{:?}", api_url);

            loop {
                let response = http_client.get(api_url.clone()).send().await;
                match response {
                    Ok(res) => {
                        let data: ApiResponse = res.json().await.unwrap();
                        if data.message == "OK" {
                            let _ = ctx.db
                                .contract()
                                .create(address, data.result.to_string(), vec![])
                                .exec().await;

                            return data.result.to_string();
                        }
                    }
                    Err(_) => {}
                }
                // Wait for a short amount of time before retrying
                tokio::time::sleep(Duration::from_secs(1)).await;
            }
        }
    }
}