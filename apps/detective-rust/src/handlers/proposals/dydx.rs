use crate::{
    contracts::{
        dydxexecutor,
        dydxgov::{self, ProposalCreatedFilter},
        dydxstrategy,
    },
    Ctx,
};
use crate::{prisma::daohandler, router::chain_proposals::ChainProposal};
use anyhow::Result;
use ethers::{prelude::LogMeta, types::Address, utils::hex};
use ethers::{providers::Middleware, types::U256};
use futures::stream::{FuturesUnordered, StreamExt};
use prisma_client_rust::{
    bigdecimal::ToPrimitive,
    chrono::{DateTime, NaiveDateTime, Utc},
};
use reqwest::{Client, StatusCode};
use serde::Deserialize;
use std::{str, time::Duration};

#[allow(non_snake_case)]
#[derive(Debug, Deserialize)]
struct Decoder {
    address: String,
    proposalUrl: String,
}

pub async fn dydx_proposals(
    ctx: &Ctx,
    dao_handler: &daohandler::Data,
    from_block: &i64,
    to_block: &i64,
) -> Result<Vec<ChainProposal>> {
    let decoder: Decoder = serde_json::from_value(dao_handler.clone().decoder)?;

    let address = decoder.address.parse::<Address>().expect("bad address");

    let gov_contract = dydxgov::dydxgov::dydxgov::new(address, ctx.client.clone());

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
    p: (dydxgov::dydxgov::ProposalCreatedFilter, LogMeta),
    ctx: &Ctx,
    decoder: &Decoder,
    dao_handler: &daohandler::Data,
    gov_contract: dydxgov::dydxgov::dydxgov<ethers::providers::Provider<ethers::providers::Http>>,
) -> Result<ChainProposal> {
    let (log, meta): (ProposalCreatedFilter, LogMeta) = p.clone();

    let block_created = meta.block_number;

    let created_b = ctx.client.get_block(meta.clone().block_number).await?;
    let voting_start_b = log.clone().start_block.as_u64();
    let voting_end_b = log.clone().end_block.as_u64();

    let created_timestamp = created_b.expect("bad block").time()?;

    let voting_starts_block = ctx.client.get_block(voting_start_b).await?;
    let voting_ends_block = ctx.client.get_block(voting_end_b).await?;

    let voting_starts_timestamp = match voting_starts_block {
        Some(block) => block.time().expect("bad block timestamp"),
        None => DateTime::from_utc(
            NaiveDateTime::from_timestamp_millis(
                created_timestamp.timestamp() * 1000
                    + (log.start_block.as_u64().to_i64().expect("bad conversion")
                        - meta.block_number.as_u64().to_i64().expect("bad conversion"))
                        * 12
                        * 1000,
            )
            .expect("bad timestamp"),
            Utc,
        ),
    };
    let voting_ends_timestamp = match voting_ends_block {
        Some(block) => block.time().expect("bad block timestamp"),
        None => DateTime::from_utc(
            NaiveDateTime::from_timestamp_millis(
                created_timestamp.timestamp() * 1000
                    + (log.end_block.as_u64().to_i64().expect("bad conversion")
                        - meta.block_number.as_u64().to_i64().expect("bad conversion"))
                        * 12
                        * 1000,
            )
            .expect("bad timestamp"),
            Utc,
        ),
    };

    let proposal_url = format!("{}{}", decoder.proposalUrl, log.id);

    let proposal_external_id = log.id.to_string();

    let executor_contract =
        dydxexecutor::dydxexecutor::dydxexecutor::new(log.executor, ctx.client.clone());

    let strategy_contract =
        dydxstrategy::dydxstrategy::dydxstrategy::new(log.strategy, ctx.client.clone());

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

    let mut title = get_title(hex::encode(hash)).await?;

    if title.is_empty() {
        title = "Unknown".into()
    }

    let proposal = ChainProposal {
        external_id: proposal_external_id,
        name: title,
        dao_id: dao_handler.clone().daoid,
        dao_handler_id: dao_handler.clone().id,
        time_start: voting_starts_timestamp,
        time_end: voting_ends_timestamp,
        time_created: created_timestamp,
        block_created: block_created.as_u64().to_i64().expect("bad conversion"),
        choices: choices.into(),
        scores: scores.into(),
        scores_total: scores_total.into(),
        quorum: quorum.as_u128().into(),
        url: proposal_url,
    };

    Ok(proposal)
}

#[derive(Deserialize, Debug)]
struct IpfsData {
    title: String,
}

async fn get_title(hexhash: String) -> Result<String> {
    let client = Client::new();
    let mut retries = 0;

    loop {
        let response = client
            .get(format!("https://ipfs.io/ipfs/f01701220{}", hexhash))
            .timeout(Duration::from_secs(5))
            .send()
            .await;

        match response {
            Ok(res) if res.status() == StatusCode::OK => {
                let ipfs_data = match res.json::<IpfsData>().await {
                    Ok(r) => r,
                    Err(_) => IpfsData {
                        title: "Unknown".to_string(),
                    },
                };
                return Ok(ipfs_data.title);
            }
            _ if retries < 5 => {
                retries += 1;
                let backoff_duration = Duration::from_millis(2u64.pow(retries as u32) * 100);
                tokio::time::sleep(backoff_duration).await;
            }
            _ => return Ok("Unknown".to_string()),
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::handlers::proposals::dydx::get_title;

    #[tokio::test]
    async fn get_title_once() {
        let result =
            get_title("0a387fa966f5616423bea53801a843496b1eac5cab5e6bc9426c0958e6496e77".into())
                .await
                .unwrap();
        assert_eq!(result, "Add MaticX to Aave v3 Polygon Pool");
    }

    #[tokio::test]
    async fn get_title_10_times() {
        let mut cnt = 0;
        loop {
            let result = get_title(
                "0a387fa966f5616423bea53801a843496b1eac5cab5e6bc9426c0958e6496e77".into(),
            )
            .await
            .unwrap();
            assert_eq!(result, "Add MaticX to Aave v3 Polygon Pool");
            cnt += 1;
            if cnt == 10 {
                break;
            }
        }
    }

    #[tokio::test]
    async fn get_invalid_title() {
        let result =
            get_title("0b387fa966f5616423bea53801a843496b1eac5cab5e6bc9426c0958e6496e77".into())
                .await
                .unwrap();
        assert_eq!(result, "Unknown");
    }

    #[tokio::test]
    async fn get_unavailable_title() {
        let result =
            get_title("e7e93497d3847536f07fe8dba53485cf68a275c7b07ca38b53d2cc2d43fab3b0".into())
                .await
                .unwrap();
        assert_eq!(result, "Unknown");
    }
}
