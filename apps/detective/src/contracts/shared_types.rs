///`Receipt(bool,uint8,uint96)`
#[derive(
    Clone,
    ::ethers::contract::EthAbiType,
    ::ethers::contract::EthAbiCodec,
    Default,
    Debug,
    PartialEq,
    Eq,
    Hash
)]
pub struct Receipt {
    pub has_voted: bool,
    pub support: u8,
    pub votes: u128,
}
