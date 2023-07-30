use anyhow::Result;
use tracing::{debug, event, instrument, Level};

use crate::prisma::{self, voter, voterhandler, PrismaClient};
use crate::RefreshStatus;

pub(crate) async fn create_voter_handlers(client: &PrismaClient) -> Result<()> {
    // remove_orphan_voters(client);

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
            let _result = client
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
        }
    }

    Ok(())
}

async fn _remove_orphan_voters(client: &PrismaClient) {
    prisma::voter::include!(voter_with_users { users });

    let all_voters = client
        .voter()
        .find_many(vec![])
        .include(voter_with_users::include())
        .exec()
        .await
        .expect("Failed to fetch voters");

    let orphan_voters: Vec<voter_with_users::Data> = all_voters
        .into_iter()
        .filter(|v| v.users.is_empty())
        .collect();

    if !orphan_voters.is_empty() {
        client
            .vote()
            .delete_many(vec![prisma::vote::voteraddress::in_vec(
                orphan_voters
                    .clone()
                    .into_iter()
                    .map(|v| v.address)
                    .collect(),
            )])
            .exec()
            .await
            .unwrap();

        client
            .voterhandler()
            .delete_many(vec![prisma::voterhandler::voterid::in_vec(
                orphan_voters.clone().into_iter().map(|v| v.id).collect(),
            )])
            .exec()
            .await
            .unwrap();

        client
            .voter()
            .delete_many(vec![prisma::voter::id::in_vec(
                orphan_voters.clone().into_iter().map(|v| v.id).collect(),
            )])
            .exec()
            .await
            .unwrap();
    }
}
