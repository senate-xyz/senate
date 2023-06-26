use std::collections::HashSet;

use anyhow::{bail, Result};
use ethers::{
    prelude::LogMeta,
    types::{Address, H160, H256, U256},
    utils::to_checksum,
};
use futures::stream::{FuturesUnordered, StreamExt};
use itertools::Itertools;
use prisma_client_rust::chrono::Utc;
use serde::Deserialize;
use tracing::Instrument;
use tracing::{debug_span, instrument};

use crate::{
    contracts::makerexecutive::{self, LogNoteFilter},
    prisma::{daohandler, proposal},
    router::chain_votes::{Vote, VoteResult},
    Ctx,
};

#[allow(non_snake_case)]
#[derive(Debug, Deserialize)]
struct Decoder {
    address: String,
}

const VOTE_MULTIPLE_ACTIONS_TOPIC: &str =
    "0xed08132900000000000000000000000000000000000000000000000000000000";
const VOTE_SINGLE_ACTION_TOPIC: &str =
    "0xa69beaba00000000000000000000000000000000000000000000000000000000";

#[instrument(skip(ctx, voters), level = "info")]
pub async fn makerexecutive_votes(
    ctx: &Ctx,
    dao_handler: &daohandler::Data,
    from_block: &i64,
    to_block: &i64,
    voters: Vec<String>,
) -> Result<Vec<VoteResult>> {
    let voters_addresses: Vec<H256> = voters
        .clone()
        .into_iter()
        .map(|v| H256::from(v.parse::<H160>().unwrap()))
        .collect();

    let decoder: Decoder = serde_json::from_value(dao_handler.clone().decoder)?;

    let address = decoder.address.parse::<Address>().expect("bad address");

    let gov_contract =
        makerexecutive::makerexecutive::makerexecutive::new(address, ctx.rpc.clone());

    let single_spell_events = gov_contract
        .log_note_filter()
        .topic0(vec![VOTE_SINGLE_ACTION_TOPIC.parse::<H256>()?])
        .topic1(voters_addresses.clone())
        .from_block(*from_block)
        .to_block(*to_block);

    let single_spell_logs = single_spell_events
        .query_with_meta()
        .instrument(debug_span!("get_rpc_events"))
        .await?;

    let multi_spell_events = gov_contract
        .log_note_filter()
        .topic0(vec![VOTE_MULTIPLE_ACTIONS_TOPIC.parse::<H256>()?])
        .topic1(voters_addresses.clone())
        .from_block(*from_block)
        .to_block(*to_block);

    let multi_spell_logs = multi_spell_events
        .query_with_meta()
        .instrument(debug_span!("get_rpc_events"))
        .await?;

    let single_spells =
        get_single_spell_addresses(voters.clone(), single_spell_logs, gov_contract.clone()).await?;
    let multi_spells =
        get_multi_spell_addresses(voters.clone(), multi_spell_logs, gov_contract.clone()).await?;

    let spell_addresses: Vec<SpellCast> = [single_spells, multi_spells]
        .concat()
        .into_iter()
        .unique()
        .collect();

    let mut futures = FuturesUnordered::new();

    for voter_address in voters.iter() {
        futures.push(async {
            let spells_for_voter = &spell_addresses
                .iter()
                .filter(|sc| sc.voter.clone() == *voter_address)
                .collect_vec()
                .first()
                .unwrap()
                .spells;

            get_votes_for_voter(
                spells_for_voter.to_vec(),
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

#[instrument(skip(ctx, spell_addresses), level = "debug")]
async fn get_votes_for_voter(
    spell_addresses: Vec<String>,
    dao_handler: daohandler::Data,
    voter_address: String,
    ctx: &Ctx,
) -> Result<VoteResult> {
    let mut votes: Vec<Vote> = vec![];

    for spell in spell_addresses {
        let p = ctx
            .db
            .proposal()
            .find_first(vec![
                proposal::externalid::equals(spell.to_string()),
                proposal::daoid::equals(dao_handler.clone().daoid.to_string()),
                proposal::daohandlerid::equals(dao_handler.clone().id.to_string()),
            ])
            .exec()
            .await?;

        let proposal = match p {
            Some(r) => r,
            None => bail!("proposal {} for vote does not exist", spell),
        };

        votes.push(Vote {
            block_created: 0,
            voter_address: voter_address.clone(),
            dao_id: dao_handler.clone().daoid.to_string(),
            proposal_id: proposal.id,
            dao_handler_id: dao_handler.clone().id.to_string(),
            choice: 1.into(),
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

//this takes out the first 4 bytes because that's the method being called
//after that, it builds a vec of 32 byte chunks for as long as the input is
fn extract_desired_bytes(bytes: &[u8]) -> Vec<[u8; 32]> {
    let mut iterration = 0;

    let mut result_vec = vec![];

    loop {
        let start_index = 4 + iterration * 32;

        if bytes.len() < start_index + 32 {
            break;
        }
        let mut result: [u8; 32] = [0; 32];

        for (i, byte) in bytes[start_index..(start_index + 32)].iter().enumerate() {
            result[i] = *byte;
        }
        result_vec.push(result);
        iterration += 1;
    }

    result_vec
}

#[derive(Clone, PartialEq, Eq, Hash)]
struct SpellCast {
    voter: String,
    spells: Vec<String>,
}

async fn get_single_spell_addresses(
    voters: Vec<String>,
    logs: Vec<(LogNoteFilter, LogMeta)>,
    gov_contract: makerexecutive::makerexecutive::makerexecutive<
        ethers::providers::Provider<ethers::providers::Http>,
    >,
) -> Result<Vec<SpellCast>> {
    let mut spells: Vec<SpellCast> = vec![];

    for voter in voters {
        let mut voter_spells = HashSet::new();

        for log in logs.clone() {
            let slate: [u8; 32] = *extract_desired_bytes(&log.0.fax).first().unwrap();

            let mut count: U256 = U256::from(0);

            if to_checksum(&log.0.guy, None) == voter {
                loop {
                    let address = gov_contract.slates(slate, count).await;
                    match address {
                        Ok(addr) => {
                            if !voter_spells.contains(&to_checksum(&addr, None)) {
                                voter_spells.insert(to_checksum(&addr, None));
                            }
                            count += U256::from(1);
                        }
                        Err(_) => {
                            break;
                        }
                    }
                }
            }
        }
        let spells_for_voter = voter_spells
            .into_iter()
            .filter(|addr| !addr.contains("0x00000000000"))
            .collect::<Vec<String>>();

        spells.push(SpellCast {
            voter,
            spells: spells_for_voter,
        })
    }

    Ok(spells)
}

async fn get_multi_spell_addresses(
    voters: Vec<String>,
    logs: Vec<(LogNoteFilter, LogMeta)>,
    _gov_contract: makerexecutive::makerexecutive::makerexecutive<
        ethers::providers::Provider<ethers::providers::Http>,
    >,
) -> Result<Vec<SpellCast>> {
    let mut spells: Vec<SpellCast> = vec![];

    for voter in voters {
        let mut voter_spells = HashSet::new();
        for log in logs.clone() {
            let slates = extract_desired_bytes(&log.0.fax);

            for slate in slates {
                let spell_address = Address::from(H256::from(slate));
                if !voter_spells.contains(&to_checksum(&spell_address, None))
                    && to_checksum(&log.0.guy, None) == voter
                {
                    voter_spells.insert(to_checksum(&spell_address, None));
                }
            }
        }
        let spells_for_voter = voter_spells
            .into_iter()
            .filter(|addr| !addr.contains("0x00000000000"))
            .collect::<Vec<String>>();

        spells.push(SpellCast {
            voter,
            spells: spells_for_voter,
        })
    }

    Ok(spells)
}
