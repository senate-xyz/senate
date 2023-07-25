use std::{str, sync::Arc, vec};

use anyhow::{Context, Result};
use chrono::Duration;
use ethers::{
    prelude::LogMeta,
    providers::Middleware,
    types::{Address, Filter},
};
use futures::stream::{FuturesUnordered, StreamExt};
use prisma_client_rust::{
    bigdecimal::ToPrimitive,
    chrono::{DateTime, NaiveDateTime, Utc},
};
use regex::Regex;
use reqwest::{
    header::{ACCEPT, USER_AGENT},
    Client, StatusCode,
};
use reqwest_middleware::{ClientBuilder, ClientWithMiddleware};
use reqwest_retry::{policies::ExponentialBackoff, RetryTransientMiddleware};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use tracing::{debug_span, instrument, Instrument};

use crate::{
    contracts::{makerpollcreate, makerpollcreate::PollCreatedFilter},
    prisma::{daohandler, ProposalState},
    router::chain_proposals::ChainProposal,
    Ctx,
};

#[allow(non_snake_case)]
#[derive(Debug, Deserialize)]
struct Decoder {
    address_create: String,
    proposalUrl: String,
}

#[instrument(skip(ctx), level = "info")]
pub async fn maker_poll_proposals(
    ctx: &Ctx,
    dao_handler: &daohandler::Data,
    from_block: &i64,
    to_block: &i64,
) -> Result<Vec<ChainProposal>> {
    let decoder: Decoder = serde_json::from_value(dao_handler.clone().decoder)?;

    let address = decoder
        .address_create
        .parse::<Address>()
        .expect("bad address");

    let gov_contract =
        makerpollcreate::makerpollcreate::makerpollcreate::new(address, ctx.rpc.clone());

    let events = gov_contract
        .poll_created_filter()
        .from_block(*from_block)
        .to_block(*to_block);

    let proposals = events
        .query_with_meta()
        .instrument(debug_span!("get_rpc_events"))
        .await?;

    let mut futures = FuturesUnordered::new();

    for p in proposals.iter() {
        futures.push(async { data_for_proposal(p.clone(), ctx, &decoder, dao_handler).await });
    }

    let mut result = Vec::new();
    while let Some(proposal) = futures.next().await {
        result.push(proposal?);
    }

    Ok(result)
}

#[instrument(skip(p, ctx, decoder), ret, level = "debug")]
async fn data_for_proposal(
    p: (makerpollcreate::makerpollcreate::PollCreatedFilter, LogMeta),
    ctx: &Ctx,
    decoder: &Decoder,
    dao_handler: &daohandler::Data,
) -> Result<ChainProposal> {
    let (log, meta): (PollCreatedFilter, LogMeta) = p.clone();

    let created_block_number = meta.block_number.as_u64().to_i64().unwrap();
    let created_block = ctx.rpc.get_block(meta.clone().block_number).await?;
    let created_block_timestamp = created_block.expect("bad block").time()?;

    let mut voting_starts_timestamp = DateTime::from_utc(
        NaiveDateTime::from_timestamp_millis(log.start_date.as_u64().to_i64().unwrap() * 1000)
            .expect("bad timestamp"),
        Utc,
    );

    let mut voting_ends_timestamp = DateTime::from_utc(
        NaiveDateTime::from_timestamp_millis(log.end_date.as_u64().to_i64().unwrap() * 1000)
            .expect("bad timestamp"),
        Utc,
    );

    let proposal_url = format!(
        "{}{}",
        decoder.proposalUrl,
        log.multi_hash.chars().take(8).collect::<String>()
    );

    let proposal_external_id = log.poll_id.to_string();

    let title = get_title(log.url).await?;

    let mut choices: Vec<String> = vec![];
    let mut scores: Vec<f64> = vec![];
    let mut scores_total: f64 = 0.0;
    let quorum: u128 = 0;

    let mut results_data = get_results_data(log.poll_id.to_string()).await?.results;

    results_data.sort_by(|a, b| {
        a.optionId
            .as_u64()
            .unwrap()
            .cmp(&b.optionId.as_u64().unwrap())
    });

    for res in results_data {
        choices.push(res.optionName.to_string());
        scores.push(res.mkrSupport.as_str().unwrap().parse::<f64>().unwrap());
        scores_total += res.mkrSupport.as_str().unwrap().parse::<f64>().unwrap();
    }

    //do some sanity here because mkr is weird
    if voting_starts_timestamp - Utc::now() > Duration::days(365) {
        voting_starts_timestamp =
            DateTime::from_utc(NaiveDateTime::from_timestamp_millis(0).unwrap(), Utc)
    }
    if voting_ends_timestamp - Utc::now() > Duration::days(365) {
        voting_ends_timestamp =
            DateTime::from_utc(NaiveDateTime::from_timestamp_millis(0).unwrap(), Utc)
    }

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
        scores: scores.into(),
        scores_total: scores_total.into(),
        quorum: quorum.into(),
        url: proposal_url,
        state: if voting_ends_timestamp.timestamp() < Utc::now().timestamp() {
            ProposalState::Executed
        } else {
            ProposalState::Active
        },
    };

    Ok(proposal)
}

#[allow(non_snake_case)]
#[derive(Deserialize, Serialize, PartialEq, Debug)]
struct ResultData {
    mkrSupport: Value,
    optionName: Value,
    optionId: Value,
}

#[derive(Deserialize, Serialize, PartialEq, Debug)]
struct ResultsData {
    results: Vec<ResultData>,
}

#[instrument]
async fn get_results_data(poll_id: String) -> Result<ResultsData> {
    let mut retries = 0;

    let retry_policy = ExponentialBackoff::builder().build_with_max_retries(5);
    let http_client = ClientBuilder::new(reqwest::Client::new())
        .with(RetryTransientMiddleware::new_with_policy(retry_policy))
        .build();

    loop {
        let response = http_client
            .get(format!(
                "https://vote.makerdao.com/api/polling/tally/{:}",
                poll_id
            ))
            .header(ACCEPT, "application/json")
            .header(USER_AGENT, "insomnia/2023.1.0")
            .timeout(std::time::Duration::from_secs(10))
            .send()
            .await;

        match response {
            Ok(res) => {
                let contents = res.text().await?;
                let data = match serde_json::from_str::<ResultsData>(&contents).with_context(|| {
                    format!("Unable to deserialise response. Body was: \"{}\"", contents)
                }) {
                    Ok(d) => d,
                    Err(_) => ResultsData { results: vec![] },
                };

                return Ok(data);
            }

            _ if retries < 15 => {
                retries += 1;
                let backoff_duration = std::time::Duration::from_millis(2u64.pow(retries as u32));
                tokio::time::sleep(backoff_duration).await;
            }
            _ => {
                return Ok(ResultsData { results: vec![] });
            }
        }
    }
}

#[instrument]
async fn get_title(url: String) -> Result<String> {
    let client = Client::new();
    let mut retries = 0;

    loop {
        let response = client
            .get(url.clone())
            .timeout(std::time::Duration::from_secs(10))
            .send()
            .await;

        match response {
            Ok(res) if res.status() == StatusCode::OK => {
                let text = match res.text().await {
                    Ok(r) => r,
                    Err(_) => "Unknown".to_string(),
                };
                let pattern = r"(?m)^title:\s*(.+)$";
                let re = Regex::new(pattern).unwrap();
                let result = re
                    .captures(text.as_str())
                    .and_then(|cap| cap.get(1).map(|m| m.as_str().to_string()))
                    .unwrap_or("Unknown".to_string());
                return Ok(result);
            }
            _ if retries < 15 => {
                retries += 1;
                let backoff_duration = std::time::Duration::from_millis(2u64.pow(retries as u32));
                tokio::time::sleep(backoff_duration).await;
            }
            _ => return Ok("Unknown".to_string()),
        }
    }
}

// #[cfg(test)]
// mod tests {

//     use serde_json::Value;

//     use super::{get_results_data, ResultData, ResultsData};

//     #[tokio::test]
//     async fn get_results_data_1() {
//         let expected = ResultsData {
//             results: vec![
//                 ResultData {
//                     optionName: Value::from("Yes"),
//                     optionId: Value::from(1),
//                     mkrSupport: Value::from("5742.391818873815517002"),
//                 },
//                 ResultData {
//                     optionName: Value::from("No"),
//                     optionId: Value::from(2),
//                     mkrSupport: Value::from("403.994725781516278273"),
//                 },
//                 ResultData {
//                     optionName: Value::from("Abstain"),
//                     optionId: Value::from(0),
//                     mkrSupport: Value::from("0"),
//                 },
//             ],
//         };

//         let result = get_results_data("160".to_string()).await.unwrap();
//         assert_eq!(result, expected);
//     }

//     #[tokio::test]
//     async fn get_results_data_2() {
//         let expected = ResultsData {
//             results: vec![
//                 ResultData {
//                     optionName: Value::from("Yes"),
//                     optionId: Value::from(1),

//                     mkrSupport: Value::from("24231.400515208833076916"),
//                 },
//                 ResultData {
//                     optionName: Value::from("No"),
//                     optionId: Value::from(2),
//                     mkrSupport: Value::from("10058.930894763635322606"),
//                 },
//                 ResultData {
//                     optionName: Value::from("Abstain"),
//                     optionId: Value::from(0),
//                     mkrSupport: Value::from("0"),
//                 },
//             ],
//         };

//         let result = get_results_data("99".to_string()).await.unwrap();
//         assert_eq!(result, expected);
//     }

//     #[tokio::test]
//     async fn get_results_data_unknown() {
//         let expected = ResultsData { results: vec![] };

//         let result = get_results_data("163430".to_string()).await.unwrap();
//         assert_eq!(result, expected);
//     }

//     use crate::handlers::proposals::maker_poll::get_title;

//     #[tokio::test]
//     async fn get_title_1() {
//         let result =
//             get_title("https://raw.githubusercontent.com/makerdao/community/master/governance/polls/Arbitration%20Scope%20Clarification%20Edits%20-%20April%203%2C%202023.md".into())
//                 .await
//                 .unwrap();
//         assert_eq!(
//             result,
//             "Arbitration Scope Clarification Edits - April 3, 2023"
//         );
//     }

//     #[tokio::test]
//     async fn get_title_2() {
//         let result =
//             get_title("https://raw.githubusercontent.com/makerdao/community/master/governance/polls/Decentralized%20Collateral%20Scope%20Parameter%20Changes%20-%20Add%20exemptions%20to%20the%20Benchmark%20Yield%20Requirement%20-%20April%203%2C%202023.md".into())
//                 .await
//                 .unwrap();
//         assert_eq!(
//             result,
//             "Decentralized Collateral Scope Parameter Changes - Add Exemptions to the Benchmark Yield Requirement - April 3, 2023"
//         );
//     }

//     #[tokio::test]
//     async fn get_title_3() {
//         let result =
//             get_title("https://raw.githubusercontent.com/makerdao/community/master/governance/polls/Offboarding%20Parameters%20Proposal%20-%20April%203%2C%202023.md".into())
//                 .await
//                 .unwrap();
//         assert_eq!(result, "Offboarding Parameters Proposal - April 3, 2023");
//     }

//     #[tokio::test]
//     async fn get_title_unknown() {
//         let result =
//             get_title("https://raw.githubuserconent.com/makerdao/community/master/governance/polls/Offboarding%20Parameters%20Proposal%20-%20April%203%2C%202023.md".into())
//                 .await
//                 .unwrap();
//         assert_eq!(result, "Unknown");
//     }
// }
