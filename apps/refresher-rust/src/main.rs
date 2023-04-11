use anyhow::Result;
use log::{info, warn};
use tokio::try_join;
mod prisma;
use std::sync::Arc;
use std::time::Duration;

use handlers::create_voter_handlers;
use prisma::PrismaClient;
use tokio::time::sleep;

mod produce_queue {
    pub mod chain_proposals;
    pub mod chain_votes;
    pub mod snapshot_proposals;
    pub mod snapshot_votes;
}

mod consume_queue {
    pub mod chain_proposals;
    pub mod chain_votes;
    pub mod snapshot_proposals;
    pub mod snapshot_votes;
}

use crate::produce_queue::chain_proposals::produce_chain_proposals_queue;
use crate::produce_queue::chain_votes::produce_chain_votes_queue;
use crate::produce_queue::snapshot_proposals::produce_snapshot_proposals_queue;
use crate::produce_queue::snapshot_votes::produce_snapshot_votes_queue;

use crate::consume_queue::chain_proposals::consume_chain_proposals;
use crate::consume_queue::chain_votes::consume_chain_votes;
use crate::consume_queue::snapshot_proposals::consume_snapshot_proposals;
use crate::consume_queue::snapshot_votes::consume_snapshot_votes;

use config::{load_config_from_db, Config, CONFIG};
pub mod config;
pub mod handlers;
use env_logger::{Builder, Env};

#[derive(Debug)]
enum RefreshType {
    Daochainproposals,
    Daosnapshotproposals,
    Daochainvotes,
    Daosnapshotvotes,
}

#[derive(Debug)]
pub struct RefreshEntry {
    handler_id: String,
    refresh_type: RefreshType,
    voters: Vec<String>,
}

fn init_logger() {
    let env = Env::default()
        .filter_or("LOG_LEVEL", "info")
        .write_style_or("LOG_STYLE", "always");

    Builder::from_env(env)
        .format_level(false)
        .format_timestamp_nanos()
        .init();
}

#[tokio::main]
async fn main() {
    init_logger();

    info!("refresher start");

    let client = Arc::new(PrismaClient::_builder().build().await.unwrap());
    let config = (*CONFIG.read().unwrap()).clone();

    //initial load
    let _ = load_config_from_db(&client).await;
    let _ = create_voter_handlers(&client).await;

    let (tx, rx) = flume::unbounded();

    let producer_client_clone = client.clone();

    let producer_task = tokio::spawn(async move {
        loop {
            let queue = match producer_task(&producer_client_clone, &config).await {
                Ok(r) => r,
                Err(e) => {
                    warn!("refresher main - {:#?}", e);
                    vec![]
                }
            };

            for item in queue {
                tx.send(item).unwrap();
            }

            sleep(Duration::from_secs(1)).await;
        }
    });

    let consumer_client_clone = client.clone();
    let consumer_task = tokio::spawn(async move {
        loop {
            info!("queue size: {:?}", rx.len());
            match rx.recv_async().await {
                Ok(item) => {
                    let client_clone = consumer_client_clone.clone();

                    tokio::spawn(async move {
                        match comsumer_task(item, &client_clone).await {
                            Ok(_) => {}
                            Err(e) => {
                                warn!("refresher main - {:#?}", e);
                            }
                        }
                    });
                }
                Err(_) => {}
            }

            sleep(Duration::from_millis(config.refresh_interval.into())).await;
        }
    });

    try_join!(consumer_task, producer_task).unwrap();
}

async fn comsumer_task(entry: RefreshEntry, client: &Arc<PrismaClient>) -> Result<()> {
    match entry.refresh_type {
        RefreshType::Daosnapshotproposals => {
            consume_snapshot_proposals(entry, client).await?;
        }
        RefreshType::Daosnapshotvotes => {
            consume_snapshot_votes(entry, client).await?;
        }
        RefreshType::Daochainproposals => {
            consume_chain_proposals(entry, client).await?;
        }
        RefreshType::Daochainvotes => {
            consume_chain_votes(entry, client).await?;
        }
    }
    Ok(())
}

async fn producer_task(client: &PrismaClient, config: &Config) -> Result<Vec<RefreshEntry>> {
    load_config_from_db(client).await?;
    create_voter_handlers(client).await?;

    let snapshot_proposal_queue = produce_snapshot_proposals_queue(client, config).await?;
    let snapshot_votes_queue = produce_snapshot_votes_queue(client, config).await?;

    let chain_proposal_queue = produce_chain_proposals_queue(client, config).await?;
    let chain_votes_queue = produce_chain_votes_queue(client, config).await?;

    let mut complete_queue = Vec::new();
    complete_queue.reserve(
        snapshot_proposal_queue.len()
            + snapshot_votes_queue.len()
            + chain_proposal_queue.len()
            + chain_votes_queue.len(),
    );
    complete_queue.extend(snapshot_proposal_queue);
    complete_queue.extend(snapshot_votes_queue);
    complete_queue.extend(chain_proposal_queue);
    complete_queue.extend(chain_votes_queue);

    Ok(complete_queue)
}
