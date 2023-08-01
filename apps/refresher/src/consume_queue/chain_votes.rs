use std::{cmp, collections::HashMap, env, sync::Arc};

use anyhow::Result;
use log::warn;
use metrics::increment_counter;
use prisma_client_rust::chrono::Utc;
use reqwest::{
    header::{HeaderName, HeaderValue},
    Client,
};
use serde::Deserialize;
use tokio::task;
use tracing::{
    debug, debug_span, error_span, event, info_span, instrument, warn_span, Instrument, Level,
};

use crate::{
    prisma::{self, daohandler, PrismaClient},
    refresh_status::{DAOS_REFRESH_STATUS, VOTERS_REFRESH_STATUS},
    RefreshEntry, RefreshStatus,
};

#[allow(non_snake_case)]
#[derive(Deserialize, Debug)]
struct ApiResponse {
    voter_address: String,
    success: bool,
}

#[instrument]
pub(crate) async fn consume_chain_votes(entry: RefreshEntry) -> Result<()> {
    let detective_url = env::var("DETECTIVE_URL").expect("$DETECTIVE_URL is not set");

    let post_url = format!("{}/votes/chain_votes", detective_url);

    let http_client = Client::builder().build().unwrap();

    task::spawn(async move {
        let mut daos_refresh_status = DAOS_REFRESH_STATUS.lock().await;
        let mut voter_refresh_status = VOTERS_REFRESH_STATUS.lock().await;
        let dao_handler_position = daos_refresh_status
            .iter()
            .position(|r| r.dao_handler_id == entry.handler_id)
            .expect("DaoHandler not found in refresh status array");
        let dao_handler_r = daos_refresh_status.get_mut(dao_handler_position).unwrap();

        event!(
            Level::INFO,
            daoHandlerId = entry.handler_id,
            votersrefreshspeed = dao_handler_r.votersrefreshspeed,
            "refresh item"
        );

        let response = http_client
                .post(&post_url)
                .json(&serde_json::json!({ "daoHandlerId": entry.handler_id, "voters": entry.voters, "refreshspeed": dao_handler_r.votersrefreshspeed}))
                .send()
                .await;

        match response {
            Ok(res) => {
                let data = res.json::<Vec<ApiResponse>>().await;

                match data {
                    Ok(data) => {
                        let ok_voters_response: Vec<String> = data
                            .iter()
                            .filter(|result| result.success)
                            .map(|result| result.voter_address.clone())
                            .collect();

                        let nok_voters_response: Vec<String> = data
                            .iter()
                            .filter(|result| !result.success)
                            .map(|result| result.voter_address.clone())
                            .collect();

                        if !ok_voters_response.is_empty() {
                            dao_handler_r.votersrefreshspeed = cmp::min(
                                dao_handler_r.votersrefreshspeed
                                    + (dao_handler_r.votersrefreshspeed * 10 / 100),
                                1000000000,
                            );

                            if entry.handler_type == prisma::DaoHandlerType::MakerPollArbitrum {
                                dao_handler_r.votersrefreshspeed = cmp::min(
                                    dao_handler_r.votersrefreshspeed
                                        + (dao_handler_r.votersrefreshspeed * 10 / 100),
                                    10000000000,
                                );
                            }

                            event!(
                                Level::INFO,
                                daohandler = dao_handler_r.dao_handler_id,
                                "updated ok"
                            );
                        }

                        if !nok_voters_response.is_empty() {
                            dao_handler_r.votersrefreshspeed = cmp::max(
                                dao_handler_r.votersrefreshspeed
                                    - (dao_handler_r.votersrefreshspeed * 25 / 100),
                                100,
                            );

                            event!(
                                Level::INFO,
                                daohandler = dao_handler_r.dao_handler_id,
                                "updated nok"
                            );
                        }
                        
                        for vh in voter_refresh_status.iter_mut() {
                            if ok_voters_response.contains(&vh.voter_address) {
                                vh.refresh_status = RefreshStatus::DONE;
                                vh.last_refresh = Utc::now();
                            }

                            if nok_voters_response.contains(&vh.voter_address) {
                                vh.refresh_status = RefreshStatus::NEW;
                            }
                        }
                    }
                    Err(e) => {
                        for vh in voter_refresh_status.iter_mut() {
                            vh.refresh_status = RefreshStatus::NEW;

                            increment_counter!("refresher_chain_votes_errors");
                            event!(
                                Level::ERROR,
                                daohandler = dao_handler_r.dao_handler_id,
                                voteraddress = vh.voter_address,
                                err = e.to_string(),
                                "failed to update"
                            );
                        }
                        dao_handler_r.votersrefreshspeed = cmp::max(
                            dao_handler_r.votersrefreshspeed
                                - (dao_handler_r.votersrefreshspeed * 25 / 100),
                            100,
                        );
                    }
                }
            }
            Err(e) => {
                for vh in voter_refresh_status.iter_mut() {
                    vh.refresh_status = RefreshStatus::NEW;

                    increment_counter!("refresher_chain_votes_errors");
                    event!(
                        Level::ERROR,
                        daohandler = dao_handler_r.dao_handler_id,
                        voteraddress = vh.voter_address,
                        err = e.to_string(),
                        "failed to update"
                    );
                }
                dao_handler_r.votersrefreshspeed = cmp::max(
                    dao_handler_r.votersrefreshspeed
                        - (dao_handler_r.votersrefreshspeed * 25 / 100),
                    100,
                );
            }
        }
    }.instrument(info_span!("consume_chain_votes_task")));

    Ok(())
}
