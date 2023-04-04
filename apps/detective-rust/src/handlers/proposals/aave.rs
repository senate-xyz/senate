use crate::{
    contracts::{ aavegov::{ self, ProposalCreatedFilter }, aaveexecutor, aavestrategy },
    Ctx,
};
use ethers::{ providers::Middleware, types::U256 };
use prisma_client_rust::{ chrono::{ DateTime, NaiveDateTime, Utc }, bigdecimal::ToPrimitive };
use crate::{ prisma::daohandler, router::update_chain_proposals::Proposal };
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
) -> Vec<Proposal> {
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

    for p in proposals {
        let (log, meta): (ProposalCreatedFilter, LogMeta) = p.clone();

        let created_timestamp = ctx.client
            .get_block(meta.clone().block_number).await
            .unwrap()
            .unwrap()
            .time()
            .unwrap();

        let voting_starts_block = log.clone().start_block.as_u64();
        let voting_ends_block = log.clone().end_block.as_u64();

        let voting_starts_timestamp = match
            ctx.client.get_block(voting_starts_block).await.unwrap()
        {
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

        let one_hunded_with_precision = executor_contract
            .one_hundred_with_precision().await
            .unwrap();

        let _quorum = (total_voting_power * min_quorum) / one_hunded_with_precision;

        let onchain_proposal = gov_contract.get_proposal_by_id(log.id).call().await.unwrap();

        let _choices = vec!["For", "Against"];

        let _scores = vec![onchain_proposal.for_votes, onchain_proposal.against_votes];

        let _scores_total = onchain_proposal.for_votes + onchain_proposal.against_votes;

        println!(
            "{}\n{} \n\n",

            voting_starts_timestamp,
            voting_ends_timestamp
        );
    }

    vec![]
}