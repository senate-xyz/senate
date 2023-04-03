use rocket::serde::json::Json;

use crate::{ VotesRequest, VotesResponse };

#[post("/updateChainVotes", data = "<data>")]
pub fn update_chain_votes(data: Json<VotesRequest<'_>>) -> Json<VotesResponse> {
    println!("{:?}, {:?}", data.daoHandlerId, data.voters);
    Json(VotesResponse { voterAddress: "voter", response: "ok" })
}