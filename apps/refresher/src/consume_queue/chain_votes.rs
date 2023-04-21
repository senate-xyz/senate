use anyhow::Result;
use log::warn;
use std::{cmp, env, sync::Arc};

use prisma_client_rust::chrono::Utc;
use reqwest::Client;
use serde::Deserialize;

use tokio::task;

use crate::{
    prisma::{self, daohandler, PrismaClient},
    RefreshEntry,
};

#[allow(non_snake_case)]
#[derive(Deserialize)]
struct ApiResponse {
    voter_address: String,
    success: bool,
}

pub(crate) async fn consume_chain_votes(
    entry: RefreshEntry,
    client: &Arc<PrismaClient>,
) -> Result<()> {
    let detective_url = match env::var_os("DETECTIVE_URL") {
        Some(v) => v.into_string().unwrap(),
        None => panic!("$DETECTIVE_URL is not set"),
    };

    let post_url = format!("{}/votes/chain_votes", detective_url);

    let http_client = Client::builder().build().unwrap();

    let dao_handler = client
        .daohandler()
        .find_first(vec![daohandler::id::equals(entry.handler_id.to_string())])
        .exec()
        .await
        .unwrap()
        .unwrap();

    let client_ref = client.clone();
    let dao_handler_ref = dao_handler;
    let voters_ref = entry.voters.clone();

    task::spawn(async move {
        let response = http_client
            .post(&post_url)
            .json(&serde_json::json!({ "daoHandlerId": entry.handler_id, "voters": entry.voters }))
            .send()
            .await;

        match response {
            Ok(res) => {
                let data: Vec<ApiResponse> = res.json().await.unwrap();

                let ok_voters: Vec<String> = data
                    .iter()
                    .filter(|result| result.success)
                    .map(|result| result.voter_address.clone())
                    .collect();

                let nok_voters: Vec<String> = data
                    .iter()
                    .filter(|result| !result.success)
                    .map(|result| result.voter_address.clone())
                    .collect();

                let ok_voter_ids = client_ref
                    .voter()
                    .find_many(vec![prisma::voter::address::in_vec(ok_voters.clone())])
                    .exec()
                    .await
                    .unwrap()
                    .iter()
                    .map(|voter| voter.id.clone())
                    .collect();

                let nok_voter_ids = client_ref
                    .voter()
                    .find_many(vec![prisma::voter::address::in_vec(nok_voters.clone())])
                    .exec()
                    .await
                    .unwrap()
                    .iter()
                    .map(|voter| voter.id.clone())
                    .collect();

                let update_ok_voters = client_ref.voterhandler().update_many(
                    vec![
                        prisma::voterhandler::voterid::in_vec(ok_voter_ids),
                        prisma::voterhandler::daohandlerid::equals(dao_handler_ref.id.to_string()),
                    ],
                    vec![
                        prisma::voterhandler::refreshstatus::set(prisma::RefreshStatus::Done),
                        prisma::voterhandler::lastrefresh::set(Utc::now().into()),
                    ],
                );

                let update_nok_voters = client_ref.voterhandler().update_many(
                    vec![
                        prisma::voterhandler::voterid::in_vec(nok_voter_ids),
                        prisma::voterhandler::daohandlerid::equals(dao_handler_ref.id.to_string()),
                    ],
                    vec![
                        prisma::voterhandler::refreshstatus::set(prisma::RefreshStatus::New),
                        prisma::voterhandler::lastrefresh::set(Utc::now().into()),
                    ],
                );

                client_ref
                    ._batch((update_ok_voters, update_nok_voters))
                    .await
                    .unwrap();

                if ok_voters.len() > nok_voters.len() {
                    let _ = client_ref
                        .daohandler()
                        .update(
                            daohandler::id::equals(dao_handler_ref.id),
                            vec![daohandler::votersrefreshspeed::set(cmp::min(
                                dao_handler_ref.votersrefreshspeed
                                    + (dao_handler_ref.votersrefreshspeed * 75 / 100),
                                100000000,
                            ))],
                        )
                        .exec()
                        .await;
                } else {
                    let _ = client_ref
                        .daohandler()
                        .update(
                            daohandler::id::equals(dao_handler_ref.id),
                            vec![daohandler::votersrefreshspeed::set(cmp::max(
                                dao_handler_ref.votersrefreshspeed
                                    - (dao_handler_ref.votersrefreshspeed * 50 / 100),
                                100,
                            ))],
                        )
                        .exec()
                        .await;
                };
            }
            Err(e) => {
                warn!("refresher chain votes - {:#?}", e);

                let _ = client_ref
                    .daohandler()
                    .update(
                        daohandler::id::equals(dao_handler_ref.clone().id),
                        vec![daohandler::votersrefreshspeed::set(cmp::max(
                            dao_handler_ref.votersrefreshspeed
                                - (dao_handler_ref.votersrefreshspeed * 50 / 100),
                            100,
                        ))],
                    )
                    .exec()
                    .await;

                let voter_ids = client_ref
                    .voter()
                    .find_many(vec![prisma::voter::address::in_vec(voters_ref)])
                    .exec()
                    .await
                    .unwrap()
                    .iter()
                    .map(|voter| voter.id.clone())
                    .collect();

                let _ = client_ref
                    .voterhandler()
                    .update_many(
                        vec![
                            prisma::voterhandler::voterid::in_vec(voter_ids),
                            prisma::voterhandler::daohandlerid::equals(
                                dao_handler_ref.id.to_string(),
                            ),
                        ],
                        vec![
                            prisma::voterhandler::refreshstatus::set(prisma::RefreshStatus::New),
                            prisma::voterhandler::lastrefresh::set(Utc::now().into()),
                            prisma::voterhandler::chainindex::set(Some(0)),
                        ],
                    )
                    .exec()
                    .await;
            }
        }
    });

    Ok(())
}