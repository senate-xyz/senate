pub use makerpollvotearbitrum::*;
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
pub mod makerpollvotearbitrum {
    #[rustfmt::skip]
    const __ABI: &str = "[\n  { \"inputs\": [], \"stateMutability\": \"nonpayable\", \"type\": \"constructor\" },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"creator\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"blockCreated\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"uint256\",\n        \"name\": \"pollId\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"startDate\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"endDate\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"string\",\n        \"name\": \"multiHash\",\n        \"type\": \"string\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"string\",\n        \"name\": \"url\",\n        \"type\": \"string\"\n      }\n    ],\n    \"name\": \"PollCreated\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"creator\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"blockWithdrawn\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"pollId\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"PollWithdrawn\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"voter\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"uint256\",\n        \"name\": \"pollId\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"uint256\",\n        \"name\": \"optionId\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"Voted\",\n    \"type\": \"event\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"DOMAIN_SEPARATOR\",\n    \"outputs\": [{ \"internalType\": \"bytes32\", \"name\": \"\", \"type\": \"bytes32\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"VOTE_TYPEHASH\",\n    \"outputs\": [{ \"internalType\": \"bytes32\", \"name\": \"\", \"type\": \"bytes32\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"chainId\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"startDate\", \"type\": \"uint256\" },\n      { \"internalType\": \"uint256\", \"name\": \"endDate\", \"type\": \"uint256\" },\n      { \"internalType\": \"string\", \"name\": \"multiHash\", \"type\": \"string\" },\n      { \"internalType\": \"string\", \"name\": \"url\", \"type\": \"string\" }\n    ],\n    \"name\": \"createPoll\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"name\",\n    \"outputs\": [{ \"internalType\": \"string\", \"name\": \"\", \"type\": \"string\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [{ \"internalType\": \"address\", \"name\": \"\", \"type\": \"address\" }],\n    \"name\": \"nonces\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"npoll\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"version\",\n    \"outputs\": [{ \"internalType\": \"string\", \"name\": \"\", \"type\": \"string\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"address\", \"name\": \"voter\", \"type\": \"address\" },\n      { \"internalType\": \"uint256\", \"name\": \"nonce\", \"type\": \"uint256\" },\n      { \"internalType\": \"uint256\", \"name\": \"expiry\", \"type\": \"uint256\" },\n      { \"internalType\": \"uint256[]\", \"name\": \"pollIds\", \"type\": \"uint256[]\" },\n      { \"internalType\": \"uint256[]\", \"name\": \"optionIds\", \"type\": \"uint256[]\" },\n      { \"internalType\": \"uint8\", \"name\": \"v\", \"type\": \"uint8\" },\n      { \"internalType\": \"bytes32\", \"name\": \"r\", \"type\": \"bytes32\" },\n      { \"internalType\": \"bytes32\", \"name\": \"s\", \"type\": \"bytes32\" }\n    ],\n    \"name\": \"vote\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256[]\", \"name\": \"pollIds\", \"type\": \"uint256[]\" },\n      { \"internalType\": \"uint256[]\", \"name\": \"optionIds\", \"type\": \"uint256[]\" }\n    ],\n    \"name\": \"vote\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"pollId\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"withdrawPoll\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  }\n]\n";
    ///The parsed JSON ABI of the contract.
    pub static MAKERPOLLVOTEARBITRUM_ABI: ::ethers::contract::Lazy<
        ::ethers::core::abi::Abi,
    > = ::ethers::contract::Lazy::new(|| {
        ::ethers::core::utils::__serde_json::from_str(__ABI)
            .expect("ABI is always valid")
    });
    pub struct makerpollvotearbitrum<M>(::ethers::contract::Contract<M>);
    impl<M> ::core::clone::Clone for makerpollvotearbitrum<M> {
        fn clone(&self) -> Self {
            Self(::core::clone::Clone::clone(&self.0))
        }
    }
    impl<M> ::core::ops::Deref for makerpollvotearbitrum<M> {
        type Target = ::ethers::contract::Contract<M>;
        fn deref(&self) -> &Self::Target {
            &self.0
        }
    }
    impl<M> ::core::ops::DerefMut for makerpollvotearbitrum<M> {
        fn deref_mut(&mut self) -> &mut Self::Target {
            &mut self.0
        }
    }
    impl<M> ::core::fmt::Debug for makerpollvotearbitrum<M> {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            f.debug_tuple(stringify!(makerpollvotearbitrum))
                .field(&self.address())
                .finish()
        }
    }
    impl<M: ::ethers::providers::Middleware> makerpollvotearbitrum<M> {
        /// Creates a new contract instance with the specified `ethers` client at
        /// `address`. The contract derefs to a `ethers::Contract` object.
        pub fn new<T: Into<::ethers::core::types::Address>>(
            address: T,
            client: ::std::sync::Arc<M>,
        ) -> Self {
            Self(
                ::ethers::contract::Contract::new(
                    address.into(),
                    MAKERPOLLVOTEARBITRUM_ABI.clone(),
                    client,
                ),
            )
        }
        ///Calls the contract's `DOMAIN_SEPARATOR` (0x3644e515) function
        pub fn domain_separator(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, [u8; 32]> {
            self.0
                .method_hash([54, 68, 229, 21], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `VOTE_TYPEHASH` (0x86522973) function
        pub fn vote_typehash(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, [u8; 32]> {
            self.0
                .method_hash([134, 82, 41, 115], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `chainId` (0x9a8a0592) function
        pub fn chain_id(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([154, 138, 5, 146], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `createPoll` (0xd54a8176) function
        pub fn create_poll(
            &self,
            start_date: ::ethers::core::types::U256,
            end_date: ::ethers::core::types::U256,
            multi_hash: ::std::string::String,
            url: ::std::string::String,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash(
                    [213, 74, 129, 118],
                    (start_date, end_date, multi_hash, url),
                )
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `name` (0x06fdde03) function
        pub fn name(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::std::string::String> {
            self.0
                .method_hash([6, 253, 222, 3], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `nonces` (0x7ecebe00) function
        pub fn nonces(
            &self,
            p0: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([126, 206, 190, 0], p0)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `npoll` (0xd35f19d7) function
        pub fn npoll(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([211, 95, 25, 215], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `version` (0x54fd4d50) function
        pub fn version(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::std::string::String> {
            self.0
                .method_hash([84, 253, 77, 80], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `vote` (0x571da1d2) function
        pub fn vote_with_voter_and_nonce(
            &self,
            voter: ::ethers::core::types::Address,
            nonce: ::ethers::core::types::U256,
            expiry: ::ethers::core::types::U256,
            poll_ids: ::std::vec::Vec<::ethers::core::types::U256>,
            option_ids: ::std::vec::Vec<::ethers::core::types::U256>,
            v: u8,
            r: [u8; 32],
            s: [u8; 32],
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash(
                    [87, 29, 161, 210],
                    (voter, nonce, expiry, poll_ids, option_ids, v, r, s),
                )
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `vote` (0x8733ece7) function
        pub fn vote(
            &self,
            poll_ids: ::std::vec::Vec<::ethers::core::types::U256>,
            option_ids: ::std::vec::Vec<::ethers::core::types::U256>,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([135, 51, 236, 231], (poll_ids, option_ids))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `withdrawPoll` (0x603af06f) function
        pub fn withdraw_poll(
            &self,
            poll_id: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([96, 58, 240, 111], poll_id)
                .expect("method not found (this should never happen)")
        }
        ///Gets the contract's `PollCreated` event
        pub fn poll_created_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            PollCreatedFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `PollWithdrawn` event
        pub fn poll_withdrawn_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            PollWithdrawnFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `Voted` event
        pub fn voted_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, VotedFilter> {
            self.0.event()
        }
        /// Returns an `Event` builder for all the events of this contract.
        pub fn events(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            makerpollvotearbitrumEvents,
        > {
            self.0.event_with_filter(::core::default::Default::default())
        }
    }
    impl<M: ::ethers::providers::Middleware> From<::ethers::contract::Contract<M>>
    for makerpollvotearbitrum<M> {
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
        name = "PollCreated",
        abi = "PollCreated(address,uint256,uint256,uint256,uint256,string,string)"
    )]
    pub struct PollCreatedFilter {
        #[ethevent(indexed)]
        pub creator: ::ethers::core::types::Address,
        pub block_created: ::ethers::core::types::U256,
        #[ethevent(indexed)]
        pub poll_id: ::ethers::core::types::U256,
        pub start_date: ::ethers::core::types::U256,
        pub end_date: ::ethers::core::types::U256,
        pub multi_hash: ::std::string::String,
        pub url: ::std::string::String,
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
    #[ethevent(name = "PollWithdrawn", abi = "PollWithdrawn(address,uint256,uint256)")]
    pub struct PollWithdrawnFilter {
        #[ethevent(indexed)]
        pub creator: ::ethers::core::types::Address,
        pub block_withdrawn: ::ethers::core::types::U256,
        pub poll_id: ::ethers::core::types::U256,
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
    #[ethevent(name = "Voted", abi = "Voted(address,uint256,uint256)")]
    pub struct VotedFilter {
        #[ethevent(indexed)]
        pub voter: ::ethers::core::types::Address,
        #[ethevent(indexed)]
        pub poll_id: ::ethers::core::types::U256,
        #[ethevent(indexed)]
        pub option_id: ::ethers::core::types::U256,
    }
    ///Container type for all of the contract's events
    #[derive(Clone, ::ethers::contract::EthAbiType, Debug, PartialEq, Eq, Hash)]
    pub enum makerpollvotearbitrumEvents {
        PollCreatedFilter(PollCreatedFilter),
        PollWithdrawnFilter(PollWithdrawnFilter),
        VotedFilter(VotedFilter),
    }
    impl ::ethers::contract::EthLogDecode for makerpollvotearbitrumEvents {
        fn decode_log(
            log: &::ethers::core::abi::RawLog,
        ) -> ::core::result::Result<Self, ::ethers::core::abi::Error> {
            if let Ok(decoded) = PollCreatedFilter::decode_log(log) {
                return Ok(makerpollvotearbitrumEvents::PollCreatedFilter(decoded));
            }
            if let Ok(decoded) = PollWithdrawnFilter::decode_log(log) {
                return Ok(makerpollvotearbitrumEvents::PollWithdrawnFilter(decoded));
            }
            if let Ok(decoded) = VotedFilter::decode_log(log) {
                return Ok(makerpollvotearbitrumEvents::VotedFilter(decoded));
            }
            Err(::ethers::core::abi::Error::InvalidData)
        }
    }
    impl ::core::fmt::Display for makerpollvotearbitrumEvents {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            match self {
                Self::PollCreatedFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::PollWithdrawnFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::VotedFilter(element) => ::core::fmt::Display::fmt(element, f),
            }
        }
    }
    impl ::core::convert::From<PollCreatedFilter> for makerpollvotearbitrumEvents {
        fn from(value: PollCreatedFilter) -> Self {
            Self::PollCreatedFilter(value)
        }
    }
    impl ::core::convert::From<PollWithdrawnFilter> for makerpollvotearbitrumEvents {
        fn from(value: PollWithdrawnFilter) -> Self {
            Self::PollWithdrawnFilter(value)
        }
    }
    impl ::core::convert::From<VotedFilter> for makerpollvotearbitrumEvents {
        fn from(value: VotedFilter) -> Self {
            Self::VotedFilter(value)
        }
    }
    ///Container type for all input parameters for the `DOMAIN_SEPARATOR` function with signature `DOMAIN_SEPARATOR()` and selector `0x3644e515`
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
    #[ethcall(name = "DOMAIN_SEPARATOR", abi = "DOMAIN_SEPARATOR()")]
    pub struct DomainSeparatorCall;
    ///Container type for all input parameters for the `VOTE_TYPEHASH` function with signature `VOTE_TYPEHASH()` and selector `0x86522973`
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
    #[ethcall(name = "VOTE_TYPEHASH", abi = "VOTE_TYPEHASH()")]
    pub struct VoteTypehashCall;
    ///Container type for all input parameters for the `chainId` function with signature `chainId()` and selector `0x9a8a0592`
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
    #[ethcall(name = "chainId", abi = "chainId()")]
    pub struct ChainIdCall;
    ///Container type for all input parameters for the `createPoll` function with signature `createPoll(uint256,uint256,string,string)` and selector `0xd54a8176`
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
    #[ethcall(name = "createPoll", abi = "createPoll(uint256,uint256,string,string)")]
    pub struct CreatePollCall {
        pub start_date: ::ethers::core::types::U256,
        pub end_date: ::ethers::core::types::U256,
        pub multi_hash: ::std::string::String,
        pub url: ::std::string::String,
    }
    ///Container type for all input parameters for the `name` function with signature `name()` and selector `0x06fdde03`
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
    #[ethcall(name = "name", abi = "name()")]
    pub struct NameCall;
    ///Container type for all input parameters for the `nonces` function with signature `nonces(address)` and selector `0x7ecebe00`
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
    #[ethcall(name = "nonces", abi = "nonces(address)")]
    pub struct NoncesCall(pub ::ethers::core::types::Address);
    ///Container type for all input parameters for the `npoll` function with signature `npoll()` and selector `0xd35f19d7`
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
    #[ethcall(name = "npoll", abi = "npoll()")]
    pub struct NpollCall;
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
    ///Container type for all input parameters for the `vote` function with signature `vote(address,uint256,uint256,uint256[],uint256[],uint8,bytes32,bytes32)` and selector `0x571da1d2`
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
        name = "vote",
        abi = "vote(address,uint256,uint256,uint256[],uint256[],uint8,bytes32,bytes32)"
    )]
    pub struct VoteWithVoterAndNonceCall {
        pub voter: ::ethers::core::types::Address,
        pub nonce: ::ethers::core::types::U256,
        pub expiry: ::ethers::core::types::U256,
        pub poll_ids: ::std::vec::Vec<::ethers::core::types::U256>,
        pub option_ids: ::std::vec::Vec<::ethers::core::types::U256>,
        pub v: u8,
        pub r: [u8; 32],
        pub s: [u8; 32],
    }
    ///Container type for all input parameters for the `vote` function with signature `vote(uint256[],uint256[])` and selector `0x8733ece7`
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
    #[ethcall(name = "vote", abi = "vote(uint256[],uint256[])")]
    pub struct VoteCall {
        pub poll_ids: ::std::vec::Vec<::ethers::core::types::U256>,
        pub option_ids: ::std::vec::Vec<::ethers::core::types::U256>,
    }
    ///Container type for all input parameters for the `withdrawPoll` function with signature `withdrawPoll(uint256)` and selector `0x603af06f`
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
    #[ethcall(name = "withdrawPoll", abi = "withdrawPoll(uint256)")]
    pub struct WithdrawPollCall {
        pub poll_id: ::ethers::core::types::U256,
    }
    ///Container type for all of the contract's call
    #[derive(Clone, ::ethers::contract::EthAbiType, Debug, PartialEq, Eq, Hash)]
    pub enum makerpollvotearbitrumCalls {
        DomainSeparator(DomainSeparatorCall),
        VoteTypehash(VoteTypehashCall),
        ChainId(ChainIdCall),
        CreatePoll(CreatePollCall),
        Name(NameCall),
        Nonces(NoncesCall),
        Npoll(NpollCall),
        Version(VersionCall),
        VoteWithVoterAndNonce(VoteWithVoterAndNonceCall),
        Vote(VoteCall),
        WithdrawPoll(WithdrawPollCall),
    }
    impl ::ethers::core::abi::AbiDecode for makerpollvotearbitrumCalls {
        fn decode(
            data: impl AsRef<[u8]>,
        ) -> ::core::result::Result<Self, ::ethers::core::abi::AbiError> {
            let data = data.as_ref();
            if let Ok(decoded)
                = <DomainSeparatorCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::DomainSeparator(decoded));
            }
            if let Ok(decoded)
                = <VoteTypehashCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::VoteTypehash(decoded));
            }
            if let Ok(decoded)
                = <ChainIdCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::ChainId(decoded));
            }
            if let Ok(decoded)
                = <CreatePollCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::CreatePoll(decoded));
            }
            if let Ok(decoded)
                = <NameCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Name(decoded));
            }
            if let Ok(decoded)
                = <NoncesCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Nonces(decoded));
            }
            if let Ok(decoded)
                = <NpollCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Npoll(decoded));
            }
            if let Ok(decoded)
                = <VersionCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Version(decoded));
            }
            if let Ok(decoded)
                = <VoteWithVoterAndNonceCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::VoteWithVoterAndNonce(decoded));
            }
            if let Ok(decoded)
                = <VoteCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Vote(decoded));
            }
            if let Ok(decoded)
                = <WithdrawPollCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::WithdrawPoll(decoded));
            }
            Err(::ethers::core::abi::Error::InvalidData.into())
        }
    }
    impl ::ethers::core::abi::AbiEncode for makerpollvotearbitrumCalls {
        fn encode(self) -> Vec<u8> {
            match self {
                Self::DomainSeparator(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::VoteTypehash(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::ChainId(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::CreatePoll(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::Name(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::Nonces(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::Npoll(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::Version(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::VoteWithVoterAndNonce(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::Vote(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::WithdrawPoll(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
            }
        }
    }
    impl ::core::fmt::Display for makerpollvotearbitrumCalls {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            match self {
                Self::DomainSeparator(element) => ::core::fmt::Display::fmt(element, f),
                Self::VoteTypehash(element) => ::core::fmt::Display::fmt(element, f),
                Self::ChainId(element) => ::core::fmt::Display::fmt(element, f),
                Self::CreatePoll(element) => ::core::fmt::Display::fmt(element, f),
                Self::Name(element) => ::core::fmt::Display::fmt(element, f),
                Self::Nonces(element) => ::core::fmt::Display::fmt(element, f),
                Self::Npoll(element) => ::core::fmt::Display::fmt(element, f),
                Self::Version(element) => ::core::fmt::Display::fmt(element, f),
                Self::VoteWithVoterAndNonce(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::Vote(element) => ::core::fmt::Display::fmt(element, f),
                Self::WithdrawPoll(element) => ::core::fmt::Display::fmt(element, f),
            }
        }
    }
    impl ::core::convert::From<DomainSeparatorCall> for makerpollvotearbitrumCalls {
        fn from(value: DomainSeparatorCall) -> Self {
            Self::DomainSeparator(value)
        }
    }
    impl ::core::convert::From<VoteTypehashCall> for makerpollvotearbitrumCalls {
        fn from(value: VoteTypehashCall) -> Self {
            Self::VoteTypehash(value)
        }
    }
    impl ::core::convert::From<ChainIdCall> for makerpollvotearbitrumCalls {
        fn from(value: ChainIdCall) -> Self {
            Self::ChainId(value)
        }
    }
    impl ::core::convert::From<CreatePollCall> for makerpollvotearbitrumCalls {
        fn from(value: CreatePollCall) -> Self {
            Self::CreatePoll(value)
        }
    }
    impl ::core::convert::From<NameCall> for makerpollvotearbitrumCalls {
        fn from(value: NameCall) -> Self {
            Self::Name(value)
        }
    }
    impl ::core::convert::From<NoncesCall> for makerpollvotearbitrumCalls {
        fn from(value: NoncesCall) -> Self {
            Self::Nonces(value)
        }
    }
    impl ::core::convert::From<NpollCall> for makerpollvotearbitrumCalls {
        fn from(value: NpollCall) -> Self {
            Self::Npoll(value)
        }
    }
    impl ::core::convert::From<VersionCall> for makerpollvotearbitrumCalls {
        fn from(value: VersionCall) -> Self {
            Self::Version(value)
        }
    }
    impl ::core::convert::From<VoteWithVoterAndNonceCall>
    for makerpollvotearbitrumCalls {
        fn from(value: VoteWithVoterAndNonceCall) -> Self {
            Self::VoteWithVoterAndNonce(value)
        }
    }
    impl ::core::convert::From<VoteCall> for makerpollvotearbitrumCalls {
        fn from(value: VoteCall) -> Self {
            Self::Vote(value)
        }
    }
    impl ::core::convert::From<WithdrawPollCall> for makerpollvotearbitrumCalls {
        fn from(value: WithdrawPollCall) -> Self {
            Self::WithdrawPoll(value)
        }
    }
    ///Container type for all return fields from the `DOMAIN_SEPARATOR` function with signature `DOMAIN_SEPARATOR()` and selector `0x3644e515`
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
    pub struct DomainSeparatorReturn(pub [u8; 32]);
    ///Container type for all return fields from the `VOTE_TYPEHASH` function with signature `VOTE_TYPEHASH()` and selector `0x86522973`
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
    pub struct VoteTypehashReturn(pub [u8; 32]);
    ///Container type for all return fields from the `chainId` function with signature `chainId()` and selector `0x9a8a0592`
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
    pub struct ChainIdReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `name` function with signature `name()` and selector `0x06fdde03`
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
    pub struct NameReturn(pub ::std::string::String);
    ///Container type for all return fields from the `nonces` function with signature `nonces(address)` and selector `0x7ecebe00`
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
    pub struct NoncesReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `npoll` function with signature `npoll()` and selector `0xd35f19d7`
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
    pub struct NpollReturn(pub ::ethers::core::types::U256);
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
    pub struct VersionReturn(pub ::std::string::String);
}
