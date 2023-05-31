pub mod outbound_clicks;
pub mod outbound_data;
pub mod outbound_opens;
use dotenv::dotenv;

use crate::outbound_clicks::outbound_clicks;
use crate::outbound_data::outbound_data;
use crate::outbound_opens::outbound_opens;

#[tokio::main]
async fn main() {
    dotenv().ok();
    outbound_data().await;
    outbound_opens().await;
    outbound_clicks().await;
}
