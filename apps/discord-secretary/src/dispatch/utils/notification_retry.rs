use std::sync::Arc;

use tracing::{debug_span, instrument, Instrument};

use crate::prisma::{notification, NotificationDispatchedState, PrismaClient};

pub async fn update_notification_retry(
    client: &Arc<PrismaClient>,
    notification: notification::Data,
) {
    client
        .notification()
        .update_many(
            vec![
                notification::userid::equals(notification.clone().userid),
                notification::proposalid::equals(notification.clone().proposalid),
                notification::r#type::equals(notification.clone().r#type),
            ],
            match notification.dispatchstatus {
                NotificationDispatchedState::NotDispatched => {
                    vec![notification::dispatchstatus::set(
                        NotificationDispatchedState::FirstRetry,
                    )]
                }
                NotificationDispatchedState::FirstRetry => {
                    vec![notification::dispatchstatus::set(
                        NotificationDispatchedState::SecondRetry,
                    )]
                }
                NotificationDispatchedState::SecondRetry => {
                    vec![notification::dispatchstatus::set(
                        NotificationDispatchedState::ThirdRetry,
                    )]
                }
                NotificationDispatchedState::ThirdRetry => {
                    vec![notification::dispatchstatus::set(
                        NotificationDispatchedState::Failed,
                    )]
                }
                NotificationDispatchedState::Dispatched => todo!(),
                NotificationDispatchedState::Deleted => todo!(),
                NotificationDispatchedState::Failed => todo!(),
            },
        )
        .exec()
        .await
        .unwrap();
}
