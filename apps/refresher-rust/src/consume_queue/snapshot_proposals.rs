use anyhow::Result;
use std::{env, sync::Arc, time::Duration};

use prisma_client_rust::chrono::{DateTime, Utc};
use reqwest::Client;
use serde::Deserialize;
use tokio::task;

use crate::{
    prisma::{self, daohandler, PrismaClient},
    RefreshEntry,
};

#[derive(Deserialize)]
#[allow(non_snake_case)]
struct ProposalsResponse {
    daoHandlerId: String,
    response: String,
}

pub(crate) async fn consume_snapshot_proposals(
    entry: RefreshEntry,
    client: &Arc<PrismaClient>,
) -> Result<()> {
    let detective_url = match env::var_os("DETECTIVE_URL") {
        Some(v) => v.into_string().unwrap(),
        None => panic!("$DETECTIVE_URL is not set"),
    };

    let post_url = format!("{}/proposals/snapshot_proposals", detective_url);

    let http_client = Client::builder()
        .timeout(Duration::from_secs(60))
        .build()
        .unwrap();

    let client_ref = client.clone();
    let dao_handler_id_ref = entry.handler_id.clone();

    task::spawn(async move {
        let response = http_client
            .post(&post_url)
            .json(&serde_json::json!({ "daoHandlerId": entry.handler_id }))
            .send()
            .await;

        match response {
            Ok(res) => {
                let data: ProposalsResponse = res.json().await.unwrap();

                let dbupdate = match data.response.as_str() {
                    "ok" => client_ref.daohandler().update_many(
                        vec![daohandler::id::equals(data.daoHandlerId.to_string())],
                        vec![
                            daohandler::refreshstatus::set(prisma::RefreshStatus::Done),
                            daohandler::lastrefresh::set(Utc::now().into()),
                        ],
                    ),
                    "nok" => client_ref.daohandler().update_many(
                        vec![daohandler::id::equals(data.daoHandlerId.to_string())],
                        vec![
                            daohandler::refreshstatus::set(prisma::RefreshStatus::New),
                            daohandler::lastrefresh::set(Utc::now().into()),
                        ],
                    ),
                    _ => panic!("Unexpected response"),
                };

                let _ = client_ref._batch(dbupdate).await.unwrap();
            }
            Err(e) => {
                println!("{:#?}", e);

                let _ = client_ref
                    .daohandler()
                    .update_many(
                        vec![daohandler::id::equals(dao_handler_id_ref.to_string())],
                        vec![
                            daohandler::refreshstatus::set(prisma::RefreshStatus::New),
                            daohandler::lastrefresh::set(Utc::now().into()),
                            daohandler::snapshotindex::set(Some(
                                DateTime::parse_from_rfc3339("2000-01-01T00:00:00.00Z").unwrap(),
                            )),
                        ],
                    )
                    .exec()
                    .await;
            }
        }
    });
    Ok(())
}
