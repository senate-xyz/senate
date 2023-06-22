#![deny(unused_crate_dependencies)]
#![allow(unused_imports)]
#![allow(unused_parens)]

#[macro_use]
extern crate rocket;

use std::process;
use std::{env, sync::Arc};

use dotenv::dotenv;
use ethers::providers::{Http, Provider};
use reqwest_middleware::{ClientBuilder, ClientWithMiddleware};
use reqwest_retry::{policies::ExponentialBackoff, RetryTransientMiddleware};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use tracing::{debug_span, event, instrument, Instrument, Level};

use prisma::PrismaClient;
use utils::{maker_polls_sanity::maker_polls_sanity_check, snapshot_sanity::snapshot_sanity_check};

use crate::router::{
    chain_proposals::update_chain_proposals, chain_votes::update_chain_votes,
    snapshot_proposals::update_snapshot_proposals, snapshot_votes::update_snapshot_votes,
};

pub mod contracts;
pub mod handlers;
pub mod prisma;
mod router;

pub mod utils {
    pub mod etherscan;
    pub mod maker_polls_sanity;
    pub mod snapshot_sanity;
}

#[derive(Clone, Debug)]
pub struct Context {
    pub db: Arc<PrismaClient>,
    pub rpc: Arc<Provider<Http>>,
    pub http_client: Arc<ClientWithMiddleware>,
}

pub type Ctx = rocket::State<Context>;

#[allow(non_snake_case)]
#[derive(Deserialize, Clone, Debug)]
#[serde(crate = "rocket::serde")]
pub struct ProposalsRequest<'r> {
    daoHandlerId: &'r str,
    refreshspeed: i64,
}

#[allow(non_snake_case)]
#[derive(Serialize, Debug)]
#[serde(crate = "rocket::serde")]
pub struct ProposalsResponse<'r> {
    daoHandlerId: &'r str,
    success: bool,
}

#[allow(non_snake_case)]
#[derive(Deserialize, Debug)]
#[serde(crate = "rocket::serde")]
pub struct VotesRequest<'r> {
    daoHandlerId: &'r str,
    voters: Vec<String>,
    refreshspeed: i64,
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

#[get("/")]
fn health() -> &'static str {
    "ok"
}

#[launch]
async fn rocket() -> _ {
    dotenv().ok();

    tracing_subscriber::fmt()
        .pretty()
        .with_max_level(tracing::Level::INFO)
        .init();

    let rpc_url = env::var("ALCHEMY_NODE_URL").expect("$ALCHEMY_NODE_URL is not set");

    let provider = Provider::<Http>::try_from(rpc_url).unwrap();
    let rpc = Arc::new(provider);
    let db = Arc::new(
        prisma::new_client()
            .await
            .expect("Failed to create Prisma client"),
    );

    let retry_policy = ExponentialBackoff::builder().build_with_max_retries(5);

    let http_client = Arc::new(
        ClientBuilder::new(reqwest::Client::new())
            .with(RetryTransientMiddleware::new_with_policy(retry_policy))
            .build(),
    );

    let context = Context {
        db: db.clone(),
        rpc: rpc.clone(),
        http_client: http_client.clone(),
    };

    tokio::spawn(
        async move {
            let mut interval = tokio::time::interval(tokio::time::Duration::from_secs(5 * 60));
            loop {
                interval.tick().await;
                event!(Level::INFO, "running sanity");
                maker_polls_sanity_check(&context).await;
                snapshot_sanity_check(&context).await;
            }
        }
        .instrument(debug_span!("sanity")),
    );

    rocket::build()
        .manage(Context {
            db,
            rpc,
            http_client,
        })
        .mount("/", routes![index])
        .mount("/health", routes![health])
        .mount(
            "/proposals",
            routes![update_snapshot_proposals, update_chain_proposals],
        )
        .mount("/votes", routes![update_chain_votes, update_snapshot_votes])
}
