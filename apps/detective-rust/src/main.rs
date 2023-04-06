use std::env;
use std::sync::Arc;

use dotenv::dotenv;
use ethers::providers::{Http, Provider};

use crate::router::update_chain_proposals::update_chain_proposals;
use crate::router::update_snapshot_proposals::update_snapshot_proposals;
use prisma::PrismaClient;
use router::update_chain_votes::update_chain_votes;
use router::update_snapshot_votes::update_snapshot_votes;
use serde::{Deserialize, Serialize};
mod router {
    pub mod update_chain_proposals;
    pub mod update_chain_votes;
    pub mod update_snapshot_proposals;
    pub mod update_snapshot_votes;
}
pub mod prisma;

pub mod handlers {
    pub mod proposals {
        pub mod aave;
    }
    pub mod votes {
        pub mod aave;
    }
}

pub mod contracts;

#[macro_use]
extern crate rocket;

#[derive(Clone)]
pub struct Context {
    pub db: Arc<PrismaClient>,
    pub client: Arc<Provider<Http>>,
}
pub type Ctx = rocket::State<Context>;

#[allow(non_snake_case)]
#[derive(Deserialize, Clone)]
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

#[derive(Serialize, Debug, Clone)]
#[serde(crate = "rocket::serde")]
pub struct VotesResponse {
    voter_address: String,
    result: &'static str,
}

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[launch]
async fn rocket() -> _ {
    dotenv().ok();
    let rpc_url = match env::var_os("ALCHEMY_NODE_URL") {
        Some(v) => v.into_string().unwrap(),
        None => panic!("$ALCHEMY_NODE_URL is not set"),
    };

    let provider = Provider::<Http>::try_from(rpc_url).unwrap();
    let client = Arc::new(provider);
    let db = Arc::new(
        prisma::new_client()
            .await
            .expect("Failed to create Prisma client"),
    );

    rocket::build()
        .manage(Context { db, client })
        .mount("/", routes![index])
        .mount(
            "/proposals",
            routes![update_snapshot_proposals, update_chain_proposals],
        )
        .mount("/votes", routes![update_chain_votes, update_snapshot_votes])
}
