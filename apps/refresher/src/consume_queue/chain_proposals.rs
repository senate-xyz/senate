use anyhow::Result;
use log::warn;
use opentelemetry::{
    global,
    propagation::TextMapPropagator,
    sdk::propagation::TraceContextPropagator,
};
use std::{cmp, collections::HashMap, env, sync::Arc};
use tracing::{debug, debug_span, event, info_span, instrument, Instrument, Level, Span};
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

#[derive(Deserialize)]
#[allow(non_snake_case)]
struct ProposalsResponse {
    daoHandlerId: String,
    response: String,
}

#[instrument(skip(client), level = "info")]
pub(crate) async fn consume_chain_proposals(
    entry: RefreshEntry,
    client: &Arc<PrismaClient>,
) -> Result<()> {
    let detective_url = env::var("DETECTIVE_URL").expect("$DETECTIVE_URL is not set");

    let post_url = format!("{}/proposals/chain_proposals", detective_url);

    let http_client = Client::builder().build().unwrap();

    let dao_handler = client
        .daohandler()
        .find_first(vec![daohandler::id::equals(entry.handler_id.to_string())])
        .exec()
        .instrument(debug_span!("get_dao_handler"))
        .await
        .unwrap()
        .unwrap();

    let client_ref = client.clone();
    let dao_handler_ref = dao_handler;

    task::spawn({
        async move {
            let span = tracing::Span::current();
            let context = span.context();
            let propagator = TraceContextPropagator::new();
            let mut trace = HashMap::new();
            propagator.inject_context(&context, &mut trace);

            let response = http_client
                .post(&post_url)
                .json(&serde_json::json!({ "daoHandlerId": entry.handler_id, "trace": trace}))
                .send()
                .await;

            match response {
                Ok(res) => {
                    let data: Result<ProposalsResponse, reqwest::Error> = res.json().await;

                    match data {
                        Ok(data) => {
                            let dbupdate = match data.response.as_str() {
                                "ok" => client_ref.daohandler().update_many(
                                    vec![daohandler::id::equals(data.daoHandlerId.to_string())],
                                    vec![
                                        daohandler::refreshstatus::set(prisma::RefreshStatus::Done),
                                        daohandler::lastrefresh::set(Utc::now().into()),
                                        daohandler::refreshspeed::set(cmp::min(
                                            dao_handler_ref.refreshspeed
                                                + (dao_handler_ref.refreshspeed * 10 / 100),
                                            10000000,
                                        )),
                                    ],
                                ),
                                "nok" => client_ref.daohandler().update_many(
                                    vec![daohandler::id::equals(data.daoHandlerId.to_string())],
                                    vec![
                                        daohandler::refreshstatus::set(prisma::RefreshStatus::New),
                                        daohandler::lastrefresh::set(Utc::now().into()),
                                        daohandler::refreshspeed::set(cmp::max(
                                            dao_handler_ref.refreshspeed
                                                - (dao_handler_ref.refreshspeed * 25 / 100),
                                            100,
                                        )),
                                    ],
                                ),
                                _ => panic!("Unexpected response"),
                            };

                            let _ = client_ref
                                ._batch(dbupdate)
                                .instrument(debug_span!("update_handlers"))
                                .await;
                        }
                        Err(e) => {
                            let result = client_ref
                                .daohandler()
                                .update_many(
                                    vec![daohandler::id::equals(dao_handler_ref.id)],
                                    vec![
                                        daohandler::refreshstatus::set(prisma::RefreshStatus::New),
                                        daohandler::lastrefresh::set(Utc::now().into()),
                                        daohandler::refreshspeed::set(cmp::max(
                                            dao_handler_ref.refreshspeed
                                                - (dao_handler_ref.refreshspeed * 25 / 100),
                                            100,
                                        )),
                                    ],
                                )
                                .exec()
                                .instrument(debug_span!("update_handlers"))
                                .await
                                .unwrap();

                            debug!("refresher error update: {:?}", result);
                            warn!("refresher error: {:#?}", e);
                        }
                    }
                }
                Err(e) => {
                    let result = client_ref
                        .daohandler()
                        .update_many(
                            vec![daohandler::id::equals(dao_handler_ref.id)],
                            vec![
                                daohandler::refreshstatus::set(prisma::RefreshStatus::New),
                                daohandler::lastrefresh::set(Utc::now().into()),
                                daohandler::refreshspeed::set(cmp::max(
                                    dao_handler_ref.refreshspeed
                                        - (dao_handler_ref.refreshspeed * 25 / 100),
                                    100,
                                )),
                            ],
                        )
                        .exec()
                        .instrument(debug_span!("update_handlers"))
                        .await
                        .unwrap();

                    debug!("refresher error update: {:?}", result);
                    warn!("refresher error: {:#?}", e);
                }
            }
        }
        .instrument(info_span!("detective_request"))
    });

    Ok(())
}
