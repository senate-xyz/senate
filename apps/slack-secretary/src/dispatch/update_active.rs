use std::{env, sync::Arc, time::Duration};

use prisma_client_rust::bigdecimal::ToPrimitive;

use tokio::time::sleep;
use tracing::{debug_span, event, instrument, warn, Instrument, Level};

use crate::{
    prisma::{
        self,
        notification,
        proposal,
        user,
        DaoHandlerType,
        NotificationDispatchedState,
        NotificationType,
        PrismaClient,
        ProposalState,
    },
    utils::vote::get_vote,
};
use anyhow::Result;

prisma::proposal::include!(proposal_with_dao { dao daohandler });

pub async fn update_active_proposal_notifications(_client: &Arc<PrismaClient>) -> Result<()> {
    // let active_proposals = client
    //     .proposal()
    //     .find_many(vec![prisma::proposal::state::equals(ProposalState::Active)])
    //     .include(proposal_with_dao::include())
    //     .exec()
    //     .await?;

    // for active_proposal in active_proposals {
    //     let notifications_for_proposal = client
    //         .notification()
    //         .find_many(vec![
    //             notification::proposalid::equals(active_proposal.id.into()),
    //             notification::r#type::equals(NotificationType::NewProposalDiscord),
    //             notification::dispatchstatus::equals(
    //                 prisma::NotificationDispatchedState::Dispatched,
    //             ),
    //         ])
    //         .exec()
    //         .await?;

    //     for notification in notifications_for_proposal {
    //         let initial_message_id: u64 = notification.clone().discordmessageid.unwrap().parse()?;

    //         let user = client
    //             .user()
    //             .find_first(vec![user::id::equals(notification.clone().userid)])
    //             .exec()
    //             .await?
    //             .unwrap();

    //         let proposal = client
    //             .proposal()
    //             .find_first(vec![proposal::id::equals(
    //                 notification.clone().proposalid.unwrap(),
    //             )])
    //             .include(proposal_with_dao::include())
    //             .exec()
    //             .await?;

    //         let http = Http::new("");

    //         let webhook_response = Webhook::from_url(&http, user.discordwebhook.as_str()).await;

    //         let webhook = match webhook_response {
    //             Ok(w) => w,
    //             Err(e) => {
    //                 event!(Level::ERROR, err = e.to_string(), "webhook err");
    //                 continue;
    //             }
    //         };

    //         let shortner_url = match env::var_os("NEXT_PUBLIC_URL_SHORTNER") {
    //             Some(v) => v.into_string().unwrap(),
    //             None => panic!("$NEXT_PUBLIC_URL_SHORTNER is not set"),
    //         };

    //         let voted = get_vote(
    //             notification.clone().userid,
    //             notification.clone().proposalid.unwrap(),
    //             client,
    //         )
    //         .await?;

    //         match proposal {
    //             Some(proposal) => {
    //                 let short_url = format!(
    //                     "{}{}/{}/{}",
    //                     shortner_url,
    //                     proposal
    //                         .id
    //                         .chars()
    //                         .rev()
    //                         .take(7)
    //                         .collect::<Vec<char>>()
    //                         .into_iter()
    //                         .rev()
    //                         .collect::<String>(),
    //                     "d",
    //                     user.clone()
    //                         .id
    //                         .chars()
    //                         .rev()
    //                         .take(7)
    //                         .collect::<Vec<char>>()
    //                         .into_iter()
    //                         .rev()
    //                         .collect::<String>()
    //                 );

    //                 let image = if user.discordincludevotes {
    //                     if voted {
    //                         "https://www.senatelabs.xyz/assets/Discord/active-vote2x.png"
    //                     } else {
    //                         "https://www.senatelabs.xyz/assets/Discord/active-no-vote2x.png"
    //                     }
    //                 } else {
    //                     "https://www.senatelabs.xyz/assets/Discord/placeholder2x.png"
    //                 };

    //                 webhook
    //                     .clone()
    //                     .edit_message(&http, MessageId::from(initial_message_id), |w| {
    //                         w.embeds(vec![Embed::fake(|e| {
    //                             e.title(proposal.clone().name)
    //                                 .description(format!(
    //                                     "**{}** {} proposal ending **<t:{}:R>**",
    //                                     proposal.dao.name,
    //                                     if proposal.daohandler.r#type == DaoHandlerType::Snapshot {
    //                                         "offchain"
    //                                     } else {
    //                                         "onchain"
    //                                     },
    //                                     proposal.timeend.timestamp()
    //                                 ))
    //                                 .url(short_url)
    //                                 .color(Colour(0xFFFFFF))
    //                                 .thumbnail(format!(
    //                                     "https://www.senatelabs.xyz/{}_medium.png",
    //                                     proposal.dao.picture
    //                                 ))
    //                                 .image(image)
    //                         })])
    //                     })
    //                     .await?;
    //             }
    //             None => {
    //                 webhook
    //                     .clone()
    //                     .delete_message(&http, MessageId::from(initial_message_id))
    //                     .await?
    //             }
    //         }
    //     }

    //     sleep(Duration::from_millis(100)).await;
    // }
    Ok(())
}
