use std::collections::HashMap;

use crate::{ prisma::{ self, voterhandler }, RefreshEntry, RefreshType };

use prisma::{ PrismaClient, daohandler };
use prisma_client_rust::{ chrono::{ Utc, Duration }, operator::{ or, and } };

pub async fn get_chain_votes_queue(client: &PrismaClient) -> Vec<RefreshEntry> {
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
                daohandler::voterhandlers::some(
                    vec![
                        or(
                            vec![
                                and(
                                    vec![
                                        voterhandler::refreshstatus::equals(
                                            prisma::RefreshStatus::Done
                                        ),
                                        voterhandler::lastrefresh::lt(normal_refresh.into())
                                    ]
                                ),
                                and(
                                    vec![
                                        voterhandler::refreshstatus::equals(
                                            prisma::RefreshStatus::Pending
                                        ),
                                        voterhandler::lastrefresh::lt(force_refresh.into())
                                    ]
                                ),
                                and(
                                    vec![
                                        voterhandler::refreshstatus::equals(
                                            prisma::RefreshStatus::New
                                        ),
                                        voterhandler::lastrefresh::lt(new_refresh.into())
                                    ]
                                )
                            ]
                        )
                    ]
                )
            ]
        )
        .include(
            daohandler::include!({ 
                    dao 
                    proposals 
                    voterhandlers: 
                        include { voter }
                })
        )
        .exec().await
        .unwrap();

    let mut voter_handler_to_refresh = Vec::new();

    let filtered_dao_handlers: Vec<_> = dao_handlers
        .into_iter()
        .filter(|dao_handler| dao_handler.proposals.len() > 0)
        .collect();

    let refresh_queue: Vec<RefreshEntry> = filtered_dao_handlers
        .clone()
        .into_iter()
        .map(|dao_handler| {
            let voter_handlers = dao_handler.voterhandlers;

            let vote_timestamps: Vec<i64> = voter_handlers
                .clone()
                .into_iter()
                .map(|voter_handler| voter_handler.chainindex.unwrap())
                .collect();

            let domain_limit = if dao_handler.r#type == prisma::DaoHandlerType::MakerPollArbitrum {
                100_000_000
            } else {
                40_000_000
            };

            let vote_timestamp_buckets = bin(vote_timestamps, 0, domain_limit, 10);

            let refresh_items: Vec<RefreshEntry> = vote_timestamp_buckets
                .iter()
                .filter_map(|bucket| {
                    let bucket_max = bucket.x1;
                    let bucket_min = bucket.x0;

                    let bucket_vh: Vec<_> = voter_handlers
                        .clone()
                        .into_iter()
                        .filter(|voter_handler| {
                            bucket_min <= voter_handler.chainindex.unwrap() &&
                                voter_handler.chainindex.unwrap() < bucket_max
                        })
                        .collect();

                    voter_handler_to_refresh.extend_from_slice(&bucket_vh);

                    if bucket_vh.is_empty() {
                        None
                    } else {
                        Some(RefreshEntry {
                            handler_id: dao_handler.id.clone(),
                            refresh_type: RefreshType::DAOCHAINVOTES,
                            voters: bucket_vh
                                .iter()
                                .map(|vhandler| vhandler.voter.address.clone())
                                .collect(),
                        })
                    }
                })
                .collect();

            refresh_items
        })
        .flatten()
        .collect();

    return refresh_queue;
}

#[derive(Debug)]
struct Bucket {
    x0: i64,
    x1: i64,
}

// A simplified binning function to create histogram-like bins
fn bin(data: Vec<i64>, min: i64, max: i64, num_bins: i64) -> Vec<Bucket> {
    let bin_width = (max - min) / num_bins;
    let mut bins: Vec<Bucket> = Vec::with_capacity(num_bins.try_into().unwrap());

    for i in 0..num_bins {
        bins.push(Bucket {
            x0: min + i * bin_width,
            x1: min + (i + 1) * bin_width,
        });
    }

    let mut data_counts: HashMap<usize, u64> = HashMap::new();

    for value in data {
        let bin_index = ((value - min) / bin_width) as usize;
        let count = data_counts.entry(bin_index).or_insert(0);
        *count += 1;
    }

    let mut filled_bins: Vec<Bucket> = Vec::with_capacity(num_bins.try_into().unwrap());

    for (bin_index, count) in data_counts.iter() {
        if *count > 0 {
            filled_bins.push(Bucket {
                x0: bins[*bin_index].x0,
                x1: bins[*bin_index].x1,
            });
        }
    }

    filled_bins
}