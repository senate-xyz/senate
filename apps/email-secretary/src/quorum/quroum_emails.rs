use std::sync::Arc;

use chrono::{Duration, Utc};
use reqwest::header::{HeaderMap, ACCEPT, CONTENT_TYPE};
use serde::{Deserialize, Serialize};

use crate::prisma::{
    self,
    dao,
    notification,
    proposal,
    subscription,
    user,
    MagicUserState,
    NotificationType,
};

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug, Clone)]
struct EmailBody {
    To: String,
    From: String,
    TemplateAlias: String,
    TemplateModel: QuorumWarningData,
}

#[allow(non_snake_case)]
#[derive(Serialize, Deserialize, Debug, Clone)]
struct QuorumWarningData {
    daoName: String,
    chain: String,
    daoLogoUrl: String,
    proposalName: String,
    countdownUrl: String,
    voteUrl: String,
}

prisma::proposal::include!(proposal_with_dao { dao });
prisma::user::include!(user_with_voters_and_subscriptions { subscriptions voters});

pub async fn send_quorum_email(db: &Arc<prisma::PrismaClient>) {
    generate_quorum(db).await;
}

pub async fn generate_quorum(db: &Arc<prisma::PrismaClient>) {
    let proposals_ending_soon = db
        .proposal()
        .find_many(vec![
            proposal::timeend::gt(Utc::now().into()),
            proposal::timeend::lte((Utc::now() + Duration::hours(12)).into()),
        ])
        .include(proposal_with_dao::include())
        .exec()
        .await
        .unwrap();

    let proposals_ending_no_quorum: Vec<_> = proposals_ending_soon
        .iter()
        .filter(|&p| p.quorum.as_f64().unwrap() > p.scorestotal.as_f64().unwrap())
        .collect();

    for proposal in proposals_ending_no_quorum.iter() {
        if proposal.dao.quorumwarningemail {
            let subscriptions = db
                .subscription()
                .find_many(vec![subscription::daoid::equals(
                    proposal.daoid.to_string(),
                )])
                .include(subscription::include!({ user dao }))
                .exec()
                .await
                .unwrap();

            for sub in subscriptions.iter() {
                db.notification()
                    .upsert(
                        notification::userid_proposalid_type(
                            sub.userid.to_string(),
                            proposal.id.to_string(),
                            NotificationType::QuorumNotReachedEmail,
                        ),
                        notification::create(
                            prisma::user::UniqueWhereParam::IdEquals(sub.userid.clone()),
                            prisma::proposal::UniqueWhereParam::IdEquals(proposal.id.clone()),
                            NotificationType::QuorumNotReachedEmail,
                            vec![notification::dispatched::set(false)],
                        ),
                        vec![],
                    )
                    .exec()
                    .await
                    .unwrap();
            }
        }
    }
}
