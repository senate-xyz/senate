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

use chrono::{Timelike, Utc};
use dotenv::dotenv;
use log::info;
use pyroscope::PyroscopeAgent;
use pyroscope_pprofrs::{pprof_backend, PprofConfig};
use std::{env, sync::Arc, time::Duration};
use tokio::time::sleep;
use tokio::try_join;

use crate::{
    bulletin::bulletin_emails::{send_bulletin_emails, send_triggered_emails},
    prisma::PrismaClient,
    quorum::quroum_emails::send_quorum_email,
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
            PyroscopeAgent::builder("https://profiles-prod-004.grafana.net", "email-secretary")
                .backend(pprof_backend(PprofConfig::new().sample_rate(100)))
                .basic_auth("491298", telemetry_key)
                .tags([("env", exec_env.as_str())].to_vec())
                .build()
                .unwrap();

        let _ = telemetry_agent.start().unwrap();
    }

    info!("email-secretary start");

    let client = Arc::new(PrismaClient::_builder().build().await.unwrap());

    let client_for_bulletin: Arc<PrismaClient> = Arc::clone(&client);
    let bulletin_task = tokio::task::spawn(async move {
        loop {
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
        loop {
            send_quorum_email(&client_for_quorum).await;

            sleep(Duration::from_secs(60)).await;
        }
    });

    try_join!(bulletin_task, quroum_task).unwrap();
}
