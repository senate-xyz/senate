use rocket::serde::json::Json;

use crate::{ VotesRequest, VotesResponse, Ctx, prisma::{ daohandler, voterhandler, voter } };

#[post("/chain_votes", data = "<data>")]
pub async fn update_chain_votes<'a>(
    ctx: &Ctx,
    data: Json<VotesRequest<'a>>
) -> Json<Vec<VotesResponse>> {
    let _dao_handler = match
        ctx.db
            .daohandler()
            .find_first(vec![daohandler::id::equals(data.daoHandlerId.to_string())])
            .exec().await
            .unwrap()
    {
        Some(data) => data,
        None => panic!("daoHandlerId not found"),
    };

    let _voter_handlers = match
        ctx.db
            .voterhandler()
            .find_many(
                vec![
                    voterhandler::voter::is(vec![voter::address::in_vec(data.voters.clone())]),
                    voterhandler::daohandler::is(
                        vec![daohandler::id::equals(data.daoHandlerId.to_string())]
                    )
                ]
            )
            .exec().await
    {
        Ok(data) => data,
        Err(_) => panic!("voter handlers not found"),
    };

    let voters = data.voters.clone();

    let result: Vec<VotesResponse> = voters
        .into_iter()
        .map(|v| VotesResponse { voter_address: v, result: "ok" })
        .collect();

    Json(result)
}