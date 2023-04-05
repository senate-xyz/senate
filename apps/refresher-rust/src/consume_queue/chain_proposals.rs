use anyhow::{ Result };
use std::{ env, time::Duration, sync::Arc };

use prisma_client_rust::chrono::Utc;
use reqwest::Client;
use serde::Deserialize;
use tokio::task;

use crate::{ RefreshEntry, prisma::{ PrismaClient, daohandler, self } };

#[derive(Deserialize)]
#[allow(non_snake_case)]
struct ProposalsResponse {
    daoHandlerId: String,
    response: String,
}

pub(crate) async fn process_chain_proposals(
    entry: RefreshEntry,
    client: &Arc<PrismaClient>
) -> Result<()> {
    let detective_url = match env::var_os("DETECTIVE_URL") {
        Some(v) => v.into_string().unwrap(),
        None => panic!("$DETECTIVE_URL is not set"),
    };

    let post_url = format!("{}/proposals/chain_proposals", detective_url);

    let http_client = Client::builder().timeout(Duration::from_secs(60)).build().unwrap();

    let dao_handler = client
        .daohandler()
        .find_first(vec![daohandler::id::equals(entry.handler_id.to_string())])
        .exec().await
        .unwrap()
        .unwrap();

    let client_ref = client.clone();
    let dao_handler_ref = dao_handler;

    task::spawn(async move {
        let response = http_client
            .post(&post_url)
            .json(&serde_json::json!({ "daoHandlerId": entry.handler_id }))
            .send().await;

        match response {
            Ok(res) => {
                let data: ProposalsResponse = res.json().await.unwrap();

                let dbupdate = match data.response.as_str() {
                    "ok" =>
                        client_ref
                            .daohandler()
                            .update_many(
                                vec![daohandler::id::equals(data.daoHandlerId.to_string())],
                                vec![
                                    daohandler::refreshstatus::set(prisma::RefreshStatus::Done),
                                    daohandler::lastrefresh::set(Utc::now().into())
                                ]
                            ),
                    "nok" =>
                        client_ref
                            .daohandler()
                            .update_many(
                                vec![daohandler::id::equals(data.daoHandlerId.to_string())],
                                vec![
                                    daohandler::refreshstatus::set(prisma::RefreshStatus::New),
                                    daohandler::lastrefresh::set(Utc::now().into())
                                ]
                            ),
                    _ => panic!("Unexpected response"),
                };

                client_ref._batch(dbupdate).await.unwrap()
            }
            Err(e) => {
                let _ = client_ref
                    .daohandler()
                    .update_many(
                        vec![daohandler::id::equals(dao_handler_ref.id)],
                        vec![
                            daohandler::refreshstatus::set(prisma::RefreshStatus::New),
                            daohandler::lastrefresh::set(Utc::now().into()),
                            daohandler::refreshspeed::decrement(
                                if dao_handler_ref.refreshspeed > 1000 {
                                    dao_handler_ref.refreshspeed / 2
                                } else {
                                    1
                                }
                            )
                        ]
                    )
                    .exec().await;
                panic!("http error: {:?}", e);
            }
        }
    });

    Ok(())
}