use std::sync::Arc;

use anyhow::Result;
use teloxide::Bot;
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

#[instrument(skip(client), level = "debug")]
pub async fn generate_new_proposal_notifications(client: &Arc<PrismaClient>) {
    let users = client
        .user()
        .find_many(vec![
            user::telegramnotifications::equals(true),
            user::telegramchatid::gt("".to_string()),
        ])
        .exec()
        .instrument(debug_span!("get_users"))
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
                            NotificationType::NewProposalTelegram,
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

prisma::proposal::include!(proposal_with_dao { dao daohandler });

#[instrument(skip(client), level = "debug")]
pub async fn get_new_proposals_for_user(
    username: &String,
    client: &Arc<PrismaClient>,
) -> Result<Vec<proposal_with_dao::Data>> {
    let user = client
        .user()
        .find_first(vec![prisma::user::address::equals(username.clone())])
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
            prisma::proposal::daoid::in_vec(subscribed_daos.into_iter().map(|d| d.daoid).collect()),
            prisma::proposal::state::equals(ProposalState::Active),
        ])
        .include(proposal_with_dao::include())
        .exec()
        .instrument(debug_span!("get_proposals"))
        .await
        .unwrap();

    Ok(proposals)
}
