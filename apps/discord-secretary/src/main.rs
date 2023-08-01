#![deny(unused_crate_dependencies)]
#![allow(unused_imports)]
#![allow(unused_parens)]

use std::{env, sync::Arc};

use dotenv::dotenv;
use tokio::{time::sleep, try_join};
use tracing::{debug, event, info, Level};

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
mod telemetry;

mod utils {
    pub mod posthog;
    pub mod vote;
}

#[tokio::main]
async fn main() {
    dotenv().ok();
    telemetry::setup();

    tracing_subscriber::fmt()
        .pretty()
        .with_max_level(tracing::Level::INFO)
        .init();

    let client = Arc::new(PrismaClient::_builder().build().await.unwrap());

    let client_for_new_proposals: Arc<PrismaClient> = Arc::clone(&client);
    let new_proposals_task = tokio::task::spawn(async move {
        loop {
            match generate_new_proposal_notifications(&client_for_new_proposals).await {
                Ok(_) => event!(Level::INFO, "generated new"),
                Err(e) => event!(Level::ERROR, err = e.to_string(), "failed to generate new"),
            };
            match dispatch_new_proposal_notifications(&client_for_new_proposals).await {
                Ok(_) => event!(Level::INFO, "dispatched new"),
                Err(e) => event!(Level::ERROR, err = e.to_string(), "failed to dispatch new"),
            };

            sleep(std::time::Duration::from_secs(60)).await;
        }
    });

    let client_for_ending_soon = Arc::clone(&client);
    let ending_soon_task = tokio::task::spawn(async move {
        loop {
            match generate_ending_soon_notifications(
                &client_for_ending_soon,
                NotificationType::FirstReminderDiscord,
            )
            .await
            {
                Ok(_) => event!(Level::INFO, "generated ending"),
                Err(e) => event!(
                    Level::ERROR,
                    err = e.to_string(),
                    "failed to generate ending"
                ),
            };

            // generate_ending_soon_notifications(
            //     &client_for_ending_soon,
            //     NotificationType::SecondReminderDiscord,
            // )
            // .await;

            match dispatch_ending_soon_notifications(&client_for_ending_soon).await {
                Ok(_) => event!(Level::INFO, "dispatch ending"),
                Err(e) => event!(
                    Level::ERROR,
                    err = e.to_string(),
                    "failed to dispatch ending"
                ),
            };

            sleep(std::time::Duration::from_secs(60)).await;
        }
    });

    let client_for_ended_proposals: Arc<PrismaClient> = Arc::clone(&client);
    let ended_proposals_task = tokio::task::spawn(async move {
        loop {
            match generate_ended_proposal_notifications(&client_for_ended_proposals).await {
                Ok(_) => event!(Level::INFO, "generated ended"),
                Err(e) => event!(
                    Level::ERROR,
                    err = e.to_string(),
                    "failed to generate ended"
                ),
            };
            match dispatch_ended_proposal_notifications(&client_for_ended_proposals).await {
                Ok(_) => event!(Level::INFO, "dispatch ended"),
                Err(e) => event!(
                    Level::ERROR,
                    err = e.to_string(),
                    "failed to dispatch ended"
                ),
            };

            sleep(std::time::Duration::from_secs(60)).await;
        }
    });

    let client_for_active_proposals: Arc<PrismaClient> = Arc::clone(&client);
    let active_proposals_task = tokio::task::spawn(async move {
        info!("started active_proposals_task");
        loop {
            debug!("loop active_proposals_task");
            match update_active_proposal_notifications(&client_for_active_proposals).await {
                Ok(_) => event!(Level::INFO, "update active"),
                Err(e) => event!(Level::ERROR, err = e.to_string(), "failed to update active"),
            };
            match update_hidden_proposal_notifications(&client_for_active_proposals).await {
                Ok(_) => event!(Level::INFO, "update hidden"),
                Err(e) => event!(Level::ERROR, err = e.to_string(), "failed to update hidden"),
            };

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
