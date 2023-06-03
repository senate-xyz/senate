#![deny(unused_crate_dependencies)]
#![allow(unused_imports)]
#![allow(unused_parens)]

pub mod contracts;
pub mod handlers;
pub mod prisma;
mod router;
pub mod utils {
    pub mod etherscan;
    pub mod maker_polls_sanity;
    pub mod snapshot_sanity;
}
use crate::router::{
    chain_proposals::update_chain_proposals,
    chain_votes::update_chain_votes,
    snapshot_proposals::update_snapshot_proposals,
    snapshot_votes::update_snapshot_votes,
};
use std::{env, sync::Arc};

use dotenv::dotenv;
use ethers::providers::{Http, Provider};

use prisma::PrismaClient;

use serde::{Deserialize, Serialize};
use utils::{maker_polls_sanity::maker_polls_sanity_check, snapshot_sanity::snapshot_sanity_check};

#[macro_use]
extern crate rocket;

#[derive(Clone)]
pub struct Context {
    pub db: Arc<PrismaClient>,
    pub rpc: Arc<Provider<Http>>,
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
    success: bool,
}

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

fn init_logger() {
    use env_logger::{Builder, Env};
    let env = Env::default()
        .filter_or("LOG_LEVEL", "info")
        .write_style_or("LOG_STYLE", "always");

    Builder::from_env(env)
        .format_level(false)
        .format_timestamp_nanos()
        .init();
}

#[launch]
async fn rocket() -> _ {
    dotenv().ok();

    init_logger();
    let rpc_url = match env::var_os("ALCHEMY_NODE_URL") {
        Some(v) => v.into_string().unwrap(),
        None => panic!("$ALCHEMY_NODE_URL is not set"),
    };

    let provider = Provider::<Http>::try_from(rpc_url).unwrap();
    let rpc = Arc::new(provider);
    let db = Arc::new(
        prisma::new_client()
            .await
            .expect("Failed to create Prisma client"),
    );

    let context = Context {
        db: db.clone(),
        rpc: rpc.clone(),
    };

    tokio::spawn(async move {
        let mut interval = tokio::time::interval(tokio::time::Duration::from_secs(5 * 60));
        loop {
            interval.tick().await;
            maker_polls_sanity_check(Arc::clone(&context.db), Arc::clone(&context.rpc)).await;
            snapshot_sanity_check(Arc::clone(&context.db)).await;
        }
    });

    rocket::build()
        .manage(Context { db, rpc })
        .mount("/", routes![index])
        .mount(
            "/proposals",
            routes![update_snapshot_proposals, update_chain_proposals],
        )
        .mount("/votes", routes![update_chain_votes, update_snapshot_votes])
}
