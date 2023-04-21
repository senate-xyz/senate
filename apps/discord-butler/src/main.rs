use log::info;
mod prisma;
use std::sync::Arc;

use env_logger::{Builder, Env};
use prisma::PrismaClient;

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

    info!("discord-butler start");

    let _client = Arc::new(PrismaClient::_builder().build().await.unwrap());
}
