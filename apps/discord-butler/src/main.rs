use log::info;
use prisma_client_rust::chrono::Utc;
use serenity::{
    http::Http,
    model::{prelude::Embed, webhook::Webhook},
    utils::Colour,
};
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

    let http = Http::new("");
    let webhook = Webhook::from_url(&http, "")
        .await
        .expect("Replace the webhook with your own");

    let embed_one = Embed::fake(|e| {
        e.title("A proposal title here with link")
            .url("https://www.senatelabs.xyz/proposals/active?from=any&end=365&voted=any&proxy=any")
            .description("with short description with the timestamp thing <t:1683216000:R>")
            .colour(Colour::from_rgb(255, 0, 0))
            .thumbnail("https://www.senatelabs.xyz/assets/Icon/NotVotedYet.png")
            .image("https://www.senatelabs.xyz/assets/Project_Icons/aave_small.png")
            .timestamp(Utc::now())
    });

    let embed_two = Embed::fake(|e| {
        e.title("Another proposal title here with link")
            .url("https://www.senatelabs.xyz/proposals/past")
            .description("ends <t:1683216000:R>")
            .colour(Colour::from_rgb(0, 204, 0))
            .thumbnail("https://www.senatelabs.xyz/assets/Icon/Voted.png")
            .image("https://www.senatelabs.xyz/assets/Project_Icons/aave_small.png")
            .timestamp(Utc::now())
    });

    webhook
        .execute(&http, false, |w| {
            w.embeds(vec![embed_one, embed_two])
                .username("Senate Butler Black")
                .avatar_url("https://www.senatelabs.xyz/assets/Senate_Logo/64/Black.png")
        })
        .await
        .expect("Could not execute webhook.");
}
