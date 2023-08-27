use std::sync::Arc;

use anyhow::{bail, Result};
use ethers::{
    prelude::k256::elliptic_curve::PrimeField,
    providers::{Http, Middleware, Provider},
    types::U64,
};
use prisma_client_rust::chrono::{DateTime, FixedOffset, Utc};
use reqwest::header::HeaderMap;
use rocket::serde::json::Json;
use serde_json::Value;
use tracing::{
    debug_span,
    event,
    info_span,
    instrument,
    span,
    trace_span,
    Instrument,
    Level,
    Span,
};

use crate::{
    daohandler_with_dao,
    handlers::proposals::{
        aave::aave_proposals,
        arbitrum_core::{self, arbitrum_core_proposals},
        arbitrum_treasury::arbitrum_treasury_proposals,
        compound::compound_proposals,
        dydx::dydx_proposals,
        ens::ens_proposals,
        gitcoin::gitcoin_proposals,
        hop::hop_proposals,
        interest_protocol::interest_protocol_proposals,
        maker_executive::maker_executive_proposals,
        maker_poll::maker_poll_proposals,
        optimism::optimism_proposals,
        uniswap::uniswap_proposals,
        zeroxtreasury::zeroxtreasury_proposals,
    },
    prisma::{dao, daohandler, proposal, DaoHandlerType, PrismaClient, ProposalState},
    Ctx,
    ProposalsRequest,
    ProposalsResponse,
};

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
    let my_span = info_span!(
        "update_chain_proposals",
        dao_handler_id = data.daoHandlerId,
        refreshspeed = data.refreshspeed
    );

    async move {
        let dao_handler = ctx
            .db
            .daohandler()
            .find_first(vec![daohandler::id::equals(data.daoHandlerId.to_string())])
            .include(daohandler_with_dao::include())
            .exec()
            .await
            .expect("bad prisma result")
            .expect("daoHandlerId not found");

        let min_block = dao_handler.chainindex;
        let batch_size = data.refreshspeed;

        let mut from_block = min_block;

        let rpc = if dao_handler.r#type == DaoHandlerType::MakerPollArbitrum
            || dao_handler.r#type == DaoHandlerType::ArbitrumCoreChain
            || dao_handler.r#type == DaoHandlerType::ArbitrumTreasuryChain
        {
            &ctx.arbitrum_rpc
        } else if dao_handler.r#type == DaoHandlerType::OptimismChain {
            &ctx.optimism_rpc
        } else {
            &ctx.eth_rpc
        };

        let current_block = rpc
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

        event!(
            Level::INFO,
            dao_name = dao_handler.dao.name,
            dao_handler_type = dao_handler.r#type.to_string(),
            dao_handler_id = dao_handler.id,
            min_block = min_block,
            batch_size = batch_size,
            from_block = from_block,
            to_block = to_block,
            current_block = current_block,
            "refresh interval"
        );

        let result = get_results(
            &ctx.db,
            rpc,
            from_block,
            to_block,
            dao_handler,
            current_block,
        )
        .await;

        match result {
            Ok(_) => Json(ProposalsResponse {
                daoHandlerId: data.daoHandlerId,
                success: true,
            }),
            Err(e) => {
                event!(Level::WARN, err = e.to_string(), "refresh error");
                Json(ProposalsResponse {
                    daoHandlerId: data.daoHandlerId,
                    success: false,
                })
            }
        }
    }
    .instrument(my_span)
    .await
}

#[instrument(skip_all)]
async fn get_results(
    db: &Arc<PrismaClient>,
    rpc: &Arc<Provider<Http>>,
    from_block: i64,
    to_block: i64,
    dao_handler: daohandler_with_dao::Data,
    current_block: i64,
) -> Result<()> {
    match dao_handler.r#type {
        DaoHandlerType::AaveChain => {
            let p = aave_proposals(rpc, &dao_handler, &from_block, &to_block).await?;
            let _ = insert_proposals(
                p,
                from_block,
                to_block,
                db,
                dao_handler.clone(),
                current_block,
            )
            .await;
            Ok(())
        }
        DaoHandlerType::CompoundChain => {
            let p = compound_proposals(rpc, &dao_handler, &from_block, &to_block).await?;
            let _ = insert_proposals(
                p,
                from_block,
                to_block,
                db,
                dao_handler.clone(),
                current_block,
            )
            .await;
            Ok(())
        }
        DaoHandlerType::UniswapChain => {
            let p = uniswap_proposals(rpc, &dao_handler, &from_block, &to_block).await?;
            let _ = insert_proposals(
                p,
                from_block,
                to_block,
                db,
                dao_handler.clone(),
                current_block,
            )
            .await;
            Ok(())
        }
        DaoHandlerType::EnsChain => {
            let p = ens_proposals(rpc, &dao_handler, &from_block, &to_block).await?;
            let _ = insert_proposals(
                p,
                from_block,
                to_block,
                db,
                dao_handler.clone(),
                current_block,
            )
            .await;
            Ok(())
        }
        DaoHandlerType::GitcoinChain => {
            let p = gitcoin_proposals(rpc, &dao_handler, &from_block, &to_block).await?;
            let _ = insert_proposals(
                p,
                from_block,
                to_block,
                db,
                dao_handler.clone(),
                current_block,
            )
            .await;
            Ok(())
        }
        DaoHandlerType::HopChain => {
            let p = hop_proposals(rpc, &dao_handler, &from_block, &to_block).await?;
            let _ = insert_proposals(
                p,
                from_block,
                to_block,
                db,
                dao_handler.clone(),
                current_block,
            )
            .await;
            Ok(())
        }
        DaoHandlerType::DydxChain => {
            let p = dydx_proposals(rpc, &dao_handler, &from_block, &to_block).await?;
            let _ = insert_proposals(
                p,
                from_block,
                to_block,
                db,
                dao_handler.clone(),
                current_block,
            )
            .await;
            Ok(())
        }
        DaoHandlerType::MakerPoll => {
            let p = maker_poll_proposals(rpc, &dao_handler, &from_block, &to_block).await?;
            let _ = insert_proposals(
                p,
                from_block,
                to_block,
                db,
                dao_handler.clone(),
                current_block,
            )
            .await;
            Ok(())
        }
        DaoHandlerType::MakerExecutive => {
            let p = maker_executive_proposals(rpc, &dao_handler, &from_block, &to_block).await?;
            let _ = insert_proposals(
                p,
                from_block,
                to_block,
                db,
                dao_handler.clone(),
                current_block,
            )
            .await;
            Ok(())
        }
        DaoHandlerType::InterestProtocolChain => {
            let p = interest_protocol_proposals(rpc, &dao_handler, &from_block, &to_block).await?;
            let _ = insert_proposals(
                p,
                from_block,
                to_block,
                db,
                dao_handler.clone(),
                current_block,
            )
            .await;
            Ok(())
        }
        DaoHandlerType::ZeroxProtocolChain => {
            let p = zeroxtreasury_proposals(rpc, &dao_handler, &from_block, &to_block).await?;
            let _ = insert_proposals(
                p,
                from_block,
                to_block,
                db,
                dao_handler.clone(),
                current_block,
            )
            .await;
            Ok(())
        }
        DaoHandlerType::OptimismChain => {
            let p = optimism_proposals(rpc, &dao_handler, &from_block, &to_block).await?;
            let _ = insert_proposals(
                p,
                from_block,
                to_block,
                db,
                dao_handler.clone(),
                current_block,
            )
            .await;
            Ok(())
        }
        DaoHandlerType::ArbitrumCoreChain => {
            let p = arbitrum_core_proposals(rpc, &dao_handler, &from_block, &to_block).await?;
            let _ = insert_proposals(
                p,
                from_block,
                to_block,
                db,
                dao_handler.clone(),
                current_block,
            )
            .await;
            Ok(())
        }
        DaoHandlerType::ArbitrumTreasuryChain => {
            let p = arbitrum_treasury_proposals(rpc, &dao_handler, &from_block, &to_block).await?;
            let _ = insert_proposals(
                p,
                from_block,
                to_block,
                db,
                dao_handler.clone(),
                current_block,
            )
            .await;
            Ok(())
        }
        DaoHandlerType::MakerPollArbitrum => bail!("not implemeneted"),
        DaoHandlerType::Snapshot => bail!("not implemeneted"),
    }
}

#[instrument(skip_all)]
async fn insert_proposals(
    proposals: Vec<ChainProposal>,
    from_block: i64,
    to_block: i64,
    db: &Arc<PrismaClient>,
    dao_handler: daohandler_with_dao::Data,
    current_block: i64,
) -> Result<()> {
    for proposal in proposals.clone() {
        let existing = db
            .proposal()
            .find_unique(proposal::externalid_daoid(
                proposal.external_id.to_string(),
                dao_handler.daoid.to_string(),
            ))
            .exec()
            .await?;

        match existing {
            Some(existing) => {
                if proposal.state != existing.state
                    || proposal.scores_total.as_f64().unwrap().floor()
                        != existing.scorestotal.as_f64().unwrap().floor()
                    || proposal.url != existing.url
                {
                    event!(
                        Level::INFO,
                        proposal_id = existing.id,
                        proposal_name = existing.name,
                        dao_name = dao_handler.dao.name,
                        dao_handler_type = dao_handler.r#type.to_string(),
                        dao_handler_id = dao_handler.id,
                        "update proposal"
                    );
                    db.proposal()
                        .update(
                            proposal::externalid_daoid(
                                proposal.external_id.to_string(),
                                dao_handler.daoid.to_string(),
                            ),
                            {
                                let mut update_v = Vec::new();

                                if proposal.name != "Unknown" {
                                    update_v.push(proposal::name::set(proposal.name.clone()));
                                }

                                update_v.push(proposal::url::set(proposal.url.clone()));
                                update_v.push(proposal::choices::set(proposal.choices.clone()));
                                update_v.push(proposal::scores::set(proposal.scores.clone()));
                                update_v.push(proposal::scorestotal::set(
                                    proposal.clone().scores_total,
                                ));
                                update_v.push(proposal::quorum::set(proposal.quorum));
                                update_v.push(proposal::state::set(proposal.state));
                                update_v.push(proposal::timeend::set(
                                    proposal
                                        .time_end
                                        .with_timezone(&FixedOffset::east_opt(0).unwrap()),
                                ));

                                update_v
                            },
                        )
                        .exec()
                        .await?;
                }
            }
            None => {
                event!(
                    Level::INFO,
                    proposal_external_id = proposal.external_id,
                    proposal_name = proposal.name,
                    dao_name = dao_handler.dao.name,
                    dao_handler_type = dao_handler.r#type.to_string(),
                    dao_handler_id = dao_handler.id,
                    "insert proposal"
                );

                db.proposal()
                    .create_unchecked(
                        proposal.name.clone(),
                        proposal.external_id.clone(),
                        proposal.choices.clone(),
                        proposal.scores.clone(),
                        proposal.scores_total.clone(),
                        proposal.quorum.clone(),
                        proposal.state,
                        proposal
                            .time_created
                            .with_timezone(&FixedOffset::east_opt(0).unwrap()),
                        proposal
                            .time_start
                            .with_timezone(&FixedOffset::east_opt(0).unwrap()),
                        proposal
                            .time_end
                            .with_timezone(&FixedOffset::east_opt(0).unwrap()),
                        proposal.clone().url,
                        dao_handler.id.to_string(),
                        dao_handler.daoid.to_string(),
                        vec![proposal::blockcreated::set(proposal.block_created.into())],
                    )
                    .exec()
                    .await?;
            }
        }
    }

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

    let mut new_index = if !open_proposals.is_empty() {
        open_proposals
            .iter()
            .map(|p| p.block_created)
            .max()
            .unwrap_or_default()
    } else {
        to_block
    };

    if new_index == from_block && new_index < to_block {
        new_index = to_block;
    }

    let uptodate = current_block - new_index < 1000;

    event!(
        Level::INFO,
        dao_name = dao_handler.dao.name,
        dao_handler_type = dao_handler.r#type.to_string(),
        dao_handler_id = dao_handler.id,
        new_index = new_index,
        to_block = to_block,
        uptodate = uptodate,
        "new index"
    );

    if (new_index > dao_handler.chainindex && new_index - dao_handler.chainindex > 100)
        || uptodate != dao_handler.uptodate
    {
        event!(
            Level::INFO,
            dao_name = dao_handler.dao.name,
            dao_handler_type = dao_handler.r#type.to_string(),
            new_index = new_index,
            dao_handler_id = dao_handler.id,
            "set new index"
        );
        db.daohandler()
            .update(
                daohandler::id::equals(dao_handler.id.to_string()),
                vec![
                    daohandler::chainindex::set(new_index),
                    daohandler::uptodate::set(uptodate),
                ],
            )
            .exec()
            .await?;
    }

    Ok(())
}
