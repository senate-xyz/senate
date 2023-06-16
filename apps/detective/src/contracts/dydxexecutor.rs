pub use dydxexecutor::*;

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
pub mod dydxexecutor {
    #[rustfmt::skip]
    const __ABI: &str = "[\n  {\n    \"inputs\": [\n      { \"internalType\": \"address\", \"name\": \"admin\", \"type\": \"address\" },\n      { \"internalType\": \"uint256\", \"name\": \"delay\", \"type\": \"uint256\" },\n      { \"internalType\": \"uint256\", \"name\": \"gracePeriod\", \"type\": \"uint256\" },\n      { \"internalType\": \"uint256\", \"name\": \"minimumDelay\", \"type\": \"uint256\" },\n      { \"internalType\": \"uint256\", \"name\": \"maximumDelay\", \"type\": \"uint256\" },\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"propositionThreshold\",\n        \"type\": \"uint256\"\n      },\n      { \"internalType\": \"uint256\", \"name\": \"voteDuration\", \"type\": \"uint256\" },\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"voteDifferential\",\n        \"type\": \"uint256\"\n      },\n      { \"internalType\": \"uint256\", \"name\": \"minimumQuorum\", \"type\": \"uint256\" }\n    ],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"constructor\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"bytes32\",\n        \"name\": \"actionHash\",\n        \"type\": \"bytes32\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"target\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"value\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"string\",\n        \"name\": \"signature\",\n        \"type\": \"string\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"bytes\",\n        \"name\": \"data\",\n        \"type\": \"bytes\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"executionTime\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"bool\",\n        \"name\": \"withDelegatecall\",\n        \"type\": \"bool\"\n      }\n    ],\n    \"name\": \"CancelledAction\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"bytes32\",\n        \"name\": \"actionHash\",\n        \"type\": \"bytes32\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"target\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"value\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"string\",\n        \"name\": \"signature\",\n        \"type\": \"string\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"bytes\",\n        \"name\": \"data\",\n        \"type\": \"bytes\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"executionTime\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"bool\",\n        \"name\": \"withDelegatecall\",\n        \"type\": \"bool\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"bytes\",\n        \"name\": \"resultData\",\n        \"type\": \"bytes\"\n      }\n    ],\n    \"name\": \"ExecutedAction\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"address\",\n        \"name\": \"newAdmin\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"NewAdmin\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"delay\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"NewDelay\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"address\",\n        \"name\": \"newPendingAdmin\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"NewPendingAdmin\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"bytes32\",\n        \"name\": \"actionHash\",\n        \"type\": \"bytes32\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"target\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"value\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"string\",\n        \"name\": \"signature\",\n        \"type\": \"string\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"bytes\",\n        \"name\": \"data\",\n        \"type\": \"bytes\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"executionTime\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"bool\",\n        \"name\": \"withDelegatecall\",\n        \"type\": \"bool\"\n      }\n    ],\n    \"name\": \"QueuedAction\",\n    \"type\": \"event\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"GRACE_PERIOD\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"MAXIMUM_DELAY\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"MINIMUM_DELAY\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"MINIMUM_QUORUM\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"ONE_HUNDRED_WITH_PRECISION\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"PROPOSITION_THRESHOLD\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"VOTE_DIFFERENTIAL\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"VOTING_DURATION\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"acceptAdmin\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"address\", \"name\": \"target\", \"type\": \"address\" },\n      { \"internalType\": \"uint256\", \"name\": \"value\", \"type\": \"uint256\" },\n      { \"internalType\": \"string\", \"name\": \"signature\", \"type\": \"string\" },\n      { \"internalType\": \"bytes\", \"name\": \"data\", \"type\": \"bytes\" },\n      { \"internalType\": \"uint256\", \"name\": \"executionTime\", \"type\": \"uint256\" },\n      { \"internalType\": \"bool\", \"name\": \"withDelegatecall\", \"type\": \"bool\" }\n    ],\n    \"name\": \"cancelTransaction\",\n    \"outputs\": [{ \"internalType\": \"bytes32\", \"name\": \"\", \"type\": \"bytes32\" }],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"address\", \"name\": \"target\", \"type\": \"address\" },\n      { \"internalType\": \"uint256\", \"name\": \"value\", \"type\": \"uint256\" },\n      { \"internalType\": \"string\", \"name\": \"signature\", \"type\": \"string\" },\n      { \"internalType\": \"bytes\", \"name\": \"data\", \"type\": \"bytes\" },\n      { \"internalType\": \"uint256\", \"name\": \"executionTime\", \"type\": \"uint256\" },\n      { \"internalType\": \"bool\", \"name\": \"withDelegatecall\", \"type\": \"bool\" }\n    ],\n    \"name\": \"executeTransaction\",\n    \"outputs\": [{ \"internalType\": \"bytes\", \"name\": \"\", \"type\": \"bytes\" }],\n    \"stateMutability\": \"payable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"getAdmin\",\n    \"outputs\": [{ \"internalType\": \"address\", \"name\": \"\", \"type\": \"address\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"getDelay\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"contract IDydxGovernor\",\n        \"name\": \"governance\",\n        \"type\": \"address\"\n      },\n      { \"internalType\": \"uint256\", \"name\": \"blockNumber\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"getMinimumPropositionPowerNeeded\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"votingSupply\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"getMinimumVotingPowerNeeded\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"getPendingAdmin\",\n    \"outputs\": [{ \"internalType\": \"address\", \"name\": \"\", \"type\": \"address\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"bytes32\", \"name\": \"actionHash\", \"type\": \"bytes32\" }\n    ],\n    \"name\": \"isActionQueued\",\n    \"outputs\": [{ \"internalType\": \"bool\", \"name\": \"\", \"type\": \"bool\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"contract IDydxGovernor\",\n        \"name\": \"governance\",\n        \"type\": \"address\"\n      },\n      { \"internalType\": \"uint256\", \"name\": \"proposalId\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"isProposalOverGracePeriod\",\n    \"outputs\": [{ \"internalType\": \"bool\", \"name\": \"\", \"type\": \"bool\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"contract IDydxGovernor\",\n        \"name\": \"governance\",\n        \"type\": \"address\"\n      },\n      { \"internalType\": \"uint256\", \"name\": \"proposalId\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"isProposalPassed\",\n    \"outputs\": [{ \"internalType\": \"bool\", \"name\": \"\", \"type\": \"bool\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"contract IDydxGovernor\",\n        \"name\": \"governance\",\n        \"type\": \"address\"\n      },\n      { \"internalType\": \"address\", \"name\": \"user\", \"type\": \"address\" },\n      { \"internalType\": \"uint256\", \"name\": \"blockNumber\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"isPropositionPowerEnough\",\n    \"outputs\": [{ \"internalType\": \"bool\", \"name\": \"\", \"type\": \"bool\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"contract IDydxGovernor\",\n        \"name\": \"governance\",\n        \"type\": \"address\"\n      },\n      { \"internalType\": \"uint256\", \"name\": \"proposalId\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"isQuorumValid\",\n    \"outputs\": [{ \"internalType\": \"bool\", \"name\": \"\", \"type\": \"bool\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"contract IDydxGovernor\",\n        \"name\": \"governance\",\n        \"type\": \"address\"\n      },\n      { \"internalType\": \"uint256\", \"name\": \"proposalId\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"isVoteDifferentialValid\",\n    \"outputs\": [{ \"internalType\": \"bool\", \"name\": \"\", \"type\": \"bool\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"address\", \"name\": \"target\", \"type\": \"address\" },\n      { \"internalType\": \"uint256\", \"name\": \"value\", \"type\": \"uint256\" },\n      { \"internalType\": \"string\", \"name\": \"signature\", \"type\": \"string\" },\n      { \"internalType\": \"bytes\", \"name\": \"data\", \"type\": \"bytes\" },\n      { \"internalType\": \"uint256\", \"name\": \"executionTime\", \"type\": \"uint256\" },\n      { \"internalType\": \"bool\", \"name\": \"withDelegatecall\", \"type\": \"bool\" }\n    ],\n    \"name\": \"queueTransaction\",\n    \"outputs\": [{ \"internalType\": \"bytes32\", \"name\": \"\", \"type\": \"bytes32\" }],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"delay\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"setDelay\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"address\",\n        \"name\": \"newPendingAdmin\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"setPendingAdmin\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"contract IDydxGovernor\",\n        \"name\": \"governance\",\n        \"type\": \"address\"\n      },\n      { \"internalType\": \"address\", \"name\": \"user\", \"type\": \"address\" },\n      { \"internalType\": \"uint256\", \"name\": \"blockNumber\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"validateCreatorOfProposal\",\n    \"outputs\": [{ \"internalType\": \"bool\", \"name\": \"\", \"type\": \"bool\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"contract IDydxGovernor\",\n        \"name\": \"governance\",\n        \"type\": \"address\"\n      },\n      { \"internalType\": \"address\", \"name\": \"user\", \"type\": \"address\" },\n      { \"internalType\": \"uint256\", \"name\": \"blockNumber\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"validateProposalCancellation\",\n    \"outputs\": [{ \"internalType\": \"bool\", \"name\": \"\", \"type\": \"bool\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  { \"stateMutability\": \"payable\", \"type\": \"receive\" }\n]\n";
    ///The parsed JSON ABI of the contract.
    pub static DYDXEXECUTOR_ABI: ::ethers::contract::Lazy<::ethers::core::abi::Abi> =
        ::ethers::contract::Lazy::new(|| {
            ::ethers::core::utils::__serde_json::from_str(__ABI).expect("ABI is always valid")
        });

    pub struct dydxexecutor<M>(::ethers::contract::Contract<M>);

    impl<M> ::core::clone::Clone for dydxexecutor<M> {
        fn clone(&self) -> Self {
            Self(::core::clone::Clone::clone(&self.0))
        }
    }

    impl<M> ::core::ops::Deref for dydxexecutor<M> {
        type Target = ::ethers::contract::Contract<M>;
        fn deref(&self) -> &Self::Target {
            &self.0
        }
    }

    impl<M> ::core::ops::DerefMut for dydxexecutor<M> {
        fn deref_mut(&mut self) -> &mut Self::Target {
            &mut self.0
        }
    }

    impl<M> ::core::fmt::Debug for dydxexecutor<M> {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            f.debug_tuple(stringify!(dydxexecutor))
                .field(&self.address())
                .finish()
        }
    }

    impl<M: ::ethers::providers::Middleware> dydxexecutor<M> {
        /// Creates a new contract instance with the specified `ethers` client at
        /// `address`. The contract derefs to a `ethers::Contract` object.
        pub fn new<T: Into<::ethers::core::types::Address>>(
            address: T,
            client: ::std::sync::Arc<M>,
        ) -> Self {
            Self(::ethers::contract::Contract::new(
                address.into(),
                DYDXEXECUTOR_ABI.clone(),
                client,
            ))
        }
        ///Calls the contract's `GRACE_PERIOD` (0xc1a287e2) function
        pub fn grace_period(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([193, 162, 135, 226], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `MAXIMUM_DELAY` (0x7d645fab) function
        pub fn maximum_delay(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([125, 100, 95, 171], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `MINIMUM_DELAY` (0xb1b43ae5) function
        pub fn minimum_delay(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([177, 180, 58, 229], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `MINIMUM_QUORUM` (0xb159beac) function
        pub fn minimum_quorum(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([177, 89, 190, 172], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `ONE_HUNDRED_WITH_PRECISION` (0x1d73fd6d) function
        pub fn one_hundred_with_precision(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([29, 115, 253, 109], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `PROPOSITION_THRESHOLD` (0xfd58afd4) function
        pub fn proposition_threshold(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([253, 88, 175, 212], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `VOTE_DIFFERENTIAL` (0x9125fb58) function
        pub fn vote_differential(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([145, 37, 251, 88], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `VOTING_DURATION` (0xa438d208) function
        pub fn voting_duration(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([164, 56, 210, 8], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `acceptAdmin` (0x0e18b681) function
        pub fn accept_admin(&self) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([14, 24, 182, 129], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `cancelTransaction` (0x1dc40b51) function
        pub fn cancel_transaction(
            &self,
            target: ::ethers::core::types::Address,
            value: ::ethers::core::types::U256,
            signature: ::std::string::String,
            data: ::ethers::core::types::Bytes,
            execution_time: ::ethers::core::types::U256,
            with_delegatecall: bool,
        ) -> ::ethers::contract::builders::ContractCall<M, [u8; 32]> {
            self.0
                .method_hash(
                    [29, 196, 11, 81],
                    (
                        target,
                        value,
                        signature,
                        data,
                        execution_time,
                        with_delegatecall,
                    ),
                )
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `executeTransaction` (0x8902ab65) function
        pub fn execute_transaction(
            &self,
            target: ::ethers::core::types::Address,
            value: ::ethers::core::types::U256,
            signature: ::std::string::String,
            data: ::ethers::core::types::Bytes,
            execution_time: ::ethers::core::types::U256,
            with_delegatecall: bool,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::Bytes> {
            self.0
                .method_hash(
                    [137, 2, 171, 101],
                    (
                        target,
                        value,
                        signature,
                        data,
                        execution_time,
                        with_delegatecall,
                    ),
                )
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getAdmin` (0x6e9960c3) function
        pub fn get_admin(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::Address> {
            self.0
                .method_hash([110, 153, 96, 195], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getDelay` (0xcebc9a82) function
        pub fn get_delay(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([206, 188, 154, 130], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getMinimumPropositionPowerNeeded` (0xf48cb134) function
        pub fn get_minimum_proposition_power_needed(
            &self,
            governance: ::ethers::core::types::Address,
            block_number: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([244, 140, 177, 52], (governance, block_number))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getMinimumVotingPowerNeeded` (0xe50f8400) function
        pub fn get_minimum_voting_power_needed(
            &self,
            voting_supply: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([229, 15, 132, 0], voting_supply)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getPendingAdmin` (0xd0468156) function
        pub fn get_pending_admin(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::Address> {
            self.0
                .method_hash([208, 70, 129, 86], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `isActionQueued` (0xb1fc8796) function
        pub fn is_action_queued(
            &self,
            action_hash: [u8; 32],
        ) -> ::ethers::contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([177, 252, 135, 150], action_hash)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `isProposalOverGracePeriod` (0xf670a5f9) function
        pub fn is_proposal_over_grace_period(
            &self,
            governance: ::ethers::core::types::Address,
            proposal_id: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([246, 112, 165, 249], (governance, proposal_id))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `isProposalPassed` (0x06fbb3ab) function
        pub fn is_proposal_passed(
            &self,
            governance: ::ethers::core::types::Address,
            proposal_id: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([6, 251, 179, 171], (governance, proposal_id))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `isPropositionPowerEnough` (0x66121042) function
        pub fn is_proposition_power_enough(
            &self,
            governance: ::ethers::core::types::Address,
            user: ::ethers::core::types::Address,
            block_number: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([102, 18, 16, 66], (governance, user, block_number))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `isQuorumValid` (0xace43209) function
        pub fn is_quorum_valid(
            &self,
            governance: ::ethers::core::types::Address,
            proposal_id: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([172, 228, 50, 9], (governance, proposal_id))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `isVoteDifferentialValid` (0x7aa50080) function
        pub fn is_vote_differential_valid(
            &self,
            governance: ::ethers::core::types::Address,
            proposal_id: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([122, 165, 0, 128], (governance, proposal_id))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `queueTransaction` (0x8d8fe2e3) function
        pub fn queue_transaction(
            &self,
            target: ::ethers::core::types::Address,
            value: ::ethers::core::types::U256,
            signature: ::std::string::String,
            data: ::ethers::core::types::Bytes,
            execution_time: ::ethers::core::types::U256,
            with_delegatecall: bool,
        ) -> ::ethers::contract::builders::ContractCall<M, [u8; 32]> {
            self.0
                .method_hash(
                    [141, 143, 226, 227],
                    (
                        target,
                        value,
                        signature,
                        data,
                        execution_time,
                        with_delegatecall,
                    ),
                )
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `setDelay` (0xe177246e) function
        pub fn set_delay(
            &self,
            delay: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([225, 119, 36, 110], delay)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `setPendingAdmin` (0x4dd18bf5) function
        pub fn set_pending_admin(
            &self,
            new_pending_admin: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([77, 209, 139, 245], new_pending_admin)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `validateCreatorOfProposal` (0xd0d90298) function
        pub fn validate_creator_of_proposal(
            &self,
            governance: ::ethers::core::types::Address,
            user: ::ethers::core::types::Address,
            block_number: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([208, 217, 2, 152], (governance, user, block_number))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `validateProposalCancellation` (0x31a7bc41) function
        pub fn validate_proposal_cancellation(
            &self,
            governance: ::ethers::core::types::Address,
            user: ::ethers::core::types::Address,
            block_number: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([49, 167, 188, 65], (governance, user, block_number))
                .expect("method not found (this should never happen)")
        }
        ///Gets the contract's `CancelledAction` event
        pub fn cancelled_action_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, CancelledActionFilter>
        {
            self.0.event()
        }
        ///Gets the contract's `ExecutedAction` event
        pub fn executed_action_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, ExecutedActionFilter>
        {
            self.0.event()
        }
        ///Gets the contract's `NewAdmin` event
        pub fn new_admin_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, NewAdminFilter> {
            self.0.event()
        }
        ///Gets the contract's `NewDelay` event
        pub fn new_delay_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, NewDelayFilter> {
            self.0.event()
        }
        ///Gets the contract's `NewPendingAdmin` event
        pub fn new_pending_admin_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, NewPendingAdminFilter>
        {
            self.0.event()
        }
        ///Gets the contract's `QueuedAction` event
        pub fn queued_action_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, QueuedActionFilter>
        {
            self.0.event()
        }
        /// Returns an `Event` builder for all the events of this contract.
        pub fn events(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, dydxexecutorEvents>
        {
            self.0
                .event_with_filter(::core::default::Default::default())
        }
    }

    impl<M: ::ethers::providers::Middleware> From<::ethers::contract::Contract<M>> for dydxexecutor<M> {
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
        name = "CancelledAction",
        abi = "CancelledAction(bytes32,address,uint256,string,bytes,uint256,bool)"
    )]
    pub struct CancelledActionFilter {
        pub action_hash: [u8; 32],
        #[ethevent(indexed)]
        pub target: ::ethers::core::types::Address,
        pub value: ::ethers::core::types::U256,
        pub signature: ::std::string::String,
        pub data: ::ethers::core::types::Bytes,
        pub execution_time: ::ethers::core::types::U256,
        pub with_delegatecall: bool,
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
        name = "ExecutedAction",
        abi = "ExecutedAction(bytes32,address,uint256,string,bytes,uint256,bool,bytes)"
    )]
    pub struct ExecutedActionFilter {
        pub action_hash: [u8; 32],
        #[ethevent(indexed)]
        pub target: ::ethers::core::types::Address,
        pub value: ::ethers::core::types::U256,
        pub signature: ::std::string::String,
        pub data: ::ethers::core::types::Bytes,
        pub execution_time: ::ethers::core::types::U256,
        pub with_delegatecall: bool,
        pub result_data: ::ethers::core::types::Bytes,
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
    #[ethevent(name = "NewAdmin", abi = "NewAdmin(address)")]
    pub struct NewAdminFilter {
        pub new_admin: ::ethers::core::types::Address,
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
    #[ethevent(name = "NewDelay", abi = "NewDelay(uint256)")]
    pub struct NewDelayFilter {
        pub delay: ::ethers::core::types::U256,
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
    #[ethevent(name = "NewPendingAdmin", abi = "NewPendingAdmin(address)")]
    pub struct NewPendingAdminFilter {
        pub new_pending_admin: ::ethers::core::types::Address,
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
        name = "QueuedAction",
        abi = "QueuedAction(bytes32,address,uint256,string,bytes,uint256,bool)"
    )]
    pub struct QueuedActionFilter {
        pub action_hash: [u8; 32],
        #[ethevent(indexed)]
        pub target: ::ethers::core::types::Address,
        pub value: ::ethers::core::types::U256,
        pub signature: ::std::string::String,
        pub data: ::ethers::core::types::Bytes,
        pub execution_time: ::ethers::core::types::U256,
        pub with_delegatecall: bool,
    }

    ///Container type for all of the contract's events
    #[derive(Clone, ::ethers::contract::EthAbiType, Debug, PartialEq, Eq, Hash)]
    pub enum dydxexecutorEvents {
        CancelledActionFilter(CancelledActionFilter),
        ExecutedActionFilter(ExecutedActionFilter),
        NewAdminFilter(NewAdminFilter),
        NewDelayFilter(NewDelayFilter),
        NewPendingAdminFilter(NewPendingAdminFilter),
        QueuedActionFilter(QueuedActionFilter),
    }

    impl ::ethers::contract::EthLogDecode for dydxexecutorEvents {
        fn decode_log(
            log: &::ethers::core::abi::RawLog,
        ) -> ::core::result::Result<Self, ::ethers::core::abi::Error> {
            if let Ok(decoded) = CancelledActionFilter::decode_log(log) {
                return Ok(dydxexecutorEvents::CancelledActionFilter(decoded));
            }
            if let Ok(decoded) = ExecutedActionFilter::decode_log(log) {
                return Ok(dydxexecutorEvents::ExecutedActionFilter(decoded));
            }
            if let Ok(decoded) = NewAdminFilter::decode_log(log) {
                return Ok(dydxexecutorEvents::NewAdminFilter(decoded));
            }
            if let Ok(decoded) = NewDelayFilter::decode_log(log) {
                return Ok(dydxexecutorEvents::NewDelayFilter(decoded));
            }
            if let Ok(decoded) = NewPendingAdminFilter::decode_log(log) {
                return Ok(dydxexecutorEvents::NewPendingAdminFilter(decoded));
            }
            if let Ok(decoded) = QueuedActionFilter::decode_log(log) {
                return Ok(dydxexecutorEvents::QueuedActionFilter(decoded));
            }
            Err(::ethers::core::abi::Error::InvalidData)
        }
    }

    impl ::core::fmt::Display for dydxexecutorEvents {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            match self {
                Self::CancelledActionFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::ExecutedActionFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::NewAdminFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::NewDelayFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::NewPendingAdminFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::QueuedActionFilter(element) => ::core::fmt::Display::fmt(element, f),
            }
        }
    }

    impl ::core::convert::From<CancelledActionFilter> for dydxexecutorEvents {
        fn from(value: CancelledActionFilter) -> Self {
            Self::CancelledActionFilter(value)
        }
    }

    impl ::core::convert::From<ExecutedActionFilter> for dydxexecutorEvents {
        fn from(value: ExecutedActionFilter) -> Self {
            Self::ExecutedActionFilter(value)
        }
    }

    impl ::core::convert::From<NewAdminFilter> for dydxexecutorEvents {
        fn from(value: NewAdminFilter) -> Self {
            Self::NewAdminFilter(value)
        }
    }

    impl ::core::convert::From<NewDelayFilter> for dydxexecutorEvents {
        fn from(value: NewDelayFilter) -> Self {
            Self::NewDelayFilter(value)
        }
    }

    impl ::core::convert::From<NewPendingAdminFilter> for dydxexecutorEvents {
        fn from(value: NewPendingAdminFilter) -> Self {
            Self::NewPendingAdminFilter(value)
        }
    }

    impl ::core::convert::From<QueuedActionFilter> for dydxexecutorEvents {
        fn from(value: QueuedActionFilter) -> Self {
            Self::QueuedActionFilter(value)
        }
    }

    ///Container type for all input parameters for the `GRACE_PERIOD` function with signature `GRACE_PERIOD()` and selector `0xc1a287e2`
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
    #[ethcall(name = "GRACE_PERIOD", abi = "GRACE_PERIOD()")]
    pub struct GracePeriodCall;

    ///Container type for all input parameters for the `MAXIMUM_DELAY` function with signature `MAXIMUM_DELAY()` and selector `0x7d645fab`
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
    #[ethcall(name = "MAXIMUM_DELAY", abi = "MAXIMUM_DELAY()")]
    pub struct MaximumDelayCall;

    ///Container type for all input parameters for the `MINIMUM_DELAY` function with signature `MINIMUM_DELAY()` and selector `0xb1b43ae5`
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
    #[ethcall(name = "MINIMUM_DELAY", abi = "MINIMUM_DELAY()")]
    pub struct MinimumDelayCall;

    ///Container type for all input parameters for the `MINIMUM_QUORUM` function with signature `MINIMUM_QUORUM()` and selector `0xb159beac`
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
    #[ethcall(name = "MINIMUM_QUORUM", abi = "MINIMUM_QUORUM()")]
    pub struct MinimumQuorumCall;

    ///Container type for all input parameters for the `ONE_HUNDRED_WITH_PRECISION` function with signature `ONE_HUNDRED_WITH_PRECISION()` and selector `0x1d73fd6d`
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
        name = "ONE_HUNDRED_WITH_PRECISION",
        abi = "ONE_HUNDRED_WITH_PRECISION()"
    )]
    pub struct OneHundredWithPrecisionCall;

    ///Container type for all input parameters for the `PROPOSITION_THRESHOLD` function with signature `PROPOSITION_THRESHOLD()` and selector `0xfd58afd4`
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
    #[ethcall(name = "PROPOSITION_THRESHOLD", abi = "PROPOSITION_THRESHOLD()")]
    pub struct PropositionThresholdCall;

    ///Container type for all input parameters for the `VOTE_DIFFERENTIAL` function with signature `VOTE_DIFFERENTIAL()` and selector `0x9125fb58`
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
    #[ethcall(name = "VOTE_DIFFERENTIAL", abi = "VOTE_DIFFERENTIAL()")]
    pub struct VoteDifferentialCall;

    ///Container type for all input parameters for the `VOTING_DURATION` function with signature `VOTING_DURATION()` and selector `0xa438d208`
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
    #[ethcall(name = "VOTING_DURATION", abi = "VOTING_DURATION()")]
    pub struct VotingDurationCall;

    ///Container type for all input parameters for the `acceptAdmin` function with signature `acceptAdmin()` and selector `0x0e18b681`
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
    #[ethcall(name = "acceptAdmin", abi = "acceptAdmin()")]
    pub struct AcceptAdminCall;

    ///Container type for all input parameters for the `cancelTransaction` function with signature `cancelTransaction(address,uint256,string,bytes,uint256,bool)` and selector `0x1dc40b51`
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
        name = "cancelTransaction",
        abi = "cancelTransaction(address,uint256,string,bytes,uint256,bool)"
    )]
    pub struct CancelTransactionCall {
        pub target: ::ethers::core::types::Address,
        pub value: ::ethers::core::types::U256,
        pub signature: ::std::string::String,
        pub data: ::ethers::core::types::Bytes,
        pub execution_time: ::ethers::core::types::U256,
        pub with_delegatecall: bool,
    }

    ///Container type for all input parameters for the `executeTransaction` function with signature `executeTransaction(address,uint256,string,bytes,uint256,bool)` and selector `0x8902ab65`
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
        name = "executeTransaction",
        abi = "executeTransaction(address,uint256,string,bytes,uint256,bool)"
    )]
    pub struct ExecuteTransactionCall {
        pub target: ::ethers::core::types::Address,
        pub value: ::ethers::core::types::U256,
        pub signature: ::std::string::String,
        pub data: ::ethers::core::types::Bytes,
        pub execution_time: ::ethers::core::types::U256,
        pub with_delegatecall: bool,
    }

    ///Container type for all input parameters for the `getAdmin` function with signature `getAdmin()` and selector `0x6e9960c3`
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
    #[ethcall(name = "getAdmin", abi = "getAdmin()")]
    pub struct GetAdminCall;

    ///Container type for all input parameters for the `getDelay` function with signature `getDelay()` and selector `0xcebc9a82`
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
    #[ethcall(name = "getDelay", abi = "getDelay()")]
    pub struct GetDelayCall;

    ///Container type for all input parameters for the `getMinimumPropositionPowerNeeded` function with signature `getMinimumPropositionPowerNeeded(address,uint256)` and selector `0xf48cb134`
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
        name = "getMinimumPropositionPowerNeeded",
        abi = "getMinimumPropositionPowerNeeded(address,uint256)"
    )]
    pub struct GetMinimumPropositionPowerNeededCall {
        pub governance: ::ethers::core::types::Address,
        pub block_number: ::ethers::core::types::U256,
    }

    ///Container type for all input parameters for the `getMinimumVotingPowerNeeded` function with signature `getMinimumVotingPowerNeeded(uint256)` and selector `0xe50f8400`
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
        name = "getMinimumVotingPowerNeeded",
        abi = "getMinimumVotingPowerNeeded(uint256)"
    )]
    pub struct GetMinimumVotingPowerNeededCall {
        pub voting_supply: ::ethers::core::types::U256,
    }

    ///Container type for all input parameters for the `getPendingAdmin` function with signature `getPendingAdmin()` and selector `0xd0468156`
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
    #[ethcall(name = "getPendingAdmin", abi = "getPendingAdmin()")]
    pub struct GetPendingAdminCall;

    ///Container type for all input parameters for the `isActionQueued` function with signature `isActionQueued(bytes32)` and selector `0xb1fc8796`
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
    #[ethcall(name = "isActionQueued", abi = "isActionQueued(bytes32)")]
    pub struct IsActionQueuedCall {
        pub action_hash: [u8; 32],
    }

    ///Container type for all input parameters for the `isProposalOverGracePeriod` function with signature `isProposalOverGracePeriod(address,uint256)` and selector `0xf670a5f9`
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
        name = "isProposalOverGracePeriod",
        abi = "isProposalOverGracePeriod(address,uint256)"
    )]
    pub struct IsProposalOverGracePeriodCall {
        pub governance: ::ethers::core::types::Address,
        pub proposal_id: ::ethers::core::types::U256,
    }

    ///Container type for all input parameters for the `isProposalPassed` function with signature `isProposalPassed(address,uint256)` and selector `0x06fbb3ab`
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
    #[ethcall(name = "isProposalPassed", abi = "isProposalPassed(address,uint256)")]
    pub struct IsProposalPassedCall {
        pub governance: ::ethers::core::types::Address,
        pub proposal_id: ::ethers::core::types::U256,
    }

    ///Container type for all input parameters for the `isPropositionPowerEnough` function with signature `isPropositionPowerEnough(address,address,uint256)` and selector `0x66121042`
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
        name = "isPropositionPowerEnough",
        abi = "isPropositionPowerEnough(address,address,uint256)"
    )]
    pub struct IsPropositionPowerEnoughCall {
        pub governance: ::ethers::core::types::Address,
        pub user: ::ethers::core::types::Address,
        pub block_number: ::ethers::core::types::U256,
    }

    ///Container type for all input parameters for the `isQuorumValid` function with signature `isQuorumValid(address,uint256)` and selector `0xace43209`
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
    #[ethcall(name = "isQuorumValid", abi = "isQuorumValid(address,uint256)")]
    pub struct IsQuorumValidCall {
        pub governance: ::ethers::core::types::Address,
        pub proposal_id: ::ethers::core::types::U256,
    }

    ///Container type for all input parameters for the `isVoteDifferentialValid` function with signature `isVoteDifferentialValid(address,uint256)` and selector `0x7aa50080`
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
        name = "isVoteDifferentialValid",
        abi = "isVoteDifferentialValid(address,uint256)"
    )]
    pub struct IsVoteDifferentialValidCall {
        pub governance: ::ethers::core::types::Address,
        pub proposal_id: ::ethers::core::types::U256,
    }

    ///Container type for all input parameters for the `queueTransaction` function with signature `queueTransaction(address,uint256,string,bytes,uint256,bool)` and selector `0x8d8fe2e3`
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
        name = "queueTransaction",
        abi = "queueTransaction(address,uint256,string,bytes,uint256,bool)"
    )]
    pub struct QueueTransactionCall {
        pub target: ::ethers::core::types::Address,
        pub value: ::ethers::core::types::U256,
        pub signature: ::std::string::String,
        pub data: ::ethers::core::types::Bytes,
        pub execution_time: ::ethers::core::types::U256,
        pub with_delegatecall: bool,
    }

    ///Container type for all input parameters for the `setDelay` function with signature `setDelay(uint256)` and selector `0xe177246e`
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
    #[ethcall(name = "setDelay", abi = "setDelay(uint256)")]
    pub struct SetDelayCall {
        pub delay: ::ethers::core::types::U256,
    }

    ///Container type for all input parameters for the `setPendingAdmin` function with signature `setPendingAdmin(address)` and selector `0x4dd18bf5`
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
    #[ethcall(name = "setPendingAdmin", abi = "setPendingAdmin(address)")]
    pub struct SetPendingAdminCall {
        pub new_pending_admin: ::ethers::core::types::Address,
    }

    ///Container type for all input parameters for the `validateCreatorOfProposal` function with signature `validateCreatorOfProposal(address,address,uint256)` and selector `0xd0d90298`
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
        name = "validateCreatorOfProposal",
        abi = "validateCreatorOfProposal(address,address,uint256)"
    )]
    pub struct ValidateCreatorOfProposalCall {
        pub governance: ::ethers::core::types::Address,
        pub user: ::ethers::core::types::Address,
        pub block_number: ::ethers::core::types::U256,
    }

    ///Container type for all input parameters for the `validateProposalCancellation` function with signature `validateProposalCancellation(address,address,uint256)` and selector `0x31a7bc41`
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
        name = "validateProposalCancellation",
        abi = "validateProposalCancellation(address,address,uint256)"
    )]
    pub struct ValidateProposalCancellationCall {
        pub governance: ::ethers::core::types::Address,
        pub user: ::ethers::core::types::Address,
        pub block_number: ::ethers::core::types::U256,
    }

    ///Container type for all of the contract's call
    #[derive(Clone, ::ethers::contract::EthAbiType, Debug, PartialEq, Eq, Hash)]
    pub enum dydxexecutorCalls {
        GracePeriod(GracePeriodCall),
        MaximumDelay(MaximumDelayCall),
        MinimumDelay(MinimumDelayCall),
        MinimumQuorum(MinimumQuorumCall),
        OneHundredWithPrecision(OneHundredWithPrecisionCall),
        PropositionThreshold(PropositionThresholdCall),
        VoteDifferential(VoteDifferentialCall),
        VotingDuration(VotingDurationCall),
        AcceptAdmin(AcceptAdminCall),
        CancelTransaction(CancelTransactionCall),
        ExecuteTransaction(ExecuteTransactionCall),
        GetAdmin(GetAdminCall),
        GetDelay(GetDelayCall),
        GetMinimumPropositionPowerNeeded(GetMinimumPropositionPowerNeededCall),
        GetMinimumVotingPowerNeeded(GetMinimumVotingPowerNeededCall),
        GetPendingAdmin(GetPendingAdminCall),
        IsActionQueued(IsActionQueuedCall),
        IsProposalOverGracePeriod(IsProposalOverGracePeriodCall),
        IsProposalPassed(IsProposalPassedCall),
        IsPropositionPowerEnough(IsPropositionPowerEnoughCall),
        IsQuorumValid(IsQuorumValidCall),
        IsVoteDifferentialValid(IsVoteDifferentialValidCall),
        QueueTransaction(QueueTransactionCall),
        SetDelay(SetDelayCall),
        SetPendingAdmin(SetPendingAdminCall),
        ValidateCreatorOfProposal(ValidateCreatorOfProposalCall),
        ValidateProposalCancellation(ValidateProposalCancellationCall),
    }

    impl ::ethers::core::abi::AbiDecode for dydxexecutorCalls {
        fn decode(
            data: impl AsRef<[u8]>,
        ) -> ::core::result::Result<Self, ::ethers::core::abi::AbiError> {
            let data = data.as_ref();
            if let Ok(decoded) = <GracePeriodCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::GracePeriod(decoded));
            }
            if let Ok(decoded) = <MaximumDelayCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::MaximumDelay(decoded));
            }
            if let Ok(decoded) = <MinimumDelayCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::MinimumDelay(decoded));
            }
            if let Ok(decoded) = <MinimumQuorumCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::MinimumQuorum(decoded));
            }
            if let Ok(decoded) =
                <OneHundredWithPrecisionCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::OneHundredWithPrecision(decoded));
            }
            if let Ok(decoded) =
                <PropositionThresholdCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::PropositionThreshold(decoded));
            }
            if let Ok(decoded) =
                <VoteDifferentialCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::VoteDifferential(decoded));
            }
            if let Ok(decoded) =
                <VotingDurationCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::VotingDuration(decoded));
            }
            if let Ok(decoded) = <AcceptAdminCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::AcceptAdmin(decoded));
            }
            if let Ok(decoded) =
                <CancelTransactionCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::CancelTransaction(decoded));
            }
            if let Ok(decoded) =
                <ExecuteTransactionCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::ExecuteTransaction(decoded));
            }
            if let Ok(decoded) = <GetAdminCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::GetAdmin(decoded));
            }
            if let Ok(decoded) = <GetDelayCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::GetDelay(decoded));
            }
            if let Ok(decoded) =
                <GetMinimumPropositionPowerNeededCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                )
            {
                return Ok(Self::GetMinimumPropositionPowerNeeded(decoded));
            }
            if let Ok(decoded) =
                <GetMinimumVotingPowerNeededCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::GetMinimumVotingPowerNeeded(decoded));
            }
            if let Ok(decoded) =
                <GetPendingAdminCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::GetPendingAdmin(decoded));
            }
            if let Ok(decoded) =
                <IsActionQueuedCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::IsActionQueued(decoded));
            }
            if let Ok(decoded) =
                <IsProposalOverGracePeriodCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::IsProposalOverGracePeriod(decoded));
            }
            if let Ok(decoded) =
                <IsProposalPassedCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::IsProposalPassed(decoded));
            }
            if let Ok(decoded) =
                <IsPropositionPowerEnoughCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::IsPropositionPowerEnough(decoded));
            }
            if let Ok(decoded) = <IsQuorumValidCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::IsQuorumValid(decoded));
            }
            if let Ok(decoded) =
                <IsVoteDifferentialValidCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::IsVoteDifferentialValid(decoded));
            }
            if let Ok(decoded) =
                <QueueTransactionCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::QueueTransaction(decoded));
            }
            if let Ok(decoded) = <SetDelayCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::SetDelay(decoded));
            }
            if let Ok(decoded) =
                <SetPendingAdminCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::SetPendingAdmin(decoded));
            }
            if let Ok(decoded) =
                <ValidateCreatorOfProposalCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::ValidateCreatorOfProposal(decoded));
            }
            if let Ok(decoded) =
                <ValidateProposalCancellationCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::ValidateProposalCancellation(decoded));
            }
            Err(::ethers::core::abi::Error::InvalidData.into())
        }
    }

    impl ::ethers::core::abi::AbiEncode for dydxexecutorCalls {
        fn encode(self) -> Vec<u8> {
            match self {
                Self::GracePeriod(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::MaximumDelay(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::MinimumDelay(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::MinimumQuorum(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::OneHundredWithPrecision(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::PropositionThreshold(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::VoteDifferential(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::VotingDuration(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::AcceptAdmin(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::CancelTransaction(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::ExecuteTransaction(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetAdmin(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::GetDelay(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::GetMinimumPropositionPowerNeeded(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetMinimumVotingPowerNeeded(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetPendingAdmin(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::IsActionQueued(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::IsProposalOverGracePeriod(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::IsProposalPassed(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::IsPropositionPowerEnough(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::IsQuorumValid(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::IsVoteDifferentialValid(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::QueueTransaction(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::SetDelay(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::SetPendingAdmin(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::ValidateCreatorOfProposal(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::ValidateProposalCancellation(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
            }
        }
    }

    impl ::core::fmt::Display for dydxexecutorCalls {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            match self {
                Self::GracePeriod(element) => ::core::fmt::Display::fmt(element, f),
                Self::MaximumDelay(element) => ::core::fmt::Display::fmt(element, f),
                Self::MinimumDelay(element) => ::core::fmt::Display::fmt(element, f),
                Self::MinimumQuorum(element) => ::core::fmt::Display::fmt(element, f),
                Self::OneHundredWithPrecision(element) => ::core::fmt::Display::fmt(element, f),
                Self::PropositionThreshold(element) => ::core::fmt::Display::fmt(element, f),
                Self::VoteDifferential(element) => ::core::fmt::Display::fmt(element, f),
                Self::VotingDuration(element) => ::core::fmt::Display::fmt(element, f),
                Self::AcceptAdmin(element) => ::core::fmt::Display::fmt(element, f),
                Self::CancelTransaction(element) => ::core::fmt::Display::fmt(element, f),
                Self::ExecuteTransaction(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetAdmin(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetDelay(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetMinimumPropositionPowerNeeded(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::GetMinimumVotingPowerNeeded(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetPendingAdmin(element) => ::core::fmt::Display::fmt(element, f),
                Self::IsActionQueued(element) => ::core::fmt::Display::fmt(element, f),
                Self::IsProposalOverGracePeriod(element) => ::core::fmt::Display::fmt(element, f),
                Self::IsProposalPassed(element) => ::core::fmt::Display::fmt(element, f),
                Self::IsPropositionPowerEnough(element) => ::core::fmt::Display::fmt(element, f),
                Self::IsQuorumValid(element) => ::core::fmt::Display::fmt(element, f),
                Self::IsVoteDifferentialValid(element) => ::core::fmt::Display::fmt(element, f),
                Self::QueueTransaction(element) => ::core::fmt::Display::fmt(element, f),
                Self::SetDelay(element) => ::core::fmt::Display::fmt(element, f),
                Self::SetPendingAdmin(element) => ::core::fmt::Display::fmt(element, f),
                Self::ValidateCreatorOfProposal(element) => ::core::fmt::Display::fmt(element, f),
                Self::ValidateProposalCancellation(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
            }
        }
    }

    impl ::core::convert::From<GracePeriodCall> for dydxexecutorCalls {
        fn from(value: GracePeriodCall) -> Self {
            Self::GracePeriod(value)
        }
    }

    impl ::core::convert::From<MaximumDelayCall> for dydxexecutorCalls {
        fn from(value: MaximumDelayCall) -> Self {
            Self::MaximumDelay(value)
        }
    }

    impl ::core::convert::From<MinimumDelayCall> for dydxexecutorCalls {
        fn from(value: MinimumDelayCall) -> Self {
            Self::MinimumDelay(value)
        }
    }

    impl ::core::convert::From<MinimumQuorumCall> for dydxexecutorCalls {
        fn from(value: MinimumQuorumCall) -> Self {
            Self::MinimumQuorum(value)
        }
    }

    impl ::core::convert::From<OneHundredWithPrecisionCall> for dydxexecutorCalls {
        fn from(value: OneHundredWithPrecisionCall) -> Self {
            Self::OneHundredWithPrecision(value)
        }
    }

    impl ::core::convert::From<PropositionThresholdCall> for dydxexecutorCalls {
        fn from(value: PropositionThresholdCall) -> Self {
            Self::PropositionThreshold(value)
        }
    }

    impl ::core::convert::From<VoteDifferentialCall> for dydxexecutorCalls {
        fn from(value: VoteDifferentialCall) -> Self {
            Self::VoteDifferential(value)
        }
    }

    impl ::core::convert::From<VotingDurationCall> for dydxexecutorCalls {
        fn from(value: VotingDurationCall) -> Self {
            Self::VotingDuration(value)
        }
    }

    impl ::core::convert::From<AcceptAdminCall> for dydxexecutorCalls {
        fn from(value: AcceptAdminCall) -> Self {
            Self::AcceptAdmin(value)
        }
    }

    impl ::core::convert::From<CancelTransactionCall> for dydxexecutorCalls {
        fn from(value: CancelTransactionCall) -> Self {
            Self::CancelTransaction(value)
        }
    }

    impl ::core::convert::From<ExecuteTransactionCall> for dydxexecutorCalls {
        fn from(value: ExecuteTransactionCall) -> Self {
            Self::ExecuteTransaction(value)
        }
    }

    impl ::core::convert::From<GetAdminCall> for dydxexecutorCalls {
        fn from(value: GetAdminCall) -> Self {
            Self::GetAdmin(value)
        }
    }

    impl ::core::convert::From<GetDelayCall> for dydxexecutorCalls {
        fn from(value: GetDelayCall) -> Self {
            Self::GetDelay(value)
        }
    }

    impl ::core::convert::From<GetMinimumPropositionPowerNeededCall> for dydxexecutorCalls {
        fn from(value: GetMinimumPropositionPowerNeededCall) -> Self {
            Self::GetMinimumPropositionPowerNeeded(value)
        }
    }

    impl ::core::convert::From<GetMinimumVotingPowerNeededCall> for dydxexecutorCalls {
        fn from(value: GetMinimumVotingPowerNeededCall) -> Self {
            Self::GetMinimumVotingPowerNeeded(value)
        }
    }

    impl ::core::convert::From<GetPendingAdminCall> for dydxexecutorCalls {
        fn from(value: GetPendingAdminCall) -> Self {
            Self::GetPendingAdmin(value)
        }
    }

    impl ::core::convert::From<IsActionQueuedCall> for dydxexecutorCalls {
        fn from(value: IsActionQueuedCall) -> Self {
            Self::IsActionQueued(value)
        }
    }

    impl ::core::convert::From<IsProposalOverGracePeriodCall> for dydxexecutorCalls {
        fn from(value: IsProposalOverGracePeriodCall) -> Self {
            Self::IsProposalOverGracePeriod(value)
        }
    }

    impl ::core::convert::From<IsProposalPassedCall> for dydxexecutorCalls {
        fn from(value: IsProposalPassedCall) -> Self {
            Self::IsProposalPassed(value)
        }
    }

    impl ::core::convert::From<IsPropositionPowerEnoughCall> for dydxexecutorCalls {
        fn from(value: IsPropositionPowerEnoughCall) -> Self {
            Self::IsPropositionPowerEnough(value)
        }
    }

    impl ::core::convert::From<IsQuorumValidCall> for dydxexecutorCalls {
        fn from(value: IsQuorumValidCall) -> Self {
            Self::IsQuorumValid(value)
        }
    }

    impl ::core::convert::From<IsVoteDifferentialValidCall> for dydxexecutorCalls {
        fn from(value: IsVoteDifferentialValidCall) -> Self {
            Self::IsVoteDifferentialValid(value)
        }
    }

    impl ::core::convert::From<QueueTransactionCall> for dydxexecutorCalls {
        fn from(value: QueueTransactionCall) -> Self {
            Self::QueueTransaction(value)
        }
    }

    impl ::core::convert::From<SetDelayCall> for dydxexecutorCalls {
        fn from(value: SetDelayCall) -> Self {
            Self::SetDelay(value)
        }
    }

    impl ::core::convert::From<SetPendingAdminCall> for dydxexecutorCalls {
        fn from(value: SetPendingAdminCall) -> Self {
            Self::SetPendingAdmin(value)
        }
    }

    impl ::core::convert::From<ValidateCreatorOfProposalCall> for dydxexecutorCalls {
        fn from(value: ValidateCreatorOfProposalCall) -> Self {
            Self::ValidateCreatorOfProposal(value)
        }
    }

    impl ::core::convert::From<ValidateProposalCancellationCall> for dydxexecutorCalls {
        fn from(value: ValidateProposalCancellationCall) -> Self {
            Self::ValidateProposalCancellation(value)
        }
    }

    ///Container type for all return fields from the `GRACE_PERIOD` function with signature `GRACE_PERIOD()` and selector `0xc1a287e2`
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
    pub struct GracePeriodReturn(pub ::ethers::core::types::U256);

    ///Container type for all return fields from the `MAXIMUM_DELAY` function with signature `MAXIMUM_DELAY()` and selector `0x7d645fab`
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
    pub struct MaximumDelayReturn(pub ::ethers::core::types::U256);

    ///Container type for all return fields from the `MINIMUM_DELAY` function with signature `MINIMUM_DELAY()` and selector `0xb1b43ae5`
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
    pub struct MinimumDelayReturn(pub ::ethers::core::types::U256);

    ///Container type for all return fields from the `MINIMUM_QUORUM` function with signature `MINIMUM_QUORUM()` and selector `0xb159beac`
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
    pub struct MinimumQuorumReturn(pub ::ethers::core::types::U256);

    ///Container type for all return fields from the `ONE_HUNDRED_WITH_PRECISION` function with signature `ONE_HUNDRED_WITH_PRECISION()` and selector `0x1d73fd6d`
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
    pub struct OneHundredWithPrecisionReturn(pub ::ethers::core::types::U256);

    ///Container type for all return fields from the `PROPOSITION_THRESHOLD` function with signature `PROPOSITION_THRESHOLD()` and selector `0xfd58afd4`
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
    pub struct PropositionThresholdReturn(pub ::ethers::core::types::U256);

    ///Container type for all return fields from the `VOTE_DIFFERENTIAL` function with signature `VOTE_DIFFERENTIAL()` and selector `0x9125fb58`
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
    pub struct VoteDifferentialReturn(pub ::ethers::core::types::U256);

    ///Container type for all return fields from the `VOTING_DURATION` function with signature `VOTING_DURATION()` and selector `0xa438d208`
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
    pub struct VotingDurationReturn(pub ::ethers::core::types::U256);

    ///Container type for all return fields from the `cancelTransaction` function with signature `cancelTransaction(address,uint256,string,bytes,uint256,bool)` and selector `0x1dc40b51`
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
    pub struct CancelTransactionReturn(pub [u8; 32]);

    ///Container type for all return fields from the `executeTransaction` function with signature `executeTransaction(address,uint256,string,bytes,uint256,bool)` and selector `0x8902ab65`
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
    pub struct ExecuteTransactionReturn(pub ::ethers::core::types::Bytes);

    ///Container type for all return fields from the `getAdmin` function with signature `getAdmin()` and selector `0x6e9960c3`
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
    pub struct GetAdminReturn(pub ::ethers::core::types::Address);

    ///Container type for all return fields from the `getDelay` function with signature `getDelay()` and selector `0xcebc9a82`
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
    pub struct GetDelayReturn(pub ::ethers::core::types::U256);

    ///Container type for all return fields from the `getMinimumPropositionPowerNeeded` function with signature `getMinimumPropositionPowerNeeded(address,uint256)` and selector `0xf48cb134`
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
    pub struct GetMinimumPropositionPowerNeededReturn(pub ::ethers::core::types::U256);

    ///Container type for all return fields from the `getMinimumVotingPowerNeeded` function with signature `getMinimumVotingPowerNeeded(uint256)` and selector `0xe50f8400`
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
    pub struct GetMinimumVotingPowerNeededReturn(pub ::ethers::core::types::U256);

    ///Container type for all return fields from the `getPendingAdmin` function with signature `getPendingAdmin()` and selector `0xd0468156`
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
    pub struct GetPendingAdminReturn(pub ::ethers::core::types::Address);

    ///Container type for all return fields from the `isActionQueued` function with signature `isActionQueued(bytes32)` and selector `0xb1fc8796`
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
    pub struct IsActionQueuedReturn(pub bool);

    ///Container type for all return fields from the `isProposalOverGracePeriod` function with signature `isProposalOverGracePeriod(address,uint256)` and selector `0xf670a5f9`
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
    pub struct IsProposalOverGracePeriodReturn(pub bool);

    ///Container type for all return fields from the `isProposalPassed` function with signature `isProposalPassed(address,uint256)` and selector `0x06fbb3ab`
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
    pub struct IsProposalPassedReturn(pub bool);

    ///Container type for all return fields from the `isPropositionPowerEnough` function with signature `isPropositionPowerEnough(address,address,uint256)` and selector `0x66121042`
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
    pub struct IsPropositionPowerEnoughReturn(pub bool);

    ///Container type for all return fields from the `isQuorumValid` function with signature `isQuorumValid(address,uint256)` and selector `0xace43209`
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
    pub struct IsQuorumValidReturn(pub bool);

    ///Container type for all return fields from the `isVoteDifferentialValid` function with signature `isVoteDifferentialValid(address,uint256)` and selector `0x7aa50080`
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
    pub struct IsVoteDifferentialValidReturn(pub bool);

    ///Container type for all return fields from the `queueTransaction` function with signature `queueTransaction(address,uint256,string,bytes,uint256,bool)` and selector `0x8d8fe2e3`
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
    pub struct QueueTransactionReturn(pub [u8; 32]);

    ///Container type for all return fields from the `validateCreatorOfProposal` function with signature `validateCreatorOfProposal(address,address,uint256)` and selector `0xd0d90298`
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
    pub struct ValidateCreatorOfProposalReturn(pub bool);

    ///Container type for all return fields from the `validateProposalCancellation` function with signature `validateProposalCancellation(address,address,uint256)` and selector `0x31a7bc41`
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
    pub struct ValidateProposalCancellationReturn(pub bool);
}
