use std::{ time::Duration, iter::once };

use prisma_client_rust::chrono::{ Utc, DateTime, NaiveDateTime, FixedOffset };
use reqwest::Client;
use rocket::serde::json::Json;
use serde::Deserialize;
use serde_json::Value;

use crate::{
    VotesRequest,
    VotesResponse,
    Ctx,
    prisma::{ daohandler, vote, dao },
    prisma::proposal,
    prisma::{ voterhandler, voter },
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
    proposal: GraphQLProposal,
}

#[derive(Debug, Deserialize)]
struct Decoder {
    space: String,
}

#[post("/snapshot_votes", data = "<data>")]
pub async fn update_snapshot_votes<'a>(
    ctx: &Ctx,
    data: Json<VotesRequest<'a>>
) -> Json<Vec<VotesResponse>> {
    let dao_handler = match
        ctx.db
            .daohandler()
            .find_first(vec![daohandler::id::equals(data.daoHandlerId.to_string())])
            .exec().await
            .unwrap()
    {
        Some(data) => data,
        None => panic!("daoHandlerId not found"),
    };

    let decoder: Decoder = match serde_json::from_value(dao_handler.decoder) {
        Ok(data) => data,
        Err(_) => panic!("decoder not found"),
    };

    let voter_handlers = match
        ctx.db
            .voterhandler()
            .find_many(
                vec![
                    voterhandler::voter::is(vec![voter::address::in_vec(data.voters.clone())]),
                    voterhandler::daohandler::is(
                        vec![daohandler::id::equals(data.daoHandlerId.to_string())]
                    )
                ]
            )
            .exec().await
    {
        Ok(data) => data,
        Err(_) => panic!("voter handlers not found"),
    };

    let oldest_vote = voter_handlers
        .iter()
        .map(|voterhandler| voterhandler.snapshotindex.unwrap().timestamp())
        .max()
        .unwrap_or(0);

    let search_from_timestamp = if
        oldest_vote < dao_handler.snapshotindex.unwrap_or_default().timestamp()
    {
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

    let http_client = Client::builder().timeout(Duration::from_secs(10)).build().unwrap();

    let graphql_response = http_client
        .get("https://hub.snapshot.org/graphql")
        .json(&serde_json::json!({"query" : graphql_query}))
        .send().await;

    match graphql_response {
        Ok(res) => {
            let response_data: GraphQLResponse = res.json().await.unwrap();

            let votes: Vec<GraphQLVote> = response_data.data.votes;

            let proposals: Vec<GraphQLProposal> = votes
                .clone()
                .iter()
                .map(|vote| vote.proposal.clone())
                .collect();

            for p in proposals {
                let proposaldb = ctx.db
                    .proposal()
                    .find_unique(
                        proposal::externalid_daoid(p.id.to_string(), dao_handler.daoid.to_string())
                    )
                    .exec().await;

                match proposaldb {
                    Ok(okp) => {
                        let proposal = okp.unwrap();
                        let votes_for_proposal: Vec<GraphQLVote> = votes
                            .iter()
                            .filter(|vote| vote.proposal.id == proposal.externalid)
                            .cloned()
                            .collect();

                        if proposal.timeend < Utc::now() {
                            let _ = ctx.db
                                .vote()
                                .create_many(
                                    votes_for_proposal
                                        .iter()
                                        .map(|v|
                                            vote::create_unchecked(
                                                v.choice.clone(),
                                                v.vp,
                                                v.reason.clone(),
                                                v.voter.clone(),
                                                proposal.id.clone(),
                                                dao_handler.daoid.clone(),
                                                dao_handler.id.clone(),
                                                vec![
                                                    vote::timecreated::set(
                                                        Some(
                                                            DateTime::from_utc(
                                                                NaiveDateTime::from_timestamp_millis(
                                                                    v.created * 1000
                                                                ).unwrap(),
                                                                FixedOffset::east_opt(0).unwrap()
                                                            )
                                                        )
                                                    )
                                                ]
                                            )
                                        )
                                        .collect()
                                )
                                .skip_duplicates()
                                .exec().await;
                        } else {
                            let _ = ctx.db._batch(
                                votes_for_proposal
                                    .iter()
                                    .map(|v|
                                        ctx.db
                                            .vote()
                                            .upsert(
                                                vote::voteraddress_daoid_proposalid(
                                                    v.voter.clone(),
                                                    dao_handler.daoid.clone(),
                                                    proposal.id.clone()
                                                ),
                                                vote::create(
                                                    v.choice.clone(),
                                                    v.vp,
                                                    v.reason.clone(),
                                                    voter::address::equals(v.voter.clone()),
                                                    proposal::id::equals(proposal.id.clone()),
                                                    dao::id::equals(dao_handler.daoid.clone()),
                                                    daohandler::id::equals(dao_handler.id.clone()),
                                                    vec![
                                                        vote::timecreated::set(
                                                            Some(
                                                                DateTime::from_utc(
                                                                    NaiveDateTime::from_timestamp_millis(
                                                                        v.created * 1000
                                                                    ).unwrap(),
                                                                    FixedOffset::east_opt(
                                                                        0
                                                                    ).unwrap()
                                                                )
                                                            )
                                                        )
                                                    ]
                                                ),
                                                vec![
                                                    vote::timecreated::set(
                                                        Some(
                                                            DateTime::from_utc(
                                                                NaiveDateTime::from_timestamp_millis(
                                                                    v.created * 1000
                                                                ).unwrap(),
                                                                FixedOffset::east_opt(0).unwrap()
                                                            )
                                                        )
                                                    ),
                                                    vote::choice::set(v.choice.clone()),
                                                    vote::votingpower::set(v.vp),
                                                    vote::reason::set(v.reason.clone())
                                                ]
                                            )
                                    )
                            );
                        }
                    }
                    Err(_) => panic!("{:?} proposal not found for {:?}", p.id, data.daoHandlerId),
                }
            }

            let search_to_timestamp = votes
                .clone()
                .into_iter()
                .map(|vote| vote.created)
                .chain(once(search_from_timestamp))
                .max()
                .unwrap();

            let new_index = vec![
                search_to_timestamp,
                dao_handler.snapshotindex.unwrap().timestamp()
            ]
                .into_iter()
                .min()
                .unwrap();

            let _ = ctx.db
                .voterhandler()
                .update_many(
                    vec![
                        voterhandler::id::in_vec(
                            voter_handlers
                                .clone()
                                .iter()
                                .map(|vh| vh.id.clone())
                                .collect()
                        ),
                        voterhandler::daohandlerid::equals(dao_handler.id.clone())
                    ],
                    vec![
                        voterhandler::snapshotindex::set(
                            Some(
                                DateTime::from_utc(
                                    NaiveDateTime::from_timestamp_millis(new_index * 1000).unwrap(),
                                    FixedOffset::east_opt(0).unwrap()
                                )
                            )
                        )
                    ]
                )
                .exec().await;
        }
        Err(e) => {
            println!("{:?}", e);
        }
    }

    let voters = data.voters.clone();

    let result: Vec<VotesResponse> = voters
        .into_iter()
        .map(|v| VotesResponse { voter_address: v, result: "ok" })
        .collect();

    Json(result)
}