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
use reqwest::{Client, StatusCode};
use reqwest_middleware::ClientWithMiddleware;
use serde::Deserialize;
use std::{str, sync::Arc, time::Duration};
use tracing::instrument;

#[allow(non_snake_case)]
#[derive(Debug, Deserialize)]
struct Decoder {
    address: String,
    proposalUrl: String,
}

#[instrument]
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

#[instrument]
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

    let voting_starts_timestamp = match estimate_timestamp(voting_start_block_number).await {
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

    let voting_ends_timestamp = match estimate_timestamp(voting_end_block_number).await {
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

#[derive(Deserialize, Debug)]
struct IpfsData {
    title: String,
}

#[instrument]
async fn get_title(hexhash: String, http_client: Arc<ClientWithMiddleware>) -> Result<String> {
    let mut retries = 0;
    let mut current_gateway = 0;

    let gateways = vec![
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
                let ipfs_data = match res.json::<IpfsData>().await {
                    Ok(r) => r,
                    Err(_) => IpfsData {
                        title: "Unknown".to_string(),
                    },
                };
                return Ok(ipfs_data.title);
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

// #[cfg(test)]
// mod tests {
//     use crate::handlers::proposals::aave::get_title;

//     #[tokio::test]
//     async fn get_title_once() {
//         let result =
//             get_title("0a387fa966f5616423bea53801a843496b1eac5cab5e6bc9426c0958e6496e77".into())
//                 .await
//                 .unwrap();
//         assert_eq!(result, "Add MaticX to Aave v3 Polygon Pool");
//     }

//     #[tokio::test]
//     async fn get_title_10_times() {
//         let mut cnt = 0;
//         loop {
//             let result = get_title(
//                 "0a387fa966f5616423bea53801a843496b1eac5cab5e6bc9426c0958e6496e77".into(),
//             )
//             .await
//             .unwrap();
//             assert_eq!(result, "Add MaticX to Aave v3 Polygon Pool");
//             cnt += 1;
//             if cnt == 10 {
//                 break;
//             }
//         }
//     }

//     #[tokio::test]
//     async fn get_invalid_title() {
//         let result =
//             get_title("0b387fa966f5616423bea53801a843496b1eac5cab5e6bc9426c0958e6496e77".into())
//                 .await
//                 .unwrap();
//         assert_eq!(result, "Unknown");
//     }

//     #[tokio::test]
//     async fn get_unavailable_title() {
//         let result =
//             get_title("e7e93497d3847536f07fe8dba53485cf68a275c7b07ca38b53d2cc2d43fab3b0".into())
//                 .await
//                 .unwrap();
//         assert_eq!(result, "Unknown");
//     }
// }
