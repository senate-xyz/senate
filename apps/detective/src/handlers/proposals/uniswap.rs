use std::{str, sync::Arc};

use anyhow::Result;
use chrono::{DateTime, NaiveDateTime, Utc};
use ethers::{
    prelude::LogMeta,
    providers::{Http, Middleware, Provider},
    types::{Address, Filter},
};
use futures::stream::{FuturesUnordered, StreamExt};
use prisma_client_rust::bigdecimal::ToPrimitive;
use serde::Deserialize;
use tracing::{debug_span, instrument, Instrument};

use crate::{
    contracts::{uniswapgov, uniswapgov::ProposalCreatedFilter},
    daohandler_with_dao,
    prisma::{daohandler, PrismaClient, ProposalState},
    router::chain_proposals::ChainProposal,
    utils::etherscan::estimate_timestamp,
    Ctx,
};

#[allow(non_snake_case)]
#[derive(Debug, Deserialize)]
struct Decoder {
    address: String,
    proposalUrl: String,
}

pub async fn uniswap_proposals(
    rpc: &Arc<Provider<Http>>,
    dao_handler: &daohandler_with_dao::Data,
    from_block: &i64,
    to_block: &i64,
) -> Result<Vec<ChainProposal>> {
    let decoder: Decoder = serde_json::from_value(dao_handler.clone().decoder)?;

    let address = decoder.address.parse::<Address>().expect("bad address");

    let gov_contract = uniswapgov::uniswapgov::uniswapgov::new(address, rpc.clone());

    let events = gov_contract
        .proposal_created_filter()
        .from_block(*from_block)
        .to_block(*to_block);

    let proposals = events.query_with_meta().await?;

    let mut futures = FuturesUnordered::new();

    for p in proposals.iter() {
        futures.push(async {
            data_for_proposal(p.clone(), rpc, &decoder, dao_handler, gov_contract.clone()).await
        });
    }

    let mut result = Vec::new();
    while let Some(proposal) = futures.next().await {
        result.push(proposal?);
    }

    Ok(result)
}

async fn data_for_proposal(
    p: (uniswapgov::uniswapgov::ProposalCreatedFilter, LogMeta),
    rpc: &Arc<Provider<Http>>,
    decoder: &Decoder,
    dao_handler: &daohandler_with_dao::Data,
    gov_contract: uniswapgov::uniswapgov::uniswapgov<
        ethers::providers::Provider<ethers::providers::Http>,
    >,
) -> Result<ChainProposal> {
    let (log, meta): (ProposalCreatedFilter, LogMeta) = p.clone();

    let created_block_number = meta.block_number.as_u64().to_i64().unwrap();
    let created_block = rpc.get_block(meta.block_number).await?;
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

    let mut title = format!(
        "{:.120}",
        log.description
            .to_string()
            .split('\n')
            .next()
            .unwrap_or("Unknown")
            .to_string()
    );

    if title.starts_with("# ") {
        title = title.split_off(2);
    }

    if title.is_empty() {
        title = "Unknown".into()
    }

    let proposal_url = format!("{}{}", decoder.proposalUrl, log.id.as_u32());

    let proposal_external_id = log.id.as_u32().to_string();

    let onchain_proposal = gov_contract.proposals(log.id).call().await?;

    let choices = vec!["For", "Against", "Abstain"];

    let scores = vec![
        onchain_proposal.5.as_u128(),
        onchain_proposal.6.as_u128(),
        onchain_proposal.7.as_u128(),
    ];

    let scores_total =
        onchain_proposal.5.as_u128() + onchain_proposal.6.as_u128() + onchain_proposal.7.as_u128();

    let quorum = gov_contract.quorum_votes().call().await?;

    let proposal_state = gov_contract
        .state(log.id)
        .call()
        .await
        .unwrap_or(ProposalState::Unknown as u8);

    let state = match proposal_state {
        0 => ProposalState::Pending,
        1 => ProposalState::Active,
        2 => ProposalState::Canceled,
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

    Ok(proposal)
}
