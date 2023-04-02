use router::update_chain_votes::update_chain_votes;
use router::update_snapshot_votes::update_snapshot_votes;
use serde::{ Deserialize, Serialize };
use crate::router::update_snapshot_proposals::update_snapshot_proposals;
use crate::router::update_chain_proposals::update_chain_proposals;
mod router {
    pub mod update_snapshot_proposals;
    pub mod update_chain_proposals;
    pub mod update_chain_votes;
    pub mod update_snapshot_votes;
}

#[macro_use]
extern crate rocket;

#[allow(non_snake_case)]
#[derive(Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct ProposalsRequest<'r> {
    daoHandlerId: &'r str,
}

#[allow(non_snake_case)]
#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
pub struct ProposalsResponse<'r> {
    daoHandlerId: &'r str,
    response: &'static str,
}

#[allow(non_snake_case)]
#[derive(Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct VotesRequest<'r> {
    daoHandlerId: &'r str,
    voters: Vec<String>,
}

#[allow(non_snake_case)]
#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
pub struct VotesResponse<'r> {
    voterAddress: &'r str,
    response: &'static str,
}

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[launch]
fn rocket() -> _ {
    rocket
        ::build()
        .mount("/", routes![index])
        .mount("/proposals", routes![update_snapshot_proposals, update_chain_proposals])
        .mount("/votes", routes![update_chain_votes, update_snapshot_votes])
}