use std::sync::Arc;

use chrono::{Duration, Utc};
use ethers::{
    providers::{Http, Provider},
    types::Address,
};
use reqwest_middleware::ClientBuilder;
use reqwest_retry::{policies::ExponentialBackoff, RetryTransientMiddleware};
use serde::Deserialize;
use tracing::{debug, debug_span, event, instrument, Instrument, Level};

use crate::{
    contracts::makerpollcreate::{self, PollWithdrawnFilter},
    prisma::{self, daohandler, proposal, vote, DaoHandlerType},
    Context,
};

use super::etherscan::{estimate_block, estimate_timestamp};

#[allow(non_snake_case)]
#[derive(Debug, Deserialize)]
struct Decoder {
    address_create: String,
}

#[instrument(skip(ctx), level = "info")]
pub async fn maker_polls_sanity_check(ctx: &Context) {
    let sanitize_from: chrono::DateTime<Utc> = Utc::now() - Duration::days(30);
    let sanitize_to: chrono::DateTime<Utc> = Utc::now() - Duration::minutes(5);

    let dao_handler = ctx
        .db
        .clone()
        .daohandler()
        .find_first(vec![daohandler::r#type::equals(DaoHandlerType::MakerPoll)])
        .exec()
        .instrument(debug_span!("get_dao_handlers"))
        .await
        .unwrap();

    if let Some(handler) = dao_handler {
        sanitize(handler, sanitize_from, sanitize_to, ctx).await
    }
}

#[instrument(skip(ctx), level = "debug")]
async fn sanitize(
    dao_handler: daohandler::Data,
    sanitize_from: chrono::DateTime<Utc>,
    sanitize_to: chrono::DateTime<Utc>,
    ctx: &Context,
) {
    let from_block = estimate_block(sanitize_from.timestamp(), ctx)
        .await
        .unwrap();
    let to_block = estimate_block(sanitize_to.timestamp(), ctx).await.unwrap();

    let decoder: Decoder = serde_json::from_value(dao_handler.clone().decoder).unwrap();

    let address = decoder
        .address_create
        .parse::<Address>()
        .expect("bad address");

    event!(
        Level::DEBUG,
        "{:?} {:?} {:?} {:?}",
        from_block,
        to_block,
        decoder,
        address
    );

    let gov_contract =
        makerpollcreate::makerpollcreate::makerpollcreate::new(address, ctx.rpc.clone());

    let events = gov_contract
        .poll_withdrawn_filter()
        .from_block(from_block)
        .to_block(to_block);

    let withdrawn_proposals: Vec<PollWithdrawnFilter> = events
        .query()
        .instrument(debug_span!("get_rpc_events"))
        .await
        .unwrap();

    for withdrawn_proposal in withdrawn_proposals {
        let proposal = ctx
            .db
            .proposal()
            .find_first(vec![
                proposal::externalid::equals(withdrawn_proposal.poll_id.to_string()),
                proposal::daohandlerid::equals(dao_handler.clone().id),
            ])
            .exec()
            .instrument(debug_span!("get_proposals"))
            .await
            .unwrap();

        if let Some(existing_proposal) = proposal {
            ctx.db
                .vote()
                .delete_many(vec![vote::proposalid::equals(existing_proposal.clone().id)])
                .exec()
                .instrument(debug_span!("delete_votes"))
                .await
                .unwrap();

            ctx.db
                .proposal()
                .delete(proposal::id::equals(
                    existing_proposal.clone().id.to_string(),
                ))
                .exec()
                .instrument(debug_span!("delete_proposal"))
                .await
                .unwrap();

            event!(
                Level::INFO,
                "Sanitized {} MakerPoll proposal",
                existing_proposal.name
            );

            event!(
                Level::DEBUG,
                "Sanitized MakerPoll proposal - {:?}",
                existing_proposal
            );
        }
    }
}
