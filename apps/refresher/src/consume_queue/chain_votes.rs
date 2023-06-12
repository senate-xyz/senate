use anyhow::Result;
use log::warn;
use opentelemetry::{propagation::TextMapPropagator, sdk::propagation::TraceContextPropagator};
use std::{cmp, collections::HashMap, env, sync::Arc};
use tracing::{debug, debug_span, event, instrument, Instrument, Level};
use tracing_opentelemetry::OpenTelemetrySpanExt;

use prisma_client_rust::chrono::Utc;
use reqwest::{
    header::{HeaderName, HeaderValue},
    Client,
};
use serde::Deserialize;

use tokio::task;

use crate::{
    prisma::{self, daohandler, PrismaClient},
    RefreshEntry,
};

#[allow(non_snake_case)]
#[derive(Deserialize)]
struct ApiResponse {
    voter_address: String,
    success: bool,
}

#[instrument]
pub(crate) async fn consume_chain_votes(
    entry: RefreshEntry,
    client: &Arc<PrismaClient>,
) -> Result<()> {
    let detective_url = match env::var_os("DETECTIVE_URL") {
        Some(v) => v.into_string().unwrap(),
        None => panic!("$DETECTIVE_URL is not set"),
    };

    let post_url = format!("{}/votes/chain_votes", detective_url);

    let http_client = Client::builder().build().unwrap();

    let span = tracing::Span::current();
    let context = span.context();
    let propagator = TraceContextPropagator::new();
    let mut fields = HashMap::new();
    propagator.inject_context(&context, &mut fields);
    let headers = fields
        .into_iter()
        .map(|(k, v)| {
            (
                HeaderName::try_from(k).unwrap(),
                HeaderValue::try_from(v).unwrap(),
            )
        })
        .collect();

    let dao_handler = client
        .daohandler()
        .find_first(vec![daohandler::id::equals(entry.handler_id.to_string())])
        .exec()
        .await
        .unwrap()
        .unwrap();

    let client_ref = client.clone();
    let dao_handler_ref = dao_handler;
    let voters_ref = entry.voters.clone();

    task::spawn({
        let detective_span = debug_span!("detective");
        async move {
        event!(Level::DEBUG, "Sending detective request");

let span = tracing::Span::current();
    let context = span.context();
    let propagator = TraceContextPropagator::new();
    let mut trace = HashMap::new();
    propagator.inject_context(&context, &mut trace);

        let response = http_client
            .post(&post_url)
            .json(&serde_json::json!({ "daoHandlerId": entry.handler_id, "voters": entry.voters, "trace": trace }))
            .headers(headers)
            .send()
            .await;

        event!(Level::DEBUG, "Received detective response");

        match response {
            Ok(res) => {
                let data: Vec<ApiResponse> = res.json().await.unwrap();

                let ok_voters: Vec<String> = data
                    .iter()
                    .filter(|result| result.success)
                    .map(|result| result.voter_address.clone())
                    .collect();

                let nok_voters: Vec<String> = data
                    .iter()
                    .filter(|result| !result.success)
                    .map(|result| result.voter_address.clone())
                    .collect();

                let ok_voter_ids = client_ref
                    .voter()
                    .find_many(vec![prisma::voter::address::in_vec(ok_voters.clone())])
                    .exec()
                    .await
                    .unwrap()
                    .iter()
                    .map(|voter| voter.id.clone())
                    .collect();

                let nok_voter_ids = client_ref
                    .voter()
                    .find_many(vec![prisma::voter::address::in_vec(nok_voters.clone())])
                    .exec()
                    .await
                    .unwrap()
                    .iter()
                    .map(|voter| voter.id.clone())
                    .collect();

                let update_ok_voters = client_ref.voterhandler().update_many(
                    vec![
                        prisma::voterhandler::voterid::in_vec(ok_voter_ids),
                        prisma::voterhandler::daohandlerid::equals(dao_handler_ref.id.to_string()),
                    ],
                    vec![
                        prisma::voterhandler::refreshstatus::set(prisma::RefreshStatus::Done),
                        prisma::voterhandler::lastrefresh::set(Utc::now().into()),
                    ],
                );

                let update_nok_voters = client_ref.voterhandler().update_many(
                    vec![
                        prisma::voterhandler::voterid::in_vec(nok_voter_ids),
                        prisma::voterhandler::daohandlerid::equals(dao_handler_ref.id.to_string()),
                    ],
                    vec![
                        prisma::voterhandler::refreshstatus::set(prisma::RefreshStatus::New),
                        prisma::voterhandler::lastrefresh::set(Utc::now().into()),
                    ],
                );

                let result = client_ref
                    ._batch((update_ok_voters, update_nok_voters))
                    .await
                    .unwrap();

                debug!("refresher update: {:?}", result);

                if ok_voters.len() > nok_voters.len() {
                    let result = client_ref
                        .daohandler()
                        .update(
                            daohandler::id::equals(dao_handler_ref.id),
                            vec![daohandler::votersrefreshspeed::set(cmp::min(
                                dao_handler_ref.votersrefreshspeed
                                    + (dao_handler_ref.votersrefreshspeed * 75 / 100),
                                100000000,
                            ))],
                        )
                        .exec()
                        .await
                        .unwrap();

                    debug!("refresher ok: {:?}", result);
                } else {
                    let result = client_ref
                        .daohandler()
                        .update(
                            daohandler::id::equals(dao_handler_ref.id),
                            vec![daohandler::votersrefreshspeed::set(cmp::max(
                                dao_handler_ref.votersrefreshspeed
                                    - (dao_handler_ref.votersrefreshspeed * 50 / 100),
                                100,
                            ))],
                        )
                        .exec()
                        .await
                        .unwrap();

                    debug!("refresher nok: {:?}", result);
                };
            }
            Err(e) => {
                let _ = client_ref
                    .daohandler()
                    .update(
                        daohandler::id::equals(dao_handler_ref.clone().id),
                        vec![daohandler::votersrefreshspeed::set(cmp::max(
                            dao_handler_ref.votersrefreshspeed
                                - (dao_handler_ref.votersrefreshspeed * 50 / 100),
                            100,
                        ))],
                    )
                    .exec()
                    .await;

                let voter_ids = client_ref
                    .voter()
                    .find_many(vec![prisma::voter::address::in_vec(voters_ref)])
                    .exec()
                    .await
                    .unwrap()
                    .iter()
                    .map(|voter| voter.id.clone())
                    .collect();

                let result = client_ref
                    .voterhandler()
                    .update_many(
                        vec![
                            prisma::voterhandler::voterid::in_vec(voter_ids),
                            prisma::voterhandler::daohandlerid::equals(
                                dao_handler_ref.id.to_string(),
                            ),
                        ],
                        vec![
                            prisma::voterhandler::refreshstatus::set(prisma::RefreshStatus::New),
                            prisma::voterhandler::lastrefresh::set(Utc::now().into()),
                            prisma::voterhandler::chainindex::set(Some(0)),
                        ],
                    )
                    .exec()
                    .await
                    .unwrap();

                debug!("refresher error update: {:?}", result);
                warn!("refresher error: {:#?}", e);
            }
        }
    }.instrument(detective_span)
    });

    Ok(())
}
