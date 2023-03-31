use crate::{ prisma, RefreshEntry, RefreshType };

use prisma::{ PrismaClient, daohandler };
use prisma_client_rust::{ chrono::{ Utc, Duration }, operator::{ or, and } };

pub async fn get_snapshot_proposals_queue(client: &PrismaClient) -> Vec<RefreshEntry> {
    let normal_refresh = Utc::now() - Duration::minutes(1);
    let force_refresh = Utc::now() - Duration::minutes(5);
    let new_refresh = Utc::now() - Duration::seconds(5);

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

    client.daohandler().update_many(
        vec![
            daohandler::id::in_vec(
                vec![
                    dao_handlers
                        .iter()
                        .map(|dao| dao.id.clone())
                        .collect()
                ]
            )
        ],
        vec![
            daohandler::refreshstatus::set(prisma::RefreshStatus::Pending),
            daohandler::lastrefresh::set(Utc::now().into())
        ]
    );

    let refresh_queue: Vec<RefreshEntry> = dao_handlers
        .iter()
        .map(|dao_handler| {
            RefreshEntry {
                handler_id: dao_handler.id.clone(),
                refresh_type: RefreshType::DAOSNAPSHOTPROPOSALS,
                voters: vec![],
            }
        })
        .collect();

    return refresh_queue;
}