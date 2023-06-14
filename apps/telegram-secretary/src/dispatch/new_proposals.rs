use std::{env, sync::Arc, time::Duration};

use prisma_client_rust::chrono::Utc;
use teloxide::{
    adaptors::{DefaultParseMode, Throttle},
    payloads::SendMessageSetters,
    prelude::OnError,
    requests::Requester,
    types::ChatId,
    Bot,
};
use tokio::time::sleep;
use tracing::{debug, debug_span, instrument, Instrument};

use crate::{
    prisma::{self, notification, proposal, user, DaoHandlerType, NotificationType, PrismaClient},
    utils::vote::get_vote,
};

prisma::proposal::include!(proposal_with_dao { dao daohandler });

#[instrument(skip_all, level = "info")]
pub async fn dispatch_new_proposal_notifications(
    client: &Arc<PrismaClient>,
    bot: &Arc<DefaultParseMode<Throttle<teloxide::Bot>>>,
) {
    let notifications = client
        .notification()
        .find_many(vec![
            notification::dispatched::equals(false),
            notification::r#type::equals(NotificationType::NewProposalTelegram),
        ])
        .exec()
        .instrument(debug_span!("get_notifications"))
        .await
        .unwrap();

    for notification in notifications {
        let user = client
            .user()
            .find_first(vec![user::id::equals(notification.userid)])
            .exec()
            .instrument(debug_span!("get_user"))
            .await
            .unwrap()
            .unwrap();

        let proposal = client
            .proposal()
            .find_first(vec![proposal::id::equals(notification.proposalid)])
            .include(proposal_with_dao::include())
            .exec()
            .instrument(debug_span!("get_proposal"))
            .await
            .unwrap()
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

        debug!("Send message");
        let message = bot
            .send_message(
                ChatId(user.telegramchatid.parse().unwrap()),
                format!(
                    "📢 New <b>{}</b> {} proposal ending <b>{}</b>\n<a href=\"{}\"><i>{}</i></a>\n",
                    proposal.dao.name,
                    if proposal.daohandler.r#type == DaoHandlerType::Snapshot {
                        "off-chain"
                    } else {
                        "on-chain"
                    },
                    proposal.timeend.format("%Y-%m-%d %H:%M"),
                    short_url,
                    proposal
                        .name
                        .replace('&', "&amp;")
                        .replace('<', "&lt;")
                        .replace('>', "&gt;")
                        .replace('\"', "&quot;")
                        .replace('\'', "&#39;"),
                ),
            )
            .disable_web_page_preview(true)
            .await;

        match message {
            Ok(msg) => {
                client
                    .notification()
                    .update(
                        notification::userid_proposalid_type(
                            user.id,
                            proposal.id,
                            NotificationType::NewProposalTelegram,
                        ),
                        vec![
                            notification::dispatched::set(true),
                            notification::telegramchatid::set(msg.chat.id.to_string().into()),
                            notification::telegrammessageid::set(msg.id.to_string().into()),
                        ],
                    )
                    .exec()
                    .instrument(debug_span!("update_notifications"))
                    .await
                    .unwrap();
            }
            Err(_) => {}
        }

        sleep(Duration::from_millis(100)).await;
    }
}
