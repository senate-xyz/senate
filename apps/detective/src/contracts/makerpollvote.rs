pub use makerpollvote::*;
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
pub mod makerpollvote {
    #[rustfmt::skip]
    const __ABI: &str = "[\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"creator\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"blockCreated\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"uint256\",\n        \"name\": \"pollId\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"startDate\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"endDate\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"string\",\n        \"name\": \"multiHash\",\n        \"type\": \"string\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"string\",\n        \"name\": \"url\",\n        \"type\": \"string\"\n      }\n    ],\n    \"name\": \"PollCreated\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"creator\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"blockWithdrawn\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"pollId\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"PollWithdrawn\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"voter\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"uint256\",\n        \"name\": \"pollId\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"uint256\",\n        \"name\": \"optionId\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"Voted\",\n    \"type\": \"event\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"startDate\", \"type\": \"uint256\" },\n      { \"internalType\": \"uint256\", \"name\": \"endDate\", \"type\": \"uint256\" },\n      { \"internalType\": \"string\", \"name\": \"multiHash\", \"type\": \"string\" },\n      { \"internalType\": \"string\", \"name\": \"url\", \"type\": \"string\" }\n    ],\n    \"name\": \"createPoll\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"npoll\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256[]\", \"name\": \"pollIds\", \"type\": \"uint256[]\" },\n      { \"internalType\": \"uint256[]\", \"name\": \"optionIds\", \"type\": \"uint256[]\" }\n    ],\n    \"name\": \"vote\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"pollId\", \"type\": \"uint256\" },\n      { \"internalType\": \"uint256\", \"name\": \"optionId\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"vote\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"pollId\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"withdrawPoll\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256[]\", \"name\": \"pollIds\", \"type\": \"uint256[]\" }\n    ],\n    \"name\": \"withdrawPoll\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  }\n]";
    ///The parsed JSON ABI of the contract.
    pub static MAKERPOLLVOTE_ABI: ::ethers::contract::Lazy<::ethers::core::abi::Abi> =
        ::ethers::contract::Lazy::new(|| {
            ::ethers::core::utils::__serde_json::from_str(__ABI).expect("ABI is always valid")
        });
    pub struct makerpollvote<M>(::ethers::contract::Contract<M>);
    impl<M> ::core::clone::Clone for makerpollvote<M> {
        fn clone(&self) -> Self {
            Self(::core::clone::Clone::clone(&self.0))
        }
    }
    impl<M> ::core::ops::Deref for makerpollvote<M> {
        type Target = ::ethers::contract::Contract<M>;
        fn deref(&self) -> &Self::Target {
            &self.0
        }
    }
    impl<M> ::core::ops::DerefMut for makerpollvote<M> {
        fn deref_mut(&mut self) -> &mut Self::Target {
            &mut self.0
        }
    }
    impl<M> ::core::fmt::Debug for makerpollvote<M> {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            f.debug_tuple(stringify!(makerpollvote))
                .field(&self.address())
                .finish()
        }
    }
    impl<M: ::ethers::providers::Middleware> makerpollvote<M> {
        /// Creates a new contract instance with the specified `ethers` client at
        /// `address`. The contract derefs to a `ethers::Contract` object.
        pub fn new<T: Into<::ethers::core::types::Address>>(
            address: T,
            client: ::std::sync::Arc<M>,
        ) -> Self {
            Self(::ethers::contract::Contract::new(
                address.into(),
                MAKERPOLLVOTE_ABI.clone(),
                client,
            ))
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
                .method_hash([213, 74, 129, 118], (start_date, end_date, multi_hash, url))
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
        ///Calls the contract's `vote` (0xb384abef) function
        pub fn vote_with_poll_id_and_option_id(
            &self,
            poll_id: ::ethers::core::types::U256,
            option_id: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([179, 132, 171, 239], (poll_id, option_id))
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
        ///Calls the contract's `withdrawPoll` (0x8196b3f7) function
        pub fn withdraw_poll_with_poll_ids(
            &self,
            poll_ids: ::std::vec::Vec<::ethers::core::types::U256>,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([129, 150, 179, 247], poll_ids)
                .expect("method not found (this should never happen)")
        }
        ///Gets the contract's `PollCreated` event
        pub fn poll_created_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, PollCreatedFilter>
        {
            self.0.event()
        }
        ///Gets the contract's `PollWithdrawn` event
        pub fn poll_withdrawn_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, PollWithdrawnFilter>
        {
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
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, makerpollvoteEvents>
        {
            self.0
                .event_with_filter(::core::default::Default::default())
        }
    }
    impl<M: ::ethers::providers::Middleware> From<::ethers::contract::Contract<M>>
        for makerpollvote<M>
    {
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
        Hash,
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
        Hash,
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
        Hash,
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
    pub enum makerpollvoteEvents {
        PollCreatedFilter(PollCreatedFilter),
        PollWithdrawnFilter(PollWithdrawnFilter),
        VotedFilter(VotedFilter),
    }
    impl ::ethers::contract::EthLogDecode for makerpollvoteEvents {
        fn decode_log(
            log: &::ethers::core::abi::RawLog,
        ) -> ::core::result::Result<Self, ::ethers::core::abi::Error> {
            if let Ok(decoded) = PollCreatedFilter::decode_log(log) {
                return Ok(makerpollvoteEvents::PollCreatedFilter(decoded));
            }
            if let Ok(decoded) = PollWithdrawnFilter::decode_log(log) {
                return Ok(makerpollvoteEvents::PollWithdrawnFilter(decoded));
            }
            if let Ok(decoded) = VotedFilter::decode_log(log) {
                return Ok(makerpollvoteEvents::VotedFilter(decoded));
            }
            Err(::ethers::core::abi::Error::InvalidData)
        }
    }
    impl ::core::fmt::Display for makerpollvoteEvents {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            match self {
                Self::PollCreatedFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::PollWithdrawnFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::VotedFilter(element) => ::core::fmt::Display::fmt(element, f),
            }
        }
    }
    impl ::core::convert::From<PollCreatedFilter> for makerpollvoteEvents {
        fn from(value: PollCreatedFilter) -> Self {
            Self::PollCreatedFilter(value)
        }
    }
    impl ::core::convert::From<PollWithdrawnFilter> for makerpollvoteEvents {
        fn from(value: PollWithdrawnFilter) -> Self {
            Self::PollWithdrawnFilter(value)
        }
    }
    impl ::core::convert::From<VotedFilter> for makerpollvoteEvents {
        fn from(value: VotedFilter) -> Self {
            Self::VotedFilter(value)
        }
    }
    ///Container type for all input parameters for the `createPoll` function with signature `createPoll(uint256,uint256,string,string)` and selector `0xd54a8176`
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
    #[ethcall(name = "createPoll", abi = "createPoll(uint256,uint256,string,string)")]
    pub struct CreatePollCall {
        pub start_date: ::ethers::core::types::U256,
        pub end_date: ::ethers::core::types::U256,
        pub multi_hash: ::std::string::String,
        pub url: ::std::string::String,
    }
    ///Container type for all input parameters for the `npoll` function with signature `npoll()` and selector `0xd35f19d7`
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
    #[ethcall(name = "npoll", abi = "npoll()")]
    pub struct NpollCall;
    ///Container type for all input parameters for the `vote` function with signature `vote(uint256[],uint256[])` and selector `0x8733ece7`
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
    #[ethcall(name = "vote", abi = "vote(uint256[],uint256[])")]
    pub struct VoteCall {
        pub poll_ids: ::std::vec::Vec<::ethers::core::types::U256>,
        pub option_ids: ::std::vec::Vec<::ethers::core::types::U256>,
    }
    ///Container type for all input parameters for the `vote` function with signature `vote(uint256,uint256)` and selector `0xb384abef`
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
    #[ethcall(name = "vote", abi = "vote(uint256,uint256)")]
    pub struct VoteWithPollIdAndOptionIdCall {
        pub poll_id: ::ethers::core::types::U256,
        pub option_id: ::ethers::core::types::U256,
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
        Hash,
    )]
    #[ethcall(name = "withdrawPoll", abi = "withdrawPoll(uint256)")]
    pub struct WithdrawPollCall {
        pub poll_id: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `withdrawPoll` function with signature `withdrawPoll(uint256[])` and selector `0x8196b3f7`
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
    #[ethcall(name = "withdrawPoll", abi = "withdrawPoll(uint256[])")]
    pub struct WithdrawPollWithPollIdsCall {
        pub poll_ids: ::std::vec::Vec<::ethers::core::types::U256>,
    }
    ///Container type for all of the contract's call
    #[derive(Clone, ::ethers::contract::EthAbiType, Debug, PartialEq, Eq, Hash)]
    pub enum makerpollvoteCalls {
        CreatePoll(CreatePollCall),
        Npoll(NpollCall),
        Vote(VoteCall),
        VoteWithPollIdAndOptionId(VoteWithPollIdAndOptionIdCall),
        WithdrawPoll(WithdrawPollCall),
        WithdrawPollWithPollIds(WithdrawPollWithPollIdsCall),
    }
    impl ::ethers::core::abi::AbiDecode for makerpollvoteCalls {
        fn decode(
            data: impl AsRef<[u8]>,
        ) -> ::core::result::Result<Self, ::ethers::core::abi::AbiError> {
            let data = data.as_ref();
            if let Ok(decoded) = <CreatePollCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::CreatePoll(decoded));
            }
            if let Ok(decoded) = <NpollCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Npoll(decoded));
            }
            if let Ok(decoded) = <VoteCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Vote(decoded));
            }
            if let Ok(decoded) =
                <VoteWithPollIdAndOptionIdCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::VoteWithPollIdAndOptionId(decoded));
            }
            if let Ok(decoded) = <WithdrawPollCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::WithdrawPoll(decoded));
            }
            if let Ok(decoded) =
                <WithdrawPollWithPollIdsCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::WithdrawPollWithPollIds(decoded));
            }
            Err(::ethers::core::abi::Error::InvalidData.into())
        }
    }
    impl ::ethers::core::abi::AbiEncode for makerpollvoteCalls {
        fn encode(self) -> Vec<u8> {
            match self {
                Self::CreatePoll(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::Npoll(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::Vote(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::VoteWithPollIdAndOptionId(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::WithdrawPoll(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::WithdrawPollWithPollIds(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
            }
        }
    }
    impl ::core::fmt::Display for makerpollvoteCalls {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            match self {
                Self::CreatePoll(element) => ::core::fmt::Display::fmt(element, f),
                Self::Npoll(element) => ::core::fmt::Display::fmt(element, f),
                Self::Vote(element) => ::core::fmt::Display::fmt(element, f),
                Self::VoteWithPollIdAndOptionId(element) => ::core::fmt::Display::fmt(element, f),
                Self::WithdrawPoll(element) => ::core::fmt::Display::fmt(element, f),
                Self::WithdrawPollWithPollIds(element) => ::core::fmt::Display::fmt(element, f),
            }
        }
    }
    impl ::core::convert::From<CreatePollCall> for makerpollvoteCalls {
        fn from(value: CreatePollCall) -> Self {
            Self::CreatePoll(value)
        }
    }
    impl ::core::convert::From<NpollCall> for makerpollvoteCalls {
        fn from(value: NpollCall) -> Self {
            Self::Npoll(value)
        }
    }
    impl ::core::convert::From<VoteCall> for makerpollvoteCalls {
        fn from(value: VoteCall) -> Self {
            Self::Vote(value)
        }
    }
    impl ::core::convert::From<VoteWithPollIdAndOptionIdCall> for makerpollvoteCalls {
        fn from(value: VoteWithPollIdAndOptionIdCall) -> Self {
            Self::VoteWithPollIdAndOptionId(value)
        }
    }
    impl ::core::convert::From<WithdrawPollCall> for makerpollvoteCalls {
        fn from(value: WithdrawPollCall) -> Self {
            Self::WithdrawPoll(value)
        }
    }
    impl ::core::convert::From<WithdrawPollWithPollIdsCall> for makerpollvoteCalls {
        fn from(value: WithdrawPollWithPollIdsCall) -> Self {
            Self::WithdrawPollWithPollIds(value)
        }
    }
    ///Container type for all return fields from the `npoll` function with signature `npoll()` and selector `0xd35f19d7`
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
    pub struct NpollReturn(pub ::ethers::core::types::U256);
}
