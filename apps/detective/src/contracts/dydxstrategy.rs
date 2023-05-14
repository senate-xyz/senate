pub use dydxstrategy::*;
/// This module was auto-generated with ethers-rs Abigen.
/// More information at: <https://github.com/gakonst/ethers-rs>
#[allow(
    clippy::enum_variant_names,
    clippy::too_many_arguments,
    clippy::upper_case_acronyms,
    clippy::type_complexity,
    dead_code,
    non_camel_case_types
)]
pub mod dydxstrategy {
    #[rustfmt::skip]
    const __ABI: &str = "[\n  {\n    \"inputs\": [\n      { \"internalType\": \"address\", \"name\": \"dydxToken\", \"type\": \"address\" },\n      {\n        \"internalType\": \"address\",\n        \"name\": \"stakedDydxToken\",\n        \"type\": \"address\"\n      }\n    ],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"constructor\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"DYDX_TOKEN\",\n    \"outputs\": [{ \"internalType\": \"address\", \"name\": \"\", \"type\": \"address\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"STAKED_DYDX_TOKEN\",\n    \"outputs\": [{ \"internalType\": \"address\", \"name\": \"\", \"type\": \"address\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"address\", \"name\": \"user\", \"type\": \"address\" },\n      { \"internalType\": \"uint256\", \"name\": \"blockNumber\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"getPropositionPowerAt\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"blockNumber\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"getTotalPropositionSupplyAt\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"blockNumber\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"getTotalVotingSupplyAt\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"address\", \"name\": \"user\", \"type\": \"address\" },\n      { \"internalType\": \"uint256\", \"name\": \"blockNumber\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"getVotingPowerAt\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  }\n]";
    ///The parsed JSON ABI of the contract.
    pub static DYDXSTRATEGY_ABI: ::ethers::contract::Lazy<::ethers::core::abi::Abi> =
        ::ethers::contract::Lazy::new(|| {
            ::ethers::core::utils::__serde_json::from_str(__ABI).expect("ABI is always valid")
        });
    pub struct dydxstrategy<M>(::ethers::contract::Contract<M>);
    impl<M> ::core::clone::Clone for dydxstrategy<M> {
        fn clone(&self) -> Self {
            Self(::core::clone::Clone::clone(&self.0))
        }
    }
    impl<M> ::core::ops::Deref for dydxstrategy<M> {
        type Target = ::ethers::contract::Contract<M>;
        fn deref(&self) -> &Self::Target {
            &self.0
        }
    }
    impl<M> ::core::ops::DerefMut for dydxstrategy<M> {
        fn deref_mut(&mut self) -> &mut Self::Target {
            &mut self.0
        }
    }
    impl<M> ::core::fmt::Debug for dydxstrategy<M> {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            f.debug_tuple(stringify!(dydxstrategy))
                .field(&self.address())
                .finish()
        }
    }
    impl<M: ::ethers::providers::Middleware> dydxstrategy<M> {
        /// Creates a new contract instance with the specified `ethers` client at
        /// `address`. The contract derefs to a `ethers::Contract` object.
        pub fn new<T: Into<::ethers::core::types::Address>>(
            address: T,
            client: ::std::sync::Arc<M>,
        ) -> Self {
            Self(::ethers::contract::Contract::new(
                address.into(),
                DYDXSTRATEGY_ABI.clone(),
                client,
            ))
        }
        ///Calls the contract's `DYDX_TOKEN` (0x3257a4a1) function
        pub fn dydx_token(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::Address> {
            self.0
                .method_hash([50, 87, 164, 161], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `STAKED_DYDX_TOKEN` (0x1d8e6f82) function
        pub fn staked_dydx_token(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::Address> {
            self.0
                .method_hash([29, 142, 111, 130], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getPropositionPowerAt` (0xa1076e58) function
        pub fn get_proposition_power_at(
            &self,
            user: ::ethers::core::types::Address,
            block_number: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([161, 7, 110, 88], (user, block_number))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getTotalPropositionSupplyAt` (0xf6b50203) function
        pub fn get_total_proposition_supply_at(
            &self,
            block_number: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([246, 181, 2, 3], block_number)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getTotalVotingSupplyAt` (0x7a71f9d7) function
        pub fn get_total_voting_supply_at(
            &self,
            block_number: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([122, 113, 249, 215], block_number)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getVotingPowerAt` (0xeaeded5f) function
        pub fn get_voting_power_at(
            &self,
            user: ::ethers::core::types::Address,
            block_number: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([234, 237, 237, 95], (user, block_number))
                .expect("method not found (this should never happen)")
        }
    }
    impl<M: ::ethers::providers::Middleware> From<::ethers::contract::Contract<M>> for dydxstrategy<M> {
        fn from(contract: ::ethers::contract::Contract<M>) -> Self {
            Self::new(contract.address(), contract.client())
        }
    }
    ///Container type for all input parameters for the `DYDX_TOKEN` function with signature `DYDX_TOKEN()` and selector `0x3257a4a1`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "DYDX_TOKEN", abi = "DYDX_TOKEN()")]
    pub struct DydxTokenCall;
    ///Container type for all input parameters for the `STAKED_DYDX_TOKEN` function with signature `STAKED_DYDX_TOKEN()` and selector `0x1d8e6f82`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "STAKED_DYDX_TOKEN", abi = "STAKED_DYDX_TOKEN()")]
    pub struct StakedDydxTokenCall;
    ///Container type for all input parameters for the `getPropositionPowerAt` function with signature `getPropositionPowerAt(address,uint256)` and selector `0xa1076e58`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(
        name = "getPropositionPowerAt",
        abi = "getPropositionPowerAt(address,uint256)"
    )]
    pub struct GetPropositionPowerAtCall {
        pub user: ::ethers::core::types::Address,
        pub block_number: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `getTotalPropositionSupplyAt` function with signature `getTotalPropositionSupplyAt(uint256)` and selector `0xf6b50203`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(
        name = "getTotalPropositionSupplyAt",
        abi = "getTotalPropositionSupplyAt(uint256)"
    )]
    pub struct GetTotalPropositionSupplyAtCall {
        pub block_number: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `getTotalVotingSupplyAt` function with signature `getTotalVotingSupplyAt(uint256)` and selector `0x7a71f9d7`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(
        name = "getTotalVotingSupplyAt",
        abi = "getTotalVotingSupplyAt(uint256)"
    )]
    pub struct GetTotalVotingSupplyAtCall {
        pub block_number: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `getVotingPowerAt` function with signature `getVotingPowerAt(address,uint256)` and selector `0xeaeded5f`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    #[ethcall(name = "getVotingPowerAt", abi = "getVotingPowerAt(address,uint256)")]
    pub struct GetVotingPowerAtCall {
        pub user: ::ethers::core::types::Address,
        pub block_number: ::ethers::core::types::U256,
    }
    ///Container type for all of the contract's call
    #[derive(Clone, ::ethers::contract::EthAbiType, Debug, PartialEq, Eq, Hash)]
    pub enum dydxstrategyCalls {
        DydxToken(DydxTokenCall),
        StakedDydxToken(StakedDydxTokenCall),
        GetPropositionPowerAt(GetPropositionPowerAtCall),
        GetTotalPropositionSupplyAt(GetTotalPropositionSupplyAtCall),
        GetTotalVotingSupplyAt(GetTotalVotingSupplyAtCall),
        GetVotingPowerAt(GetVotingPowerAtCall),
    }
    impl ::ethers::core::abi::AbiDecode for dydxstrategyCalls {
        fn decode(
            data: impl AsRef<[u8]>,
        ) -> ::core::result::Result<Self, ::ethers::core::abi::AbiError> {
            let data = data.as_ref();
            if let Ok(decoded) = <DydxTokenCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::DydxToken(decoded));
            }
            if let Ok(decoded) =
                <StakedDydxTokenCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::StakedDydxToken(decoded));
            }
            if let Ok(decoded) =
                <GetPropositionPowerAtCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::GetPropositionPowerAt(decoded));
            }
            if let Ok(decoded) =
                <GetTotalPropositionSupplyAtCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::GetTotalPropositionSupplyAt(decoded));
            }
            if let Ok(decoded) =
                <GetTotalVotingSupplyAtCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::GetTotalVotingSupplyAt(decoded));
            }
            if let Ok(decoded) =
                <GetVotingPowerAtCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::GetVotingPowerAt(decoded));
            }
            Err(::ethers::core::abi::Error::InvalidData.into())
        }
    }
    impl ::ethers::core::abi::AbiEncode for dydxstrategyCalls {
        fn encode(self) -> Vec<u8> {
            match self {
                Self::DydxToken(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::StakedDydxToken(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::GetPropositionPowerAt(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetTotalPropositionSupplyAt(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetTotalVotingSupplyAt(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetVotingPowerAt(element) => ::ethers::core::abi::AbiEncode::encode(element),
            }
        }
    }
    impl ::core::fmt::Display for dydxstrategyCalls {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            match self {
                Self::DydxToken(element) => ::core::fmt::Display::fmt(element, f),
                Self::StakedDydxToken(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetPropositionPowerAt(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetTotalPropositionSupplyAt(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetTotalVotingSupplyAt(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetVotingPowerAt(element) => ::core::fmt::Display::fmt(element, f),
            }
        }
    }
    impl ::core::convert::From<DydxTokenCall> for dydxstrategyCalls {
        fn from(value: DydxTokenCall) -> Self {
            Self::DydxToken(value)
        }
    }
    impl ::core::convert::From<StakedDydxTokenCall> for dydxstrategyCalls {
        fn from(value: StakedDydxTokenCall) -> Self {
            Self::StakedDydxToken(value)
        }
    }
    impl ::core::convert::From<GetPropositionPowerAtCall> for dydxstrategyCalls {
        fn from(value: GetPropositionPowerAtCall) -> Self {
            Self::GetPropositionPowerAt(value)
        }
    }
    impl ::core::convert::From<GetTotalPropositionSupplyAtCall> for dydxstrategyCalls {
        fn from(value: GetTotalPropositionSupplyAtCall) -> Self {
            Self::GetTotalPropositionSupplyAt(value)
        }
    }
    impl ::core::convert::From<GetTotalVotingSupplyAtCall> for dydxstrategyCalls {
        fn from(value: GetTotalVotingSupplyAtCall) -> Self {
            Self::GetTotalVotingSupplyAt(value)
        }
    }
    impl ::core::convert::From<GetVotingPowerAtCall> for dydxstrategyCalls {
        fn from(value: GetVotingPowerAtCall) -> Self {
            Self::GetVotingPowerAt(value)
        }
    }
    ///Container type for all return fields from the `DYDX_TOKEN` function with signature `DYDX_TOKEN()` and selector `0x3257a4a1`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct DydxTokenReturn(pub ::ethers::core::types::Address);
    ///Container type for all return fields from the `STAKED_DYDX_TOKEN` function with signature `STAKED_DYDX_TOKEN()` and selector `0x1d8e6f82`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct StakedDydxTokenReturn(pub ::ethers::core::types::Address);
    ///Container type for all return fields from the `getPropositionPowerAt` function with signature `getPropositionPowerAt(address,uint256)` and selector `0xa1076e58`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct GetPropositionPowerAtReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `getTotalPropositionSupplyAt` function with signature `getTotalPropositionSupplyAt(uint256)` and selector `0xf6b50203`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct GetTotalPropositionSupplyAtReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `getTotalVotingSupplyAt` function with signature `getTotalVotingSupplyAt(uint256)` and selector `0x7a71f9d7`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct GetTotalVotingSupplyAtReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `getVotingPowerAt` function with signature `getVotingPowerAt(address,uint256)` and selector `0xeaeded5f`
    #[derive(
        Clone,
        ::ethers::contract::EthAbiType,
        ::ethers::contract::EthAbiCodec,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash,
    )]
    pub struct GetVotingPowerAtReturn(pub ::ethers::core::types::U256);
}
