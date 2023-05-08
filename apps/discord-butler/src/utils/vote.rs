use crate::prisma::{self, PrismaClient};
use anyhow::Result;

use std::sync::Arc;

pub async fn get_vote(username: String, proposal_id: String) -> Result<bool> {
    let client = Arc::new(PrismaClient::_builder().build().await.unwrap());

    let user = client
        .user()
        .find_first(vec![prisma::user::address::equals(username)])
        .include(prisma::user::include!({ voters }))
        .exec()
        .await
        .unwrap()
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
            .await
            .unwrap();

        match vote {
            Some(_) => voted = true,
            None => {}
        }
    }

    Ok(voted)
}
