pub use interestprotocolgov::*;
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
pub mod interestprotocolgov {
    #[rustfmt::skip]
    const __ABI: &str = "[\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"bytes32\",\n        \"name\": \"txHash\",\n        \"type\": \"bytes32\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"target\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"value\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"string\",\n        \"name\": \"signature\",\n        \"type\": \"string\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"bytes\",\n        \"name\": \"data\",\n        \"type\": \"bytes\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"eta\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"CancelTransaction\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"oldEmergencyVotingPeriod\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"emergencyVotingPeriod\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"EmergencyVotingPeriodSet\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"bytes32\",\n        \"name\": \"txHash\",\n        \"type\": \"bytes32\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"target\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"value\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"string\",\n        \"name\": \"signature\",\n        \"type\": \"string\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"bytes\",\n        \"name\": \"data\",\n        \"type\": \"bytes\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"eta\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"ExecuteTransaction\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"address\",\n        \"name\": \"oldAdmin\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"address\",\n        \"name\": \"newAdmin\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"NewAdmin\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"oldTimelockDelay\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"proposalTimelockDelay\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"NewDelay\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"oldEmergencyTimelockDelay\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"emergencyTimelockDelay\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"NewEmergencyDelay\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"oldEmergencyQuorumVotes\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"emergencyQuorumVotes\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"NewEmergencyQuorum\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"address\",\n        \"name\": \"oldImplementation\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"address\",\n        \"name\": \"newImplementation\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"NewImplementation\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"address\",\n        \"name\": \"oldPendingAdmin\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"address\",\n        \"name\": \"newPendingAdmin\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"NewPendingAdmin\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"oldQuorumVotes\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"quorumVotes\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"NewQuorum\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"oldOptimisticQuorumVotes\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"optimisticQuorumVotes\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"OptimisticQuorumVotesSet\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"oldOptimisticVotingDelay\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"optimisticVotingDelay\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"OptimisticVotingDelaySet\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"uint256\",\n        \"name\": \"id\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"ProposalCanceled\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"uint256\",\n        \"name\": \"id\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"proposer\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"address[]\",\n        \"name\": \"targets\",\n        \"type\": \"address[]\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256[]\",\n        \"name\": \"values\",\n        \"type\": \"uint256[]\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"string[]\",\n        \"name\": \"signatures\",\n        \"type\": \"string[]\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"bytes[]\",\n        \"name\": \"calldatas\",\n        \"type\": \"bytes[]\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"uint256\",\n        \"name\": \"startBlock\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"endBlock\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"string\",\n        \"name\": \"description\",\n        \"type\": \"string\"\n      }\n    ],\n    \"name\": \"ProposalCreated\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"uint256\",\n        \"name\": \"id\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"ProposalExecuted\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"uint256\",\n        \"name\": \"id\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"eta\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"ProposalQueued\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"oldProposalThreshold\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"newProposalThreshold\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"ProposalThresholdSet\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"bytes32\",\n        \"name\": \"txHash\",\n        \"type\": \"bytes32\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"target\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"value\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"string\",\n        \"name\": \"signature\",\n        \"type\": \"string\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"bytes\",\n        \"name\": \"data\",\n        \"type\": \"bytes\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"eta\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"QueueTransaction\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"voter\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"uint256\",\n        \"name\": \"proposalId\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint8\",\n        \"name\": \"support\",\n        \"type\": \"uint8\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"votes\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"string\",\n        \"name\": \"reason\",\n        \"type\": \"string\"\n      }\n    ],\n    \"name\": \"VoteCast\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"oldVotingDelay\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"newVotingDelay\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"VotingDelaySet\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"oldVotingPeriod\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"newVotingPeriod\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"VotingPeriodSet\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"address\",\n        \"name\": \"account\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"expiration\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"WhitelistAccountExpirationSet\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"address\",\n        \"name\": \"oldGuardian\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"address\",\n        \"name\": \"newGuardian\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"WhitelistGuardianSet\",\n    \"type\": \"event\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"BALLOT_TYPEHASH\",\n    \"outputs\": [{ \"internalType\": \"bytes32\", \"name\": \"\", \"type\": \"bytes32\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"DOMAIN_TYPEHASH\",\n    \"outputs\": [{ \"internalType\": \"bytes32\", \"name\": \"\", \"type\": \"bytes32\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"GRACE_PERIOD\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"proposalTimelockDelay_\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"_setDelay\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"emergencyTimelockDelay_\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"_setEmergencyDelay\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"newEmergencyQuorumVotes\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"_setEmergencyQuorumVotes\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"newEmergencyVotingPeriod\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"_setEmergencyVotingPeriod\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"address\", \"name\": \"token_\", \"type\": \"address\" }\n    ],\n    \"name\": \"_setNewToken\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"newOptimisticVotingDelay\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"_setOptimisticDelay\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"newOptimisticQuorumVotes\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"_setOptimisticQuorumVotes\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"newProposalThreshold\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"_setProposalThreshold\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"newQuorumVotes\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"_setQuorumVotes\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"newVotingDelay\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"_setVotingDelay\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"newVotingPeriod\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"_setVotingPeriod\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"address\", \"name\": \"account\", \"type\": \"address\" },\n      { \"internalType\": \"uint256\", \"name\": \"expiration\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"_setWhitelistAccountExpiration\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"address\", \"name\": \"account\", \"type\": \"address\" }\n    ],\n    \"name\": \"_setWhitelistGuardian\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"proposalId\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"cancel\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"proposalId\", \"type\": \"uint256\" },\n      { \"internalType\": \"uint8\", \"name\": \"support\", \"type\": \"uint8\" }\n    ],\n    \"name\": \"castVote\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"proposalId\", \"type\": \"uint256\" },\n      { \"internalType\": \"uint8\", \"name\": \"support\", \"type\": \"uint8\" },\n      { \"internalType\": \"uint8\", \"name\": \"v\", \"type\": \"uint8\" },\n      { \"internalType\": \"bytes32\", \"name\": \"r\", \"type\": \"bytes32\" },\n      { \"internalType\": \"bytes32\", \"name\": \"s\", \"type\": \"bytes32\" }\n    ],\n    \"name\": \"castVoteBySig\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"proposalId\", \"type\": \"uint256\" },\n      { \"internalType\": \"uint8\", \"name\": \"support\", \"type\": \"uint8\" },\n      { \"internalType\": \"string\", \"name\": \"reason\", \"type\": \"string\" }\n    ],\n    \"name\": \"castVoteWithReason\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"emergencyQuorumVotes\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"emergencyTimelockDelay\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"emergencyVotingPeriod\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"proposalId\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"execute\",\n    \"outputs\": [],\n    \"stateMutability\": \"payable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"address\", \"name\": \"target\", \"type\": \"address\" },\n      { \"internalType\": \"uint256\", \"name\": \"value\", \"type\": \"uint256\" },\n      { \"internalType\": \"string\", \"name\": \"signature\", \"type\": \"string\" },\n      { \"internalType\": \"bytes\", \"name\": \"data\", \"type\": \"bytes\" },\n      { \"internalType\": \"uint256\", \"name\": \"eta\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"executeTransaction\",\n    \"outputs\": [],\n    \"stateMutability\": \"payable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"proposalId\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"getActions\",\n    \"outputs\": [\n      { \"internalType\": \"address[]\", \"name\": \"targets\", \"type\": \"address[]\" },\n      { \"internalType\": \"uint256[]\", \"name\": \"values\", \"type\": \"uint256[]\" },\n      { \"internalType\": \"string[]\", \"name\": \"signatures\", \"type\": \"string[]\" },\n      { \"internalType\": \"bytes[]\", \"name\": \"calldatas\", \"type\": \"bytes[]\" }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"proposalId\", \"type\": \"uint256\" },\n      { \"internalType\": \"address\", \"name\": \"voter\", \"type\": \"address\" }\n    ],\n    \"name\": \"getReceipt\",\n    \"outputs\": [\n      {\n        \"components\": [\n          { \"internalType\": \"bool\", \"name\": \"hasVoted\", \"type\": \"bool\" },\n          { \"internalType\": \"uint8\", \"name\": \"support\", \"type\": \"uint8\" },\n          { \"internalType\": \"uint96\", \"name\": \"votes\", \"type\": \"uint96\" }\n        ],\n        \"internalType\": \"struct Receipt\",\n        \"name\": \"\",\n        \"type\": \"tuple\"\n      }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"implementation\",\n    \"outputs\": [{ \"internalType\": \"address\", \"name\": \"\", \"type\": \"address\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"initialProposalId\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"address\", \"name\": \"ipt_\", \"type\": \"address\" }\n    ],\n    \"name\": \"initialize\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"initialized\",\n    \"outputs\": [{ \"internalType\": \"bool\", \"name\": \"\", \"type\": \"bool\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"ipt\",\n    \"outputs\": [\n      { \"internalType\": \"contract IIpt\", \"name\": \"\", \"type\": \"address\" }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"address\", \"name\": \"account\", \"type\": \"address\" }\n    ],\n    \"name\": \"isWhitelisted\",\n    \"outputs\": [{ \"internalType\": \"bool\", \"name\": \"\", \"type\": \"bool\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [{ \"internalType\": \"address\", \"name\": \"\", \"type\": \"address\" }],\n    \"name\": \"latestProposalIds\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"maxWhitelistPeriod\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"name\",\n    \"outputs\": [{ \"internalType\": \"string\", \"name\": \"\", \"type\": \"string\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"optimisticQuorumVotes\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"optimisticVotingDelay\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"proposalCount\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"proposalMaxOperations\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" },\n      { \"internalType\": \"address\", \"name\": \"\", \"type\": \"address\" }\n    ],\n    \"name\": \"proposalReceipts\",\n    \"outputs\": [\n      { \"internalType\": \"bool\", \"name\": \"hasVoted\", \"type\": \"bool\" },\n      { \"internalType\": \"uint8\", \"name\": \"support\", \"type\": \"uint8\" },\n      { \"internalType\": \"uint96\", \"name\": \"votes\", \"type\": \"uint96\" }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"proposalThreshold\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"proposalTimelockDelay\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"name\": \"proposals\",\n    \"outputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"id\", \"type\": \"uint256\" },\n      { \"internalType\": \"address\", \"name\": \"proposer\", \"type\": \"address\" },\n      { \"internalType\": \"uint256\", \"name\": \"eta\", \"type\": \"uint256\" },\n      { \"internalType\": \"uint256\", \"name\": \"startBlock\", \"type\": \"uint256\" },\n      { \"internalType\": \"uint256\", \"name\": \"endBlock\", \"type\": \"uint256\" },\n      { \"internalType\": \"uint256\", \"name\": \"forVotes\", \"type\": \"uint256\" },\n      { \"internalType\": \"uint256\", \"name\": \"againstVotes\", \"type\": \"uint256\" },\n      { \"internalType\": \"uint256\", \"name\": \"abstainVotes\", \"type\": \"uint256\" },\n      { \"internalType\": \"bool\", \"name\": \"canceled\", \"type\": \"bool\" },\n      { \"internalType\": \"bool\", \"name\": \"executed\", \"type\": \"bool\" },\n      { \"internalType\": \"bool\", \"name\": \"emergency\", \"type\": \"bool\" },\n      { \"internalType\": \"uint256\", \"name\": \"quorumVotes\", \"type\": \"uint256\" },\n      { \"internalType\": \"uint256\", \"name\": \"delay\", \"type\": \"uint256\" }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"address[]\", \"name\": \"targets\", \"type\": \"address[]\" },\n      { \"internalType\": \"uint256[]\", \"name\": \"values\", \"type\": \"uint256[]\" },\n      { \"internalType\": \"string[]\", \"name\": \"signatures\", \"type\": \"string[]\" },\n      { \"internalType\": \"bytes[]\", \"name\": \"calldatas\", \"type\": \"bytes[]\" },\n      { \"internalType\": \"string\", \"name\": \"description\", \"type\": \"string\" },\n      { \"internalType\": \"bool\", \"name\": \"emergency\", \"type\": \"bool\" }\n    ],\n    \"name\": \"propose\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"proposalId\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"queue\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [{ \"internalType\": \"bytes32\", \"name\": \"\", \"type\": \"bytes32\" }],\n    \"name\": \"queuedTransactions\",\n    \"outputs\": [{ \"internalType\": \"bool\", \"name\": \"\", \"type\": \"bool\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"quorumVotes\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"second\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"setMaxWhitelistPeriod\",\n    \"outputs\": [],\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"proposalId\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"state\",\n    \"outputs\": [\n      { \"internalType\": \"enum ProposalState\", \"name\": \"\", \"type\": \"uint8\" }\n    ],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"votingDelay\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"votingPeriod\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [{ \"internalType\": \"address\", \"name\": \"\", \"type\": \"address\" }],\n    \"name\": \"whitelistAccountExpirations\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"inputs\": [],\n    \"name\": \"whitelistGuardian\",\n    \"outputs\": [{ \"internalType\": \"address\", \"name\": \"\", \"type\": \"address\" }],\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  }\n]\n";
    ///The parsed JSON ABI of the contract.
    pub static INTERESTPROTOCOLGOV_ABI: ::ethers::contract::Lazy<
        ::ethers::core::abi::Abi,
    > = ::ethers::contract::Lazy::new(|| {
        ::ethers::core::utils::__serde_json::from_str(__ABI)
            .expect("ABI is always valid")
    });
    pub struct interestprotocolgov<M>(::ethers::contract::Contract<M>);
    impl<M> ::core::clone::Clone for interestprotocolgov<M> {
        fn clone(&self) -> Self {
            Self(::core::clone::Clone::clone(&self.0))
        }
    }
    impl<M> ::core::ops::Deref for interestprotocolgov<M> {
        type Target = ::ethers::contract::Contract<M>;
        fn deref(&self) -> &Self::Target {
            &self.0
        }
    }
    impl<M> ::core::ops::DerefMut for interestprotocolgov<M> {
        fn deref_mut(&mut self) -> &mut Self::Target {
            &mut self.0
        }
    }
    impl<M> ::core::fmt::Debug for interestprotocolgov<M> {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            f.debug_tuple(stringify!(interestprotocolgov))
                .field(&self.address())
                .finish()
        }
    }
    impl<M: ::ethers::providers::Middleware> interestprotocolgov<M> {
        /// Creates a new contract instance with the specified `ethers` client at
        /// `address`. The contract derefs to a `ethers::Contract` object.
        pub fn new<T: Into<::ethers::core::types::Address>>(
            address: T,
            client: ::std::sync::Arc<M>,
        ) -> Self {
            Self(
                ::ethers::contract::Contract::new(
                    address.into(),
                    INTERESTPROTOCOLGOV_ABI.clone(),
                    client,
                ),
            )
        }
        ///Calls the contract's `BALLOT_TYPEHASH` (0xdeaaa7cc) function
        pub fn ballot_typehash(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, [u8; 32]> {
            self.0
                .method_hash([222, 170, 167, 204], ())
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
        ///Calls the contract's `GRACE_PERIOD` (0xc1a287e2) function
        pub fn grace_period(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([193, 162, 135, 226], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `_setDelay` (0xfc176c04) function
        pub fn set_delay(
            &self,
            proposal_timelock_delay: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([252, 23, 108, 4], proposal_timelock_delay)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `_setEmergencyDelay` (0x50442098) function
        pub fn set_emergency_delay(
            &self,
            emergency_timelock_delay: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([80, 68, 32, 152], emergency_timelock_delay)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `_setEmergencyQuorumVotes` (0xf0843ba8) function
        pub fn set_emergency_quorum_votes(
            &self,
            new_emergency_quorum_votes: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([240, 132, 59, 168], new_emergency_quorum_votes)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `_setEmergencyVotingPeriod` (0xabaac6a8) function
        pub fn set_emergency_voting_period(
            &self,
            new_emergency_voting_period: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([171, 170, 198, 168], new_emergency_voting_period)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `_setNewToken` (0x140499ea) function
        pub fn set_new_token(
            &self,
            token: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([20, 4, 153, 234], token)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `_setOptimisticDelay` (0x2fedff59) function
        pub fn set_optimistic_delay(
            &self,
            new_optimistic_voting_delay: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([47, 237, 255, 89], new_optimistic_voting_delay)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `_setOptimisticQuorumVotes` (0x806bd581) function
        pub fn set_optimistic_quorum_votes(
            &self,
            new_optimistic_quorum_votes: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([128, 107, 213, 129], new_optimistic_quorum_votes)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `_setProposalThreshold` (0x17ba1b8b) function
        pub fn set_proposal_threshold(
            &self,
            new_proposal_threshold: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([23, 186, 27, 139], new_proposal_threshold)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `_setQuorumVotes` (0x86d37e8b) function
        pub fn set_quorum_votes(
            &self,
            new_quorum_votes: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([134, 211, 126, 139], new_quorum_votes)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `_setVotingDelay` (0x1dfb1b5a) function
        pub fn set_voting_delay(
            &self,
            new_voting_delay: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([29, 251, 27, 90], new_voting_delay)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `_setVotingPeriod` (0x0ea2d98c) function
        pub fn set_voting_period(
            &self,
            new_voting_period: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([14, 162, 217, 140], new_voting_period)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `_setWhitelistAccountExpiration` (0x4d6733d2) function
        pub fn set_whitelist_account_expiration(
            &self,
            account: ::ethers::core::types::Address,
            expiration: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([77, 103, 51, 210], (account, expiration))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `_setWhitelistGuardian` (0x99533365) function
        pub fn set_whitelist_guardian(
            &self,
            account: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([153, 83, 51, 101], account)
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
        ///Calls the contract's `castVote` (0x56781388) function
        pub fn cast_vote(
            &self,
            proposal_id: ::ethers::core::types::U256,
            support: u8,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([86, 120, 19, 136], (proposal_id, support))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `castVoteBySig` (0x3bccf4fd) function
        pub fn cast_vote_by_sig(
            &self,
            proposal_id: ::ethers::core::types::U256,
            support: u8,
            v: u8,
            r: [u8; 32],
            s: [u8; 32],
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([59, 204, 244, 253], (proposal_id, support, v, r, s))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `castVoteWithReason` (0x7b3c71d3) function
        pub fn cast_vote_with_reason(
            &self,
            proposal_id: ::ethers::core::types::U256,
            support: u8,
            reason: ::std::string::String,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([123, 60, 113, 211], (proposal_id, support, reason))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `emergencyQuorumVotes` (0xd50572ee) function
        pub fn emergency_quorum_votes(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([213, 5, 114, 238], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `emergencyTimelockDelay` (0xde7bc127) function
        pub fn emergency_timelock_delay(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([222, 123, 193, 39], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `emergencyVotingPeriod` (0x18b62629) function
        pub fn emergency_voting_period(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([24, 182, 38, 41], ())
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
        ///Calls the contract's `executeTransaction` (0x0825f38f) function
        pub fn execute_transaction(
            &self,
            target: ::ethers::core::types::Address,
            value: ::ethers::core::types::U256,
            signature: ::std::string::String,
            data: ::ethers::core::types::Bytes,
            eta: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([8, 37, 243, 143], (target, value, signature, data, eta))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getActions` (0x328dd982) function
        pub fn get_actions(
            &self,
            proposal_id: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<
            M,
            (
                ::std::vec::Vec<::ethers::core::types::Address>,
                ::std::vec::Vec<::ethers::core::types::U256>,
                ::std::vec::Vec<::std::string::String>,
                ::std::vec::Vec<::ethers::core::types::Bytes>,
            ),
        > {
            self.0
                .method_hash([50, 141, 217, 130], proposal_id)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getReceipt` (0xe23a9a52) function
        pub fn get_receipt(
            &self,
            proposal_id: ::ethers::core::types::U256,
            voter: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, Receipt> {
            self.0
                .method_hash([226, 58, 154, 82], (proposal_id, voter))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `implementation` (0x5c60da1b) function
        pub fn implementation(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<
            M,
            ::ethers::core::types::Address,
        > {
            self.0
                .method_hash([92, 96, 218, 27], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `initialProposalId` (0xfc4eee42) function
        pub fn initial_proposal_id(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([252, 78, 238, 66], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `initialize` (0xc4d66de8) function
        pub fn initialize(
            &self,
            ipt: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([196, 214, 109, 232], ipt)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `initialized` (0x158ef93e) function
        pub fn initialized(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([21, 142, 249, 62], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `ipt` (0xfc66ff14) function
        pub fn ipt(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<
            M,
            ::ethers::core::types::Address,
        > {
            self.0
                .method_hash([252, 102, 255, 20], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `isWhitelisted` (0x3af32abf) function
        pub fn is_whitelisted(
            &self,
            account: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([58, 243, 42, 191], account)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `latestProposalIds` (0x17977c61) function
        pub fn latest_proposal_ids(
            &self,
            p0: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([23, 151, 124, 97], p0)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `maxWhitelistPeriod` (0xa6d8784a) function
        pub fn max_whitelist_period(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([166, 216, 120, 74], ())
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
        ///Calls the contract's `optimisticQuorumVotes` (0xc9fb9e87) function
        pub fn optimistic_quorum_votes(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([201, 251, 158, 135], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `optimisticVotingDelay` (0xe837159c) function
        pub fn optimistic_voting_delay(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([232, 55, 21, 156], ())
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
        ///Calls the contract's `proposalMaxOperations` (0x7bdbe4d0) function
        pub fn proposal_max_operations(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([123, 219, 228, 208], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `proposalReceipts` (0x66176743) function
        pub fn proposal_receipts(
            &self,
            p0: ::ethers::core::types::U256,
            p1: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, (bool, u8, u128)> {
            self.0
                .method_hash([102, 23, 103, 67], (p0, p1))
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
        ///Calls the contract's `proposalTimelockDelay` (0x7cae57bb) function
        pub fn proposal_timelock_delay(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([124, 174, 87, 187], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `proposals` (0x013cf08b) function
        pub fn proposals(
            &self,
            p0: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<
            M,
            (
                ::ethers::core::types::U256,
                ::ethers::core::types::Address,
                ::ethers::core::types::U256,
                ::ethers::core::types::U256,
                ::ethers::core::types::U256,
                ::ethers::core::types::U256,
                ::ethers::core::types::U256,
                ::ethers::core::types::U256,
                bool,
                bool,
                bool,
                ::ethers::core::types::U256,
                ::ethers::core::types::U256,
            ),
        > {
            self.0
                .method_hash([1, 60, 240, 139], p0)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `propose` (0xf682e04c) function
        pub fn propose(
            &self,
            targets: ::std::vec::Vec<::ethers::core::types::Address>,
            values: ::std::vec::Vec<::ethers::core::types::U256>,
            signatures: ::std::vec::Vec<::std::string::String>,
            calldatas: ::std::vec::Vec<::ethers::core::types::Bytes>,
            description: ::std::string::String,
            emergency: bool,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash(
                    [246, 130, 224, 76],
                    (targets, values, signatures, calldatas, description, emergency),
                )
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
        ///Calls the contract's `queuedTransactions` (0xf2b06537) function
        pub fn queued_transactions(
            &self,
            p0: [u8; 32],
        ) -> ::ethers::contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([242, 176, 101, 55], p0)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `quorumVotes` (0x24bc1a64) function
        pub fn quorum_votes(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([36, 188, 26, 100], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `setMaxWhitelistPeriod` (0x62775f19) function
        pub fn set_max_whitelist_period(
            &self,
            second: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([98, 119, 95, 25], second)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `state` (0x3e4f49e6) function
        pub fn state(
            &self,
            proposal_id: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, u8> {
            self.0
                .method_hash([62, 79, 73, 230], proposal_id)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `votingDelay` (0x3932abb1) function
        pub fn voting_delay(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([57, 50, 171, 177], ())
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
        ///Calls the contract's `whitelistAccountExpirations` (0x38bd0dda) function
        pub fn whitelist_account_expirations(
            &self,
            p0: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([56, 189, 13, 218], p0)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `whitelistGuardian` (0xc5a8425d) function
        pub fn whitelist_guardian(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<
            M,
            ::ethers::core::types::Address,
        > {
            self.0
                .method_hash([197, 168, 66, 93], ())
                .expect("method not found (this should never happen)")
        }
        ///Gets the contract's `CancelTransaction` event
        pub fn cancel_transaction_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            CancelTransactionFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `EmergencyVotingPeriodSet` event
        pub fn emergency_voting_period_set_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            EmergencyVotingPeriodSetFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `ExecuteTransaction` event
        pub fn execute_transaction_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            ExecuteTransactionFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `NewAdmin` event
        pub fn new_admin_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            NewAdminFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `NewDelay` event
        pub fn new_delay_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            NewDelayFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `NewEmergencyDelay` event
        pub fn new_emergency_delay_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            NewEmergencyDelayFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `NewEmergencyQuorum` event
        pub fn new_emergency_quorum_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            NewEmergencyQuorumFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `NewImplementation` event
        pub fn new_implementation_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            NewImplementationFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `NewPendingAdmin` event
        pub fn new_pending_admin_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            NewPendingAdminFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `NewQuorum` event
        pub fn new_quorum_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            NewQuorumFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `OptimisticQuorumVotesSet` event
        pub fn optimistic_quorum_votes_set_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            OptimisticQuorumVotesSetFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `OptimisticVotingDelaySet` event
        pub fn optimistic_voting_delay_set_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            OptimisticVotingDelaySetFilter,
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
        ///Gets the contract's `ProposalThresholdSet` event
        pub fn proposal_threshold_set_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            ProposalThresholdSetFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `QueueTransaction` event
        pub fn queue_transaction_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            QueueTransactionFilter,
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
        ///Gets the contract's `VotingDelaySet` event
        pub fn voting_delay_set_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            VotingDelaySetFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `VotingPeriodSet` event
        pub fn voting_period_set_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            VotingPeriodSetFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `WhitelistAccountExpirationSet` event
        pub fn whitelist_account_expiration_set_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            WhitelistAccountExpirationSetFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `WhitelistGuardianSet` event
        pub fn whitelist_guardian_set_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            WhitelistGuardianSetFilter,
        > {
            self.0.event()
        }
        /// Returns an `Event` builder for all the events of this contract.
        pub fn events(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            interestprotocolgovEvents,
        > {
            self.0.event_with_filter(::core::default::Default::default())
        }
    }
    impl<M: ::ethers::providers::Middleware> From<::ethers::contract::Contract<M>>
    for interestprotocolgov<M> {
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
        name = "CancelTransaction",
        abi = "CancelTransaction(bytes32,address,uint256,string,bytes,uint256)"
    )]
    pub struct CancelTransactionFilter {
        #[ethevent(indexed)]
        pub tx_hash: [u8; 32],
        #[ethevent(indexed)]
        pub target: ::ethers::core::types::Address,
        pub value: ::ethers::core::types::U256,
        pub signature: ::std::string::String,
        pub data: ::ethers::core::types::Bytes,
        pub eta: ::ethers::core::types::U256,
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
        name = "EmergencyVotingPeriodSet",
        abi = "EmergencyVotingPeriodSet(uint256,uint256)"
    )]
    pub struct EmergencyVotingPeriodSetFilter {
        pub old_emergency_voting_period: ::ethers::core::types::U256,
        pub emergency_voting_period: ::ethers::core::types::U256,
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
        name = "ExecuteTransaction",
        abi = "ExecuteTransaction(bytes32,address,uint256,string,bytes,uint256)"
    )]
    pub struct ExecuteTransactionFilter {
        #[ethevent(indexed)]
        pub tx_hash: [u8; 32],
        #[ethevent(indexed)]
        pub target: ::ethers::core::types::Address,
        pub value: ::ethers::core::types::U256,
        pub signature: ::std::string::String,
        pub data: ::ethers::core::types::Bytes,
        pub eta: ::ethers::core::types::U256,
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
    #[ethevent(name = "NewAdmin", abi = "NewAdmin(address,address)")]
    pub struct NewAdminFilter {
        pub old_admin: ::ethers::core::types::Address,
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
        Hash
    )]
    #[ethevent(name = "NewDelay", abi = "NewDelay(uint256,uint256)")]
    pub struct NewDelayFilter {
        pub old_timelock_delay: ::ethers::core::types::U256,
        pub proposal_timelock_delay: ::ethers::core::types::U256,
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
    #[ethevent(name = "NewEmergencyDelay", abi = "NewEmergencyDelay(uint256,uint256)")]
    pub struct NewEmergencyDelayFilter {
        pub old_emergency_timelock_delay: ::ethers::core::types::U256,
        pub emergency_timelock_delay: ::ethers::core::types::U256,
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
    #[ethevent(name = "NewEmergencyQuorum", abi = "NewEmergencyQuorum(uint256,uint256)")]
    pub struct NewEmergencyQuorumFilter {
        pub old_emergency_quorum_votes: ::ethers::core::types::U256,
        pub emergency_quorum_votes: ::ethers::core::types::U256,
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
    #[ethevent(name = "NewImplementation", abi = "NewImplementation(address,address)")]
    pub struct NewImplementationFilter {
        pub old_implementation: ::ethers::core::types::Address,
        pub new_implementation: ::ethers::core::types::Address,
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
    #[ethevent(name = "NewPendingAdmin", abi = "NewPendingAdmin(address,address)")]
    pub struct NewPendingAdminFilter {
        pub old_pending_admin: ::ethers::core::types::Address,
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
        Hash
    )]
    #[ethevent(name = "NewQuorum", abi = "NewQuorum(uint256,uint256)")]
    pub struct NewQuorumFilter {
        pub old_quorum_votes: ::ethers::core::types::U256,
        pub quorum_votes: ::ethers::core::types::U256,
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
        name = "OptimisticQuorumVotesSet",
        abi = "OptimisticQuorumVotesSet(uint256,uint256)"
    )]
    pub struct OptimisticQuorumVotesSetFilter {
        pub old_optimistic_quorum_votes: ::ethers::core::types::U256,
        pub optimistic_quorum_votes: ::ethers::core::types::U256,
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
        name = "OptimisticVotingDelaySet",
        abi = "OptimisticVotingDelaySet(uint256,uint256)"
    )]
    pub struct OptimisticVotingDelaySetFilter {
        pub old_optimistic_voting_delay: ::ethers::core::types::U256,
        pub optimistic_voting_delay: ::ethers::core::types::U256,
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
        #[ethevent(indexed)]
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
        abi = "ProposalCreated(uint256,address,address[],uint256[],string[],bytes[],uint256,uint256,string)"
    )]
    pub struct ProposalCreatedFilter {
        #[ethevent(indexed)]
        pub id: ::ethers::core::types::U256,
        #[ethevent(indexed)]
        pub proposer: ::ethers::core::types::Address,
        pub targets: ::std::vec::Vec<::ethers::core::types::Address>,
        pub values: ::std::vec::Vec<::ethers::core::types::U256>,
        pub signatures: ::std::vec::Vec<::std::string::String>,
        pub calldatas: ::std::vec::Vec<::ethers::core::types::Bytes>,
        #[ethevent(indexed)]
        pub start_block: ::ethers::core::types::U256,
        pub end_block: ::ethers::core::types::U256,
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
        #[ethevent(indexed)]
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
    #[ethevent(name = "ProposalQueued", abi = "ProposalQueued(uint256,uint256)")]
    pub struct ProposalQueuedFilter {
        #[ethevent(indexed)]
        pub id: ::ethers::core::types::U256,
        pub eta: ::ethers::core::types::U256,
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
        name = "ProposalThresholdSet",
        abi = "ProposalThresholdSet(uint256,uint256)"
    )]
    pub struct ProposalThresholdSetFilter {
        pub old_proposal_threshold: ::ethers::core::types::U256,
        pub new_proposal_threshold: ::ethers::core::types::U256,
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
        name = "QueueTransaction",
        abi = "QueueTransaction(bytes32,address,uint256,string,bytes,uint256)"
    )]
    pub struct QueueTransactionFilter {
        #[ethevent(indexed)]
        pub tx_hash: [u8; 32],
        #[ethevent(indexed)]
        pub target: ::ethers::core::types::Address,
        pub value: ::ethers::core::types::U256,
        pub signature: ::std::string::String,
        pub data: ::ethers::core::types::Bytes,
        pub eta: ::ethers::core::types::U256,
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
        abi = "VoteCast(address,uint256,uint8,uint256,string)"
    )]
    pub struct VoteCastFilter {
        #[ethevent(indexed)]
        pub voter: ::ethers::core::types::Address,
        #[ethevent(indexed)]
        pub proposal_id: ::ethers::core::types::U256,
        pub support: u8,
        pub votes: ::ethers::core::types::U256,
        pub reason: ::std::string::String,
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
    #[ethevent(name = "VotingDelaySet", abi = "VotingDelaySet(uint256,uint256)")]
    pub struct VotingDelaySetFilter {
        pub old_voting_delay: ::ethers::core::types::U256,
        pub new_voting_delay: ::ethers::core::types::U256,
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
    #[ethevent(name = "VotingPeriodSet", abi = "VotingPeriodSet(uint256,uint256)")]
    pub struct VotingPeriodSetFilter {
        pub old_voting_period: ::ethers::core::types::U256,
        pub new_voting_period: ::ethers::core::types::U256,
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
        name = "WhitelistAccountExpirationSet",
        abi = "WhitelistAccountExpirationSet(address,uint256)"
    )]
    pub struct WhitelistAccountExpirationSetFilter {
        pub account: ::ethers::core::types::Address,
        pub expiration: ::ethers::core::types::U256,
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
        name = "WhitelistGuardianSet",
        abi = "WhitelistGuardianSet(address,address)"
    )]
    pub struct WhitelistGuardianSetFilter {
        pub old_guardian: ::ethers::core::types::Address,
        pub new_guardian: ::ethers::core::types::Address,
    }
    ///Container type for all of the contract's events
    #[derive(Clone, ::ethers::contract::EthAbiType, Debug, PartialEq, Eq, Hash)]
    pub enum interestprotocolgovEvents {
        CancelTransactionFilter(CancelTransactionFilter),
        EmergencyVotingPeriodSetFilter(EmergencyVotingPeriodSetFilter),
        ExecuteTransactionFilter(ExecuteTransactionFilter),
        NewAdminFilter(NewAdminFilter),
        NewDelayFilter(NewDelayFilter),
        NewEmergencyDelayFilter(NewEmergencyDelayFilter),
        NewEmergencyQuorumFilter(NewEmergencyQuorumFilter),
        NewImplementationFilter(NewImplementationFilter),
        NewPendingAdminFilter(NewPendingAdminFilter),
        NewQuorumFilter(NewQuorumFilter),
        OptimisticQuorumVotesSetFilter(OptimisticQuorumVotesSetFilter),
        OptimisticVotingDelaySetFilter(OptimisticVotingDelaySetFilter),
        ProposalCanceledFilter(ProposalCanceledFilter),
        ProposalCreatedFilter(ProposalCreatedFilter),
        ProposalExecutedFilter(ProposalExecutedFilter),
        ProposalQueuedFilter(ProposalQueuedFilter),
        ProposalThresholdSetFilter(ProposalThresholdSetFilter),
        QueueTransactionFilter(QueueTransactionFilter),
        VoteCastFilter(VoteCastFilter),
        VotingDelaySetFilter(VotingDelaySetFilter),
        VotingPeriodSetFilter(VotingPeriodSetFilter),
        WhitelistAccountExpirationSetFilter(WhitelistAccountExpirationSetFilter),
        WhitelistGuardianSetFilter(WhitelistGuardianSetFilter),
    }
    impl ::ethers::contract::EthLogDecode for interestprotocolgovEvents {
        fn decode_log(
            log: &::ethers::core::abi::RawLog,
        ) -> ::core::result::Result<Self, ::ethers::core::abi::Error> {
            if let Ok(decoded) = CancelTransactionFilter::decode_log(log) {
                return Ok(interestprotocolgovEvents::CancelTransactionFilter(decoded));
            }
            if let Ok(decoded) = EmergencyVotingPeriodSetFilter::decode_log(log) {
                return Ok(
                    interestprotocolgovEvents::EmergencyVotingPeriodSetFilter(decoded),
                );
            }
            if let Ok(decoded) = ExecuteTransactionFilter::decode_log(log) {
                return Ok(interestprotocolgovEvents::ExecuteTransactionFilter(decoded));
            }
            if let Ok(decoded) = NewAdminFilter::decode_log(log) {
                return Ok(interestprotocolgovEvents::NewAdminFilter(decoded));
            }
            if let Ok(decoded) = NewDelayFilter::decode_log(log) {
                return Ok(interestprotocolgovEvents::NewDelayFilter(decoded));
            }
            if let Ok(decoded) = NewEmergencyDelayFilter::decode_log(log) {
                return Ok(interestprotocolgovEvents::NewEmergencyDelayFilter(decoded));
            }
            if let Ok(decoded) = NewEmergencyQuorumFilter::decode_log(log) {
                return Ok(interestprotocolgovEvents::NewEmergencyQuorumFilter(decoded));
            }
            if let Ok(decoded) = NewImplementationFilter::decode_log(log) {
                return Ok(interestprotocolgovEvents::NewImplementationFilter(decoded));
            }
            if let Ok(decoded) = NewPendingAdminFilter::decode_log(log) {
                return Ok(interestprotocolgovEvents::NewPendingAdminFilter(decoded));
            }
            if let Ok(decoded) = NewQuorumFilter::decode_log(log) {
                return Ok(interestprotocolgovEvents::NewQuorumFilter(decoded));
            }
            if let Ok(decoded) = OptimisticQuorumVotesSetFilter::decode_log(log) {
                return Ok(
                    interestprotocolgovEvents::OptimisticQuorumVotesSetFilter(decoded),
                );
            }
            if let Ok(decoded) = OptimisticVotingDelaySetFilter::decode_log(log) {
                return Ok(
                    interestprotocolgovEvents::OptimisticVotingDelaySetFilter(decoded),
                );
            }
            if let Ok(decoded) = ProposalCanceledFilter::decode_log(log) {
                return Ok(interestprotocolgovEvents::ProposalCanceledFilter(decoded));
            }
            if let Ok(decoded) = ProposalCreatedFilter::decode_log(log) {
                return Ok(interestprotocolgovEvents::ProposalCreatedFilter(decoded));
            }
            if let Ok(decoded) = ProposalExecutedFilter::decode_log(log) {
                return Ok(interestprotocolgovEvents::ProposalExecutedFilter(decoded));
            }
            if let Ok(decoded) = ProposalQueuedFilter::decode_log(log) {
                return Ok(interestprotocolgovEvents::ProposalQueuedFilter(decoded));
            }
            if let Ok(decoded) = ProposalThresholdSetFilter::decode_log(log) {
                return Ok(
                    interestprotocolgovEvents::ProposalThresholdSetFilter(decoded),
                );
            }
            if let Ok(decoded) = QueueTransactionFilter::decode_log(log) {
                return Ok(interestprotocolgovEvents::QueueTransactionFilter(decoded));
            }
            if let Ok(decoded) = VoteCastFilter::decode_log(log) {
                return Ok(interestprotocolgovEvents::VoteCastFilter(decoded));
            }
            if let Ok(decoded) = VotingDelaySetFilter::decode_log(log) {
                return Ok(interestprotocolgovEvents::VotingDelaySetFilter(decoded));
            }
            if let Ok(decoded) = VotingPeriodSetFilter::decode_log(log) {
                return Ok(interestprotocolgovEvents::VotingPeriodSetFilter(decoded));
            }
            if let Ok(decoded) = WhitelistAccountExpirationSetFilter::decode_log(log) {
                return Ok(
                    interestprotocolgovEvents::WhitelistAccountExpirationSetFilter(
                        decoded,
                    ),
                );
            }
            if let Ok(decoded) = WhitelistGuardianSetFilter::decode_log(log) {
                return Ok(
                    interestprotocolgovEvents::WhitelistGuardianSetFilter(decoded),
                );
            }
            Err(::ethers::core::abi::Error::InvalidData)
        }
    }
    impl ::core::fmt::Display for interestprotocolgovEvents {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            match self {
                Self::CancelTransactionFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::EmergencyVotingPeriodSetFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::ExecuteTransactionFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::NewAdminFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::NewDelayFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::NewEmergencyDelayFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::NewEmergencyQuorumFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::NewImplementationFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::NewPendingAdminFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::NewQuorumFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::OptimisticQuorumVotesSetFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::OptimisticVotingDelaySetFilter(element) => {
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
                Self::ProposalThresholdSetFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::QueueTransactionFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::VoteCastFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::VotingDelaySetFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::VotingPeriodSetFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::WhitelistAccountExpirationSetFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::WhitelistGuardianSetFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
            }
        }
    }
    impl ::core::convert::From<CancelTransactionFilter> for interestprotocolgovEvents {
        fn from(value: CancelTransactionFilter) -> Self {
            Self::CancelTransactionFilter(value)
        }
    }
    impl ::core::convert::From<EmergencyVotingPeriodSetFilter>
    for interestprotocolgovEvents {
        fn from(value: EmergencyVotingPeriodSetFilter) -> Self {
            Self::EmergencyVotingPeriodSetFilter(value)
        }
    }
    impl ::core::convert::From<ExecuteTransactionFilter> for interestprotocolgovEvents {
        fn from(value: ExecuteTransactionFilter) -> Self {
            Self::ExecuteTransactionFilter(value)
        }
    }
    impl ::core::convert::From<NewAdminFilter> for interestprotocolgovEvents {
        fn from(value: NewAdminFilter) -> Self {
            Self::NewAdminFilter(value)
        }
    }
    impl ::core::convert::From<NewDelayFilter> for interestprotocolgovEvents {
        fn from(value: NewDelayFilter) -> Self {
            Self::NewDelayFilter(value)
        }
    }
    impl ::core::convert::From<NewEmergencyDelayFilter> for interestprotocolgovEvents {
        fn from(value: NewEmergencyDelayFilter) -> Self {
            Self::NewEmergencyDelayFilter(value)
        }
    }
    impl ::core::convert::From<NewEmergencyQuorumFilter> for interestprotocolgovEvents {
        fn from(value: NewEmergencyQuorumFilter) -> Self {
            Self::NewEmergencyQuorumFilter(value)
        }
    }
    impl ::core::convert::From<NewImplementationFilter> for interestprotocolgovEvents {
        fn from(value: NewImplementationFilter) -> Self {
            Self::NewImplementationFilter(value)
        }
    }
    impl ::core::convert::From<NewPendingAdminFilter> for interestprotocolgovEvents {
        fn from(value: NewPendingAdminFilter) -> Self {
            Self::NewPendingAdminFilter(value)
        }
    }
    impl ::core::convert::From<NewQuorumFilter> for interestprotocolgovEvents {
        fn from(value: NewQuorumFilter) -> Self {
            Self::NewQuorumFilter(value)
        }
    }
    impl ::core::convert::From<OptimisticQuorumVotesSetFilter>
    for interestprotocolgovEvents {
        fn from(value: OptimisticQuorumVotesSetFilter) -> Self {
            Self::OptimisticQuorumVotesSetFilter(value)
        }
    }
    impl ::core::convert::From<OptimisticVotingDelaySetFilter>
    for interestprotocolgovEvents {
        fn from(value: OptimisticVotingDelaySetFilter) -> Self {
            Self::OptimisticVotingDelaySetFilter(value)
        }
    }
    impl ::core::convert::From<ProposalCanceledFilter> for interestprotocolgovEvents {
        fn from(value: ProposalCanceledFilter) -> Self {
            Self::ProposalCanceledFilter(value)
        }
    }
    impl ::core::convert::From<ProposalCreatedFilter> for interestprotocolgovEvents {
        fn from(value: ProposalCreatedFilter) -> Self {
            Self::ProposalCreatedFilter(value)
        }
    }
    impl ::core::convert::From<ProposalExecutedFilter> for interestprotocolgovEvents {
        fn from(value: ProposalExecutedFilter) -> Self {
            Self::ProposalExecutedFilter(value)
        }
    }
    impl ::core::convert::From<ProposalQueuedFilter> for interestprotocolgovEvents {
        fn from(value: ProposalQueuedFilter) -> Self {
            Self::ProposalQueuedFilter(value)
        }
    }
    impl ::core::convert::From<ProposalThresholdSetFilter>
    for interestprotocolgovEvents {
        fn from(value: ProposalThresholdSetFilter) -> Self {
            Self::ProposalThresholdSetFilter(value)
        }
    }
    impl ::core::convert::From<QueueTransactionFilter> for interestprotocolgovEvents {
        fn from(value: QueueTransactionFilter) -> Self {
            Self::QueueTransactionFilter(value)
        }
    }
    impl ::core::convert::From<VoteCastFilter> for interestprotocolgovEvents {
        fn from(value: VoteCastFilter) -> Self {
            Self::VoteCastFilter(value)
        }
    }
    impl ::core::convert::From<VotingDelaySetFilter> for interestprotocolgovEvents {
        fn from(value: VotingDelaySetFilter) -> Self {
            Self::VotingDelaySetFilter(value)
        }
    }
    impl ::core::convert::From<VotingPeriodSetFilter> for interestprotocolgovEvents {
        fn from(value: VotingPeriodSetFilter) -> Self {
            Self::VotingPeriodSetFilter(value)
        }
    }
    impl ::core::convert::From<WhitelistAccountExpirationSetFilter>
    for interestprotocolgovEvents {
        fn from(value: WhitelistAccountExpirationSetFilter) -> Self {
            Self::WhitelistAccountExpirationSetFilter(value)
        }
    }
    impl ::core::convert::From<WhitelistGuardianSetFilter>
    for interestprotocolgovEvents {
        fn from(value: WhitelistGuardianSetFilter) -> Self {
            Self::WhitelistGuardianSetFilter(value)
        }
    }
    ///Container type for all input parameters for the `BALLOT_TYPEHASH` function with signature `BALLOT_TYPEHASH()` and selector `0xdeaaa7cc`
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
    #[ethcall(name = "BALLOT_TYPEHASH", abi = "BALLOT_TYPEHASH()")]
    pub struct BallotTypehashCall;
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
    ///Container type for all input parameters for the `GRACE_PERIOD` function with signature `GRACE_PERIOD()` and selector `0xc1a287e2`
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
    #[ethcall(name = "GRACE_PERIOD", abi = "GRACE_PERIOD()")]
    pub struct GracePeriodCall;
    ///Container type for all input parameters for the `_setDelay` function with signature `_setDelay(uint256)` and selector `0xfc176c04`
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
    #[ethcall(name = "_setDelay", abi = "_setDelay(uint256)")]
    pub struct SetDelayCall {
        pub proposal_timelock_delay: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `_setEmergencyDelay` function with signature `_setEmergencyDelay(uint256)` and selector `0x50442098`
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
    #[ethcall(name = "_setEmergencyDelay", abi = "_setEmergencyDelay(uint256)")]
    pub struct SetEmergencyDelayCall {
        pub emergency_timelock_delay: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `_setEmergencyQuorumVotes` function with signature `_setEmergencyQuorumVotes(uint256)` and selector `0xf0843ba8`
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
        name = "_setEmergencyQuorumVotes",
        abi = "_setEmergencyQuorumVotes(uint256)"
    )]
    pub struct SetEmergencyQuorumVotesCall {
        pub new_emergency_quorum_votes: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `_setEmergencyVotingPeriod` function with signature `_setEmergencyVotingPeriod(uint256)` and selector `0xabaac6a8`
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
        name = "_setEmergencyVotingPeriod",
        abi = "_setEmergencyVotingPeriod(uint256)"
    )]
    pub struct SetEmergencyVotingPeriodCall {
        pub new_emergency_voting_period: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `_setNewToken` function with signature `_setNewToken(address)` and selector `0x140499ea`
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
    #[ethcall(name = "_setNewToken", abi = "_setNewToken(address)")]
    pub struct SetNewTokenCall {
        pub token: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `_setOptimisticDelay` function with signature `_setOptimisticDelay(uint256)` and selector `0x2fedff59`
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
    #[ethcall(name = "_setOptimisticDelay", abi = "_setOptimisticDelay(uint256)")]
    pub struct SetOptimisticDelayCall {
        pub new_optimistic_voting_delay: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `_setOptimisticQuorumVotes` function with signature `_setOptimisticQuorumVotes(uint256)` and selector `0x806bd581`
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
        name = "_setOptimisticQuorumVotes",
        abi = "_setOptimisticQuorumVotes(uint256)"
    )]
    pub struct SetOptimisticQuorumVotesCall {
        pub new_optimistic_quorum_votes: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `_setProposalThreshold` function with signature `_setProposalThreshold(uint256)` and selector `0x17ba1b8b`
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
    #[ethcall(name = "_setProposalThreshold", abi = "_setProposalThreshold(uint256)")]
    pub struct SetProposalThresholdCall {
        pub new_proposal_threshold: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `_setQuorumVotes` function with signature `_setQuorumVotes(uint256)` and selector `0x86d37e8b`
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
    #[ethcall(name = "_setQuorumVotes", abi = "_setQuorumVotes(uint256)")]
    pub struct SetQuorumVotesCall {
        pub new_quorum_votes: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `_setVotingDelay` function with signature `_setVotingDelay(uint256)` and selector `0x1dfb1b5a`
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
    #[ethcall(name = "_setVotingDelay", abi = "_setVotingDelay(uint256)")]
    pub struct SetVotingDelayCall {
        pub new_voting_delay: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `_setVotingPeriod` function with signature `_setVotingPeriod(uint256)` and selector `0x0ea2d98c`
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
    #[ethcall(name = "_setVotingPeriod", abi = "_setVotingPeriod(uint256)")]
    pub struct SetVotingPeriodCall {
        pub new_voting_period: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `_setWhitelistAccountExpiration` function with signature `_setWhitelistAccountExpiration(address,uint256)` and selector `0x4d6733d2`
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
        name = "_setWhitelistAccountExpiration",
        abi = "_setWhitelistAccountExpiration(address,uint256)"
    )]
    pub struct SetWhitelistAccountExpirationCall {
        pub account: ::ethers::core::types::Address,
        pub expiration: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `_setWhitelistGuardian` function with signature `_setWhitelistGuardian(address)` and selector `0x99533365`
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
    #[ethcall(name = "_setWhitelistGuardian", abi = "_setWhitelistGuardian(address)")]
    pub struct SetWhitelistGuardianCall {
        pub account: ::ethers::core::types::Address,
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
    ///Container type for all input parameters for the `castVote` function with signature `castVote(uint256,uint8)` and selector `0x56781388`
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
    #[ethcall(name = "castVote", abi = "castVote(uint256,uint8)")]
    pub struct CastVoteCall {
        pub proposal_id: ::ethers::core::types::U256,
        pub support: u8,
    }
    ///Container type for all input parameters for the `castVoteBySig` function with signature `castVoteBySig(uint256,uint8,uint8,bytes32,bytes32)` and selector `0x3bccf4fd`
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
        name = "castVoteBySig",
        abi = "castVoteBySig(uint256,uint8,uint8,bytes32,bytes32)"
    )]
    pub struct CastVoteBySigCall {
        pub proposal_id: ::ethers::core::types::U256,
        pub support: u8,
        pub v: u8,
        pub r: [u8; 32],
        pub s: [u8; 32],
    }
    ///Container type for all input parameters for the `castVoteWithReason` function with signature `castVoteWithReason(uint256,uint8,string)` and selector `0x7b3c71d3`
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
        name = "castVoteWithReason",
        abi = "castVoteWithReason(uint256,uint8,string)"
    )]
    pub struct CastVoteWithReasonCall {
        pub proposal_id: ::ethers::core::types::U256,
        pub support: u8,
        pub reason: ::std::string::String,
    }
    ///Container type for all input parameters for the `emergencyQuorumVotes` function with signature `emergencyQuorumVotes()` and selector `0xd50572ee`
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
    #[ethcall(name = "emergencyQuorumVotes", abi = "emergencyQuorumVotes()")]
    pub struct EmergencyQuorumVotesCall;
    ///Container type for all input parameters for the `emergencyTimelockDelay` function with signature `emergencyTimelockDelay()` and selector `0xde7bc127`
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
    #[ethcall(name = "emergencyTimelockDelay", abi = "emergencyTimelockDelay()")]
    pub struct EmergencyTimelockDelayCall;
    ///Container type for all input parameters for the `emergencyVotingPeriod` function with signature `emergencyVotingPeriod()` and selector `0x18b62629`
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
    #[ethcall(name = "emergencyVotingPeriod", abi = "emergencyVotingPeriod()")]
    pub struct EmergencyVotingPeriodCall;
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
    ///Container type for all input parameters for the `executeTransaction` function with signature `executeTransaction(address,uint256,string,bytes,uint256)` and selector `0x0825f38f`
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
        name = "executeTransaction",
        abi = "executeTransaction(address,uint256,string,bytes,uint256)"
    )]
    pub struct ExecuteTransactionCall {
        pub target: ::ethers::core::types::Address,
        pub value: ::ethers::core::types::U256,
        pub signature: ::std::string::String,
        pub data: ::ethers::core::types::Bytes,
        pub eta: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `getActions` function with signature `getActions(uint256)` and selector `0x328dd982`
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
    #[ethcall(name = "getActions", abi = "getActions(uint256)")]
    pub struct GetActionsCall {
        pub proposal_id: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `getReceipt` function with signature `getReceipt(uint256,address)` and selector `0xe23a9a52`
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
    #[ethcall(name = "getReceipt", abi = "getReceipt(uint256,address)")]
    pub struct GetReceiptCall {
        pub proposal_id: ::ethers::core::types::U256,
        pub voter: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `implementation` function with signature `implementation()` and selector `0x5c60da1b`
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
    #[ethcall(name = "implementation", abi = "implementation()")]
    pub struct ImplementationCall;
    ///Container type for all input parameters for the `initialProposalId` function with signature `initialProposalId()` and selector `0xfc4eee42`
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
    #[ethcall(name = "initialProposalId", abi = "initialProposalId()")]
    pub struct InitialProposalIdCall;
    ///Container type for all input parameters for the `initialize` function with signature `initialize(address)` and selector `0xc4d66de8`
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
    #[ethcall(name = "initialize", abi = "initialize(address)")]
    pub struct InitializeCall {
        pub ipt: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `initialized` function with signature `initialized()` and selector `0x158ef93e`
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
    #[ethcall(name = "initialized", abi = "initialized()")]
    pub struct InitializedCall;
    ///Container type for all input parameters for the `ipt` function with signature `ipt()` and selector `0xfc66ff14`
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
    #[ethcall(name = "ipt", abi = "ipt()")]
    pub struct IptCall;
    ///Container type for all input parameters for the `isWhitelisted` function with signature `isWhitelisted(address)` and selector `0x3af32abf`
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
    #[ethcall(name = "isWhitelisted", abi = "isWhitelisted(address)")]
    pub struct IsWhitelistedCall {
        pub account: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `latestProposalIds` function with signature `latestProposalIds(address)` and selector `0x17977c61`
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
    #[ethcall(name = "latestProposalIds", abi = "latestProposalIds(address)")]
    pub struct LatestProposalIdsCall(pub ::ethers::core::types::Address);
    ///Container type for all input parameters for the `maxWhitelistPeriod` function with signature `maxWhitelistPeriod()` and selector `0xa6d8784a`
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
    #[ethcall(name = "maxWhitelistPeriod", abi = "maxWhitelistPeriod()")]
    pub struct MaxWhitelistPeriodCall;
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
    ///Container type for all input parameters for the `optimisticQuorumVotes` function with signature `optimisticQuorumVotes()` and selector `0xc9fb9e87`
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
    #[ethcall(name = "optimisticQuorumVotes", abi = "optimisticQuorumVotes()")]
    pub struct OptimisticQuorumVotesCall;
    ///Container type for all input parameters for the `optimisticVotingDelay` function with signature `optimisticVotingDelay()` and selector `0xe837159c`
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
    #[ethcall(name = "optimisticVotingDelay", abi = "optimisticVotingDelay()")]
    pub struct OptimisticVotingDelayCall;
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
    ///Container type for all input parameters for the `proposalMaxOperations` function with signature `proposalMaxOperations()` and selector `0x7bdbe4d0`
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
    #[ethcall(name = "proposalMaxOperations", abi = "proposalMaxOperations()")]
    pub struct ProposalMaxOperationsCall;
    ///Container type for all input parameters for the `proposalReceipts` function with signature `proposalReceipts(uint256,address)` and selector `0x66176743`
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
    #[ethcall(name = "proposalReceipts", abi = "proposalReceipts(uint256,address)")]
    pub struct ProposalReceiptsCall(
        pub ::ethers::core::types::U256,
        pub ::ethers::core::types::Address,
    );
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
    ///Container type for all input parameters for the `proposalTimelockDelay` function with signature `proposalTimelockDelay()` and selector `0x7cae57bb`
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
    #[ethcall(name = "proposalTimelockDelay", abi = "proposalTimelockDelay()")]
    pub struct ProposalTimelockDelayCall;
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
    ///Container type for all input parameters for the `propose` function with signature `propose(address[],uint256[],string[],bytes[],string,bool)` and selector `0xf682e04c`
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
        abi = "propose(address[],uint256[],string[],bytes[],string,bool)"
    )]
    pub struct ProposeCall {
        pub targets: ::std::vec::Vec<::ethers::core::types::Address>,
        pub values: ::std::vec::Vec<::ethers::core::types::U256>,
        pub signatures: ::std::vec::Vec<::std::string::String>,
        pub calldatas: ::std::vec::Vec<::ethers::core::types::Bytes>,
        pub description: ::std::string::String,
        pub emergency: bool,
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
    ///Container type for all input parameters for the `queuedTransactions` function with signature `queuedTransactions(bytes32)` and selector `0xf2b06537`
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
    #[ethcall(name = "queuedTransactions", abi = "queuedTransactions(bytes32)")]
    pub struct QueuedTransactionsCall(pub [u8; 32]);
    ///Container type for all input parameters for the `quorumVotes` function with signature `quorumVotes()` and selector `0x24bc1a64`
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
    #[ethcall(name = "quorumVotes", abi = "quorumVotes()")]
    pub struct QuorumVotesCall;
    ///Container type for all input parameters for the `setMaxWhitelistPeriod` function with signature `setMaxWhitelistPeriod(uint256)` and selector `0x62775f19`
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
    #[ethcall(name = "setMaxWhitelistPeriod", abi = "setMaxWhitelistPeriod(uint256)")]
    pub struct SetMaxWhitelistPeriodCall {
        pub second: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `state` function with signature `state(uint256)` and selector `0x3e4f49e6`
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
    #[ethcall(name = "state", abi = "state(uint256)")]
    pub struct StateCall {
        pub proposal_id: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `votingDelay` function with signature `votingDelay()` and selector `0x3932abb1`
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
    #[ethcall(name = "votingDelay", abi = "votingDelay()")]
    pub struct VotingDelayCall;
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
    ///Container type for all input parameters for the `whitelistAccountExpirations` function with signature `whitelistAccountExpirations(address)` and selector `0x38bd0dda`
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
        name = "whitelistAccountExpirations",
        abi = "whitelistAccountExpirations(address)"
    )]
    pub struct WhitelistAccountExpirationsCall(pub ::ethers::core::types::Address);
    ///Container type for all input parameters for the `whitelistGuardian` function with signature `whitelistGuardian()` and selector `0xc5a8425d`
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
    #[ethcall(name = "whitelistGuardian", abi = "whitelistGuardian()")]
    pub struct WhitelistGuardianCall;
    ///Container type for all of the contract's call
    #[derive(Clone, ::ethers::contract::EthAbiType, Debug, PartialEq, Eq, Hash)]
    pub enum interestprotocolgovCalls {
        BallotTypehash(BallotTypehashCall),
        DomainTypehash(DomainTypehashCall),
        GracePeriod(GracePeriodCall),
        SetDelay(SetDelayCall),
        SetEmergencyDelay(SetEmergencyDelayCall),
        SetEmergencyQuorumVotes(SetEmergencyQuorumVotesCall),
        SetEmergencyVotingPeriod(SetEmergencyVotingPeriodCall),
        SetNewToken(SetNewTokenCall),
        SetOptimisticDelay(SetOptimisticDelayCall),
        SetOptimisticQuorumVotes(SetOptimisticQuorumVotesCall),
        SetProposalThreshold(SetProposalThresholdCall),
        SetQuorumVotes(SetQuorumVotesCall),
        SetVotingDelay(SetVotingDelayCall),
        SetVotingPeriod(SetVotingPeriodCall),
        SetWhitelistAccountExpiration(SetWhitelistAccountExpirationCall),
        SetWhitelistGuardian(SetWhitelistGuardianCall),
        Cancel(CancelCall),
        CastVote(CastVoteCall),
        CastVoteBySig(CastVoteBySigCall),
        CastVoteWithReason(CastVoteWithReasonCall),
        EmergencyQuorumVotes(EmergencyQuorumVotesCall),
        EmergencyTimelockDelay(EmergencyTimelockDelayCall),
        EmergencyVotingPeriod(EmergencyVotingPeriodCall),
        Execute(ExecuteCall),
        ExecuteTransaction(ExecuteTransactionCall),
        GetActions(GetActionsCall),
        GetReceipt(GetReceiptCall),
        Implementation(ImplementationCall),
        InitialProposalId(InitialProposalIdCall),
        Initialize(InitializeCall),
        Initialized(InitializedCall),
        Ipt(IptCall),
        IsWhitelisted(IsWhitelistedCall),
        LatestProposalIds(LatestProposalIdsCall),
        MaxWhitelistPeriod(MaxWhitelistPeriodCall),
        Name(NameCall),
        OptimisticQuorumVotes(OptimisticQuorumVotesCall),
        OptimisticVotingDelay(OptimisticVotingDelayCall),
        ProposalCount(ProposalCountCall),
        ProposalMaxOperations(ProposalMaxOperationsCall),
        ProposalReceipts(ProposalReceiptsCall),
        ProposalThreshold(ProposalThresholdCall),
        ProposalTimelockDelay(ProposalTimelockDelayCall),
        Proposals(ProposalsCall),
        Propose(ProposeCall),
        Queue(QueueCall),
        QueuedTransactions(QueuedTransactionsCall),
        QuorumVotes(QuorumVotesCall),
        SetMaxWhitelistPeriod(SetMaxWhitelistPeriodCall),
        State(StateCall),
        VotingDelay(VotingDelayCall),
        VotingPeriod(VotingPeriodCall),
        WhitelistAccountExpirations(WhitelistAccountExpirationsCall),
        WhitelistGuardian(WhitelistGuardianCall),
    }
    impl ::ethers::core::abi::AbiDecode for interestprotocolgovCalls {
        fn decode(
            data: impl AsRef<[u8]>,
        ) -> ::core::result::Result<Self, ::ethers::core::abi::AbiError> {
            let data = data.as_ref();
            if let Ok(decoded)
                = <BallotTypehashCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::BallotTypehash(decoded));
            }
            if let Ok(decoded)
                = <DomainTypehashCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::DomainTypehash(decoded));
            }
            if let Ok(decoded)
                = <GracePeriodCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::GracePeriod(decoded));
            }
            if let Ok(decoded)
                = <SetDelayCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::SetDelay(decoded));
            }
            if let Ok(decoded)
                = <SetEmergencyDelayCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::SetEmergencyDelay(decoded));
            }
            if let Ok(decoded)
                = <SetEmergencyQuorumVotesCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::SetEmergencyQuorumVotes(decoded));
            }
            if let Ok(decoded)
                = <SetEmergencyVotingPeriodCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::SetEmergencyVotingPeriod(decoded));
            }
            if let Ok(decoded)
                = <SetNewTokenCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::SetNewToken(decoded));
            }
            if let Ok(decoded)
                = <SetOptimisticDelayCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::SetOptimisticDelay(decoded));
            }
            if let Ok(decoded)
                = <SetOptimisticQuorumVotesCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::SetOptimisticQuorumVotes(decoded));
            }
            if let Ok(decoded)
                = <SetProposalThresholdCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::SetProposalThreshold(decoded));
            }
            if let Ok(decoded)
                = <SetQuorumVotesCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::SetQuorumVotes(decoded));
            }
            if let Ok(decoded)
                = <SetVotingDelayCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::SetVotingDelay(decoded));
            }
            if let Ok(decoded)
                = <SetVotingPeriodCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::SetVotingPeriod(decoded));
            }
            if let Ok(decoded)
                = <SetWhitelistAccountExpirationCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::SetWhitelistAccountExpiration(decoded));
            }
            if let Ok(decoded)
                = <SetWhitelistGuardianCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::SetWhitelistGuardian(decoded));
            }
            if let Ok(decoded)
                = <CancelCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Cancel(decoded));
            }
            if let Ok(decoded)
                = <CastVoteCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::CastVote(decoded));
            }
            if let Ok(decoded)
                = <CastVoteBySigCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::CastVoteBySig(decoded));
            }
            if let Ok(decoded)
                = <CastVoteWithReasonCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::CastVoteWithReason(decoded));
            }
            if let Ok(decoded)
                = <EmergencyQuorumVotesCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::EmergencyQuorumVotes(decoded));
            }
            if let Ok(decoded)
                = <EmergencyTimelockDelayCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::EmergencyTimelockDelay(decoded));
            }
            if let Ok(decoded)
                = <EmergencyVotingPeriodCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::EmergencyVotingPeriod(decoded));
            }
            if let Ok(decoded)
                = <ExecuteCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Execute(decoded));
            }
            if let Ok(decoded)
                = <ExecuteTransactionCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::ExecuteTransaction(decoded));
            }
            if let Ok(decoded)
                = <GetActionsCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::GetActions(decoded));
            }
            if let Ok(decoded)
                = <GetReceiptCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::GetReceipt(decoded));
            }
            if let Ok(decoded)
                = <ImplementationCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Implementation(decoded));
            }
            if let Ok(decoded)
                = <InitialProposalIdCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::InitialProposalId(decoded));
            }
            if let Ok(decoded)
                = <InitializeCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Initialize(decoded));
            }
            if let Ok(decoded)
                = <InitializedCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Initialized(decoded));
            }
            if let Ok(decoded)
                = <IptCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Ipt(decoded));
            }
            if let Ok(decoded)
                = <IsWhitelistedCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::IsWhitelisted(decoded));
            }
            if let Ok(decoded)
                = <LatestProposalIdsCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::LatestProposalIds(decoded));
            }
            if let Ok(decoded)
                = <MaxWhitelistPeriodCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::MaxWhitelistPeriod(decoded));
            }
            if let Ok(decoded)
                = <NameCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Name(decoded));
            }
            if let Ok(decoded)
                = <OptimisticQuorumVotesCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::OptimisticQuorumVotes(decoded));
            }
            if let Ok(decoded)
                = <OptimisticVotingDelayCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::OptimisticVotingDelay(decoded));
            }
            if let Ok(decoded)
                = <ProposalCountCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::ProposalCount(decoded));
            }
            if let Ok(decoded)
                = <ProposalMaxOperationsCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::ProposalMaxOperations(decoded));
            }
            if let Ok(decoded)
                = <ProposalReceiptsCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::ProposalReceipts(decoded));
            }
            if let Ok(decoded)
                = <ProposalThresholdCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::ProposalThreshold(decoded));
            }
            if let Ok(decoded)
                = <ProposalTimelockDelayCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::ProposalTimelockDelay(decoded));
            }
            if let Ok(decoded)
                = <ProposalsCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Proposals(decoded));
            }
            if let Ok(decoded)
                = <ProposeCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Propose(decoded));
            }
            if let Ok(decoded)
                = <QueueCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Queue(decoded));
            }
            if let Ok(decoded)
                = <QueuedTransactionsCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::QueuedTransactions(decoded));
            }
            if let Ok(decoded)
                = <QuorumVotesCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::QuorumVotes(decoded));
            }
            if let Ok(decoded)
                = <SetMaxWhitelistPeriodCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::SetMaxWhitelistPeriod(decoded));
            }
            if let Ok(decoded)
                = <StateCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::State(decoded));
            }
            if let Ok(decoded)
                = <VotingDelayCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::VotingDelay(decoded));
            }
            if let Ok(decoded)
                = <VotingPeriodCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::VotingPeriod(decoded));
            }
            if let Ok(decoded)
                = <WhitelistAccountExpirationsCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::WhitelistAccountExpirations(decoded));
            }
            if let Ok(decoded)
                = <WhitelistGuardianCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::WhitelistGuardian(decoded));
            }
            Err(::ethers::core::abi::Error::InvalidData.into())
        }
    }
    impl ::ethers::core::abi::AbiEncode for interestprotocolgovCalls {
        fn encode(self) -> Vec<u8> {
            match self {
                Self::BallotTypehash(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::DomainTypehash(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GracePeriod(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::SetDelay(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::SetEmergencyDelay(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::SetEmergencyQuorumVotes(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::SetEmergencyVotingPeriod(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::SetNewToken(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::SetOptimisticDelay(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::SetOptimisticQuorumVotes(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::SetProposalThreshold(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::SetQuorumVotes(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::SetVotingDelay(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::SetVotingPeriod(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::SetWhitelistAccountExpiration(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::SetWhitelistGuardian(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::Cancel(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::CastVote(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::CastVoteBySig(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::CastVoteWithReason(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::EmergencyQuorumVotes(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::EmergencyTimelockDelay(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::EmergencyVotingPeriod(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::Execute(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::ExecuteTransaction(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetActions(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetReceipt(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::Implementation(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::InitialProposalId(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::Initialize(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::Initialized(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::Ipt(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::IsWhitelisted(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::LatestProposalIds(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::MaxWhitelistPeriod(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::Name(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::OptimisticQuorumVotes(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::OptimisticVotingDelay(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::ProposalCount(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::ProposalMaxOperations(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::ProposalReceipts(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::ProposalThreshold(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::ProposalTimelockDelay(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::Proposals(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::Propose(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::Queue(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::QueuedTransactions(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::QuorumVotes(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::SetMaxWhitelistPeriod(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::State(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::VotingDelay(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::VotingPeriod(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::WhitelistAccountExpirations(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::WhitelistGuardian(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
            }
        }
    }
    impl ::core::fmt::Display for interestprotocolgovCalls {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            match self {
                Self::BallotTypehash(element) => ::core::fmt::Display::fmt(element, f),
                Self::DomainTypehash(element) => ::core::fmt::Display::fmt(element, f),
                Self::GracePeriod(element) => ::core::fmt::Display::fmt(element, f),
                Self::SetDelay(element) => ::core::fmt::Display::fmt(element, f),
                Self::SetEmergencyDelay(element) => ::core::fmt::Display::fmt(element, f),
                Self::SetEmergencyQuorumVotes(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::SetEmergencyVotingPeriod(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::SetNewToken(element) => ::core::fmt::Display::fmt(element, f),
                Self::SetOptimisticDelay(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::SetOptimisticQuorumVotes(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::SetProposalThreshold(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::SetQuorumVotes(element) => ::core::fmt::Display::fmt(element, f),
                Self::SetVotingDelay(element) => ::core::fmt::Display::fmt(element, f),
                Self::SetVotingPeriod(element) => ::core::fmt::Display::fmt(element, f),
                Self::SetWhitelistAccountExpiration(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::SetWhitelistGuardian(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::Cancel(element) => ::core::fmt::Display::fmt(element, f),
                Self::CastVote(element) => ::core::fmt::Display::fmt(element, f),
                Self::CastVoteBySig(element) => ::core::fmt::Display::fmt(element, f),
                Self::CastVoteWithReason(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::EmergencyQuorumVotes(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::EmergencyTimelockDelay(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::EmergencyVotingPeriod(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::Execute(element) => ::core::fmt::Display::fmt(element, f),
                Self::ExecuteTransaction(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::GetActions(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetReceipt(element) => ::core::fmt::Display::fmt(element, f),
                Self::Implementation(element) => ::core::fmt::Display::fmt(element, f),
                Self::InitialProposalId(element) => ::core::fmt::Display::fmt(element, f),
                Self::Initialize(element) => ::core::fmt::Display::fmt(element, f),
                Self::Initialized(element) => ::core::fmt::Display::fmt(element, f),
                Self::Ipt(element) => ::core::fmt::Display::fmt(element, f),
                Self::IsWhitelisted(element) => ::core::fmt::Display::fmt(element, f),
                Self::LatestProposalIds(element) => ::core::fmt::Display::fmt(element, f),
                Self::MaxWhitelistPeriod(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::Name(element) => ::core::fmt::Display::fmt(element, f),
                Self::OptimisticQuorumVotes(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::OptimisticVotingDelay(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::ProposalCount(element) => ::core::fmt::Display::fmt(element, f),
                Self::ProposalMaxOperations(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::ProposalReceipts(element) => ::core::fmt::Display::fmt(element, f),
                Self::ProposalThreshold(element) => ::core::fmt::Display::fmt(element, f),
                Self::ProposalTimelockDelay(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::Proposals(element) => ::core::fmt::Display::fmt(element, f),
                Self::Propose(element) => ::core::fmt::Display::fmt(element, f),
                Self::Queue(element) => ::core::fmt::Display::fmt(element, f),
                Self::QueuedTransactions(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::QuorumVotes(element) => ::core::fmt::Display::fmt(element, f),
                Self::SetMaxWhitelistPeriod(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::State(element) => ::core::fmt::Display::fmt(element, f),
                Self::VotingDelay(element) => ::core::fmt::Display::fmt(element, f),
                Self::VotingPeriod(element) => ::core::fmt::Display::fmt(element, f),
                Self::WhitelistAccountExpirations(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::WhitelistGuardian(element) => ::core::fmt::Display::fmt(element, f),
            }
        }
    }
    impl ::core::convert::From<BallotTypehashCall> for interestprotocolgovCalls {
        fn from(value: BallotTypehashCall) -> Self {
            Self::BallotTypehash(value)
        }
    }
    impl ::core::convert::From<DomainTypehashCall> for interestprotocolgovCalls {
        fn from(value: DomainTypehashCall) -> Self {
            Self::DomainTypehash(value)
        }
    }
    impl ::core::convert::From<GracePeriodCall> for interestprotocolgovCalls {
        fn from(value: GracePeriodCall) -> Self {
            Self::GracePeriod(value)
        }
    }
    impl ::core::convert::From<SetDelayCall> for interestprotocolgovCalls {
        fn from(value: SetDelayCall) -> Self {
            Self::SetDelay(value)
        }
    }
    impl ::core::convert::From<SetEmergencyDelayCall> for interestprotocolgovCalls {
        fn from(value: SetEmergencyDelayCall) -> Self {
            Self::SetEmergencyDelay(value)
        }
    }
    impl ::core::convert::From<SetEmergencyQuorumVotesCall>
    for interestprotocolgovCalls {
        fn from(value: SetEmergencyQuorumVotesCall) -> Self {
            Self::SetEmergencyQuorumVotes(value)
        }
    }
    impl ::core::convert::From<SetEmergencyVotingPeriodCall>
    for interestprotocolgovCalls {
        fn from(value: SetEmergencyVotingPeriodCall) -> Self {
            Self::SetEmergencyVotingPeriod(value)
        }
    }
    impl ::core::convert::From<SetNewTokenCall> for interestprotocolgovCalls {
        fn from(value: SetNewTokenCall) -> Self {
            Self::SetNewToken(value)
        }
    }
    impl ::core::convert::From<SetOptimisticDelayCall> for interestprotocolgovCalls {
        fn from(value: SetOptimisticDelayCall) -> Self {
            Self::SetOptimisticDelay(value)
        }
    }
    impl ::core::convert::From<SetOptimisticQuorumVotesCall>
    for interestprotocolgovCalls {
        fn from(value: SetOptimisticQuorumVotesCall) -> Self {
            Self::SetOptimisticQuorumVotes(value)
        }
    }
    impl ::core::convert::From<SetProposalThresholdCall> for interestprotocolgovCalls {
        fn from(value: SetProposalThresholdCall) -> Self {
            Self::SetProposalThreshold(value)
        }
    }
    impl ::core::convert::From<SetQuorumVotesCall> for interestprotocolgovCalls {
        fn from(value: SetQuorumVotesCall) -> Self {
            Self::SetQuorumVotes(value)
        }
    }
    impl ::core::convert::From<SetVotingDelayCall> for interestprotocolgovCalls {
        fn from(value: SetVotingDelayCall) -> Self {
            Self::SetVotingDelay(value)
        }
    }
    impl ::core::convert::From<SetVotingPeriodCall> for interestprotocolgovCalls {
        fn from(value: SetVotingPeriodCall) -> Self {
            Self::SetVotingPeriod(value)
        }
    }
    impl ::core::convert::From<SetWhitelistAccountExpirationCall>
    for interestprotocolgovCalls {
        fn from(value: SetWhitelistAccountExpirationCall) -> Self {
            Self::SetWhitelistAccountExpiration(value)
        }
    }
    impl ::core::convert::From<SetWhitelistGuardianCall> for interestprotocolgovCalls {
        fn from(value: SetWhitelistGuardianCall) -> Self {
            Self::SetWhitelistGuardian(value)
        }
    }
    impl ::core::convert::From<CancelCall> for interestprotocolgovCalls {
        fn from(value: CancelCall) -> Self {
            Self::Cancel(value)
        }
    }
    impl ::core::convert::From<CastVoteCall> for interestprotocolgovCalls {
        fn from(value: CastVoteCall) -> Self {
            Self::CastVote(value)
        }
    }
    impl ::core::convert::From<CastVoteBySigCall> for interestprotocolgovCalls {
        fn from(value: CastVoteBySigCall) -> Self {
            Self::CastVoteBySig(value)
        }
    }
    impl ::core::convert::From<CastVoteWithReasonCall> for interestprotocolgovCalls {
        fn from(value: CastVoteWithReasonCall) -> Self {
            Self::CastVoteWithReason(value)
        }
    }
    impl ::core::convert::From<EmergencyQuorumVotesCall> for interestprotocolgovCalls {
        fn from(value: EmergencyQuorumVotesCall) -> Self {
            Self::EmergencyQuorumVotes(value)
        }
    }
    impl ::core::convert::From<EmergencyTimelockDelayCall> for interestprotocolgovCalls {
        fn from(value: EmergencyTimelockDelayCall) -> Self {
            Self::EmergencyTimelockDelay(value)
        }
    }
    impl ::core::convert::From<EmergencyVotingPeriodCall> for interestprotocolgovCalls {
        fn from(value: EmergencyVotingPeriodCall) -> Self {
            Self::EmergencyVotingPeriod(value)
        }
    }
    impl ::core::convert::From<ExecuteCall> for interestprotocolgovCalls {
        fn from(value: ExecuteCall) -> Self {
            Self::Execute(value)
        }
    }
    impl ::core::convert::From<ExecuteTransactionCall> for interestprotocolgovCalls {
        fn from(value: ExecuteTransactionCall) -> Self {
            Self::ExecuteTransaction(value)
        }
    }
    impl ::core::convert::From<GetActionsCall> for interestprotocolgovCalls {
        fn from(value: GetActionsCall) -> Self {
            Self::GetActions(value)
        }
    }
    impl ::core::convert::From<GetReceiptCall> for interestprotocolgovCalls {
        fn from(value: GetReceiptCall) -> Self {
            Self::GetReceipt(value)
        }
    }
    impl ::core::convert::From<ImplementationCall> for interestprotocolgovCalls {
        fn from(value: ImplementationCall) -> Self {
            Self::Implementation(value)
        }
    }
    impl ::core::convert::From<InitialProposalIdCall> for interestprotocolgovCalls {
        fn from(value: InitialProposalIdCall) -> Self {
            Self::InitialProposalId(value)
        }
    }
    impl ::core::convert::From<InitializeCall> for interestprotocolgovCalls {
        fn from(value: InitializeCall) -> Self {
            Self::Initialize(value)
        }
    }
    impl ::core::convert::From<InitializedCall> for interestprotocolgovCalls {
        fn from(value: InitializedCall) -> Self {
            Self::Initialized(value)
        }
    }
    impl ::core::convert::From<IptCall> for interestprotocolgovCalls {
        fn from(value: IptCall) -> Self {
            Self::Ipt(value)
        }
    }
    impl ::core::convert::From<IsWhitelistedCall> for interestprotocolgovCalls {
        fn from(value: IsWhitelistedCall) -> Self {
            Self::IsWhitelisted(value)
        }
    }
    impl ::core::convert::From<LatestProposalIdsCall> for interestprotocolgovCalls {
        fn from(value: LatestProposalIdsCall) -> Self {
            Self::LatestProposalIds(value)
        }
    }
    impl ::core::convert::From<MaxWhitelistPeriodCall> for interestprotocolgovCalls {
        fn from(value: MaxWhitelistPeriodCall) -> Self {
            Self::MaxWhitelistPeriod(value)
        }
    }
    impl ::core::convert::From<NameCall> for interestprotocolgovCalls {
        fn from(value: NameCall) -> Self {
            Self::Name(value)
        }
    }
    impl ::core::convert::From<OptimisticQuorumVotesCall> for interestprotocolgovCalls {
        fn from(value: OptimisticQuorumVotesCall) -> Self {
            Self::OptimisticQuorumVotes(value)
        }
    }
    impl ::core::convert::From<OptimisticVotingDelayCall> for interestprotocolgovCalls {
        fn from(value: OptimisticVotingDelayCall) -> Self {
            Self::OptimisticVotingDelay(value)
        }
    }
    impl ::core::convert::From<ProposalCountCall> for interestprotocolgovCalls {
        fn from(value: ProposalCountCall) -> Self {
            Self::ProposalCount(value)
        }
    }
    impl ::core::convert::From<ProposalMaxOperationsCall> for interestprotocolgovCalls {
        fn from(value: ProposalMaxOperationsCall) -> Self {
            Self::ProposalMaxOperations(value)
        }
    }
    impl ::core::convert::From<ProposalReceiptsCall> for interestprotocolgovCalls {
        fn from(value: ProposalReceiptsCall) -> Self {
            Self::ProposalReceipts(value)
        }
    }
    impl ::core::convert::From<ProposalThresholdCall> for interestprotocolgovCalls {
        fn from(value: ProposalThresholdCall) -> Self {
            Self::ProposalThreshold(value)
        }
    }
    impl ::core::convert::From<ProposalTimelockDelayCall> for interestprotocolgovCalls {
        fn from(value: ProposalTimelockDelayCall) -> Self {
            Self::ProposalTimelockDelay(value)
        }
    }
    impl ::core::convert::From<ProposalsCall> for interestprotocolgovCalls {
        fn from(value: ProposalsCall) -> Self {
            Self::Proposals(value)
        }
    }
    impl ::core::convert::From<ProposeCall> for interestprotocolgovCalls {
        fn from(value: ProposeCall) -> Self {
            Self::Propose(value)
        }
    }
    impl ::core::convert::From<QueueCall> for interestprotocolgovCalls {
        fn from(value: QueueCall) -> Self {
            Self::Queue(value)
        }
    }
    impl ::core::convert::From<QueuedTransactionsCall> for interestprotocolgovCalls {
        fn from(value: QueuedTransactionsCall) -> Self {
            Self::QueuedTransactions(value)
        }
    }
    impl ::core::convert::From<QuorumVotesCall> for interestprotocolgovCalls {
        fn from(value: QuorumVotesCall) -> Self {
            Self::QuorumVotes(value)
        }
    }
    impl ::core::convert::From<SetMaxWhitelistPeriodCall> for interestprotocolgovCalls {
        fn from(value: SetMaxWhitelistPeriodCall) -> Self {
            Self::SetMaxWhitelistPeriod(value)
        }
    }
    impl ::core::convert::From<StateCall> for interestprotocolgovCalls {
        fn from(value: StateCall) -> Self {
            Self::State(value)
        }
    }
    impl ::core::convert::From<VotingDelayCall> for interestprotocolgovCalls {
        fn from(value: VotingDelayCall) -> Self {
            Self::VotingDelay(value)
        }
    }
    impl ::core::convert::From<VotingPeriodCall> for interestprotocolgovCalls {
        fn from(value: VotingPeriodCall) -> Self {
            Self::VotingPeriod(value)
        }
    }
    impl ::core::convert::From<WhitelistAccountExpirationsCall>
    for interestprotocolgovCalls {
        fn from(value: WhitelistAccountExpirationsCall) -> Self {
            Self::WhitelistAccountExpirations(value)
        }
    }
    impl ::core::convert::From<WhitelistGuardianCall> for interestprotocolgovCalls {
        fn from(value: WhitelistGuardianCall) -> Self {
            Self::WhitelistGuardian(value)
        }
    }
    ///Container type for all return fields from the `BALLOT_TYPEHASH` function with signature `BALLOT_TYPEHASH()` and selector `0xdeaaa7cc`
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
    pub struct BallotTypehashReturn(pub [u8; 32]);
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
    ///Container type for all return fields from the `GRACE_PERIOD` function with signature `GRACE_PERIOD()` and selector `0xc1a287e2`
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
    pub struct GracePeriodReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `emergencyQuorumVotes` function with signature `emergencyQuorumVotes()` and selector `0xd50572ee`
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
    pub struct EmergencyQuorumVotesReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `emergencyTimelockDelay` function with signature `emergencyTimelockDelay()` and selector `0xde7bc127`
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
    pub struct EmergencyTimelockDelayReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `emergencyVotingPeriod` function with signature `emergencyVotingPeriod()` and selector `0x18b62629`
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
    pub struct EmergencyVotingPeriodReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `getActions` function with signature `getActions(uint256)` and selector `0x328dd982`
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
    pub struct GetActionsReturn {
        pub targets: ::std::vec::Vec<::ethers::core::types::Address>,
        pub values: ::std::vec::Vec<::ethers::core::types::U256>,
        pub signatures: ::std::vec::Vec<::std::string::String>,
        pub calldatas: ::std::vec::Vec<::ethers::core::types::Bytes>,
    }
    ///Container type for all return fields from the `getReceipt` function with signature `getReceipt(uint256,address)` and selector `0xe23a9a52`
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
    pub struct GetReceiptReturn(pub Receipt);
    ///Container type for all return fields from the `implementation` function with signature `implementation()` and selector `0x5c60da1b`
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
    pub struct ImplementationReturn(pub ::ethers::core::types::Address);
    ///Container type for all return fields from the `initialProposalId` function with signature `initialProposalId()` and selector `0xfc4eee42`
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
    pub struct InitialProposalIdReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `initialized` function with signature `initialized()` and selector `0x158ef93e`
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
    pub struct InitializedReturn(pub bool);
    ///Container type for all return fields from the `ipt` function with signature `ipt()` and selector `0xfc66ff14`
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
    pub struct IptReturn(pub ::ethers::core::types::Address);
    ///Container type for all return fields from the `isWhitelisted` function with signature `isWhitelisted(address)` and selector `0x3af32abf`
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
    pub struct IsWhitelistedReturn(pub bool);
    ///Container type for all return fields from the `latestProposalIds` function with signature `latestProposalIds(address)` and selector `0x17977c61`
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
    pub struct LatestProposalIdsReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `maxWhitelistPeriod` function with signature `maxWhitelistPeriod()` and selector `0xa6d8784a`
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
    pub struct MaxWhitelistPeriodReturn(pub ::ethers::core::types::U256);
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
    ///Container type for all return fields from the `optimisticQuorumVotes` function with signature `optimisticQuorumVotes()` and selector `0xc9fb9e87`
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
    pub struct OptimisticQuorumVotesReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `optimisticVotingDelay` function with signature `optimisticVotingDelay()` and selector `0xe837159c`
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
    pub struct OptimisticVotingDelayReturn(pub ::ethers::core::types::U256);
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
    pub struct ProposalCountReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `proposalMaxOperations` function with signature `proposalMaxOperations()` and selector `0x7bdbe4d0`
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
    pub struct ProposalMaxOperationsReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `proposalReceipts` function with signature `proposalReceipts(uint256,address)` and selector `0x66176743`
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
    pub struct ProposalReceiptsReturn {
        pub has_voted: bool,
        pub support: u8,
        pub votes: u128,
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
    ///Container type for all return fields from the `proposalTimelockDelay` function with signature `proposalTimelockDelay()` and selector `0x7cae57bb`
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
    pub struct ProposalTimelockDelayReturn(pub ::ethers::core::types::U256);
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
        pub id: ::ethers::core::types::U256,
        pub proposer: ::ethers::core::types::Address,
        pub eta: ::ethers::core::types::U256,
        pub start_block: ::ethers::core::types::U256,
        pub end_block: ::ethers::core::types::U256,
        pub for_votes: ::ethers::core::types::U256,
        pub against_votes: ::ethers::core::types::U256,
        pub abstain_votes: ::ethers::core::types::U256,
        pub canceled: bool,
        pub executed: bool,
        pub emergency: bool,
        pub quorum_votes: ::ethers::core::types::U256,
        pub delay: ::ethers::core::types::U256,
    }
    ///Container type for all return fields from the `propose` function with signature `propose(address[],uint256[],string[],bytes[],string,bool)` and selector `0xf682e04c`
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
    pub struct ProposeReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `queuedTransactions` function with signature `queuedTransactions(bytes32)` and selector `0xf2b06537`
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
    pub struct QueuedTransactionsReturn(pub bool);
    ///Container type for all return fields from the `quorumVotes` function with signature `quorumVotes()` and selector `0x24bc1a64`
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
    pub struct QuorumVotesReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `state` function with signature `state(uint256)` and selector `0x3e4f49e6`
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
    pub struct StateReturn(pub u8);
    ///Container type for all return fields from the `votingDelay` function with signature `votingDelay()` and selector `0x3932abb1`
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
    pub struct VotingDelayReturn(pub ::ethers::core::types::U256);
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
    ///Container type for all return fields from the `whitelistAccountExpirations` function with signature `whitelistAccountExpirations(address)` and selector `0x38bd0dda`
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
    pub struct WhitelistAccountExpirationsReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `whitelistGuardian` function with signature `whitelistGuardian()` and selector `0xc5a8425d`
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
    pub struct WhitelistGuardianReturn(pub ::ethers::core::types::Address);
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
}
