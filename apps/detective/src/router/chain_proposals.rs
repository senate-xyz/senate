use anyhow::{bail, Result};
use ethers::{providers::Middleware, types::U64};
use opentelemetry::{
    global, propagation::TextMapPropagator, sdk::propagation::TraceContextPropagator,
};
use prisma_client_rust::chrono::{DateTime, FixedOffset, Utc};
use reqwest::header::HeaderMap;
use rocket::serde::json::Json;
use serde_json::Value;
use tracing::{debug_span, instrument, span, trace_span, Instrument, Level, Span};
use tracing_opentelemetry::OpenTelemetrySpanExt;

use crate::{
    handlers::proposals::{
        compound::compound_proposals, dydx::dydx_proposals, ens::ens_proposals,
        gitcoin::gitcoin_proposals, hop::hop_proposals, maker_executive::maker_executive_proposals,
        maker_poll::maker_poll_proposals, uniswap::uniswap_proposals,
    },
    prisma::{dao, daohandler, proposal, DaoHandlerType, ProposalState},
    Ctx, ProposalsRequest, ProposalsResponse,
};

use crate::handlers::proposals::aave::aave_proposals;

#[allow(dead_code)]
#[derive(Clone, Debug)]
pub struct ChainProposal {
    pub(crate) external_id: String,
    pub(crate) name: String,
    pub(crate) dao_id: String,
    pub(crate) dao_handler_id: String,
    pub(crate) time_start: DateTime<Utc>,
    pub(crate) time_end: DateTime<Utc>,
    pub(crate) time_created: DateTime<Utc>,
    pub(crate) block_created: i64,
    pub(crate) choices: Value,
    pub(crate) scores: Value,
    pub(crate) scores_total: Value,
    pub(crate) quorum: Value,
    pub(crate) url: String,
    pub(crate) state: ProposalState,
}

#[post("/chain_proposals", data = "<data>")]
pub async fn update_chain_proposals<'a>(
    ctx: &Ctx,
    data: Json<ProposalsRequest<'a>>,
) -> Json<ProposalsResponse<'a>> {
    let root_span = debug_span!("update_chain_proposals");

    let carrier: std::collections::HashMap<String, String> =
        serde_json::from_value(data.trace.clone()).unwrap_or_default();
    let propagator = opentelemetry::sdk::propagation::TraceContextPropagator::new();
    let parent_context = propagator.extract(&carrier);

    root_span.set_parent(parent_context.clone());

    async move {
        let dao_handler = ctx
            .db
            .daohandler()
            .find_first(vec![daohandler::id::equals(data.daoHandlerId.to_string())])
            .exec()
            .await
            .expect("bad prisma result")
            .expect("daoHandlerId not found");

        let min_block = dao_handler.chainindex;
        let batch_size = dao_handler.refreshspeed;

        let mut from_block = min_block.unwrap_or(0);

        let current_block = ctx
            .rpc
            .get_block_number()
            .await
            .unwrap_or(U64::from(from_block))
            .as_u64() as i64;

        let mut to_block = if current_block - from_block > batch_size {
            from_block + batch_size
        } else {
            current_block
        };

        if from_block > current_block - 10 {
            from_block = current_block - 10;
        }

        if to_block > current_block - 10 {
            to_block = current_block - 10;
        }

        debug!(
            "{:?} {:?} {:?} {:?} {:?} {:?}",
            dao_handler, min_block, batch_size, from_block, to_block, current_block
        );

        let result = get_results(ctx, from_block, to_block, dao_handler).await;

        match result {
            Ok(_) => Json(ProposalsResponse {
                daoHandlerId: data.daoHandlerId,
                response: "ok",
            }),
            Err(e) => {
                warn!("{:?}", e);
                Json(ProposalsResponse {
                    daoHandlerId: data.daoHandlerId,
                    response: "nok",
                })
            }
        }
    }
    .instrument(root_span)
    .await
}

#[instrument(skip(ctx))]
async fn get_results(
    ctx: &Ctx,
    from_block: i64,
    to_block: i64,
    dao_handler: daohandler::Data,
) -> Result<()> {
    match dao_handler.r#type {
        DaoHandlerType::AaveChain => {
            let p = aave_proposals(ctx, &dao_handler, &from_block, &to_block).await?;
            insert_proposals(p, to_block, ctx, dao_handler.clone()).await;
            Ok(())
        }
        DaoHandlerType::CompoundChain => {
            let p = compound_proposals(ctx, &dao_handler, &from_block, &to_block).await?;
            insert_proposals(p, to_block, ctx, dao_handler.clone()).await;
            Ok(())
        }
        DaoHandlerType::UniswapChain => {
            let p = uniswap_proposals(ctx, &dao_handler, &from_block, &to_block).await?;
            insert_proposals(p, to_block, ctx, dao_handler.clone()).await;
            Ok(())
        }
        DaoHandlerType::EnsChain => {
            let p = ens_proposals(ctx, &dao_handler, &from_block, &to_block).await?;
            insert_proposals(p, to_block, ctx, dao_handler.clone()).await;
            Ok(())
        }
        DaoHandlerType::GitcoinChain => {
            let p = gitcoin_proposals(ctx, &dao_handler, &from_block, &to_block).await?;
            insert_proposals(p, to_block, ctx, dao_handler.clone()).await;
            Ok(())
        }
        DaoHandlerType::HopChain => {
            let p = hop_proposals(ctx, &dao_handler, &from_block, &to_block).await?;
            insert_proposals(p, to_block, ctx, dao_handler.clone()).await;
            Ok(())
        }
        DaoHandlerType::DydxChain => {
            let p = dydx_proposals(ctx, &dao_handler, &from_block, &to_block).await?;
            insert_proposals(p, to_block, ctx, dao_handler.clone()).await;
            Ok(())
        }
        DaoHandlerType::MakerPoll => {
            let p = maker_poll_proposals(ctx, &dao_handler, &from_block, &to_block).await?;
            insert_proposals(p, to_block, ctx, dao_handler.clone()).await;
            Ok(())
        }
        DaoHandlerType::MakerExecutive => {
            let p = maker_executive_proposals(ctx, &dao_handler, &from_block, &to_block).await?;
            insert_proposals(p, to_block, ctx, dao_handler.clone()).await;
            Ok(())
        }
        DaoHandlerType::MakerPollArbitrum => bail!("not implemeneted"),
        DaoHandlerType::Snapshot => bail!("not implemeneted"),
    }
}

#[instrument(skip(ctx))]
async fn insert_proposals(
    proposals: Vec<ChainProposal>,
    to_block: i64,
    ctx: &Ctx,
    dao_handler: daohandler::Data,
) {
    let upserts = proposals.clone().into_iter().map(|p| {
        ctx.db.proposal().upsert(
            proposal::externalid_daoid(p.external_id.to_string(), dao_handler.daoid.to_string()),
            proposal::create(
                p.name.clone(),
                p.external_id.clone(),
                p.choices.clone(),
                p.scores.clone(),
                p.scores_total.clone(),
                p.quorum.clone(),
                p.state,
                p.time_created
                    .with_timezone(&FixedOffset::east_opt(0).unwrap()),
                p.time_start
                    .with_timezone(&FixedOffset::east_opt(0).unwrap()),
                p.time_end.with_timezone(&FixedOffset::east_opt(0).unwrap()),
                p.clone().url,
                daohandler::id::equals(dao_handler.id.to_string()),
                dao::id::equals(dao_handler.daoid.to_string()),
                vec![proposal::blockcreated::set(p.block_created.into())],
            ),
            {
                let mut update_v = Vec::new();

                if p.name != "Unknown" {
                    update_v.push(proposal::name::set(p.name.clone()));
                }

                update_v.push(proposal::choices::set(p.choices.clone()));
                update_v.push(proposal::scores::set(p.scores.clone()));
                update_v.push(proposal::scorestotal::set(p.clone().scores_total));
                update_v.push(proposal::quorum::set(p.quorum));
                update_v.push(proposal::state::set(p.state));
                update_v.push(proposal::timeend::set(
                    p.time_end.with_timezone(&FixedOffset::east_opt(0).unwrap()),
                ));

                update_v
            },
        )
    });

    let updated = ctx
        .db
        ._batch(upserts)
        .await
        .expect("failed to insert proposals");

    debug!("{:?}", updated);

    let open_proposals: Vec<ChainProposal> = proposals
        .iter()
        .filter(|p| {
            p.state == ProposalState::Pending
                || p.state == ProposalState::Active
                || p.state == ProposalState::Succeeded
                || p.state == ProposalState::Queued
        })
        .cloned()
        .collect();

    let new_index = if !open_proposals.is_empty() {
        open_proposals
            .iter()
            .map(|p| p.block_created)
            .min()
            .unwrap_or_default()
    } else {
        to_block
    };

    debug!("{:?} {:?}", open_proposals, new_index);

    let uptodate = dao_handler.chainindex.unwrap() - new_index < 1000;

    let updated = ctx
        .db
        .daohandler()
        .update(
            daohandler::id::equals(dao_handler.id.to_string()),
            vec![
                daohandler::chainindex::set(new_index.into()),
                daohandler::uptodate::set(uptodate),
            ],
        )
        .exec()
        .await
        .expect("failed to update daohandlers");

    debug!("{:?}", updated);
}
