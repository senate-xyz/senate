use crate::{
    prisma::{self, subscription, PrismaClient, ProposalState},
    utils::vote::get_vote,
};
use anyhow::Result;
use log::info;
use prisma_client_rust::chrono::{self, Utc};
use serenity::{json::Value, model::prelude::Embed, utils::Colour};
use std::sync::Arc;

prisma::proposal::include!(proposal_with_dao { dao });

pub async fn get_past_embeds(username: String) -> Result<Vec<Value>> {
    let mut proposals = get_past_proposals(username.clone()).await?;
    proposals.sort_by_key(|p| p.timeend);
    let embeds = build_past_embeds(username, proposals).await?;
    Ok(embeds)
}

pub async fn build_past_embeds(
    username: String,
    proposals: Vec<proposal_with_dao::Data>,
) -> Result<Vec<Value>> {
    let mut embeds: Vec<Value> = vec![];

    for proposal in proposals {
        let voted = get_vote(username.clone(), proposal.id.to_string())
            .await
            .unwrap();

        info!("{:?}", voted);

        if voted {
            embeds.push(Embed::fake(|e| {
                e.title(proposal.name)
                    .description(format!(
                        "**{}** proposal ended <t:{}:R>",
                        proposal.dao.name,
                        proposal.timeend.timestamp()
                    ))
                    .url(proposal.url)
                    .colour(Colour::from_rgb(0, 128, 0))
                    .thumbnail("https://www.senatelabs.xyz/assets/Discord/Voted_large.png")
                    .image("https://placehold.co/1000x1/png")
            }));
        } else {
            embeds.push(Embed::fake(|e| {
                e.title(proposal.name)
                    .description(format!(
                        "**{}** proposal ended <t:{}:R>",
                        proposal.dao.name,
                        proposal.timeend.timestamp()
                    ))
                    .url(proposal.url)
                    .colour(Colour::from_rgb(255, 0, 0))
                    .thumbnail("https://www.senatelabs.xyz/assets/Discord/DidntVote_large.png")
                    .image("https://placehold.co/1000x1/png")
            }));
        }
    }
    Ok(embeds)
}

async fn get_past_proposals(username: String) -> Result<Vec<proposal_with_dao::Data>> {
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
            prisma::proposal::state::in_vec(vec![
                ProposalState::Executed,
                ProposalState::Canceled,
                ProposalState::Defeated,
                ProposalState::Succeeded,
                ProposalState::Queued,
                ProposalState::Expired,
            ]),
            prisma::proposal::timeend::gt((Utc::now() - chrono::Duration::hours(24)).into()),
        ])
        .include(proposal_with_dao::include())
        .exec()
        .await
        .unwrap();

    Ok(proposals)
}