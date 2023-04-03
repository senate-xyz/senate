use std::{ env, time::Duration, sync::Arc };

use prisma_client_rust::chrono::{ Utc, DateTime };
use reqwest::Client;
use serde::Deserialize;

use tokio::task;

use crate::{ RefreshEntry, prisma::{ PrismaClient, daohandler, self } };

#[allow(non_snake_case)]
#[derive(Deserialize)]
struct ApiResponse {
    response: String,
    voterAddress: String,
}

pub(crate) async fn process_snapshot_votes(entry: RefreshEntry, client: &Arc<PrismaClient>) {
    //println!("process {:?}", entry);

    let detective_url = match env::var_os("DETECTIVE_URL") {
        Some(v) => v.into_string().unwrap(),
        None => panic!("$DETECTIVE_URL is not set"),
    };

    let post_url = format!("{}/updateSnapshotDaoVotes", detective_url);

    let http_client = Client::builder().timeout(Duration::from_secs(60)).build().unwrap();

    let dao_handler = client
        .daohandler()
        .find_first(vec![daohandler::id::equals(entry.handler_id.to_string())])
        .exec().await
        .unwrap()
        .unwrap();

    let client_ref = client.clone();
    let dao_handler_ref = dao_handler;
    let voters_ref = entry.voters.clone();

    task::spawn(async move {
        let response = http_client
            .post(&post_url)
            .json(&serde_json::json!({ "daoHandlerId": entry.handler_id, "voters": entry.voters }))
            .send().await;

        match response {
            Ok(res) => {
                let data: Vec<ApiResponse> = res.json().await.unwrap();

                // Filter data based on the "response" field
                let ok_voters: Vec<String> = data
                    .iter()
                    .filter(|result| result.response == "ok")
                    .map(|result| result.voterAddress.clone())
                    .collect();

                let nok_voters: Vec<String> = data
                    .iter()
                    .filter(|result| result.response == "nok")
                    .map(|result| result.voterAddress.clone())
                    .collect();

                let ok_voter_ids = client_ref
                    .voter()
                    .find_many(vec![prisma::voter::address::in_vec(ok_voters)])
                    .exec().await
                    .unwrap()
                    .iter()
                    .map(|voter| voter.id.clone())
                    .collect();

                let nok_voter_ids = client_ref
                    .voter()
                    .find_many(vec![prisma::voter::address::in_vec(nok_voters)])
                    .exec().await
                    .unwrap()
                    .iter()
                    .map(|voter| voter.id.clone())
                    .collect();

                let update_ok_voters = client_ref
                    .voterhandler()
                    .update_many(
                        vec![
                            prisma::voterhandler::voterid::in_vec(ok_voter_ids),
                            prisma::voterhandler::daohandlerid::equals(
                                dao_handler_ref.id.to_string()
                            )
                        ],
                        vec![
                            prisma::voterhandler::refreshstatus::set(prisma::RefreshStatus::Done),
                            prisma::voterhandler::lastrefresh::set(Utc::now().into())
                        ]
                    );

                let update_nok_voters = client_ref
                    .voterhandler()
                    .update_many(
                        vec![
                            prisma::voterhandler::voterid::in_vec(nok_voter_ids),
                            prisma::voterhandler::daohandlerid::equals(
                                dao_handler_ref.id.to_string()
                            )
                        ],
                        vec![
                            prisma::voterhandler::refreshstatus::set(prisma::RefreshStatus::New),
                            prisma::voterhandler::lastrefresh::set(Utc::now().into()),
                            prisma::voterhandler::snapshotindex::set(
                                Some(
                                    DateTime::parse_from_rfc3339("2009-01-09T04:54:25.00Z").unwrap()
                                )
                            )
                        ]
                    );

                client_ref._batch((update_ok_voters, update_nok_voters)).await.unwrap();
            }
            Err(e) => {
                let voter_ids = client_ref
                    .voter()
                    .find_many(vec![prisma::voter::address::in_vec(voters_ref)])
                    .exec().await
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
                                dao_handler_ref.id.to_string()
                            )
                        ],
                        vec![
                            prisma::voterhandler::refreshstatus::set(prisma::RefreshStatus::New),
                            prisma::voterhandler::lastrefresh::set(Utc::now().into()),
                            prisma::voterhandler::snapshotindex::set(
                                Some(
                                    DateTime::parse_from_rfc3339("2009-01-09T04:54:25.00Z").unwrap()
                                )
                            )
                        ]
                    )
                    .exec().await;
                panic!("http error: {:?}", e);
            }
        }
    });
}