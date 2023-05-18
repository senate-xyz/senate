use crate::prisma::{
    notification,
    proposal,
    subscription,
    user,
    NotificationType,
    PrismaClient,
    ProposalState,
};
use anyhow::Result;
use prisma_client_rust::chrono::{Duration, Utc};

use std::sync::Arc;

#[derive(Debug)]
pub enum EndingType {
    Remaining1Discord,
    Remaining3Discord,
    Remaining6Discord,
    Remaining12Discord,
}

pub async fn generate_ending_soon_notifications(
    client: &Arc<PrismaClient>,
    ending_type: EndingType,
) {
    let timeleft = match ending_type {
        EndingType::Remaining1Discord => Duration::from(Duration::hours(1)),
        EndingType::Remaining3Discord => Duration::from(Duration::hours(3)),
        EndingType::Remaining6Discord => Duration::from(Duration::hours(6)),
        EndingType::Remaining12Discord => Duration::from(Duration::hours(12)),
    };

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
        let ending_proposals = get_ending_proposals_for_user(&user.address, timeleft, client)
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
                            np.clone().id,
                            match ending_type {
                                EndingType::Remaining1Discord => {
                                    NotificationType::Remaining1Discord
                                }
                                EndingType::Remaining3Discord => {
                                    NotificationType::Remaining3Discord
                                }
                                EndingType::Remaining6Discord => {
                                    NotificationType::Remaining6Discord
                                }
                                EndingType::Remaining12Discord => {
                                    NotificationType::Remaining12Discord
                                }
                            },
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

proposal::include!(proposal_with_dao { dao daohandler });

pub async fn get_ending_proposals_for_user(
    username: &String,
    timeleft: Duration,
    client: &Arc<PrismaClient>,
) -> Result<Vec<proposal_with_dao::Data>> {
    let user = client
        .user()
        .find_first(vec![user::address::equals(username.clone())])
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
            proposal::daoid::in_vec(subscribed_daos.into_iter().map(|d| d.daoid).collect()),
            proposal::state::equals(ProposalState::Active),
            proposal::timeend::lt((Utc::now() + timeleft).into()),
            proposal::timeend::gt(
                (Utc::now() + timeleft - Duration::from(Duration::minutes(10))).into(),
            ),
        ])
        .include(proposal_with_dao::include())
        .exec()
        .await
        .unwrap();

    Ok(proposals)
}
