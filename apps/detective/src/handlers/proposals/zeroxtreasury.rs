use std::str;

use anyhow::Result;
use chrono::Duration;
use ethers::{
    prelude::LogMeta,
    providers::Middleware,
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
    contracts::{zeroxtreasury, zeroxtreasury::ProposalCreatedFilter},
    daohandler_with_dao,
    prisma::{daohandler, ProposalState},
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

pub async fn zeroxtreasury_proposals(
    ctx: &Ctx,
    dao_handler: &daohandler_with_dao::Data,
    from_block: &i64,
    to_block: &i64,
) -> Result<Vec<ChainProposal>> {
    let decoder: Decoder = serde_json::from_value(dao_handler.clone().decoder)?;

    let address = decoder.address.parse::<Address>().expect("bad address");

    let gov_contract = zeroxtreasury::zeroxtreasury::zeroxtreasury::new(address, ctx.rpc.clone());

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
    p: (zeroxtreasury::zeroxtreasury::ProposalCreatedFilter, LogMeta),
    ctx: &Ctx,
    decoder: &Decoder,
    dao_handler: &daohandler_with_dao::Data,
    gov_contract: zeroxtreasury::zeroxtreasury::zeroxtreasury<
        ethers::providers::Provider<ethers::providers::Http>,
    >,
) -> Result<ChainProposal> {
    let (log, meta): (ProposalCreatedFilter, LogMeta) = p.clone();

    let created_block_number = meta.block_number.as_u64().to_i64().unwrap();
    let created_block = ctx.rpc.get_block(meta.block_number).await?;
    let created_block_timestamp = created_block.expect("bad block").time()?;

    let voting_start_block_number = created_block_number;

    let voting_period_seconds = gov_contract
        .voting_period()
        .call()
        .await
        .unwrap()
        .as_u64()
        .to_i64()
        .unwrap();

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

    let voting_ends_timestamp = voting_starts_timestamp + Duration::seconds(voting_period_seconds);

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

    let state = if voting_ends_timestamp > Utc::now() {
        match proposal_state {
            false => ProposalState::Active,
            true => ProposalState::Executed,
        }
    } else {
        match proposal_state {
            false => ProposalState::Defeated,
            true => ProposalState::Executed,
        }
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
