use std::{cmp::Ordering, env, sync::Arc, time::Duration};

use prisma_client_rust::{bigdecimal::ToPrimitive, chrono::Utc};

use serenity::{
    http::Http,
    model::{
        prelude::{Embed, MessageId},
        webhook::Webhook,
    },
    utils::Colour,
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

pub async fn update_ended_proposal_notifications(client: &Arc<PrismaClient>) {
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
                notification::r#type::equals(NotificationType::NewProposalDiscord),
                notification::dispatched::equals(true),
            ])
            .exec()
            .await
            .unwrap();

        for notification in notifications_for_proposal {
            let initial_message_id: u64 = notification
                .clone()
                .discordmessageid
                .unwrap()
                .parse()
                .unwrap();

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

            let message_content = if proposal.scorestotal.as_f64() > proposal.quorum.as_f64() {
                format!(
                    "☑️ **{}** {}%",
                    &proposal.choices.as_array().unwrap()[result_index]
                        .as_str()
                        .unwrap(),
                    (max_score / proposal.scorestotal.as_f64().unwrap() * 100.0).round()
                )
            } else {
                format!("🇽 No Quorum",)
            };

            let http = Http::new("");

            let webhook = Webhook::from_url(&http, user.discordwebhook.as_str())
                .await
                .expect("Missing webhook");

            webhook
                .edit_message(&http, MessageId::from(initial_message_id), |w| {
                    w.embeds(vec![Embed::fake(|e| {
                        e.title(proposal.name)
                            .description(format!(
                                "**{}** {} proposal ended on {}",
                                proposal.dao.name,
                                if proposal.daohandler.r#type == DaoHandlerType::Snapshot {
                                    "off-chain"
                                } else {
                                    "on-chain"
                                },
                                format!("{}", proposal.timeend.format("%B %e").to_string())
                            ))
                            .field("", message_content, false)
                            .url(short_url)
                            .color(Colour(0x23272A))
                            .thumbnail(format!(
                                "https://www.senatelabs.xyz/{}_medium.png",
                                proposal.dao.picture
                            ))
                            .image(if voted {
                                "https://senatelabs.xyz/assets/Discord/past-vote2x.png"
                            } else {
                                "https://senatelabs.xyz/assets/Discord/past-no-vote2x.png"
                            })
                    })])
                })
                .await
                .unwrap();
        }

        sleep(Duration::from_millis(100)).await;
    }
}
