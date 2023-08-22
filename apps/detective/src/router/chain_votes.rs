use std::{cmp, env, ops::Div, sync::Arc};

use crate::{
    daohandler_with_dao,
    handlers::votes::{
        aave::aave_votes, arbitrum_core::arbitrum_core_votes,
        arbitrum_treasury::arbitrum_treasury_votes, compound::compound_votes, dydx::dydx_votes,
        ens::ens_votes, gitcoin::gitcoin_votes, hop::hop_votes,
        interest_protocol::interest_protocol_votes, maker_executive::makerexecutive_votes,
        maker_poll::makerpoll_votes, maker_poll_arbitrum::makerpollarbitrum_votes,
        optimism::optimism_votes, uniswap::uniswap_votes, zeroxtreasury::zeroxtreasury_votes,
    },
    prisma::{dao, daohandler, proposal, vote, voter, voterhandler, DaoHandlerType, PrismaClient},
    voterhandler_with_voter, Ctx, VotesRequest, VotesResponse,
};
use anyhow::{bail, Context, Result};
use ethers::{
    providers::{Http, Middleware, Provider},
    types::U64,
};
use prisma_client_rust::Direction;
use rocket::serde::json::Json;
use serde::Deserialize;
use serde_json::Value;
use tracing::{
    debug_span, event, info_span, instrument, span, trace_span, Instrument, Level, Span,
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
    let my_span = info_span!(
        "update_chain_votes",
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

        let voter_handlers = ctx
            .db
            .voterhandler()
            .find_many(vec![
                voterhandler::voter::is(vec![voter::address::in_vec(data.voters.clone())]),
                voterhandler::daohandler::is(vec![daohandler::id::equals(
                    data.daoHandlerId.to_string(),
                )]),
            ])
            .include(voterhandler_with_voter::include())
            .exec()
            .await
            .expect("bad prisma result");

        let voters = data.voters.clone();

        let vh_index = voter_handlers
            .iter()
            .map(|vh| vh.chainindex)
            .min()
            .unwrap_or(0);

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
            .unwrap_or(U64::from(0))
            .as_u64() as i64;

        let batch_size = (data.refreshspeed).div(voters.len() as i64);

        let mut from_block = cmp::min(vh_index, dao_handler.chainindex);

        let to_block = if current_block - from_block > batch_size {
            from_block + batch_size
        } else {
            current_block
        };

        if from_block > to_block {
            from_block = to_block - 10;
        }

        event!(
            Level::INFO,
            dao_name = dao_handler.dao.name,
            dao_handler_type = dao_handler.r#type.to_string(),
            dao_handler_id = dao_handler.id,
            vh_index = vh_index,
            batch_size = batch_size,
            from_block = from_block,
            to_block = to_block,
            current_block = current_block,
            "refresh interval"
        );

        let result = get_results(
            &ctx.db,
            rpc,
            &dao_handler,
            from_block,
            to_block,
            voters.clone(),
            voter_handlers,
            current_block,
        )
        .await;

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
                event!(Level::WARN, err = e.to_string(), "refresh error");
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
    .instrument(my_span)
    .await
}

#[instrument(skip_all)]
async fn get_results(
    db: &Arc<PrismaClient>,
    rpc: &Arc<Provider<Http>>,
    dao_handler: &daohandler_with_dao::Data,
    from_block: i64,
    to_block: i64,
    voters: Vec<String>,
    voter_handlers: Vec<voterhandler_with_voter::Data>,
    current_block: i64,
) -> Result<Vec<VoteResult>> {
    match dao_handler.r#type {
        DaoHandlerType::AaveChain => {
            let r = aave_votes(db, rpc, dao_handler, from_block, to_block, voters.clone()).await?;
            let ok_v =
                insert_votes(r, to_block, db, dao_handler, voter_handlers, current_block).await?;
            Ok(ok_v)
        }
        DaoHandlerType::CompoundChain => {
            let r =
                compound_votes(db, rpc, dao_handler, from_block, to_block, voters.clone()).await?;
            let ok_v =
                insert_votes(r, to_block, db, dao_handler, voter_handlers, current_block).await?;
            Ok(ok_v)
        }
        DaoHandlerType::UniswapChain => {
            let r =
                uniswap_votes(db, rpc, dao_handler, from_block, to_block, voters.clone()).await?;
            let ok_v =
                insert_votes(r, to_block, db, dao_handler, voter_handlers, current_block).await?;
            Ok(ok_v)
        }
        DaoHandlerType::EnsChain => {
            let r = ens_votes(db, rpc, dao_handler, from_block, to_block, voters.clone()).await?;
            let ok_v =
                insert_votes(r, to_block, db, dao_handler, voter_handlers, current_block).await?;
            Ok(ok_v)
        }
        DaoHandlerType::GitcoinChain => {
            let r =
                gitcoin_votes(db, rpc, dao_handler, from_block, to_block, voters.clone()).await?;
            let ok_v =
                insert_votes(r, to_block, db, dao_handler, voter_handlers, current_block).await?;
            Ok(ok_v)
        }
        DaoHandlerType::HopChain => {
            let r = hop_votes(db, rpc, dao_handler, from_block, to_block, voters.clone()).await?;
            let ok_v =
                insert_votes(r, to_block, db, dao_handler, voter_handlers, current_block).await?;
            Ok(ok_v)
        }
        DaoHandlerType::DydxChain => {
            let r = dydx_votes(db, rpc, dao_handler, from_block, to_block, voters.clone()).await?;
            let ok_v =
                insert_votes(r, to_block, db, dao_handler, voter_handlers, current_block).await?;
            Ok(ok_v)
        }
        DaoHandlerType::MakerExecutive => {
            let r =
                makerexecutive_votes(db, rpc, dao_handler, from_block, to_block, voters.clone())
                    .await?;
            let ok_v =
                insert_votes(r, to_block, db, dao_handler, voter_handlers, current_block).await?;
            Ok(ok_v)
        }
        DaoHandlerType::MakerPoll => {
            let r =
                makerpoll_votes(db, rpc, dao_handler, from_block, to_block, voters.clone()).await?;
            let ok_v =
                insert_votes(r, to_block, db, dao_handler, voter_handlers, current_block).await?;
            Ok(ok_v)
        }
        DaoHandlerType::MakerPollArbitrum => {
            let r =
                makerpollarbitrum_votes(db, rpc, dao_handler, from_block, to_block, voters.clone())
                    .await?;
            let ok_v =
                insert_votes(r, to_block, db, dao_handler, voter_handlers, current_block).await?;
            Ok(ok_v)
        }
        DaoHandlerType::InterestProtocolChain => {
            let r =
                interest_protocol_votes(db, rpc, dao_handler, from_block, to_block, voters.clone())
                    .await?;
            let ok_v =
                insert_votes(r, to_block, db, dao_handler, voter_handlers, current_block).await?;
            Ok(ok_v)
        }
        DaoHandlerType::ZeroxProtocolChain => {
            let r = zeroxtreasury_votes(db, rpc, dao_handler, from_block, to_block, voters.clone())
                .await?;
            let ok_v =
                insert_votes(r, to_block, db, dao_handler, voter_handlers, current_block).await?;
            Ok(ok_v)
        }
        DaoHandlerType::OptimismChain => {
            let r =
                optimism_votes(db, rpc, dao_handler, from_block, to_block, voters.clone()).await?;
            let ok_v =
                insert_votes(r, to_block, db, dao_handler, voter_handlers, current_block).await?;
            Ok(ok_v)
        }
        DaoHandlerType::ArbitrumCoreChain => {
            let r = arbitrum_core_votes(db, rpc, dao_handler, from_block, to_block, voters.clone())
                .await?;
            let ok_v =
                insert_votes(r, to_block, db, dao_handler, voter_handlers, current_block).await?;
            Ok(ok_v)
        }
        DaoHandlerType::ArbitrumTreasuryChain => {
            let r =
                arbitrum_treasury_votes(db, rpc, dao_handler, from_block, to_block, voters.clone())
                    .await?;
            let ok_v =
                insert_votes(r, to_block, db, dao_handler, voter_handlers, current_block).await?;
            Ok(ok_v)
        }
        DaoHandlerType::Snapshot => bail!("not implemented"),
    }
}

#[instrument(skip_all)]
async fn insert_votes(
    votes: Vec<VoteResult>,
    to_block: i64,
    db: &Arc<PrismaClient>,
    dao_handler: &daohandler_with_dao::Data,
    voter_handlers: Vec<voterhandler_with_voter::Data>,
    current_block: i64,
) -> Result<Vec<VoteResult>> {
    let successful_votes: Vec<Vote> = votes
        .iter()
        .filter(|v| v.success)
        .flat_map(|v| v.clone().votes)
        .collect();

    for vote in successful_votes {
        let existing = db
            .vote()
            .find_unique(vote::voteraddress_daoid_proposalid(
                vote.voter_address.to_string(),
                dao_handler.daoid.clone(),
                vote.proposal_id.clone(),
            ))
            .exec()
            .await?;

        match existing {
            Some(existing) => {
                if existing.choice != vote.choice
                    || existing.votingpower.as_f64().unwrap().floor()
                        != vote.voting_power.as_f64().unwrap().floor()
                    || existing.reason != vote.reason
                {
                    event!(
                        Level::INFO,
                        voter_address = existing.voteraddress,
                        proposal_id = existing.proposalid,
                        dao_name = dao_handler.dao.name,
                        dao_handler_type = dao_handler.r#type.to_string(),
                        dao_handler_id = dao_handler.id,
                        "update vote"
                    );

                    db.vote()
                        .update(
                            vote::voteraddress_daoid_proposalid(
                                vote.voter_address.to_string(),
                                dao_handler.daoid.to_string(),
                                vote.proposal_id.clone(),
                            ),
                            vec![
                                vote::choice::set(vote.choice.clone()),
                                vote::votingpower::set(vote.voting_power.clone()),
                                vote::reason::set(vote.reason),
                            ],
                        )
                        .exec()
                        .await?;
                }
            }
            None => {
                event!(
                    Level::INFO,
                    voter_address = vote.voter_address,
                    proposal_id = vote.proposal_id,
                    dao_name = dao_handler.dao.name,
                    dao_handler_type = dao_handler.r#type.to_string(),
                    dao_handler_id = dao_handler.id,
                    "insert vote"
                );

                db.vote()
                    .create(
                        vote.choice.clone(),
                        vote.voting_power.clone(),
                        vote.reason.clone(),
                        voter::address::equals(vote.voter_address.clone()),
                        proposal::id::equals(vote.proposal_id.clone()),
                        dao::id::equals(dao_handler.daoid.clone()),
                        daohandler::id::equals(dao_handler.id.clone()),
                        vec![],
                    )
                    .exec()
                    .await?;
            }
        }
    }

    let daochainindex = dao_handler.chainindex;

    let mut new_index = if daochainindex > to_block {
        to_block
    } else {
        daochainindex
    };

    if dao_handler.r#type == DaoHandlerType::MakerPollArbitrum {
        new_index = to_block;
    }

    let uptodate = current_block - new_index < 1000;

    event!(
        Level::INFO,
        dao_name = dao_handler.dao.name,
        dao_handler_type = dao_handler.r#type.to_string(),
        dao_handler_id = dao_handler.id,
        new_index = new_index,
        uptodate = uptodate,
        "new index"
    );

    for voter_handler in voter_handlers {
        if (new_index > voter_handler.chainindex && new_index - voter_handler.chainindex > 1000)
            || uptodate != voter_handler.uptodate
        {
            event!(
                Level::INFO,
                dao_name = dao_handler.dao.name,
                dao_handler_type = dao_handler.r#type.to_string(),
                new_index = new_index,
                voter_handler_id = voter_handler.id,
                dao_handler_id = dao_handler.id,
                "set new index"
            );

            db.voterhandler()
                .update(
                    voterhandler::voterid_daohandlerid(
                        voter_handler.voterid,
                        dao_handler.clone().id,
                    ),
                    vec![
                        voterhandler::chainindex::set(new_index),
                        voterhandler::uptodate::set(uptodate),
                    ],
                )
                .exec()
                .await?;
        }
    }

    Ok(votes)
}
