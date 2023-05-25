use std::{cmp::Ordering, env, sync::Arc, time::Duration};

use prisma_client_rust::{bigdecimal::ToPrimitive, chrono::Utc};

use teloxide::{
    adaptors::{DefaultParseMode, Throttle},
    requests::Requester,
    types::{ChatId, MessageId},
    Bot,
};
use tokio::time::sleep;

use crate::{
    prisma::{
        self,
        notification,
        proposal,
        user,
        DaoHandlerType,
        NotificationType,
        PrismaClient,
        ProposalState,
    },
    utils::vote::get_vote,
};

prisma::proposal::include!(proposal_with_dao { dao daohandler });

pub async fn update_ended_proposal_notifications(
    client: &Arc<PrismaClient>,
    bot: &Arc<DefaultParseMode<Throttle<teloxide::Bot>>>,
) {
    println!("update_ended_proposal_notifications");
    let active_proposals = client
        .proposal()
        .find_many(vec![prisma::proposal::state::equals(ProposalState::Hidden)])
        .include(proposal_with_dao::include())
        .exec()
        .await
        .unwrap();

    for active_proposal in active_proposals {
        let notifications_for_proposal = client
            .notification()
            .find_many(vec![
                notification::proposalid::equals(active_proposal.id),
                notification::r#type::equals(NotificationType::NewProposalTelegram),
                notification::dispatched::equals(true),
            ])
            .exec()
            .await
            .unwrap();

        for notification in notifications_for_proposal {
            let initial_message_id = MessageId(
                notification
                    .clone()
                    .telegrammessageid
                    .unwrap()
                    .parse()
                    .unwrap(),
            );

            let user = client
                .user()
                .find_first(vec![user::id::equals(notification.clone().userid)])
                .exec()
                .await
                .unwrap()
                .unwrap();

            let proposal = client
                .proposal()
                .find_first(vec![proposal::id::equals(notification.clone().proposalid)])
                .include(proposal_with_dao::include())
                .exec()
                .await
                .unwrap()
                .unwrap();

            let (result_index, max_score) = proposal
                .scores
                .as_array()
                .unwrap()
                .iter()
                .map(|score| score.as_f64().unwrap())
                .enumerate()
                .max_by(|(_, a), (_, b)| a.partial_cmp(b).unwrap_or(Ordering::Equal))
                .unwrap();

            let shortner_url = match env::var_os("NEXT_PUBLIC_URL_SHORTNER") {
                Some(v) => v.into_string().unwrap(),
                None => panic!("$NEXT_PUBLIC_URL_SHORTNER is not set"),
            };

            let short_url = format!(
                "{}{}",
                shortner_url,
                proposal
                    .id
                    .chars()
                    .rev()
                    .take(7)
                    .collect::<Vec<char>>()
                    .into_iter()
                    .rev()
                    .collect::<String>()
            );

            let voted = get_vote(
                notification.clone().userid,
                notification.clone().proposalid,
                client,
            )
            .await
            .unwrap();

            let update_message_content = if proposal.scorestotal.as_f64() > proposal.quorum.as_f64()
            {
                format!(
                    "🗳️ <b>{}</b> {} proposal ended at <b>{}</b> - <a href=\"{}\"><i>{}</i></a> \n<b>{}</b> \n<code>Updated at:{}</code>",
                    proposal.dao.name,
                    if proposal.daohandler.r#type == DaoHandlerType::Snapshot {
                        "off-chain"
                    } else {
                        "on-chain"
                    },
                    proposal.timeend.format("%Y-%m-%d %H:%M"),
                    proposal.url,
                    proposal.name,
                    if voted { "Voted" } else { "Not voted yet" },
                    Utc::now().format("%Y-%m-%d %H:%M")
                )
            } else {
                format!(
                    "⛔️ <b>{}</b> {} proposal ended with no quorum <b>{}</b> - <a href=\"{}\"><i>{}</i></a> \n<b>{}</b> \n<code>Updated at:{}</code>",
                    proposal.dao.name,
                    if proposal.daohandler.r#type == DaoHandlerType::Snapshot {
                        "off-chain"
                    } else {
                        "on-chain"
                    },
                    proposal.timeend.format("%Y-%m-%d %H:%M %Z"),
                    proposal.url,
                    proposal.name,
                    if voted { "Voted" } else { "Not voted yet" },
                    Utc::now().format("%Y-%m-%d %H:%M %Z")
                )
            };

            let _ = bot
                .edit_message_text(
                    ChatId(user.telegramchatid.parse().unwrap()),
                    initial_message_id,
                    update_message_content,
                )
                .await;
        }

        sleep(Duration::from_millis(250)).await;
    }
}
