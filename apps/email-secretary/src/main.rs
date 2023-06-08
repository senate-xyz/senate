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
use log::info;
use std::{sync::Arc, time::Duration};
use tokio::time::sleep;

use env_logger::{Builder, Env};

use dotenv::dotenv;
use tokio::try_join;

use crate::{
    bulletin::bulletin_emails::{send_bulletin_emails, send_triggered_emails},
    prisma::PrismaClient,
    quorum::quroum_emails::send_quorum_email,
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
    dotenv().ok();
    init_logger();

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
