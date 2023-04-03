use rocket::serde::json::Json;

use crate::{ ProposalsRequest, ProposalsResponse };

#[post("/updateChainProposals", data = "<data>")]
pub fn update_chain_proposals(data: Json<ProposalsRequest<'_>>) -> Json<ProposalsResponse> {
    Json(ProposalsResponse { daoHandlerId: data.daoHandlerId, response: "ok" })
}