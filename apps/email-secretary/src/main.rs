#![deny(unused_crate_dependencies)]
#![allow(unused_imports)]
#![allow(unused_parens)]

use std::{env, sync::Arc, time::Duration};

use chrono::{Timelike, Utc};
use clokwerk::{AsyncScheduler, Job, TimeUnits};
use dotenv::dotenv;
use log::info;
use pyroscope::PyroscopeAgent;
use pyroscope_pprofrs::{pprof_backend, PprofConfig};
use tokio::{time::sleep, try_join};
use tracing::{debug, event, Level};

use crate::{
    bulletin::bulletin_emails::{send_bulletin_emails, send_triggered_emails},
    prisma::PrismaClient,
    quorum::quroum_emails::send_quorum_email,
};

pub mod prisma;
mod telemetry;

pub mod bulletin {
    pub mod bulletin_emails;
}

pub mod quorum {
    pub mod quroum_emails;
}

pub mod utils {
    pub mod countdown;
    pub mod posthog;
    pub mod vote;
}

#[tokio::main]
async fn main() {
    dotenv().ok();
    telemetry::setup();

    let client = Arc::new(PrismaClient::_builder().build().await.unwrap());

    let client_for_bulletin: Arc<PrismaClient> = Arc::clone(&client);

    let mut scheduler = AsyncScheduler::with_tz(chrono::Utc);
    scheduler
        .every(1_u32.day())
        .at("8:00 am")
        .run(move || send_bulletin_emails(client_for_bulletin.clone()));

    tokio::spawn(async move {
        loop {
            scheduler.run_pending().await;
            tokio::time::sleep(Duration::from_millis(100)).await;
        }
    });

    let client_for_triggered_bulletin: Arc<PrismaClient> = Arc::clone(&client);
    let triggered_bulletin_task = tokio::task::spawn(async move {
        loop {
            match send_triggered_emails(&client_for_triggered_bulletin).await {
                Ok(_) => event!(Level::INFO, "send_triggered_emails ok"),
                Err(e) => event!(Level::ERROR, err = e.to_string(), "failed to send bulletin"),
            };
            sleep(Duration::from_secs(60)).await;
        }
    });

    let client_for_quorum = Arc::clone(&client);
    let quroum_task = tokio::task::spawn(async move {
        loop {
            match send_quorum_email(&client_for_quorum).await {
                Ok(_) => event!(Level::INFO, "send_quorum_email ok"),
                Err(e) => event!(Level::ERROR, err = e.to_string(), "failed to send bulletin"),
            };
            sleep(Duration::from_secs(60)).await;
        }
    });

    try_join!(triggered_bulletin_task, quroum_task).unwrap();
}
