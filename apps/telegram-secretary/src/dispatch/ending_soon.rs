use std::{env, sync::Arc, time::Duration};

use teloxide::{
    adaptors::{DefaultParseMode, Throttle},
    payloads::SendMessageSetters,
    requests::Requester,
    types::ChatId,
    Bot,
};
use tokio::time::sleep;
use tracing::{debug, debug_span, instrument, Instrument};

use crate::prisma::{
    self, notification, proposal, user, DaoHandlerType, NotificationType, PrismaClient,
};

prisma::proposal::include!(proposal_with_dao { dao daohandler });

#[instrument(skip_all)]
pub async fn dispatch_ending_soon_notifications(
    client: &Arc<PrismaClient>,
    bot: &Arc<DefaultParseMode<Throttle<teloxide::Bot>>>,
) {
    let notifications = client
        .notification()
        .find_many(vec![
            notification::dispatched::equals(false),
            notification::r#type::in_vec(vec![
                NotificationType::FirstReminderTelegram,
                NotificationType::SecondReminderTelegram,
            ]),
        ])
        .exec()
        .instrument(debug_span!("get notifications"))
        .await
        .unwrap();

    for notification in notifications {
        let user = client
            .user()
            .find_first(vec![user::id::equals(notification.clone().userid)])
            .exec()
            .instrument(debug_span!("get user"))
            .await
            .unwrap()
            .unwrap();

        let proposal = client
            .proposal()
            .find_first(vec![proposal::id::equals(notification.clone().proposalid)])
            .include(proposal_with_dao::include())
            .exec()
            .instrument(debug_span!("get proposal"))
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

        let message_content = match notification.r#type {
            NotificationType::QuorumNotReachedEmail => todo!(),
            NotificationType::NewProposalDiscord => todo!(),
            NotificationType::FirstReminderDiscord => todo!(),
            NotificationType::SecondReminderDiscord => todo!(),
            NotificationType::ThirdReminderDiscord => todo!(),
            NotificationType::EndedProposalDiscord => todo!(),
            NotificationType::NewProposalTelegram => todo!(),
            NotificationType::FirstReminderTelegram => {
                format!(
                    "⌛ <b>{}</b> {} proposal <b>ends in 2️⃣4️⃣ hours.</b> 🕒 \nVote here 👉 {}",
                    proposal.dao.name,
                    if proposal.daohandler.r#type == DaoHandlerType::Snapshot {
                        "off-chain"
                    } else {
                        "on-chain"
                    },
                    short_url
                )
            }
            NotificationType::SecondReminderTelegram => {
                format!(
                    "🚨 <b>{}</b> {} proposal <b>ends in 6️⃣ hours.</b> 🕒 \nVote here 👉 {}",
                    proposal.dao.name,
                    if proposal.daohandler.r#type == DaoHandlerType::Snapshot {
                        "off-chain"
                    } else {
                        "on-chain"
                    },
                    short_url
                )
            }
            NotificationType::ThirdReminderTelegram => todo!(),
            NotificationType::EndedProposalTelegram => todo!(),
            NotificationType::TriggerBulletinEmail => todo!(),
        };

        debug!("Send message");
        let message = bot
            .send_message(
                ChatId(user.telegramchatid.parse().unwrap()),
                message_content,
            )
            .disable_web_page_preview(true)
            .await;

        match message {
            Ok(msg) => {
                client
                    .notification()
                    .update(
                        notification::userid_proposalid_type(
                            notification.clone().userid,
                            notification.clone().proposalid,
                            notification.clone().r#type,
                        ),
                        vec![
                            notification::dispatched::set(true),
                            notification::telegramchatid::set(msg.chat.id.to_string().into()),
                            notification::telegrammessageid::set(msg.id.to_string().into()),
                        ],
                    )
                    .exec()
                    .instrument(debug_span!("update notification"))
                    .await
                    .unwrap();
            }
            Err(_) => {}
        }

        sleep(Duration::from_millis(100)).await;
    }
}
