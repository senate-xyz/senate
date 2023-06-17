use anyhow::Result;
use tracing::{debug, instrument};

use crate::prisma::{PrismaClient, RefreshStatus, voter, voterhandler};

#[instrument(skip(client), level = "info")]
pub(crate) async fn create_voter_handlers(client: &PrismaClient) -> Result<()> {
    let voters_count = client.voter().count(vec![]).exec().await.unwrap();

    let daohandlers_count = client.daohandler().count(vec![]).exec().await.unwrap();

    let voterhandler_count = client.voterhandler().count(vec![]).exec().await.unwrap();

    if voters_count * daohandlers_count > voterhandler_count {
        let daohandlers = client.daohandler().find_many(vec![]).exec().await.unwrap();
        let voters = client
            .voter()
            .find_many(vec![voter::voterhandlers::none(vec![])])
            .exec()
            .await
            .unwrap();

        for voter in voters {
            let result = client
                .voterhandler()
                .create_many(
                    daohandlers
                        .iter()
                        .map(|daohandler| {
                            voterhandler::create_unchecked(
                                daohandler.id.clone(),
                                voter.id.clone(),
                                vec![],
                            )
                        })
                        .collect(),
                )
                .skip_duplicates()
                .exec()
                .await?;

            debug!("created {:?} votehandlers", result);
        }
    }
    Ok(())
}
