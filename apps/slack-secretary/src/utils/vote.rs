use std::sync::Arc;

use anyhow::Result;
use tracing::instrument;

use crate::prisma::{self, PrismaClient};

#[instrument(skip(client))]
pub async fn get_vote(
    user_id: String,
    proposal_id: String,
    client: &Arc<PrismaClient>,
) -> Result<bool> {
    let user = client
        .user()
        .find_first(vec![prisma::user::id::equals(user_id)])
        .include(prisma::user::include!({ voters }))
        .exec()
        .await?
        .unwrap();

    let mut voted = false;

    for voter in user.voters {
        let vote = client
            .vote()
            .find_first(vec![
                prisma::vote::proposalid::equals(proposal_id.to_string()),
                prisma::vote::voteraddress::equals(voter.address),
            ])
            .exec()
            .await?;

        if vote.is_some() {
            voted = true
        }
    }

    Ok(voted)
}
