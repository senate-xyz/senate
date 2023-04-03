use rocket::serde::json::Json;

use crate::{ ProposalsRequest, ProposalsResponse, Ctx, prisma::daohandler };

#[post("/chain_proposals", data = "<data>")]
pub async fn update_chain_proposals<'a>(
    ctx: &Ctx,
    data: Json<ProposalsRequest<'a>>
) -> Json<ProposalsResponse<'a>> {
    let _dao_handler = ctx.db
        .daohandler()
        .find_first(vec![daohandler::id::equals(data.daoHandlerId.to_string())])
        .exec().await;

    Json(ProposalsResponse { daoHandlerId: data.daoHandlerId, response: "ok" })
}