use std::{ error::Error, f32::consts::E };

use crate::{
    contracts::{ aavegov::{ self, ProposalCreatedFilter }, aaveexecutor, aavestrategy },
    Ctx,
};
use ethers::{ providers::{ Middleware, Provider }, types::U256, addressbook::Contract };
use futures::stream::{ FuturesUnordered, StreamExt };
use prisma_client_rust::{ chrono::{ DateTime, NaiveDateTime, Utc }, bigdecimal::ToPrimitive };
use crate::{ prisma::daohandler, router::update_chain_proposals::ChainProposal };
use ethers::{ prelude::LogMeta, types::Address };
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
    to_block: &i64
) -> Vec<ChainProposal> {
    let decoder: Decoder = match serde_json::from_value(dao_handler.clone().decoder) {
        Ok(data) => data,
        Err(_) => panic!("{:?} decoder not found", dao_handler.id),
    };

    let address = decoder.address.parse::<Address>().unwrap();

    let gov_contract = aavegov::aavegov::aavegov::new(address, ctx.client.clone());

    let events = gov_contract
        .event::<aavegov::ProposalCreatedFilter>()
        .from_block(from_block.clone())
        .to_block(to_block.clone());

    let proposals = events.query_with_meta().await.unwrap();

    let mut futures = FuturesUnordered::new();

    for p in proposals.iter() {
        futures.push(async {
            match
                data_for_proposal(
                    p.clone(),
                    &ctx,
                    &decoder,
                    &dao_handler,
                    gov_contract.clone()
                ).await
            {
                Ok(p) => p,
                Err(e) => panic!("failed to get proposal {}", e),
            }
        });
    }

    let mut result = Vec::new();
    while let Some(proposal) = futures.next().await {
        result.push(proposal);
    }

    result
}

async fn data_for_proposal(
    p: (aavegov::aavegov::ProposalCreatedFilter, LogMeta),
    ctx: &Ctx,
    decoder: &Decoder,
    dao_handler: &daohandler::Data,
    gov_contract: aavegov::aavegov::aavegov<ethers::providers::Provider<ethers::providers::Http>>
) -> Result<ChainProposal, String> {
    let (log, meta): (ProposalCreatedFilter, LogMeta) = p.clone();

    let block_created = meta.block_number;

    let created_timestamp = ctx.client
        .get_block(meta.clone().block_number).await
        .unwrap()
        .unwrap()
        .time()
        .unwrap();

    let voting_starts_block = log.clone().start_block.as_u64();
    let voting_ends_block = log.clone().end_block.as_u64();

    let voting_starts_timestamp = match ctx.client.get_block(voting_starts_block).await.unwrap() {
        Some(block) => block.time().unwrap(),
        None =>
            DateTime::from_utc(
                NaiveDateTime::from_timestamp_millis(
                    created_timestamp.timestamp() * 1000 +
                        (log.start_block.as_u64().to_i64().unwrap() -
                            meta.block_number.as_u64().to_i64().unwrap()) *
                            12 *
                            1000
                ).unwrap(),
                Utc
            ),
    };

    let voting_ends_timestamp = match ctx.client.get_block(voting_ends_block).await.unwrap() {
        Some(block) => block.time().unwrap(),
        None =>
            DateTime::from_utc(
                NaiveDateTime::from_timestamp_millis(
                    created_timestamp.timestamp() * 1000 +
                        (log.end_block.as_u64().to_i64().unwrap() -
                            meta.block_number.as_u64().to_i64().unwrap()) *
                            12 *
                            1000
                ).unwrap(),
                Utc
            ),
    };

    let _proposal_url = format!("{}{}", decoder.proposalUrl, log.id.as_u32().to_string());

    let _proposal_external_id = log.id.as_u32().to_string();

    let executor_contract = aaveexecutor::aaveexecutor::aaveexecutor::new(
        log.executor,
        ctx.client.clone()
    );

    let strategy_contract = aavestrategy::aavestrategy::aavestrategy::new(
        log.strategy,
        ctx.client.clone()
    );

    let total_voting_power = strategy_contract
        .get_total_voting_supply_at(U256::from(meta.block_number.as_u64())).await
        .unwrap();

    let min_quorum = executor_contract.minimum_quorum().await.unwrap();

    let one_hunded_with_precision = executor_contract.one_hundred_with_precision().await.unwrap();

    let _quorum = (total_voting_power * min_quorum) / one_hunded_with_precision;

    let onchain_proposal = gov_contract.get_proposal_by_id(log.id).call().await.unwrap();

    let _choices = vec!["For", "Against"];

    let _scores = vec![
        onchain_proposal.for_votes.as_u64(),
        onchain_proposal.against_votes.as_u64()
    ];

    let _scores_total =
        onchain_proposal.for_votes.as_u64() + onchain_proposal.against_votes.as_u64();

    let proposal = ChainProposal {
        external_id: _proposal_external_id,
        name: "".to_string(),
        dao_id: dao_handler.clone().daoid,
        dao_handler_id: dao_handler.clone().id,
        time_start: voting_starts_timestamp,
        time_end: voting_ends_timestamp,
        time_created: created_timestamp,
        block_created: block_created.as_u64().to_i64().unwrap(),
        choices: _choices.into(),
        scores: _scores.into(),
        scores_total: _scores_total.to_f64().unwrap(),
        quorum: _quorum.as_u64().to_f64().unwrap(),
        url: _proposal_url,
    };

    Ok(proposal)
}