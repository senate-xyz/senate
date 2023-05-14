#![deny(unused_crate_dependencies)]

mod messages;
#[allow(warnings, unused)]
pub mod prisma;
mod utils {
    pub mod vote;
}

use log::info;
use serenity::{http::Http, model::webhook::Webhook};
use std::{sync::Arc, time::Duration};
use tokio::time::sleep;

use env_logger::{Builder, Env};

use crate::{
    messages::{ended::get_past_embeds, ending_soon::get_ending_soon_embeds, new::get_new_embeds},
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

    info!("discord-butler start");

    let client = Arc::new(PrismaClient::_builder().build().await.unwrap());

    notify_all_users(&client).await;

    info!("discord-butler end");
}

async fn notify_all_users(client: &Arc<PrismaClient>) {
    info!("discord-butler notify_all_users");

    let users = client
        .user()
        .find_many(vec![
            prisma::user::discordnotifications::equals(true),
            prisma::user::discordwebhook::starts_with("https://".to_string()),
        ])
        .exec()
        .await
        .unwrap();

    for user in users {
        notify_user(user.address, user.discordwebhook, &client).await;
    }
}

async fn notify_user(username: String, webhook_url: String, client: &Arc<PrismaClient>) {
    let http = Http::new("");

    let webhook = Webhook::from_url(&http, webhook_url.as_str())
        .await
        .expect("Missing webhook");

    let ending_soon_embeds = get_ending_soon_embeds(&username, client).await.unwrap();

    webhook
        .execute(&http, false, |w| w.content("**Proposals Ending Soon** The voting on these proposals is going to end in the next 72 hours. You might want to act on them soon.")
        .username("Senate Butler")
        .avatar_url("https://www.senatelabs.xyz/assets/Discord/Profile_picture.gif"))
        .await
        .expect("Could not execute webhook.");

    sleep(Duration::from_secs(1)).await;

    for chunk in ending_soon_embeds.chunks(5) {
        webhook
            .execute(&http, false, |w| {
                w.embeds(chunk.to_vec())
                    .username("Senate Butler")
                    .avatar_url("https://www.senatelabs.xyz/assets/Discord/Profile_picture.gif")
            })
            .await
            .expect("Could not execute webhook.");

        sleep(Duration::from_secs(1)).await;
    }

    ////

    let new_embeds = get_new_embeds(&username, client).await.unwrap();

    webhook
        .execute(&http, false, |w| w.content("**New Proposals** These are the proposals that were created in the last 24 hours. You might want to check them out.")
        .username("Senate Butler")
       .avatar_url("https://www.senatelabs.xyz/assets/Discord/Profile_picture.gif"))
        .await
        .expect("Could not execute webhook.");

    sleep(Duration::from_secs(1)).await;

    for chunk in new_embeds.chunks(5) {
        webhook
            .execute(&http, false, |w| {
                w.embeds(chunk.to_vec())
                    .username("Senate Butler")
                    .avatar_url("https://www.senatelabs.xyz/assets/Discord/Profile_picture.gif")
            })
            .await
            .expect("Could not execute webhook.");

        sleep(Duration::from_secs(1)).await;
    }

    ////

    let past_embeds = get_past_embeds(&username, client).await.unwrap();

    webhook
        .execute(&http, false, |w| w.content("**Past Proposals** These are the proposals that ended in the last 24 hours. You might want to check them out.")
        .username("Senate Butler")
        .avatar_url("https://www.senatelabs.xyz/assets/Discord/Profile_picture.gif"))
        .await
        .expect("Could not execute webhook.");

    sleep(Duration::from_secs(1)).await;

    for chunk in past_embeds.chunks(5) {
        webhook
            .execute(&http, false, |w| {
                w.embeds(chunk.to_vec())
                    .username("Senate Butler")
                    .avatar_url("https://www.senatelabs.xyz/assets/Discord/Profile_picture.gif")
            })
            .await
            .expect("Could not execute webhook.");

        sleep(Duration::from_secs(1)).await;
    }

    ////

    webhook
        .execute(&http, false, |w| w.content("These are the proposals to the DAOs you’re subscribed to on Senate.You can edit your DAO subscriptions and notification settings on https://www.senatelabs.xyz/settings/notifications")
        .username("Senate Butler")
        .avatar_url("https://www.senatelabs.xyz/assets/Discord/Profile_picture.gif"))
        .await
        .expect("Could not execute webhook.");
}
