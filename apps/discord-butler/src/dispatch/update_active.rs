use std::{env, sync::Arc, time::Duration};

use prisma_client_rust::bigdecimal::ToPrimitive;
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

pub async fn update_active_proposal_notifications(client: &Arc<PrismaClient>) {
    println!("update_active_proposal_notifications");
    let active_proposals = client
        .proposal()
        .find_many(vec![prisma::proposal::state::equals(ProposalState::Active)])
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

            let voted = get_vote(
                notification.clone().userid,
                notification.clone().proposalid,
                client,
            )
            .await
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
                .find_first(vec![proposal::id::equals(notification.proposalid)])
                .include(proposal_with_dao::include())
                .exec()
                .await
                .unwrap()
                .unwrap();

            // let result_index = match proposal
            //     .scores
            //     .as_array()
            //     .unwrap()
            //     .iter()
            //     .enumerate()
            //     .max_by_key(|&(_index, item)| {
            //         item.as_f64().unwrap().to_u64().unwrap_or(std::u64::MIN)
            //     }) {
            //     Some((index, _)) => index,
            //     None => 0,
            // };

            // let message_content = if proposal.scorestotal.as_f64() > proposal.quorum.as_f64() {
            //     format!(
            //         "☑️ **{}** {}%",
            //         &proposal.choices.as_array().unwrap()[result_index]
            //             .as_str()
            //             .unwrap(),
            //         (proposal.scores.as_array().unwrap()[result_index]
            //             .as_f64()
            //             .unwrap()
            //             / proposal.scorestotal.as_f64().unwrap()
            //             * 100.0)
            //             .round()
            //     )
            // } else {
            //     format!("🇽 No Quorum",)
            // };

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

            let http = Http::new("");

            let webhook = Webhook::from_url(&http, user.discordwebhook.as_str())
                .await
                .expect("Missing webhook");

            webhook
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
                            //.field("", message_content, true)
                            .thumbnail(format!(
                                "https://www.senatelabs.xyz/{}_medium.png",
                                proposal.dao.picture
                            ))
                            .image(if voted {
                                "https://senatelabs.xyz/assets/Discord/active-vote2x.png"
                            } else {
                                "https://senatelabs.xyz/assets/Discord/active-no-vote2x.png"
                            })
                    })])
                })
                .await
                .unwrap();
        }

        sleep(Duration::from_millis(100)).await;
    }
}
