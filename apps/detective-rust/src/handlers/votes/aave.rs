use anyhow::Result;
use crate::{ Ctx, prisma::daohandler, router::update_chain_votes::VoteResult };

pub async fn aave_votes(
    _ctx: &Ctx,
    _dao_handler: &daohandler::Data,
    _from_block: &i64,
    _to_block: &i64,
    voters: Vec<String>
) -> Result<Vec<VoteResult>> {
    Ok(
        voters
            .iter()
            .map(|v| VoteResult {
                voter_address: v.clone(),
                success: true,
                votes: vec![],
            })
            .collect()
    )
}