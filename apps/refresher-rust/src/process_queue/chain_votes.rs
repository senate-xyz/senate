use crate::{ RefreshEntry, prisma::PrismaClient };

pub(crate) async fn process_chain_votes(entry: RefreshEntry, client: &PrismaClient) {
    println!("process {:?}", entry)
}