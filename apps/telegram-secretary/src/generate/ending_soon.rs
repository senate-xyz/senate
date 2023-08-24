use std::sync::Arc;

use anyhow::Result;
use prisma_client_rust::chrono::{Duration, Utc};
use teloxide::Bot;
use tracing::{debug_span, instrument, Instrument};

use crate::{
    prisma::{
        notification, proposal, subscription, user, NotificationType, PrismaClient, ProposalState,
    },
    utils::vote::get_vote,
};

proposal::include!(proposal_with_dao { dao daohandler });

#[instrument(skip(client))]
pub async fn generate_ending_soon_notifications(
    client: &Arc<PrismaClient>,
    ending_type: NotificationType,
) -> Result<()> {
    let timeleft = match ending_type {
        NotificationType::FirstReminderDiscord => todo!(),
        NotificationType::SecondReminderDiscord => todo!(),
        NotificationType::QuorumNotReachedEmail => todo!(),
        NotificationType::NewProposalDiscord => todo!(),
        NotificationType::ThirdReminderDiscord => todo!(),
        NotificationType::EndedProposalDiscord => todo!(),
        NotificationType::NewProposalTelegram => todo!(),
        NotificationType::FirstReminderTelegram => Duration::hours(24),
        NotificationType::SecondReminderTelegram => Duration::hours(6),
        NotificationType::ThirdReminderTelegram => todo!(),
        NotificationType::EndedProposalTelegram => todo!(),
        NotificationType::BulletinEmail => todo!(),
    };

    let users = client
        .user()
        .find_many(vec![
            user::telegramnotifications::equals(true),
            user::telegramreminders::equals(true),
        ])
        .exec()
        .await?;

    let proposals = client
        .proposal()
        .find_many(vec![
            proposal::state::equals(ProposalState::Active),
            proposal::timeend::lt((Utc::now() + timeleft).into()),
            proposal::timeend::gt((Utc::now() + timeleft - Duration::minutes(60)).into()),
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

        let mut ending_not_voted_proposals = vec![];

        for proposal in ending_proposals {
            ending_not_voted_proposals.push(proposal);
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
            .await?;
    }

    Ok(())
}
