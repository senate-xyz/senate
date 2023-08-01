use std::sync::Arc;

use anyhow::Result;
use prisma_client_rust::chrono::{Duration, Utc};
use tracing::{debug_span, instrument, Instrument};

use crate::prisma::{
    notification, proposal, subscription, user, NotificationType, PrismaClient, ProposalState,
};

#[instrument(skip(client))]
pub async fn generate_ended_proposal_notifications(client: &Arc<PrismaClient>) -> Result<()> {
    let users = client
        .user()
        .find_many(vec![user::discordnotifications::equals(true)])
        .exec()
        .await?;

    for user in users {
        let ending_proposals =
            get_ended_proposals_for_user(&user.address.clone().unwrap(), client).await?;

        client
            .notification()
            .create_many(
                ending_proposals
                    .iter()
                    .map(|np| {
                        notification::create_unchecked(
                            user.clone().id,
                            NotificationType::EndedProposalDiscord,
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

proposal::include!(proposal_with_dao { dao daohandler });

#[instrument(skip(client))]
pub async fn get_ended_proposals_for_user(
    username: &String,
    client: &Arc<PrismaClient>,
) -> Result<Vec<proposal_with_dao::Data>> {
    let user = client
        .user()
        .find_first(vec![user::address::equals(username.clone().into())])
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
            proposal::daoid::in_vec(subscribed_daos.into_iter().map(|d| d.daoid).collect()),
            proposal::state::in_vec(vec![
                ProposalState::Defeated,
                ProposalState::Succeeded,
                ProposalState::Queued,
                ProposalState::Expired,
                ProposalState::Executed,
            ]),
            proposal::timeend::lt((Utc::now()).into()),
            proposal::timeend::gt((Utc::now() - Duration::minutes(60)).into()),
            proposal::visible::equals(true),
        ])
        .include(proposal_with_dao::include())
        .exec()
        .await?;

    Ok(proposals)
}
