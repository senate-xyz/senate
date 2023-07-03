use std::collections::HashMap;

use anyhow::Result;
use prisma_client_rust::{
    chrono::{Duration, Utc},
    operator::{and, or},
    Direction,
};
use tracing::{debug, debug_span, event, instrument, Instrument, Level};

use prisma::{daohandler, PrismaClient};

use crate::{
    config::Config,
    prisma::{self, voterhandler},
    refresh_status::{DAOS_REFRESH_STATUS, VOTERS_REFRESH_STATUS},
    RefreshEntry, RefreshType,
};

#[instrument(skip_all, level = "info")]
pub async fn produce_chain_votes_queue(
    client: &PrismaClient,
    config: &Config,
) -> Result<Vec<RefreshEntry>> {
    let normal_refresh = Utc::now() - Duration::seconds(config.normal_chain_votes.into());
    let force_refresh = Utc::now() - Duration::seconds(config.force_chain_votes.into());
    let new_refresh = Utc::now() - Duration::seconds(config.new_chain_votes.into());

    let handler_types = vec![
        prisma::DaoHandlerType::AaveChain,
        prisma::DaoHandlerType::CompoundChain,
        prisma::DaoHandlerType::MakerPollArbitrum,
        prisma::DaoHandlerType::MakerExecutive,
        prisma::DaoHandlerType::MakerPoll,
        prisma::DaoHandlerType::UniswapChain,
        prisma::DaoHandlerType::EnsChain,
        prisma::DaoHandlerType::GitcoinChain,
        prisma::DaoHandlerType::HopChain,
        prisma::DaoHandlerType::DydxChain,
        prisma::DaoHandlerType::InterestProtocolChain,
    ];

    let mut daos_refresh_status = DAOS_REFRESH_STATUS.lock().await;
    let mut voters_refresh_status = VOTERS_REFRESH_STATUS.lock().await;

    let dao_handlers: Vec<_> = daos_refresh_status
        .iter_mut()
        .filter(|r| handler_types.contains(&r.r#type))
        .collect();

    let mut voter_handler_to_refresh = Vec::new();
    let mut refresh_queue = Vec::new();

    for dao_handler in dao_handlers {
        let mut voter_handlers_r: Vec<_> = voters_refresh_status
            .iter_mut()
            .filter(|r| {
                r.dao_handler_id == dao_handler.dao_handler_id
                    && ((r.refresh_status == prisma::RefreshStatus::Done
                        && r.last_refresh < normal_refresh)
                        || (r.refresh_status == prisma::RefreshStatus::Pending
                            && r.last_refresh < force_refresh)
                        || (r.refresh_status == prisma::RefreshStatus::New
                            && r.last_refresh < new_refresh))
            })
            .collect();

        let voter_handlers = client
            .voterhandler()
            .find_many(vec![voterhandler::id::in_vec(
                voter_handlers_r
                    .iter()
                    .map(|r| r.voter_handler_id.clone())
                    .collect(),
            )])
            .include(voterhandler::include!({
                voter: select
                { address }
            }))
            .exec()
            .await
            .unwrap();

        let vote_indexes: Vec<i64> = voter_handlers
            .iter()
            .map(|voter_handler| voter_handler.chainindex.unwrap())
            .collect();

        let domain_limit = if dao_handler.r#type == prisma::DaoHandlerType::MakerPollArbitrum {
            200_000_000
        } else {
            20_000_000
        };

        let vote_indexes_buckets = bin(vote_indexes, 0, domain_limit, 10);

        let items: Vec<RefreshEntry> = vote_indexes_buckets
            .iter()
            .filter_map(|bucket| {
                let bucket_vh: Vec<_> = voter_handlers
                    .iter()
                    .cloned()
                    .filter(|voter_handler| {
                        let index = voter_handler.chainindex.unwrap();
                        bucket.min <= index && index < bucket.max
                    })
                    .take(config.batch_chain_votes.try_into().unwrap())
                    .collect();

                voter_handler_to_refresh.extend(bucket_vh.clone());

                if bucket_vh.is_empty() {
                    None
                } else {
                    Some(RefreshEntry {
                        handler_id: dao_handler.dao_handler_id.clone(),
                        refresh_type: RefreshType::Daochainvotes,
                        handler_type: dao_handler.r#type,
                        voters: bucket_vh
                            .iter()
                            .map(|vhandler| vhandler.voter.address.clone())
                            .collect(),
                    })
                }
            })
            .collect();

        for vhr in &mut *voter_handlers_r {
            vhr.refresh_status = prisma::RefreshStatus::Pending;
            vhr.last_refresh = Utc::now();
        }

        if !items.is_empty() {
            event!(Level::DEBUG, "{:?}", voter_handlers_r);
            event!(Level::DEBUG, "{:?}", items);
        }

        refresh_queue.extend(items)
    }

    Ok(refresh_queue)
}

#[derive(Debug)]
struct Bucket {
    min: i64,
    max: i64,
}

fn bin(data: Vec<i64>, min: i64, max: i64, num_bins: i64) -> Vec<Bucket> {
    let bin_width = ((max - min) as f64) / (num_bins as f64);
    let mut bins: Vec<Bucket> = Vec::with_capacity(num_bins.try_into().unwrap());

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

    let mut filled_bins: Vec<Bucket> = Vec::with_capacity(num_bins.try_into().unwrap());

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
