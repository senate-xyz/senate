use std::{collections::HashSet, sync::Arc};

use crate::{
    contracts::{makerexecutive, makerexecutive::LogNoteFilter},
    prisma::{daohandler, ProposalState},
    router::chain_proposals::ChainProposal,
    Ctx,
};
use anyhow::{Context, Result};
use chrono::{DateTime, NaiveDateTime, TimeZone, Utc};
use ethers::{
    abi::Address,
    prelude::LogMeta,
    types::{H256, U256},
    utils::to_checksum,
};
use futures::{stream::FuturesUnordered, StreamExt};
use itertools::Itertools;
use reqwest::{
    header::{ACCEPT, USER_AGENT},
    Client,
};
use reqwest_middleware::ClientWithMiddleware;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use tracing::Instrument;
use tracing::{debug_span, instrument};

#[allow(non_snake_case)]
#[derive(Debug, Deserialize)]
struct Decoder {
    address: String,
    proposalUrl: String,
}

const VOTE_MULTIPLE_ACTIONS_TOPIC: &str =
    "0xed08132900000000000000000000000000000000000000000000000000000000";
const VOTE_SINGLE_ACTION_TOPIC: &str =
    "0xa69beaba00000000000000000000000000000000000000000000000000000000";

#[instrument(skip(ctx), ret, level = "info")]
pub async fn maker_executive_proposals(
    ctx: &Ctx,
    dao_handler: &daohandler::Data,
    from_block: &i64,
    to_block: &i64,
) -> Result<Vec<ChainProposal>> {
    let decoder: Decoder = serde_json::from_value(dao_handler.clone().decoder)?;

    let address = decoder.address.parse::<Address>().expect("bad address");

    let gov_contract =
        makerexecutive::makerexecutive::makerexecutive::new(address, ctx.rpc.clone());

    let single_spell_events = gov_contract
        .log_note_filter()
        .topic0(vec![VOTE_SINGLE_ACTION_TOPIC.parse::<H256>()?])
        .from_block(*from_block)
        .to_block(*to_block);

    let single_spell_logs = single_spell_events
        .query_with_meta()
        .instrument(debug_span!("get_rpc_events"))
        .await?;

    let multi_spell_events = gov_contract
        .log_note_filter()
        .topic0(vec![VOTE_MULTIPLE_ACTIONS_TOPIC.parse::<H256>()?])
        .from_block(*from_block)
        .to_block(*to_block);

    let multi_spell_logs = multi_spell_events
        .query_with_meta()
        .instrument(debug_span!("get_rpc_events"))
        .await?;

    let single_spells = get_single_spell_addresses(single_spell_logs, gov_contract.clone()).await?;
    let multi_spells = get_multi_spell_addresses(multi_spell_logs, gov_contract.clone()).await?;

    let spell_addresses: Vec<String> = [single_spells, multi_spells]
        .concat()
        .into_iter()
        .unique()
        .collect();

    let mut futures = FuturesUnordered::new();

    for p in spell_addresses.iter() {
        futures.push(async { proposal(p, &decoder, dao_handler, ctx).await });
    }

    let mut result = Vec::new();
    while let Some(proposal) = futures.next().await {
        result.push(proposal?);
    }

    Ok(result)
}

#[instrument(skip(ctx), ret, level = "debug")]
async fn proposal(
    spell_address: &String,
    decoder: &Decoder,
    dao_handler: &daohandler::Data,
    ctx: &Ctx,
) -> Result<ChainProposal> {
    let proposal_url = format!("{}{}", decoder.proposalUrl, spell_address);

    let proposal_data = get_proposal_data(spell_address.clone(), ctx.http_client.clone()).await?;

    let title = proposal_data.title.clone();

    let created_timestamp = Utc
        .from_local_datetime(
            &NaiveDateTime::parse_from_str(
                proposal_data.clone().date.split(" GMT").next().unwrap(),
                "%a %b %d %Y %H:%M:%S",
            )
            .unwrap(),
        )
        .unwrap();

    let voting_starts_timestamp = created_timestamp;

    let mut voting_ends_timestamp =
        DateTime::parse_from_rfc3339(proposal_data.clone().spellData.expiration.as_str())
            .unwrap()
            .with_timezone(&Utc);

    let scores = &proposal_data.spellData.mkrSupport.clone();
    let scores_total = &proposal_data.spellData.mkrSupport.clone();

    let block_created = get_proposal_block(created_timestamp, ctx.http_client.clone()).await?;

    let state = if proposal_data.spellData.hasBeenCast {
        ProposalState::Executed
    } else if proposal_data.active {
        ProposalState::Active
    } else if proposal_data.spellData.hasBeenScheduled {
        ProposalState::Queued
    } else if DateTime::parse_from_rfc3339(proposal_data.clone().spellData.expiration.as_str())
        .unwrap()
        .with_timezone(&Utc)
        < Utc::now()
    {
        ProposalState::Expired
    } else {
        ProposalState::Unknown
    };

    if state == ProposalState::Executed {
        voting_ends_timestamp =
            DateTime::parse_from_rfc3339(proposal_data.clone().spellData.dateExecuted.as_str())
                .unwrap()
                .with_timezone(&Utc);
    }

    let proposal = ChainProposal {
        external_id: spell_address.to_string(),
        name: title,
        dao_id: dao_handler.clone().daoid,
        dao_handler_id: dao_handler.clone().id,
        time_start: voting_starts_timestamp,
        time_end: voting_ends_timestamp,
        time_created: created_timestamp,
        block_created: block_created.height.as_i64().unwrap(),
        choices: vec!["Yes"].into(),
        scores: scores.parse::<f64>().unwrap().into(),
        scores_total: scores_total.parse::<f64>().unwrap().into(),
        quorum: 0.into(),
        url: proposal_url,
        state,
    };

    debug!("{:?}", proposal);

    Ok(proposal)
}

#[derive(Deserialize, Serialize, PartialEq, Debug)]
struct TimeData {
    height: Value,
}

async fn get_proposal_block(
    time: DateTime<Utc>,
    http_client: Arc<ClientWithMiddleware>,
) -> Result<TimeData> {
    let mut retries = 0;

    loop {
        let response = http_client
            .get(format!(
                "https://coins.llama.fi/block/ethereum/{}",
                time.timestamp()
            ))
            .header(ACCEPT, "application/json")
            .header(USER_AGENT, "insomnia/2023.1.0")
            .timeout(std::time::Duration::from_secs(10))
            .send()
            .await;

        match response {
            Ok(res) => {
                let contents = res.text().await?;
                let data = match serde_json::from_str::<TimeData>(&contents).with_context(|| {
                    format!("Unable to deserialise response. Body was: \"{}\"", contents)
                }) {
                    Ok(d) => d,
                    Err(_) => TimeData { height: 0.into() },
                };

                return Ok(data);
            }

            _ if retries < 15 => {
                retries += 1;
                let backoff_duration = std::time::Duration::from_millis(2u64.pow(retries as u32));
                tokio::time::sleep(backoff_duration).await;
            }
            _ => {
                return Ok(TimeData { height: 0.into() });
            }
        }
    }
}

#[allow(non_snake_case)]
#[derive(Deserialize, Serialize, PartialEq, Debug, Clone)]
struct SpellData {
    expiration: String,
    datePassed: String,
    dateExecuted: String,
    mkrSupport: String,
    hasBeenCast: bool,
    hasBeenScheduled: bool,
}
#[allow(non_snake_case)]
#[derive(Deserialize, Serialize, PartialEq, Debug, Clone)]
struct ProposalData {
    title: String,
    spellData: SpellData,
    active: bool,
    date: String,
}

async fn get_proposal_data(
    spell_address: String,
    http_client: Arc<ClientWithMiddleware>,
) -> Result<ProposalData> {
    let mut retries = 0;

    loop {
        let response = http_client
            .get(format!(
                "https://vote.makerdao.com/api/executive/{}",
                spell_address
            ))
            .header(ACCEPT, "application/json")
            .header(USER_AGENT, "insomnia/2023.1.0")
            .timeout(std::time::Duration::from_secs(10))
            .send()
            .await;

        match response {
            Ok(res) => {
                let contents = res.text().await?;
                let data =
                    match serde_json::from_str::<ProposalData>(&contents).with_context(|| {
                        format!("Unable to deserialise response. Body was: \"{}\"", contents)
                    }) {
                        Ok(d) => d,
                        Err(_e) => ProposalData {
                            title: "Unknown".into(),
                            date: "Sat Jan 01 2000 00:00:00".into(),
                            active: false,
                            spellData: SpellData {
                                expiration: "2000-01-01T00:00:00-00:00".into(),
                                datePassed: "2000-01-01T00:00:00-00:00".into(),
                                dateExecuted: "2000-01-01T00:00:00-00:00".into(),
                                mkrSupport: "0".into(),
                                hasBeenCast: false,
                                hasBeenScheduled: false,
                            },
                        },
                    };

                return Ok(data);
            }

            _ if retries < 15 => {
                retries += 1;
                let backoff_duration = std::time::Duration::from_millis(2u64.pow(retries as u32));
                tokio::time::sleep(backoff_duration).await;
            }
            _ => {
                return Ok(ProposalData {
                    title: "Unknown".into(),
                    date: "Sat Jan 01 2000 00:00:00".into(),
                    active: false,
                    spellData: SpellData {
                        expiration: "2000-01-01T00:00:00-00:00".into(),
                        datePassed: "2000-01-01T00:00:00-00:00".into(),
                        dateExecuted: "2000-01-01T00:00:00-00:00".into(),
                        mkrSupport: "0".into(),
                        hasBeenCast: false,
                        hasBeenScheduled: false,
                    },
                });
            }
        }
    }
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

async fn get_single_spell_addresses(
    logs: Vec<(LogNoteFilter, LogMeta)>,
    gov_contract: makerexecutive::makerexecutive::makerexecutive<
        ethers::providers::Provider<ethers::providers::Http>,
    >,
) -> Result<Vec<String>> {
    let mut spell_addresses = HashSet::new();

    for log in logs {
        let slate: [u8; 32] = *extract_desired_bytes(&log.0.fax).first().unwrap();

        let mut count: U256 = U256::from(0);

        loop {
            let address = gov_contract.slates(slate, count).await;
            match address {
                Ok(addr) => {
                    spell_addresses.insert(to_checksum(&addr, None));
                    count += U256::from(1);
                }
                Err(_) => {
                    break;
                }
            }
        }
    }

    let result = spell_addresses
        .into_iter()
        .filter(|addr| addr != "0x0000000000000000000000000000000000000000")
        .collect::<Vec<String>>();

    Ok(result)
}

async fn get_multi_spell_addresses(
    logs: Vec<(LogNoteFilter, LogMeta)>,
    _gov_contract: makerexecutive::makerexecutive::makerexecutive<
        ethers::providers::Provider<ethers::providers::Http>,
    >,
) -> Result<Vec<String>> {
    let mut spell_addresses = HashSet::new();

    for log in logs {
        let slates = extract_desired_bytes(&log.0.fax);

        for slate in slates {
            let spell_address = Address::from(H256::from(slate));

            spell_addresses.insert(to_checksum(&spell_address, None));
        }
    }

    let result = spell_addresses
        .into_iter()
        .filter(|addr| !addr.contains("0x00000000000"))
        .collect::<Vec<String>>();

    Ok(result)
}
