use anyhow::{Context, Result};
use std::{cmp, ops::Div};

use ethers::{providers::Middleware, types::U64};
use prisma_client_rust::Direction;
use rocket::serde::json::Json;
use serde::Deserialize;
use serde_json::Value;

use crate::{
    handlers::votes::{
        aave::aave_votes, compound::compound_votes, dydx::dydx_votes, ens::ens_votes,
        gitcoin::gitcoin_votes, hop::hop_votes, uniswap::uniswap_votes,
    },
    prisma::{dao, daohandler, proposal, vote, voter, voterhandler, DaoHandlerType},
    Ctx, VotesRequest, VotesResponse,
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
    let dao_handler = ctx
        .db
        .daohandler()
        .find_first(vec![daohandler::id::equals(data.daoHandlerId.to_string())])
        .exec()
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
        .await
        .expect("bad prisma result");

    let last_proposal = ctx
        .db
        .proposal()
        .find_many(vec![proposal::daohandlerid::equals(
            dao_handler.id.to_string(),
        )])
        .order_by(proposal::blockcreated::order(Direction::Desc))
        .take(1)
        .exec()
        .await
        .expect("bad prisma result");

    let first_proposal_block = match first_proposal.first() {
        Some(s) => s.blockcreated.unwrap_or(0),
        None => 0,
    };

    let last_proposal_block = match last_proposal.first() {
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
        .client
        .get_block_number()
        .await
        .unwrap_or(U64::from(0))
        .as_u64() as i64;

    let mut batch_size = (40000000_i64).div(voters.len() as i64);

    if dao_handler.r#type == DaoHandlerType::MakerExecutive {
        batch_size /= 10;
    }

    if batch_size > 10000000 {
        batch_size = 10000000;
    }

    let mut from_block = cmp::max(oldest_vote_block, 0);

    if from_block < first_proposal_block {
        from_block = first_proposal_block;
    }

    let mut to_block;

    if current_block - from_block > batch_size {
        to_block = from_block + batch_size;
    } else {
        to_block = current_block;
    }

    if to_block > last_proposal_block {
        to_block = last_proposal_block;
    }

    if from_block > to_block {
        from_block = to_block;
    }

    let result = match dao_handler.r#type {
        DaoHandlerType::AaveChain => {
            match aave_votes(ctx, &dao_handler, &from_block, &to_block, voters.clone()).await {
                Ok(r) => match insert_votes(&r, to_block, ctx.clone(), dao_handler.clone()).await {
                    Ok(r) => success_response(r),
                    Err(e) => {
                        println!("{:#?}", e);
                        failed_response(voters)
                    }
                },
                Err(e) => {
                    println!("{:#?}", e);
                    failed_response(voters)
                }
            }
        }
        DaoHandlerType::CompoundChain => {
            match compound_votes(ctx, &dao_handler, &from_block, &to_block, voters.clone()).await {
                Ok(r) => match insert_votes(&r, to_block, ctx.clone(), dao_handler.clone()).await {
                    Ok(r) => success_response(r),
                    Err(e) => {
                        println!("{:#?}", e);
                        failed_response(voters)
                    }
                },
                Err(e) => {
                    println!("{:#?}", e);
                    failed_response(voters)
                }
            }
        }
        DaoHandlerType::UniswapChain => {
            match uniswap_votes(ctx, &dao_handler, &from_block, &to_block, voters.clone()).await {
                Ok(r) => match insert_votes(&r, to_block, ctx.clone(), dao_handler.clone()).await {
                    Ok(r) => success_response(r),
                    Err(e) => {
                        println!("{:#?}", e);
                        failed_response(voters)
                    }
                },
                Err(e) => {
                    println!("{:#?}", e);
                    failed_response(voters)
                }
            }
        }
        DaoHandlerType::EnsChain => {
            match ens_votes(ctx, &dao_handler, &from_block, &to_block, voters.clone()).await {
                Ok(r) => match insert_votes(&r, to_block, ctx.clone(), dao_handler.clone()).await {
                    Ok(r) => success_response(r),
                    Err(e) => {
                        println!("{:#?}", e);
                        failed_response(voters)
                    }
                },
                Err(e) => {
                    println!("{:#?}", e);
                    failed_response(voters)
                }
            }
        }
        DaoHandlerType::GitcoinChain => {
            match gitcoin_votes(ctx, &dao_handler, &from_block, &to_block, voters.clone()).await {
                Ok(r) => match insert_votes(&r, to_block, ctx.clone(), dao_handler.clone()).await {
                    Ok(r) => success_response(r),
                    Err(e) => {
                        println!("{:#?}", e);
                        failed_response(voters)
                    }
                },
                Err(e) => {
                    println!("{:#?}", e);
                    failed_response(voters)
                }
            }
        }
        DaoHandlerType::HopChain => {
            match hop_votes(ctx, &dao_handler, &from_block, &to_block, voters.clone()).await {
                Ok(r) => match insert_votes(&r, to_block, ctx.clone(), dao_handler.clone()).await {
                    Ok(r) => success_response(r),
                    Err(e) => {
                        println!("{:#?}", e);
                        failed_response(voters)
                    }
                },
                Err(e) => {
                    println!("{:#?}", e);
                    failed_response(voters)
                }
            }
        }
        DaoHandlerType::DydxChain => {
            match dydx_votes(ctx, &dao_handler, &from_block, &to_block, voters.clone()).await {
                Ok(r) => match insert_votes(&r, to_block, ctx.clone(), dao_handler.clone()).await {
                    Ok(r) => success_response(r),
                    Err(e) => {
                        println!("{:#?}", e);
                        failed_response(voters)
                    }
                },
                Err(e) => {
                    println!("{:#?}", e);
                    failed_response(voters)
                }
            }
        }
        DaoHandlerType::MakerExecutive => voters
            .into_iter()
            .map(|v| VotesResponse {
                voter_address: v,
                success: false,
            })
            .collect(),
        DaoHandlerType::MakerPoll => voters
            .into_iter()
            .map(|v| VotesResponse {
                voter_address: v,
                success: false,
            })
            .collect(),
        DaoHandlerType::MakerPollArbitrum => voters
            .into_iter()
            .map(|v| VotesResponse {
                voter_address: v,
                success: false,
            })
            .collect(),
        DaoHandlerType::Snapshot => voters
            .into_iter()
            .map(|v| VotesResponse {
                voter_address: v,
                success: false,
            })
            .collect(),
    };

    Json(result)
}

fn success_response(r: Vec<VoteResult>) -> Vec<VotesResponse> {
    r.into_iter()
        .map(|v| VotesResponse {
            voter_address: v.voter_address,
            success: v.success,
        })
        .collect()
}

fn failed_response(voters: Vec<String>) -> Vec<VotesResponse> {
    voters
        .into_iter()
        .map(|v| VotesResponse {
            voter_address: v,
            success: false,
        })
        .collect()
}

async fn insert_votes(
    votes: &Vec<VoteResult>,
    to_block: i64,
    ctx: &Ctx,
    dao_handler: daohandler::Data,
) -> Result<Vec<VoteResult>> {
    let successful_voters: Vec<VoteResult> =
        votes.clone().into_iter().filter(|v| v.success).collect();

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

    ctx.db
        .vote()
        .create_many(
            closed_votes
                .iter()
                .map(|v| {
                    vote::create_unchecked(
                        v.choice.clone(),
                        v.voting_power.clone(),
                        v.reason.clone(),
                        v.voter_address.to_string(),
                        v.proposal_id.clone(),
                        dao_handler.daoid.clone(),
                        dao_handler.id.clone(),
                        vec![vote::blockcreated::set(v.block_created.into())],
                    )
                })
                .collect(),
        )
        .skip_duplicates()
        .exec()
        .await?;

    let upserts = open_votes.clone().into_iter().map(|v| {
        ctx.db.vote().upsert(
            vote::voteraddress_daoid_proposalid(
                v.voter_address.to_string(),
                dao_handler.daoid.to_string(),
                v.proposal_id.clone(),
            ),
            vote::create(
                v.choice.clone(),
                v.voting_power.clone(),
                v.reason.clone(),
                voter::address::equals(v.voter_address.clone()),
                proposal::id::equals(v.proposal_id.clone()),
                dao::id::equals(dao_handler.daoid.clone()),
                daohandler::id::equals(dao_handler.id.clone()),
                vec![],
            ),
            vec![
                vote::choice::set(v.choice.clone()),
                vote::votingpower::set(v.voting_power.clone()),
                vote::reason::set(v.reason),
            ],
        )
    });

    let new_index = if dao_handler.chainindex.unwrap() > to_block {
        to_block
    } else {
        dao_handler.chainindex.unwrap()
    };

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
            vec![voterhandler::chainindex::set(new_index.into())],
        )
        .exec()
        .await
        .context("failed to update voterhandlers")?;

    let _ = ctx
        .db
        ._batch(upserts)
        .await
        .context("failed to add votes")?;

    Ok(votes.clone())
}
