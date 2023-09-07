pub use dydxgov::*;
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
pub mod dydxgov {
    #[rustfmt::skip]
    const __ABI: &str = "[\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"address\",\n        \"name\": \"governanceStrategy\",\n        \"type\": \"address\"\n      },\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"votingDelay\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"internalType\": \"address\",\n        \"name\": \"addExecutorAdmin\",\n        \"type\": \"address\"\n      }\n    ],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"constructor\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"address\",\n        \"name\": \"executor\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"ExecutorAuthorized\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"address\",\n        \"name\": \"executor\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"ExecutorUnauthorized\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"newStrategy\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"initiatorChange\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"GovernanceStrategyChanged\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"id\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"ProposalCanceled\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"id\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"creator\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"contract IExecutorWithTimelock\",\n        \"name\": \"executor\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"address[]\",\n        \"name\": \"targets\",\n        \"type\": \"address[]\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256[]\",\n        \"name\": \"values\",\n        \"type\": \"uint256[]\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"string[]\",\n        \"name\": \"signatures\",\n        \"type\": \"string[]\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"bytes[]\",\n        \"name\": \"calldatas\",\n        \"type\": \"bytes[]\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"bool[]\",\n        \"name\": \"withDelegatecalls\",\n        \"type\": \"bool[]\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"startBlock\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"endBlock\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"address\",\n        \"name\": \"strategy\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"bytes32\",\n        \"name\": \"ipfsHash\",\n        \"type\": \"bytes32\"\n      }\n    ],\n    \"name\": \"ProposalCreated\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"id\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"initiatorExecution\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"ProposalExecuted\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"id\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"executionTime\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"initiatorQueueing\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"ProposalQueued\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"bytes32\",\n        \"name\": \"role\",\n        \"type\": \"bytes32\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"bytes32\",\n        \"name\": \"previousAdminRole\",\n        \"type\": \"bytes32\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"bytes32\",\n        \"name\": \"newAdminRole\",\n        \"type\": \"bytes32\"\n      }\n    ],\n    \"name\": \"RoleAdminChanged\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"bytes32\",\n        \"name\": \"role\",\n        \"type\": \"bytes32\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"account\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"sender\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"RoleGranted\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"bytes32\",\n        \"name\": \"role\",\n        \"type\": \"bytes32\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"account\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"sender\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"RoleRevoked\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"id\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"voter\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"bool\",\n        \"name\": \"support\",\n        \"type\": \"bool\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"votingPower\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"VoteEmitted\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"newVotingDelay\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"initiatorChange\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"VotingDelayChanged\",\n    \"type\": \"event\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"ADD_EXECUTOR_ROLE\",\n    \"outputs\": [\n      {\n        \"internalType\": \"bytes32\",\n        \"name\": \"\",\n        \"type\": \"bytes32\"\n      }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"DEFAULT_ADMIN_ROLE\",\n    \"outputs\": [\n      {\n        \"internalType\": \"bytes32\",\n        \"name\": \"\",\n        \"type\": \"bytes32\"\n      }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"DOMAIN_TYPEHASH\",\n    \"outputs\": [\n      {\n        \"internalType\": \"bytes32\",\n        \"name\": \"\",\n        \"type\": \"bytes32\"\n      }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"EIP712_DOMAIN_NAME\",\n    \"outputs\": [\n      {\n        \"internalType\": \"string\",\n        \"name\": \"\",\n        \"type\": \"string\"\n      }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"OWNER_ROLE\",\n    \"outputs\": [\n      {\n        \"internalType\": \"bytes32\",\n        \"name\": \"\",\n        \"type\": \"bytes32\"\n      }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"VOTE_EMITTED_TYPEHASH\",\n    \"outputs\": [\n      {\n        \"internalType\": \"bytes32\",\n        \"name\": \"\",\n        \"type\": \"bytes32\"\n      }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"address[]\",\n        \"name\": \"executors\",\n        \"type\": \"address[]\"\n      }\n    ],\n    \"name\": \"authorizeExecutors\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"proposalId\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"cancel\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"contract IExecutorWithTimelock\",\n        \"name\": \"executor\",\n        \"type\": \"address\"\n      },\n      {\n        \"internalType\": \"address[]\",\n        \"name\": \"targets\",\n        \"type\": \"address[]\"\n      },\n      {\n        \"internalType\": \"uint256[]\",\n        \"name\": \"values\",\n        \"type\": \"uint256[]\"\n      },\n      {\n        \"internalType\": \"string[]\",\n        \"name\": \"signatures\",\n        \"type\": \"string[]\"\n      },\n      {\n        \"internalType\": \"bytes[]\",\n        \"name\": \"calldatas\",\n        \"type\": \"bytes[]\"\n      },\n      {\n        \"internalType\": \"bool[]\",\n        \"name\": \"withDelegatecalls\",\n        \"type\": \"bool[]\"\n      },\n      {\n        \"internalType\": \"bytes32\",\n        \"name\": \"ipfsHash\",\n        \"type\": \"bytes32\"\n      }\n    ],\n    \"name\": \"create\",\n    \"outputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"proposalId\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"execute\",\n    \"outputs\": [],\n    \"stateMutability\": \"payable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"getGovernanceStrategy\",\n    \"outputs\": [\n      {\n        \"internalType\": \"address\",\n        \"name\": \"\",\n        \"type\": \"address\"\n      }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"proposalId\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"getProposalById\",\n    \"outputs\": [\n      {\n        \"components\": [\n          {\n            \"internalType\": \"uint256\",\n            \"name\": \"id\",\n            \"type\": \"uint256\"\n          },\n          {\n            \"internalType\": \"address\",\n            \"name\": \"creator\",\n            \"type\": \"address\"\n          },\n          {\n            \"internalType\": \"contract IExecutorWithTimelock\",\n            \"name\": \"executor\",\n            \"type\": \"address\"\n          },\n          {\n            \"internalType\": \"address[]\",\n            \"name\": \"targets\",\n            \"type\": \"address[]\"\n          },\n          {\n            \"internalType\": \"uint256[]\",\n            \"name\": \"values\",\n            \"type\": \"uint256[]\"\n          },\n          {\n            \"internalType\": \"string[]\",\n            \"name\": \"signatures\",\n            \"type\": \"string[]\"\n          },\n          {\n            \"internalType\": \"bytes[]\",\n            \"name\": \"calldatas\",\n            \"type\": \"bytes[]\"\n          },\n          {\n            \"internalType\": \"bool[]\",\n            \"name\": \"withDelegatecalls\",\n            \"type\": \"bool[]\"\n          },\n          {\n            \"internalType\": \"uint256\",\n            \"name\": \"startBlock\",\n            \"type\": \"uint256\"\n          },\n          {\n            \"internalType\": \"uint256\",\n            \"name\": \"endBlock\",\n            \"type\": \"uint256\"\n          },\n          {\n            \"internalType\": \"uint256\",\n            \"name\": \"executionTime\",\n            \"type\": \"uint256\"\n          },\n          {\n            \"internalType\": \"uint256\",\n            \"name\": \"forVotes\",\n            \"type\": \"uint256\"\n          },\n          {\n            \"internalType\": \"uint256\",\n            \"name\": \"againstVotes\",\n            \"type\": \"uint256\"\n          },\n          {\n            \"internalType\": \"bool\",\n            \"name\": \"executed\",\n            \"type\": \"bool\"\n          },\n          {\n            \"internalType\": \"bool\",\n            \"name\": \"canceled\",\n            \"type\": \"bool\"\n          },\n          {\n            \"internalType\": \"address\",\n            \"name\": \"strategy\",\n            \"type\": \"address\"\n          },\n          {\n            \"internalType\": \"bytes32\",\n            \"name\": \"ipfsHash\",\n            \"type\": \"bytes32\"\n          }\n        ],\n        \"internalType\": \"struct IDydxGovernor.ProposalWithoutVotes\",\n        \"name\": \"\",\n        \"type\": \"tuple\"\n      }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"proposalId\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"getProposalState\",\n    \"outputs\": [\n      {\n        \"internalType\": \"enum IDydxGovernor.ProposalState\",\n        \"name\": \"\",\n        \"type\": \"uint8\"\n      }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"getProposalsCount\",\n    \"outputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"bytes32\",\n        \"name\": \"role\",\n        \"type\": \"bytes32\"\n      }\n    ],\n    \"name\": \"getRoleAdmin\",\n    \"outputs\": [\n      {\n        \"internalType\": \"bytes32\",\n        \"name\": \"\",\n        \"type\": \"bytes32\"\n      }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"proposalId\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"internalType\": \"address\",\n        \"name\": \"voter\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"getVoteOnProposal\",\n    \"outputs\": [\n      {\n        \"components\": [\n          {\n            \"internalType\": \"bool\",\n            \"name\": \"support\",\n            \"type\": \"bool\"\n          },\n          {\n            \"internalType\": \"uint248\",\n            \"name\": \"votingPower\",\n            \"type\": \"uint248\"\n          }\n        ],\n        \"internalType\": \"struct IDydxGovernor.Vote\",\n        \"name\": \"\",\n        \"type\": \"tuple\"\n      }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"getVotingDelay\",\n    \"outputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"bytes32\",\n        \"name\": \"role\",\n        \"type\": \"bytes32\"\n      },\n      {\n        \"internalType\": \"address\",\n        \"name\": \"account\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"grantRole\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"bytes32\",\n        \"name\": \"role\",\n        \"type\": \"bytes32\"\n      },\n      {\n        \"internalType\": \"address\",\n        \"name\": \"account\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"hasRole\",\n    \"outputs\": [\n      {\n        \"internalType\": \"bool\",\n        \"name\": \"\",\n        \"type\": \"bool\"\n      }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"address\",\n        \"name\": \"executor\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"isExecutorAuthorized\",\n    \"outputs\": [\n      {\n        \"internalType\": \"bool\",\n        \"name\": \"\",\n        \"type\": \"bool\"\n      }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"proposalId\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"queue\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"bytes32\",\n        \"name\": \"role\",\n        \"type\": \"bytes32\"\n      },\n      {\n        \"internalType\": \"address\",\n        \"name\": \"account\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"renounceRole\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"bytes32\",\n        \"name\": \"role\",\n        \"type\": \"bytes32\"\n      },\n      {\n        \"internalType\": \"address\",\n        \"name\": \"account\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"revokeRole\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"address\",\n        \"name\": \"governanceStrategy\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"setGovernanceStrategy\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"votingDelay\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"setVotingDelay\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"proposalId\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"internalType\": \"bool\",\n        \"name\": \"support\",\n        \"type\": \"bool\"\n      }\n    ],\n    \"name\": \"submitVote\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"proposalId\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"internalType\": \"bool\",\n        \"name\": \"support\",\n        \"type\": \"bool\"\n      },\n      {\n        \"internalType\": \"uint8\",\n        \"name\": \"v\",\n        \"type\": \"uint8\"\n      },\n      {\n        \"internalType\": \"bytes32\",\n        \"name\": \"r\",\n        \"type\": \"bytes32\"\n      },\n      {\n        \"internalType\": \"bytes32\",\n        \"name\": \"s\",\n        \"type\": \"bytes32\"\n      }\n    ],\n    \"name\": \"submitVoteBySignature\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"bytes4\",\n        \"name\": \"interfaceId\",\n        \"type\": \"bytes4\"\n      }\n    ],\n    \"name\": \"supportsInterface\",\n    \"outputs\": [\n      {\n        \"internalType\": \"bool\",\n        \"name\": \"\",\n        \"type\": \"bool\"\n      }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"address[]\",\n        \"name\": \"executors\",\n        \"type\": \"address[]\"\n      }\n    ],\n    \"name\": \"unauthorizeExecutors\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  }\n]";
    ///The parsed JSON ABI of the contract.
    pub static DYDXGOV_ABI: ::ethers::contract::Lazy<::ethers::core::abi::Abi> = ::ethers::contract::Lazy::new(||
    ::ethers::core::utils::__serde_json::from_str(__ABI).expect("ABI is always valid"));
    pub struct dydxgov<M>(::ethers::contract::Contract<M>);
    impl<M> ::core::clone::Clone for dydxgov<M> {
        fn clone(&self) -> Self {
            Self(::core::clone::Clone::clone(&self.0))
        }
    }
    impl<M> ::core::ops::Deref for dydxgov<M> {
        type Target = ::ethers::contract::Contract<M>;
        fn deref(&self) -> &Self::Target {
            &self.0
        }
    }
    impl<M> ::core::ops::DerefMut for dydxgov<M> {
        fn deref_mut(&mut self) -> &mut Self::Target {
            &mut self.0
        }
    }
    impl<M> ::core::fmt::Debug for dydxgov<M> {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            f.debug_tuple(stringify!(dydxgov)).field(&self.address()).finish()
        }
    }
    impl<M: ::ethers::providers::Middleware> dydxgov<M> {
        /// Creates a new contract instance with the specified `ethers` client at
        /// `address`. The contract derefs to a `ethers::Contract` object.
        pub fn new<T: Into<::ethers::core::types::Address>>(
            address: T,
            client: ::std::sync::Arc<M>,
        ) -> Self {
            Self(
                ::ethers::contract::Contract::new(
                    address.into(),
                    DYDXGOV_ABI.clone(),
                    client,
                ),
            )
        }
        ///Calls the contract's `ADD_EXECUTOR_ROLE` (0x19567757) function
        pub fn add_executor_role(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, [u8; 32]> {
            self.0
                .method_hash([25, 86, 119, 87], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `DEFAULT_ADMIN_ROLE` (0xa217fddf) function
        pub fn default_admin_role(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, [u8; 32]> {
            self.0
                .method_hash([162, 23, 253, 223], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `DOMAIN_TYPEHASH` (0x20606b70) function
        pub fn domain_typehash(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, [u8; 32]> {
            self.0
                .method_hash([32, 96, 107, 112], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `EIP712_DOMAIN_NAME` (0xfd070296) function
        pub fn eip712_domain_name(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::std::string::String> {
            self.0
                .method_hash([253, 7, 2, 150], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `OWNER_ROLE` (0xe58378bb) function
        pub fn owner_role(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, [u8; 32]> {
            self.0
                .method_hash([229, 131, 120, 187], ())
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
        ///Calls the contract's `getRoleAdmin` (0x248a9ca3) function
        pub fn get_role_admin(
            &self,
            role: [u8; 32],
        ) -> ::ethers::contract::builders::ContractCall<M, [u8; 32]> {
            self.0
                .method_hash([36, 138, 156, 163], role)
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
        ///Calls the contract's `grantRole` (0x2f2ff15d) function
        pub fn grant_role(
            &self,
            role: [u8; 32],
            account: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([47, 47, 241, 93], (role, account))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `hasRole` (0x91d14854) function
        pub fn has_role(
            &self,
            role: [u8; 32],
            account: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([145, 209, 72, 84], (role, account))
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
        ///Calls the contract's `queue` (0xddf0b009) function
        pub fn queue(
            &self,
            proposal_id: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([221, 240, 176, 9], proposal_id)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `renounceRole` (0x36568abe) function
        pub fn renounce_role(
            &self,
            role: [u8; 32],
            account: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([54, 86, 138, 190], (role, account))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `revokeRole` (0xd547741f) function
        pub fn revoke_role(
            &self,
            role: [u8; 32],
            account: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([213, 71, 116, 31], (role, account))
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
        ///Calls the contract's `supportsInterface` (0x01ffc9a7) function
        pub fn supports_interface(
            &self,
            interface_id: [u8; 4],
        ) -> ::ethers::contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([1, 255, 201, 167], interface_id)
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
        ///Gets the contract's `RoleAdminChanged` event
        pub fn role_admin_changed_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            RoleAdminChangedFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `RoleGranted` event
        pub fn role_granted_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            RoleGrantedFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `RoleRevoked` event
        pub fn role_revoked_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            RoleRevokedFilter,
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
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, dydxgovEvents> {
            self.0.event_with_filter(::core::default::Default::default())
        }
    }
    impl<M: ::ethers::providers::Middleware> From<::ethers::contract::Contract<M>>
    for dydxgov<M> {
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
    #[ethevent(
        name = "RoleAdminChanged",
        abi = "RoleAdminChanged(bytes32,bytes32,bytes32)"
    )]
    pub struct RoleAdminChangedFilter {
        #[ethevent(indexed)]
        pub role: [u8; 32],
        #[ethevent(indexed)]
        pub previous_admin_role: [u8; 32],
        #[ethevent(indexed)]
        pub new_admin_role: [u8; 32],
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
    #[ethevent(name = "RoleGranted", abi = "RoleGranted(bytes32,address,address)")]
    pub struct RoleGrantedFilter {
        #[ethevent(indexed)]
        pub role: [u8; 32],
        #[ethevent(indexed)]
        pub account: ::ethers::core::types::Address,
        #[ethevent(indexed)]
        pub sender: ::ethers::core::types::Address,
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
    #[ethevent(name = "RoleRevoked", abi = "RoleRevoked(bytes32,address,address)")]
    pub struct RoleRevokedFilter {
        #[ethevent(indexed)]
        pub role: [u8; 32],
        #[ethevent(indexed)]
        pub account: ::ethers::core::types::Address,
        #[ethevent(indexed)]
        pub sender: ::ethers::core::types::Address,
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
    pub enum dydxgovEvents {
        ExecutorAuthorizedFilter(ExecutorAuthorizedFilter),
        ExecutorUnauthorizedFilter(ExecutorUnauthorizedFilter),
        GovernanceStrategyChangedFilter(GovernanceStrategyChangedFilter),
        ProposalCanceledFilter(ProposalCanceledFilter),
        ProposalCreatedFilter(ProposalCreatedFilter),
        ProposalExecutedFilter(ProposalExecutedFilter),
        ProposalQueuedFilter(ProposalQueuedFilter),
        RoleAdminChangedFilter(RoleAdminChangedFilter),
        RoleGrantedFilter(RoleGrantedFilter),
        RoleRevokedFilter(RoleRevokedFilter),
        VoteEmittedFilter(VoteEmittedFilter),
        VotingDelayChangedFilter(VotingDelayChangedFilter),
    }
    impl ::ethers::contract::EthLogDecode for dydxgovEvents {
        fn decode_log(
            log: &::ethers::core::abi::RawLog,
        ) -> ::core::result::Result<Self, ::ethers::core::abi::Error> {
            if let Ok(decoded) = ExecutorAuthorizedFilter::decode_log(log) {
                return Ok(dydxgovEvents::ExecutorAuthorizedFilter(decoded));
            }
            if let Ok(decoded) = ExecutorUnauthorizedFilter::decode_log(log) {
                return Ok(dydxgovEvents::ExecutorUnauthorizedFilter(decoded));
            }
            if let Ok(decoded) = GovernanceStrategyChangedFilter::decode_log(log) {
                return Ok(dydxgovEvents::GovernanceStrategyChangedFilter(decoded));
            }
            if let Ok(decoded) = ProposalCanceledFilter::decode_log(log) {
                return Ok(dydxgovEvents::ProposalCanceledFilter(decoded));
            }
            if let Ok(decoded) = ProposalCreatedFilter::decode_log(log) {
                return Ok(dydxgovEvents::ProposalCreatedFilter(decoded));
            }
            if let Ok(decoded) = ProposalExecutedFilter::decode_log(log) {
                return Ok(dydxgovEvents::ProposalExecutedFilter(decoded));
            }
            if let Ok(decoded) = ProposalQueuedFilter::decode_log(log) {
                return Ok(dydxgovEvents::ProposalQueuedFilter(decoded));
            }
            if let Ok(decoded) = RoleAdminChangedFilter::decode_log(log) {
                return Ok(dydxgovEvents::RoleAdminChangedFilter(decoded));
            }
            if let Ok(decoded) = RoleGrantedFilter::decode_log(log) {
                return Ok(dydxgovEvents::RoleGrantedFilter(decoded));
            }
            if let Ok(decoded) = RoleRevokedFilter::decode_log(log) {
                return Ok(dydxgovEvents::RoleRevokedFilter(decoded));
            }
            if let Ok(decoded) = VoteEmittedFilter::decode_log(log) {
                return Ok(dydxgovEvents::VoteEmittedFilter(decoded));
            }
            if let Ok(decoded) = VotingDelayChangedFilter::decode_log(log) {
                return Ok(dydxgovEvents::VotingDelayChangedFilter(decoded));
            }
            Err(::ethers::core::abi::Error::InvalidData)
        }
    }
    impl ::core::fmt::Display for dydxgovEvents {
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
                Self::RoleAdminChangedFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::RoleGrantedFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::RoleRevokedFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::VoteEmittedFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::VotingDelayChangedFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
            }
        }
    }
    impl ::core::convert::From<ExecutorAuthorizedFilter> for dydxgovEvents {
        fn from(value: ExecutorAuthorizedFilter) -> Self {
            Self::ExecutorAuthorizedFilter(value)
        }
    }
    impl ::core::convert::From<ExecutorUnauthorizedFilter> for dydxgovEvents {
        fn from(value: ExecutorUnauthorizedFilter) -> Self {
            Self::ExecutorUnauthorizedFilter(value)
        }
    }
    impl ::core::convert::From<GovernanceStrategyChangedFilter> for dydxgovEvents {
        fn from(value: GovernanceStrategyChangedFilter) -> Self {
            Self::GovernanceStrategyChangedFilter(value)
        }
    }
    impl ::core::convert::From<ProposalCanceledFilter> for dydxgovEvents {
        fn from(value: ProposalCanceledFilter) -> Self {
            Self::ProposalCanceledFilter(value)
        }
    }
    impl ::core::convert::From<ProposalCreatedFilter> for dydxgovEvents {
        fn from(value: ProposalCreatedFilter) -> Self {
            Self::ProposalCreatedFilter(value)
        }
    }
    impl ::core::convert::From<ProposalExecutedFilter> for dydxgovEvents {
        fn from(value: ProposalExecutedFilter) -> Self {
            Self::ProposalExecutedFilter(value)
        }
    }
    impl ::core::convert::From<ProposalQueuedFilter> for dydxgovEvents {
        fn from(value: ProposalQueuedFilter) -> Self {
            Self::ProposalQueuedFilter(value)
        }
    }
    impl ::core::convert::From<RoleAdminChangedFilter> for dydxgovEvents {
        fn from(value: RoleAdminChangedFilter) -> Self {
            Self::RoleAdminChangedFilter(value)
        }
    }
    impl ::core::convert::From<RoleGrantedFilter> for dydxgovEvents {
        fn from(value: RoleGrantedFilter) -> Self {
            Self::RoleGrantedFilter(value)
        }
    }
    impl ::core::convert::From<RoleRevokedFilter> for dydxgovEvents {
        fn from(value: RoleRevokedFilter) -> Self {
            Self::RoleRevokedFilter(value)
        }
    }
    impl ::core::convert::From<VoteEmittedFilter> for dydxgovEvents {
        fn from(value: VoteEmittedFilter) -> Self {
            Self::VoteEmittedFilter(value)
        }
    }
    impl ::core::convert::From<VotingDelayChangedFilter> for dydxgovEvents {
        fn from(value: VotingDelayChangedFilter) -> Self {
            Self::VotingDelayChangedFilter(value)
        }
    }
    ///Container type for all input parameters for the `ADD_EXECUTOR_ROLE` function with signature `ADD_EXECUTOR_ROLE()` and selector `0x19567757`
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
    #[ethcall(name = "ADD_EXECUTOR_ROLE", abi = "ADD_EXECUTOR_ROLE()")]
    pub struct AddExecutorRoleCall;
    ///Container type for all input parameters for the `DEFAULT_ADMIN_ROLE` function with signature `DEFAULT_ADMIN_ROLE()` and selector `0xa217fddf`
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
    #[ethcall(name = "DEFAULT_ADMIN_ROLE", abi = "DEFAULT_ADMIN_ROLE()")]
    pub struct DefaultAdminRoleCall;
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
    ///Container type for all input parameters for the `EIP712_DOMAIN_NAME` function with signature `EIP712_DOMAIN_NAME()` and selector `0xfd070296`
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
    #[ethcall(name = "EIP712_DOMAIN_NAME", abi = "EIP712_DOMAIN_NAME()")]
    pub struct Eip712DomainNameCall;
    ///Container type for all input parameters for the `OWNER_ROLE` function with signature `OWNER_ROLE()` and selector `0xe58378bb`
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
    #[ethcall(name = "OWNER_ROLE", abi = "OWNER_ROLE()")]
    pub struct OwnerRoleCall;
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
    ///Container type for all input parameters for the `getRoleAdmin` function with signature `getRoleAdmin(bytes32)` and selector `0x248a9ca3`
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
    #[ethcall(name = "getRoleAdmin", abi = "getRoleAdmin(bytes32)")]
    pub struct GetRoleAdminCall {
        pub role: [u8; 32],
    }
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
    ///Container type for all input parameters for the `grantRole` function with signature `grantRole(bytes32,address)` and selector `0x2f2ff15d`
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
    #[ethcall(name = "grantRole", abi = "grantRole(bytes32,address)")]
    pub struct GrantRoleCall {
        pub role: [u8; 32],
        pub account: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `hasRole` function with signature `hasRole(bytes32,address)` and selector `0x91d14854`
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
    #[ethcall(name = "hasRole", abi = "hasRole(bytes32,address)")]
    pub struct HasRoleCall {
        pub role: [u8; 32],
        pub account: ::ethers::core::types::Address,
    }
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
    ///Container type for all input parameters for the `renounceRole` function with signature `renounceRole(bytes32,address)` and selector `0x36568abe`
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
    #[ethcall(name = "renounceRole", abi = "renounceRole(bytes32,address)")]
    pub struct RenounceRoleCall {
        pub role: [u8; 32],
        pub account: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `revokeRole` function with signature `revokeRole(bytes32,address)` and selector `0xd547741f`
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
    #[ethcall(name = "revokeRole", abi = "revokeRole(bytes32,address)")]
    pub struct RevokeRoleCall {
        pub role: [u8; 32],
        pub account: ::ethers::core::types::Address,
    }
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
    ///Container type for all input parameters for the `supportsInterface` function with signature `supportsInterface(bytes4)` and selector `0x01ffc9a7`
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
    #[ethcall(name = "supportsInterface", abi = "supportsInterface(bytes4)")]
    pub struct SupportsInterfaceCall {
        pub interface_id: [u8; 4],
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
    pub enum dydxgovCalls {
        AddExecutorRole(AddExecutorRoleCall),
        DefaultAdminRole(DefaultAdminRoleCall),
        DomainTypehash(DomainTypehashCall),
        Eip712DomainName(Eip712DomainNameCall),
        OwnerRole(OwnerRoleCall),
        VoteEmittedTypehash(VoteEmittedTypehashCall),
        AuthorizeExecutors(AuthorizeExecutorsCall),
        Cancel(CancelCall),
        Create(CreateCall),
        Execute(ExecuteCall),
        GetGovernanceStrategy(GetGovernanceStrategyCall),
        GetProposalById(GetProposalByIdCall),
        GetProposalState(GetProposalStateCall),
        GetProposalsCount(GetProposalsCountCall),
        GetRoleAdmin(GetRoleAdminCall),
        GetVoteOnProposal(GetVoteOnProposalCall),
        GetVotingDelay(GetVotingDelayCall),
        GrantRole(GrantRoleCall),
        HasRole(HasRoleCall),
        IsExecutorAuthorized(IsExecutorAuthorizedCall),
        Queue(QueueCall),
        RenounceRole(RenounceRoleCall),
        RevokeRole(RevokeRoleCall),
        SetGovernanceStrategy(SetGovernanceStrategyCall),
        SetVotingDelay(SetVotingDelayCall),
        SubmitVote(SubmitVoteCall),
        SubmitVoteBySignature(SubmitVoteBySignatureCall),
        SupportsInterface(SupportsInterfaceCall),
        UnauthorizeExecutors(UnauthorizeExecutorsCall),
    }
    impl ::ethers::core::abi::AbiDecode for dydxgovCalls {
        fn decode(
            data: impl AsRef<[u8]>,
        ) -> ::core::result::Result<Self, ::ethers::core::abi::AbiError> {
            let data = data.as_ref();
            if let Ok(decoded) = <AddExecutorRoleCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::AddExecutorRole(decoded));
            }
            if let Ok(decoded) = <DefaultAdminRoleCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::DefaultAdminRole(decoded));
            }
            if let Ok(decoded) = <DomainTypehashCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::DomainTypehash(decoded));
            }
            if let Ok(decoded) = <Eip712DomainNameCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::Eip712DomainName(decoded));
            }
            if let Ok(decoded) = <OwnerRoleCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::OwnerRole(decoded));
            }
            if let Ok(decoded) = <VoteEmittedTypehashCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::VoteEmittedTypehash(decoded));
            }
            if let Ok(decoded) = <AuthorizeExecutorsCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::AuthorizeExecutors(decoded));
            }
            if let Ok(decoded) = <CancelCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::Cancel(decoded));
            }
            if let Ok(decoded) = <CreateCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::Create(decoded));
            }
            if let Ok(decoded) = <ExecuteCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::Execute(decoded));
            }
            if let Ok(decoded) = <GetGovernanceStrategyCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::GetGovernanceStrategy(decoded));
            }
            if let Ok(decoded) = <GetProposalByIdCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::GetProposalById(decoded));
            }
            if let Ok(decoded) = <GetProposalStateCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::GetProposalState(decoded));
            }
            if let Ok(decoded) = <GetProposalsCountCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::GetProposalsCount(decoded));
            }
            if let Ok(decoded) = <GetRoleAdminCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::GetRoleAdmin(decoded));
            }
            if let Ok(decoded) = <GetVoteOnProposalCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::GetVoteOnProposal(decoded));
            }
            if let Ok(decoded) = <GetVotingDelayCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::GetVotingDelay(decoded));
            }
            if let Ok(decoded) = <GrantRoleCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::GrantRole(decoded));
            }
            if let Ok(decoded) = <HasRoleCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::HasRole(decoded));
            }
            if let Ok(decoded) = <IsExecutorAuthorizedCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::IsExecutorAuthorized(decoded));
            }
            if let Ok(decoded) = <QueueCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::Queue(decoded));
            }
            if let Ok(decoded) = <RenounceRoleCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::RenounceRole(decoded));
            }
            if let Ok(decoded) = <RevokeRoleCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::RevokeRole(decoded));
            }
            if let Ok(decoded) = <SetGovernanceStrategyCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::SetGovernanceStrategy(decoded));
            }
            if let Ok(decoded) = <SetVotingDelayCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::SetVotingDelay(decoded));
            }
            if let Ok(decoded) = <SubmitVoteCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::SubmitVote(decoded));
            }
            if let Ok(decoded) = <SubmitVoteBySignatureCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::SubmitVoteBySignature(decoded));
            }
            if let Ok(decoded) = <SupportsInterfaceCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::SupportsInterface(decoded));
            }
            if let Ok(decoded) = <UnauthorizeExecutorsCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::UnauthorizeExecutors(decoded));
            }
            Err(::ethers::core::abi::Error::InvalidData.into())
        }
    }
    impl ::ethers::core::abi::AbiEncode for dydxgovCalls {
        fn encode(self) -> Vec<u8> {
            match self {
                Self::AddExecutorRole(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::DefaultAdminRole(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::DomainTypehash(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::Eip712DomainName(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::OwnerRole(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::VoteEmittedTypehash(element) => {
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
                Self::GetProposalById(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetProposalState(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetProposalsCount(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetRoleAdmin(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetVoteOnProposal(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetVotingDelay(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GrantRole(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::HasRole(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::IsExecutorAuthorized(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::Queue(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::RenounceRole(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::RevokeRole(element) => {
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
                Self::SupportsInterface(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::UnauthorizeExecutors(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
            }
        }
    }
    impl ::core::fmt::Display for dydxgovCalls {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            match self {
                Self::AddExecutorRole(element) => ::core::fmt::Display::fmt(element, f),
                Self::DefaultAdminRole(element) => ::core::fmt::Display::fmt(element, f),
                Self::DomainTypehash(element) => ::core::fmt::Display::fmt(element, f),
                Self::Eip712DomainName(element) => ::core::fmt::Display::fmt(element, f),
                Self::OwnerRole(element) => ::core::fmt::Display::fmt(element, f),
                Self::VoteEmittedTypehash(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::AuthorizeExecutors(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::Cancel(element) => ::core::fmt::Display::fmt(element, f),
                Self::Create(element) => ::core::fmt::Display::fmt(element, f),
                Self::Execute(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetGovernanceStrategy(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::GetProposalById(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetProposalState(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetProposalsCount(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetRoleAdmin(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetVoteOnProposal(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetVotingDelay(element) => ::core::fmt::Display::fmt(element, f),
                Self::GrantRole(element) => ::core::fmt::Display::fmt(element, f),
                Self::HasRole(element) => ::core::fmt::Display::fmt(element, f),
                Self::IsExecutorAuthorized(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::Queue(element) => ::core::fmt::Display::fmt(element, f),
                Self::RenounceRole(element) => ::core::fmt::Display::fmt(element, f),
                Self::RevokeRole(element) => ::core::fmt::Display::fmt(element, f),
                Self::SetGovernanceStrategy(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::SetVotingDelay(element) => ::core::fmt::Display::fmt(element, f),
                Self::SubmitVote(element) => ::core::fmt::Display::fmt(element, f),
                Self::SubmitVoteBySignature(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::SupportsInterface(element) => ::core::fmt::Display::fmt(element, f),
                Self::UnauthorizeExecutors(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
            }
        }
    }
    impl ::core::convert::From<AddExecutorRoleCall> for dydxgovCalls {
        fn from(value: AddExecutorRoleCall) -> Self {
            Self::AddExecutorRole(value)
        }
    }
    impl ::core::convert::From<DefaultAdminRoleCall> for dydxgovCalls {
        fn from(value: DefaultAdminRoleCall) -> Self {
            Self::DefaultAdminRole(value)
        }
    }
    impl ::core::convert::From<DomainTypehashCall> for dydxgovCalls {
        fn from(value: DomainTypehashCall) -> Self {
            Self::DomainTypehash(value)
        }
    }
    impl ::core::convert::From<Eip712DomainNameCall> for dydxgovCalls {
        fn from(value: Eip712DomainNameCall) -> Self {
            Self::Eip712DomainName(value)
        }
    }
    impl ::core::convert::From<OwnerRoleCall> for dydxgovCalls {
        fn from(value: OwnerRoleCall) -> Self {
            Self::OwnerRole(value)
        }
    }
    impl ::core::convert::From<VoteEmittedTypehashCall> for dydxgovCalls {
        fn from(value: VoteEmittedTypehashCall) -> Self {
            Self::VoteEmittedTypehash(value)
        }
    }
    impl ::core::convert::From<AuthorizeExecutorsCall> for dydxgovCalls {
        fn from(value: AuthorizeExecutorsCall) -> Self {
            Self::AuthorizeExecutors(value)
        }
    }
    impl ::core::convert::From<CancelCall> for dydxgovCalls {
        fn from(value: CancelCall) -> Self {
            Self::Cancel(value)
        }
    }
    impl ::core::convert::From<CreateCall> for dydxgovCalls {
        fn from(value: CreateCall) -> Self {
            Self::Create(value)
        }
    }
    impl ::core::convert::From<ExecuteCall> for dydxgovCalls {
        fn from(value: ExecuteCall) -> Self {
            Self::Execute(value)
        }
    }
    impl ::core::convert::From<GetGovernanceStrategyCall> for dydxgovCalls {
        fn from(value: GetGovernanceStrategyCall) -> Self {
            Self::GetGovernanceStrategy(value)
        }
    }
    impl ::core::convert::From<GetProposalByIdCall> for dydxgovCalls {
        fn from(value: GetProposalByIdCall) -> Self {
            Self::GetProposalById(value)
        }
    }
    impl ::core::convert::From<GetProposalStateCall> for dydxgovCalls {
        fn from(value: GetProposalStateCall) -> Self {
            Self::GetProposalState(value)
        }
    }
    impl ::core::convert::From<GetProposalsCountCall> for dydxgovCalls {
        fn from(value: GetProposalsCountCall) -> Self {
            Self::GetProposalsCount(value)
        }
    }
    impl ::core::convert::From<GetRoleAdminCall> for dydxgovCalls {
        fn from(value: GetRoleAdminCall) -> Self {
            Self::GetRoleAdmin(value)
        }
    }
    impl ::core::convert::From<GetVoteOnProposalCall> for dydxgovCalls {
        fn from(value: GetVoteOnProposalCall) -> Self {
            Self::GetVoteOnProposal(value)
        }
    }
    impl ::core::convert::From<GetVotingDelayCall> for dydxgovCalls {
        fn from(value: GetVotingDelayCall) -> Self {
            Self::GetVotingDelay(value)
        }
    }
    impl ::core::convert::From<GrantRoleCall> for dydxgovCalls {
        fn from(value: GrantRoleCall) -> Self {
            Self::GrantRole(value)
        }
    }
    impl ::core::convert::From<HasRoleCall> for dydxgovCalls {
        fn from(value: HasRoleCall) -> Self {
            Self::HasRole(value)
        }
    }
    impl ::core::convert::From<IsExecutorAuthorizedCall> for dydxgovCalls {
        fn from(value: IsExecutorAuthorizedCall) -> Self {
            Self::IsExecutorAuthorized(value)
        }
    }
    impl ::core::convert::From<QueueCall> for dydxgovCalls {
        fn from(value: QueueCall) -> Self {
            Self::Queue(value)
        }
    }
    impl ::core::convert::From<RenounceRoleCall> for dydxgovCalls {
        fn from(value: RenounceRoleCall) -> Self {
            Self::RenounceRole(value)
        }
    }
    impl ::core::convert::From<RevokeRoleCall> for dydxgovCalls {
        fn from(value: RevokeRoleCall) -> Self {
            Self::RevokeRole(value)
        }
    }
    impl ::core::convert::From<SetGovernanceStrategyCall> for dydxgovCalls {
        fn from(value: SetGovernanceStrategyCall) -> Self {
            Self::SetGovernanceStrategy(value)
        }
    }
    impl ::core::convert::From<SetVotingDelayCall> for dydxgovCalls {
        fn from(value: SetVotingDelayCall) -> Self {
            Self::SetVotingDelay(value)
        }
    }
    impl ::core::convert::From<SubmitVoteCall> for dydxgovCalls {
        fn from(value: SubmitVoteCall) -> Self {
            Self::SubmitVote(value)
        }
    }
    impl ::core::convert::From<SubmitVoteBySignatureCall> for dydxgovCalls {
        fn from(value: SubmitVoteBySignatureCall) -> Self {
            Self::SubmitVoteBySignature(value)
        }
    }
    impl ::core::convert::From<SupportsInterfaceCall> for dydxgovCalls {
        fn from(value: SupportsInterfaceCall) -> Self {
            Self::SupportsInterface(value)
        }
    }
    impl ::core::convert::From<UnauthorizeExecutorsCall> for dydxgovCalls {
        fn from(value: UnauthorizeExecutorsCall) -> Self {
            Self::UnauthorizeExecutors(value)
        }
    }
    ///Container type for all return fields from the `ADD_EXECUTOR_ROLE` function with signature `ADD_EXECUTOR_ROLE()` and selector `0x19567757`
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
    pub struct AddExecutorRoleReturn(pub [u8; 32]);
    ///Container type for all return fields from the `DEFAULT_ADMIN_ROLE` function with signature `DEFAULT_ADMIN_ROLE()` and selector `0xa217fddf`
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
    pub struct DefaultAdminRoleReturn(pub [u8; 32]);
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
    ///Container type for all return fields from the `EIP712_DOMAIN_NAME` function with signature `EIP712_DOMAIN_NAME()` and selector `0xfd070296`
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
    pub struct Eip712DomainNameReturn(pub ::std::string::String);
    ///Container type for all return fields from the `OWNER_ROLE` function with signature `OWNER_ROLE()` and selector `0xe58378bb`
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
    pub struct OwnerRoleReturn(pub [u8; 32]);
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
    ///Container type for all return fields from the `getRoleAdmin` function with signature `getRoleAdmin(bytes32)` and selector `0x248a9ca3`
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
    pub struct GetRoleAdminReturn(pub [u8; 32]);
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
    ///Container type for all return fields from the `hasRole` function with signature `hasRole(bytes32,address)` and selector `0x91d14854`
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
    pub struct HasRoleReturn(pub bool);
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
    ///Container type for all return fields from the `supportsInterface` function with signature `supportsInterface(bytes4)` and selector `0x01ffc9a7`
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
    pub struct SupportsInterfaceReturn(pub bool);
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
