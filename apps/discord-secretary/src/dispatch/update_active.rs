use prisma_client_rust::bigdecimal::ToPrimitive;
use serenity::{
    http::Http,
    model::{
        prelude::{Embed, MessageId},
        webhook::Webhook,
    },
    utils::Colour,
};
use std::{env, sync::Arc, time::Duration};
use tokio::time::sleep;
use tracing::{debug_span, instrument, Instrument};

use crate::{
    prisma::{
        self,
        DaoHandlerType,
        notification,
        NotificationDispatchedState,
        NotificationType,
        PrismaClient,
        proposal,
        ProposalState,
        user,
    },
    utils::vote::get_vote,
};

prisma::proposal::include!(proposal_with_dao { dao daohandler });

#[instrument(skip(client), level = "info")]
pub async fn update_active_proposal_notifications(client: &Arc<PrismaClient>) {
    let active_proposals = client
        .proposal()
        .find_many(vec![prisma::proposal::state::equals(ProposalState::Active)])
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

            let webhook = Webhook::from_url(&http, user.discordwebhook.as_str())
                .await
                .ok();

            if webhook.is_none() {
                continue;
            }

            let shortner_url = match env::var_os("NEXT_PUBLIC_URL_SHORTNER") {
                Some(v) => v.into_string().unwrap(),
                None => panic!("$NEXT_PUBLIC_URL_SHORTNER is not set"),
            };

            let voted = get_vote(
                notification.clone().userid,
                notification.clone().proposalid.unwrap(),
                client,
            )
                .await
                .unwrap();

            match proposal {
                Some(proposal) => {
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

                    webhook
                        .clone()
                        .unwrap()
                        .edit_message(&http, MessageId::from(initial_message_id), |w| {
                            w.embeds(vec![Embed::fake(|e| {
                                e.title(proposal.name)
                                    .description(format!(
                                        "**{}** {} proposal ending **<t:{}:R>**",
                                        proposal.dao.name,
                                        if proposal.daohandler.r#type == DaoHandlerType::Snapshot {
                                            "off-chain"
                                        } else {
                                            "on-chain"
                                        },
                                        proposal.timeend.timestamp()
                                    ))
                                    .url(short_url)
                                    .color(Colour(0xFFFFFF))
                                    .thumbnail(format!(
                                        "https://www.senatelabs.xyz/{}_medium.png",
                                        proposal.dao.picture
                                    ))
                                    .image(if voted {
                                        "https://www.senatelabs.xyz/assets/Discord/active-vote2x.png"
                                    } else {
                                        "https://www.senatelabs.xyz/assets/Discord/active-no-vote2x.png"
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
                        .unwrap()
                        .delete_message(&http, MessageId::from(initial_message_id))
                        .await
                        .expect("Could not execute webhook.");
                }
            }
        }

        sleep(Duration::from_millis(100)).await;
    }
}
