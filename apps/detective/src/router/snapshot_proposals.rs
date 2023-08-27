use std::{env, time::UNIX_EPOCH};

use anyhow::{Context, Result};
use chrono::{Datelike, Duration, TimeZone, Utc};
use prisma_client_rust::chrono::{DateTime, FixedOffset, NaiveDateTime};
use reqwest_middleware::ClientBuilder;
use reqwest_retry::{policies::ExponentialBackoff, RetryTransientMiddleware};
use rocket::serde::json::Json;
use serde::Deserialize;
use tracing::{
    debug_span,
    event,
    info_span,
    instrument,
    span,
    trace_span,
    Instrument,
    Level,
    Span,
};

use crate::{
    daohandler_with_dao,
    prisma::{dao, daohandler, proposal, ProposalState},
    Ctx,
    ProposalsRequest,
    ProposalsResponse,
};

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
    title: String,

    choices: Vec<String>,
    scores: Vec<f64>,
    scores_total: f64,
    scores_state: String,
    created: i64,
    start: i64,
    end: i64,
    quorum: f64,
    link: String,
    state: String,
    flagged: Option<bool>,
}

#[derive(Debug, Deserialize)]
struct Decoder {
    space: String,
}

#[post("/snapshot_proposals", data = "<data>")]
pub async fn update_snapshot_proposals<'a>(
    ctx: &Ctx,
    data: Json<ProposalsRequest<'a>>,
) -> Json<ProposalsResponse<'a>> {
    let my_span = info_span!(
        "update_snapshot_proposals",
        dao_handler_id = data.daoHandlerId,
        refreshspeed = data.refreshspeed
    );

    async move {
        let dao_handler = ctx
            .db
            .daohandler()
            .find_first(vec![daohandler::id::equals(data.daoHandlerId.to_string())])
            .include(daohandler_with_dao::include())
            .exec()
            .await
            .expect("bad prisma result")
            .expect("daoHandlerId not found");

        let decoder: Decoder = match serde_json::from_value(dao_handler.clone().decoder) {
            Ok(data) => data,
            Err(_) => panic!("{:?} decoder not found", data.daoHandlerId),
        };

        let old_index = dao_handler.snapshotindex;

        let graphql_query = format!(
            r#"
                {{
                    proposals (
                        first: {:?},
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
                        choices
                        scores
                        scores_total
                        scores_state
                        created
                        start
                        end
                        quorum
                        link
                        state
                        flagged
                    }}
                }}
            "#,
            if data.refreshspeed < 1000 {
                data.refreshspeed
            } else {
                1000
            },
            decoder.space,
            old_index.timestamp()
        );

        event!(
            Level::INFO,
            dao_name = dao_handler.dao.name,
            dao_handler_type = dao_handler.r#type.to_string(),
            dao_handler_id = dao_handler.id,
            old_index = old_index.timestamp(),
            space = decoder.space,
            graphql_query = graphql_query,
            "refresh interval"
        );

        match update_proposals(
            graphql_query,
            ctx,
            dao_handler.clone(),
            old_index.timestamp(),
        )
        .await
        {
            Ok(_) => Json(ProposalsResponse {
                daoHandlerId: data.daoHandlerId,
                success: true,
            }),
            Err(e) => {
                event!(Level::WARN, err = e.to_string(), "refresh error");
                Json(ProposalsResponse {
                    daoHandlerId: data.daoHandlerId,
                    success: false,
                })
            }
        }
    }
    .instrument(my_span)
    .await
}

#[instrument(skip_all)]
async fn update_proposals(
    graphql_query: String,
    ctx: &Ctx,
    dao_handler: daohandler_with_dao::Data,
    old_index: i64,
) -> Result<()> {
    let _snapshot_key = env::var("SNAPSHOT_API_KEY").expect("$SNAPSHOT_API_KEY is not set");

    let retry_policy = ExponentialBackoff::builder().build_with_max_retries(5);
    let http_client = ClientBuilder::new(reqwest::Client::new())
        .with(RetryTransientMiddleware::new_with_policy(retry_policy))
        .build();

    let graphql_response = http_client
        .get("https://hub.snapshot.org/graphql".to_string())
        .json(&serde_json::json!({ "query": graphql_query }))
        .send()
        .await?;

    let response_data: GraphQLResponse = graphql_response
        .json()
        .await
        .with_context(|| format!("bad graphql response {}", graphql_query))?;

    let proposals: Vec<GraphQLProposal> = response_data.data.proposals.into_iter().collect();

    for proposal in proposals.clone() {
        let state = match proposal.state.as_str() {
            "active" => ProposalState::Active,
            "pending" => ProposalState::Pending,
            "closed" => {
                if proposal.scores_state == "final" {
                    ProposalState::Executed
                } else {
                    ProposalState::Hidden
                }
            }
            _ => ProposalState::Unknown,
        };

        let existing = ctx
            .db
            .proposal()
            .find_first(vec![
                proposal::externalid::equals(proposal.id.clone()),
                proposal::daohandlerid::equals(dao_handler.id.clone()),
            ])
            .exec()
            .await?;

        match existing {
            Some(existing) => {
                if state != existing.state
                    || proposal.scores_total.floor()
                        != existing.scorestotal.as_f64().unwrap().floor()
                    || existing.visible != !proposal.flagged.is_some_and(|f| f)
                {
                    event!(
                        Level::INFO,
                        proposal_id = existing.id,
                        proposal_name = existing.name,
                        dao_name = dao_handler.dao.name,
                        dao_handler_type = dao_handler.r#type.to_string(),
                        dao_handler_id = dao_handler.id,
                        "update proposal"
                    );
                    ctx.db
                        .proposal()
                        .update(
                            proposal::externalid_daoid(
                                proposal.id.to_string(),
                                dao_handler.daoid.to_string(),
                            ),
                            vec![
                                proposal::choices::set(proposal.choices.clone().into()),
                                proposal::scores::set(proposal.scores.clone().into()),
                                proposal::scorestotal::set(proposal.scores_total.into()),
                                proposal::quorum::set(proposal.quorum.into()),
                                proposal::state::set(state),
                                proposal::visible::set(!proposal.flagged.is_some_and(|f| f)),
                            ],
                        )
                        .exec()
                        .await?;
                }
            }
            None => {
                event!(
                    Level::INFO,
                    proposal_external_id = proposal.id,
                    proposal_name = proposal.title,
                    dao_name = dao_handler.dao.name,
                    dao_handler_type = dao_handler.r#type.to_string(),
                    dao_handler_id = dao_handler.id,
                    "insert proposal"
                );

                ctx.db
                    .proposal()
                    .create_unchecked(
                        proposal.title.clone(),
                        proposal.id.clone(),
                        proposal.choices.clone().into(),
                        proposal.scores.clone().into(),
                        proposal.scores_total.into(),
                        proposal.quorum.into(),
                        state,
                        DateTime::from_utc(
                            NaiveDateTime::from_timestamp_millis(proposal.created * 1000)
                                .expect("can not create timecreated"),
                            FixedOffset::east_opt(0).unwrap(),
                        ),
                        DateTime::from_utc(
                            NaiveDateTime::from_timestamp_millis(proposal.start * 1000)
                                .expect("can not create timestart"),
                            FixedOffset::east_opt(0).unwrap(),
                        ),
                        DateTime::from_utc(
                            NaiveDateTime::from_timestamp_millis(proposal.end * 1000)
                                .expect("can not create timeend"),
                            FixedOffset::east_opt(0).unwrap(),
                        ),
                        proposal.link.clone(),
                        dao_handler.id.to_string(),
                        dao_handler.daoid.to_string(),
                        vec![proposal::visible::set(!proposal.flagged.is_some_and(|f| f))],
                    )
                    .exec()
                    .await?;
            }
        }
    }

    let open_proposals: Vec<&GraphQLProposal> = proposals
        .iter()
        .filter(|proposal| {
            (proposal.state != "closed" || proposal.scores_state != "final")
                && Utc.timestamp_opt(proposal.end, 0).unwrap().year() == Utc::now().year()
        })
        .collect();

    let closed_proposals: Vec<&GraphQLProposal> = proposals
        .iter()
        .filter(|proposal| proposal.state == "closed" && proposal.scores_state == "final")
        .collect();

    let new_index;

    if !open_proposals.is_empty() {
        new_index = open_proposals
            .iter()
            .map(|proposal| proposal.created)
            .min()
            .unwrap_or(old_index);
    } else if !closed_proposals.is_empty() {
        new_index = closed_proposals
            .iter()
            .map(|proposal| proposal.created)
            .max()
            .unwrap_or(old_index);
    } else {
        new_index = old_index;
    }

    let uptodate = old_index - new_index < 60 * 60;

    let new_index_date: DateTime<FixedOffset> = DateTime::from_utc(
        NaiveDateTime::from_timestamp_millis(new_index * 1000).expect("bad new_index timestamp"),
        FixedOffset::east_opt(0).unwrap(),
    );

    event!(
        Level::INFO,
        dao_name = dao_handler.dao.name,
        dao_handler_type = dao_handler.r#type.to_string(),
        dao_handler_id = dao_handler.id,
        new_index = new_index,
        uptodate = uptodate,
        "new index"
    );

    if (new_index_date > dao_handler.snapshotindex
        && new_index_date - dao_handler.snapshotindex > Duration::hours(1))
        || uptodate != dao_handler.uptodate
    {
        event!(
            Level::INFO,
            dao_name = dao_handler.dao.name,
            dao_handler_type = dao_handler.r#type.to_string(),
            new_index = new_index,
            dao_handler_id = dao_handler.id,
            "set new index"
        );

        ctx.db
            .daohandler()
            .update(
                daohandler::id::equals(dao_handler.id),
                vec![
                    daohandler::snapshotindex::set(DateTime::from_utc(
                        NaiveDateTime::from_timestamp_millis(new_index * 1000)
                            .expect("can not create snapshotindex"),
                        FixedOffset::east_opt(0).unwrap(),
                    )),
                    daohandler::uptodate::set(uptodate),
                ],
            )
            .exec()
            .await
            .context("failed to update daohandler")?;
    }

    Ok(())
}
