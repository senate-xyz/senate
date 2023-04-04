use ethers::{ providers::Middleware };
use prisma_client_rust::chrono::{ Utc, DateTime };
use rocket::serde::json::Json;
use serde_json::Value;

use crate::{ ProposalsRequest, ProposalsResponse, Ctx, prisma::daohandler };

use crate::handlers::proposals::aave::aave_proposals;

#[derive(Clone)]
pub struct Proposal {
    external_id: String,
    name: String,
    dao_id: String,
    dao_handler_id: String,
    time_start: DateTime<Utc>,
    time_end: DateTime<Utc>,
    time_created: DateTime<Utc>,
    block_created: i64,
    choices: Value,
    scores: Value,
    scores_total: f64,
    quorum: i64,
    url: String,
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

    let current_block = ctx.provider.get_block_number().await.unwrap_or_default();
    let min_block = dao_handler.chainindex;
    let batch_size = dao_handler.refreshspeed;

    let from_block = min_block.unwrap_or(0);
    let to_block = if current_block - from_block > batch_size.into() {
        from_block + batch_size
    } else {
        current_block.as_u64() as i64
    };

    let proposals: Vec<Proposal> = match dao_handler.r#type {
        crate::prisma::DaoHandlerType::AaveChain => {
            aave_proposals(&ctx, &dao_handler, &from_block, &to_block).await
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

    let open_proposals: Vec<Proposal> = proposals
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

    let _ = ctx.db
        .daohandler()
        .update(
            daohandler::id::equals(dao_handler.id.to_string()),
            vec![daohandler::chainindex::set(new_index.into())]
        );
    //.exec().await;

    Json(ProposalsResponse { daoHandlerId: data.daoHandlerId, response: "ok" })
}