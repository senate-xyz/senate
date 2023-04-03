use std::{ time::Duration };

use prisma_client_rust::chrono::{ DateTime, FixedOffset, NaiveDateTime, Utc };
use reqwest::Client;
use rocket::serde::json::Json;
use serde::Deserialize;

use crate::{
    ProposalsRequest,
    ProposalsResponse,
    Ctx,
    prisma::daohandler,
    prisma::{ proposal, dao },
};

#[derive(Debug, Deserialize)]
struct GraphQLResponse {
    data: GraphQLResponseInner,
}

#[derive(Debug, Deserialize)]
struct GraphQLResponseInner {
    proposals: Vec<GraphQLProposal>,
}

#[derive(Debug, Clone, Deserialize)]
struct GraphQLSpace {
    id: String,
    name: String,
}

#[derive(Debug, Clone, Deserialize)]
struct GraphQLProposal {
    id: String,
    title: String,
    body: String,
    choices: Vec<String>,
    scores: Vec<f64>,
    scores_total: f64,
    created: i64,
    start: i64,
    end: i64,
    quorum: f64,
    link: String,
    space: GraphQLSpace,
}

#[derive(Debug, Deserialize)]
struct Decoder {
    space: String,
}

#[post("/snapshot_proposals", data = "<data>")]
pub async fn update_snapshot_proposals<'a>(
    ctx: &Ctx,
    data: Json<ProposalsRequest<'a>>
) -> Json<ProposalsResponse<'a>> {
    let dao_handler = match
        ctx.db
            .daohandler()
            .find_first(vec![daohandler::id::equals(data.daoHandlerId.to_string())])
            .exec().await
            .unwrap()
    {
        Some(data) => data,
        None => panic!("{:?} daoHandlerId not found", data.daoHandlerId),
    };

    let decoder: Decoder = match serde_json::from_value(dao_handler.decoder) {
        Ok(data) => data,
        Err(_) => panic!("{:?} decoder not found", data.daoHandlerId),
    };

    let old_index = match dao_handler.snapshotindex {
        Some(data) => data.timestamp(),
        None => 0,
    };

    let graphql_query = format!(
        r#"
        {{
            proposals (
                first: 1000,
                where: {{
                    space: {:?},
                    created_gte: {}
                }},
                orderBy: "created",
                orderDirection: asc
            )
            {{
                id
                title
                body
                choices
                scores
                scores_total
                created
                start
                end
                quorum
                link
                space
                {{
                    id
                    name
                }}
            }}
        }}
    "#,
        decoder.space,
        old_index
    );

    let http_client = Client::builder().timeout(Duration::from_secs(10)).build().unwrap();

    let graphql_response = http_client
        .get("https://hub.snapshot.org/graphql")
        .json(&serde_json::json!({"query" : graphql_query}))
        .send().await;

    match graphql_response {
        Ok(res) => {
            let response_data: GraphQLResponse = res.json().await.unwrap();

            let proposals: Vec<GraphQLProposal> = response_data.data.proposals;

            let upserts = proposals
                .clone()
                .into_iter()
                .map(|proposal|
                    ctx.db
                        .proposal()
                        .upsert(
                            proposal::externalid_daoid(
                                proposal.id.to_string(),
                                data.daoHandlerId.to_string()
                            ),
                            proposal::create(
                                proposal.title.clone(),
                                proposal.id.clone(),
                                proposal.choices.clone().into(),
                                proposal.scores.clone().into(),
                                proposal.scores_total,
                                proposal.quorum,
                                DateTime::from_utc(
                                    NaiveDateTime::from_timestamp_millis(
                                        proposal.created * 1000
                                    ).unwrap(),
                                    FixedOffset::east_opt(0).unwrap()
                                ),
                                DateTime::from_utc(
                                    NaiveDateTime::from_timestamp_millis(
                                        proposal.start * 1000
                                    ).unwrap(),
                                    FixedOffset::east_opt(0).unwrap()
                                ),
                                DateTime::from_utc(
                                    NaiveDateTime::from_timestamp_millis(
                                        proposal.end * 1000
                                    ).unwrap(),
                                    FixedOffset::east_opt(0).unwrap()
                                ),
                                proposal.link.clone(),
                                daohandler::id::equals(dao_handler.id.to_string()),
                                dao::id::equals(dao_handler.daoid.to_string()),
                                vec![]
                            ),
                            vec![
                                proposal::choices::set(proposal.choices.clone().into()),
                                proposal::scores::set(proposal.scores.clone().into()),
                                proposal::scorestotal::set(proposal.scores_total),
                                proposal::quorum::set(proposal.quorum)
                            ]
                        )
                );

            let _ = ctx.db._batch(upserts).await;

            let closed_proposals: Vec<&GraphQLProposal> = proposals
                .iter()
                .filter(|proposal| proposal.end * 1000 < Utc::now().timestamp())
                .collect();

            let open_proposals: Vec<&GraphQLProposal> = proposals
                .iter()
                .filter(|proposal| proposal.end * 1000 > Utc::now().timestamp())
                .collect();

            let new_index;

            if !open_proposals.is_empty() {
                new_index = open_proposals
                    .iter()
                    .map(|proposal| proposal.created)
                    .max()
                    .unwrap_or(old_index);
            } else if !closed_proposals.is_empty() {
                new_index = open_proposals
                    .iter()
                    .map(|proposal| proposal.created)
                    .max()
                    .unwrap_or(old_index);
            } else {
                new_index = old_index;
            }

            let _ = ctx.db
                .daohandler()
                .update(
                    daohandler::id::equals(dao_handler.id),
                    vec![
                        daohandler::snapshotindex::set(
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

            Json(ProposalsResponse { daoHandlerId: data.daoHandlerId, response: "ok" })
        }
        Err(e) => {
            println!("{:?}", e);
            Json(ProposalsResponse { daoHandlerId: data.daoHandlerId, response: "nok" })
        }
    }
}