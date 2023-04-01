use std::sync::{ RwLock, Arc };
use crate::{ prisma };
use prisma::{ PrismaClient };

#[derive(Debug, Clone)]
pub struct Config {
    pub refresh_interval: u32,

    pub normal_chain_proposals: u32,
    pub normal_chain_votes: u32,
    pub normal_snapshot_proposals: u32,
    pub normal_snapshot_votes: u32,

    pub new_chain_proposals: u32,
    pub new_chain_votes: u32,
    pub new_snapshot_proposals: u32,
    pub new_snapshot_votes: u32,

    pub force_chain_proposals: u32,
    pub force_chain_votes: u32,
    pub force_snapshot_proposals: u32,
    pub force_snapshot_votes: u32,

    pub batch_chain_votes: u32,
    pub batch_snapshot_votes: u32,
}

lazy_static::lazy_static! {
    pub static ref CONFIG: Arc<RwLock<Config>> = Arc::new(
        RwLock::new(Config {
            refresh_interval: 300,

            normal_chain_proposals: 60 * 1000,
            normal_chain_votes: 60 * 1000,
            normal_snapshot_proposals: 60 * 1000,
            normal_snapshot_votes: 60 * 1000,

            new_chain_proposals: 5 * 60 * 1000,
            new_chain_votes: 5 * 60 * 1000,
            new_snapshot_proposals: 5 * 60 * 1000,
            new_snapshot_votes: 5 * 60 * 1000,

            force_chain_proposals: 5 * 1000,
            force_chain_votes: 5 * 1000,
            force_snapshot_proposals: 5 * 1000,
            force_snapshot_votes: 5 * 1000,

            batch_chain_votes: 100,
            batch_snapshot_votes: 100,
        })
    );
}

async fn load_config_value(client: &PrismaClient, key: &str, default_value: u32) -> u32 {
    if
        let Ok(Some(config_data)) = client
            .config()
            .find_first(vec![prisma::config::key::equals(key.to_string())])
            .exec().await
    {
        config_data.value as u32
    } else {
        let _ = client
            .config()
            .create(key.to_string(), default_value as i32, vec![])
            .exec().await;

        default_value
    }
}
pub(crate) async fn load_config_from_db(client: &PrismaClient) {
    let refresh_interval = load_config_value(&client, "refresh_interval", 300).await;

    let normal_chain_proposals = load_config_value(
        &client,
        "normal_chain_proposals",
        60 * 1000
    ).await;
    let normal_chain_votes = load_config_value(&client, "normal_chain_votes", 60 * 1000).await;
    let normal_snapshot_proposals = load_config_value(
        &client,
        "normal_snapshot_proposals",
        60 * 1000
    ).await;
    let normal_snapshot_votes = load_config_value(
        &client,
        "normal_snapshot_votes",
        60 * 1000
    ).await;

    let force_chain_proposals = load_config_value(
        &client,
        "force_chain_proposals",
        5 * 60 * 1000
    ).await;
    let force_chain_votes = load_config_value(&client, "force_chain_votes", 5 * 60 * 1000).await;
    let force_snapshot_proposals = load_config_value(
        &client,
        "force_snapshot_proposals",
        5 * 60 * 1000
    ).await;
    let force_snapshot_votes = load_config_value(
        &client,
        "force_snapshot_votes",
        5 * 60 * 1000
    ).await;

    let new_chain_proposals = load_config_value(&client, "new_chain_proposals", 5 * 1000).await;
    let new_chain_votes = load_config_value(&client, "new_chain_votes", 5 * 1000).await;
    let new_snapshot_proposals = load_config_value(
        &client,
        "new_snapshot_proposals",
        5 * 1000
    ).await;
    let new_snapshot_votes = load_config_value(&client, "new_snapshot_votes", 5 * 1000).await;

    let batch_chain_votes = load_config_value(&client, "batch_chain_votes", 100).await;
    let batch_snapshot_votes = load_config_value(&client, "batch_snapshot_votes", 100).await;

    let mut config = CONFIG.write().unwrap();

    config.refresh_interval = refresh_interval;
    config.normal_chain_proposals = normal_chain_proposals;
    config.normal_chain_votes = normal_chain_votes;
    config.normal_snapshot_proposals = normal_snapshot_proposals;
    config.normal_snapshot_votes = normal_snapshot_votes;
    config.force_chain_proposals = force_chain_proposals;
    config.force_chain_votes = force_chain_votes;
    config.force_snapshot_proposals = force_snapshot_proposals;
    config.force_snapshot_votes = force_snapshot_votes;
    config.new_chain_proposals = new_chain_proposals;
    config.new_chain_votes = new_chain_votes;
    config.new_snapshot_proposals = new_snapshot_proposals;
    config.new_snapshot_votes = new_snapshot_votes;
    config.batch_chain_votes = batch_chain_votes;
    config.batch_snapshot_votes = batch_snapshot_votes;

    println!("Loaded config: {:?}", config)
}