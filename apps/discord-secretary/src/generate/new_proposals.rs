use std::sync::Arc;

use anyhow::Result;
use tracing::{debug_span, instrument, Instrument};

use crate::prisma::{
    self,
    notification,
    subscription,
    user,
    NotificationType,
    PrismaClient,
    ProposalState,
};

prisma::proposal::include!(proposal_with_dao { dao daohandler });

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

    let proposals = client
        .proposal()
        .find_many(vec![
            prisma::proposal::state::equals(ProposalState::Active),
            prisma::proposal::visible::equals(true),
        ])
        .include(proposal_with_dao::include())
        .exec()
        .await?;

    for user in users {
        let user = client
            .user()
            .find_first(vec![user::address::equals(user.clone().address)])
            .exec()
            .await?
            .unwrap();

        let subscribed_daos = client
            .subscription()
            .find_many(vec![subscription::userid::equals(user.clone().id)])
            .exec()
            .await?;

        let subscribed_dao_ids: Vec<String> =
            subscribed_daos.iter().map(|s| s.clone().daoid).collect();

        let new_proposals: Vec<proposal_with_dao::Data> = proposals
            .clone()
            .into_iter()
            .filter(|p| subscribed_dao_ids.contains(&p.daoid))
            .collect();

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
