use anyhow::Result;
use tokio::try_join;
mod prisma;
use std::sync::Arc;
use std::time::Duration;

use handlers::create_voter_handlers;
use prisma::PrismaClient;
use tokio::sync::mpsc;
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

#[tokio::main]
async fn main() {
    let client = Arc::new(PrismaClient::_builder().build().await.unwrap());
    let config_clone = (*CONFIG.read().unwrap()).clone();

    let (tx, mut rx) = mpsc::channel(1000);

    let producer_client_clone = client.clone();

    let producer_task = tokio::spawn(async move {
        loop {
            let inner_client_clone = producer_client_clone.clone();
            let tx_clone = tx.clone();
            let config_clone = (*CONFIG.read().unwrap()).clone();

            tokio::spawn(async move {
                let queue = match producer_task(&inner_client_clone, &config_clone).await {
                    Ok(r) => r,
                    Err(e) => {
                        println!("{:#?}", e);

                        vec![]
                    }
                };
                tx_clone.send(queue).await
            });

            sleep(Duration::from_secs(1)).await;
        }
    });

    let consumer_client_clone = client.clone();
    let consumer_task = tokio::spawn(async move {
        loop {
            let item = rx.recv().await.unwrap();

            println!("Queue size: {:?}", item.len());

            for entry in item {
                let client_clone = consumer_client_clone.clone();

                tokio::spawn(async move {
                    match comsumer_task(entry, &client_clone).await {
                        Ok(_) => {}
                        Err(e) => {
                            println!("{:#?}", e);
                        }
                    }
                });
                sleep(Duration::from_millis(config_clone.refresh_interval.into())).await;
            }
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
