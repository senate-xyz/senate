use std::{env, pin::Pin, str, sync::Arc, task::Poll};

use anyhow::Result;

use ethers::{
    prelude::LogMeta,
    providers::{Http, Middleware, Provider},
    types::{Address, Filter},
    utils::hex,
};
use futures::{
    stream::{FuturesUnordered, StreamExt},
    Future,
};
use prisma_client_rust::{
    bigdecimal::ToPrimitive,
    chrono::{DateTime, NaiveDateTime, Utc},
};
use serde::Deserialize;
use tracing::{debug_span, instrument, Instrument};

use crate::{
    contracts::{
        optimismgov,
        optimismgov::{ProposalCreated1Filter, ProposalCreated2Filter},
        optimismvotemodule_5_4a_8f,
    },
    daohandler_with_dao,
    prisma::{daohandler, ProposalState},
    router::chain_proposals::ChainProposal,
    utils::optimiscan::estimate_timestamp,
    Context,
    Ctx,
};

#[allow(non_snake_case)]
#[derive(Debug, Deserialize)]
struct Decoder {
    address: String,
    proposalUrl: String,
}

pub async fn optimism_proposals(
    rpc: &Arc<Provider<Http>>,
    dao_handler: &daohandler_with_dao::Data,
    from_block: &i64,
    to_block: &i64,
) -> Result<Vec<ChainProposal>> {
    let decoder: Decoder = serde_json::from_value(dao_handler.clone().decoder)?;

    let address = decoder.address.parse::<Address>().expect("bad address");

    let gov_contract = optimismgov::optimismgov::optimismgov::new(address, rpc.clone());

    let events1 = gov_contract
        .proposal_created_1_filter()
        .from_block(*from_block)
        .to_block(*to_block);

    let events2 = gov_contract
        .proposal_created_2_filter()
        .from_block(*from_block)
        .to_block(*to_block);

    let proposals1 = events1.query_with_meta().await?;
    let proposals2 = events2.query_with_meta().await?;

    let mut results = vec![];

    for p in proposals1.iter() {
        results.push(
            data_for_proposal1(
                p.clone(),
                rpc.clone(),
                &decoder,
                dao_handler,
                gov_contract.clone(),
            )
            .await?,
        )
    }

    for p in proposals2.iter() {
        results.push(
            data_for_proposal2(
                p.clone(),
                rpc.clone(),
                &decoder,
                dao_handler,
                gov_contract.clone(),
            )
            .await?,
        )
    }

    Ok(results)
}

async fn data_for_proposal1(
    p: (optimismgov::optimismgov::ProposalCreated1Filter, LogMeta),
    rpc: Arc<Provider<Http>>,
    decoder: &Decoder,
    dao_handler: &daohandler_with_dao::Data,
    gov_contract: optimismgov::optimismgov::optimismgov<
        ethers::providers::Provider<ethers::providers::Http>,
    >,
) -> Result<ChainProposal> {
    let (log, meta): (ProposalCreated1Filter, LogMeta) = p.clone();

    let created_block_number = meta.block_number.as_u64().to_i64().unwrap();
    let created_block = rpc.get_block(meta.block_number).await?;
    let created_block_timestamp = created_block.expect("bad block").time()?;

    let voting_start_block_number = gov_contract
        .proposal_snapshot(log.proposal_id)
        .await
        .unwrap()
        .as_u64()
        .to_i64()
        .unwrap();

    let voting_end_block_number = gov_contract
        .proposal_deadline(log.proposal_id)
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
                    + (voting_start_block_number - created_block_number) * 2 * 1000,
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
                    + (voting_end_block_number - created_block_number) * 2 * 1000,
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

    let proposal_url = format!("{}{}", decoder.proposalUrl, log.proposal_id);

    let proposal_external_id = log.proposal_id.to_string();

    let voting_module =
        if (log.voting_module.to_string() == "0x54a8fcbbf05ac14bef782a2060a8c752c7cc13a5") {
            optimismvotemodule_5_4a_8f::optimismvotemodule_5_4a_8f::optimismvotemodule_54a8f::new(
                log.voting_module,
                rpc.clone(),
            )
        } else {
            //same thing because there's a single votemodule now
            optimismvotemodule_5_4a_8f::optimismvotemodule_5_4a_8f::optimismvotemodule_54a8f::new(
                log.voting_module,
                rpc.clone(),
            )
        };

    let votes = voting_module.proposal_votes(log.proposal_id).await?;

    let choices = vec![format!("{} Options", votes.2.len())];

    let proposal_state = gov_contract.state(log.proposal_id).await?;

    let scores_total: u128 = votes.2.iter().sum();

    let quorum = gov_contract.quorum(log.start_block).await?;

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
        scores: vec![scores_total].into(),
        scores_total: scores_total.into(),
        quorum: quorum.as_u128().into(),
        url: proposal_url,
        state,
    };

    Ok(proposal)
}

async fn data_for_proposal2(
    p: (optimismgov::optimismgov::ProposalCreated2Filter, LogMeta),
    rpc: Arc<Provider<Http>>,
    decoder: &Decoder,
    dao_handler: &daohandler_with_dao::Data,
    gov_contract: optimismgov::optimismgov::optimismgov<
        ethers::providers::Provider<ethers::providers::Http>,
    >,
) -> Result<ChainProposal> {
    let (log, meta): (ProposalCreated2Filter, LogMeta) = p.clone();

    let created_block_number = meta.block_number.as_u64().to_i64().unwrap();
    let created_block = rpc.get_block(meta.block_number).await?;
    let created_block_timestamp = created_block.expect("bad block").time()?;

    let voting_start_block_number = gov_contract
        .proposal_snapshot(log.proposal_id)
        .await
        .unwrap()
        .as_u64()
        .to_i64()
        .unwrap();

    let voting_end_block_number = gov_contract
        .proposal_deadline(log.proposal_id)
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
                    + (voting_start_block_number - created_block_number) * 2 * 1000,
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
                    + (voting_end_block_number - created_block_number) * 2 * 1000,
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

    let proposal_url = format!("{}{}", decoder.proposalUrl, log.proposal_id);

    let proposal_external_id = log.proposal_id.to_string();

    let choices = vec!["For", "Against", "Abstain"];

    let proposal_state = gov_contract.state(log.proposal_id).await?;

    let (against_votes, for_votes, abstain_votes) =
        gov_contract.proposal_votes(log.proposal_id).await?;

    let scores_total = for_votes.as_u128() + against_votes.as_u128() + abstain_votes.as_u128();

    let quorum = gov_contract.quorum(log.start_block).await?;

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
        scores: vec![
            for_votes.as_u128(),
            against_votes.as_u128(),
            abstain_votes.as_u128(),
        ]
        .into(),
        scores_total: scores_total.into(),
        quorum: quorum.as_u128().into(),
        url: proposal_url,
        state,
    };

    Ok(proposal)
}
