mod prisma;
use prisma::{ PrismaClient };

mod create_queue {
    pub mod snapshot_proposals;
    pub mod chain_votes;
    pub mod chain_proposals;
}
use crate::create_queue::snapshot_proposals::get_snapshot_proposals_queue;
use crate::create_queue::chain_votes::get_chain_votes_queue;
use crate::create_queue::chain_proposals::get_chain_proposals_queue;

#[derive(Debug)]
#[allow(dead_code)]
enum RefreshType {
    DAOCHAINPROPOSALS,
    DAOSNAPSHOTPROPOSALS,
    DAOCHAINVOTES,
    DAOSNAPSHOTVOTES,
}

#[derive(Debug)]
#[allow(dead_code)]
pub struct RefreshEntry {
    handler_id: String,
    refresh_type: RefreshType,
    voters: Vec<String>,
}

#[tokio::main]
async fn main() {
    let client = PrismaClient::_builder().build().await.unwrap();

    let snapshot_proposal_queue = get_snapshot_proposals_queue(&client).await;

    let chain_proposal_queue = get_chain_proposals_queue(&client).await;
    let chain_votes_queue = get_chain_votes_queue(&client).await;

    print!(
        "{:?} \n\n {:?} \n\n {:?}",
        snapshot_proposal_queue,

        chain_proposal_queue,
        chain_votes_queue
    )
}