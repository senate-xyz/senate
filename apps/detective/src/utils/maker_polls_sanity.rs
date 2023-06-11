use std::sync::Arc;

use crate::{
    contracts::makerpollcreate::{self, PollWithdrawnFilter},
    prisma::{self, daohandler, proposal, vote, DaoHandlerType},
};
use chrono::{Duration, Utc};
use ethers::{
    providers::{Http, Provider},
    types::Address,
};
use reqwest_middleware::ClientBuilder;
use reqwest_retry::{policies::ExponentialBackoff, RetryTransientMiddleware};
use serde::Deserialize;
use tracing::{debug, event, instrument, Level};

use super::etherscan::{estimate_block, estimate_timestamp};

#[allow(non_snake_case)]
#[derive(Debug, Deserialize)]
struct Decoder {
    address_create: String,
}

#[instrument]
pub async fn maker_polls_sanity_check(db: Arc<prisma::PrismaClient>, rpc: Arc<Provider<Http>>) {
    let sanitize_from: chrono::DateTime<Utc> = Utc::now() - Duration::days(30);
    let sanitize_to: chrono::DateTime<Utc> = Utc::now() - Duration::minutes(5);

    let dao_handler = db
        .clone()
        .daohandler()
        .find_first(vec![daohandler::r#type::equals(DaoHandlerType::MakerPoll)])
        .exec()
        .await
        .unwrap();

    match dao_handler {
        Some(handler) => sanitize(handler, sanitize_from, sanitize_to, &db, &rpc).await,
        None => {}
    }
}

#[instrument]
async fn sanitize(
    dao_handler: daohandler::Data,
    sanitize_from: chrono::DateTime<Utc>,
    sanitize_to: chrono::DateTime<Utc>,
    db: &Arc<prisma::PrismaClient>,
    rpc: &Arc<Provider<Http>>,
) {
    let from_block = estimate_block(sanitize_from.timestamp()).await.unwrap();
    let to_block = estimate_block(sanitize_to.timestamp()).await.unwrap();

    debug!("from block: {} / to block: {}", from_block, to_block);

    let decoder: Decoder = serde_json::from_value(dao_handler.clone().decoder).unwrap();

    let address = decoder
        .address_create
        .parse::<Address>()
        .expect("bad address");

    let gov_contract = makerpollcreate::makerpollcreate::makerpollcreate::new(address, rpc.clone());

    let events = gov_contract
        .poll_withdrawn_filter()
        .from_block(from_block)
        .to_block(to_block);

    let withdrawn_proposals: Vec<PollWithdrawnFilter> = events.query().await.unwrap();

    debug!("{:?}", withdrawn_proposals);

    for withdrawn_proposal in withdrawn_proposals {
        let proposal = db
            .proposal()
            .find_first(vec![
                proposal::externalid::equals(withdrawn_proposal.poll_id.to_string()),
                proposal::daohandlerid::equals(dao_handler.clone().id),
            ])
            .exec()
            .await
            .unwrap();

        match proposal {
            Some(existing_proposal) => {
                db.vote()
                    .delete_many(vec![vote::proposalid::equals(existing_proposal.clone().id)])
                    .exec()
                    .await
                    .unwrap();

                db.proposal()
                    .delete(proposal::id::equals(
                        existing_proposal.clone().id.to_string(),
                    ))
                    .exec()
                    .await
                    .unwrap();

                info!("Sanitized {:?} MakerPoll proposal", existing_proposal.name);

                debug!("Sanitized MakerPoll proposal - {:?}", existing_proposal);
            }
            None => {}
        }
    }
}
