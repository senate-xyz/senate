use std::{cmp, env, ops::Div, sync::Arc};

use crate::{
    handlers::votes::{
        aave::aave_votes, compound::compound_votes, dydx::dydx_votes, ens::ens_votes,
        gitcoin::gitcoin_votes, hop::hop_votes, maker_executive::makerexecutive_votes,
        maker_poll::makerpoll_votes, maker_poll_arbitrum::makerpollarbitrum_votes,
        uniswap::uniswap_votes,
    },
    prisma::{dao, daohandler, proposal, vote, voter, voterhandler, DaoHandlerType},
    Ctx, VotesRequest, VotesResponse,
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

voterhandler::include!(voterhandler_with_voter { voter });

#[instrument(skip(ctx), ret, level = "info")]
#[post("/chain_votes", data = "<data>")]
pub async fn update_chain_votes<'a>(
    ctx: &Ctx,
    data: Json<VotesRequest<'a>>,
) -> Json<Vec<VotesResponse>> {
    event!(Level::DEBUG, "{:?}", data);
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
        .include(voterhandler_with_voter::include())
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

    let mut current_block = ctx
        .rpc
        .get_block_number()
        .instrument(debug_span!("get_current_block"))
        .await
        .unwrap_or(U64::from(0))
        .as_u64() as i64;

    let batch_size = (data.refreshspeed).div(voters.len() as i64);

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

    if dao_handler.r#type == DaoHandlerType::MakerPollArbitrum {
        let rpc_url = env::var("ARBITRUM_NODE_URL").expect("$ARBITRUM_NODE_URL is not set");
        let provider = Provider::<Http>::try_from(rpc_url).unwrap();
        let rpc = Arc::new(provider);

        from_block = cmp::max(oldest_vote_block, 0);

        current_block = rpc
            .get_block_number()
            .instrument(debug_span!("get_current_block"))
            .await
            .unwrap_or(U64::from(0))
            .as_u64() as i64;

        let to_block = if current_block - from_block > batch_size {
            from_block + batch_size
        } else {
            current_block
        };

        if from_block > to_block {
            from_block = to_block;
        }
    }

    event!(
        Level::DEBUG,
        "{:?} {:?} {:?} {:?}",
        dao_handler,
        batch_size,
        from_block,
        to_block
    );

    let result = get_results(
        ctx,
        &dao_handler,
        from_block,
        to_block,
        voters.clone(),
        voter_handlers,
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

#[instrument(skip(ctx, voters, voter_handlers), level = "debug")]
async fn get_results(
    ctx: &Ctx,
    dao_handler: &daohandler::Data,
    from_block: i64,
    to_block: i64,
    voters: Vec<String>,
    voter_handlers: Vec<voterhandler_with_voter::Data>,
) -> Result<Vec<VoteResult>> {
    match dao_handler.r#type {
        DaoHandlerType::AaveChain => {
            let r = aave_votes(ctx, dao_handler, from_block, to_block, voters.clone()).await?;
            let ok_v = insert_votes(r, to_block, ctx, dao_handler, voter_handlers).await?;
            Ok(ok_v)
        }
        DaoHandlerType::CompoundChain => {
            let r = compound_votes(ctx, dao_handler, from_block, to_block, voters.clone()).await?;
            let ok_v = insert_votes(r, to_block, ctx, dao_handler, voter_handlers).await?;
            Ok(ok_v)
        }
        DaoHandlerType::UniswapChain => {
            let r = uniswap_votes(ctx, dao_handler, from_block, to_block, voters.clone()).await?;
            let ok_v = insert_votes(r, to_block, ctx, dao_handler, voter_handlers).await?;
            Ok(ok_v)
        }
        DaoHandlerType::EnsChain => {
            let r = ens_votes(ctx, dao_handler, from_block, to_block, voters.clone()).await?;
            let ok_v = insert_votes(r, to_block, ctx, dao_handler, voter_handlers).await?;
            Ok(ok_v)
        }
        DaoHandlerType::GitcoinChain => {
            let r = gitcoin_votes(ctx, dao_handler, from_block, to_block, voters.clone()).await?;
            let ok_v = insert_votes(r, to_block, ctx, dao_handler, voter_handlers).await?;
            Ok(ok_v)
        }
        DaoHandlerType::HopChain => {
            let r = hop_votes(ctx, dao_handler, from_block, to_block, voters.clone()).await?;
            let ok_v = insert_votes(r, to_block, ctx, dao_handler, voter_handlers).await?;
            Ok(ok_v)
        }
        DaoHandlerType::DydxChain => {
            let r = dydx_votes(ctx, dao_handler, from_block, to_block, voters.clone()).await?;
            let ok_v = insert_votes(r, to_block, ctx, dao_handler, voter_handlers).await?;
            Ok(ok_v)
        }
        DaoHandlerType::MakerExecutive => {
            let r = makerexecutive_votes(ctx, dao_handler, from_block, to_block, voters.clone())
                .await?;
            let ok_v = insert_votes(r, to_block, ctx, dao_handler, voter_handlers).await?;
            Ok(ok_v)
        }
        DaoHandlerType::MakerPoll => {
            let r = makerpoll_votes(ctx, dao_handler, from_block, to_block, voters.clone()).await?;
            let ok_v = insert_votes(r, to_block, ctx, dao_handler, voter_handlers).await?;
            Ok(ok_v)
        }
        DaoHandlerType::MakerPollArbitrum => {
            let r = makerpollarbitrum_votes(ctx, dao_handler, from_block, to_block, voters.clone())
                .await?;
            let ok_v = insert_votes(r, to_block, ctx, dao_handler, voter_handlers).await?;
            Ok(ok_v)
        }
        DaoHandlerType::Snapshot => bail!("not implemented"),
    }
}

#[instrument(skip(ctx, votes, voter_handlers), level = "debug")]
async fn insert_votes(
    votes: Vec<VoteResult>,
    to_block: i64,
    ctx: &Ctx,
    dao_handler: &daohandler::Data,
    voter_handlers: Vec<voterhandler_with_voter::Data>,
) -> Result<Vec<VoteResult>> {
    let successful_votes: Vec<Vote> = votes
        .iter()
        .filter(|v| v.success)
        .flat_map(|v| v.clone().votes)
        .collect();

    for vote in successful_votes {
        event!(Level::DEBUG, "{:?}", vote);

        let existing = ctx
            .db
            .vote()
            .find_unique(vote::voteraddress_daoid_proposalid(
                vote.voter_address.to_string(),
                dao_handler.daoid.clone(),
                vote.proposal_id.clone(),
            ))
            .exec()
            .await
            .unwrap();

        match existing {
            Some(existing) => {
                if existing.choice != vote.choice
                    || existing.votingpower != vote.voting_power
                    || existing.reason != vote.reason
                {
                    ctx.db
                        .vote()
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
                        .instrument(debug_span!("update_vote"))
                        .await
                        .unwrap();
                }
            }
            None => {
                ctx.db
                    .vote()
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
                    .instrument(debug_span!("create_vote"))
                    .await
                    .unwrap();
            }
        }
    }

    let daochainindex = dao_handler.chainindex.unwrap();

    let mut new_index = if daochainindex > to_block {
        to_block
    } else {
        daochainindex
    };

    let mut uptodate = false;

    if (daochainindex - new_index < 1000 && dao_handler.uptodate) {
        uptodate = true;
    }

    if dao_handler.r#type == DaoHandlerType::MakerPollArbitrum {
        uptodate = true;
        new_index = to_block;
    }

    event!(Level::DEBUG, "{:?} ", new_index);

    for voter_handler in voter_handlers {
        if new_index > voter_handler.chainindex.unwrap() || uptodate != voter_handler.uptodate {
            ctx.db
                .voterhandler()
                .update(
                    voterhandler::voterid_daohandlerid(
                        voter_handler.voterid,
                        dao_handler.clone().id,
                    ),
                    vec![
                        voterhandler::chainindex::set(new_index.into()),
                        voterhandler::uptodate::set(uptodate),
                    ],
                )
                .exec()
                .instrument(debug_span!("update_chainindex"))
                .await?;
        }
    }

    Ok(votes)
}
