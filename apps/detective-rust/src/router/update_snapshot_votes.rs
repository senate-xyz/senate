use rocket::serde::json::Json;

use crate::{ VotesRequest, VotesResponse, Ctx, prisma::daohandler };

#[post("/updateSnapshotVotes", data = "<data>")]
pub async fn update_snapshot_votes<'a>(
    ctx: &Ctx,
    data: Json<VotesRequest<'a>>
) -> Json<VotesResponse<'a>> {
    let dao_handler = ctx.db
        .daohandler()
        .find_first(vec![daohandler::id::equals(data.daoHandlerId.to_string())])
        .exec().await;
    Json(VotesResponse { voterAddress: "voter", response: "ok" })
}