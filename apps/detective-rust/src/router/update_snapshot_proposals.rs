use rocket::serde::json::Json;

use crate::{ ProposalsRequest, ProposalsResponse, Ctx, prisma::daohandler };

#[post("/updateSnapshotProposals", data = "<data>")]
pub async fn update_snapshot_proposals<'a>(
    ctx: &Ctx,
    data: Json<ProposalsRequest<'a>>
) -> Json<ProposalsResponse<'a>> {
    let dao_handler = ctx.db
        .daohandler()
        .find_first(vec![daohandler::id::equals(data.daoHandlerId.to_string())])
        .exec().await;

    Json(ProposalsResponse { daoHandlerId: data.daoHandlerId, response: "ok" })
}