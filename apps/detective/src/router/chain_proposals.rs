use anyhow::{bail, Result};
use ethers::{providers::Middleware, types::U64};
use prisma_client_rust::chrono::{DateTime, FixedOffset, Utc};
use reqwest::header::HeaderMap;
use rocket::serde::json::Json;
use serde_json::Value;
use tracing::{
    debug_span, event, info_span, instrument, span, trace_span, Instrument, Level, Span,
};

use crate::{
    handlers::proposals::{
        aave::aave_proposals, compound::compound_proposals, dydx::dydx_proposals,
        ens::ens_proposals, gitcoin::gitcoin_proposals, hop::hop_proposals,
        interest_protocol::interest_protocol_proposals, maker_executive::maker_executive_proposals,
        maker_poll::maker_poll_proposals, uniswap::uniswap_proposals,
        zeroxtreasury::zeroxtreasury_proposals,
    },
    prisma::{dao, daohandler, proposal, DaoHandlerType, ProposalState},
    Ctx, ProposalsRequest, ProposalsResponse,
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
    let dao_handler = ctx
        .db
        .daohandler()
        .find_first(vec![daohandler::id::equals(data.daoHandlerId.to_string())])
        .exec()
        .await
        .expect("bad prisma result")
        .expect("daoHandlerId not found");

    let min_block = dao_handler.chainindex;
    let batch_size = data.refreshspeed;

    let mut from_block = min_block;

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

    let result = get_results(ctx, from_block, to_block, dao_handler).await;

    match result {
        Ok(_) => Json(ProposalsResponse {
            daoHandlerId: data.daoHandlerId,
            success: true,
        }),
        Err(e) => {
            warn!("{:?}", e);
            Json(ProposalsResponse {
                daoHandlerId: data.daoHandlerId,
                success: false,
            })
        }
    }
}

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
        DaoHandlerType::InterestProtocolChain => {
            let p = interest_protocol_proposals(ctx, &dao_handler, &from_block, &to_block).await?;
            insert_proposals(p, to_block, ctx, dao_handler.clone()).await;
            Ok(())
        }
        DaoHandlerType::ZeroxProtocolChain => {
            let p = zeroxtreasury_proposals(ctx, &dao_handler, &from_block, &to_block).await?;
            insert_proposals(p, to_block, ctx, dao_handler.clone()).await;
            Ok(())
        }
        DaoHandlerType::MakerPollArbitrum => bail!("not implemeneted"),
        DaoHandlerType::Snapshot => bail!("not implemeneted"),
    }
}

async fn insert_proposals(
    proposals: Vec<ChainProposal>,
    to_block: i64,
    ctx: &Ctx,
    dao_handler: daohandler::Data,
) {
    for proposal in proposals.clone() {
        let existing = ctx
            .db
            .proposal()
            .find_first(vec![
                proposal::externalid::equals(proposal.external_id.clone()),
                proposal::daohandlerid::equals(dao_handler.id.clone()),
            ])
            .exec()
            .await
            .unwrap();

        match existing {
            Some(existing) => {
                if proposal.state != existing.state
                    || proposal.scores_total != existing.scorestotal
                    || proposal.url != existing.url
                {
                    ctx.db
                        .proposal()
                        .update_many(
                            vec![
                                proposal::externalid::equals(proposal.external_id.clone()),
                                proposal::daohandlerid::equals(dao_handler.id.clone()),
                            ],
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
                        .await
                        .unwrap();
                }
            }
            None => {
                ctx.db
                    .proposal()
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
                    .await
                    .unwrap();
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

    let new_index = if !open_proposals.is_empty() {
        open_proposals
            .iter()
            .map(|p| p.block_created)
            .min()
            .unwrap_or_default()
    } else {
        to_block
    };

    let uptodate = dao_handler.chainindex - new_index < 1000;

    if (new_index > dao_handler.chainindex && new_index - dao_handler.chainindex > 1000)
        || uptodate != dao_handler.uptodate
    {
        ctx.db
            .daohandler()
            .update(
                daohandler::id::equals(dao_handler.id.to_string()),
                vec![
                    daohandler::chainindex::set(new_index),
                    daohandler::uptodate::set(uptodate),
                ],
            )
            .exec()
            .await
            .expect("failed to update daohandlers");
    }
}
