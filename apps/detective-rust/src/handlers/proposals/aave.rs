use std::sync::Arc;

use ethers::prelude::abigen;
use serde::Deserialize;
use crate::Ctx;
use crate::{ router::update_chain_proposals::Proposal, prisma::daohandler };

#[derive(Debug, Deserialize)]
struct Decoder {
    address: String,
}

pub async fn aave_proposals(
    ctx: &Ctx,
    dao_handler: &daohandler::Data,
    from_block: &i64,
    to_block: &i64
) -> Vec<Proposal> {
    let decoder: Decoder = match serde_json::from_value(dao_handler.clone().decoder) {
        Ok(data) => data,
        Err(_) => panic!("{:?} decoder not found", dao_handler.id),
    };

    abigen!(GOV_CONTRACT, "./abis/aave/aavegov.json");

    vec![]
}