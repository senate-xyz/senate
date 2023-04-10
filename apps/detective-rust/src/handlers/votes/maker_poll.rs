use crate::{
    contracts::makerpollvote::{self, VotedFilter},
    prisma::{daohandler, proposal},
    router::update_chain_votes::{Vote, VoteResult},
    Ctx,
};
use anyhow::{bail, Result};
use ethers::{
    prelude::LogMeta,
    types::{Address, H160, H256},
};

use futures::stream::{FuturesUnordered, StreamExt};
use num_bigint::BigInt;
use prisma_client_rust::{bigdecimal::ToPrimitive, chrono::Utc};
use serde::Deserialize;
use std::str::FromStr;

#[allow(non_snake_case)]
#[derive(Debug, Deserialize)]
struct Decoder {
    address_vote: String,
}

pub async fn makerpoll_votes(
    ctx: &Ctx,
    dao_handler: &daohandler::Data,
    from_block: &i64,
    to_block: &i64,
    voters: Vec<String>,
) -> Result<Vec<VoteResult>> {
    let decoder: Decoder = serde_json::from_value(dao_handler.clone().decoder)?;

    let address = decoder
        .address_vote
        .parse::<Address>()
        .expect("bad address");

    let gov_contract =
        makerpollvote::makerpollvote::makerpollvote::new(address, ctx.client.clone());

    let voters_addresses: Vec<H256> = voters
        .clone()
        .into_iter()
        .map(|v| H256::from(v.parse::<H160>().unwrap()))
        .collect();

    let events = gov_contract
        .event::<makerpollvote::VotedFilter>()
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

async fn get_votes_for_voter(
    logs: Vec<(VotedFilter, LogMeta)>,
    dao_handler: daohandler::Data,
    voter_address: String,
    ctx: &Ctx,
) -> Result<VoteResult> {
    let voter_logs: Vec<(VotedFilter, LogMeta)> = logs
        .into_iter()
        .filter(|l| format!("{:#x}", l.clone().0.voter) == voter_address.clone().to_lowercase())
        .collect();

    let mut votes: Vec<Vote> = vec![];

    for (log, meta) in voter_logs {
        let p = ctx
            .db
            .proposal()
            .find_first(vec![
                proposal::externalid::equals(log.poll_id.to_string()),
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
                    log.poll_id.to_string()
                )
            }
        };

        let options = get_options(log.option_id.to_string()).await?;

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
            choice: options.into(),
            reason: "".to_string(),
            voting_power: 0.into(),
            proposal_active: proposal.timeend > Utc::now(),
        })
    }

    Ok(VoteResult {
        voter_address: voter_address.clone(),
        success: true,
        votes,
    })
}

//I have no idea how this works but this is the reverse of what mkr does here
//https://github.com/makerdao/governance-portal-v2/blob/efeaa159a86748646af136f34c807b2dc9a2c401/modules/polling/api/victory_conditions/__tests__/instantRunoff.spec.ts#L13
async fn get_options(raw_option: String) -> Result<Vec<u8>> {
    pub enum Endian {
        Big,
    }

    pub struct ToBufferOptions {
        pub endian: Endian,
        pub size: usize,
    }

    impl Default for ToBufferOptions {
        fn default() -> Self {
            ToBufferOptions {
                endian: Endian::Big,
                size: 1,
            }
        }
    }

    let opts = ToBufferOptions::default();
    let num = BigInt::from_str(raw_option.as_str())
        .map_err(|_| "Invalid input")
        .unwrap();

    let mut hex = num.to_bytes_be().1;
    if hex.len() % opts.size != 0 {
        let padding = opts.size - (hex.len() % opts.size);
        let mut padded_hex = vec![0; padding];
        padded_hex.append(&mut hex);
        hex = padded_hex;
    }

    let mut buf = Vec::new();

    for chunk in hex.chunks(opts.size) {
        match opts.endian {
            Endian::Big => buf.extend_from_slice(chunk),
        }
    }

    Ok(buf)
}
