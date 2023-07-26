#![deny(unused_crate_dependencies)]
#![allow(unused_imports)]
#![allow(unused_parens)]

use std::{env, sync::Arc};

use dotenv::dotenv;
use log::{debug, info};
use teloxide::{
    adaptors::{throttle::Limits, DefaultParseMode, Throttle},
    dispatching::dialogue::GetChatId,
    prelude::*,
    types::ParseMode,
    utils::command::BotCommands,
};
use tokio::{time::sleep, try_join};

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

mod dispatch;
mod generate;
pub mod prisma;

mod utils {
    pub mod vote;
}

#[tokio::main]
async fn main() {
    //sleep to make sure old deployment api connection is closed
    // sleep(std::time::Duration::from_secs(60)).await;

    dotenv().ok();

    tracing_subscriber::fmt()
        .pretty()
        .with_max_level(tracing::Level::INFO)
        .init();

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
            let text = msg.text().unwrap();
            let (_, id_with_quotes) = text.split_once(' ').unwrap();
            let id = id_with_quotes.trim_matches('"');

            if id.len() == 0 {
                bot.send_message(msg.chat.id, "You can't start the bot directly. Please sign up to Senate Telegram Notifications using https://senatelabs.xyz/settings/notifications.")
                .await?;
            } else {
                let prisma_client = Arc::new(PrismaClient::_builder().build().await.unwrap());

                prisma_client
                    .user()
                    .update(
                        prisma::user::id::equals(id.to_string()),
                        vec![
                            prisma::user::telegramnotifications::set(true),
                            prisma::user::telegramchatid::set(msg.chat.id.to_string()),
                        ],
                    )
                    .exec()
                    .await
                    .unwrap();

                let user = prisma_client
                    .user()
                    .find_first(vec![prisma::user::id::equals(id.to_string())])
                    .exec()
                    .await
                    .unwrap()
                    .unwrap();

                bot.send_message(msg.chat.id, format!("Hello {}!", user.address.unwrap()))
                    .await?;
                bot.send_message(
                    msg.chat.id,
                    "You are now subscribed to Senate Telegram Notifications!",
                )
                .await?;
            }
        }
    };

    Ok(())
}
