use crate::{
    contracts::{
        aaveexecutor,
        aavegov::{self, ProposalCreatedFilter},
        aavestrategy,
    },
    prisma::{daohandler, ProposalState},
    router::chain_proposals::ChainProposal,
    utils::etherscan::estimate_timestamp,
    Ctx,
};
use anyhow::Result;
use ethers::{
    prelude::LogMeta,
    providers::Middleware,
    types::{Address, U256},
    utils::hex,
};
use futures::stream::{FuturesUnordered, StreamExt};
use prisma_client_rust::{
    bigdecimal::ToPrimitive,
    chrono::{DateTime, NaiveDateTime, Utc},
};
use regex::Regex;
use reqwest::{Client, StatusCode};
use reqwest_middleware::ClientWithMiddleware;
use serde::Deserialize;
use serde_json::Value as JsonValue;
use std::{str, sync::Arc, time::Duration};
use tracing::instrument;

#[allow(non_snake_case)]
#[derive(Debug, Deserialize)]
struct Decoder {
    address: String,
    proposalUrl: String,
}

#[instrument(skip(ctx), ret)]
pub async fn aave_proposals(
    ctx: &Ctx,
    dao_handler: &daohandler::Data,
    from_block: &i64,
    to_block: &i64,
) -> Result<Vec<ChainProposal>> {
    let decoder: Decoder = serde_json::from_value(dao_handler.clone().decoder)?;

    let address = decoder.address.parse::<Address>().expect("bad address");

    let gov_contract = aavegov::aavegov::aavegov::new(address, ctx.rpc.clone());

    let events = gov_contract
        .proposal_created_filter()
        .from_block(*from_block)
        .to_block(*to_block);

    let proposals = events.query_with_meta().await?;

    let mut futures = FuturesUnordered::new();

    for p in proposals.iter() {
        futures.push(async {
            data_for_proposal(p.clone(), ctx, &decoder, dao_handler, gov_contract.clone()).await
        });
    }

    let mut result = Vec::new();
    while let Some(proposal) = futures.next().await {
        result.push(proposal?);
    }

    Ok(result)
}

async fn data_for_proposal(
    p: (aavegov::aavegov::ProposalCreatedFilter, LogMeta),
    ctx: &Ctx,
    decoder: &Decoder,
    dao_handler: &daohandler::Data,
    gov_contract: aavegov::aavegov::aavegov<ethers::providers::Provider<ethers::providers::Http>>,
) -> Result<ChainProposal> {
    let (log, meta): (ProposalCreatedFilter, LogMeta) = p.clone();

    let created_block_number = meta.block_number.as_u64().to_i64().unwrap();
    let created_block = ctx.rpc.get_block(meta.block_number).await?;
    let created_block_timestamp = created_block.expect("bad block").time()?;

    let voting_start_block_number = log.start_block.as_u64().to_i64().unwrap();
    let voting_end_block_number = log.end_block.as_u64().to_i64().unwrap();

    let voting_starts_timestamp = match estimate_timestamp(voting_start_block_number, &ctx).await {
        Ok(r) => r,
        Err(_) => DateTime::from_utc(
            NaiveDateTime::from_timestamp_millis(
                created_block_timestamp.timestamp() * 1000
                    + (voting_start_block_number - created_block_number) * 12 * 1000,
            )
            .expect("bad timestamp"),
            Utc,
        ),
    };

    let voting_ends_timestamp = match estimate_timestamp(voting_end_block_number, &ctx).await {
        Ok(r) => r,
        Err(_) => DateTime::from_utc(
            NaiveDateTime::from_timestamp_millis(
                created_block_timestamp.timestamp() * 1000
                    + (voting_end_block_number - created_block_number) * 12 * 1000,
            )
            .expect("bad timestamp"),
            Utc,
        ),
    };

    let proposal_url = format!("{}{}", decoder.proposalUrl, log.id);

    let proposal_external_id = log.id.to_string();

    let executor_contract =
        aaveexecutor::aaveexecutor::aaveexecutor::new(log.executor, ctx.rpc.clone());

    let strategy_contract =
        aavestrategy::aavestrategy::aavestrategy::new(log.strategy, ctx.rpc.clone());

    let total_voting_power = strategy_contract
        .get_total_voting_supply_at(U256::from(meta.block_number.as_u64()))
        .await?;

    let min_quorum = executor_contract.minimum_quorum().await?;

    let one_hunded_with_precision = executor_contract.one_hundred_with_precision().await?;

    let quorum = (total_voting_power * min_quorum) / one_hunded_with_precision;

    let onchain_proposal = gov_contract.get_proposal_by_id(log.id).call().await?;

    let choices = vec!["For", "Against"];

    let scores = vec![
        onchain_proposal.for_votes.as_u128(),
        onchain_proposal.against_votes.as_u128(),
    ];

    let scores_total =
        onchain_proposal.for_votes.as_u128() + onchain_proposal.against_votes.as_u128();

    let hash: Vec<u8> = log.ipfs_hash.into();

    let mut title = get_title(hex::encode(hash), ctx.http_client.clone()).await?;

    if title.starts_with("# ") {
        title = title.split_off(2);
    }

    if title.is_empty() {
        title = "Unknown".into()
    }

    let proposal_state = gov_contract.get_proposal_state(log.id).call().await?;

    let state = match proposal_state {
        0 => ProposalState::Pending,
        1 => ProposalState::Canceled,
        2 => ProposalState::Active,
        3 => ProposalState::Defeated,
        4 => ProposalState::Succeeded,
        5 => ProposalState::Queued,
        6 => ProposalState::Expired,
        7 => ProposalState::Executed,
        _ => ProposalState::Unknown,
    };

    let proposal = ChainProposal {
        external_id: proposal_external_id,
        name: title,
        dao_id: dao_handler.clone().daoid,
        dao_handler_id: dao_handler.clone().id,
        time_start: voting_starts_timestamp,
        time_end: voting_ends_timestamp,
        time_created: created_block_timestamp,
        block_created: created_block_number,
        choices: choices.into(),
        scores: scores.into(),
        scores_total: scores_total.into(),
        quorum: quorum.as_u128().into(),
        url: proposal_url,
        state,
    };

    debug!("{:?}", proposal);

    Ok(proposal)
}

async fn get_title(hexhash: String, http_client: Arc<ClientWithMiddleware>) -> Result<String> {
    let mut retries = 0;
    let mut current_gateway = 0;

    let gateways = vec![
        "https://senate.infura-ipfs.io/ipfs/",
        "https://cloudflare-ipfs.com/ipfs/",
        "https://gateway.pinata.cloud/ipfs/",
        "https://4everland.io/ipfs/",
    ];

    loop {
        let response = http_client
            .get(format!("{}f01701220{}", gateways[current_gateway], hexhash))
            .timeout(Duration::from_secs(10))
            .send()
            .await;

        match response {
            Ok(res) if res.status() == StatusCode::OK => {
                let text = res.text().await?;

                // Check if the text is JSON
                if let Ok(json) = serde_json::from_str::<JsonValue>(&text) {
                    return Ok(json["title"].as_str().unwrap_or("Unknown").to_string());
                }

                let re = Regex::new(r#"title:\s*(.*?)\s*discussions:"#).unwrap();
                if let Some(captures) = re.captures(&text) {
                    if let Some(matched) = captures.get(1) {
                        return Ok(matched.as_str().trim().to_string());
                    }
                }

                let re = Regex::new(r#"title:\s*(.*?)\s*author:"#).unwrap();
                if let Some(captures) = re.captures(&text) {
                    if let Some(matched) = captures.get(1) {
                        return Ok(matched.as_str().trim().to_string());
                    }
                }

                let re = Regex::new(r#"title:\s*(.*?)\s*status:"#).unwrap();
                if let Some(captures) = re.captures(&text) {
                    if let Some(matched) = captures.get(1) {
                        return Ok(matched.as_str().trim().to_string());
                    }
                }

                return Ok("Unknown".to_string());
            }
            _ if retries % 5 == 0 => {
                if current_gateway < gateways.len() - 2 {
                    current_gateway = current_gateway + 1;
                } else {
                    current_gateway = 0;
                }
            }
            _ if retries < 25 => {
                retries += 1;
                let backoff_duration = Duration::from_millis(2u64.pow(retries as u32));
                tokio::time::sleep(backoff_duration).await;
            }
            _ => return Ok("Unknown".to_string()),
        }
    }
}

#[cfg(test)]
mod tests {
    use std::sync::Arc;

    use reqwest_middleware::ClientBuilder;
    use reqwest_retry::{policies::ExponentialBackoff, RetryTransientMiddleware};

    use crate::handlers::proposals::aave::get_title;

    #[tokio::test]
    async fn get_markdown_title() {
        let retry_policy = ExponentialBackoff::builder().build_with_max_retries(5);

        let http_client = Arc::new(
            ClientBuilder::new(reqwest::Client::new())
                .with(RetryTransientMiddleware::new_with_policy(retry_policy))
                .build(),
        );

        let result = get_title(
            "f76d79693a81a1c0acd23c6ee151369752142b0d832daeaef9a4dd9f8c4bc7ce".into(),
            http_client,
        )
        .await
        .unwrap();
        assert_eq!(result, "Polygon Supply Cap Update");
    }

    #[tokio::test]
    async fn get_json_title() {
        let retry_policy = ExponentialBackoff::builder().build_with_max_retries(5);

        let http_client = Arc::new(
            ClientBuilder::new(reqwest::Client::new())
                .with(RetryTransientMiddleware::new_with_policy(retry_policy))
                .build(),
        );

        let result = get_title(
            "8d4f6f42043d8db567d5e733762bb84a6f507997a779a66b2d17fdf9de403c13".into(),
            http_client,
        )
        .await
        .unwrap();
        assert_eq!(result, "Add rETH to Arbitrum Aave v3");
    }
}
