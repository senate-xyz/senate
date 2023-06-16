use anyhow::{bail, Context, Result};
use chrono::Duration;
use futures::future::join_all;
use opentelemetry::propagation::TextMapPropagator;
use reqwest_middleware::ClientBuilder;
use reqwest_retry::{policies::ExponentialBackoff, RetryTransientMiddleware};
use std::iter::once;
use tracing::{debug_span, info_span, instrument, span, trace_span, Instrument, Level, Span};
use tracing_opentelemetry::OpenTelemetrySpanExt;

use prisma_client_rust::chrono::{DateTime, FixedOffset, NaiveDateTime, Utc};
use rocket::serde::json::Json;
use serde::{Deserialize, Deserializer};
use serde_json::Value;

use crate::{
    prisma::{dao, daohandler, proposal, vote, voter, voterhandler},
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
    let root_span = info_span!("update_snapshot_votes");

    let carrier: std::collections::HashMap<String, String> =
        serde_json::from_value(data.trace.clone()).unwrap_or_default();
    let propagator = opentelemetry::sdk::propagation::TraceContextPropagator::new();
    let parent_context = propagator.extract(&carrier);

    root_span.set_parent(parent_context.clone());

    async move {
        let dao_handler = ctx
            .db
            .daohandler()
            .find_first(vec![daohandler::id::equals(data.daoHandlerId.to_string())])
            .exec()
            .instrument(debug_span!("get_dao_handler"))
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
            .instrument(debug_span!("get_voter_handlers"))
            .await
            .expect("bad prisma result");

        let newest_vote = voter_handlers
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
            if newest_vote < dao_handler.snapshotindex.unwrap_or_default().timestamp() {
                newest_vote
            } else {
                dao_handler.snapshotindex.unwrap_or_default().timestamp()
            };

        let graphql_query = format!(
            r#"{{
        votes(
            first: {:?},
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
            if data.refreshspeed > 1000 {
                1000
            } else {
                data.refreshspeed
            },
            data.voters.clone(),
            decoder.space,
            search_from_timestamp
        );

        debug!(
            "{:?} {:?} {:?} {:?}",
            dao_handler, decoder, search_from_timestamp, graphql_query,
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
                    success: true,
                })
                .collect(),
            Err(e) => {
                warn!("{:?}", e);
                data.voters
                    .clone()
                    .into_iter()
                    .map(|v| VotesResponse {
                        voter_address: v,
                        success: false,
                    })
                    .collect()
            }
        };

        Json(response)
    }
    .instrument(root_span)
    .await
}

#[instrument(skip(ctx, voter_handlers), level = "debug")]
async fn update_votes(
    graphql_query: String,
    search_from_timestamp: i64,
    dao_handler: daohandler::Data,
    voter_handlers: Vec<voterhandler::Data>,
    ctx: &Ctx,
) -> Result<()> {
    let graphql_response = ctx
        .http_client
        .get("https://hub.snapshot.org/graphql")
        .json(&serde_json::json!({ "query": graphql_query }))
        .send()
        .instrument(debug_span!("get_graphql_response"))
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

#[instrument(skip(ctx, votes, voter_handlers), level = "debug")]
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

    let mut new_index = vec![
        search_to_timestamp,
        dao_handler
            .snapshotindex
            .expect("bad snapshotindex")
            .timestamp(),
    ]
    .into_iter()
    .min()
    .expect("bad new_index");

    if search_to_timestamp == search_from_timestamp || votes.is_empty() {
        new_index = Utc::now().timestamp();
    }

    let mut uptodate = false;

    if (search_to_timestamp - dao_handler.snapshotindex.unwrap().timestamp() < 10 * 60 * 60
        && dao_handler.uptodate)
        || votes.len() < 100
    {
        uptodate = true;
    }

    if search_to_timestamp > dao_handler.snapshotindex.unwrap().timestamp() {
        uptodate = true;
    }

    debug!("{:?} {:?}", search_to_timestamp, new_index);

    let updated = ctx
        .db
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
            vec![
                voterhandler::snapshotindex::set(Some(
                    DateTime::from_utc(
                        NaiveDateTime::from_timestamp_millis(new_index * 1000)
                            .expect("bad new_index timestamp"),
                        FixedOffset::east_opt(0).unwrap(),
                    ) - Duration::minutes(60),
                )),
                voterhandler::uptodate::set(uptodate),
            ],
        )
        .exec()
        .instrument(debug_span!("update_snapshotindex"))
        .await?;

    debug!("{:?} ", updated);

    Ok(())
}

#[instrument(skip(ctx, votes), level = "debug")]
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
        .instrument(debug_span!("get_proposal"))
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

#[instrument(skip(ctx, votes_for_proposal), level = "debug")]
async fn create_old_votes(
    ctx: &Ctx,
    votes_for_proposal: Vec<GraphQLVote>,
    proposal_id: String,
    dao_handler: daohandler::Data,
) -> Result<bool> {
    for old_vote in votes_for_proposal {
        let exists = ctx
            .db
            .vote()
            .find_unique(vote::voteraddress_daoid_proposalid(
                old_vote.voter.to_string(),
                dao_handler.daoid.clone(),
                proposal_id.clone(),
            ))
            .exec()
            .await
            .unwrap();

        match exists {
            Some(_) => {}
            None => {
                ctx.db
                    .vote()
                    .create_unchecked(
                        old_vote.choice.clone(),
                        old_vote.vp.into(),
                        old_vote.reason.clone(),
                        old_vote.voter.clone(),
                        proposal_id.clone(),
                        dao_handler.daoid.clone(),
                        dao_handler.id.clone(),
                        vec![vote::timecreated::set(Some(DateTime::from_utc(
                            NaiveDateTime::from_timestamp_millis(old_vote.created * 1000)
                                .expect("bad created timestamp"),
                            FixedOffset::east_opt(0).unwrap(),
                        )))],
                    )
                    .exec()
                    .await
                    .unwrap();
            }
        }
    }

    Ok(true)
}

#[instrument(skip(ctx, votes_for_proposal), level = "debug")]
async fn update_or_create_current_votes(
    ctx: &Ctx,
    votes_for_proposal: Vec<GraphQLVote>,
    proposal_id: String,
    dao_handler: daohandler::Data,
) -> Result<()> {
    for v in votes_for_proposal {
        let existing = ctx
            .db
            .vote()
            .find_unique(vote::voteraddress_daoid_proposalid(
                v.voter.to_string(),
                dao_handler.daoid.clone(),
                proposal_id.clone(),
            ))
            .exec()
            .await
            .unwrap();

        match existing {
            Some(existing) => {
                if existing.choice != v.choice
                    || existing.votingpower != v.vp
                    || existing.reason != v.reason
                {
                    ctx.db
                        .vote()
                        .update(
                            vote::voteraddress_daoid_proposalid(
                                v.voter.clone(),
                                dao_handler.daoid.clone(),
                                proposal_id.clone(),
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
                        .exec()
                        .await
                        .unwrap();
                }
            }
            None => {
                ctx.db
                    .vote()
                    .create(
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
                    )
                    .exec()
                    .await
                    .unwrap();
            }
        }
    }

    Ok(())
}
