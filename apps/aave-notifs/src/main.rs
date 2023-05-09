#[allow(warnings, unused)]
pub mod prisma;

use crate::prisma::user;
use dotenv::dotenv;

#[tokio::main]
async fn main() {
    dotenv().ok();
    println!("Starting scheduler!");

    let db = prisma::new_client()
        .await
        .expect("Failed to create Prisma client");

    let users_to_be_notified = db
        .user()
        .find_many(vec![user::isaaveuser::equals(true)])
        .exec()
        .await
        .unwrap();
    
    println!("{:?}", users_to_be_notified);
    println!("Finished");
}
