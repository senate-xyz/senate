#![deny(unused_crate_dependencies)]
#![allow(unused_imports)]
#![allow(unused_parens)]

pub mod prisma;
pub mod bulletin {
    pub mod bulletin_emails;
}
pub mod quorum {
    pub mod quroum_emails;
}
pub mod utils {
    pub mod countdown;
    pub mod vote;
}
pub mod telemetry;

use chrono::{Timelike, Utc};
use dotenv::dotenv;
use log::info;
use pyroscope::PyroscopeAgent;
use pyroscope_pprofrs::{pprof_backend, PprofConfig};
use std::{env, sync::Arc, time::Duration};
use tokio::{time::sleep, try_join};
use tracing::debug;

use crate::{
    bulletin::bulletin_emails::{send_bulletin_emails, send_triggered_emails},
    prisma::PrismaClient,
    quorum::quroum_emails::send_quorum_email,
};

#[tokio::main]
async fn main() {
    dotenv().ok();

    telemetry::setup();

    let client = Arc::new(PrismaClient::_builder().build().await.unwrap());

    let client_for_bulletin: Arc<PrismaClient> = Arc::clone(&client);
    let bulletin_task = tokio::task::spawn(async move {
        info!("started bulletin_task");
        loop {
            debug!("loop bulletin_task");
            send_triggered_emails(&client_for_bulletin).await;

            let now = Utc::now();
            if now.hour() == 8 && now.minute() == 0 {
                send_bulletin_emails(&client_for_bulletin).await;
            }

            sleep(Duration::from_secs(60)).await;
        }
    });

    let client_for_quorum = Arc::clone(&client);
    let quroum_task = tokio::task::spawn(async move {
        info!("started quroum_task");
        loop {
            debug!("loop quroum_task");
            send_quorum_email(&client_for_quorum).await;

            sleep(Duration::from_secs(60)).await;
        }
    });

    try_join!(bulletin_task, quroum_task).unwrap();
}
