use std::sync::Arc;

use crate::prisma::{
    self,
    notification,
    subscription,
    user,
    NotificationType,
    PrismaClient,
    ProposalState,
};
use anyhow::Result;

pub async fn generate_new_proposal_notifications(client: &Arc<PrismaClient>) {
    let users = client
        .user()
        .find_many(vec![
            user::discordnotifications::equals(true),
            user::discordwebhook::starts_with("https://".to_string()),
        ])
        .exec()
        .await
        .unwrap();

    for user in users {
        let new_proposals = get_new_proposals_for_user(&user.address, client)
            .await
            .unwrap();

        client
            .notification()
            .create_many(
                new_proposals
                    .iter()
                    .map(|np| {
                        notification::create_unchecked(
                            user.clone().id,
                            np.clone().id,
                            NotificationType::NewProposalDiscord,
                            vec![notification::dispatched::set(false)],
                        )
                    })
                    .collect(),
            )
            .skip_duplicates()
            .exec()
            .await
            .unwrap();
    }
}

prisma::proposal::include!(proposal_with_dao { dao daohandler });

pub async fn get_new_proposals_for_user(
    username: &String,
    client: &Arc<PrismaClient>,
) -> Result<Vec<proposal_with_dao::Data>> {
    let user = client
        .user()
        .find_first(vec![prisma::user::address::equals(username.clone())])
        .exec()
        .await
        .unwrap()
        .unwrap();

    let subscribed_daos = client
        .subscription()
        .find_many(vec![subscription::userid::equals(user.id)])
        .exec()
        .await
        .unwrap();

    let proposals = client
        .proposal()
        .find_many(vec![
            prisma::proposal::daoid::in_vec(subscribed_daos.into_iter().map(|d| d.daoid).collect()),
            prisma::proposal::state::equals(ProposalState::Active),
        ])
        .include(proposal_with_dao::include())
        .exec()
        .await
        .unwrap();

    Ok(proposals)
}
