use crate::{
    contracts::aavegov::{self, ProposalCreatedFilter},
    Ctx,
};
use crate::{prisma::daohandler, router::update_chain_proposals::Proposal};
use ethers::{prelude::LogMeta, types::Address};
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
) -> Vec<Proposal> {
    let decoder: Decoder = match serde_json::from_value(dao_handler.clone().decoder) {
        Ok(data) => data,
        Err(_) => panic!("{:?} decoder not found", dao_handler.id),
    };

    let address = decoder.address.parse::<Address>().unwrap();

    let gov_contract = aavegov::aavegov::aavegov::new(address, ctx.provider.clone());

    let events = gov_contract
        .event::<aavegov::ProposalCreatedFilter>()
        .from_block(from_block.clone())
        .to_block(to_block.clone());

    let proposals = events.query_with_meta().await.unwrap();

    for p in proposals {
        let (log, meta): (ProposalCreatedFilter, LogMeta) = p.clone();

        let created_timestamp = ctx
            .provider
            .get_block(meta.clone().block_number)
            .await
            .unwrap()
            .time()
            .unwrap();

        let voting_starts_timestamp = ctx
            .provider
            .get_block(log.clone().start_block.as_u64())
            .await
            .unwrap()
            .time()
            .unwrap();

        let voting_ends_timestamp = ctx
            .provider
            .get_block(log.clone().end_block.as_u64())
            .await
            .unwrap()
            .time()
            .unwrap();

        let proposal_url = format!("{}{}", decoder.proposalUrl, log.id.as_u32().to_string());

        let proposal_external_id = log.id.as_u32().to_string();

        println!(
            "{} {} {} {} {}",
            created_timestamp,
            voting_starts_timestamp,
            voting_ends_timestamp,
            proposal_url,
            proposal_external_id
        );
    }

    println!("{:?}", proposals);

    vec![]
}
