use crate::{prisma::daohandler, router::update_chain_votes::VoteResult, Ctx};
use anyhow::Result;

pub async fn aave_votes(
    _ctx: &Ctx,
    _dao_handler: &daohandler::Data,
    _from_block: &i64,
    _to_block: &i64,
    voters: Vec<String>,
) -> Result<Vec<VoteResult>> {
    println!("{:#?}", _dao_handler);
    println!("{:#?} {:#?} ", _from_block, _to_block);
    println!("{:#?}", voters);

    Ok(voters
        .iter()
        .map(|v| VoteResult {
            voter_address: v.clone(),
            success: true,
            votes: vec![],
        })
        .collect())
}
