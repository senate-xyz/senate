#![deny(unused_crate_dependencies)]
#![allow(unused_imports)]
#![allow(unused_parens)]

use std::{env, sync::Arc};

use dotenv::dotenv;
use pyroscope::PyroscopeAgent;
use pyroscope_pprofrs::{pprof_backend, PprofConfig};
use tokio::time::sleep;
use tokio::try_join;
use tracing::{debug, info};

use dispatch::{
    ended::dispatch_ended_proposal_notifications, ending_soon::dispatch_ending_soon_notifications,
    update_active::update_active_proposal_notifications,
    update_hidden::update_hidden_proposal_notifications,
};
use generate::{
    ended::generate_ended_proposal_notifications, ending_soon::generate_ending_soon_notifications,
};
use prisma::NotificationType;

use crate::{
    dispatch::new_proposals::dispatch_new_proposal_notifications,
    generate::new_proposals::generate_new_proposal_notifications, prisma::PrismaClient,
};

mod dispatch;
mod generate;
pub mod prisma;

mod utils {
    pub mod vote;
}

pub mod telemetry;

#[tokio::main]
async fn main() {
    dotenv().ok();

    telemetry::setup();

    let client = Arc::new(PrismaClient::_builder().build().await.unwrap());

    let client_for_new_proposals: Arc<PrismaClient> = Arc::clone(&client);
    let new_proposals_task = tokio::task::spawn(async move {
        info!("started new_proposals_task");
        loop {
            debug!("loop new_proposals_task");
            generate_new_proposal_notifications(&client_for_new_proposals).await;
            dispatch_new_proposal_notifications(&client_for_new_proposals).await;

            sleep(std::time::Duration::from_secs(60)).await;
        }
    });

    let client_for_ending_soon = Arc::clone(&client);
    let ending_soon_task = tokio::task::spawn(async move {
        info!("started ending_soon_task");
        loop {
            debug!("loop ending_soon_task");
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
        info!("started ended_proposals_task");
        loop {
            debug!("loop ended_proposals_task");
            generate_ended_proposal_notifications(&client_for_ended_proposals).await;
            dispatch_ended_proposal_notifications(&client_for_ended_proposals).await;

            sleep(std::time::Duration::from_secs(60)).await;
        }
    });

    let client_for_active_proposals: Arc<PrismaClient> = Arc::clone(&client);
    let active_proposals_task = tokio::task::spawn(async move {
        info!("started active_proposals_task");
        loop {
            debug!("loop active_proposals_task");
            update_active_proposal_notifications(&client_for_active_proposals).await;
            update_hidden_proposal_notifications(&client_for_active_proposals).await;

            sleep(std::time::Duration::from_secs(60)).await;
        }
    });

    try_join!(
        new_proposals_task,
        ending_soon_task,
        ended_proposals_task,
        active_proposals_task
    )
    .unwrap();
}
