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
    refresh_status::DAOS_REFRESH_STATUS,
    RefreshEntry,
};

#[derive(Deserialize)]
#[allow(non_snake_case)]
struct ProposalsResponse {
    response: String,
}
#[instrument(level = "info")]
pub(crate) async fn consume_chain_proposals(entry: RefreshEntry) -> Result<()> {
    let detective_url = env::var("DETECTIVE_URL").expect("$DETECTIVE_URL is not set");

    let post_url = format!("{}/proposals/chain_proposals", detective_url);

    let http_client = Client::builder().build().unwrap();

    task::spawn({
        async move {
            let span = tracing::Span::current();
            let context = span.context();
            let propagator = TraceContextPropagator::new();
            let mut trace = HashMap::new();
            propagator.inject_context(&context, &mut trace);

            let mut daos_refresh_status = DAOS_REFRESH_STATUS.lock().await;
            let dao_handler_position = daos_refresh_status
                .iter()
                .position(|r| r.dao_handler_id == entry.handler_id)
                .expect("DaoHandler not found in refresh status array");
            let dao_handler = daos_refresh_status.get_mut(dao_handler_position).unwrap();

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
                            match data.response.as_str() {
                                "ok" => {
                                    dao_handler.refresh_status = prisma::RefreshStatus::Done;
                                    dao_handler.last_refresh = Utc::now();
                                    dao_handler.refreshspeed = cmp::min(
                                        dao_handler.refreshspeed
                                            + (dao_handler.refreshspeed * 10 / 100),
                                        10000000,
                                    );
                                }
                                "nok" => {
                                    dao_handler.refresh_status = prisma::RefreshStatus::New;
                                    dao_handler.last_refresh = Utc::now();
                                    dao_handler.refreshspeed = cmp::max(
                                        dao_handler.refreshspeed
                                            - (dao_handler.refreshspeed * 25 / 100),
                                        100,
                                    );
                                }
                                _ => panic!("Unexpected response"),
                            };
                        }
                        Err(e) => {
                            dao_handler.refresh_status = prisma::RefreshStatus::New;
                            dao_handler.last_refresh = Utc::now();
                            dao_handler.refreshspeed = cmp::max(
                                dao_handler.refreshspeed - (dao_handler.refreshspeed * 25 / 100),
                                100,
                            );

                            warn!("refresher error: {:#?}", e);
                        }
                    }
                }
                Err(e) => {
                    dao_handler.refresh_status = prisma::RefreshStatus::New;
                    dao_handler.last_refresh = Utc::now();
                    dao_handler.refreshspeed = cmp::max(
                        dao_handler.refreshspeed - (dao_handler.refreshspeed * 25 / 100),
                        100,
                    );

                    warn!("refresher error: {:#?}", e);
                }
            }
        }
        .instrument(info_span!("detective_request"))
    });

    Ok(())
}
