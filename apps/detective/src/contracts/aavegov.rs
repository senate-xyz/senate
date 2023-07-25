pub use aavegov::*;
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
pub mod aavegov {
    #[rustfmt::skip]
    const __ABI: &str = "[\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"address\",\n        \"name\": \"governanceStrategy\",\n        \"type\": \"address\"\n      },\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"votingDelay\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"internalType\": \"address\",\n        \"name\": \"guardian\",\n        \"type\": \"address\"\n      },\n      {\n        \"internalType\": \"address[]\",\n        \"name\": \"executors\",\n        \"type\": \"address[]\"\n      }\n    ],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"constructor\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"address\",\n        \"name\": \"executor\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"ExecutorAuthorized\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"address\",\n        \"name\": \"executor\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"ExecutorUnauthorized\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"newStrategy\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"initiatorChange\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"GovernanceStrategyChanged\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"previousOwner\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"newOwner\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"OwnershipTransferred\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"id\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"ProposalCanceled\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"id\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"creator\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"contract IExecutorWithTimelock\",\n        \"name\": \"executor\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"address[]\",\n        \"name\": \"targets\",\n        \"type\": \"address[]\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256[]\",\n        \"name\": \"values\",\n        \"type\": \"uint256[]\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"string[]\",\n        \"name\": \"signatures\",\n        \"type\": \"string[]\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"bytes[]\",\n        \"name\": \"calldatas\",\n        \"type\": \"bytes[]\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"bool[]\",\n        \"name\": \"withDelegatecalls\",\n        \"type\": \"bool[]\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"startBlock\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"endBlock\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"address\",\n        \"name\": \"strategy\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"bytes32\",\n        \"name\": \"ipfsHash\",\n        \"type\": \"bytes32\"\n      }\n    ],\n    \"name\": \"ProposalCreated\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"id\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"initiatorExecution\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"ProposalExecuted\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"id\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"executionTime\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"initiatorQueueing\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"ProposalQueued\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"id\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"voter\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"bool\",\n        \"name\": \"support\",\n        \"type\": \"bool\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"votingPower\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"VoteEmitted\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"newVotingDelay\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"initiatorChange\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"VotingDelayChanged\",\n    \"type\": \"event\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"DOMAIN_TYPEHASH\",\n    \"outputs\": [\n      {\n        \"internalType\": \"bytes32\",\n        \"name\": \"\",\n        \"type\": \"bytes32\"\n      }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"NAME\",\n    \"outputs\": [\n      {\n        \"internalType\": \"string\",\n        \"name\": \"\",\n        \"type\": \"string\"\n      }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"VOTE_EMITTED_TYPEHASH\",\n    \"outputs\": [\n      {\n        \"internalType\": \"bytes32\",\n        \"name\": \"\",\n        \"type\": \"bytes32\"\n      }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"__abdicate\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"address[]\",\n        \"name\": \"executors\",\n        \"type\": \"address[]\"\n      }\n    ],\n    \"name\": \"authorizeExecutors\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"proposalId\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"cancel\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"contract IExecutorWithTimelock\",\n        \"name\": \"executor\",\n        \"type\": \"address\"\n      },\n      {\n        \"internalType\": \"address[]\",\n        \"name\": \"targets\",\n        \"type\": \"address[]\"\n      },\n      {\n        \"internalType\": \"uint256[]\",\n        \"name\": \"values\",\n        \"type\": \"uint256[]\"\n      },\n      {\n        \"internalType\": \"string[]\",\n        \"name\": \"signatures\",\n        \"type\": \"string[]\"\n      },\n      {\n        \"internalType\": \"bytes[]\",\n        \"name\": \"calldatas\",\n        \"type\": \"bytes[]\"\n      },\n      {\n        \"internalType\": \"bool[]\",\n        \"name\": \"withDelegatecalls\",\n        \"type\": \"bool[]\"\n      },\n      {\n        \"internalType\": \"bytes32\",\n        \"name\": \"ipfsHash\",\n        \"type\": \"bytes32\"\n      }\n    ],\n    \"name\": \"create\",\n    \"outputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"proposalId\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"execute\",\n    \"outputs\": [],\n    \"stateMutability\": \"payable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"getGovernanceStrategy\",\n    \"outputs\": [\n      {\n        \"internalType\": \"address\",\n        \"name\": \"\",\n        \"type\": \"address\"\n      }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"getGuardian\",\n    \"outputs\": [\n      {\n        \"internalType\": \"address\",\n        \"name\": \"\",\n        \"type\": \"address\"\n      }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"proposalId\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"getProposalById\",\n    \"outputs\": [\n      {\n        \"components\": [\n          {\n            \"internalType\": \"uint256\",\n            \"name\": \"id\",\n            \"type\": \"uint256\"\n          },\n          {\n            \"internalType\": \"address\",\n            \"name\": \"creator\",\n            \"type\": \"address\"\n          },\n          {\n            \"internalType\": \"contract IExecutorWithTimelock\",\n            \"name\": \"executor\",\n            \"type\": \"address\"\n          },\n          {\n            \"internalType\": \"address[]\",\n            \"name\": \"targets\",\n            \"type\": \"address[]\"\n          },\n          {\n            \"internalType\": \"uint256[]\",\n            \"name\": \"values\",\n            \"type\": \"uint256[]\"\n          },\n          {\n            \"internalType\": \"string[]\",\n            \"name\": \"signatures\",\n            \"type\": \"string[]\"\n          },\n          {\n            \"internalType\": \"bytes[]\",\n            \"name\": \"calldatas\",\n            \"type\": \"bytes[]\"\n          },\n          {\n            \"internalType\": \"bool[]\",\n            \"name\": \"withDelegatecalls\",\n            \"type\": \"bool[]\"\n          },\n          {\n            \"internalType\": \"uint256\",\n            \"name\": \"startBlock\",\n            \"type\": \"uint256\"\n          },\n          {\n            \"internalType\": \"uint256\",\n            \"name\": \"endBlock\",\n            \"type\": \"uint256\"\n          },\n          {\n            \"internalType\": \"uint256\",\n            \"name\": \"executionTime\",\n            \"type\": \"uint256\"\n          },\n          {\n            \"internalType\": \"uint256\",\n            \"name\": \"forVotes\",\n            \"type\": \"uint256\"\n          },\n          {\n            \"internalType\": \"uint256\",\n            \"name\": \"againstVotes\",\n            \"type\": \"uint256\"\n          },\n          {\n            \"internalType\": \"bool\",\n            \"name\": \"executed\",\n            \"type\": \"bool\"\n          },\n          {\n            \"internalType\": \"bool\",\n            \"name\": \"canceled\",\n            \"type\": \"bool\"\n          },\n          {\n            \"internalType\": \"address\",\n            \"name\": \"strategy\",\n            \"type\": \"address\"\n          },\n          {\n            \"internalType\": \"bytes32\",\n            \"name\": \"ipfsHash\",\n            \"type\": \"bytes32\"\n          }\n        ],\n        \"internalType\": \"struct IAaveGovernanceV2.ProposalWithoutVotes\",\n        \"name\": \"\",\n        \"type\": \"tuple\"\n      }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"proposalId\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"getProposalState\",\n    \"outputs\": [\n      {\n        \"internalType\": \"enum IAaveGovernanceV2.ProposalState\",\n        \"name\": \"\",\n        \"type\": \"uint8\"\n      }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"getProposalsCount\",\n    \"outputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"proposalId\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"internalType\": \"address\",\n        \"name\": \"voter\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"getVoteOnProposal\",\n    \"outputs\": [\n      {\n        \"components\": [\n          {\n            \"internalType\": \"bool\",\n            \"name\": \"support\",\n            \"type\": \"bool\"\n          },\n          {\n            \"internalType\": \"uint248\",\n            \"name\": \"votingPower\",\n            \"type\": \"uint248\"\n          }\n        ],\n        \"internalType\": \"struct IAaveGovernanceV2.Vote\",\n        \"name\": \"\",\n        \"type\": \"tuple\"\n      }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"getVotingDelay\",\n    \"outputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"address\",\n        \"name\": \"executor\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"isExecutorAuthorized\",\n    \"outputs\": [\n      {\n        \"internalType\": \"bool\",\n        \"name\": \"\",\n        \"type\": \"bool\"\n      }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"owner\",\n    \"outputs\": [\n      {\n        \"internalType\": \"address\",\n        \"name\": \"\",\n        \"type\": \"address\"\n      }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"proposalId\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"queue\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"renounceOwnership\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"address\",\n        \"name\": \"governanceStrategy\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"setGovernanceStrategy\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"votingDelay\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"setVotingDelay\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"proposalId\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"internalType\": \"bool\",\n        \"name\": \"support\",\n        \"type\": \"bool\"\n      }\n    ],\n    \"name\": \"submitVote\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"proposalId\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"internalType\": \"bool\",\n        \"name\": \"support\",\n        \"type\": \"bool\"\n      },\n      {\n        \"internalType\": \"uint8\",\n        \"name\": \"v\",\n        \"type\": \"uint8\"\n      },\n      {\n        \"internalType\": \"bytes32\",\n        \"name\": \"r\",\n        \"type\": \"bytes32\"\n      },\n      {\n        \"internalType\": \"bytes32\",\n        \"name\": \"s\",\n        \"type\": \"bytes32\"\n      }\n    ],\n    \"name\": \"submitVoteBySignature\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"address\",\n        \"name\": \"newOwner\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"transferOwnership\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"address[]\",\n        \"name\": \"executors\",\n        \"type\": \"address[]\"\n      }\n    ],\n    \"name\": \"unauthorizeExecutors\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  }\n]";
    ///The parsed JSON ABI of the contract.
    pub static AAVEGOV_ABI: ::ethers::contract::Lazy<::ethers::core::abi::Abi> = ::ethers::contract::Lazy::new(||
    ::ethers::core::utils::__serde_json::from_str(__ABI).expect("ABI is always valid"));
    pub struct aavegov<M>(::ethers::contract::Contract<M>);
    impl<M> ::core::clone::Clone for aavegov<M> {
        fn clone(&self) -> Self {
            Self(::core::clone::Clone::clone(&self.0))
        }
    }
    impl<M> ::core::ops::Deref for aavegov<M> {
        type Target = ::ethers::contract::Contract<M>;
        fn deref(&self) -> &Self::Target {
            &self.0
        }
    }
    impl<M> ::core::ops::DerefMut for aavegov<M> {
        fn deref_mut(&mut self) -> &mut Self::Target {
            &mut self.0
        }
    }
    impl<M> ::core::fmt::Debug for aavegov<M> {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            f.debug_tuple(stringify!(aavegov)).field(&self.address()).finish()
        }
    }
    impl<M: ::ethers::providers::Middleware> aavegov<M> {
        /// Creates a new contract instance with the specified `ethers` client at
        /// `address`. The contract derefs to a `ethers::Contract` object.
        pub fn new<T: Into<::ethers::core::types::Address>>(
            address: T,
            client: ::std::sync::Arc<M>,
        ) -> Self {
            Self(
                ::ethers::contract::Contract::new(
                    address.into(),
                    AAVEGOV_ABI.clone(),
                    client,
                ),
            )
        }
        ///Calls the contract's `DOMAIN_TYPEHASH` (0x20606b70) function
        pub fn domain_typehash(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, [u8; 32]> {
            self.0
                .method_hash([32, 96, 107, 112], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `NAME` (0xa3f4df7e) function
        pub fn name(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::std::string::String> {
            self.0
                .method_hash([163, 244, 223, 126], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `VOTE_EMITTED_TYPEHASH` (0x34b18c26) function
        pub fn vote_emitted_typehash(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, [u8; 32]> {
            self.0
                .method_hash([52, 177, 140, 38], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `__abdicate` (0x760fbc13) function
        pub fn abdicate(&self) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([118, 15, 188, 19], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `authorizeExecutors` (0x64c786d9) function
        pub fn authorize_executors(
            &self,
            executors: ::std::vec::Vec<::ethers::core::types::Address>,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([100, 199, 134, 217], executors)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `cancel` (0x40e58ee5) function
        pub fn cancel(
            &self,
            proposal_id: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([64, 229, 142, 229], proposal_id)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `create` (0xf8741a9c) function
        pub fn create(
            &self,
            executor: ::ethers::core::types::Address,
            targets: ::std::vec::Vec<::ethers::core::types::Address>,
            values: ::std::vec::Vec<::ethers::core::types::U256>,
            signatures: ::std::vec::Vec<::std::string::String>,
            calldatas: ::std::vec::Vec<::ethers::core::types::Bytes>,
            with_delegatecalls: ::std::vec::Vec<bool>,
            ipfs_hash: [u8; 32],
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash(
                    [248, 116, 26, 156],
                    (
                        executor,
                        targets,
                        values,
                        signatures,
                        calldatas,
                        with_delegatecalls,
                        ipfs_hash,
                    ),
                )
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `execute` (0xfe0d94c1) function
        pub fn execute(
            &self,
            proposal_id: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([254, 13, 148, 193], proposal_id)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getGovernanceStrategy` (0x06be3e8e) function
        pub fn get_governance_strategy(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<
            M,
            ::ethers::core::types::Address,
        > {
            self.0
                .method_hash([6, 190, 62, 142], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getGuardian` (0xa75b87d2) function
        pub fn get_guardian(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<
            M,
            ::ethers::core::types::Address,
        > {
            self.0
                .method_hash([167, 91, 135, 210], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getProposalById` (0x3656de21) function
        pub fn get_proposal_by_id(
            &self,
            proposal_id: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ProposalWithoutVotes> {
            self.0
                .method_hash([54, 86, 222, 33], proposal_id)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getProposalState` (0x9080936f) function
        pub fn get_proposal_state(
            &self,
            proposal_id: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, u8> {
            self.0
                .method_hash([144, 128, 147, 111], proposal_id)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getProposalsCount` (0x98e527d3) function
        pub fn get_proposals_count(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([152, 229, 39, 211], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getVoteOnProposal` (0x4185ff83) function
        pub fn get_vote_on_proposal(
            &self,
            proposal_id: ::ethers::core::types::U256,
            voter: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, Vote> {
            self.0
                .method_hash([65, 133, 255, 131], (proposal_id, voter))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getVotingDelay` (0xa2b170b0) function
        pub fn get_voting_delay(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([162, 177, 112, 176], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `isExecutorAuthorized` (0x548b514e) function
        pub fn is_executor_authorized(
            &self,
            executor: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([84, 139, 81, 78], executor)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `owner` (0x8da5cb5b) function
        pub fn owner(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<
            M,
            ::ethers::core::types::Address,
        > {
            self.0
                .method_hash([141, 165, 203, 91], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `queue` (0xddf0b009) function
        pub fn queue(
            &self,
            proposal_id: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([221, 240, 176, 9], proposal_id)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `renounceOwnership` (0x715018a6) function
        pub fn renounce_ownership(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([113, 80, 24, 166], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `setGovernanceStrategy` (0x9aad6f6a) function
        pub fn set_governance_strategy(
            &self,
            governance_strategy: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([154, 173, 111, 106], governance_strategy)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `setVotingDelay` (0x70b0f660) function
        pub fn set_voting_delay(
            &self,
            voting_delay: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([112, 176, 246, 96], voting_delay)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `submitVote` (0x612c56fa) function
        pub fn submit_vote(
            &self,
            proposal_id: ::ethers::core::types::U256,
            support: bool,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([97, 44, 86, 250], (proposal_id, support))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `submitVoteBySignature` (0xaf1e0bd3) function
        pub fn submit_vote_by_signature(
            &self,
            proposal_id: ::ethers::core::types::U256,
            support: bool,
            v: u8,
            r: [u8; 32],
            s: [u8; 32],
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([175, 30, 11, 211], (proposal_id, support, v, r, s))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `transferOwnership` (0xf2fde38b) function
        pub fn transfer_ownership(
            &self,
            new_owner: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([242, 253, 227, 139], new_owner)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `unauthorizeExecutors` (0x1a1caf7f) function
        pub fn unauthorize_executors(
            &self,
            executors: ::std::vec::Vec<::ethers::core::types::Address>,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([26, 28, 175, 127], executors)
                .expect("method not found (this should never happen)")
        }
        ///Gets the contract's `ExecutorAuthorized` event
        pub fn executor_authorized_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            ExecutorAuthorizedFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `ExecutorUnauthorized` event
        pub fn executor_unauthorized_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            ExecutorUnauthorizedFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `GovernanceStrategyChanged` event
        pub fn governance_strategy_changed_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            GovernanceStrategyChangedFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `OwnershipTransferred` event
        pub fn ownership_transferred_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            OwnershipTransferredFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `ProposalCanceled` event
        pub fn proposal_canceled_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            ProposalCanceledFilter,
        > {
            self.0.event()
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
        ///Gets the contract's `ProposalQueued` event
        pub fn proposal_queued_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            ProposalQueuedFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `VoteEmitted` event
        pub fn vote_emitted_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            VoteEmittedFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `VotingDelayChanged` event
        pub fn voting_delay_changed_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            VotingDelayChangedFilter,
        > {
            self.0.event()
        }
        /// Returns an `Event` builder for all the events of this contract.
        pub fn events(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, aavegovEvents> {
            self.0.event_with_filter(::core::default::Default::default())
        }
    }
    impl<M: ::ethers::providers::Middleware> From<::ethers::contract::Contract<M>>
    for aavegov<M> {
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
    #[ethevent(name = "ExecutorAuthorized", abi = "ExecutorAuthorized(address)")]
    pub struct ExecutorAuthorizedFilter {
        pub executor: ::ethers::core::types::Address,
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
    #[ethevent(name = "ExecutorUnauthorized", abi = "ExecutorUnauthorized(address)")]
    pub struct ExecutorUnauthorizedFilter {
        pub executor: ::ethers::core::types::Address,
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
        name = "GovernanceStrategyChanged",
        abi = "GovernanceStrategyChanged(address,address)"
    )]
    pub struct GovernanceStrategyChangedFilter {
        #[ethevent(indexed)]
        pub new_strategy: ::ethers::core::types::Address,
        #[ethevent(indexed)]
        pub initiator_change: ::ethers::core::types::Address,
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
        name = "OwnershipTransferred",
        abi = "OwnershipTransferred(address,address)"
    )]
    pub struct OwnershipTransferredFilter {
        #[ethevent(indexed)]
        pub previous_owner: ::ethers::core::types::Address,
        #[ethevent(indexed)]
        pub new_owner: ::ethers::core::types::Address,
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
    #[ethevent(name = "ProposalCanceled", abi = "ProposalCanceled(uint256)")]
    pub struct ProposalCanceledFilter {
        pub id: ::ethers::core::types::U256,
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
        abi = "ProposalCreated(uint256,address,address,address[],uint256[],string[],bytes[],bool[],uint256,uint256,address,bytes32)"
    )]
    pub struct ProposalCreatedFilter {
        pub id: ::ethers::core::types::U256,
        #[ethevent(indexed)]
        pub creator: ::ethers::core::types::Address,
        #[ethevent(indexed)]
        pub executor: ::ethers::core::types::Address,
        pub targets: ::std::vec::Vec<::ethers::core::types::Address>,
        pub values: ::std::vec::Vec<::ethers::core::types::U256>,
        pub signatures: ::std::vec::Vec<::std::string::String>,
        pub calldatas: ::std::vec::Vec<::ethers::core::types::Bytes>,
        pub with_delegatecalls: ::std::vec::Vec<bool>,
        pub start_block: ::ethers::core::types::U256,
        pub end_block: ::ethers::core::types::U256,
        pub strategy: ::ethers::core::types::Address,
        pub ipfs_hash: [u8; 32],
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
    #[ethevent(name = "ProposalExecuted", abi = "ProposalExecuted(uint256,address)")]
    pub struct ProposalExecutedFilter {
        pub id: ::ethers::core::types::U256,
        #[ethevent(indexed)]
        pub initiator_execution: ::ethers::core::types::Address,
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
    #[ethevent(name = "ProposalQueued", abi = "ProposalQueued(uint256,uint256,address)")]
    pub struct ProposalQueuedFilter {
        pub id: ::ethers::core::types::U256,
        pub execution_time: ::ethers::core::types::U256,
        #[ethevent(indexed)]
        pub initiator_queueing: ::ethers::core::types::Address,
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
    #[ethevent(name = "VoteEmitted", abi = "VoteEmitted(uint256,address,bool,uint256)")]
    pub struct VoteEmittedFilter {
        pub id: ::ethers::core::types::U256,
        #[ethevent(indexed)]
        pub voter: ::ethers::core::types::Address,
        pub support: bool,
        pub voting_power: ::ethers::core::types::U256,
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
    #[ethevent(name = "VotingDelayChanged", abi = "VotingDelayChanged(uint256,address)")]
    pub struct VotingDelayChangedFilter {
        pub new_voting_delay: ::ethers::core::types::U256,
        #[ethevent(indexed)]
        pub initiator_change: ::ethers::core::types::Address,
    }
    ///Container type for all of the contract's events
    #[derive(Clone, ::ethers::contract::EthAbiType, Debug, PartialEq, Eq, Hash)]
    pub enum aavegovEvents {
        ExecutorAuthorizedFilter(ExecutorAuthorizedFilter),
        ExecutorUnauthorizedFilter(ExecutorUnauthorizedFilter),
        GovernanceStrategyChangedFilter(GovernanceStrategyChangedFilter),
        OwnershipTransferredFilter(OwnershipTransferredFilter),
        ProposalCanceledFilter(ProposalCanceledFilter),
        ProposalCreatedFilter(ProposalCreatedFilter),
        ProposalExecutedFilter(ProposalExecutedFilter),
        ProposalQueuedFilter(ProposalQueuedFilter),
        VoteEmittedFilter(VoteEmittedFilter),
        VotingDelayChangedFilter(VotingDelayChangedFilter),
    }
    impl ::ethers::contract::EthLogDecode for aavegovEvents {
        fn decode_log(
            log: &::ethers::core::abi::RawLog,
        ) -> ::core::result::Result<Self, ::ethers::core::abi::Error> {
            if let Ok(decoded) = ExecutorAuthorizedFilter::decode_log(log) {
                return Ok(aavegovEvents::ExecutorAuthorizedFilter(decoded));
            }
            if let Ok(decoded) = ExecutorUnauthorizedFilter::decode_log(log) {
                return Ok(aavegovEvents::ExecutorUnauthorizedFilter(decoded));
            }
            if let Ok(decoded) = GovernanceStrategyChangedFilter::decode_log(log) {
                return Ok(aavegovEvents::GovernanceStrategyChangedFilter(decoded));
            }
            if let Ok(decoded) = OwnershipTransferredFilter::decode_log(log) {
                return Ok(aavegovEvents::OwnershipTransferredFilter(decoded));
            }
            if let Ok(decoded) = ProposalCanceledFilter::decode_log(log) {
                return Ok(aavegovEvents::ProposalCanceledFilter(decoded));
            }
            if let Ok(decoded) = ProposalCreatedFilter::decode_log(log) {
                return Ok(aavegovEvents::ProposalCreatedFilter(decoded));
            }
            if let Ok(decoded) = ProposalExecutedFilter::decode_log(log) {
                return Ok(aavegovEvents::ProposalExecutedFilter(decoded));
            }
            if let Ok(decoded) = ProposalQueuedFilter::decode_log(log) {
                return Ok(aavegovEvents::ProposalQueuedFilter(decoded));
            }
            if let Ok(decoded) = VoteEmittedFilter::decode_log(log) {
                return Ok(aavegovEvents::VoteEmittedFilter(decoded));
            }
            if let Ok(decoded) = VotingDelayChangedFilter::decode_log(log) {
                return Ok(aavegovEvents::VotingDelayChangedFilter(decoded));
            }
            Err(::ethers::core::abi::Error::InvalidData)
        }
    }
    impl ::core::fmt::Display for aavegovEvents {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            match self {
                Self::ExecutorAuthorizedFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::ExecutorUnauthorizedFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::GovernanceStrategyChangedFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::OwnershipTransferredFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::ProposalCanceledFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::ProposalCreatedFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::ProposalExecutedFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::ProposalQueuedFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::VoteEmittedFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::VotingDelayChangedFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
            }
        }
    }
    impl ::core::convert::From<ExecutorAuthorizedFilter> for aavegovEvents {
        fn from(value: ExecutorAuthorizedFilter) -> Self {
            Self::ExecutorAuthorizedFilter(value)
        }
    }
    impl ::core::convert::From<ExecutorUnauthorizedFilter> for aavegovEvents {
        fn from(value: ExecutorUnauthorizedFilter) -> Self {
            Self::ExecutorUnauthorizedFilter(value)
        }
    }
    impl ::core::convert::From<GovernanceStrategyChangedFilter> for aavegovEvents {
        fn from(value: GovernanceStrategyChangedFilter) -> Self {
            Self::GovernanceStrategyChangedFilter(value)
        }
    }
    impl ::core::convert::From<OwnershipTransferredFilter> for aavegovEvents {
        fn from(value: OwnershipTransferredFilter) -> Self {
            Self::OwnershipTransferredFilter(value)
        }
    }
    impl ::core::convert::From<ProposalCanceledFilter> for aavegovEvents {
        fn from(value: ProposalCanceledFilter) -> Self {
            Self::ProposalCanceledFilter(value)
        }
    }
    impl ::core::convert::From<ProposalCreatedFilter> for aavegovEvents {
        fn from(value: ProposalCreatedFilter) -> Self {
            Self::ProposalCreatedFilter(value)
        }
    }
    impl ::core::convert::From<ProposalExecutedFilter> for aavegovEvents {
        fn from(value: ProposalExecutedFilter) -> Self {
            Self::ProposalExecutedFilter(value)
        }
    }
    impl ::core::convert::From<ProposalQueuedFilter> for aavegovEvents {
        fn from(value: ProposalQueuedFilter) -> Self {
            Self::ProposalQueuedFilter(value)
        }
    }
    impl ::core::convert::From<VoteEmittedFilter> for aavegovEvents {
        fn from(value: VoteEmittedFilter) -> Self {
            Self::VoteEmittedFilter(value)
        }
    }
    impl ::core::convert::From<VotingDelayChangedFilter> for aavegovEvents {
        fn from(value: VotingDelayChangedFilter) -> Self {
            Self::VotingDelayChangedFilter(value)
        }
    }
    ///Container type for all input parameters for the `DOMAIN_TYPEHASH` function with signature `DOMAIN_TYPEHASH()` and selector `0x20606b70`
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
    #[ethcall(name = "DOMAIN_TYPEHASH", abi = "DOMAIN_TYPEHASH()")]
    pub struct DomainTypehashCall;
    ///Container type for all input parameters for the `NAME` function with signature `NAME()` and selector `0xa3f4df7e`
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
    #[ethcall(name = "NAME", abi = "NAME()")]
    pub struct NameCall;
    ///Container type for all input parameters for the `VOTE_EMITTED_TYPEHASH` function with signature `VOTE_EMITTED_TYPEHASH()` and selector `0x34b18c26`
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
    #[ethcall(name = "VOTE_EMITTED_TYPEHASH", abi = "VOTE_EMITTED_TYPEHASH()")]
    pub struct VoteEmittedTypehashCall;
    ///Container type for all input parameters for the `__abdicate` function with signature `__abdicate()` and selector `0x760fbc13`
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
    #[ethcall(name = "__abdicate", abi = "__abdicate()")]
    pub struct AbdicateCall;
    ///Container type for all input parameters for the `authorizeExecutors` function with signature `authorizeExecutors(address[])` and selector `0x64c786d9`
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
    #[ethcall(name = "authorizeExecutors", abi = "authorizeExecutors(address[])")]
    pub struct AuthorizeExecutorsCall {
        pub executors: ::std::vec::Vec<::ethers::core::types::Address>,
    }
    ///Container type for all input parameters for the `cancel` function with signature `cancel(uint256)` and selector `0x40e58ee5`
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
    #[ethcall(name = "cancel", abi = "cancel(uint256)")]
    pub struct CancelCall {
        pub proposal_id: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `create` function with signature `create(address,address[],uint256[],string[],bytes[],bool[],bytes32)` and selector `0xf8741a9c`
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
        name = "create",
        abi = "create(address,address[],uint256[],string[],bytes[],bool[],bytes32)"
    )]
    pub struct CreateCall {
        pub executor: ::ethers::core::types::Address,
        pub targets: ::std::vec::Vec<::ethers::core::types::Address>,
        pub values: ::std::vec::Vec<::ethers::core::types::U256>,
        pub signatures: ::std::vec::Vec<::std::string::String>,
        pub calldatas: ::std::vec::Vec<::ethers::core::types::Bytes>,
        pub with_delegatecalls: ::std::vec::Vec<bool>,
        pub ipfs_hash: [u8; 32],
    }
    ///Container type for all input parameters for the `execute` function with signature `execute(uint256)` and selector `0xfe0d94c1`
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
    #[ethcall(name = "execute", abi = "execute(uint256)")]
    pub struct ExecuteCall {
        pub proposal_id: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `getGovernanceStrategy` function with signature `getGovernanceStrategy()` and selector `0x06be3e8e`
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
    #[ethcall(name = "getGovernanceStrategy", abi = "getGovernanceStrategy()")]
    pub struct GetGovernanceStrategyCall;
    ///Container type for all input parameters for the `getGuardian` function with signature `getGuardian()` and selector `0xa75b87d2`
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
    #[ethcall(name = "getGuardian", abi = "getGuardian()")]
    pub struct GetGuardianCall;
    ///Container type for all input parameters for the `getProposalById` function with signature `getProposalById(uint256)` and selector `0x3656de21`
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
    #[ethcall(name = "getProposalById", abi = "getProposalById(uint256)")]
    pub struct GetProposalByIdCall {
        pub proposal_id: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `getProposalState` function with signature `getProposalState(uint256)` and selector `0x9080936f`
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
    #[ethcall(name = "getProposalState", abi = "getProposalState(uint256)")]
    pub struct GetProposalStateCall {
        pub proposal_id: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `getProposalsCount` function with signature `getProposalsCount()` and selector `0x98e527d3`
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
    #[ethcall(name = "getProposalsCount", abi = "getProposalsCount()")]
    pub struct GetProposalsCountCall;
    ///Container type for all input parameters for the `getVoteOnProposal` function with signature `getVoteOnProposal(uint256,address)` and selector `0x4185ff83`
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
    #[ethcall(name = "getVoteOnProposal", abi = "getVoteOnProposal(uint256,address)")]
    pub struct GetVoteOnProposalCall {
        pub proposal_id: ::ethers::core::types::U256,
        pub voter: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `getVotingDelay` function with signature `getVotingDelay()` and selector `0xa2b170b0`
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
    #[ethcall(name = "getVotingDelay", abi = "getVotingDelay()")]
    pub struct GetVotingDelayCall;
    ///Container type for all input parameters for the `isExecutorAuthorized` function with signature `isExecutorAuthorized(address)` and selector `0x548b514e`
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
    #[ethcall(name = "isExecutorAuthorized", abi = "isExecutorAuthorized(address)")]
    pub struct IsExecutorAuthorizedCall {
        pub executor: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `owner` function with signature `owner()` and selector `0x8da5cb5b`
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
    #[ethcall(name = "owner", abi = "owner()")]
    pub struct OwnerCall;
    ///Container type for all input parameters for the `queue` function with signature `queue(uint256)` and selector `0xddf0b009`
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
    #[ethcall(name = "queue", abi = "queue(uint256)")]
    pub struct QueueCall {
        pub proposal_id: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `renounceOwnership` function with signature `renounceOwnership()` and selector `0x715018a6`
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
    #[ethcall(name = "renounceOwnership", abi = "renounceOwnership()")]
    pub struct RenounceOwnershipCall;
    ///Container type for all input parameters for the `setGovernanceStrategy` function with signature `setGovernanceStrategy(address)` and selector `0x9aad6f6a`
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
    #[ethcall(name = "setGovernanceStrategy", abi = "setGovernanceStrategy(address)")]
    pub struct SetGovernanceStrategyCall {
        pub governance_strategy: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `setVotingDelay` function with signature `setVotingDelay(uint256)` and selector `0x70b0f660`
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
    #[ethcall(name = "setVotingDelay", abi = "setVotingDelay(uint256)")]
    pub struct SetVotingDelayCall {
        pub voting_delay: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `submitVote` function with signature `submitVote(uint256,bool)` and selector `0x612c56fa`
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
    #[ethcall(name = "submitVote", abi = "submitVote(uint256,bool)")]
    pub struct SubmitVoteCall {
        pub proposal_id: ::ethers::core::types::U256,
        pub support: bool,
    }
    ///Container type for all input parameters for the `submitVoteBySignature` function with signature `submitVoteBySignature(uint256,bool,uint8,bytes32,bytes32)` and selector `0xaf1e0bd3`
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
        name = "submitVoteBySignature",
        abi = "submitVoteBySignature(uint256,bool,uint8,bytes32,bytes32)"
    )]
    pub struct SubmitVoteBySignatureCall {
        pub proposal_id: ::ethers::core::types::U256,
        pub support: bool,
        pub v: u8,
        pub r: [u8; 32],
        pub s: [u8; 32],
    }
    ///Container type for all input parameters for the `transferOwnership` function with signature `transferOwnership(address)` and selector `0xf2fde38b`
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
    #[ethcall(name = "transferOwnership", abi = "transferOwnership(address)")]
    pub struct TransferOwnershipCall {
        pub new_owner: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `unauthorizeExecutors` function with signature `unauthorizeExecutors(address[])` and selector `0x1a1caf7f`
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
    #[ethcall(name = "unauthorizeExecutors", abi = "unauthorizeExecutors(address[])")]
    pub struct UnauthorizeExecutorsCall {
        pub executors: ::std::vec::Vec<::ethers::core::types::Address>,
    }
    ///Container type for all of the contract's call
    #[derive(Clone, ::ethers::contract::EthAbiType, Debug, PartialEq, Eq, Hash)]
    pub enum aavegovCalls {
        DomainTypehash(DomainTypehashCall),
        Name(NameCall),
        VoteEmittedTypehash(VoteEmittedTypehashCall),
        Abdicate(AbdicateCall),
        AuthorizeExecutors(AuthorizeExecutorsCall),
        Cancel(CancelCall),
        Create(CreateCall),
        Execute(ExecuteCall),
        GetGovernanceStrategy(GetGovernanceStrategyCall),
        GetGuardian(GetGuardianCall),
        GetProposalById(GetProposalByIdCall),
        GetProposalState(GetProposalStateCall),
        GetProposalsCount(GetProposalsCountCall),
        GetVoteOnProposal(GetVoteOnProposalCall),
        GetVotingDelay(GetVotingDelayCall),
        IsExecutorAuthorized(IsExecutorAuthorizedCall),
        Owner(OwnerCall),
        Queue(QueueCall),
        RenounceOwnership(RenounceOwnershipCall),
        SetGovernanceStrategy(SetGovernanceStrategyCall),
        SetVotingDelay(SetVotingDelayCall),
        SubmitVote(SubmitVoteCall),
        SubmitVoteBySignature(SubmitVoteBySignatureCall),
        TransferOwnership(TransferOwnershipCall),
        UnauthorizeExecutors(UnauthorizeExecutorsCall),
    }
    impl ::ethers::core::abi::AbiDecode for aavegovCalls {
        fn decode(
            data: impl AsRef<[u8]>,
        ) -> ::core::result::Result<Self, ::ethers::core::abi::AbiError> {
            let data = data.as_ref();
            if let Ok(decoded)
                = <DomainTypehashCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::DomainTypehash(decoded));
            }
            if let Ok(decoded)
                = <NameCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Name(decoded));
            }
            if let Ok(decoded)
                = <VoteEmittedTypehashCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::VoteEmittedTypehash(decoded));
            }
            if let Ok(decoded)
                = <AbdicateCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Abdicate(decoded));
            }
            if let Ok(decoded)
                = <AuthorizeExecutorsCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::AuthorizeExecutors(decoded));
            }
            if let Ok(decoded)
                = <CancelCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Cancel(decoded));
            }
            if let Ok(decoded)
                = <CreateCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Create(decoded));
            }
            if let Ok(decoded)
                = <ExecuteCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Execute(decoded));
            }
            if let Ok(decoded)
                = <GetGovernanceStrategyCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::GetGovernanceStrategy(decoded));
            }
            if let Ok(decoded)
                = <GetGuardianCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::GetGuardian(decoded));
            }
            if let Ok(decoded)
                = <GetProposalByIdCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::GetProposalById(decoded));
            }
            if let Ok(decoded)
                = <GetProposalStateCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::GetProposalState(decoded));
            }
            if let Ok(decoded)
                = <GetProposalsCountCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::GetProposalsCount(decoded));
            }
            if let Ok(decoded)
                = <GetVoteOnProposalCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::GetVoteOnProposal(decoded));
            }
            if let Ok(decoded)
                = <GetVotingDelayCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::GetVotingDelay(decoded));
            }
            if let Ok(decoded)
                = <IsExecutorAuthorizedCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::IsExecutorAuthorized(decoded));
            }
            if let Ok(decoded)
                = <OwnerCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Owner(decoded));
            }
            if let Ok(decoded)
                = <QueueCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Queue(decoded));
            }
            if let Ok(decoded)
                = <RenounceOwnershipCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::RenounceOwnership(decoded));
            }
            if let Ok(decoded)
                = <SetGovernanceStrategyCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::SetGovernanceStrategy(decoded));
            }
            if let Ok(decoded)
                = <SetVotingDelayCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::SetVotingDelay(decoded));
            }
            if let Ok(decoded)
                = <SubmitVoteCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::SubmitVote(decoded));
            }
            if let Ok(decoded)
                = <SubmitVoteBySignatureCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::SubmitVoteBySignature(decoded));
            }
            if let Ok(decoded)
                = <TransferOwnershipCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::TransferOwnership(decoded));
            }
            if let Ok(decoded)
                = <UnauthorizeExecutorsCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::UnauthorizeExecutors(decoded));
            }
            Err(::ethers::core::abi::Error::InvalidData.into())
        }
    }
    impl ::ethers::core::abi::AbiEncode for aavegovCalls {
        fn encode(self) -> Vec<u8> {
            match self {
                Self::DomainTypehash(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::Name(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::VoteEmittedTypehash(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::Abdicate(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::AuthorizeExecutors(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::Cancel(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::Create(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::Execute(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::GetGovernanceStrategy(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetGuardian(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetProposalById(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetProposalState(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetProposalsCount(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetVoteOnProposal(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetVotingDelay(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::IsExecutorAuthorized(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::Owner(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::Queue(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::RenounceOwnership(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::SetGovernanceStrategy(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::SetVotingDelay(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::SubmitVote(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::SubmitVoteBySignature(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::TransferOwnership(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::UnauthorizeExecutors(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
            }
        }
    }
    impl ::core::fmt::Display for aavegovCalls {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            match self {
                Self::DomainTypehash(element) => ::core::fmt::Display::fmt(element, f),
                Self::Name(element) => ::core::fmt::Display::fmt(element, f),
                Self::VoteEmittedTypehash(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::Abdicate(element) => ::core::fmt::Display::fmt(element, f),
                Self::AuthorizeExecutors(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::Cancel(element) => ::core::fmt::Display::fmt(element, f),
                Self::Create(element) => ::core::fmt::Display::fmt(element, f),
                Self::Execute(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetGovernanceStrategy(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::GetGuardian(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetProposalById(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetProposalState(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetProposalsCount(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetVoteOnProposal(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetVotingDelay(element) => ::core::fmt::Display::fmt(element, f),
                Self::IsExecutorAuthorized(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::Owner(element) => ::core::fmt::Display::fmt(element, f),
                Self::Queue(element) => ::core::fmt::Display::fmt(element, f),
                Self::RenounceOwnership(element) => ::core::fmt::Display::fmt(element, f),
                Self::SetGovernanceStrategy(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::SetVotingDelay(element) => ::core::fmt::Display::fmt(element, f),
                Self::SubmitVote(element) => ::core::fmt::Display::fmt(element, f),
                Self::SubmitVoteBySignature(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::TransferOwnership(element) => ::core::fmt::Display::fmt(element, f),
                Self::UnauthorizeExecutors(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
            }
        }
    }
    impl ::core::convert::From<DomainTypehashCall> for aavegovCalls {
        fn from(value: DomainTypehashCall) -> Self {
            Self::DomainTypehash(value)
        }
    }
    impl ::core::convert::From<NameCall> for aavegovCalls {
        fn from(value: NameCall) -> Self {
            Self::Name(value)
        }
    }
    impl ::core::convert::From<VoteEmittedTypehashCall> for aavegovCalls {
        fn from(value: VoteEmittedTypehashCall) -> Self {
            Self::VoteEmittedTypehash(value)
        }
    }
    impl ::core::convert::From<AbdicateCall> for aavegovCalls {
        fn from(value: AbdicateCall) -> Self {
            Self::Abdicate(value)
        }
    }
    impl ::core::convert::From<AuthorizeExecutorsCall> for aavegovCalls {
        fn from(value: AuthorizeExecutorsCall) -> Self {
            Self::AuthorizeExecutors(value)
        }
    }
    impl ::core::convert::From<CancelCall> for aavegovCalls {
        fn from(value: CancelCall) -> Self {
            Self::Cancel(value)
        }
    }
    impl ::core::convert::From<CreateCall> for aavegovCalls {
        fn from(value: CreateCall) -> Self {
            Self::Create(value)
        }
    }
    impl ::core::convert::From<ExecuteCall> for aavegovCalls {
        fn from(value: ExecuteCall) -> Self {
            Self::Execute(value)
        }
    }
    impl ::core::convert::From<GetGovernanceStrategyCall> for aavegovCalls {
        fn from(value: GetGovernanceStrategyCall) -> Self {
            Self::GetGovernanceStrategy(value)
        }
    }
    impl ::core::convert::From<GetGuardianCall> for aavegovCalls {
        fn from(value: GetGuardianCall) -> Self {
            Self::GetGuardian(value)
        }
    }
    impl ::core::convert::From<GetProposalByIdCall> for aavegovCalls {
        fn from(value: GetProposalByIdCall) -> Self {
            Self::GetProposalById(value)
        }
    }
    impl ::core::convert::From<GetProposalStateCall> for aavegovCalls {
        fn from(value: GetProposalStateCall) -> Self {
            Self::GetProposalState(value)
        }
    }
    impl ::core::convert::From<GetProposalsCountCall> for aavegovCalls {
        fn from(value: GetProposalsCountCall) -> Self {
            Self::GetProposalsCount(value)
        }
    }
    impl ::core::convert::From<GetVoteOnProposalCall> for aavegovCalls {
        fn from(value: GetVoteOnProposalCall) -> Self {
            Self::GetVoteOnProposal(value)
        }
    }
    impl ::core::convert::From<GetVotingDelayCall> for aavegovCalls {
        fn from(value: GetVotingDelayCall) -> Self {
            Self::GetVotingDelay(value)
        }
    }
    impl ::core::convert::From<IsExecutorAuthorizedCall> for aavegovCalls {
        fn from(value: IsExecutorAuthorizedCall) -> Self {
            Self::IsExecutorAuthorized(value)
        }
    }
    impl ::core::convert::From<OwnerCall> for aavegovCalls {
        fn from(value: OwnerCall) -> Self {
            Self::Owner(value)
        }
    }
    impl ::core::convert::From<QueueCall> for aavegovCalls {
        fn from(value: QueueCall) -> Self {
            Self::Queue(value)
        }
    }
    impl ::core::convert::From<RenounceOwnershipCall> for aavegovCalls {
        fn from(value: RenounceOwnershipCall) -> Self {
            Self::RenounceOwnership(value)
        }
    }
    impl ::core::convert::From<SetGovernanceStrategyCall> for aavegovCalls {
        fn from(value: SetGovernanceStrategyCall) -> Self {
            Self::SetGovernanceStrategy(value)
        }
    }
    impl ::core::convert::From<SetVotingDelayCall> for aavegovCalls {
        fn from(value: SetVotingDelayCall) -> Self {
            Self::SetVotingDelay(value)
        }
    }
    impl ::core::convert::From<SubmitVoteCall> for aavegovCalls {
        fn from(value: SubmitVoteCall) -> Self {
            Self::SubmitVote(value)
        }
    }
    impl ::core::convert::From<SubmitVoteBySignatureCall> for aavegovCalls {
        fn from(value: SubmitVoteBySignatureCall) -> Self {
            Self::SubmitVoteBySignature(value)
        }
    }
    impl ::core::convert::From<TransferOwnershipCall> for aavegovCalls {
        fn from(value: TransferOwnershipCall) -> Self {
            Self::TransferOwnership(value)
        }
    }
    impl ::core::convert::From<UnauthorizeExecutorsCall> for aavegovCalls {
        fn from(value: UnauthorizeExecutorsCall) -> Self {
            Self::UnauthorizeExecutors(value)
        }
    }
    ///Container type for all return fields from the `DOMAIN_TYPEHASH` function with signature `DOMAIN_TYPEHASH()` and selector `0x20606b70`
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
    pub struct DomainTypehashReturn(pub [u8; 32]);
    ///Container type for all return fields from the `NAME` function with signature `NAME()` and selector `0xa3f4df7e`
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
    ///Container type for all return fields from the `VOTE_EMITTED_TYPEHASH` function with signature `VOTE_EMITTED_TYPEHASH()` and selector `0x34b18c26`
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
    pub struct VoteEmittedTypehashReturn(pub [u8; 32]);
    ///Container type for all return fields from the `create` function with signature `create(address,address[],uint256[],string[],bytes[],bool[],bytes32)` and selector `0xf8741a9c`
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
    pub struct CreateReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `getGovernanceStrategy` function with signature `getGovernanceStrategy()` and selector `0x06be3e8e`
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
    pub struct GetGovernanceStrategyReturn(pub ::ethers::core::types::Address);
    ///Container type for all return fields from the `getGuardian` function with signature `getGuardian()` and selector `0xa75b87d2`
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
    pub struct GetGuardianReturn(pub ::ethers::core::types::Address);
    ///Container type for all return fields from the `getProposalById` function with signature `getProposalById(uint256)` and selector `0x3656de21`
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
    pub struct GetProposalByIdReturn(pub ProposalWithoutVotes);
    ///Container type for all return fields from the `getProposalState` function with signature `getProposalState(uint256)` and selector `0x9080936f`
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
    pub struct GetProposalStateReturn(pub u8);
    ///Container type for all return fields from the `getProposalsCount` function with signature `getProposalsCount()` and selector `0x98e527d3`
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
    pub struct GetProposalsCountReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `getVoteOnProposal` function with signature `getVoteOnProposal(uint256,address)` and selector `0x4185ff83`
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
    pub struct GetVoteOnProposalReturn(pub Vote);
    ///Container type for all return fields from the `getVotingDelay` function with signature `getVotingDelay()` and selector `0xa2b170b0`
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
    pub struct GetVotingDelayReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `isExecutorAuthorized` function with signature `isExecutorAuthorized(address)` and selector `0x548b514e`
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
    pub struct IsExecutorAuthorizedReturn(pub bool);
    ///Container type for all return fields from the `owner` function with signature `owner()` and selector `0x8da5cb5b`
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
    pub struct OwnerReturn(pub ::ethers::core::types::Address);
    ///`ProposalWithoutVotes(uint256,address,address,address[],uint256[],string[],bytes[],bool[],uint256,uint256,uint256,uint256,uint256,bool,bool,address,bytes32)`
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
    pub struct ProposalWithoutVotes {
        pub id: ::ethers::core::types::U256,
        pub creator: ::ethers::core::types::Address,
        pub executor: ::ethers::core::types::Address,
        pub targets: ::std::vec::Vec<::ethers::core::types::Address>,
        pub values: ::std::vec::Vec<::ethers::core::types::U256>,
        pub signatures: ::std::vec::Vec<::std::string::String>,
        pub calldatas: ::std::vec::Vec<::ethers::core::types::Bytes>,
        pub with_delegatecalls: ::std::vec::Vec<bool>,
        pub start_block: ::ethers::core::types::U256,
        pub end_block: ::ethers::core::types::U256,
        pub execution_time: ::ethers::core::types::U256,
        pub for_votes: ::ethers::core::types::U256,
        pub against_votes: ::ethers::core::types::U256,
        pub executed: bool,
        pub canceled: bool,
        pub strategy: ::ethers::core::types::Address,
        pub ipfs_hash: [u8; 32],
    }
    ///`Vote(bool,uint248)`
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
    pub struct Vote {
        pub support: bool,
        pub voting_power: ::ethers::core::types::U256,
    }
}
