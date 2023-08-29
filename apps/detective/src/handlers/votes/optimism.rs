use std::sync::Arc;

use anyhow::{bail, Result};
use ethers::{
    prelude::LogMeta,
    providers::{Http, Provider},
    types::{Address, Filter},
};
use futures::stream::{FuturesUnordered, StreamExt};
use prisma_client_rust::{bigdecimal::ToPrimitive, chrono::Utc};
use serde::Deserialize;
use tracing::{debug_span, instrument, Instrument};

use crate::{
    contracts::optimismgov::{self, VoteCastFilter},
    daohandler_with_dao,
    prisma::{daohandler, proposal, PrismaClient},
    router::chain_votes::{Vote, VoteResult},
    Ctx,
};

#[allow(non_snake_case)]
#[derive(Debug, Deserialize)]
struct Decoder {
    address: String,
}

pub async fn optimism_votes(
    db: &Arc<PrismaClient>,
    rpc: &Arc<Provider<Http>>,
    dao_handler: &daohandler_with_dao::Data,
    from_block: i64,
    to_block: i64,
    voters: Vec<String>,
) -> Result<Vec<VoteResult>> {
    let decoder: Decoder = serde_json::from_value(dao_handler.clone().decoder)?;

    let address = decoder.address.parse::<Address>().expect("bad address");

    let gov_contract = optimismgov::optimismgov::optimismgov::new(address, rpc.clone());

    let events = gov_contract
        .event::<optimismgov::VoteCastFilter>()
        .from_block(from_block)
        .to_block(to_block);

    let logs = events.query_with_meta().await?;

    let mut futures = FuturesUnordered::new();

    for voter_address in voters.iter() {
        futures.push(async {
            get_votes_for_voter(
                logs.clone(),
                dao_handler.clone(),
                voter_address.clone(),
                db.clone(),
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

async fn get_votes_for_voter(
    logs: Vec<(VoteCastFilter, LogMeta)>,
    dao_handler: daohandler_with_dao::Data,
    voter_address: String,
    db: Arc<PrismaClient>,
) -> Result<VoteResult> {
    let voter_logs: Vec<(VoteCastFilter, LogMeta)> = logs
        .into_iter()
        .filter(|l| format!("{:#x}", l.clone().0.voter) == voter_address.clone().to_lowercase())
        .collect();

    let mut votes: Vec<Vote> = vec![];

    let mut success = true;
    for (log, meta) in voter_logs {
        let p = db
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
                success = false;
                continue;
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
            choice: log.support.into(),
            reason: log.reason.to_string(),
            voting_power: log.weight.as_u128().into(),
            proposal_active: proposal.timeend > Utc::now(),
        })
    }

    Ok(VoteResult {
        voter_address: voter_address.clone(),
        success,
        votes,
    })
}
