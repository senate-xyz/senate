use crate::{config::Config, prisma, RefreshEntry, RefreshType};
use anyhow::Result;

use prisma::{daohandler, PrismaClient};
use prisma_client_rust::{
    chrono::{Duration, Utc},
    operator::{and, or},
};

pub async fn produce_snapshot_proposals_queue(
    client: &PrismaClient,
    config: &Config,
) -> Result<Vec<RefreshEntry>> {
    let normal_refresh = Utc::now() - Duration::seconds(config.normal_snapshot_proposals.into());
    let force_refresh = Utc::now() - Duration::seconds(config.force_snapshot_proposals.into());
    let new_refresh = Utc::now() - Duration::seconds(config.new_snapshot_proposals.into());

    let dao_handlers = client
        .daohandler()
        .find_many(vec![
            daohandler::r#type::equals(prisma::DaoHandlerType::Snapshot),
            or(vec![
                and(vec![
                    daohandler::refreshstatus::equals(prisma::RefreshStatus::Done),
                    daohandler::lastrefresh::lt(normal_refresh.into()),
                ]),
                and(vec![
                    daohandler::refreshstatus::equals(prisma::RefreshStatus::Pending),
                    daohandler::lastrefresh::lt(force_refresh.into()),
                ]),
                and(vec![
                    daohandler::refreshstatus::equals(prisma::RefreshStatus::New),
                    daohandler::lastrefresh::lt(new_refresh.into()),
                ]),
            ]),
        ])
        .exec()
        .await?;

    client
        .daohandler()
        .update_many(
            vec![daohandler::id::in_vec(
                dao_handlers.iter().map(|dao| dao.id.clone()).collect(),
            )],
            vec![
                daohandler::refreshstatus::set(prisma::RefreshStatus::Pending),
                daohandler::lastrefresh::set(Utc::now().into()),
            ],
        )
        .exec()
        .await?;

    let refresh_queue: Vec<RefreshEntry> = dao_handlers
        .iter()
        .map(|dao_handler| RefreshEntry {
            handler_id: dao_handler.id.clone(),
            refresh_type: RefreshType::Daosnapshotproposals,
            voters: vec![],
        })
        .collect();

    Ok(refresh_queue)
}
