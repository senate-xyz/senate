use rocket::serde::json::Json;

use crate::{ ProposalsRequest, ProposalsResponse };

#[post("/updateSnapshotProposals", data = "<data>")]
pub fn update_snapshot_proposals(data: Json<ProposalsRequest<'_>>) -> Json<ProposalsResponse> {
    Json(ProposalsResponse { daoHandlerId: data.daoHandlerId, response: "ok" })
}