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
use tracing::{debug_span, instrument, warn, Instrument};

use crate::{
    prisma::{
        self, notification, proposal, user, DaoHandlerType, NotificationType, PrismaClient,
        ProposalState,
    },
    utils::vote::get_vote,
};

prisma::proposal::include!(proposal_with_dao { dao daohandler });

#[instrument(skip(client), level = "info")]
pub async fn update_hidden_proposal_notifications(client: &Arc<PrismaClient>) {
    let active_proposals = client
        .proposal()
        .find_many(vec![prisma::proposal::state::equals(ProposalState::Hidden)])
        .include(proposal_with_dao::include())
        .exec()
        .instrument(debug_span!("get_proposals"))
        .await
        .unwrap();

    for active_proposal in active_proposals {
        let notifications_for_proposal = client
            .notification()
            .find_many(vec![
                notification::proposalid::equals(active_proposal.id.into()),
                notification::r#type::equals(NotificationType::NewProposalDiscord),
                notification::dispatchstatus::equals(
                    prisma::NotificationDispatchedState::Dispatched,
                ),
            ])
            .exec()
            .instrument(debug_span!("get_notifications"))
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
                .instrument(debug_span!("get_user"))
                .await
                .unwrap()
                .unwrap();

            let proposal = client
                .proposal()
                .find_first(vec![proposal::id::equals(
                    notification.clone().proposalid.unwrap(),
                )])
                .include(proposal_with_dao::include())
                .exec()
                .instrument(debug_span!("get_proposal"))
                .await
                .unwrap();

            let http = Http::new("");

            let webhook_response = Webhook::from_url(&http, user.discordwebhook.as_str()).await;

            let webhook = match webhook_response {
                Ok(w) => w,
                Err(e) => {
                    warn!("{:?}", e);
                    continue;
                }
            };

            match proposal {
                Some(proposal) => {
                    let (result_index, max_score) = proposal
                        .scores
                        .as_array()
                        .unwrap()
                        .iter()
                        .map(|score| score.as_f64().unwrap())
                        .enumerate()
                        .max_by(|(_, a), (_, b)| a.partial_cmp(b).unwrap_or(Ordering::Equal))
                        .unwrap_or((100, 0.0));

                    let shortner_url = match env::var_os("NEXT_PUBLIC_URL_SHORTNER") {
                        Some(v) => v.into_string().unwrap(),
                        None => panic!("$NEXT_PUBLIC_URL_SHORTNER is not set"),
                    };

                    let short_url = format!(
                        "{}/{}/{}/{}",
                        shortner_url,
                        proposal
                            .id
                            .chars()
                            .rev()
                            .take(7)
                            .collect::<Vec<char>>()
                            .into_iter()
                            .rev()
                            .collect::<String>(),
                        "d",
                        user.clone()
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
                        notification.clone().proposalid.unwrap(),
                        client,
                    )
                    .await
                    .unwrap();

                    let message_content = if result_index == 100 {
                        "❓ Could not fetch results".to_string()
                    } else if proposal.scorestotal.as_f64() > proposal.quorum.as_f64() {
                        format!(
                            "✅ **{}** {}%",
                            &proposal.choices.as_array().unwrap()[result_index]
                                .as_str()
                                .unwrap(),
                            (max_score / proposal.scorestotal.as_f64().unwrap() * 100.0).round()
                        )
                    } else {
                        "❌ No Quorum".to_string()
                    };

                    webhook
                        .clone()
                        .edit_message(&http, MessageId::from(initial_message_id), |w| {
                            w.embeds(vec![Embed::fake(|e| {
                                e.title(proposal.clone().name)
                                    .description(format!(
                                        "**{}** {} proposal ended on {}",
                                        proposal.dao.name,
                                        if proposal.daohandler.r#type == DaoHandlerType::Snapshot {
                                            "off-chain"
                                        } else {
                                            "on-chain"
                                        },
                                        proposal.timeend.format("%B %e")
                                    ))
                                    .field("", message_content, false)
                                    .url(short_url)
                                    .color(Colour(0x23272A))
                                    .thumbnail(format!(
                                        "https://www.senatelabs.xyz/{}_medium.png",
                                        proposal.dao.picture
                                    ))
                                    .image(if voted {
                                        "https://www.senatelabs.xyz/assets/Discord/past-vote2x.png"
                                    } else {
                                        "https://www.senatelabs.xyz/assets/Discord/past-no-vote2x.png"
                                    })
                            })])
                        })
                        .instrument(debug_span!("edit_message"))
                        .await
                        .ok();
                }
                None => {
                    webhook
                        .clone()
                        .delete_message(&http, MessageId::from(initial_message_id))
                        .await
                        .ok();
                }
            }
        }

        sleep(Duration::from_millis(100)).await;
    }
}
