use anyhow::{bail, Context, Result};
use reqwest_middleware::ClientBuilder;
use reqwest_retry::{policies::ExponentialBackoff, RetryTransientMiddleware};
use std::iter::once;

use prisma_client_rust::chrono::{DateTime, FixedOffset, NaiveDateTime, Utc};
use rocket::serde::json::Json;
use serde::{Deserialize, Deserializer};
use serde_json::Value;

use crate::{
    prisma::proposal,
    prisma::{dao, daohandler, vote},
    prisma::{voter, voterhandler},
    Ctx, VotesRequest, VotesResponse,
};

#[derive(Debug, Deserialize)]
struct GraphQLResponse {
    data: GraphQLResponseInner,
}

#[derive(Debug, Deserialize)]
struct GraphQLResponseInner {
    votes: Vec<GraphQLVote>,
}

#[derive(Debug, Clone, Deserialize)]
struct GraphQLProposal {
    id: String,
}

#[allow(dead_code)]
#[derive(Debug, Clone, Deserialize)]
struct GraphQLVote {
    id: String,
    voter: String,
    reason: String,
    choice: Value,
    vp: f64,
    created: i64,
    #[serde(deserialize_with = "parse_proposal")]
    proposal: GraphQLProposal,
}

fn parse_proposal<'de, D>(d: D) -> Result<GraphQLProposal, D::Error>
where
    D: Deserializer<'de>,
{
    Deserialize::deserialize(d).map(|x: Option<_>| x.unwrap_or(GraphQLProposal { id: "".into() }))
}

#[derive(Debug, Deserialize)]
struct Decoder {
    space: String,
}

#[post("/snapshot_votes", data = "<data>")]
pub async fn update_snapshot_votes<'a>(
    ctx: &Ctx,
    data: Json<VotesRequest<'a>>,
) -> Json<Vec<VotesResponse>> {
    let dao_handler = ctx
        .db
        .daohandler()
        .find_first(vec![daohandler::id::equals(data.daoHandlerId.to_string())])
        .exec()
        .await
        .expect("bad prisma result")
        .expect("daoHandlerId not found");

    let decoder: Decoder = match serde_json::from_value(dao_handler.clone().decoder) {
        Ok(data) => data,
        Err(_) => panic!("decoder not found"),
    };

    let voter_handlers = ctx
        .db
        .voterhandler()
        .find_many(vec![
            voterhandler::voter::is(vec![voter::address::in_vec(data.voters.clone())]),
            voterhandler::daohandler::is(vec![daohandler::id::equals(
                data.daoHandlerId.to_string(),
            )]),
        ])
        .exec()
        .await
        .expect("bad prisma result");

    let oldest_vote = voter_handlers
        .iter()
        .map(|voterhandler| {
            voterhandler
                .snapshotindex
                .expect("bad snapshotindex")
                .timestamp()
        })
        .max()
        .unwrap_or(0);

    let search_from_timestamp =
        if oldest_vote < dao_handler.snapshotindex.unwrap_or_default().timestamp() {
            oldest_vote
        } else {
            dao_handler.snapshotindex.unwrap_or_default().timestamp()
        };

    let graphql_query = format!(
        r#"{{
        votes(
            first: 1000,
            orderBy: "created",
            orderDirection: asc,
            where: {{
                voter_in: {:?},
                space: "{}",
                created_gte: {}
            }}
        ) {{
            id
            voter
            reason
            choice
            vp
            created
            proposal {{
                id
            }}
        }}
    }}"#,
        data.voters.clone(),
        decoder.space,
        search_from_timestamp
    );

    let response = match update_votes(
        graphql_query,
        search_from_timestamp,
        dao_handler,
        voter_handlers,
        ctx,
    )
    .await
    {
        Ok(_) => data
            .voters
            .clone()
            .into_iter()
            .map(|v| VotesResponse {
                voter_address: v,
                result: "ok",
            })
            .collect(),
        Err(e) => {
            println!("{:#?}", e);

            data.voters
                .clone()
                .into_iter()
                .map(|v| VotesResponse {
                    voter_address: v,
                    result: "nok",
                })
                .collect()
        }
    };

    Json(response)
}

async fn update_votes(
    graphql_query: String,
    search_from_timestamp: i64,
    dao_handler: daohandler::Data,
    voter_handlers: Vec<voterhandler::Data>,
    ctx: &Ctx,
) -> Result<()> {
    let retry_policy = ExponentialBackoff::builder().build_with_max_retries(5);

    let http_client = ClientBuilder::new(reqwest::Client::new())
        .with(RetryTransientMiddleware::new_with_policy(retry_policy))
        .build();

    let graphql_response = http_client
        .get("https://hub.snapshot.org/graphql")
        .json(&serde_json::json!({ "query": graphql_query }))
        .send()
        .await?;

    let response_data: GraphQLResponse = graphql_response
        .json()
        .await
        .with_context(|| format!("bad graphql response {}", graphql_query))?;

    let votes: Vec<GraphQLVote> = response_data
        .data
        .votes
        .into_iter()
        .filter(|v| !v.proposal.id.is_empty()) //snapshot sometimes returns votes with null proposal :-/
        .collect();

    let proposals: Vec<GraphQLProposal> = votes
        .clone()
        .iter()
        .map(|vote| vote.proposal.clone())
        .collect();

    for p in proposals {
        update_votes_for_proposal(votes.clone(), p, dao_handler.clone(), ctx).await?;
    }

    update_refresh_statuses(
        votes,
        search_from_timestamp,
        dao_handler,
        voter_handlers,
        ctx,
    )
    .await?;

    Ok(())
}

async fn update_refresh_statuses(
    votes: Vec<GraphQLVote>,
    search_from_timestamp: i64,
    dao_handler: daohandler::Data,
    voter_handlers: Vec<voterhandler::Data>,
    ctx: &Ctx,
) -> Result<()> {
    let search_to_timestamp = votes
        .clone()
        .into_iter()
        .map(|vote| vote.created)
        .chain(once(search_from_timestamp))
        .max()
        .expect("bad search_to_timestamp");

    let new_index = vec![
        search_to_timestamp,
        dao_handler
            .snapshotindex
            .expect("bad snapshotindex")
            .timestamp(),
    ]
    .into_iter()
    .min()
    .expect("bad new_index");

    ctx.db
        .voterhandler()
        .update_many(
            vec![
                voterhandler::id::in_vec(
                    voter_handlers
                        .clone()
                        .iter()
                        .map(|vh| vh.id.clone())
                        .collect(),
                ),
                voterhandler::daohandlerid::equals(dao_handler.id.clone()),
            ],
            vec![voterhandler::snapshotindex::set(Some(DateTime::from_utc(
                NaiveDateTime::from_timestamp_millis(new_index * 1000)
                    .expect("bad new_index timestamp"),
                FixedOffset::east_opt(0).unwrap(),
            )))],
        )
        .exec()
        .await?;

    Ok(())
}

async fn update_votes_for_proposal(
    votes: Vec<GraphQLVote>,
    p: GraphQLProposal,
    dao_handler: daohandler::Data,
    ctx: &Ctx,
) -> Result<()> {
    match ctx
        .db
        .proposal()
        .find_unique(proposal::externalid_daoid(
            p.id.to_string(),
            dao_handler.daoid.to_string(),
        ))
        .exec()
        .await
    {
        Ok(r) => match r {
            Some(proposal) => {
                let votes_for_proposal: Vec<GraphQLVote> = votes
                    .iter()
                    .filter(|vote| vote.proposal.id == proposal.externalid)
                    .cloned()
                    .collect();

                if proposal.timeend < Utc::now() {
                    create_old_votes(ctx, votes_for_proposal, proposal.id, dao_handler.clone())
                        .await?;
                } else {
                    update_or_create_current_votes(
                        ctx,
                        votes_for_proposal,
                        proposal.id,
                        dao_handler.clone(),
                    )
                    .await?;
                }

                Ok(())
            }
            None => bail!("proposal not found"),
        },
        Err(_) => bail!("could not get proposal"),
    }
}

async fn create_old_votes(
    ctx: &Ctx,
    votes_for_proposal: Vec<GraphQLVote>,
    proposal_id: String,
    dao_handler: daohandler::Data,
) -> Result<()> {
    let _ = ctx
        .db
        .vote()
        .create_many(
            votes_for_proposal
                .iter()
                .map(|v| {
                    vote::create_unchecked(
                        v.choice.clone(),
                        v.vp.into(),
                        v.reason.clone(),
                        v.voter.clone(),
                        proposal_id.clone(),
                        dao_handler.daoid.clone(),
                        dao_handler.id.clone(),
                        vec![vote::timecreated::set(Some(DateTime::from_utc(
                            NaiveDateTime::from_timestamp_millis(v.created * 1000)
                                .expect("bad created timestamp"),
                            FixedOffset::east_opt(0).unwrap(),
                        )))],
                    )
                })
                .collect(),
        )
        .skip_duplicates()
        .exec()
        .await?;

    Ok(())
}

async fn update_or_create_current_votes(
    ctx: &Ctx,
    votes_for_proposal: Vec<GraphQLVote>,
    proposal_id: String,
    dao_handler: daohandler::Data,
) -> Result<()> {
    let _ = ctx
        .db
        ._batch(votes_for_proposal.into_iter().map(|v| {
            ctx.db.vote().upsert(
                vote::voteraddress_daoid_proposalid(
                    v.voter.clone(),
                    dao_handler.daoid.clone(),
                    proposal_id.clone(),
                ),
                vote::create(
                    v.choice.clone(),
                    v.vp.into(),
                    v.reason.clone(),
                    voter::address::equals(v.voter.clone()),
                    proposal::id::equals(proposal_id.clone()),
                    dao::id::equals(dao_handler.daoid.clone()),
                    daohandler::id::equals(dao_handler.id.clone()),
                    vec![vote::timecreated::set(Some(DateTime::from_utc(
                        NaiveDateTime::from_timestamp_millis(v.created * 1000)
                            .expect("bad created timestamp"),
                        FixedOffset::east_opt(0).unwrap(),
                    )))],
                ),
                vec![
                    vote::timecreated::set(Some(DateTime::from_utc(
                        NaiveDateTime::from_timestamp_millis(v.created * 1000)
                            .expect("bad created timestamp"),
                        FixedOffset::east_opt(0).unwrap(),
                    ))),
                    vote::choice::set(v.choice.clone()),
                    vote::votingpower::set(v.vp.into()),
                    vote::reason::set(v.reason),
                ],
            )
        }))
        .await?;

    Ok(())
}
