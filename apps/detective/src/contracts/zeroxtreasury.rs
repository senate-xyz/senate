pub use zeroxtreasury::*;
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
pub mod zeroxtreasury {
    #[rustfmt::skip]
    const __ABI: &str = "[\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"contract IStaking\",\n        \"name\": \"stakingProxy_\",\n        \"type\": \"address\"\n      },\n      {\n        \"components\": [\n          {\n            \"internalType\": \"uint256\",\n            \"name\": \"votingPeriod\",\n            \"type\": \"uint256\"\n          },\n          {\n            \"internalType\": \"uint256\",\n            \"name\": \"proposalThreshold\",\n            \"type\": \"uint256\"\n          },\n          {\n            \"internalType\": \"uint256\",\n            \"name\": \"quorumThreshold\",\n            \"type\": \"uint256\"\n          },\n          {\n            \"internalType\": \"bytes32\",\n            \"name\": \"defaultPoolId\",\n            \"type\": \"bytes32\"\n          }\n        ],\n        \"internalType\": \"struct IZrxTreasury.TreasuryParameters\",\n        \"name\": \"params\",\n        \"type\": \"tuple\"\n      }\n    ],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"constructor\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"address\",\n        \"name\": \"proposer\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"bytes32[]\",\n        \"name\": \"operatedPoolIds\",\n        \"type\": \"bytes32[]\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"proposalId\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"components\": [\n          { \"internalType\": \"address\", \"name\": \"target\", \"type\": \"address\" },\n          { \"internalType\": \"bytes\", \"name\": \"data\", \"type\": \"bytes\" },\n          { \"internalType\": \"uint256\", \"name\": \"value\", \"type\": \"uint256\" }\n        ],\n        \"indexed\": false,\n        \"internalType\": \"struct IZrxTreasury.ProposedAction[]\",\n        \"name\": \"actions\",\n        \"type\": \"tuple[]\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"executionEpoch\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"string\",\n        \"name\": \"description\",\n        \"type\": \"string\"\n      }\n    ],\n    \"name\": \"ProposalCreated\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"proposalId\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"ProposalExecuted\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"address\",\n        \"name\": \"voter\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"bytes32[]\",\n        \"name\": \"operatedPoolIds\",\n        \"type\": \"bytes32[]\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"proposalId\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"bool\",\n        \"name\": \"support\",\n        \"type\": \"bool\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"votingPower\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"VoteCast\",\n    \"type\": \"event\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"proposalId\", \"type\": \"uint256\" },\n      { \"internalType\": \"bool\", \"name\": \"support\", \"type\": \"bool\" },\n      {\n        \"internalType\": \"bytes32[]\",\n        \"name\": \"operatedPoolIds\",\n        \"type\": \"bytes32[]\"\n      }\n    ],\n    \"name\": \"castVote\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"defaultPoolId\",\n    \"outputs\": [{ \"internalType\": \"bytes32\", \"name\": \"\", \"type\": \"bytes32\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"defaultPoolOperator\",\n    \"outputs\": [\n      {\n        \"internalType\": \"contract DefaultPoolOperator\",\n        \"name\": \"\",\n        \"type\": \"address\"\n      }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"proposalId\", \"type\": \"uint256\" },\n      {\n        \"components\": [\n          { \"internalType\": \"address\", \"name\": \"target\", \"type\": \"address\" },\n          { \"internalType\": \"bytes\", \"name\": \"data\", \"type\": \"bytes\" },\n          { \"internalType\": \"uint256\", \"name\": \"value\", \"type\": \"uint256\" }\n        ],\n        \"internalType\": \"struct IZrxTreasury.ProposedAction[]\",\n        \"name\": \"actions\",\n        \"type\": \"tuple[]\"\n      }\n    ],\n    \"name\": \"execute\",\n    \"outputs\": [],\n    \"stateMutability\": \"payable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"address\", \"name\": \"account\", \"type\": \"address\" },\n      {\n        \"internalType\": \"bytes32[]\",\n        \"name\": \"operatedPoolIds\",\n        \"type\": \"bytes32[]\"\n      }\n    ],\n    \"name\": \"getVotingPower\",\n    \"outputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"votingPower\", \"type\": \"uint256\" }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" },\n      { \"internalType\": \"address\", \"name\": \"\", \"type\": \"address\" }\n    ],\n    \"name\": \"hasVoted\",\n    \"outputs\": [{ \"internalType\": \"bool\", \"name\": \"\", \"type\": \"bool\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"proposalCount\",\n    \"outputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"count\", \"type\": \"uint256\" }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"proposalThreshold\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"name\": \"proposals\",\n    \"outputs\": [\n      { \"internalType\": \"bytes32\", \"name\": \"actionsHash\", \"type\": \"bytes32\" },\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"executionEpoch\",\n        \"type\": \"uint256\"\n      },\n      { \"internalType\": \"uint256\", \"name\": \"voteEpoch\", \"type\": \"uint256\" },\n      { \"internalType\": \"uint256\", \"name\": \"votesFor\", \"type\": \"uint256\" },\n      { \"internalType\": \"uint256\", \"name\": \"votesAgainst\", \"type\": \"uint256\" },\n      { \"internalType\": \"bool\", \"name\": \"executed\", \"type\": \"bool\" }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"components\": [\n          { \"internalType\": \"address\", \"name\": \"target\", \"type\": \"address\" },\n          { \"internalType\": \"bytes\", \"name\": \"data\", \"type\": \"bytes\" },\n          { \"internalType\": \"uint256\", \"name\": \"value\", \"type\": \"uint256\" }\n        ],\n        \"internalType\": \"struct IZrxTreasury.ProposedAction[]\",\n        \"name\": \"actions\",\n        \"type\": \"tuple[]\"\n      },\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"executionEpoch\",\n        \"type\": \"uint256\"\n      },\n      { \"internalType\": \"string\", \"name\": \"description\", \"type\": \"string\" },\n      {\n        \"internalType\": \"bytes32[]\",\n        \"name\": \"operatedPoolIds\",\n        \"type\": \"bytes32[]\"\n      }\n    ],\n    \"name\": \"propose\",\n    \"outputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"proposalId\", \"type\": \"uint256\" }\n    ],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"quorumThreshold\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"stakingProxy\",\n    \"outputs\": [\n      { \"internalType\": \"contract IStaking\", \"name\": \"\", \"type\": \"address\" }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"newProposalThreshold\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"newQuorumThreshold\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"updateThresholds\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"votingPeriod\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  { \"stateMutability\": \"payable\", \"type\": \"receive\" }\n]";
    ///The parsed JSON ABI of the contract.
    pub static ZEROXTREASURY_ABI: ::ethers::contract::Lazy<::ethers::core::abi::Abi> = ::ethers::contract::Lazy::new(||
    ::ethers::core::utils::__serde_json::from_str(__ABI).expect("ABI is always valid"));
    pub struct zeroxtreasury<M>(::ethers::contract::Contract<M>);
    impl<M> ::core::clone::Clone for zeroxtreasury<M> {
        fn clone(&self) -> Self {
            Self(::core::clone::Clone::clone(&self.0))
        }
    }
    impl<M> ::core::ops::Deref for zeroxtreasury<M> {
        type Target = ::ethers::contract::Contract<M>;
        fn deref(&self) -> &Self::Target {
            &self.0
        }
    }
    impl<M> ::core::ops::DerefMut for zeroxtreasury<M> {
        fn deref_mut(&mut self) -> &mut Self::Target {
            &mut self.0
        }
    }
    impl<M> ::core::fmt::Debug for zeroxtreasury<M> {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            f.debug_tuple(stringify!(zeroxtreasury)).field(&self.address()).finish()
        }
    }
    impl<M: ::ethers::providers::Middleware> zeroxtreasury<M> {
        /// Creates a new contract instance with the specified `ethers` client at
        /// `address`. The contract derefs to a `ethers::Contract` object.
        pub fn new<T: Into<::ethers::core::types::Address>>(
            address: T,
            client: ::std::sync::Arc<M>,
        ) -> Self {
            Self(
                ::ethers::contract::Contract::new(
                    address.into(),
                    ZEROXTREASURY_ABI.clone(),
                    client,
                ),
            )
        }
        ///Calls the contract's `castVote` (0xdfe1e6b2) function
        pub fn cast_vote(
            &self,
            proposal_id: ::ethers::core::types::U256,
            support: bool,
            operated_pool_ids: ::std::vec::Vec<[u8; 32]>,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash(
                    [223, 225, 230, 178],
                    (proposal_id, support, operated_pool_ids),
                )
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `defaultPoolId` (0xa0edbcbb) function
        pub fn default_pool_id(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, [u8; 32]> {
            self.0
                .method_hash([160, 237, 188, 187], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `defaultPoolOperator` (0x9de38af2) function
        pub fn default_pool_operator(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<
            M,
            ::ethers::core::types::Address,
        > {
            self.0
                .method_hash([157, 227, 138, 242], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `execute` (0x662bede3) function
        pub fn execute(
            &self,
            proposal_id: ::ethers::core::types::U256,
            actions: ::std::vec::Vec<ProposedAction>,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([102, 43, 237, 227], (proposal_id, actions))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getVotingPower` (0x7c29cb1a) function
        pub fn get_voting_power(
            &self,
            account: ::ethers::core::types::Address,
            operated_pool_ids: ::std::vec::Vec<[u8; 32]>,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([124, 41, 203, 26], (account, operated_pool_ids))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `hasVoted` (0x43859632) function
        pub fn has_voted(
            &self,
            p0: ::ethers::core::types::U256,
            p1: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([67, 133, 150, 50], (p0, p1))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `proposalCount` (0xda35c664) function
        pub fn proposal_count(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([218, 53, 198, 100], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `proposalThreshold` (0xb58131b0) function
        pub fn proposal_threshold(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([181, 129, 49, 176], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `proposals` (0x013cf08b) function
        pub fn proposals(
            &self,
            p0: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<
            M,
            (
                [u8; 32],
                ::ethers::core::types::U256,
                ::ethers::core::types::U256,
                ::ethers::core::types::U256,
                ::ethers::core::types::U256,
                bool,
            ),
        > {
            self.0
                .method_hash([1, 60, 240, 139], p0)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `propose` (0xd73ceb3a) function
        pub fn propose(
            &self,
            actions: ::std::vec::Vec<ProposedAction>,
            execution_epoch: ::ethers::core::types::U256,
            description: ::std::string::String,
            operated_pool_ids: ::std::vec::Vec<[u8; 32]>,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash(
                    [215, 60, 235, 58],
                    (actions, execution_epoch, description, operated_pool_ids),
                )
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `quorumThreshold` (0x7b7a91dd) function
        pub fn quorum_threshold(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([123, 122, 145, 221], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `stakingProxy` (0x22f80d11) function
        pub fn staking_proxy(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<
            M,
            ::ethers::core::types::Address,
        > {
            self.0
                .method_hash([34, 248, 13, 17], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `updateThresholds` (0xc14b8e9c) function
        pub fn update_thresholds(
            &self,
            new_proposal_threshold: ::ethers::core::types::U256,
            new_quorum_threshold: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash(
                    [193, 75, 142, 156],
                    (new_proposal_threshold, new_quorum_threshold),
                )
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `votingPeriod` (0x02a251a3) function
        pub fn voting_period(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([2, 162, 81, 163], ())
                .expect("method not found (this should never happen)")
        }
        ///Gets the contract's `ProposalCreated` event
        pub fn proposal_created_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            ProposalCreatedFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `ProposalExecuted` event
        pub fn proposal_executed_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            ProposalExecutedFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `VoteCast` event
        pub fn vote_cast_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            VoteCastFilter,
        > {
            self.0.event()
        }
        /// Returns an `Event` builder for all the events of this contract.
        pub fn events(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            zeroxtreasuryEvents,
        > {
            self.0.event_with_filter(::core::default::Default::default())
        }
    }
    impl<M: ::ethers::providers::Middleware> From<::ethers::contract::Contract<M>>
    for zeroxtreasury<M> {
        fn from(contract: ::ethers::contract::Contract<M>) -> Self {
            Self::new(contract.address(), contract.client())
        }
    }
    #[derive(
        Clone,
        ::ethers::contract::EthEvent,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash
    )]
    #[ethevent(
        name = "ProposalCreated",
        abi = "ProposalCreated(address,bytes32[],uint256,(address,bytes,uint256)[],uint256,string)"
    )]
    pub struct ProposalCreatedFilter {
        pub proposer: ::ethers::core::types::Address,
        pub operated_pool_ids: ::std::vec::Vec<[u8; 32]>,
        pub proposal_id: ::ethers::core::types::U256,
        pub actions: ::std::vec::Vec<ProposedAction>,
        pub execution_epoch: ::ethers::core::types::U256,
        pub description: ::std::string::String,
    }
    #[derive(
        Clone,
        ::ethers::contract::EthEvent,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash
    )]
    #[ethevent(name = "ProposalExecuted", abi = "ProposalExecuted(uint256)")]
    pub struct ProposalExecutedFilter {
        pub proposal_id: ::ethers::core::types::U256,
    }
    #[derive(
        Clone,
        ::ethers::contract::EthEvent,
        ::ethers::contract::EthDisplay,
        Default,
        Debug,
        PartialEq,
        Eq,
        Hash
    )]
    #[ethevent(
        name = "VoteCast",
        abi = "VoteCast(address,bytes32[],uint256,bool,uint256)"
    )]
    pub struct VoteCastFilter {
        pub voter: ::ethers::core::types::Address,
        pub operated_pool_ids: ::std::vec::Vec<[u8; 32]>,
        pub proposal_id: ::ethers::core::types::U256,
        pub support: bool,
        pub voting_power: ::ethers::core::types::U256,
    }
    ///Container type for all of the contract's events
    #[derive(Clone, ::ethers::contract::EthAbiType, Debug, PartialEq, Eq, Hash)]
    pub enum zeroxtreasuryEvents {
        ProposalCreatedFilter(ProposalCreatedFilter),
        ProposalExecutedFilter(ProposalExecutedFilter),
        VoteCastFilter(VoteCastFilter),
    }
    impl ::ethers::contract::EthLogDecode for zeroxtreasuryEvents {
        fn decode_log(
            log: &::ethers::core::abi::RawLog,
        ) -> ::core::result::Result<Self, ::ethers::core::abi::Error> {
            if let Ok(decoded) = ProposalCreatedFilter::decode_log(log) {
                return Ok(zeroxtreasuryEvents::ProposalCreatedFilter(decoded));
            }
            if let Ok(decoded) = ProposalExecutedFilter::decode_log(log) {
                return Ok(zeroxtreasuryEvents::ProposalExecutedFilter(decoded));
            }
            if let Ok(decoded) = VoteCastFilter::decode_log(log) {
                return Ok(zeroxtreasuryEvents::VoteCastFilter(decoded));
            }
            Err(::ethers::core::abi::Error::InvalidData)
        }
    }
    impl ::core::fmt::Display for zeroxtreasuryEvents {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            match self {
                Self::ProposalCreatedFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::ProposalExecutedFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::VoteCastFilter(element) => ::core::fmt::Display::fmt(element, f),
            }
        }
    }
    impl ::core::convert::From<ProposalCreatedFilter> for zeroxtreasuryEvents {
        fn from(value: ProposalCreatedFilter) -> Self {
            Self::ProposalCreatedFilter(value)
        }
    }
    impl ::core::convert::From<ProposalExecutedFilter> for zeroxtreasuryEvents {
        fn from(value: ProposalExecutedFilter) -> Self {
            Self::ProposalExecutedFilter(value)
        }
    }
    impl ::core::convert::From<VoteCastFilter> for zeroxtreasuryEvents {
        fn from(value: VoteCastFilter) -> Self {
            Self::VoteCastFilter(value)
        }
    }
    ///Container type for all input parameters for the `castVote` function with signature `castVote(uint256,bool,bytes32[])` and selector `0xdfe1e6b2`
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
    #[ethcall(name = "castVote", abi = "castVote(uint256,bool,bytes32[])")]
    pub struct CastVoteCall {
        pub proposal_id: ::ethers::core::types::U256,
        pub support: bool,
        pub operated_pool_ids: ::std::vec::Vec<[u8; 32]>,
    }
    ///Container type for all input parameters for the `defaultPoolId` function with signature `defaultPoolId()` and selector `0xa0edbcbb`
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
    #[ethcall(name = "defaultPoolId", abi = "defaultPoolId()")]
    pub struct DefaultPoolIdCall;
    ///Container type for all input parameters for the `defaultPoolOperator` function with signature `defaultPoolOperator()` and selector `0x9de38af2`
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
    #[ethcall(name = "defaultPoolOperator", abi = "defaultPoolOperator()")]
    pub struct DefaultPoolOperatorCall;
    ///Container type for all input parameters for the `execute` function with signature `execute(uint256,(address,bytes,uint256)[])` and selector `0x662bede3`
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
    #[ethcall(name = "execute", abi = "execute(uint256,(address,bytes,uint256)[])")]
    pub struct ExecuteCall {
        pub proposal_id: ::ethers::core::types::U256,
        pub actions: ::std::vec::Vec<ProposedAction>,
    }
    ///Container type for all input parameters for the `getVotingPower` function with signature `getVotingPower(address,bytes32[])` and selector `0x7c29cb1a`
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
    #[ethcall(name = "getVotingPower", abi = "getVotingPower(address,bytes32[])")]
    pub struct GetVotingPowerCall {
        pub account: ::ethers::core::types::Address,
        pub operated_pool_ids: ::std::vec::Vec<[u8; 32]>,
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
    pub struct HasVotedCall(
        pub ::ethers::core::types::U256,
        pub ::ethers::core::types::Address,
    );
    ///Container type for all input parameters for the `proposalCount` function with signature `proposalCount()` and selector `0xda35c664`
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
    #[ethcall(name = "proposalCount", abi = "proposalCount()")]
    pub struct ProposalCountCall;
    ///Container type for all input parameters for the `proposalThreshold` function with signature `proposalThreshold()` and selector `0xb58131b0`
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
    #[ethcall(name = "proposalThreshold", abi = "proposalThreshold()")]
    pub struct ProposalThresholdCall;
    ///Container type for all input parameters for the `proposals` function with signature `proposals(uint256)` and selector `0x013cf08b`
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
    #[ethcall(name = "proposals", abi = "proposals(uint256)")]
    pub struct ProposalsCall(pub ::ethers::core::types::U256);
    ///Container type for all input parameters for the `propose` function with signature `propose((address,bytes,uint256)[],uint256,string,bytes32[])` and selector `0xd73ceb3a`
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
        name = "propose",
        abi = "propose((address,bytes,uint256)[],uint256,string,bytes32[])"
    )]
    pub struct ProposeCall {
        pub actions: ::std::vec::Vec<ProposedAction>,
        pub execution_epoch: ::ethers::core::types::U256,
        pub description: ::std::string::String,
        pub operated_pool_ids: ::std::vec::Vec<[u8; 32]>,
    }
    ///Container type for all input parameters for the `quorumThreshold` function with signature `quorumThreshold()` and selector `0x7b7a91dd`
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
    #[ethcall(name = "quorumThreshold", abi = "quorumThreshold()")]
    pub struct QuorumThresholdCall;
    ///Container type for all input parameters for the `stakingProxy` function with signature `stakingProxy()` and selector `0x22f80d11`
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
    #[ethcall(name = "stakingProxy", abi = "stakingProxy()")]
    pub struct StakingProxyCall;
    ///Container type for all input parameters for the `updateThresholds` function with signature `updateThresholds(uint256,uint256)` and selector `0xc14b8e9c`
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
    #[ethcall(name = "updateThresholds", abi = "updateThresholds(uint256,uint256)")]
    pub struct UpdateThresholdsCall {
        pub new_proposal_threshold: ::ethers::core::types::U256,
        pub new_quorum_threshold: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `votingPeriod` function with signature `votingPeriod()` and selector `0x02a251a3`
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
    #[ethcall(name = "votingPeriod", abi = "votingPeriod()")]
    pub struct VotingPeriodCall;
    ///Container type for all of the contract's call
    #[derive(Clone, ::ethers::contract::EthAbiType, Debug, PartialEq, Eq, Hash)]
    pub enum zeroxtreasuryCalls {
        CastVote(CastVoteCall),
        DefaultPoolId(DefaultPoolIdCall),
        DefaultPoolOperator(DefaultPoolOperatorCall),
        Execute(ExecuteCall),
        GetVotingPower(GetVotingPowerCall),
        HasVoted(HasVotedCall),
        ProposalCount(ProposalCountCall),
        ProposalThreshold(ProposalThresholdCall),
        Proposals(ProposalsCall),
        Propose(ProposeCall),
        QuorumThreshold(QuorumThresholdCall),
        StakingProxy(StakingProxyCall),
        UpdateThresholds(UpdateThresholdsCall),
        VotingPeriod(VotingPeriodCall),
    }
    impl ::ethers::core::abi::AbiDecode for zeroxtreasuryCalls {
        fn decode(
            data: impl AsRef<[u8]>,
        ) -> ::core::result::Result<Self, ::ethers::core::abi::AbiError> {
            let data = data.as_ref();
            if let Ok(decoded) = <CastVoteCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::CastVote(decoded));
            }
            if let Ok(decoded) = <DefaultPoolIdCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::DefaultPoolId(decoded));
            }
            if let Ok(decoded) = <DefaultPoolOperatorCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::DefaultPoolOperator(decoded));
            }
            if let Ok(decoded) = <ExecuteCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::Execute(decoded));
            }
            if let Ok(decoded) = <GetVotingPowerCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::GetVotingPower(decoded));
            }
            if let Ok(decoded) = <HasVotedCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::HasVoted(decoded));
            }
            if let Ok(decoded) = <ProposalCountCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::ProposalCount(decoded));
            }
            if let Ok(decoded) = <ProposalThresholdCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::ProposalThreshold(decoded));
            }
            if let Ok(decoded) = <ProposalsCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::Proposals(decoded));
            }
            if let Ok(decoded) = <ProposeCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::Propose(decoded));
            }
            if let Ok(decoded) = <QuorumThresholdCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::QuorumThreshold(decoded));
            }
            if let Ok(decoded) = <StakingProxyCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::StakingProxy(decoded));
            }
            if let Ok(decoded) = <UpdateThresholdsCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::UpdateThresholds(decoded));
            }
            if let Ok(decoded) = <VotingPeriodCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::VotingPeriod(decoded));
            }
            Err(::ethers::core::abi::Error::InvalidData.into())
        }
    }
    impl ::ethers::core::abi::AbiEncode for zeroxtreasuryCalls {
        fn encode(self) -> Vec<u8> {
            match self {
                Self::CastVote(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::DefaultPoolId(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::DefaultPoolOperator(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::Execute(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::GetVotingPower(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::HasVoted(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::ProposalCount(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::ProposalThreshold(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::Proposals(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::Propose(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::QuorumThreshold(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::StakingProxy(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::UpdateThresholds(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::VotingPeriod(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
            }
        }
    }
    impl ::core::fmt::Display for zeroxtreasuryCalls {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            match self {
                Self::CastVote(element) => ::core::fmt::Display::fmt(element, f),
                Self::DefaultPoolId(element) => ::core::fmt::Display::fmt(element, f),
                Self::DefaultPoolOperator(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::Execute(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetVotingPower(element) => ::core::fmt::Display::fmt(element, f),
                Self::HasVoted(element) => ::core::fmt::Display::fmt(element, f),
                Self::ProposalCount(element) => ::core::fmt::Display::fmt(element, f),
                Self::ProposalThreshold(element) => ::core::fmt::Display::fmt(element, f),
                Self::Proposals(element) => ::core::fmt::Display::fmt(element, f),
                Self::Propose(element) => ::core::fmt::Display::fmt(element, f),
                Self::QuorumThreshold(element) => ::core::fmt::Display::fmt(element, f),
                Self::StakingProxy(element) => ::core::fmt::Display::fmt(element, f),
                Self::UpdateThresholds(element) => ::core::fmt::Display::fmt(element, f),
                Self::VotingPeriod(element) => ::core::fmt::Display::fmt(element, f),
            }
        }
    }
    impl ::core::convert::From<CastVoteCall> for zeroxtreasuryCalls {
        fn from(value: CastVoteCall) -> Self {
            Self::CastVote(value)
        }
    }
    impl ::core::convert::From<DefaultPoolIdCall> for zeroxtreasuryCalls {
        fn from(value: DefaultPoolIdCall) -> Self {
            Self::DefaultPoolId(value)
        }
    }
    impl ::core::convert::From<DefaultPoolOperatorCall> for zeroxtreasuryCalls {
        fn from(value: DefaultPoolOperatorCall) -> Self {
            Self::DefaultPoolOperator(value)
        }
    }
    impl ::core::convert::From<ExecuteCall> for zeroxtreasuryCalls {
        fn from(value: ExecuteCall) -> Self {
            Self::Execute(value)
        }
    }
    impl ::core::convert::From<GetVotingPowerCall> for zeroxtreasuryCalls {
        fn from(value: GetVotingPowerCall) -> Self {
            Self::GetVotingPower(value)
        }
    }
    impl ::core::convert::From<HasVotedCall> for zeroxtreasuryCalls {
        fn from(value: HasVotedCall) -> Self {
            Self::HasVoted(value)
        }
    }
    impl ::core::convert::From<ProposalCountCall> for zeroxtreasuryCalls {
        fn from(value: ProposalCountCall) -> Self {
            Self::ProposalCount(value)
        }
    }
    impl ::core::convert::From<ProposalThresholdCall> for zeroxtreasuryCalls {
        fn from(value: ProposalThresholdCall) -> Self {
            Self::ProposalThreshold(value)
        }
    }
    impl ::core::convert::From<ProposalsCall> for zeroxtreasuryCalls {
        fn from(value: ProposalsCall) -> Self {
            Self::Proposals(value)
        }
    }
    impl ::core::convert::From<ProposeCall> for zeroxtreasuryCalls {
        fn from(value: ProposeCall) -> Self {
            Self::Propose(value)
        }
    }
    impl ::core::convert::From<QuorumThresholdCall> for zeroxtreasuryCalls {
        fn from(value: QuorumThresholdCall) -> Self {
            Self::QuorumThreshold(value)
        }
    }
    impl ::core::convert::From<StakingProxyCall> for zeroxtreasuryCalls {
        fn from(value: StakingProxyCall) -> Self {
            Self::StakingProxy(value)
        }
    }
    impl ::core::convert::From<UpdateThresholdsCall> for zeroxtreasuryCalls {
        fn from(value: UpdateThresholdsCall) -> Self {
            Self::UpdateThresholds(value)
        }
    }
    impl ::core::convert::From<VotingPeriodCall> for zeroxtreasuryCalls {
        fn from(value: VotingPeriodCall) -> Self {
            Self::VotingPeriod(value)
        }
    }
    ///Container type for all return fields from the `defaultPoolId` function with signature `defaultPoolId()` and selector `0xa0edbcbb`
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
    pub struct DefaultPoolIdReturn(pub [u8; 32]);
    ///Container type for all return fields from the `defaultPoolOperator` function with signature `defaultPoolOperator()` and selector `0x9de38af2`
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
    pub struct DefaultPoolOperatorReturn(pub ::ethers::core::types::Address);
    ///Container type for all return fields from the `getVotingPower` function with signature `getVotingPower(address,bytes32[])` and selector `0x7c29cb1a`
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
    pub struct GetVotingPowerReturn {
        pub voting_power: ::ethers::core::types::U256,
    }
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
    ///Container type for all return fields from the `proposalCount` function with signature `proposalCount()` and selector `0xda35c664`
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
    pub struct ProposalCountReturn {
        pub count: ::ethers::core::types::U256,
    }
    ///Container type for all return fields from the `proposalThreshold` function with signature `proposalThreshold()` and selector `0xb58131b0`
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
    pub struct ProposalThresholdReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `proposals` function with signature `proposals(uint256)` and selector `0x013cf08b`
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
        pub actions_hash: [u8; 32],
        pub execution_epoch: ::ethers::core::types::U256,
        pub vote_epoch: ::ethers::core::types::U256,
        pub votes_for: ::ethers::core::types::U256,
        pub votes_against: ::ethers::core::types::U256,
        pub executed: bool,
    }
    ///Container type for all return fields from the `propose` function with signature `propose((address,bytes,uint256)[],uint256,string,bytes32[])` and selector `0xd73ceb3a`
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
    pub struct ProposeReturn {
        pub proposal_id: ::ethers::core::types::U256,
    }
    ///Container type for all return fields from the `quorumThreshold` function with signature `quorumThreshold()` and selector `0x7b7a91dd`
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
    pub struct QuorumThresholdReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `stakingProxy` function with signature `stakingProxy()` and selector `0x22f80d11`
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
    pub struct StakingProxyReturn(pub ::ethers::core::types::Address);
    ///Container type for all return fields from the `votingPeriod` function with signature `votingPeriod()` and selector `0x02a251a3`
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
    pub struct VotingPeriodReturn(pub ::ethers::core::types::U256);
    ///`ProposedAction(address,bytes,uint256)`
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
    pub struct ProposedAction {
        pub target: ::ethers::core::types::Address,
        pub data: ::ethers::core::types::Bytes,
        pub value: ::ethers::core::types::U256,
    }
}
