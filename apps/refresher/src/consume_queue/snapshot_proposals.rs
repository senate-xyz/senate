use std::{cmp, collections::HashMap, env, sync::Arc};

use anyhow::Result;
use log::warn;
use opentelemetry::{propagation::TextMapPropagator, sdk::propagation::TraceContextPropagator};
use prisma_client_rust::chrono::{DateTime, Utc};
use reqwest::{
    header::{HeaderName, HeaderValue},
    Client,
};
use serde::Deserialize;
use tokio::task;
use tracing::{debug, debug_span, event, info_span, instrument, Instrument, Level};
use tracing_opentelemetry::OpenTelemetrySpanExt;

use crate::{
    prisma::{self, daohandler, PrismaClient},
    refresh_status::DAOS_REFRESH_STATUS,
    RefreshEntry,
};

#[derive(Deserialize, Debug)]
#[allow(non_snake_case)]
struct ProposalsResponse {
    response: String,
}

#[instrument(skip_all, level = "info")]
pub(crate) async fn consume_snapshot_proposals(entry: RefreshEntry) -> Result<()> {
    let detective_url = env::var("DETECTIVE_URL").expect("$DETECTIVE_URL is not set");

    let post_url = format!("{}/proposals/snapshot_proposals", detective_url);

    let http_client = Client::builder().build().unwrap();

    task::spawn(
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

            event!(Level::DEBUG, "{:?} {:?}", entry.refresh_type, dao_handler);

            let response = http_client
                .post(&post_url)
                .json(&serde_json::json!({ "daoHandlerId": entry.handler_id, "refreshspeed":dao_handler.refreshspeed, "trace": trace}))
                .send()
                .await;

            match response {
                Ok(res) => {
                    let data = res.json::<ProposalsResponse>().await;

                    match data {
                        Ok(data) => {
                            event!(Level::DEBUG, "{:?}", data);
                            match data.response.as_str() {
                                "ok" => {
                                    dao_handler.refresh_status = prisma::RefreshStatus::Done;
                                    dao_handler.last_refresh = Utc::now();
                                    dao_handler.refreshspeed = cmp::min(
                                        dao_handler.refreshspeed
                                            + (dao_handler.refreshspeed * 10 / 100),
                                        1000,
                                    );
                                }
                                "nok" => {
                                    dao_handler.refresh_status = prisma::RefreshStatus::New;
                                    dao_handler.last_refresh = Utc::now();
                                    dao_handler.refreshspeed = cmp::max(
                                        dao_handler.refreshspeed
                                            - (dao_handler.refreshspeed * 25 / 100),
                                        10,
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
                                10,
                            );
                            event!(Level::WARN, "{:?}", e);
                        }
                    }
                }
                Err(e) => {
                    dao_handler.refresh_status = prisma::RefreshStatus::New;
                    dao_handler.last_refresh = Utc::now();
                    dao_handler.refreshspeed = cmp::max(
                        dao_handler.refreshspeed - (dao_handler.refreshspeed * 25 / 100),
                        10,
                    );
                    event!(Level::WARN, "{:?}", e);
                }
            }
        }
            .instrument(info_span!("consume_snapshot_proposals_async"))
    );

    Ok(())
}
