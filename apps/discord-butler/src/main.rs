#![deny(unused_crate_dependencies)]

mod dispatch;
mod generate;
pub mod prisma;
use dispatch::{
    ended::dispatch_ended_proposal_notifications,
    ending_soon::dispatch_ending_soon_notifications,
};
use generate::{
    ended::generate_ended_proposal_notifications,
    ending_soon::generate_ending_soon_notifications,
};
use prisma::NotificationType;
use tokio::try_join;
mod utils {
    pub mod vote;
}

use std::sync::Arc;
use tokio::time::sleep;

use env_logger::{Builder, Env};

use crate::{
    dispatch::new_proposals::dispatch_new_proposal_notifications,
    generate::new_proposals::generate_new_proposal_notifications,
    prisma::PrismaClient,
};

fn init_logger() {
    let env = Env::default()
        .filter_or("LOG_LEVEL", "info")
        .write_style_or("LOG_STYLE", "always");

    Builder::from_env(env)
        .format_level(false)
        .format_timestamp_nanos()
        .init();
}

#[tokio::main]
async fn main() {
    init_logger();

    let client = Arc::new(PrismaClient::_builder().build().await.unwrap());

    let client_for_new_proposals: Arc<PrismaClient> = Arc::clone(&client);
    let new_proposals_task = tokio::task::spawn(async move {
        loop {
            generate_new_proposal_notifications(&client_for_new_proposals).await;
            dispatch_new_proposal_notifications(&client_for_new_proposals).await;

            sleep(std::time::Duration::from_secs(60)).await;
        }
    });

    let client_for_ending_soon = Arc::clone(&client);
    let ending_soon_task = tokio::task::spawn(async move {
        loop {
            generate_ending_soon_notifications(
                &client_for_ending_soon,
                NotificationType::FirstReminderDiscord,
            )
            .await;

            generate_ending_soon_notifications(
                &client_for_ending_soon,
                NotificationType::SecondReminderDiscord,
            )
            .await;

            dispatch_ending_soon_notifications(&client_for_ending_soon).await;

            sleep(std::time::Duration::from_secs(60)).await;
        }
    });

    let client_for_ended_proposals: Arc<PrismaClient> = Arc::clone(&client);
    let ended_proposals_task = tokio::task::spawn(async move {
        loop {
            generate_ended_proposal_notifications(&client_for_ended_proposals).await;
            dispatch_ended_proposal_notifications(&client_for_ended_proposals).await;

            sleep(std::time::Duration::from_secs(60)).await;
        }
    });

    try_join!(new_proposals_task, ending_soon_task, ended_proposals_task).unwrap();
}
