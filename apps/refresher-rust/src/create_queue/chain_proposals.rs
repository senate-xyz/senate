use crate::{ prisma, RefreshEntry, RefreshType };

use prisma::{ PrismaClient, daohandler };
use prisma_client_rust::{ chrono::{ Utc, Duration }, operator::{ and, or } };

pub async fn get_chain_proposals_queue(client: &PrismaClient) -> Vec<RefreshEntry> {
    let normal_refresh = Utc::now() - Duration::minutes(1);
    let force_refresh = Utc::now() - Duration::minutes(5);
    let new_refresh = Utc::now() - Duration::seconds(5);

    let handler_types = vec![
        prisma::DaoHandlerType::AaveChain,
        prisma::DaoHandlerType::CompoundChain,
        prisma::DaoHandlerType::MakerExecutive,
        prisma::DaoHandlerType::MakerPoll,
        prisma::DaoHandlerType::UniswapChain,
        prisma::DaoHandlerType::EnsChain,
        prisma::DaoHandlerType::GitcoinChain,
        prisma::DaoHandlerType::HopChain,
        prisma::DaoHandlerType::DydxChain
    ];

    let dao_handlers = client
        .daohandler()
        .find_many(
            vec![
                daohandler::r#type::in_vec(handler_types.clone()),
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

    let updated_dao_handlers = client
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

    println!("Added {:?} chain proposal requests to queue", updated_dao_handlers.unwrap());

    let refresh_queue: Vec<RefreshEntry> = dao_handlers
        .iter()
        .map(|dao_handler| {
            RefreshEntry {
                handler_id: dao_handler.id.clone(),
                refresh_type: RefreshType::Daochainproposals,
                voters: vec![],
            }
        })
        .collect();

    refresh_queue
}