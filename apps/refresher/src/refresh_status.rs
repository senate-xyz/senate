use std::sync::Arc;

use chrono::{DateTime, Utc};
use once_cell::sync::Lazy;
use tokio::sync::Mutex;
use tracing::{event, instrument, Level};

use crate::prisma::{self, dao, voterhandler, DaoHandlerType, PrismaClient};
use crate::RefreshStatus;

#[derive(Debug, Clone)]
pub struct DaoHandlerRefreshStatus {
    pub dao_handler_id: String,
    pub refresh_status: RefreshStatus,
    pub last_refresh: DateTime<Utc>,
    pub r#type: prisma::DaoHandlerType,
    pub refreshspeed: i64,
    pub votersrefreshspeed: i64,
}

#[derive(Debug, Clone)]
pub struct VoterHandlerRefreshStatus {
    pub voter_address: String,
    pub dao_handler_id: String,
    pub voter_handler_id: String,
    pub refresh_status: RefreshStatus,
    pub last_refresh: DateTime<Utc>,
}

pub static DAOS_REFRESH_STATUS: Lazy<Arc<Mutex<Vec<DaoHandlerRefreshStatus>>>> =
    Lazy::new(|| Arc::new(Mutex::new(Vec::new())));

pub static VOTERS_REFRESH_STATUS: Lazy<Arc<Mutex<Vec<VoterHandlerRefreshStatus>>>> =
    Lazy::new(|| Arc::new(Mutex::new(Vec::new())));

pub async fn create_refresh_statuses(client: &PrismaClient) {
    create_daos_refresh_statuses(client).await;
    create_voters_refresh_statuses(client).await;
}

#[instrument(skip_all)]
pub async fn create_daos_refresh_statuses(client: &PrismaClient) {
    let dao_handlers_count = client.daohandler().count(vec![]).exec().await.unwrap();
    let mut daos_refresh_status = DAOS_REFRESH_STATUS.lock().await;

    if dao_handlers_count <= daos_refresh_status.len().try_into().unwrap() {
        return;
    }

    let dao_handlers = client.daohandler().find_many(vec![]).exec().await.unwrap();

    dao_handlers.iter().for_each(|daohandler| {
        if !daos_refresh_status
            .iter()
            .any(|refresh_status| refresh_status.dao_handler_id == daohandler.id)
        {
            let item = DaoHandlerRefreshStatus {
                dao_handler_id: daohandler.clone().id,
                refresh_status: RefreshStatus::NEW,
                last_refresh: Utc::now(),
                r#type: daohandler.clone().r#type,
                refreshspeed: if daohandler.r#type == DaoHandlerType::Snapshot {
                    1000
                } else {
                    1000000
                },
                votersrefreshspeed: if daohandler.r#type == DaoHandlerType::Snapshot {
                    1000
                } else {
                    10000000000
                },
            };

            daos_refresh_status.push(item);
        }
    });
}

#[instrument(skip_all)]
pub async fn create_voters_refresh_statuses(client: &PrismaClient) {
    let voter_handlers_count = client.voterhandler().count(vec![]).exec().await.unwrap();

    let mut voters_refresh_status = VOTERS_REFRESH_STATUS.lock().await;

    if voter_handlers_count <= voters_refresh_status.len().try_into().unwrap() {
        return;
    }

    let voter_handlers = client
        .voterhandler()
        .find_many(vec![])
        .include(voterhandler::include!({ voter }))
        .exec()
        .await;

    if let Ok(voter_handlers) = voter_handlers {
        voter_handlers.iter().for_each(|voterhandler| {
            if !voters_refresh_status
                .iter()
                .any(|refresh_status| refresh_status.voter_handler_id == voterhandler.id)
            {
                let item = VoterHandlerRefreshStatus {
                    voter_handler_id: voterhandler.clone().id,
                    refresh_status: RefreshStatus::NEW,
                    last_refresh: Utc::now(),
                    dao_handler_id: voterhandler.clone().daohandlerid,
                    voter_address: voterhandler.clone().voter.address,
                };

                voters_refresh_status.push(item);
            }
        })
    }
}
