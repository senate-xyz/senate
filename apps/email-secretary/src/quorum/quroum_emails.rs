use std::sync::Arc;

use crate::prisma;

pub async fn send_quorum_emails(db: &Arc<prisma::PrismaClient>) {}
