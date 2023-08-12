use std::sync::Arc;

use anyhow::Result;
use prisma_client_rust::chrono::{Duration, Utc};
use tracing::{debug_span, instrument, Instrument};

use crate::prisma::{
    notification, proposal, subscription, user, NotificationDispatchedState, NotificationType,
    PrismaClient, ProposalState,
};

proposal::include!(proposal_with_dao { dao daohandler });

#[instrument(skip(client))]
pub async fn generate_ended_proposal_notifications(client: &Arc<PrismaClient>) -> Result<()> {
    let users = client
        .user()
        .find_many(vec![user::telegramnotifications::equals(true)])
        .exec()
        .await?;

    let proposals = client
        .proposal()
        .find_many(vec![
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

        let ending_proposals: Vec<proposal_with_dao::Data> = proposals
            .clone()
            .into_iter()
            .filter(|p| subscribed_dao_ids.contains(&p.daoid))
            .collect();

        client
            .notification()
            .create_many(
                ending_proposals
                    .iter()
                    .map(|np| {
                        notification::create_unchecked(
                            user.clone().id,
                            NotificationType::EndedProposalTelegram,
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
