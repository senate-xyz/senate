use std::collections::HashMap;

use crate::{ prisma::{ self, voterhandler }, RefreshEntry, RefreshType };

use prisma::{ PrismaClient, daohandler };
use prisma_client_rust::{ chrono::{ Utc, Duration }, operator::{ or, and } };

pub async fn get_snapshot_votes_queue(client: &PrismaClient) -> Vec<RefreshEntry> {
    let normal_refresh = Utc::now() - Duration::minutes(1);
    let force_refresh = Utc::now() - Duration::minutes(5);
    let new_refresh = Utc::now() - Duration::seconds(5);

    let dao_handlers = client
        .daohandler()
        .find_many(
            vec![
                daohandler::r#type::equals(prisma::DaoHandlerType::Snapshot),
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
        .iter()
        .cloned()
        .flat_map(|dao_handler| {
            let voter_handlers = dao_handler.voterhandlers;

            let vote_indexes: Vec<i64> = voter_handlers
                .iter()
                .cloned()
                .map(|voter_handler| voter_handler.snapshotindex.unwrap().timestamp_millis())
                .collect();

            let vote_indexes_buckets = bin(vote_indexes, 10);

            let refresh_items: Vec<RefreshEntry> = vote_indexes_buckets
                .iter()
                .filter_map(|bucket| {
                    let bucket_vh: Vec<_> = voter_handlers
                        .iter()
                        .cloned()
                        .filter(|voter_handler| {
                            let index = voter_handler.snapshotindex.unwrap().timestamp_millis();
                            bucket.min <= index && index <= bucket.max
                        })
                        .take(100)
                        .collect();

                    voter_handler_to_refresh.extend(bucket_vh.clone());

                    if bucket_vh.is_empty() {
                        None
                    } else {
                        Some(RefreshEntry {
                            handler_id: dao_handler.id.clone(),
                            refresh_type: RefreshType::DAOSNAPSHOTVOTES,
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
        .collect();

    return refresh_queue;
}

#[derive(Debug)]
struct Bucket {
    min: i64,
    max: i64,
}

fn bin(data: Vec<i64>, num_bins: usize) -> Vec<Bucket> {
    let min = data.iter().cloned().min().unwrap_or(0);
    let max = data.iter().cloned().max().unwrap_or(0) + 1;

    let bin_width = ((max - min) as f64) / (num_bins as f64);
    let mut bins: Vec<Bucket> = Vec::with_capacity(num_bins);

    for i in 0..num_bins {
        bins.push(Bucket {
            min: min + (((i as f64) * bin_width).round() as i64),
            max: min + ((((i + 1) as f64) * bin_width).round() as i64),
        });
    }

    let mut data_counts: HashMap<usize, u64> = HashMap::new();

    for value in data {
        let bin_index = (((value - min) as f64) / bin_width).floor() as usize;
        let count = data_counts.entry(bin_index).or_insert(0);
        *count += 1;
    }

    let mut filled_bins: Vec<Bucket> = Vec::with_capacity(num_bins);

    for (bin_index, count) in data_counts.iter() {
        if *count > 0 {
            filled_bins.push(Bucket {
                min: bins[*bin_index].min,
                max: bins[*bin_index].max,
            });
        }
    }

    filled_bins
}