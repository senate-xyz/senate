use anyhow::Result;
use prisma_client_rust::{
    chrono::{Duration, Utc},
    operator::{and, or},
};
use tracing::{debug, debug_span, instrument, Instrument};

use prisma::{daohandler, PrismaClient};

use crate::{
    config::Config, prisma, refresh_status::DAOS_REFRESH_STATUS, RefreshEntry, RefreshType,
};

#[instrument(, ret, level = "info")]
pub async fn produce_snapshot_proposals_queue(config: &Config) -> Result<Vec<RefreshEntry>> {
    let normal_refresh = Utc::now() - Duration::seconds(config.normal_snapshot_proposals.into());
    let force_refresh = Utc::now() - Duration::seconds(config.force_snapshot_proposals.into());
    let new_refresh = Utc::now() - Duration::seconds(config.new_snapshot_proposals.into());

    let handler_types = vec![prisma::DaoHandlerType::Snapshot];

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
            refresh_type: RefreshType::Daosnapshotproposals,
            voters: vec![],
        })
        .collect();

    for dh in &mut *dao_handlers {
        dh.refresh_status = prisma::RefreshStatus::Pending;
        dh.last_refresh = Utc::now();
    }

    Ok(refresh_queue)
}
