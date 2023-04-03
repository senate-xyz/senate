use rocket::serde::json::Json;

use crate::{ VotesRequest, VotesResponse, Ctx, prisma::daohandler };

#[post("/chain_votes", data = "<data>")]
pub async fn update_chain_votes<'a>(
    ctx: &Ctx,
    data: Json<VotesRequest<'a>>
) -> Json<Vec<VotesResponse>> {
    let _dao_handler = ctx.db
        .daohandler()
        .find_first(vec![daohandler::id::equals(data.daoHandlerId.to_string())])
        .exec().await;

    let result: VotesResponse = VotesResponse { voter_address: "voter".to_string(), result: "ok" };
    Json(vec![result])
}