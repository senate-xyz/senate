use std::collections::HashMap;

use anyhow::Result;
use prisma_client_rust::{
    chrono::{Duration, Utc},
    operator::{and, or},
    Direction,
};
use tracing::{debug, debug_span, event, instrument, Instrument, Level};

use crate::RefreshStatus;
use prisma::{daohandler, PrismaClient};

use crate::{
    config::Config,
    prisma::{self, voterhandler},
    refresh_status::{DAOS_REFRESH_STATUS, VOTERS_REFRESH_STATUS},
    RefreshEntry,
    RefreshType,
};

#[instrument(skip_all)]
pub async fn produce_snapshot_votes_queue(
    client: &PrismaClient,
    config: &Config,
) -> Result<Vec<RefreshEntry>> {
    let normal_refresh = Utc::now() - Duration::seconds(config.normal_snapshot_votes.into());
    let force_refresh = Utc::now() - Duration::seconds(config.force_snapshot_votes.into());
    let new_refresh = Utc::now() - Duration::seconds(config.new_snapshot_votes.into());

    let handler_types = [prisma::DaoHandlerType::Snapshot];

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
                    && ((r.refresh_status == RefreshStatus::DONE
                        && r.last_refresh < normal_refresh)
                        || (r.refresh_status == RefreshStatus::PENDING
                            && r.last_refresh < force_refresh)
                        || (r.refresh_status == RefreshStatus::NEW && r.last_refresh < new_refresh))
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
            .map(|voter_handler| voter_handler.snapshotindex.timestamp_millis())
            .collect();

        let vote_indexes_buckets = bin(vote_indexes, 10);

        let items: Vec<RefreshEntry> = vote_indexes_buckets
            .iter()
            .filter_map(|bucket| {
                let bucket_vh: Vec<_> = voter_handlers
                    .iter()
                    .filter(|&voter_handler| {
                        let index = voter_handler.snapshotindex.timestamp_millis();
                        bucket.min <= index && index <= bucket.max
                    })
                    .take(config.batch_snapshot_votes.try_into().unwrap())
                    .cloned()
                    .collect();

                voter_handler_to_refresh.extend(bucket_vh.clone());

                if bucket_vh.is_empty() {
                    None
                } else {
                    Some(RefreshEntry {
                        handler_id: dao_handler.dao_handler_id.clone(),
                        handler_type: dao_handler.r#type,
                        refresh_type: RefreshType::Daosnapshotvotes,
                        voters: bucket_vh
                            .iter()
                            .map(|vhandler| vhandler.voter.address.clone())
                            .collect(),
                    })
                }
            })
            .collect();

        for vhr in &mut *voter_handlers_r {
            vhr.refresh_status = RefreshStatus::PENDING;
            vhr.last_refresh = Utc::now();
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
