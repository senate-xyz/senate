pub use aavestrategy::*;
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
pub mod aavestrategy {
    #[rustfmt::skip]
    const __ABI: &str = "[\n  {\n    \"inputs\": [\n      { \"internalType\": \"address\", \"name\": \"aave\", \"type\": \"address\" },\n      { \"internalType\": \"address\", \"name\": \"stkAave\", \"type\": \"address\" }\n    ],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"constructor\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"AAVE\",\n    \"outputs\": [{ \"internalType\": \"address\", \"name\": \"\", \"type\": \"address\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"STK_AAVE\",\n    \"outputs\": [{ \"internalType\": \"address\", \"name\": \"\", \"type\": \"address\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"address\", \"name\": \"user\", \"type\": \"address\" },\n      { \"internalType\": \"uint256\", \"name\": \"blockNumber\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"getPropositionPowerAt\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"blockNumber\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"getTotalPropositionSupplyAt\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"blockNumber\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"getTotalVotingSupplyAt\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"address\", \"name\": \"user\", \"type\": \"address\" },\n      { \"internalType\": \"uint256\", \"name\": \"blockNumber\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"getVotingPowerAt\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  }\n]";
    ///The parsed JSON ABI of the contract.
    pub static AAVESTRATEGY_ABI: ::ethers::contract::Lazy<::ethers::core::abi::Abi> =
        ::ethers::contract::Lazy::new(|| {
            ::ethers::core::utils::__serde_json::from_str(__ABI).expect("ABI is always valid")
        });
    pub struct aavestrategy<M>(::ethers::contract::Contract<M>);
    impl<M> ::core::clone::Clone for aavestrategy<M> {
        fn clone(&self) -> Self {
            Self(::core::clone::Clone::clone(&self.0))
        }
    }
    impl<M> ::core::ops::Deref for aavestrategy<M> {
        type Target = ::ethers::contract::Contract<M>;
        fn deref(&self) -> &Self::Target {
            &self.0
        }
    }
    impl<M> ::core::ops::DerefMut for aavestrategy<M> {
        fn deref_mut(&mut self) -> &mut Self::Target {
            &mut self.0
        }
    }
    impl<M> ::core::fmt::Debug for aavestrategy<M> {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            f.debug_tuple(stringify!(aavestrategy))
                .field(&self.address())
                .finish()
        }
    }
    impl<M: ::ethers::providers::Middleware> aavestrategy<M> {
        /// Creates a new contract instance with the specified `ethers` client at
        /// `address`. The contract derefs to a `ethers::Contract` object.
        pub fn new<T: Into<::ethers::core::types::Address>>(
            address: T,
            client: ::std::sync::Arc<M>,
        ) -> Self {
            Self(::ethers::contract::Contract::new(
                address.into(),
                AAVESTRATEGY_ABI.clone(),
                client,
            ))
        }
        ///Calls the contract's `AAVE` (0x48ccda3c) function
        pub fn aave(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::Address> {
            self.0
                .method_hash([72, 204, 218, 60], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `STK_AAVE` (0xbdf2878d) function
        pub fn stk_aave(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::Address> {
            self.0
                .method_hash([189, 242, 135, 141], ())
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
    impl<M: ::ethers::providers::Middleware> From<::ethers::contract::Contract<M>> for aavestrategy<M> {
        fn from(contract: ::ethers::contract::Contract<M>) -> Self {
            Self::new(contract.address(), contract.client())
        }
    }
    ///Container type for all input parameters for the `AAVE` function with signature `AAVE()` and selector `0x48ccda3c`
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
    #[ethcall(name = "AAVE", abi = "AAVE()")]
    pub struct AaveCall;
    ///Container type for all input parameters for the `STK_AAVE` function with signature `STK_AAVE()` and selector `0xbdf2878d`
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
    #[ethcall(name = "STK_AAVE", abi = "STK_AAVE()")]
    pub struct StkAaveCall;
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
    pub enum aavestrategyCalls {
        Aave(AaveCall),
        StkAave(StkAaveCall),
        GetPropositionPowerAt(GetPropositionPowerAtCall),
        GetTotalPropositionSupplyAt(GetTotalPropositionSupplyAtCall),
        GetTotalVotingSupplyAt(GetTotalVotingSupplyAtCall),
        GetVotingPowerAt(GetVotingPowerAtCall),
    }
    impl ::ethers::core::abi::AbiDecode for aavestrategyCalls {
        fn decode(
            data: impl AsRef<[u8]>,
        ) -> ::core::result::Result<Self, ::ethers::core::abi::AbiError> {
            let data = data.as_ref();
            if let Ok(decoded) = <AaveCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Aave(decoded));
            }
            if let Ok(decoded) = <StkAaveCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::StkAave(decoded));
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
    impl ::ethers::core::abi::AbiEncode for aavestrategyCalls {
        fn encode(self) -> Vec<u8> {
            match self {
                Self::Aave(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::StkAave(element) => ::ethers::core::abi::AbiEncode::encode(element),
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
    impl ::core::fmt::Display for aavestrategyCalls {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            match self {
                Self::Aave(element) => ::core::fmt::Display::fmt(element, f),
                Self::StkAave(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetPropositionPowerAt(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetTotalPropositionSupplyAt(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetTotalVotingSupplyAt(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetVotingPowerAt(element) => ::core::fmt::Display::fmt(element, f),
            }
        }
    }
    impl ::core::convert::From<AaveCall> for aavestrategyCalls {
        fn from(value: AaveCall) -> Self {
            Self::Aave(value)
        }
    }
    impl ::core::convert::From<StkAaveCall> for aavestrategyCalls {
        fn from(value: StkAaveCall) -> Self {
            Self::StkAave(value)
        }
    }
    impl ::core::convert::From<GetPropositionPowerAtCall> for aavestrategyCalls {
        fn from(value: GetPropositionPowerAtCall) -> Self {
            Self::GetPropositionPowerAt(value)
        }
    }
    impl ::core::convert::From<GetTotalPropositionSupplyAtCall> for aavestrategyCalls {
        fn from(value: GetTotalPropositionSupplyAtCall) -> Self {
            Self::GetTotalPropositionSupplyAt(value)
        }
    }
    impl ::core::convert::From<GetTotalVotingSupplyAtCall> for aavestrategyCalls {
        fn from(value: GetTotalVotingSupplyAtCall) -> Self {
            Self::GetTotalVotingSupplyAt(value)
        }
    }
    impl ::core::convert::From<GetVotingPowerAtCall> for aavestrategyCalls {
        fn from(value: GetVotingPowerAtCall) -> Self {
            Self::GetVotingPowerAt(value)
        }
    }
    ///Container type for all return fields from the `AAVE` function with signature `AAVE()` and selector `0x48ccda3c`
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
    pub struct AaveReturn(pub ::ethers::core::types::Address);
    ///Container type for all return fields from the `STK_AAVE` function with signature `STK_AAVE()` and selector `0xbdf2878d`
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
    pub struct StkAaveReturn(pub ::ethers::core::types::Address);
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
