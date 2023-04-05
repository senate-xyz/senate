use ethers::{ providers::Middleware };
use prisma_client_rust::chrono::{ Utc, DateTime, FixedOffset };
use rocket::serde::json::Json;
use serde_json::Value;

use crate::prisma::{ proposal, dao };
use crate::{ ProposalsRequest, ProposalsResponse, Ctx, prisma::daohandler };

use crate::handlers::proposals::aave::aave_proposals;

#[allow(dead_code)]
#[derive(Clone)]
pub struct ChainProposal {
    pub(crate) external_id: String,
    pub(crate) name: String,
    pub(crate) dao_id: String,
    pub(crate) dao_handler_id: String,
    pub(crate) time_start: DateTime<Utc>,
    pub(crate) time_end: DateTime<Utc>,
    pub(crate) time_created: DateTime<Utc>,
    pub(crate) block_created: i64,
    pub(crate) choices: Value,
    pub(crate) scores: Value,
    pub(crate) scores_total: Value,
    pub(crate) quorum: Value,
    pub(crate) url: String,
}

#[post("/chain_proposals", data = "<data>")]
pub async fn update_chain_proposals<'a>(
    ctx: &Ctx,
    data: Json<ProposalsRequest<'a>>
) -> Json<ProposalsResponse<'a>> {
    let dao_handler = match
        ctx.db
            .daohandler()
            .find_first(vec![daohandler::id::equals(data.daoHandlerId.to_string())])
            .exec().await
            .unwrap()
    {
        Some(data) => data,
        None => panic!("{:?} daoHandlerId not found", data.daoHandlerId),
    };

    let current_block = ctx.client.get_block_number().await.unwrap_or_default();
    let min_block = dao_handler.chainindex;
    let batch_size = dao_handler.refreshspeed;

    let from_block = min_block.unwrap_or(0);
    let to_block = if current_block - from_block > batch_size.into() {
        from_block + batch_size
    } else {
        current_block.as_u64() as i64
    };

    let proposals: Vec<ChainProposal> = match dao_handler.r#type {
        crate::prisma::DaoHandlerType::AaveChain => {
            aave_proposals(ctx, &dao_handler, &from_block, &to_block).await
        }
        crate::prisma::DaoHandlerType::CompoundChain => { vec![] }
        crate::prisma::DaoHandlerType::UniswapChain => { vec![] }
        crate::prisma::DaoHandlerType::EnsChain => { vec![] }
        crate::prisma::DaoHandlerType::GitcoinChain => { vec![] }
        crate::prisma::DaoHandlerType::HopChain => { vec![] }
        crate::prisma::DaoHandlerType::DydxChain => { vec![] }
        crate::prisma::DaoHandlerType::MakerExecutive => { vec![] }
        crate::prisma::DaoHandlerType::MakerPoll => { vec![] }
        crate::prisma::DaoHandlerType::MakerPollArbitrum => { vec![] }
        crate::prisma::DaoHandlerType::Snapshot => panic!("chain request on snapshot daohandler!"),
    };

    let open_proposals: Vec<ChainProposal> = proposals
        .iter()
        .filter(|p| p.time_end > Utc::now())
        .cloned()
        .collect();

    let new_index;

    if !open_proposals.is_empty() {
        new_index = open_proposals
            .iter()
            .map(|p| p.block_created)
            .min()
            .unwrap();
    } else {
        new_index = to_block;
    }

    let fixed_offset = FixedOffset::east_opt(0);

    let upserts = proposals
        .clone()
        .into_iter()
        .map(|p|
            ctx.db
                .proposal()
                .upsert(
                    proposal::externalid_daoid(
                        p.external_id.to_string(),
                        data.daoHandlerId.to_string()
                    ),
                    proposal::create(
                        p.name.clone(),
                        p.external_id.clone(),
                        p.choices.clone(),
                        p.scores.clone(),
                        p.scores_total.clone().into(),
                        p.quorum.clone().into(),
                        p.time_created.with_timezone(&fixed_offset.unwrap()),
                        p.time_start.with_timezone(&fixed_offset.unwrap()),
                        p.time_end.with_timezone(&fixed_offset.unwrap()),
                        p.clone().url,
                        daohandler::id::equals(dao_handler.id.to_string()),
                        dao::id::equals(dao_handler.daoid.to_string()),
                        vec![]
                    ),
                    vec![
                        proposal::choices::set(p.choices.clone()),
                        proposal::scores::set(p.scores.clone()),
                        proposal::scorestotal::set(p.clone().scores_total),
                        proposal::quorum::set(p.clone().quorum)
                    ]
                )
        );

    let _ = ctx.db._batch(upserts).await;

    let _ = ctx.db
        .daohandler()
        .update(
            daohandler::id::equals(dao_handler.id.to_string()),
            vec![daohandler::chainindex::set(new_index.into())]
        )
        .exec().await;

    Json(ProposalsResponse { daoHandlerId: data.daoHandlerId, response: "ok" })
}