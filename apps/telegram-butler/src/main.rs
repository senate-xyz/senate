#![deny(unused_crate_dependencies)]
#![allow(unused_imports)]
#![allow(unused_parens)]

pub mod prisma;

use log::info;
use std::sync::Arc;
use teloxide::{prelude::*, utils::command::BotCommands};

use env_logger::{Builder, Env};

use crate::prisma::PrismaClient;
use dotenv::dotenv;

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

    info!("telegram-butler start");

    log::info!("Starting throw dice bot...");

    let bot = Bot::from_env();

    bot.clone()
        .send_message(ChatId(5679862895), "Your message here")
        .await
        .log_on_error()
        .await;

    teloxide::repl(bot.clone(), |bot: Bot, msg: Message| async move {
        println!("{:?}", msg.chat.id);
        bot.send_dice(msg.chat.id).await?;

        Ok(())
    })
    .await;

    let client = Arc::new(PrismaClient::_builder().build().await.unwrap());

    info!("telegram-butler end");
}
