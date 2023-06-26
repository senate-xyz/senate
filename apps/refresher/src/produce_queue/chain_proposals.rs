use anyhow::Result;
use prisma_client_rust::{
    chrono::{Duration, Utc},
    operator::{and, or},
};
use tracing::{debug, debug_span, event, instrument, Instrument, Level};

use prisma::{daohandler, PrismaClient};

use crate::{
    config::Config,
    prisma,
    refresh_status::{DaoHandlerRefreshStatus, DAOS_REFRESH_STATUS},
    RefreshEntry, RefreshType,
};

#[instrument(skip_all, level = "info")]
pub async fn produce_chain_proposals_queue(config: &Config) -> Result<Vec<RefreshEntry>> {
    let normal_refresh = Utc::now() - Duration::seconds(config.normal_chain_proposals.into());
    let force_refresh = Utc::now() - Duration::seconds(config.force_chain_proposals.into());
    let new_refresh = Utc::now() - Duration::seconds(config.new_chain_proposals.into());

    let handler_types = vec![
        prisma::DaoHandlerType::AaveChain,
        prisma::DaoHandlerType::CompoundChain,
        prisma::DaoHandlerType::MakerExecutive,
        prisma::DaoHandlerType::MakerPoll,
        prisma::DaoHandlerType::UniswapChain,
        prisma::DaoHandlerType::EnsChain,
        prisma::DaoHandlerType::GitcoinChain,
        prisma::DaoHandlerType::HopChain,
        prisma::DaoHandlerType::DydxChain,
    ];

    let mut daos_refresh_status = DAOS_REFRESH_STATUS.lock().await;

    let mut dao_handlers: Vec<_> = daos_refresh_status
        .iter_mut()
        .filter(|r| {
            handler_types.contains(&r.r#type)
                && ((r.refresh_status == prisma::RefreshStatus::Done
                    && r.last_refresh < normal_refresh)
                    || (r.refresh_status == prisma::RefreshStatus::Pending
                        && r.last_refresh < force_refresh)
                    || (r.refresh_status == prisma::RefreshStatus::New
                        && r.last_refresh < new_refresh))
        })
        .collect();

    let refresh_queue: Vec<RefreshEntry> = dao_handlers
        .iter()
        .map(|dao_handler| RefreshEntry {
            handler_id: dao_handler.dao_handler_id.clone(),
            refresh_type: RefreshType::Daochainproposals,
            voters: vec![],
        })
        .collect();

    for dhr in &mut *dao_handlers {
        dhr.refresh_status = prisma::RefreshStatus::Pending;
        dhr.last_refresh = Utc::now();
    }
    if !refresh_queue.is_empty() {
        event!(Level::DEBUG, "{:?}", dao_handlers);
        event!(Level::DEBUG, "{:?}", refresh_queue);
    }

    Ok(refresh_queue)
}
