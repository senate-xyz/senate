#![deny(unused_crate_dependencies)]

mod dispatch;
mod generate;
pub mod prisma;
mod utils {
    pub mod vote;
}

use std::{sync::Arc, time::Duration};
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

    let new_proposals_task = tokio::task::spawn_blocking(move || async move {
        loop {
            generate_new_proposal_notifications(&client).await;
            dispatch_new_proposal_notifications(&client).await;

            sleep(Duration::from_secs(60)).await;
        }
    });

    new_proposals_task.await.unwrap().await;
}
