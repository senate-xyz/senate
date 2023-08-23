use std::{env, sync::Arc};

use anyhow::Result;
use chrono::{DateTime, Duration, FixedOffset, Local, Utc};
use reqwest_middleware::{ClientBuilder, ClientWithMiddleware};
use reqwest_retry::{policies::ExponentialBackoff, RetryTransientMiddleware};
use serde::Deserialize;
use tracing::{debug_span, event, instrument, Instrument, Level};

use crate::{
    prisma::{self, daohandler, proposal, vote, DaoHandlerType, ProposalState},
    Context,
};

#[derive(Debug, Deserialize)]
struct Decoder {
    space: String,
}

#[derive(Debug, Deserialize)]
struct GraphQLResponse {
    data: GraphQLResponseInner,
}

#[derive(Deserialize, Debug)]
struct GraphQLResponseInner {
    proposals: Vec<GraphQLProposal>,
}

#[derive(Debug, Clone, Deserialize)]
struct GraphQLProposal {
    id: String,
}

#[instrument(skip_all)]
pub async fn snapshot_sanity_check(ctx: &Context) -> Result<()> {
    let sanitize_from: chrono::DateTime<Utc> = Utc::now() - Duration::days(90);
    let sanitize_to: chrono::DateTime<Utc> = Utc::now() - Duration::minutes(5);

    let dao_handlers = ctx
        .clone()
        .db
        .daohandler()
        .find_many(vec![daohandler::r#type::equals(DaoHandlerType::Snapshot)])
        .exec()
        .await?;

    for dao_handler in dao_handlers {
        sanitize(dao_handler, sanitize_from, sanitize_to, ctx.clone()).await?;
    }

    Ok(())
}

#[instrument(skip(ctx))]
async fn sanitize(
    dao_handler: daohandler::Data,
    sanitize_from: chrono::DateTime<Utc>,
    sanitize_to: chrono::DateTime<Utc>,
    ctx: Context,
) -> Result<()> {
    let database_proposals = ctx
        .db
        .proposal()
        .find_many(vec![
            proposal::daohandlerid::equals(dao_handler.clone().id),
            proposal::timecreated::gte(sanitize_from.into()),
            proposal::timecreated::lte(sanitize_to.into()),
        ])
        .exec()
        .await?;

    let decoder: Decoder = match serde_json::from_value(dao_handler.clone().decoder) {
        Ok(data) => data,
        Err(_) => panic!("{:?} decoder not found", dao_handler.clone().id),
    };

    let graphql_query = format!(
        r#"
        {{
            proposals (
                first: 1000,
                where: {{
                    space: {:?},
                    created_gte: {},
                    created_lte: {},
                }},
                orderBy: "created",
                orderDirection: asc
            )
            {{
                id
            }}
        }}
    "#,
        decoder.space,
        sanitize_from.timestamp(),
        sanitize_to.timestamp()
    );

    let _snapshot_key = env::var("SNAPSHOT_API_KEY").expect("$SNAPSHOT_API_KEY is not set");

    let retry_policy = ExponentialBackoff::builder().build_with_max_retries(5);
    let http_client = ClientBuilder::new(reqwest::Client::new())
        .with(RetryTransientMiddleware::new_with_policy(retry_policy))
        .build();

    let graphql_response = http_client
        .get("https://hub.snapshot.org/graphql".to_string())
        .json(&serde_json::json!({ "query": graphql_query }))
        .send()
        .await;

    let response_data: GraphQLResponse = graphql_response?.json().await?;
    let graph_proposals: Vec<GraphQLProposal> = response_data.data.proposals;

    let graphql_proposal_ids: Vec<String> = graph_proposals
        .iter()
        .map(|proposal| proposal.id.clone())
        .collect();

    let proposals_to_delete: Vec<proposal::Data> = database_proposals
        .clone()
        .into_iter()
        .filter(|proposal| !graphql_proposal_ids.contains(&proposal.externalid))
        .collect();

    let now: DateTime<FixedOffset> = DateTime::<FixedOffset>::from(Local::now());

    let _ = ctx
        .db
        .proposal()
        .update_many(
            vec![proposal::id::in_vec(
                proposals_to_delete.iter().map(|p| p.clone().id).collect(),
            )],
            vec![
                proposal::visible::set(false),
                proposal::timeend::set(now),
                proposal::state::set(ProposalState::Canceled),
            ],
        )
        .exec()
        .await;

    Ok(())
}
