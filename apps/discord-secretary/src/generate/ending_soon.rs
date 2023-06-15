use crate::{
    prisma::{
        notification, proposal, subscription, user, NotificationType, PrismaClient, ProposalState,
    },
    utils::vote::get_vote,
};
use anyhow::Result;
use prisma_client_rust::chrono::{Duration, Utc};
use tracing::{debug_span, instrument, Instrument};

use std::sync::Arc;

pub async fn generate_ending_soon_notifications(
    client: &Arc<PrismaClient>,
    ending_type: NotificationType,
) {
    let timeleft = match ending_type {
        NotificationType::FirstReminderDiscord => Duration::hours(24),
        NotificationType::SecondReminderDiscord => Duration::hours(6),
        NotificationType::QuorumNotReachedEmail => todo!(),
        NotificationType::NewProposalDiscord => todo!(),
        NotificationType::ThirdReminderDiscord => todo!(),
        NotificationType::EndedProposalDiscord => todo!(),
        NotificationType::NewProposalTelegram => todo!(),
        NotificationType::FirstReminderTelegram => todo!(),
        NotificationType::SecondReminderTelegram => todo!(),
        NotificationType::ThirdReminderTelegram => todo!(),
        NotificationType::EndedProposalTelegram => todo!(),
        NotificationType::BulletinEmail => todo!(),
    };

    let users = client
        .user()
        .find_many(vec![
            user::discordnotifications::equals(true),
            user::discordwebhook::starts_with("https://".to_string()),
            user::discordreminders::equals(true),
        ])
        .exec()
        .instrument(debug_span!("get_users"))
        .await
        .unwrap();

    for user in users {
        let ending_proposals = get_ending_proposals_for_user(&user.address, timeleft, client)
            .await
            .unwrap();

        let mut ending_not_voted_proposals = vec![];

        for proposal in ending_proposals {
            if !get_vote(user.clone().id, proposal.clone().id, client)
                .await
                .unwrap()
            {
                ending_not_voted_proposals.push(proposal);
            }
        }
        client
            .notification()
            .create_many(
                ending_not_voted_proposals
                    .iter()
                    .map(|np| {
                        notification::create_unchecked(
                            user.clone().id,
                            ending_type,
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
pub async fn get_ending_proposals_for_user(
    username: &String,
    timeleft: Duration,
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
            proposal::state::equals(ProposalState::Active),
            proposal::timeend::lt((Utc::now() + timeleft).into()),
            proposal::timeend::gt((Utc::now() + timeleft - Duration::minutes(60)).into()),
        ])
        .include(proposal_with_dao::include())
        .exec()
        .instrument(debug_span!("get_proposals"))
        .await
        .unwrap();

    Ok(proposals)
}
