use crate::{
    contracts::compoundgov::{self, VoteCastFilter},
    prisma::{daohandler, proposal},
    router::chain_votes::{Vote, VoteResult},
    Ctx,
};
use anyhow::{bail, Result};
use ethers::{
    prelude::LogMeta,
    types::{Address, H160, H256},
};

use futures::stream::{FuturesUnordered, StreamExt};
use prisma_client_rust::{bigdecimal::ToPrimitive, chrono::Utc};
use serde::Deserialize;
use tracing::instrument;

#[allow(non_snake_case)]
#[derive(Debug, Deserialize)]
struct Decoder {
    address: String,
}

#[instrument]
pub async fn compound_votes(
    ctx: &Ctx,
    dao_handler: &daohandler::Data,
    from_block: &i64,
    to_block: &i64,
    voters: Vec<String>,
) -> Result<Vec<VoteResult>> {
    let decoder: Decoder = serde_json::from_value(dao_handler.clone().decoder)?;

    let address = decoder.address.parse::<Address>().expect("bad address");

    let gov_contract = compoundgov::compoundgov::compoundgov::new(address, ctx.rpc.clone());

    let voters_addresses: Vec<H256> = voters
        .clone()
        .into_iter()
        .map(|v| H256::from(v.parse::<H160>().unwrap()))
        .collect();

    let events = gov_contract
        .event::<compoundgov::VoteCastFilter>()
        .topic1(voters_addresses)
        .from_block(*from_block)
        .to_block(*to_block);

    let logs = events.query_with_meta().await?;

    let mut futures = FuturesUnordered::new();

    for voter_address in voters.iter() {
        futures.push(async {
            get_votes_for_voter(
                logs.clone(),
                dao_handler.clone(),
                voter_address.clone(),
                ctx,
            )
            .await
        });
    }

    let mut result = Vec::new();
    while let Some(voteresult) = futures.next().await {
        result.push(voteresult?);
    }

    Ok(result
        .iter()
        .map(|r| VoteResult {
            voter_address: r.voter_address.clone(),
            success: true,
            votes: r.votes.clone(),
        })
        .collect())
}

#[instrument]
async fn get_votes_for_voter(
    logs: Vec<(VoteCastFilter, LogMeta)>,
    dao_handler: daohandler::Data,
    voter_address: String,
    ctx: &Ctx,
) -> Result<VoteResult> {
    let voter_logs: Vec<(VoteCastFilter, LogMeta)> = logs
        .into_iter()
        .filter(|l| format!("{:#x}", l.clone().0.voter) == voter_address.clone().to_lowercase())
        .collect();

    let mut votes: Vec<Vote> = vec![];

    for (log, meta) in voter_logs {
        let p = ctx
            .db
            .proposal()
            .find_first(vec![
                proposal::externalid::equals(log.proposal_id.to_string()),
                proposal::daoid::equals(dao_handler.clone().daoid.to_string()),
                proposal::daohandlerid::equals(dao_handler.clone().id.to_string()),
            ])
            .exec()
            .await?;

        let proposal = match p {
            Some(r) => r,
            None => {
                bail!(
                    "proposal {} for vote does not exist",
                    log.proposal_id.to_string()
                )
            }
        };

        votes.push(Vote {
            block_created: meta
                .block_number
                .clone()
                .as_u64()
                .to_i64()
                .expect("bad conversion"),
            voter_address: voter_address.clone(),
            dao_id: dao_handler.clone().daoid.to_string(),
            proposal_id: proposal.id,
            dao_handler_id: dao_handler.clone().id.to_string(),
            choice: if log.support == 1 { 1.into() } else { 3.into() },
            reason: "".to_string(),
            voting_power: log.votes.as_u128().into(),
            proposal_active: proposal.timeend > Utc::now(),
        })
    }

    Ok(VoteResult {
        voter_address: voter_address.clone(),
        success: true,
        votes,
    })
}
