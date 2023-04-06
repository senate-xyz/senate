use std::ops::Div;

use ethers::{ providers::Middleware, types::U64 };
use prisma_client_rust::Direction;
use rocket::serde::json::Json;
use serde::Deserialize;
use serde_json::Value;

use crate::{
    prisma::{ DaoHandlerType, daohandler, voter, voterhandler, proposal },
    VotesResponse,
    VotesRequest,
    Ctx,
    handlers::votes::aave::aave_votes,
};

#[derive(Debug, Deserialize)]
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

#[derive(Debug, Deserialize)]
pub struct VoteResult {
    pub voter_address: String,
    pub success: bool,
    pub votes: Vec<Vote>,
}

#[post("/chain_votes", data = "<data>")]
pub async fn update_chain_votes<'a>(
    ctx: &Ctx,
    data: Json<VotesRequest<'a>>
) -> Json<Vec<VotesResponse>> {
    let dao_handler = ctx.db
        .daohandler()
        .find_first(vec![daohandler::id::equals(data.daoHandlerId.to_string())])
        .exec().await
        .expect("bad prisma result")
        .expect("daoHandlerId not found");

    let first_proposal = ctx.db
        .proposal()
        .find_many(vec![proposal::daohandlerid::equals(dao_handler.id.to_string())])
        .order_by(proposal::blockcreated::order(Direction::Asc))
        .take(1)
        .exec().await
        .expect("bad prisma result");

    let first_proposal_block = first_proposal
        .first()
        .expect("first proposal not found")
        .blockcreated.unwrap_or(0);

    let voter_handlers = ctx.db
        .voterhandler()
        .find_many(
            vec![
                voterhandler::voter::is(vec![voter::address::in_vec(data.voters.clone())]),
                voterhandler::daohandler::is(
                    vec![daohandler::id::equals(data.daoHandlerId.to_string())]
                )
            ]
        )
        .exec().await
        .expect("bad prisma result");

    let voters = data.voters.clone();

    let oldest_vote_block = voter_handlers
        .iter()
        .map(|vh| vh.chainindex)
        .min()
        .unwrap()
        .unwrap();

    let current_block = ctx.client.get_block_number().await.unwrap_or(U64::from(0)).as_u64() as i64;

    let mut batch_size = (40000000_i64).div(voters.len() as i64);

    if batch_size > 100000 {
        batch_size = 100000;
    }

    if dao_handler.r#type == DaoHandlerType::MakerExecutive {
        batch_size = batch_size / 10;
    }

    let mut from_block = {
        if oldest_vote_block > 0 { oldest_vote_block } else { 0 }
    };

    if from_block.clone() < first_proposal_block {
        from_block = first_proposal_block;
    }

    let to_block;

    if current_block - from_block > batch_size {
        to_block = from_block + batch_size;
    } else {
        to_block = current_block;
    }

    if from_block.clone() > to_block.clone() {
        from_block = to_block;
    }

    let result = match dao_handler.r#type {
        DaoHandlerType::AaveChain => {
            match aave_votes(ctx, &dao_handler, &from_block, &to_block, voters.clone()).await {
                Ok(r) => {
                    //insert_proposals(p, to_block, ctx.clone(), dao_handler.clone()).await;
                    r.into_iter()
                        .map(|v| VotesResponse {
                            voter_address: v.voter_address,
                            result: {
                                if v.success { "ok" } else { "nok" }
                            },
                        })
                        .collect()
                }
                Err(e) => {
                    eprintln!(
                        "Application error, from:{}, to:{}, current:{}, {},",
                        from_block,
                        to_block,
                        current_block,
                        e
                    );
                    voters
                        .into_iter()
                        .map(|v| VotesResponse {
                            voter_address: v,
                            result: "nok",
                        })
                        .collect()
                }
            }
        }
        DaoHandlerType::CompoundChain =>
            voters
                .into_iter()
                .map(|v| VotesResponse {
                    voter_address: v,
                    result: "nok",
                })
                .collect(),
        DaoHandlerType::UniswapChain =>
            voters
                .into_iter()
                .map(|v| VotesResponse {
                    voter_address: v,
                    result: "nok",
                })
                .collect(),
        DaoHandlerType::EnsChain =>
            voters
                .into_iter()
                .map(|v| VotesResponse {
                    voter_address: v,
                    result: "nok",
                })
                .collect(),
        DaoHandlerType::GitcoinChain =>
            voters
                .into_iter()
                .map(|v| VotesResponse {
                    voter_address: v,
                    result: "nok",
                })
                .collect(),
        DaoHandlerType::HopChain =>
            voters
                .into_iter()
                .map(|v| VotesResponse {
                    voter_address: v,
                    result: "nok",
                })
                .collect(),
        DaoHandlerType::DydxChain =>
            voters
                .into_iter()
                .map(|v| VotesResponse {
                    voter_address: v,
                    result: "nok",
                })
                .collect(),
        DaoHandlerType::MakerExecutive =>
            voters
                .into_iter()
                .map(|v| VotesResponse {
                    voter_address: v,
                    result: "nok",
                })
                .collect(),
        DaoHandlerType::MakerPoll =>
            voters
                .into_iter()
                .map(|v| VotesResponse {
                    voter_address: v,
                    result: "nok",
                })
                .collect(),
        DaoHandlerType::MakerPollArbitrum =>
            voters
                .into_iter()
                .map(|v| VotesResponse {
                    voter_address: v,
                    result: "nok",
                })
                .collect(),
        DaoHandlerType::Snapshot =>
            voters
                .into_iter()
                .map(|v| VotesResponse {
                    voter_address: v,
                    result: "nok",
                })
                .collect(),
    };

    Json(result)
}