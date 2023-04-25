mod messages;
mod prisma;
mod utils {
    pub mod vote;
}

use log::info;
use serenity::{http::Http, model::webhook::Webhook};
use std::time::Duration;
use tokio::time::sleep;

use env_logger::{Builder, Env};

use crate::messages::{
    ended::get_past_embeds, ending_soon::get_ending_soon_embeds, new::get_new_embeds,
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

    let http = Http::new("");
    let webhook = Webhook::from_url(&http, "https://discord.com/api/webhooks/1099955005584314370/8ITvepezt-FnA-hsDtEDzHk5Jy9k3TSEVTsYNJjFe1ND0V_KjIw4mMwVzDA_cItV35nv")
        .await
        .expect("Replace the webhook with your own");

    ////

    let ending_soon_embeds =
        get_ending_soon_embeds("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266".to_string())
            .await
            .unwrap();

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

    let new_embeds = get_new_embeds("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266".to_string())
        .await
        .unwrap();

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

    let past_embeds = get_past_embeds("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266".to_string())
        .await
        .unwrap();

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
