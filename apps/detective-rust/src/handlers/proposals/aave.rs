use crate::{
    contracts::{
        aaveexecutor,
        aavegov::{self, ProposalCreatedFilter},
        aavestrategy,
    },
    Ctx,
};
use crate::{prisma::daohandler, router::update_chain_proposals::ChainProposal};
use anyhow::Result;
use ethers::{prelude::LogMeta, types::Address};
use ethers::{providers::Middleware, types::U256};
use futures::stream::{FuturesUnordered, StreamExt};
use prisma_client_rust::{
    bigdecimal::ToPrimitive,
    chrono::{DateTime, NaiveDateTime, Utc},
};
use serde::Deserialize;

#[allow(non_snake_case)]
#[derive(Debug, Deserialize)]
struct Decoder {
    address: String,
    proposalUrl: String,
}

pub async fn aave_proposals(
    ctx: &Ctx,
    dao_handler: &daohandler::Data,
    from_block: &i64,
    to_block: &i64,
) -> Result<Vec<ChainProposal>> {
    let decoder: Decoder = serde_json::from_value(dao_handler.clone().decoder)?;

    let address = decoder.address.parse::<Address>().expect("bad address");

    let gov_contract = aavegov::aavegov::aavegov::new(address, ctx.client.clone());

    let events = gov_contract
        .event::<aavegov::ProposalCreatedFilter>()
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

    let block_created = meta.block_number;

    let created_b = ctx.client.get_block(meta.clone().block_number).await?;
    let voting_start_b = log.clone().start_block.as_u64();
    let voting_end_b = log.clone().end_block.as_u64();

    let created_timestamp = created_b.expect("bad block").time()?;

    let voting_starts_block = ctx.client.get_block(voting_start_b).await?;
    let voting_ends_block = ctx.client.get_block(voting_end_b).await?;

    let voting_starts_timestamp = voting_starts_block.expect("bad block").time()?;
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

    let proposal_url = format!("{}{}", decoder.proposalUrl, log.id.as_u32());

    let proposal_external_id = log.id.as_u32().to_string();

    let executor_contract =
        aaveexecutor::aaveexecutor::aaveexecutor::new(log.executor, ctx.client.clone());

    let strategy_contract =
        aavestrategy::aavestrategy::aavestrategy::new(log.strategy, ctx.client.clone());

    let total_voting_power = strategy_contract
        .get_total_voting_supply_at(U256::from(meta.block_number.as_u64()))
        .await?;

    let min_quorum = executor_contract.minimum_quorum().await?;

    let one_hunded_with_precision = executor_contract.one_hundred_with_precision().await?;

    let _quorum = (total_voting_power * min_quorum) / one_hunded_with_precision;

    let onchain_proposal = gov_contract.get_proposal_by_id(log.id).call().await?;

    let _choices = vec!["For", "Against"];

    let _scores = vec![
        onchain_proposal.for_votes.as_u128(),
        onchain_proposal.against_votes.as_u128(),
    ];

    let _scores_total =
        onchain_proposal.for_votes.as_u128() + onchain_proposal.against_votes.as_u128();

    let proposal = ChainProposal {
        external_id: proposal_external_id,
        name: "".to_string(),
        dao_id: dao_handler.clone().daoid,
        dao_handler_id: dao_handler.clone().id,
        time_start: voting_starts_timestamp,
        time_end: voting_ends_timestamp,
        time_created: created_timestamp,
        block_created: block_created.as_u64().to_i64().expect("bad conversion"),
        choices: _choices.into(),
        scores: _scores.into(),
        scores_total: _scores_total.into(),
        quorum: _quorum.as_u128().into(),
        url: proposal_url,
    };

    Ok(proposal)
}
