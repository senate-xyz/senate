use anyhow::Result;
use crate::{ Ctx, prisma::daohandler, router::update_chain_votes::VoteResult };

pub async fn aave_votes(
    ctx: &Ctx,
    dao_handler: &daohandler::Data,
    from_block: &i64,
    to_block: &i64,
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