use log::info;
use prisma_client_rust::chrono::Utc;
use serenity::{
    http::Http,
    model::{prelude::Embed, webhook::Webhook},
    utils::Colour,
};
mod prisma;
use anyhow::Result;
use std::{sync::Arc, time::Duration};
use tokio::time::sleep;

use env_logger::{Builder, Env};
use prisma::{subscription, PrismaClient, ProposalState};

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
    let webhook = Webhook::from_url(&http, "")
        .await
        .expect("Replace the webhook with your own");

    let mut embeds = vec![];

    let mut proposals =
        get_active_proposals("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266".to_string())
            .await
            .unwrap();

    proposals.sort_by_key(|p| p.timeend);

    for proposal in proposals {
        let voted = get_vote(
            "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266".to_string(),
            proposal.id.to_string(),
        )
        .await
        .unwrap();

        info!("{:?}", voted);

        if voted {
            embeds.push(Embed::fake(|e| {
                e.title(proposal.name)
                    .description(format!("ends <t:{}:R>", proposal.timeend.timestamp()))
                    .url(proposal.url)
                    .colour(Colour::from_rgb(0, 128, 0))
                    .thumbnail("https://www.senatelabs.xyz/assets/Icon/Voted.png")
                    .footer(|f| f.text("sent"))
                    .timestamp(Utc::now())
            }));
        } else {
            embeds.push(Embed::fake(|e| {
                e.title(proposal.name)
                    .description(format!("ends <t:{}:R>", proposal.timeend.timestamp()))
                    .url(proposal.url)
                    .colour(Colour::from_rgb(255, 0, 0))
                    .thumbnail("https://www.senatelabs.xyz/assets/Icon/NotVotedYet.png")
                    .footer(|f| f.text("sent"))
                    .timestamp(Utc::now())
            }));
        }
    }

    info!("{:?}", embeds.len());

    for chunk in embeds.chunks(5) {
        info!("message");

        webhook
            .execute(&http, false, |w| {
                w.embeds(chunk.to_vec())
                    .username("Senate Butler")
                    .avatar_url("https://www.senatelabs.xyz/assets/Senate_Logo/64/Black.png")
            })
            .await
            .expect("Could not execute webhook.");

        sleep(Duration::from_secs(1)).await;
    }
}

async fn get_vote(username: String, proposal_id: String) -> Result<bool> {
    let client = Arc::new(PrismaClient::_builder().build().await.unwrap());

    let user = client
        .user()
        .find_first(vec![prisma::user::name::equals(username)])
        .include(prisma::user::include!({ voters }))
        .exec()
        .await
        .unwrap()
        .unwrap();

    let mut voted = false;

    for voter in user.voters {
        let vote = client
            .vote()
            .find_first(vec![
                prisma::vote::proposalid::equals(proposal_id.to_string()),
                prisma::vote::voteraddress::equals(voter.address),
            ])
            .exec()
            .await
            .unwrap();

        match vote {
            Some(_) => voted = true,
            None => {}
        }
    }

    Ok(voted)
}

async fn get_active_proposals(username: String) -> Result<Vec<prisma::proposal::Data>> {
    let client = Arc::new(PrismaClient::_builder().build().await.unwrap());

    let user = client
        .user()
        .find_first(vec![prisma::user::name::equals(username)])
        .exec()
        .await
        .unwrap()
        .unwrap();

    let subscribed_daos = client
        .subscription()
        .find_many(vec![subscription::userid::equals(user.id)])
        .exec()
        .await
        .unwrap();

    let proposals = client
        .proposal()
        .find_many(vec![
            prisma::proposal::daoid::in_vec(subscribed_daos.into_iter().map(|d| d.daoid).collect()),
            prisma::proposal::state::equals(ProposalState::Active),
        ])
        .exec()
        .await
        .unwrap();

    Ok(proposals)
}
