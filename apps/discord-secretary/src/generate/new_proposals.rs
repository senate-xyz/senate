use std::sync::Arc;

use anyhow::Result;
use tracing::{debug_span, instrument, Instrument};

use crate::prisma::{
    self, notification, subscription, user, NotificationType, PrismaClient, ProposalState,
};

#[instrument(skip(client))]
pub async fn generate_new_proposal_notifications(client: &Arc<PrismaClient>) -> Result<()> {
    let users = client
        .user()
        .find_many(vec![
            user::discordnotifications::equals(true),
            user::discordwebhook::contains("https://".to_string()),
        ])
        .exec()
        .await?;

    for user in users {
        let new_proposals =
            get_new_proposals_for_user(&user.address.clone().unwrap(), client).await?;

        client
            .notification()
            .create_many(
                new_proposals
                    .iter()
                    .map(|np| {
                        notification::create_unchecked(
                            user.clone().id,
                            NotificationType::NewProposalDiscord,
                            vec![notification::proposalid::set(np.clone().id.into())],
                        )
                    })
                    .collect(),
            )
            .skip_duplicates()
            .exec()
            .await?;
    }

    Ok(())
}

prisma::proposal::include!(proposal_with_dao { dao daohandler });

#[instrument(skip(client))]
pub async fn get_new_proposals_for_user(
    username: &String,
    client: &Arc<PrismaClient>,
) -> Result<Vec<proposal_with_dao::Data>> {
    let user = client
        .user()
        .find_first(vec![prisma::user::address::equals(username.clone().into())])
        .exec()
        .await?
        .unwrap();

    let subscribed_daos = client
        .subscription()
        .find_many(vec![subscription::userid::equals(user.id)])
        .exec()
        .await?;

    let proposals = client
        .proposal()
        .find_many(vec![
            prisma::proposal::daoid::in_vec(subscribed_daos.into_iter().map(|d| d.daoid).collect()),
            prisma::proposal::state::equals(ProposalState::Active),
            prisma::proposal::visible::equals(true),
        ])
        .include(proposal_with_dao::include())
        .exec()
        .await?;

    Ok(proposals)
}
