#![deny(unused_crate_dependencies)]
#![allow(unused_imports)]
#![allow(unused_parens)]

use log::{info, warn};
use pyroscope::PyroscopeAgent;
use pyroscope_pprofrs::{pprof_backend, PprofConfig};
use tokio::try_join;
pub mod prisma;
use std::env;
use std::{sync::Arc, time::Duration};

use handlers::create_voter_handlers;
use prisma::PrismaClient;
use tokio::time::sleep;

mod consume_queue;
mod produce_queue;

use crate::produce_queue::{
    chain_proposals::produce_chain_proposals_queue, chain_votes::produce_chain_votes_queue,
    snapshot_proposals::produce_snapshot_proposals_queue,
    snapshot_votes::produce_snapshot_votes_queue,
};

use crate::consume_queue::{
    chain_proposals::consume_chain_proposals, chain_votes::consume_chain_votes,
    snapshot_proposals::consume_snapshot_proposals, snapshot_votes::consume_snapshot_votes,
};

use config::{load_config_from_db, CONFIG};
pub mod config;
pub mod handlers;

use dotenv::dotenv;

#[derive(Debug)]
enum RefreshType {
    Daochainproposals,
    Daosnapshotproposals,
    Daochainvotes,
    Daosnapshotvotes,
}

#[allow(dead_code)]
#[derive(Debug)]
pub struct RefreshEntry {
    handler_id: String,
    refresh_type: RefreshType,
    voters: Vec<String>,
}

#[tokio::main]
async fn main() {
    dotenv().ok();
    let telemetry_agent;

    if env::consts::OS != "macos" {
        let telemetry_key = match env::var_os("TELEMETRY_KEY") {
            Some(v) => v.into_string().unwrap(),
            None => panic!("$TELEMETRY_KEY is not set"),
        };

        let exec_env = match env::var_os("EXEC_ENV") {
            Some(v) => v.into_string().unwrap(),
            None => panic!("$EXEC_ENV is not set"),
        };

        telemetry_agent =
            PyroscopeAgent::builder("https://profiles-prod-004.grafana.net", "refresher")
                .backend(pprof_backend(PprofConfig::new().sample_rate(100)))
                .basic_auth("491298", telemetry_key)
                .tags([("env", exec_env.as_str())].to_vec())
                .build()
                .unwrap();

        let _ = telemetry_agent.start().unwrap();
    }

    let client = Arc::new(PrismaClient::_builder().build().await.unwrap());
    let config = *CONFIG.read().unwrap();

    //initial load
    let _ = load_config_from_db(&client).await;
    let _ = create_voter_handlers(&client).await;

    let (tx_snapshot_proposals, rx_snapshot_proposals) = flume::unbounded();
    let (tx_snapshot_votes, rx_snapshot_votes) = flume::unbounded();
    let (tx_chain_proposals, rx_chain_proposals) = flume::unbounded();
    let (tx_chain_votes, rx_chain_votes) = flume::unbounded();

    let producer_client_clone = client.clone();

    let producer_task = tokio::task::spawn_blocking(move || async move {
        loop {
            let _ = load_config_from_db(&producer_client_clone).await;
            let _ = create_voter_handlers(&producer_client_clone).await;

            if let Ok(queue) =
                produce_snapshot_proposals_queue(&producer_client_clone, &config).await
            {
                for item in queue {
                    tx_snapshot_proposals.try_send(item).unwrap();
                }
            }

            if let Ok(queue) = produce_snapshot_votes_queue(&producer_client_clone, &config).await {
                for item in queue {
                    tx_snapshot_votes.try_send(item).unwrap();
                }
            }

            if let Ok(queue) = produce_chain_proposals_queue(&producer_client_clone, &config).await
            {
                for item in queue {
                    tx_chain_proposals.try_send(item).unwrap();
                }
            }

            if let Ok(queue) = produce_chain_votes_queue(&producer_client_clone, &config).await {
                for item in queue {
                    tx_chain_votes.try_send(item).unwrap();
                }
            }

            sleep(Duration::from_secs(1)).await;
        }
    })
    .await
    .unwrap();

    let consumer_snapshot_proposal_client = client.clone();
    let consumer_snapshot_proposals_task = tokio::spawn(async move {
        loop {
            info!(
                "consumer_snapshot_proposals_task queue size: {:?}",
                rx_snapshot_proposals.len()
            );
            if let Ok(item) = rx_snapshot_proposals.recv_async().await {
                let client_clone = consumer_snapshot_proposal_client.clone();

                tokio::spawn(async move {
                    match consume_snapshot_proposals(item, &client_clone).await {
                        Ok(_) => {}
                        Err(e) => {
                            warn!("refresher main - {:#?}", e);
                        }
                    }
                });
            }

            sleep(Duration::from_millis(300)).await;
        }
    });

    let consumer_snapshot_votes_client = client.clone();
    let consumer_snapshot_votes_task = tokio::spawn(async move {
        loop {
            info!(
                "consumer_snapshot_votes_task queue size: {:?}",
                rx_snapshot_votes.len()
            );
            if let Ok(item) = rx_snapshot_votes.recv_async().await {
                let client_clone = consumer_snapshot_votes_client.clone();

                tokio::spawn(async move {
                    match consume_snapshot_votes(item, &client_clone).await {
                        Ok(_) => {}
                        Err(e) => {
                            warn!("refresher main - {:#?}", e);
                        }
                    }
                });
            }

            sleep(Duration::from_millis(300)).await;
        }
    });

    let consumer_chain_proposal_client = client.clone();
    let consumer_chain_proposals_task = tokio::spawn(async move {
        loop {
            info!(
                "consumer_chain_proposals_task queue size: {:?}",
                rx_chain_proposals.len()
            );
            if let Ok(item) = rx_chain_proposals.recv_async().await {
                let client_clone = consumer_chain_proposal_client.clone();

                tokio::spawn(async move {
                    match consume_chain_proposals(item, &client_clone).await {
                        Ok(_) => {}
                        Err(e) => {
                            warn!("refresher main - {:#?}", e);
                        }
                    }
                });
            }

            sleep(Duration::from_millis(300)).await;
        }
    });

    let consumer_chain_votes_client = client.clone();
    let consumer_chain_votes_task = tokio::spawn(async move {
        loop {
            info!(
                "consumer_chain_votes_task queue size: {:?}",
                rx_chain_votes.len()
            );
            if let Ok(item) = rx_chain_votes.recv_async().await {
                let client_clone = consumer_chain_votes_client.clone();

                tokio::spawn(async move {
                    match consume_chain_votes(item, &client_clone).await {
                        Ok(_) => {}
                        Err(e) => {
                            warn!("refresher main - {:#?}", e);
                        }
                    }
                });
            }

            sleep(Duration::from_millis(300)).await;
        }
    });

    producer_task.await;

    try_join!(
        consumer_snapshot_proposals_task,
        consumer_snapshot_votes_task,
        consumer_chain_proposals_task,
        consumer_chain_votes_task
    )
    .unwrap();
}
