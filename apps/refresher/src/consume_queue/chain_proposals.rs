use std::{cmp, collections::HashMap, env, sync::Arc};

use anyhow::Result;
use log::{info, warn};

use prisma_client_rust::chrono::Utc;
use reqwest::{
    header::{HeaderName, HeaderValue},
    Client,
};
use serde::Deserialize;
use tokio::task;
use tracing::{debug, event, info_span, instrument, warn_span, Instrument, Level, Span};

use crate::{
    prisma::{self, daohandler, PrismaClient},
    refresh_status::DAOS_REFRESH_STATUS,
    RefreshEntry, RefreshStatus,
};

#[derive(Deserialize, Debug)]
#[allow(non_snake_case)]
struct ProposalsResponse {
    success: bool,
}

#[instrument]
pub(crate) async fn consume_chain_proposals(entry: RefreshEntry) -> Result<()> {
    let detective_url = env::var("DETECTIVE_URL").expect("$DETECTIVE_URL is not set");

    let post_url = format!("{}/proposals/chain_proposals", detective_url);

    let http_client = Client::builder().build().unwrap();

    task::spawn(async move {
        let mut daos_refresh_status = DAOS_REFRESH_STATUS.lock().await;
        let dao_handler_position = daos_refresh_status
            .iter()
            .position(|r| r.dao_handler_id == entry.handler_id)
            .expect("DaoHandler not found in refresh status array");
        let dao_handler = daos_refresh_status.get_mut(dao_handler_position).unwrap();

        event!(
            Level::INFO,
            daoHandlerId = entry.handler_id,
            votersrefreshspeed = dao_handler.refreshspeed,
            "refresh item"
        );

        let response = http_client
                .post(&post_url)
                .json(&serde_json::json!({ "daoHandlerId": entry.handler_id, "refreshspeed":dao_handler.refreshspeed}))
                .send()
                .await;

        match response {
            Ok(res) => {
                let data = res.json::<ProposalsResponse>().await;
                match data {
                    Ok(data) => {
                        match data.success {
                            true => {
                                dao_handler.refresh_status = RefreshStatus::DONE;
                                dao_handler.last_refresh = Utc::now();
                                dao_handler.refreshspeed = cmp::min(
                                    dao_handler.refreshspeed
                                        + (dao_handler.refreshspeed * 10 / 100),
                                    10000000,
                                );

                                event!(
                                    Level::INFO,
                                    daohandler = dao_handler.dao_handler_id,
                                    lastrefresh = dao_handler.last_refresh.to_string(),
                                    refreshspeed = dao_handler.refreshspeed,
                                    "updated ok"
                                );
                            }
                            false => {
                                dao_handler.refresh_status = RefreshStatus::NEW;
                                dao_handler.last_refresh = Utc::now();
                                dao_handler.refreshspeed = cmp::max(
                                    dao_handler.refreshspeed
                                        - (dao_handler.refreshspeed * 25 / 100),
                                    100,
                                );

                                event!(
                                    Level::WARN,
                                    daohandler = dao_handler.dao_handler_id,
                                    lastrefresh = dao_handler.last_refresh.to_string(),
                                    refreshspeed = dao_handler.refreshspeed,
                                    "updated nok"
                                );
                            }
                        };
                    }
                    Err(e) => {
                        dao_handler.refresh_status = RefreshStatus::NEW;
                        dao_handler.last_refresh = Utc::now();
                        dao_handler.refreshspeed = cmp::max(
                            dao_handler.refreshspeed - (dao_handler.refreshspeed * 25 / 100),
                            100,
                        );

                        event!(
                            Level::ERROR,
                            daohandler = dao_handler.dao_handler_id,
                            lastrefresh = dao_handler.last_refresh.to_string(),
                            refreshspeed = dao_handler.refreshspeed,
                            err = e.to_string(),
                            "failed to update"
                        );
                    }
                }
            }
            Err(e) => {
                dao_handler.refresh_status = RefreshStatus::NEW;
                dao_handler.last_refresh = Utc::now();
                dao_handler.refreshspeed = cmp::max(
                    dao_handler.refreshspeed - (dao_handler.refreshspeed * 25 / 100),
                    100,
                );

                event!(
                    Level::ERROR,
                    daohandler = dao_handler.dao_handler_id,
                    lastrefresh = dao_handler.last_refresh.to_string(),
                    refreshspeed = dao_handler.refreshspeed,
                    err = e.to_string(),
                    "failed to update"
                );
            }
        }
    }.instrument(info_span!("consume_chain_proposals_task")));

    Ok(())
}
