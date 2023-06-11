#![deny(unused_crate_dependencies)]
#![allow(unused_imports)]
#![allow(unused_parens)]

mod dispatch;
mod generate;
pub mod prisma;
use dispatch::{
    ended::dispatch_ended_proposal_notifications, ending_soon::dispatch_ending_soon_notifications,
    update_active::update_active_proposal_notifications,
    update_ended::update_ended_proposal_notifications,
};
use generate::{
    ended::generate_ended_proposal_notifications, ending_soon::generate_ending_soon_notifications,
};
use prisma::NotificationType;
use pyroscope::PyroscopeAgent;
use pyroscope_pprofrs::{pprof_backend, PprofConfig};
use tokio::try_join;
mod utils {
    pub mod vote;
}

use dotenv::dotenv;
use std::{env, sync::Arc};
use tokio::time::sleep;

use crate::{
    dispatch::new_proposals::dispatch_new_proposal_notifications,
    generate::new_proposals::generate_new_proposal_notifications, prisma::PrismaClient,
};

#[tokio::main]
async fn main() {
    dotenv().ok();
    let telemetry_agent;

    if env::consts::OS != "macos" {
        let telemetry_key = match env::var_os("TELEMETRY_KEY") {
            Some(v) => v.into_string().unwrap(),
            None => panic!("$TELEMETRY_KEY is not set"),
        };

        let exec_env = match env::var_os("EXEC_ENV") {
            Some(v) => v.into_string().unwrap(),
            None => panic!("$EXEC_ENV is not set"),
        };

        telemetry_agent =
            PyroscopeAgent::builder("https://profiles-prod-004.grafana.net", "discord-secretary")
                .backend(pprof_backend(PprofConfig::new().sample_rate(100)))
                .basic_auth("491298", telemetry_key)
                .tags([("env", exec_env.as_str())].to_vec())
                .build()
                .unwrap();

        let _ = telemetry_agent.start().unwrap();
    }

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

    let client_for_active_proposals: Arc<PrismaClient> = Arc::clone(&client);
    let active_proposals_task = tokio::task::spawn(async move {
        loop {
            update_active_proposal_notifications(&client_for_active_proposals).await;
            update_ended_proposal_notifications(&client_for_active_proposals).await;

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
