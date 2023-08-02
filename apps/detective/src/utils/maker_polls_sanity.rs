use std::sync::Arc;

use anyhow::Result;
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
    prisma::{self, daohandler, proposal, vote, DaoHandlerType, ProposalState},
    Context,
};

use super::etherscan::{estimate_block, estimate_timestamp};

#[allow(non_snake_case)]
#[derive(Debug, Deserialize)]
struct Decoder {
    address_create: String,
}

#[instrument(skip_all)]
pub async fn maker_polls_sanity_check(ctx: &Context) -> Result<()> {
    let sanitize_from: chrono::DateTime<Utc> = Utc::now() - Duration::days(30);
    let sanitize_to: chrono::DateTime<Utc> = Utc::now() - Duration::minutes(5);

    let dao_handler = ctx
        .db
        .clone()
        .daohandler()
        .find_first(vec![daohandler::r#type::equals(DaoHandlerType::MakerPoll)])
        .exec()
        .await?;

    if let Some(handler) = dao_handler {
        sanitize(handler, sanitize_from, sanitize_to, ctx).await?
    }

    Ok(())
}

#[instrument(skip(ctx))]
async fn sanitize(
    dao_handler: daohandler::Data,
    sanitize_from: chrono::DateTime<Utc>,
    sanitize_to: chrono::DateTime<Utc>,
    ctx: &Context,
) -> Result<()> {
    let from_block = estimate_block(sanitize_from.timestamp()).await?;
    let to_block = estimate_block(sanitize_to.timestamp()).await?;

    let decoder: Decoder = serde_json::from_value(dao_handler.clone().decoder).unwrap();

    let address = decoder
        .address_create
        .parse::<Address>()
        .expect("bad address");

    let gov_contract =
        makerpollcreate::makerpollcreate::makerpollcreate::new(address, ctx.rpc.clone());

    let events = gov_contract
        .poll_withdrawn_filter()
        .from_block(from_block)
        .to_block(to_block);

    let withdrawn_proposals: Vec<PollWithdrawnFilter> = events.query().await?;

    for withdrawn_proposal in withdrawn_proposals {
        let proposal = ctx
            .db
            .proposal()
            .find_first(vec![
                proposal::externalid::equals(withdrawn_proposal.poll_id.to_string()),
                proposal::daohandlerid::equals(dao_handler.clone().id),
            ])
            .exec()
            .await?;

        if let Some(existing_proposal) = proposal {
            ctx.db
                .proposal()
                .update(
                    proposal::id::equals(existing_proposal.clone().id.to_string()),
                    vec![proposal::visible::set(false)],
                )
                .exec()
                .await?;
        }
    }

    Ok(())
}
