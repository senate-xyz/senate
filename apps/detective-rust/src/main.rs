pub mod contracts;
pub mod handlers;
pub mod prisma;
mod router;
pub mod utils {
    pub mod etherscan;
}
use crate::router::chain_proposals::update_chain_proposals;
use crate::router::chain_votes::update_chain_votes;
use crate::router::snapshot_proposals::update_snapshot_proposals;
use crate::router::snapshot_votes::update_snapshot_votes;
use std::env;
use std::sync::Arc;

use dotenv::dotenv;
use ethers::providers::{Http, Provider};

use prisma::PrismaClient;

use serde::{Deserialize, Serialize};

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
