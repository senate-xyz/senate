use std::sync::Arc;

use anyhow::Result;
use prisma_client_rust::chrono::{Duration, Utc};
use tracing::{debug_span, instrument, Instrument};

use crate::prisma::{
    notification, proposal, subscription, user, NotificationType, PrismaClient, ProposalState,
};

#[instrument(skip(client), level = "info")]
pub async fn generate_ended_proposal_notifications(client: &Arc<PrismaClient>) {
    let users = client
        .user()
        .find_many(vec![
            user::discordnotifications::equals(true),
            user::discordwebhook::starts_with("https://".to_string()),
        ])
        .exec()
        .instrument(debug_span!("get_users"))
        .await
        .unwrap();

    for user in users {
        let ending_proposals = get_ended_proposals_for_user(&user.address, client)
            .await
            .unwrap();

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
            .instrument(debug_span!("create_notifications"))
            .await
            .unwrap();
    }
}

proposal::include!(proposal_with_dao { dao daohandler });

#[instrument(skip(client))]
pub async fn get_ended_proposals_for_user(
    username: &String,
    client: &Arc<PrismaClient>,
) -> Result<Vec<proposal_with_dao::Data>> {
    let user = client
        .user()
        .find_first(vec![user::address::equals(username.clone())])
        .exec()
        .instrument(debug_span!("get_user"))
        .await
        .unwrap()
        .unwrap();

    let subscribed_daos = client
        .subscription()
        .find_many(vec![subscription::userid::equals(user.id)])
        .exec()
        .instrument(debug_span!("get_subscriptions"))
        .await
        .unwrap();

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
        ])
        .include(proposal_with_dao::include())
        .exec()
        .instrument(debug_span!("get_proposals"))
        .await
        .unwrap();

    Ok(proposals)
}