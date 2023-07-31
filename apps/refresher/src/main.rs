#![deny(unused_crate_dependencies)]
#![allow(unused_imports)]
#![allow(unused_parens)]

use dotenv::dotenv;
use flume as _;
use log::{info, warn};
use reqwest as _;
use serde_json as _;
use std::{env, sync::Arc, time::Duration};
use tokio::{time::sleep, try_join};
use tracing::{debug, debug_span, event, Instrument, Level};
use tracing_bunyan_formatter::BunyanFormattingLayer;
use tracing_subscriber::{fmt, prelude::*};

use config::{load_config_from_db, CONFIG};
use handlers::create_voter_handlers;
use prisma::PrismaClient;
use tracing_subscriber::{prelude::__tracing_subscriber_SubscriberExt, EnvFilter};

use crate::{
    consume_queue::{
        chain_proposals::consume_chain_proposals, chain_votes::consume_chain_votes,
        snapshot_proposals::consume_snapshot_proposals, snapshot_votes::consume_snapshot_votes,
    },
    produce_queue::{
        chain_proposals::produce_chain_proposals_queue, chain_votes::produce_chain_votes_queue,
        snapshot_proposals::produce_snapshot_proposals_queue,
        snapshot_votes::produce_snapshot_votes_queue,
    },
    refresh_status::{create_refresh_statuses, DAOS_REFRESH_STATUS},
};

pub mod prisma;

mod consume_queue;
mod produce_queue;
mod refresh_status;

pub mod config;
pub mod handlers;

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
    handler_type: prisma::DaoHandlerType,
    refresh_type: RefreshType,
    voters: Vec<String>,
}

#[derive(Debug, Clone, PartialEq)]
pub enum RefreshStatus {
    NEW,
    DONE,
    PENDING,
}

#[tokio::main]
async fn main() {
    dotenv().ok();

    let app_name = "refresher";

    let filter_str = format!("{}={}", app_name, "info");
    let env_filter = EnvFilter::try_new(filter_str).unwrap_or_else(|_| EnvFilter::new("info"));
    let (axiom_layer, _guard) = tracing_axiom::builder()
        .with_service_name(app_name)
        .layer()
        .unwrap();

    tracing_subscriber::registry()
        .with(env_filter)
        .with(axiom_layer)
        .with(BunyanFormattingLayer::new(app_name.into(), std::io::stdout))
        .try_init()
        .unwrap();

    let client = Arc::new(PrismaClient::_builder().build().await.unwrap());
    let config = *CONFIG.read().unwrap();

    //initial load
    let _ = load_config_from_db(&client).await;
    let _ = create_voter_handlers(&client).await;

    let _ = create_refresh_statuses(&client).await;

    let (tx_snapshot_proposals, rx_snapshot_proposals) = flume::unbounded();
    let (tx_snapshot_votes, rx_snapshot_votes) = flume::unbounded();
    let (tx_chain_proposals, rx_chain_proposals) = flume::unbounded();
    let (tx_chain_votes, rx_chain_votes) = flume::unbounded();

    let slow_task_client_clone = client.clone();
    let slow_task = tokio::task::spawn(async move {
        loop {
            let _ = load_config_from_db(&slow_task_client_clone).await;
            let _ = create_voter_handlers(&slow_task_client_clone).await;
            let _ = create_refresh_statuses(&slow_task_client_clone).await;
            sleep(Duration::from_secs(5)).await;
        }
    });

    let producer_client_clone = client.clone();
    let producer_task = tokio::task::spawn_blocking(move || async move {
        loop {
            if let Ok(queue) = produce_snapshot_proposals_queue(&config).await {
                for item in queue {
                    tx_snapshot_proposals.try_send(item).unwrap();
                }
            }

            if let Ok(queue) = produce_chain_proposals_queue(&config).await {
                for item in queue {
                    tx_chain_proposals.try_send(item).unwrap();
                }
            }

            if let Ok(queue) = produce_snapshot_votes_queue(&producer_client_clone, &config).await {
                for item in queue {
                    tx_snapshot_votes.try_send(item).unwrap();
                }
            }

            if let Ok(queue) = produce_chain_votes_queue(&producer_client_clone, &config).await {
                for item in queue {
                    tx_chain_votes.try_send(item).unwrap();
                }
            }

            let _daos_refresh_status = DAOS_REFRESH_STATUS.lock().await;

            sleep(Duration::from_secs(1)).await;
        }
    })
    .await
    .unwrap();

    let consumer_snapshot_proposals_task = tokio::spawn(async move {
        loop {
            if let Ok(item) = rx_snapshot_proposals.recv_async().await {
                tokio::spawn(async move {
                    match consume_snapshot_proposals(item).await {
                        Ok(_) => {}
                        Err(_e) => {}
                    }
                });
            }

            sleep(Duration::from_millis(100)).await;
        }
    });

    let consumer_chain_proposals_task = tokio::spawn(async move {
        loop {
            if let Ok(item) = rx_chain_proposals.recv_async().await {
                tokio::spawn(async move {
                    match consume_chain_proposals(item).await {
                        Ok(_) => {}
                        Err(_e) => {}
                    }
                });
            }

            sleep(Duration::from_millis(100)).await;
        }
    });

    let consumer_snapshot_votes_task = tokio::spawn(async move {
        loop {
            if let Ok(item) = rx_snapshot_votes.recv_async().await {
                tokio::spawn(async move {
                    match consume_snapshot_votes(item).await {
                        Ok(_) => {}
                        Err(_e) => {}
                    }
                });
            }

            sleep(Duration::from_millis(100)).await;
        }
    });

    let consumer_chain_votes_task = tokio::spawn(async move {
        loop {
            if let Ok(item) = rx_chain_votes.recv_async().await {
                tokio::spawn(async move {
                    match consume_chain_votes(item).await {
                        Ok(_) => {}
                        Err(_e) => {}
                    }
                });
            }

            sleep(Duration::from_millis(100)).await;
        }
    });

    producer_task.await;

    try_join!(
        slow_task,
        consumer_snapshot_proposals_task,
        consumer_snapshot_votes_task,
        consumer_chain_proposals_task,
        consumer_chain_votes_task
    )
    .unwrap();
}
