use std::sync::{ RwLock, Arc };
use crate::{ prisma };
use prisma::{ PrismaClient };

#[derive(Debug)]
pub struct Config {
    refresh_interval: u32,

    normal_chain_proposals: u32,
    normal_chain_votes: u32,
    normal_snapshot_proposals: u32,
    normal_snapshot_votes: u32,

    new_chain_proposals: u32,
    new_chain_votes: u32,
    new_snapshot_proposals: u32,
    new_snapshot_votes: u32,

    force_chain_proposals: u32,
    force_chain_votes: u32,
    force_snapshot_proposals: u32,
    force_snapshot_votes: u32,

    batch_chain_votes: u32,
    batch_snapshot_votes: u32,
}

lazy_static::lazy_static! {
    pub static ref CONFIG: Arc<RwLock<Config>> = Arc::new(
        RwLock::new(Config {
            refresh_interval: 300,

            normal_chain_proposals: 60 * 1000,
            normal_chain_votes: 60 * 1000,
            normal_snapshot_proposals: 60 * 1000,
            normal_snapshot_votes: 60 * 1000,

            new_chain_proposals: 5 * 1000,
            new_chain_votes: 5 * 1000,
            new_snapshot_proposals: 5 * 1000,
            new_snapshot_votes: 5 * 1000,

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

pub(crate) async fn load_config_from_db() {
    let client = PrismaClient::_builder().build().await.unwrap();

    let mut config = CONFIG.write().unwrap();

    config.refresh_interval = load_config_value(&client, "refresh_interval", 300).await;

    config.normal_chain_proposals = load_config_value(
        &client,
        "normal_chain_proposals",
        60 * 1000
    ).await;
    config.normal_chain_votes = load_config_value(&client, "normal_chain_votes", 60 * 1000).await;
    config.normal_snapshot_proposals = load_config_value(
        &client,
        "normal_snapshot_proposals",
        60 * 1000
    ).await;
    config.normal_snapshot_votes = load_config_value(
        &client,
        "normal_snapshot_votes",
        60 * 1000
    ).await;

    config.force_chain_proposals = load_config_value(
        &client,
        "force_chain_proposals",
        5 * 1000
    ).await;
    config.force_chain_votes = load_config_value(&client, "force_chain_votes", 5 * 1000).await;
    config.force_snapshot_proposals = load_config_value(
        &client,
        "force_snapshot_proposals",
        5 * 1000
    ).await;
    config.force_snapshot_votes = load_config_value(
        &client,
        "force_snapshot_votes",
        5 * 1000
    ).await;

    config.new_chain_proposals = load_config_value(&client, "new_chain_proposals", 5 * 1000).await;
    config.new_chain_votes = load_config_value(&client, "new_chain_votes", 5 * 1000).await;
    config.new_snapshot_proposals = load_config_value(
        &client,
        "new_snapshot_proposals",
        5 * 1000
    ).await;
    config.new_snapshot_votes = load_config_value(&client, "new_snapshot_votes", 5 * 1000).await;

    config.batch_chain_votes = load_config_value(&client, "batch_chain_votes", 100).await;
    config.batch_snapshot_votes = load_config_value(
        &client,
        "batch_snapshot_votes",
        5 * 1000
    ).await;

    println!("Loaded config: {:?}", config)
}