use crate::{ prisma, RefreshEntry, RefreshType, config::Config };

use prisma::{ PrismaClient, daohandler };
use prisma_client_rust::{ chrono::{ Utc, Duration }, operator::{ or, and } };

pub async fn create_snapshot_proposals_queue(
    client: &PrismaClient,
    config: &Config
) -> Vec<RefreshEntry> {
    let normal_refresh =
        Utc::now() - Duration::milliseconds(config.normal_snapshot_proposals.into());
    let force_refresh = Utc::now() - Duration::milliseconds(config.force_snapshot_proposals.into());
    let new_refresh = Utc::now() - Duration::milliseconds(config.new_snapshot_proposals.into());

    let dao_handlers = client
        .daohandler()
        .find_many(
            vec![
                daohandler::r#type::equals(prisma::DaoHandlerType::Snapshot),
                or(
                    vec![
                        and(
                            vec![
                                daohandler::refreshstatus::equals(prisma::RefreshStatus::Done),
                                daohandler::lastrefresh::lt(normal_refresh.into())
                            ]
                        ),
                        and(
                            vec![
                                daohandler::refreshstatus::equals(prisma::RefreshStatus::Pending),
                                daohandler::lastrefresh::lt(force_refresh.into())
                            ]
                        ),
                        and(
                            vec![
                                daohandler::refreshstatus::equals(prisma::RefreshStatus::New),
                                daohandler::lastrefresh::lt(new_refresh.into())
                            ]
                        )
                    ]
                )
            ]
        )
        .exec().await
        .unwrap();

    let _updated_dao_handlers = client
        .daohandler()
        .update_many(
            vec![
                daohandler::id::in_vec(
                    dao_handlers
                        .iter()
                        .map(|dao| dao.id.clone())
                        .collect()
                )
            ],
            vec![
                daohandler::refreshstatus::set(prisma::RefreshStatus::Pending),
                daohandler::lastrefresh::set(Utc::now().into())
            ]
        )
        .exec().await;

    let refresh_queue: Vec<RefreshEntry> = dao_handlers
        .iter()
        .map(|dao_handler| {
            RefreshEntry {
                handler_id: dao_handler.id.clone(),
                refresh_type: RefreshType::Daosnapshotproposals,
                voters: vec![],
            }
        })
        .collect();

    refresh_queue
}