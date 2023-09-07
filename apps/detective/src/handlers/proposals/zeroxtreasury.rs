use std::{str, sync::Arc};

use anyhow::Result;
use chrono::Duration;
use ethers::{
    prelude::LogMeta,
    providers::{Http, Middleware, Provider},
    types::{Address, Filter},
};
use futures::stream::{FuturesUnordered, StreamExt};
use prisma_client_rust::{
    bigdecimal::ToPrimitive,
    chrono::{DateTime, NaiveDateTime, Utc},
};
use serde::Deserialize;
use tracing::{debug_span, event, instrument, Instrument};

use crate::{
    contracts::{zeroxstakingproxy, zeroxtreasury, zeroxtreasury::ProposalCreatedFilter},
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
    stakingProxy: String,
    proposalUrl: String,
}

pub async fn zeroxtreasury_proposals(
    rpc: &Arc<Provider<Http>>,
    dao_handler: &daohandler_with_dao::Data,
    from_block: &i64,
    to_block: &i64,
) -> Result<Vec<ChainProposal>> {
    let decoder: Decoder = serde_json::from_value(dao_handler.clone().decoder)?;

    let address = decoder.address.parse::<Address>().expect("bad address");

    let gov_contract = zeroxtreasury::zeroxtreasury::zeroxtreasury::new(address, rpc.clone());

    let staking_proxy_address = decoder
        .stakingProxy
        .parse::<Address>()
        .expect("bad address");

    let staking_proxy_contract = zeroxstakingproxy::zeroxstakingproxy::zeroxstakingproxy::new(
        staking_proxy_address,
        rpc.clone(),
    );

    let events = gov_contract
        .proposal_created_filter()
        .from_block(*from_block)
        .to_block(*to_block);

    let proposals = events.query_with_meta().await?;

    let mut futures = FuturesUnordered::new();

    for p in proposals.iter() {
        futures.push(async {
            data_for_proposal(
                p.clone(),
                rpc,
                &decoder,
                dao_handler,
                gov_contract.clone(),
                staking_proxy_contract.clone(),
            )
            .await
        });
    }

    let mut result = Vec::new();
    while let Some(proposal) = futures.next().await {
        result.push(proposal?);
    }

    Ok(result)
}

async fn data_for_proposal(
    p: (zeroxtreasury::zeroxtreasury::ProposalCreatedFilter, LogMeta),
    rpc: &Arc<Provider<Http>>,
    decoder: &Decoder,
    dao_handler: &daohandler_with_dao::Data,
    gov_contract: zeroxtreasury::zeroxtreasury::zeroxtreasury<
        ethers::providers::Provider<ethers::providers::Http>,
    >,
    staking_proxy_contract: zeroxstakingproxy::zeroxstakingproxy::zeroxstakingproxy<
        ethers::providers::Provider<ethers::providers::Http>,
    >,
) -> Result<ChainProposal> {
    let (log, meta): (ProposalCreatedFilter, LogMeta) = p.clone();

    let created_block_number = meta.block_number.as_u64().to_i64().unwrap();
    let created_block = rpc.get_block(meta.block_number).await?;
    let created_block_timestamp = created_block.expect("bad block").time()?;

    let voting_period_seconds = gov_contract
        .voting_period()
        .call()
        .await?
        .as_u64()
        .to_i64()
        .unwrap();

    let voting_starts_timestamp = staking_proxy_contract
        .current_epoch_start_time_in_seconds()
        .await?
        .as_u64()
        + 2 * staking_proxy_contract
            .epoch_duration_in_seconds()
            .await?
            .as_u64();

    let voting_starts_time = DateTime::from_naive_utc_and_offset(
        NaiveDateTime::from_timestamp_millis(voting_starts_timestamp.to_i64().unwrap() * 1000)
            .expect("bad timestamp"),
        Utc,
    );

    let voting_ends_timestamp = voting_starts_time + Duration::seconds(voting_period_seconds);

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

    let proposal_url = format!("{}{}", decoder.proposalUrl, log.proposal_id);

    let proposal_external_id = log.proposal_id.to_string();

    let onchain_proposal = gov_contract.proposals(log.proposal_id).call().await?;

    let choices = vec!["For", "Against"];

    let scores = vec![onchain_proposal.3.as_u128(), onchain_proposal.4.as_u128()];

    let scores_total = onchain_proposal.3.as_u128() + onchain_proposal.4.as_u128();

    let quorum = gov_contract.proposal_threshold().call().await?;

    let proposal_state = onchain_proposal.5;

    let state = if voting_starts_time < Utc::now() {
        ProposalState::Pending
    } else {
        if voting_ends_timestamp > Utc::now() {
            match proposal_state {
                false => ProposalState::Active,
                true => ProposalState::Executed,
            }
        } else {
            match proposal_state {
                false => ProposalState::Defeated,
                true => ProposalState::Executed,
            }
        }
    };

    let proposal = ChainProposal {
        external_id: proposal_external_id,
        name: title,
        dao_id: dao_handler.clone().daoid,
        dao_handler_id: dao_handler.clone().id,
        time_start: voting_starts_time,
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
