pub use optimismvotemodule_5_4a_8f::*;
/// This module was auto-generated with ethers-rs Abigen.
/// More information at: <https://github.com/gakonst/ethers-rs>
#[allow(
    clippy::enum_variant_names,
    clippy::too_many_arguments,
    clippy::upper_case_acronyms,
    clippy::type_complexity,
    dead_code,
    non_camel_case_types,
)]
pub mod optimismvotemodule_5_4a_8f {
    #[rustfmt::skip]
    const __ABI: &str = "[\n  { \"inputs\": [], \"name\": \"ExistingProposal\", \"type\": \"error\" },\n  { \"inputs\": [], \"name\": \"InvalidParams\", \"type\": \"error\" },\n  { \"inputs\": [], \"name\": \"InvalidVoteType\", \"type\": \"error\" },\n  { \"inputs\": [], \"name\": \"MaxApprovalsExceeded\", \"type\": \"error\" },\n  { \"inputs\": [], \"name\": \"MaxChoicesExceeded\", \"type\": \"error\" },\n  { \"inputs\": [], \"name\": \"NotGovernor\", \"type\": \"error\" },\n  { \"inputs\": [], \"name\": \"OptionsNotStrictlyAscending\", \"type\": \"error\" },\n  { \"inputs\": [], \"name\": \"VoteAlreadyCast\", \"type\": \"error\" },\n  {\n    \"inputs\": [],\n    \"name\": \"COUNTING_MODE\",\n    \"outputs\": [{ \"internalType\": \"string\", \"name\": \"\", \"type\": \"string\" }],\n    \"stateMutability\": \"pure\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"PROPOSAL_DATA_ENCODING\",\n    \"outputs\": [{ \"internalType\": \"string\", \"name\": \"\", \"type\": \"string\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"VOTE_PARAMS_ENCODING\",\n    \"outputs\": [{ \"internalType\": \"string\", \"name\": \"\", \"type\": \"string\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"proposalId\", \"type\": \"uint256\" },\n      { \"internalType\": \"address\", \"name\": \"account\", \"type\": \"address\" }\n    ],\n    \"name\": \"_accountVotes\",\n    \"outputs\": [{ \"internalType\": \"uint8\", \"name\": \"votes\", \"type\": \"uint8\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"proposalId\", \"type\": \"uint256\" },\n      { \"internalType\": \"address\", \"name\": \"account\", \"type\": \"address\" },\n      { \"internalType\": \"uint8\", \"name\": \"support\", \"type\": \"uint8\" },\n      { \"internalType\": \"uint256\", \"name\": \"weight\", \"type\": \"uint256\" },\n      { \"internalType\": \"bytes\", \"name\": \"params\", \"type\": \"bytes\" }\n    ],\n    \"name\": \"_countVote\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"proposalId\", \"type\": \"uint256\" },\n      { \"internalType\": \"bytes\", \"name\": \"proposalData\", \"type\": \"bytes\" }\n    ],\n    \"name\": \"_formatExecuteParams\",\n    \"outputs\": [\n      { \"internalType\": \"address[]\", \"name\": \"targets\", \"type\": \"address[]\" },\n      { \"internalType\": \"uint256[]\", \"name\": \"values\", \"type\": \"uint256[]\" },\n      { \"internalType\": \"bytes[]\", \"name\": \"calldatas\", \"type\": \"bytes[]\" }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"proposalId\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"_proposals\",\n    \"outputs\": [\n      { \"internalType\": \"address\", \"name\": \"governor\", \"type\": \"address\" },\n      {\n        \"components\": [\n          { \"internalType\": \"uint128\", \"name\": \"forVotes\", \"type\": \"uint128\" },\n          {\n            \"internalType\": \"uint128\",\n            \"name\": \"abstainVotes\",\n            \"type\": \"uint128\"\n          }\n        ],\n        \"internalType\": \"struct ProposalVotes\",\n        \"name\": \"votes\",\n        \"type\": \"tuple\"\n      },\n      {\n        \"components\": [\n          { \"internalType\": \"uint8\", \"name\": \"maxApprovals\", \"type\": \"uint8\" },\n          { \"internalType\": \"uint8\", \"name\": \"criteria\", \"type\": \"uint8\" },\n          {\n            \"internalType\": \"address\",\n            \"name\": \"budgetToken\",\n            \"type\": \"address\"\n          },\n          {\n            \"internalType\": \"uint128\",\n            \"name\": \"criteriaValue\",\n            \"type\": \"uint128\"\n          },\n          {\n            \"internalType\": \"uint128\",\n            \"name\": \"budgetAmount\",\n            \"type\": \"uint128\"\n          }\n        ],\n        \"internalType\": \"struct ProposalSettings\",\n        \"name\": \"settings\",\n        \"type\": \"tuple\"\n      }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"proposalId\", \"type\": \"uint256\" },\n      { \"internalType\": \"uint256\", \"name\": \"quorum\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"_quorumReached\",\n    \"outputs\": [{ \"internalType\": \"bool\", \"name\": \"\", \"type\": \"bool\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"proposalId\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"_voteSucceeded\",\n    \"outputs\": [{ \"internalType\": \"bool\", \"name\": \"\", \"type\": \"bool\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"proposalId\", \"type\": \"uint256\" },\n      { \"internalType\": \"address\", \"name\": \"account\", \"type\": \"address\" }\n    ],\n    \"name\": \"hasVoted\",\n    \"outputs\": [{ \"internalType\": \"bool\", \"name\": \"\", \"type\": \"bool\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"proposalId\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"proposalVotes\",\n    \"outputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"forVotes\", \"type\": \"uint256\" },\n      { \"internalType\": \"uint256\", \"name\": \"abstainVotes\", \"type\": \"uint256\" },\n      {\n        \"internalType\": \"uint128[]\",\n        \"name\": \"optionVotes\",\n        \"type\": \"uint128[]\"\n      }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"proposalId\", \"type\": \"uint256\" },\n      { \"internalType\": \"bytes\", \"name\": \"proposalData\", \"type\": \"bytes\" }\n    ],\n    \"name\": \"propose\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"version\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"pure\",\n    \"type\": \"function\"\n  }\n]";
    ///The parsed JSON ABI of the contract.
    pub static OPTIMISMVOTEMODULE_54A8F_ABI: ::ethers::contract::Lazy<
        ::ethers::core::abi::Abi,
    > = ::ethers::contract::Lazy::new(|| {
        ::ethers::core::utils::__serde_json::from_str(__ABI)
            .expect("ABI is always valid")
    });
    pub struct optimismvotemodule_54a8f<M>(::ethers::contract::Contract<M>);
    impl<M> ::core::clone::Clone for optimismvotemodule_54a8f<M> {
        fn clone(&self) -> Self {
            Self(::core::clone::Clone::clone(&self.0))
        }
    }
    impl<M> ::core::ops::Deref for optimismvotemodule_54a8f<M> {
        type Target = ::ethers::contract::Contract<M>;
        fn deref(&self) -> &Self::Target {
            &self.0
        }
    }
    impl<M> ::core::ops::DerefMut for optimismvotemodule_54a8f<M> {
        fn deref_mut(&mut self) -> &mut Self::Target {
            &mut self.0
        }
    }
    impl<M> ::core::fmt::Debug for optimismvotemodule_54a8f<M> {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            f.debug_tuple(stringify!(optimismvotemodule_54a8f))
                .field(&self.address())
                .finish()
        }
    }
    impl<M: ::ethers::providers::Middleware> optimismvotemodule_54a8f<M> {
        /// Creates a new contract instance with the specified `ethers` client at
        /// `address`. The contract derefs to a `ethers::Contract` object.
        pub fn new<T: Into<::ethers::core::types::Address>>(
            address: T,
            client: ::std::sync::Arc<M>,
        ) -> Self {
            Self(
                ::ethers::contract::Contract::new(
                    address.into(),
                    OPTIMISMVOTEMODULE_54A8F_ABI.clone(),
                    client,
                ),
            )
        }
        ///Calls the contract's `COUNTING_MODE` (0xdd4e2ba5) function
        pub fn counting_mode(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::std::string::String> {
            self.0
                .method_hash([221, 78, 43, 165], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `PROPOSAL_DATA_ENCODING` (0x8fb11b85) function
        pub fn proposal_data_encoding(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::std::string::String> {
            self.0
                .method_hash([143, 177, 27, 133], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `VOTE_PARAMS_ENCODING` (0x7894d615) function
        pub fn vote_params_encoding(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::std::string::String> {
            self.0
                .method_hash([120, 148, 214, 21], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `_accountVotes` (0x1592f90c) function
        pub fn account_votes(
            &self,
            proposal_id: ::ethers::core::types::U256,
            account: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, u8> {
            self.0
                .method_hash([21, 146, 249, 12], (proposal_id, account))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `_countVote` (0x4f5cabac) function
        pub fn count_vote(
            &self,
            proposal_id: ::ethers::core::types::U256,
            account: ::ethers::core::types::Address,
            support: u8,
            weight: ::ethers::core::types::U256,
            params: ::ethers::core::types::Bytes,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash(
                    [79, 92, 171, 172],
                    (proposal_id, account, support, weight, params),
                )
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `_formatExecuteParams` (0x4e2b2bb3) function
        pub fn format_execute_params(
            &self,
            proposal_id: ::ethers::core::types::U256,
            proposal_data: ::ethers::core::types::Bytes,
        ) -> ::ethers::contract::builders::ContractCall<
            M,
            (
                ::std::vec::Vec<::ethers::core::types::Address>,
                ::std::vec::Vec<::ethers::core::types::U256>,
                ::std::vec::Vec<::ethers::core::types::Bytes>,
            ),
        > {
            self.0
                .method_hash([78, 43, 43, 179], (proposal_id, proposal_data))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `_proposals` (0x0a494840) function
        pub fn proposals(
            &self,
            proposal_id: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<
            M,
            (::ethers::core::types::Address, ProposalVotes, ProposalSettings),
        > {
            self.0
                .method_hash([10, 73, 72, 64], proposal_id)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `_quorumReached` (0xeb413f5f) function
        pub fn quorum_reached(
            &self,
            proposal_id: ::ethers::core::types::U256,
            quorum: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([235, 65, 63, 95], (proposal_id, quorum))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `_voteSucceeded` (0xa54bd3eb) function
        pub fn vote_succeeded(
            &self,
            proposal_id: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([165, 75, 211, 235], proposal_id)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `hasVoted` (0x43859632) function
        pub fn has_voted(
            &self,
            proposal_id: ::ethers::core::types::U256,
            account: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([67, 133, 150, 50], (proposal_id, account))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `proposalVotes` (0x544ffc9c) function
        pub fn proposal_votes(
            &self,
            proposal_id: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<
            M,
            (
                ::ethers::core::types::U256,
                ::ethers::core::types::U256,
                ::std::vec::Vec<u128>,
            ),
        > {
            self.0
                .method_hash([84, 79, 252, 156], proposal_id)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `propose` (0x5f90ebaf) function
        pub fn propose(
            &self,
            proposal_id: ::ethers::core::types::U256,
            proposal_data: ::ethers::core::types::Bytes,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([95, 144, 235, 175], (proposal_id, proposal_data))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `version` (0x54fd4d50) function
        pub fn version(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([84, 253, 77, 80], ())
                .expect("method not found (this should never happen)")
        }
    }
    impl<M: ::ethers::providers::Middleware> From<::ethers::contract::Contract<M>>
    for optimismvotemodule_54a8f<M> {
        fn from(contract: ::ethers::contract::Contract<M>) -> Self {
            Self::new(contract.address(), contract.client())
        }
    }
    ///Custom Error type `ExistingProposal` with signature `ExistingProposal()` and selector `0x5ee68952`
    #[derive(
        Clone,
        ::ethers::contract::EthError,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash
    )]
    #[etherror(name = "ExistingProposal", abi = "ExistingProposal()")]
    pub struct ExistingProposal;
    ///Custom Error type `InvalidParams` with signature `InvalidParams()` and selector `0xa86b6512`
    #[derive(
        Clone,
        ::ethers::contract::EthError,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash
    )]
    #[etherror(name = "InvalidParams", abi = "InvalidParams()")]
    pub struct InvalidParams;
    ///Custom Error type `InvalidVoteType` with signature `InvalidVoteType()` and selector `0x8eed55d1`
    #[derive(
        Clone,
        ::ethers::contract::EthError,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash
    )]
    #[etherror(name = "InvalidVoteType", abi = "InvalidVoteType()")]
    pub struct InvalidVoteType;
    ///Custom Error type `MaxApprovalsExceeded` with signature `MaxApprovalsExceeded()` and selector `0xcbc55b24`
    #[derive(
        Clone,
        ::ethers::contract::EthError,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash
    )]
    #[etherror(name = "MaxApprovalsExceeded", abi = "MaxApprovalsExceeded()")]
    pub struct MaxApprovalsExceeded;
    ///Custom Error type `MaxChoicesExceeded` with signature `MaxChoicesExceeded()` and selector `0xc78cfefd`
    #[derive(
        Clone,
        ::ethers::contract::EthError,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash
    )]
    #[etherror(name = "MaxChoicesExceeded", abi = "MaxChoicesExceeded()")]
    pub struct MaxChoicesExceeded;
    ///Custom Error type `NotGovernor` with signature `NotGovernor()` and selector `0xee3675d4`
    #[derive(
        Clone,
        ::ethers::contract::EthError,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash
    )]
    #[etherror(name = "NotGovernor", abi = "NotGovernor()")]
    pub struct NotGovernor;
    ///Custom Error type `OptionsNotStrictlyAscending` with signature `OptionsNotStrictlyAscending()` and selector `0x57ef068d`
    #[derive(
        Clone,
        ::ethers::contract::EthError,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash
    )]
    #[etherror(
        name = "OptionsNotStrictlyAscending",
        abi = "OptionsNotStrictlyAscending()"
    )]
    pub struct OptionsNotStrictlyAscending;
    ///Custom Error type `VoteAlreadyCast` with signature `VoteAlreadyCast()` and selector `0xb3808bab`
    #[derive(
        Clone,
        ::ethers::contract::EthError,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash
    )]
    #[etherror(name = "VoteAlreadyCast", abi = "VoteAlreadyCast()")]
    pub struct VoteAlreadyCast;
    ///Container type for all of the contract's custom errors
    #[derive(Clone, ::ethers::contract::EthAbiType, Debug, PartialEq, Eq, Hash)]
    pub enum optimismvotemodule_54a8fErrors {
        ExistingProposal(ExistingProposal),
        InvalidParams(InvalidParams),
        InvalidVoteType(InvalidVoteType),
        MaxApprovalsExceeded(MaxApprovalsExceeded),
        MaxChoicesExceeded(MaxChoicesExceeded),
        NotGovernor(NotGovernor),
        OptionsNotStrictlyAscending(OptionsNotStrictlyAscending),
        VoteAlreadyCast(VoteAlreadyCast),
        /// The standard solidity revert string, with selector
        /// Error(string) -- 0x08c379a0
        RevertString(::std::string::String),
    }
    impl ::ethers::core::abi::AbiDecode for optimismvotemodule_54a8fErrors {
        fn decode(
            data: impl AsRef<[u8]>,
        ) -> ::core::result::Result<Self, ::ethers::core::abi::AbiError> {
            let data = data.as_ref();
            if let Ok(decoded)
                = <::std::string::String as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::RevertString(decoded));
            }
            if let Ok(decoded)
                = <ExistingProposal as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::ExistingProposal(decoded));
            }
            if let Ok(decoded)
                = <InvalidParams as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::InvalidParams(decoded));
            }
            if let Ok(decoded)
                = <InvalidVoteType as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::InvalidVoteType(decoded));
            }
            if let Ok(decoded)
                = <MaxApprovalsExceeded as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::MaxApprovalsExceeded(decoded));
            }
            if let Ok(decoded)
                = <MaxChoicesExceeded as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::MaxChoicesExceeded(decoded));
            }
            if let Ok(decoded)
                = <NotGovernor as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::NotGovernor(decoded));
            }
            if let Ok(decoded)
                = <OptionsNotStrictlyAscending as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::OptionsNotStrictlyAscending(decoded));
            }
            if let Ok(decoded)
                = <VoteAlreadyCast as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::VoteAlreadyCast(decoded));
            }
            Err(::ethers::core::abi::Error::InvalidData.into())
        }
    }
    impl ::ethers::core::abi::AbiEncode for optimismvotemodule_54a8fErrors {
        fn encode(self) -> ::std::vec::Vec<u8> {
            match self {
                Self::ExistingProposal(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::InvalidParams(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::InvalidVoteType(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::MaxApprovalsExceeded(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::MaxChoicesExceeded(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::NotGovernor(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::OptionsNotStrictlyAscending(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::VoteAlreadyCast(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::RevertString(s) => ::ethers::core::abi::AbiEncode::encode(s),
            }
        }
    }
    impl ::ethers::contract::ContractRevert for optimismvotemodule_54a8fErrors {
        fn valid_selector(selector: [u8; 4]) -> bool {
            match selector {
                [0x08, 0xc3, 0x79, 0xa0] => true,
                _ if selector
                    == <ExistingProposal as ::ethers::contract::EthError>::selector() => {
                    true
                }
                _ if selector
                    == <InvalidParams as ::ethers::contract::EthError>::selector() => {
                    true
                }
                _ if selector
                    == <InvalidVoteType as ::ethers::contract::EthError>::selector() => {
                    true
                }
                _ if selector
                    == <MaxApprovalsExceeded as ::ethers::contract::EthError>::selector() => {
                    true
                }
                _ if selector
                    == <MaxChoicesExceeded as ::ethers::contract::EthError>::selector() => {
                    true
                }
                _ if selector
                    == <NotGovernor as ::ethers::contract::EthError>::selector() => true,
                _ if selector
                    == <OptionsNotStrictlyAscending as ::ethers::contract::EthError>::selector() => {
                    true
                }
                _ if selector
                    == <VoteAlreadyCast as ::ethers::contract::EthError>::selector() => {
                    true
                }
                _ => false,
            }
        }
    }
    impl ::core::fmt::Display for optimismvotemodule_54a8fErrors {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            match self {
                Self::ExistingProposal(element) => ::core::fmt::Display::fmt(element, f),
                Self::InvalidParams(element) => ::core::fmt::Display::fmt(element, f),
                Self::InvalidVoteType(element) => ::core::fmt::Display::fmt(element, f),
                Self::MaxApprovalsExceeded(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::MaxChoicesExceeded(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::NotGovernor(element) => ::core::fmt::Display::fmt(element, f),
                Self::OptionsNotStrictlyAscending(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::VoteAlreadyCast(element) => ::core::fmt::Display::fmt(element, f),
                Self::RevertString(s) => ::core::fmt::Display::fmt(s, f),
            }
        }
    }
    impl ::core::convert::From<::std::string::String>
    for optimismvotemodule_54a8fErrors {
        fn from(value: String) -> Self {
            Self::RevertString(value)
        }
    }
    impl ::core::convert::From<ExistingProposal> for optimismvotemodule_54a8fErrors {
        fn from(value: ExistingProposal) -> Self {
            Self::ExistingProposal(value)
        }
    }
    impl ::core::convert::From<InvalidParams> for optimismvotemodule_54a8fErrors {
        fn from(value: InvalidParams) -> Self {
            Self::InvalidParams(value)
        }
    }
    impl ::core::convert::From<InvalidVoteType> for optimismvotemodule_54a8fErrors {
        fn from(value: InvalidVoteType) -> Self {
            Self::InvalidVoteType(value)
        }
    }
    impl ::core::convert::From<MaxApprovalsExceeded> for optimismvotemodule_54a8fErrors {
        fn from(value: MaxApprovalsExceeded) -> Self {
            Self::MaxApprovalsExceeded(value)
        }
    }
    impl ::core::convert::From<MaxChoicesExceeded> for optimismvotemodule_54a8fErrors {
        fn from(value: MaxChoicesExceeded) -> Self {
            Self::MaxChoicesExceeded(value)
        }
    }
    impl ::core::convert::From<NotGovernor> for optimismvotemodule_54a8fErrors {
        fn from(value: NotGovernor) -> Self {
            Self::NotGovernor(value)
        }
    }
    impl ::core::convert::From<OptionsNotStrictlyAscending>
    for optimismvotemodule_54a8fErrors {
        fn from(value: OptionsNotStrictlyAscending) -> Self {
            Self::OptionsNotStrictlyAscending(value)
        }
    }
    impl ::core::convert::From<VoteAlreadyCast> for optimismvotemodule_54a8fErrors {
        fn from(value: VoteAlreadyCast) -> Self {
            Self::VoteAlreadyCast(value)
        }
    }
    ///Container type for all input parameters for the `COUNTING_MODE` function with signature `COUNTING_MODE()` and selector `0xdd4e2ba5`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash
    )]
    #[ethcall(name = "COUNTING_MODE", abi = "COUNTING_MODE()")]
    pub struct CountingModeCall;
    ///Container type for all input parameters for the `PROPOSAL_DATA_ENCODING` function with signature `PROPOSAL_DATA_ENCODING()` and selector `0x8fb11b85`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash
    )]
    #[ethcall(name = "PROPOSAL_DATA_ENCODING", abi = "PROPOSAL_DATA_ENCODING()")]
    pub struct ProposalDataEncodingCall;
    ///Container type for all input parameters for the `VOTE_PARAMS_ENCODING` function with signature `VOTE_PARAMS_ENCODING()` and selector `0x7894d615`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash
    )]
    #[ethcall(name = "VOTE_PARAMS_ENCODING", abi = "VOTE_PARAMS_ENCODING()")]
    pub struct VoteParamsEncodingCall;
    ///Container type for all input parameters for the `_accountVotes` function with signature `_accountVotes(uint256,address)` and selector `0x1592f90c`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash
    )]
    #[ethcall(name = "_accountVotes", abi = "_accountVotes(uint256,address)")]
    pub struct AccountVotesCall {
        pub proposal_id: ::ethers::core::types::U256,
        pub account: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `_countVote` function with signature `_countVote(uint256,address,uint8,uint256,bytes)` and selector `0x4f5cabac`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash
    )]
    #[ethcall(
        name = "_countVote",
        abi = "_countVote(uint256,address,uint8,uint256,bytes)"
    )]
    pub struct CountVoteCall {
        pub proposal_id: ::ethers::core::types::U256,
        pub account: ::ethers::core::types::Address,
        pub support: u8,
        pub weight: ::ethers::core::types::U256,
        pub params: ::ethers::core::types::Bytes,
    }
    ///Container type for all input parameters for the `_formatExecuteParams` function with signature `_formatExecuteParams(uint256,bytes)` and selector `0x4e2b2bb3`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash
    )]
    #[ethcall(
        name = "_formatExecuteParams",
        abi = "_formatExecuteParams(uint256,bytes)"
    )]
    pub struct FormatExecuteParamsCall {
        pub proposal_id: ::ethers::core::types::U256,
        pub proposal_data: ::ethers::core::types::Bytes,
    }
    ///Container type for all input parameters for the `_proposals` function with signature `_proposals(uint256)` and selector `0x0a494840`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash
    )]
    #[ethcall(name = "_proposals", abi = "_proposals(uint256)")]
    pub struct ProposalsCall {
        pub proposal_id: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `_quorumReached` function with signature `_quorumReached(uint256,uint256)` and selector `0xeb413f5f`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash
    )]
    #[ethcall(name = "_quorumReached", abi = "_quorumReached(uint256,uint256)")]
    pub struct QuorumReachedCall {
        pub proposal_id: ::ethers::core::types::U256,
        pub quorum: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `_voteSucceeded` function with signature `_voteSucceeded(uint256)` and selector `0xa54bd3eb`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash
    )]
    #[ethcall(name = "_voteSucceeded", abi = "_voteSucceeded(uint256)")]
    pub struct VoteSucceededCall {
        pub proposal_id: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `hasVoted` function with signature `hasVoted(uint256,address)` and selector `0x43859632`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash
    )]
    #[ethcall(name = "hasVoted", abi = "hasVoted(uint256,address)")]
    pub struct HasVotedCall {
        pub proposal_id: ::ethers::core::types::U256,
        pub account: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `proposalVotes` function with signature `proposalVotes(uint256)` and selector `0x544ffc9c`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash
    )]
    #[ethcall(name = "proposalVotes", abi = "proposalVotes(uint256)")]
    pub struct ProposalVotesCall {
        pub proposal_id: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `propose` function with signature `propose(uint256,bytes)` and selector `0x5f90ebaf`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash
    )]
    #[ethcall(name = "propose", abi = "propose(uint256,bytes)")]
    pub struct ProposeCall {
        pub proposal_id: ::ethers::core::types::U256,
        pub proposal_data: ::ethers::core::types::Bytes,
    }
    ///Container type for all input parameters for the `version` function with signature `version()` and selector `0x54fd4d50`
    #[derive(
        Clone,
        ::ethers::contract::EthCall,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash
    )]
    #[ethcall(name = "version", abi = "version()")]
    pub struct VersionCall;
    ///Container type for all of the contract's call
    #[derive(Clone, ::ethers::contract::EthAbiType, Debug, PartialEq, Eq, Hash)]
    pub enum optimismvotemodule_54a8fCalls {
        CountingMode(CountingModeCall),
        ProposalDataEncoding(ProposalDataEncodingCall),
        VoteParamsEncoding(VoteParamsEncodingCall),
        AccountVotes(AccountVotesCall),
        CountVote(CountVoteCall),
        FormatExecuteParams(FormatExecuteParamsCall),
        Proposals(ProposalsCall),
        QuorumReached(QuorumReachedCall),
        VoteSucceeded(VoteSucceededCall),
        HasVoted(HasVotedCall),
        ProposalVotes(ProposalVotesCall),
        Propose(ProposeCall),
        Version(VersionCall),
    }
    impl ::ethers::core::abi::AbiDecode for optimismvotemodule_54a8fCalls {
        fn decode(
            data: impl AsRef<[u8]>,
        ) -> ::core::result::Result<Self, ::ethers::core::abi::AbiError> {
            let data = data.as_ref();
            if let Ok(decoded)
                = <CountingModeCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::CountingMode(decoded));
            }
            if let Ok(decoded)
                = <ProposalDataEncodingCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::ProposalDataEncoding(decoded));
            }
            if let Ok(decoded)
                = <VoteParamsEncodingCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::VoteParamsEncoding(decoded));
            }
            if let Ok(decoded)
                = <AccountVotesCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::AccountVotes(decoded));
            }
            if let Ok(decoded)
                = <CountVoteCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::CountVote(decoded));
            }
            if let Ok(decoded)
                = <FormatExecuteParamsCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::FormatExecuteParams(decoded));
            }
            if let Ok(decoded)
                = <ProposalsCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Proposals(decoded));
            }
            if let Ok(decoded)
                = <QuorumReachedCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::QuorumReached(decoded));
            }
            if let Ok(decoded)
                = <VoteSucceededCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::VoteSucceeded(decoded));
            }
            if let Ok(decoded)
                = <HasVotedCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::HasVoted(decoded));
            }
            if let Ok(decoded)
                = <ProposalVotesCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::ProposalVotes(decoded));
            }
            if let Ok(decoded)
                = <ProposeCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Propose(decoded));
            }
            if let Ok(decoded)
                = <VersionCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Version(decoded));
            }
            Err(::ethers::core::abi::Error::InvalidData.into())
        }
    }
    impl ::ethers::core::abi::AbiEncode for optimismvotemodule_54a8fCalls {
        fn encode(self) -> Vec<u8> {
            match self {
                Self::CountingMode(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::ProposalDataEncoding(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::VoteParamsEncoding(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::AccountVotes(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::CountVote(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::FormatExecuteParams(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::Proposals(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::QuorumReached(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::VoteSucceeded(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::HasVoted(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::ProposalVotes(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::Propose(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::Version(element) => ::ethers::core::abi::AbiEncode::encode(element),
            }
        }
    }
    impl ::core::fmt::Display for optimismvotemodule_54a8fCalls {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            match self {
                Self::CountingMode(element) => ::core::fmt::Display::fmt(element, f),
                Self::ProposalDataEncoding(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::VoteParamsEncoding(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::AccountVotes(element) => ::core::fmt::Display::fmt(element, f),
                Self::CountVote(element) => ::core::fmt::Display::fmt(element, f),
                Self::FormatExecuteParams(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::Proposals(element) => ::core::fmt::Display::fmt(element, f),
                Self::QuorumReached(element) => ::core::fmt::Display::fmt(element, f),
                Self::VoteSucceeded(element) => ::core::fmt::Display::fmt(element, f),
                Self::HasVoted(element) => ::core::fmt::Display::fmt(element, f),
                Self::ProposalVotes(element) => ::core::fmt::Display::fmt(element, f),
                Self::Propose(element) => ::core::fmt::Display::fmt(element, f),
                Self::Version(element) => ::core::fmt::Display::fmt(element, f),
            }
        }
    }
    impl ::core::convert::From<CountingModeCall> for optimismvotemodule_54a8fCalls {
        fn from(value: CountingModeCall) -> Self {
            Self::CountingMode(value)
        }
    }
    impl ::core::convert::From<ProposalDataEncodingCall>
    for optimismvotemodule_54a8fCalls {
        fn from(value: ProposalDataEncodingCall) -> Self {
            Self::ProposalDataEncoding(value)
        }
    }
    impl ::core::convert::From<VoteParamsEncodingCall>
    for optimismvotemodule_54a8fCalls {
        fn from(value: VoteParamsEncodingCall) -> Self {
            Self::VoteParamsEncoding(value)
        }
    }
    impl ::core::convert::From<AccountVotesCall> for optimismvotemodule_54a8fCalls {
        fn from(value: AccountVotesCall) -> Self {
            Self::AccountVotes(value)
        }
    }
    impl ::core::convert::From<CountVoteCall> for optimismvotemodule_54a8fCalls {
        fn from(value: CountVoteCall) -> Self {
            Self::CountVote(value)
        }
    }
    impl ::core::convert::From<FormatExecuteParamsCall>
    for optimismvotemodule_54a8fCalls {
        fn from(value: FormatExecuteParamsCall) -> Self {
            Self::FormatExecuteParams(value)
        }
    }
    impl ::core::convert::From<ProposalsCall> for optimismvotemodule_54a8fCalls {
        fn from(value: ProposalsCall) -> Self {
            Self::Proposals(value)
        }
    }
    impl ::core::convert::From<QuorumReachedCall> for optimismvotemodule_54a8fCalls {
        fn from(value: QuorumReachedCall) -> Self {
            Self::QuorumReached(value)
        }
    }
    impl ::core::convert::From<VoteSucceededCall> for optimismvotemodule_54a8fCalls {
        fn from(value: VoteSucceededCall) -> Self {
            Self::VoteSucceeded(value)
        }
    }
    impl ::core::convert::From<HasVotedCall> for optimismvotemodule_54a8fCalls {
        fn from(value: HasVotedCall) -> Self {
            Self::HasVoted(value)
        }
    }
    impl ::core::convert::From<ProposalVotesCall> for optimismvotemodule_54a8fCalls {
        fn from(value: ProposalVotesCall) -> Self {
            Self::ProposalVotes(value)
        }
    }
    impl ::core::convert::From<ProposeCall> for optimismvotemodule_54a8fCalls {
        fn from(value: ProposeCall) -> Self {
            Self::Propose(value)
        }
    }
    impl ::core::convert::From<VersionCall> for optimismvotemodule_54a8fCalls {
        fn from(value: VersionCall) -> Self {
            Self::Version(value)
        }
    }
    ///Container type for all return fields from the `COUNTING_MODE` function with signature `COUNTING_MODE()` and selector `0xdd4e2ba5`
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
    pub struct CountingModeReturn(pub ::std::string::String);
    ///Container type for all return fields from the `PROPOSAL_DATA_ENCODING` function with signature `PROPOSAL_DATA_ENCODING()` and selector `0x8fb11b85`
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
    pub struct ProposalDataEncodingReturn(pub ::std::string::String);
    ///Container type for all return fields from the `VOTE_PARAMS_ENCODING` function with signature `VOTE_PARAMS_ENCODING()` and selector `0x7894d615`
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
    pub struct VoteParamsEncodingReturn(pub ::std::string::String);
    ///Container type for all return fields from the `_accountVotes` function with signature `_accountVotes(uint256,address)` and selector `0x1592f90c`
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
    pub struct AccountVotesReturn {
        pub votes: u8,
    }
    ///Container type for all return fields from the `_formatExecuteParams` function with signature `_formatExecuteParams(uint256,bytes)` and selector `0x4e2b2bb3`
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
    pub struct FormatExecuteParamsReturn {
        pub targets: ::std::vec::Vec<::ethers::core::types::Address>,
        pub values: ::std::vec::Vec<::ethers::core::types::U256>,
        pub calldatas: ::std::vec::Vec<::ethers::core::types::Bytes>,
    }
    ///Container type for all return fields from the `_proposals` function with signature `_proposals(uint256)` and selector `0x0a494840`
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
    pub struct ProposalsReturn {
        pub governor: ::ethers::core::types::Address,
        pub votes: ProposalVotes,
        pub settings: ProposalSettings,
    }
    ///Container type for all return fields from the `_quorumReached` function with signature `_quorumReached(uint256,uint256)` and selector `0xeb413f5f`
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
    pub struct QuorumReachedReturn(pub bool);
    ///Container type for all return fields from the `_voteSucceeded` function with signature `_voteSucceeded(uint256)` and selector `0xa54bd3eb`
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
    pub struct VoteSucceededReturn(pub bool);
    ///Container type for all return fields from the `hasVoted` function with signature `hasVoted(uint256,address)` and selector `0x43859632`
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
    pub struct HasVotedReturn(pub bool);
    ///Container type for all return fields from the `proposalVotes` function with signature `proposalVotes(uint256)` and selector `0x544ffc9c`
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
    pub struct ProposalVotesReturn {
        pub for_votes: ::ethers::core::types::U256,
        pub abstain_votes: ::ethers::core::types::U256,
        pub option_votes: ::std::vec::Vec<u128>,
    }
    ///Container type for all return fields from the `version` function with signature `version()` and selector `0x54fd4d50`
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
    pub struct VersionReturn(pub ::ethers::core::types::U256);
    ///`ProposalSettings(uint8,uint8,address,uint128,uint128)`
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
    pub struct ProposalSettings {
        pub max_approvals: u8,
        pub criteria: u8,
        pub budget_token: ::ethers::core::types::Address,
        pub criteria_value: u128,
        pub budget_amount: u128,
    }
    ///`ProposalVotes(uint128,uint128)`
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
    pub struct ProposalVotes {
        pub for_votes: u128,
        pub abstain_votes: u128,
    }
}
