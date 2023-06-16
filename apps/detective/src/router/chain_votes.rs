use anyhow::{bail, Context, Result};
use opentelemetry::propagation::TextMapPropagator;
use std::{cmp, ops::Div};
use tracing::{debug_span, info_span, instrument, span, trace_span, Instrument, Level, Span};
use tracing_opentelemetry::OpenTelemetrySpanExt;

use ethers::{providers::Middleware, types::U64};
use prisma_client_rust::Direction;
use rocket::serde::json::Json;
use serde::Deserialize;
use serde_json::Value;

use crate::{
    handlers::votes::{
        aave::aave_votes,
        compound::compound_votes,
        dydx::dydx_votes,
        ens::ens_votes,
        gitcoin::gitcoin_votes,
        hop::hop_votes,
        maker_executive::makerexecutive_votes,
        maker_poll::makerpoll_votes,
        maker_poll_arbitrum::makerpollarbitrum_votes,
        uniswap::uniswap_votes,
    },
    prisma::{dao, daohandler, proposal, vote, voter, voterhandler, DaoHandlerType},
    Ctx,
    VotesRequest,
    VotesResponse,
};

#[derive(Debug, Deserialize, Clone)]
pub struct Vote {
    pub block_created: i64,
    pub voter_address: String,
    pub dao_id: String,
    pub proposal_id: String,
    pub dao_handler_id: String,
    pub choice: Value,
    pub reason: String,
    pub voting_power: Value,
    pub proposal_active: bool,
}

#[derive(Debug, Deserialize, Clone)]
pub struct VoteResult {
    pub voter_address: String,
    pub success: bool,
    pub votes: Vec<Vote>,
}

#[post("/chain_votes", data = "<data>")]
pub async fn update_chain_votes<'a>(
    ctx: &Ctx,
    data: Json<VotesRequest<'a>>,
) -> Json<Vec<VotesResponse>> {
    let root_span = info_span!("update_chain_votes");

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
            .instrument(debug_span!("get_dao_handler"))
            .await
            .expect("bad prisma result")
            .expect("daoHandlerId not found");

        let first_proposal = ctx
            .db
            .proposal()
            .find_many(vec![proposal::daohandlerid::equals(
                dao_handler.id.to_string(),
            )])
            .order_by(proposal::blockcreated::order(Direction::Asc))
            .take(1)
            .exec()
            .instrument(debug_span!("get_first_proposal"))
            .await
            .expect("bad prisma result");

        let first_proposal_block = match first_proposal.first() {
            Some(s) => s.blockcreated.unwrap_or(0),
            None => 0,
        };

        let voter_handlers = ctx
            .db
            .voterhandler()
            .find_many(vec![
                voterhandler::voter::is(vec![voter::address::in_vec(data.voters.clone())]),
                voterhandler::daohandler::is(vec![daohandler::id::equals(
                    data.daoHandlerId.to_string(),
                )]),
            ])
            .exec()
            .instrument(debug_span!("get_voter_handlers"))
            .await
            .expect("bad prisma result");

        let voters = data.voters.clone();

        let oldest_vote_block = voter_handlers
            .iter()
            .map(|vh| vh.chainindex)
            .min()
            .unwrap_or_default()
            .unwrap_or(0);

        let current_block = ctx
            .rpc
            .get_block_number()
            .instrument(debug_span!("get_current_block"))
            .await
            .unwrap_or(U64::from(0))
            .as_u64() as i64;

        let batch_size = (dao_handler.votersrefreshspeed).div(voters.len() as i64);

        let mut from_block = cmp::max(oldest_vote_block, 0);

        if from_block < first_proposal_block {
            from_block = first_proposal_block;
        }

        let to_block = if current_block - from_block > batch_size {
            from_block + batch_size
        } else {
            current_block
        };

        if from_block > to_block {
            from_block = to_block;
        }

        debug!(
            "{:?} {:?} {:?} {:?} {:?}",
            dao_handler, batch_size, from_block, to_block, voters
        );

        let result = get_results(ctx, &dao_handler, &from_block, &to_block, voters.clone()).await;

        match result {
            Ok(r) => Json(
                r.into_iter()
                    .map(|v| VotesResponse {
                        voter_address: v.voter_address,
                        success: v.success,
                    })
                    .collect(),
            ),
            Err(e) => {
                warn!("{:?}", e);
                Json(
                    voters
                        .into_iter()
                        .map(|v| VotesResponse {
                            voter_address: v,
                            success: false,
                        })
                        .collect(),
                )
            }
        }
    }
    .instrument(root_span)
    .await
}

#[instrument(skip(ctx), level = "debug")]
async fn get_results(
    ctx: &Ctx,
    dao_handler: &daohandler::Data,
    from_block: &i64,
    to_block: &i64,
    voters: Vec<String>,
) -> Result<Vec<VoteResult>> {
    match dao_handler.r#type {
        DaoHandlerType::AaveChain => {
            let r = aave_votes(ctx, dao_handler, from_block, to_block, voters.clone()).await?;
            let ok_v = insert_votes(&r, to_block, ctx, dao_handler).await?;
            Ok(ok_v)
        }
        DaoHandlerType::CompoundChain => {
            let r = compound_votes(ctx, dao_handler, from_block, to_block, voters.clone()).await?;
            let ok_v = insert_votes(&r, to_block, ctx, dao_handler).await?;
            Ok(ok_v)
        }
        DaoHandlerType::UniswapChain => {
            let r = uniswap_votes(ctx, dao_handler, from_block, to_block, voters.clone()).await?;
            let ok_v = insert_votes(&r, to_block, ctx, dao_handler).await?;
            Ok(ok_v)
        }
        DaoHandlerType::EnsChain => {
            let r = ens_votes(ctx, dao_handler, from_block, to_block, voters.clone()).await?;
            let ok_v = insert_votes(&r, to_block, ctx, dao_handler).await?;
            Ok(ok_v)
        }
        DaoHandlerType::GitcoinChain => {
            let r = gitcoin_votes(ctx, dao_handler, from_block, to_block, voters.clone()).await?;
            let ok_v = insert_votes(&r, to_block, ctx, dao_handler).await?;
            Ok(ok_v)
        }
        DaoHandlerType::HopChain => {
            let r = hop_votes(ctx, dao_handler, from_block, to_block, voters.clone()).await?;
            let ok_v = insert_votes(&r, to_block, ctx, dao_handler).await?;
            Ok(ok_v)
        }
        DaoHandlerType::DydxChain => {
            let r = dydx_votes(ctx, dao_handler, from_block, to_block, voters.clone()).await?;
            let ok_v = insert_votes(&r, to_block, ctx, dao_handler).await?;
            Ok(ok_v)
        }
        DaoHandlerType::MakerExecutive => {
            let r = makerexecutive_votes(ctx, dao_handler, from_block, to_block, voters.clone())
                .await?;
            let ok_v = insert_votes(&r, to_block, ctx, dao_handler).await?;
            Ok(ok_v)
        }
        DaoHandlerType::MakerPoll => {
            let r = makerpoll_votes(ctx, dao_handler, from_block, to_block, voters.clone()).await?;
            let ok_v = insert_votes(&r, to_block, ctx, dao_handler).await?;
            Ok(ok_v)
        }
        DaoHandlerType::MakerPollArbitrum => {
            let r = makerpollarbitrum_votes(ctx, dao_handler, from_block, voters.clone()).await?;
            let ok_v = insert_votes(&r, to_block, ctx, dao_handler).await?;
            Ok(ok_v)
        }
        DaoHandlerType::Snapshot => bail!("not implemented"),
    }
}

#[instrument(skip(ctx), level = "debug")]
async fn insert_votes(
    votes: &[VoteResult],
    to_block: &i64,
    ctx: &Ctx,
    dao_handler: &daohandler::Data,
) -> Result<Vec<VoteResult>> {
    let successful_voters: Vec<VoteResult> = votes.iter().cloned().filter(|v| v.success).collect();

    let successful_votes: Vec<Vote> = votes
        .iter()
        .filter(|v| v.success)
        .flat_map(|v| v.clone().votes)
        .collect();

    let closed_votes: Vec<Vote> = successful_votes
        .clone()
        .into_iter()
        .filter(|v| !v.proposal_active)
        .collect();

    let open_votes: Vec<Vote> = successful_votes
        .clone()
        .into_iter()
        .filter(|v| v.proposal_active)
        .collect();

    debug!(
        "{:?} {:?} {:?} ",
        successful_votes, closed_votes, open_votes,
    );

    for closed_vote in closed_votes {
        let exists = ctx
            .db
            .vote()
            .find_unique(vote::voteraddress_daoid_proposalid(
                closed_vote.voter_address.to_string(),
                dao_handler.daoid.clone(),
                closed_vote.proposal_id.clone(),
            ))
            .exec()
            .await
            .unwrap();

        match exists {
            Some(_) => {}
            None => {
                ctx.db
                    .vote()
                    .create_unchecked(
                        closed_vote.choice.clone(),
                        closed_vote.voting_power.clone(),
                        closed_vote.reason.clone(),
                        closed_vote.voter_address.to_string(),
                        closed_vote.proposal_id.clone(),
                        dao_handler.daoid.clone(),
                        dao_handler.id.clone(),
                        vec![vote::blockcreated::set(closed_vote.block_created.into())],
                    )
                    .exec()
                    .await
                    .unwrap();
            }
        }
    }

    for open_vote in open_votes {
        let existing = ctx
            .db
            .vote()
            .find_unique(vote::voteraddress_daoid_proposalid(
                open_vote.voter_address.to_string(),
                dao_handler.daoid.clone(),
                open_vote.proposal_id.clone(),
            ))
            .exec()
            .await
            .unwrap();

        match existing {
            Some(existing) => {
                if existing.choice != open_vote.choice
                    || existing.votingpower != open_vote.voting_power
                    || existing.reason != open_vote.reason
                {
                    ctx.db
                        .vote()
                        .update(
                            vote::voteraddress_daoid_proposalid(
                                open_vote.voter_address.to_string(),
                                dao_handler.daoid.to_string(),
                                open_vote.proposal_id.clone(),
                            ),
                            vec![
                                vote::choice::set(open_vote.choice.clone()),
                                vote::votingpower::set(open_vote.voting_power.clone()),
                                vote::reason::set(open_vote.reason),
                            ],
                        )
                        .exec()
                        .await
                        .unwrap();
                }
            }
            None => {
                ctx.db
                    .vote()
                    .create(
                        open_vote.choice.clone(),
                        open_vote.voting_power.clone(),
                        open_vote.reason.clone(),
                        voter::address::equals(open_vote.voter_address.clone()),
                        proposal::id::equals(open_vote.proposal_id.clone()),
                        dao::id::equals(dao_handler.daoid.clone()),
                        daohandler::id::equals(dao_handler.id.clone()),
                        vec![],
                    )
                    .exec()
                    .await
                    .unwrap();
            }
        }
    }

    let daochainindex = &dao_handler.chainindex.unwrap();

    use crate::prisma::DaoHandlerType::MakerPollArbitrum;

    let new_index = if dao_handler.r#type == MakerPollArbitrum || daochainindex > to_block {
        to_block
    } else {
        daochainindex
    };

    let mut uptodate = false;

    if (daochainindex - new_index < 1000 && dao_handler.uptodate)
        || dao_handler.r#type == MakerPollArbitrum
    {
        uptodate = true;
    }

    debug!("{:?} ", new_index);

    ctx.db
        .voterhandler()
        .update_many(
            vec![
                voterhandler::voter::is(vec![voter::address::in_vec(
                    successful_voters
                        .iter()
                        .map(|v| v.clone().voter_address)
                        .collect(),
                )]),
                voterhandler::daohandlerid::equals(dao_handler.id.clone()),
            ],
            vec![
                voterhandler::chainindex::set((*new_index).into()),
                voterhandler::uptodate::set(uptodate),
            ],
        )
        .exec()
        .instrument(debug_span!("update_chainindex"))
        .await
        .context("failed to update voterhandlers")?;

    Ok(votes.to_owned())
}
