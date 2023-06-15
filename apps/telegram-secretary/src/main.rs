#![deny(unused_crate_dependencies)]
#![allow(unused_imports)]
#![allow(unused_parens)]

mod dispatch;
mod generate;
pub mod prisma;
use log::info;
use std::{env, sync::Arc};
use teloxide::{
    adaptors::{throttle::Limits, DefaultParseMode, Throttle},
    prelude::*,
    types::ParseMode,
    utils::command::BotCommands,
};
use tokio::time::sleep;
use tracing::debug;
mod utils {
    pub mod vote;
}

pub mod telemetry;
use pyroscope::PyroscopeAgent;
use pyroscope_pprofrs::{pprof_backend, PprofConfig};

use crate::{
    dispatch::{
        ended::dispatch_ended_proposal_notifications,
        ending_soon::dispatch_ending_soon_notifications,
        new_proposals::dispatch_new_proposal_notifications,
    },
    generate::{
        ended::generate_ended_proposal_notifications,
        ending_soon::generate_ending_soon_notifications,
        new_proposals::generate_new_proposal_notifications,
    },
    prisma::{NotificationType, PrismaClient},
};
use dotenv::dotenv;
use tokio::try_join;

#[tokio::main]
async fn main() {
    //sleep to make sure old deployment api connection is closed
    //sleep(std::time::Duration::from_secs(60)).await;

    dotenv().ok();

    telemetry::setup();

    let client = Arc::new(PrismaClient::_builder().build().await.unwrap());
    let bot = Bot::from_env()
        .throttle(Limits::default())
        .parse_mode(ParseMode::Html);
    let botwrapper = Arc::new(bot.clone());

    let client_for_new_proposals: Arc<PrismaClient> = Arc::clone(&client);
    let bot_for_new_proposals: Arc<DefaultParseMode<Throttle<teloxide::Bot>>> =
        Arc::clone(&botwrapper);
    let new_proposals_task = tokio::task::spawn(async move {
        info!("started new_proposals_task");
        loop {
            debug!("loop new_proposals_task");
            generate_new_proposal_notifications(&client_for_new_proposals).await;
            dispatch_new_proposal_notifications(&client_for_new_proposals, &bot_for_new_proposals)
                .await;

            sleep(std::time::Duration::from_secs(60)).await;
        }
    });

    let client_for_ending_soon = Arc::clone(&client);
    let bot_for_ending_soon: Arc<DefaultParseMode<Throttle<teloxide::Bot>>> =
        Arc::clone(&botwrapper);
    let ending_soon_task = tokio::task::spawn(async move {
        info!("started ending_soon_task");
        loop {
            debug!("loop ending_soon_task");
            generate_ending_soon_notifications(
                &client_for_ending_soon,
                NotificationType::FirstReminderTelegram,
            )
            .await;

            generate_ending_soon_notifications(
                &client_for_ending_soon,
                NotificationType::SecondReminderTelegram,
            )
            .await;

            dispatch_ending_soon_notifications(&client_for_ending_soon, &bot_for_ending_soon).await;

            sleep(std::time::Duration::from_secs(60)).await;
        }
    });

    let client_for_ended_proposals: Arc<PrismaClient> = Arc::clone(&client);
    let bot_for_ended_proposals: Arc<DefaultParseMode<Throttle<teloxide::Bot>>> =
        Arc::clone(&botwrapper);
    let ended_proposals_task = tokio::task::spawn(async move {
        info!("started ended_proposals_task");
        loop {
            debug!("loop ended_proposals_task");
            generate_ended_proposal_notifications(&client_for_ended_proposals).await;
            dispatch_ended_proposal_notifications(
                &client_for_ended_proposals,
                &bot_for_ended_proposals,
            )
            .await;

            sleep(std::time::Duration::from_secs(60)).await;
        }
    });

    // let client_for_active_proposals: Arc<PrismaClient> = Arc::clone(&client);
    // let bot_for_active_proposals: Arc<DefaultParseMode<Throttle<teloxide::Bot>>> =
    //     Arc::clone(&botwrapper);
    // let active_proposals_task = tokio::task::spawn(async move {
    //     loop {
    //         update_active_proposal_notifications(
    //             &client_for_active_proposals,
    //             &bot_for_active_proposals,
    //         )
    //         .await;

    //         update_ended_proposal_notifications(
    //             &client_for_active_proposals,
    //             &bot_for_active_proposals,
    //         )
    //         .await;

    //         sleep(std::time::Duration::from_secs(10 * 60)).await;
    //     }
    // });

    let replybot = Bot::from_env();

    Command::repl(replybot, answer).await;

    try_join!(
        new_proposals_task,
        ending_soon_task,
        ended_proposals_task,
        //active_proposals_task
    )
    .unwrap();
}

#[derive(BotCommands, Clone)]
#[command(
    rename_rule = "lowercase",
    description = "These commands are supported:"
)]
enum Command {
    #[command(description = "Start")]
    Start,
}

async fn answer(bot: Bot, msg: Message, cmd: Command) -> ResponseResult<()> {
    match cmd {
        Command::Start => {
            bot.send_message(msg.chat.id, format!("ChatId: {}", msg.chat.id))
                .await?
        }
    };

    Ok(())
}
