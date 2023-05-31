#![deny(unused_crate_dependencies)]
#![allow(unused_imports)]
#![allow(unused_parens)]

pub mod prisma;
use log::info;
use std::sync::Arc;
use tokio::time::sleep;

use env_logger::{Builder, Env};

use dotenv::dotenv;
use tokio::try_join;

use crate::prisma::PrismaClient;

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

    info!("email-secretaryary start");

    let client = Arc::new(PrismaClient::_builder().build().await.unwrap());
}
