pub use zeroxstakingproxy::*;
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
pub mod zeroxstakingproxy {
    #[rustfmt::skip]
    const __ABI: &str = "[\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"target\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"caller\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"AuthorizedAddressAdded\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"target\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"caller\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"AuthorizedAddressRemoved\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"uint256\",\n        \"name\": \"epoch\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"numPoolsToFinalize\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"rewardsAvailable\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"totalFeesCollected\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"totalWeightedStake\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"EpochEnded\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"uint256\",\n        \"name\": \"epoch\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"rewardsPaid\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"rewardsRemaining\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"EpochFinalized\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"address\",\n        \"name\": \"exchangeAddress\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"ExchangeAdded\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"address\",\n        \"name\": \"exchangeAddress\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"ExchangeRemoved\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"makerAddress\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"bytes32\",\n        \"name\": \"poolId\",\n        \"type\": \"bytes32\"\n      }\n    ],\n    \"name\": \"MakerStakingPoolSet\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"staker\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"amount\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint8\",\n        \"name\": \"fromStatus\",\n        \"type\": \"uint8\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"bytes32\",\n        \"name\": \"fromPool\",\n        \"type\": \"bytes32\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint8\",\n        \"name\": \"toStatus\",\n        \"type\": \"uint8\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"bytes32\",\n        \"name\": \"toPool\",\n        \"type\": \"bytes32\"\n      }\n    ],\n    \"name\": \"MoveStake\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"bytes32\",\n        \"name\": \"poolId\",\n        \"type\": \"bytes32\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint32\",\n        \"name\": \"oldOperatorShare\",\n        \"type\": \"uint32\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint32\",\n        \"name\": \"newOperatorShare\",\n        \"type\": \"uint32\"\n      }\n    ],\n    \"name\": \"OperatorShareDecreased\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"previousOwner\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"newOwner\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"OwnershipTransferred\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"epochDurationInSeconds\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint32\",\n        \"name\": \"rewardDelegatedStakeWeight\",\n        \"type\": \"uint32\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"minimumPoolStake\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"cobbDouglasAlphaNumerator\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"cobbDouglasAlphaDenominator\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"ParamsSet\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"uint256\",\n        \"name\": \"epoch\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"bytes32\",\n        \"name\": \"poolId\",\n        \"type\": \"bytes32\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"operatorReward\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"membersReward\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"RewardsPaid\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"staker\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"amount\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"Stake\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": false,\n        \"internalType\": \"bytes32\",\n        \"name\": \"poolId\",\n        \"type\": \"bytes32\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"address\",\n        \"name\": \"operator\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint32\",\n        \"name\": \"operatorShare\",\n        \"type\": \"uint32\"\n      }\n    ],\n    \"name\": \"StakingPoolCreated\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"uint256\",\n        \"name\": \"epoch\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"bytes32\",\n        \"name\": \"poolId\",\n        \"type\": \"bytes32\"\n      }\n    ],\n    \"name\": \"StakingPoolEarnedRewardsInEpoch\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"staker\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"amount\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"Unstake\",\n    \"type\": \"event\"\n  },\n  {\n    \"constant\": false,\n    \"inputs\": [\n      { \"internalType\": \"address\", \"name\": \"target\", \"type\": \"address\" }\n    ],\n    \"name\": \"addAuthorizedAddress\",\n    \"outputs\": [],\n    \"payable\": false,\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": false,\n    \"inputs\": [\n      { \"internalType\": \"address\", \"name\": \"addr\", \"type\": \"address\" }\n    ],\n    \"name\": \"addExchangeAddress\",\n    \"outputs\": [],\n    \"payable\": false,\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"name\": \"aggregatedStatsByEpoch\",\n    \"outputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"rewardsAvailable\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"numPoolsToFinalize\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"totalFeesCollected\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"totalWeightedStake\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"totalRewardsFinalized\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"name\": \"authorities\",\n    \"outputs\": [{ \"internalType\": \"address\", \"name\": \"\", \"type\": \"address\" }],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [{ \"internalType\": \"address\", \"name\": \"\", \"type\": \"address\" }],\n    \"name\": \"authorized\",\n    \"outputs\": [{ \"internalType\": \"bool\", \"name\": \"\", \"type\": \"bool\" }],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [],\n    \"name\": \"cobbDouglasAlphaDenominator\",\n    \"outputs\": [{ \"internalType\": \"uint32\", \"name\": \"\", \"type\": \"uint32\" }],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [],\n    \"name\": \"cobbDouglasAlphaNumerator\",\n    \"outputs\": [{ \"internalType\": \"uint32\", \"name\": \"\", \"type\": \"uint32\" }],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [\n      { \"internalType\": \"bytes32\", \"name\": \"poolId\", \"type\": \"bytes32\" },\n      { \"internalType\": \"address\", \"name\": \"member\", \"type\": \"address\" }\n    ],\n    \"name\": \"computeRewardBalanceOfDelegator\",\n    \"outputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"reward\", \"type\": \"uint256\" }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [\n      { \"internalType\": \"bytes32\", \"name\": \"poolId\", \"type\": \"bytes32\" }\n    ],\n    \"name\": \"computeRewardBalanceOfOperator\",\n    \"outputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"reward\", \"type\": \"uint256\" }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": false,\n    \"inputs\": [\n      { \"internalType\": \"uint32\", \"name\": \"operatorShare\", \"type\": \"uint32\" },\n      { \"internalType\": \"bool\", \"name\": \"addOperatorAsMaker\", \"type\": \"bool\" }\n    ],\n    \"name\": \"createStakingPool\",\n    \"outputs\": [\n      { \"internalType\": \"bytes32\", \"name\": \"poolId\", \"type\": \"bytes32\" }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [],\n    \"name\": \"currentEpoch\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [],\n    \"name\": \"currentEpochStartTimeInSeconds\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": false,\n    \"inputs\": [\n      { \"internalType\": \"bytes32\", \"name\": \"poolId\", \"type\": \"bytes32\" },\n      { \"internalType\": \"uint32\", \"name\": \"newOperatorShare\", \"type\": \"uint32\" }\n    ],\n    \"name\": \"decreaseStakingPoolOperatorShare\",\n    \"outputs\": [],\n    \"payable\": false,\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": false,\n    \"inputs\": [],\n    \"name\": \"endEpoch\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"payable\": false,\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [],\n    \"name\": \"epochDurationInSeconds\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": false,\n    \"inputs\": [\n      { \"internalType\": \"bytes32\", \"name\": \"poolId\", \"type\": \"bytes32\" }\n    ],\n    \"name\": \"finalizePool\",\n    \"outputs\": [],\n    \"payable\": false,\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [],\n    \"name\": \"getAuthorizedAddresses\",\n    \"outputs\": [\n      { \"internalType\": \"address[]\", \"name\": \"\", \"type\": \"address[]\" }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [],\n    \"name\": \"getCurrentEpochEarliestEndTimeInSeconds\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [\n      {\n        \"internalType\": \"enum IStructs.StakeStatus\",\n        \"name\": \"stakeStatus\",\n        \"type\": \"uint8\"\n      }\n    ],\n    \"name\": \"getGlobalStakeByStatus\",\n    \"outputs\": [\n      {\n        \"components\": [\n          {\n            \"internalType\": \"uint64\",\n            \"name\": \"currentEpoch\",\n            \"type\": \"uint64\"\n          },\n          {\n            \"internalType\": \"uint96\",\n            \"name\": \"currentEpochBalance\",\n            \"type\": \"uint96\"\n          },\n          {\n            \"internalType\": \"uint96\",\n            \"name\": \"nextEpochBalance\",\n            \"type\": \"uint96\"\n          }\n        ],\n        \"internalType\": \"struct IStructs.StoredBalance\",\n        \"name\": \"balance\",\n        \"type\": \"tuple\"\n      }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [\n      { \"internalType\": \"address\", \"name\": \"staker\", \"type\": \"address\" },\n      {\n        \"internalType\": \"enum IStructs.StakeStatus\",\n        \"name\": \"stakeStatus\",\n        \"type\": \"uint8\"\n      }\n    ],\n    \"name\": \"getOwnerStakeByStatus\",\n    \"outputs\": [\n      {\n        \"components\": [\n          {\n            \"internalType\": \"uint64\",\n            \"name\": \"currentEpoch\",\n            \"type\": \"uint64\"\n          },\n          {\n            \"internalType\": \"uint96\",\n            \"name\": \"currentEpochBalance\",\n            \"type\": \"uint96\"\n          },\n          {\n            \"internalType\": \"uint96\",\n            \"name\": \"nextEpochBalance\",\n            \"type\": \"uint96\"\n          }\n        ],\n        \"internalType\": \"struct IStructs.StoredBalance\",\n        \"name\": \"balance\",\n        \"type\": \"tuple\"\n      }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [],\n    \"name\": \"getParams\",\n    \"outputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"_epochDurationInSeconds\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"internalType\": \"uint32\",\n        \"name\": \"_rewardDelegatedStakeWeight\",\n        \"type\": \"uint32\"\n      },\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"_minimumPoolStake\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"internalType\": \"uint32\",\n        \"name\": \"_cobbDouglasAlphaNumerator\",\n        \"type\": \"uint32\"\n      },\n      {\n        \"internalType\": \"uint32\",\n        \"name\": \"_cobbDouglasAlphaDenominator\",\n        \"type\": \"uint32\"\n      }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [\n      { \"internalType\": \"address\", \"name\": \"staker\", \"type\": \"address\" },\n      { \"internalType\": \"bytes32\", \"name\": \"poolId\", \"type\": \"bytes32\" }\n    ],\n    \"name\": \"getStakeDelegatedToPoolByOwner\",\n    \"outputs\": [\n      {\n        \"components\": [\n          {\n            \"internalType\": \"uint64\",\n            \"name\": \"currentEpoch\",\n            \"type\": \"uint64\"\n          },\n          {\n            \"internalType\": \"uint96\",\n            \"name\": \"currentEpochBalance\",\n            \"type\": \"uint96\"\n          },\n          {\n            \"internalType\": \"uint96\",\n            \"name\": \"nextEpochBalance\",\n            \"type\": \"uint96\"\n          }\n        ],\n        \"internalType\": \"struct IStructs.StoredBalance\",\n        \"name\": \"balance\",\n        \"type\": \"tuple\"\n      }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [\n      { \"internalType\": \"bytes32\", \"name\": \"poolId\", \"type\": \"bytes32\" }\n    ],\n    \"name\": \"getStakingPool\",\n    \"outputs\": [\n      {\n        \"components\": [\n          { \"internalType\": \"address\", \"name\": \"operator\", \"type\": \"address\" },\n          {\n            \"internalType\": \"uint32\",\n            \"name\": \"operatorShare\",\n            \"type\": \"uint32\"\n          }\n        ],\n        \"internalType\": \"struct IStructs.Pool\",\n        \"name\": \"\",\n        \"type\": \"tuple\"\n      }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [\n      { \"internalType\": \"bytes32\", \"name\": \"poolId\", \"type\": \"bytes32\" }\n    ],\n    \"name\": \"getStakingPoolStatsThisEpoch\",\n    \"outputs\": [\n      {\n        \"components\": [\n          {\n            \"internalType\": \"uint256\",\n            \"name\": \"feesCollected\",\n            \"type\": \"uint256\"\n          },\n          {\n            \"internalType\": \"uint256\",\n            \"name\": \"weightedStake\",\n            \"type\": \"uint256\"\n          },\n          {\n            \"internalType\": \"uint256\",\n            \"name\": \"membersStake\",\n            \"type\": \"uint256\"\n          }\n        ],\n        \"internalType\": \"struct IStructs.PoolStats\",\n        \"name\": \"\",\n        \"type\": \"tuple\"\n      }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [\n      { \"internalType\": \"address\", \"name\": \"staker\", \"type\": \"address\" }\n    ],\n    \"name\": \"getTotalStake\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [\n      { \"internalType\": \"bytes32\", \"name\": \"poolId\", \"type\": \"bytes32\" }\n    ],\n    \"name\": \"getTotalStakeDelegatedToPool\",\n    \"outputs\": [\n      {\n        \"components\": [\n          {\n            \"internalType\": \"uint64\",\n            \"name\": \"currentEpoch\",\n            \"type\": \"uint64\"\n          },\n          {\n            \"internalType\": \"uint96\",\n            \"name\": \"currentEpochBalance\",\n            \"type\": \"uint96\"\n          },\n          {\n            \"internalType\": \"uint96\",\n            \"name\": \"nextEpochBalance\",\n            \"type\": \"uint96\"\n          }\n        ],\n        \"internalType\": \"struct IStructs.StoredBalance\",\n        \"name\": \"balance\",\n        \"type\": \"tuple\"\n      }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [],\n    \"name\": \"getWethContract\",\n    \"outputs\": [\n      {\n        \"internalType\": \"contract IEtherToken\",\n        \"name\": \"wethContract\",\n        \"type\": \"address\"\n      }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [],\n    \"name\": \"getZrxVault\",\n    \"outputs\": [\n      {\n        \"internalType\": \"contract IZrxVault\",\n        \"name\": \"zrxVault\",\n        \"type\": \"address\"\n      }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": false,\n    \"inputs\": [],\n    \"name\": \"init\",\n    \"outputs\": [],\n    \"payable\": false,\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": false,\n    \"inputs\": [\n      { \"internalType\": \"bytes32\", \"name\": \"poolId\", \"type\": \"bytes32\" }\n    ],\n    \"name\": \"joinStakingPoolAsMaker\",\n    \"outputs\": [],\n    \"payable\": false,\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [],\n    \"name\": \"lastPoolId\",\n    \"outputs\": [{ \"internalType\": \"bytes32\", \"name\": \"\", \"type\": \"bytes32\" }],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [],\n    \"name\": \"minimumPoolStake\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": false,\n    \"inputs\": [\n      {\n        \"components\": [\n          {\n            \"internalType\": \"enum IStructs.StakeStatus\",\n            \"name\": \"status\",\n            \"type\": \"uint8\"\n          },\n          { \"internalType\": \"bytes32\", \"name\": \"poolId\", \"type\": \"bytes32\" }\n        ],\n        \"internalType\": \"struct IStructs.StakeInfo\",\n        \"name\": \"from\",\n        \"type\": \"tuple\"\n      },\n      {\n        \"components\": [\n          {\n            \"internalType\": \"enum IStructs.StakeStatus\",\n            \"name\": \"status\",\n            \"type\": \"uint8\"\n          },\n          { \"internalType\": \"bytes32\", \"name\": \"poolId\", \"type\": \"bytes32\" }\n        ],\n        \"internalType\": \"struct IStructs.StakeInfo\",\n        \"name\": \"to\",\n        \"type\": \"tuple\"\n      },\n      { \"internalType\": \"uint256\", \"name\": \"amount\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"moveStake\",\n    \"outputs\": [],\n    \"payable\": false,\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [],\n    \"name\": \"owner\",\n    \"outputs\": [{ \"internalType\": \"address\", \"name\": \"\", \"type\": \"address\" }],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": false,\n    \"inputs\": [\n      { \"internalType\": \"address\", \"name\": \"makerAddress\", \"type\": \"address\" },\n      { \"internalType\": \"address\", \"name\": \"payerAddress\", \"type\": \"address\" },\n      { \"internalType\": \"uint256\", \"name\": \"protocolFee\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"payProtocolFee\",\n    \"outputs\": [],\n    \"payable\": true,\n    \"stateMutability\": \"payable\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [{ \"internalType\": \"address\", \"name\": \"\", \"type\": \"address\" }],\n    \"name\": \"poolIdByMaker\",\n    \"outputs\": [{ \"internalType\": \"bytes32\", \"name\": \"\", \"type\": \"bytes32\" }],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [\n      { \"internalType\": \"bytes32\", \"name\": \"\", \"type\": \"bytes32\" },\n      { \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"poolStatsByEpoch\",\n    \"outputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"feesCollected\", \"type\": \"uint256\" },\n      { \"internalType\": \"uint256\", \"name\": \"weightedStake\", \"type\": \"uint256\" },\n      { \"internalType\": \"uint256\", \"name\": \"membersStake\", \"type\": \"uint256\" }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": false,\n    \"inputs\": [\n      { \"internalType\": \"address\", \"name\": \"target\", \"type\": \"address\" }\n    ],\n    \"name\": \"removeAuthorizedAddress\",\n    \"outputs\": [],\n    \"payable\": false,\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": false,\n    \"inputs\": [\n      { \"internalType\": \"address\", \"name\": \"target\", \"type\": \"address\" },\n      { \"internalType\": \"uint256\", \"name\": \"index\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"removeAuthorizedAddressAtIndex\",\n    \"outputs\": [],\n    \"payable\": false,\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": false,\n    \"inputs\": [\n      { \"internalType\": \"address\", \"name\": \"addr\", \"type\": \"address\" }\n    ],\n    \"name\": \"removeExchangeAddress\",\n    \"outputs\": [],\n    \"payable\": false,\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [],\n    \"name\": \"rewardDelegatedStakeWeight\",\n    \"outputs\": [{ \"internalType\": \"uint32\", \"name\": \"\", \"type\": \"uint32\" }],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [{ \"internalType\": \"bytes32\", \"name\": \"\", \"type\": \"bytes32\" }],\n    \"name\": \"rewardsByPoolId\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": false,\n    \"inputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"_epochDurationInSeconds\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"internalType\": \"uint32\",\n        \"name\": \"_rewardDelegatedStakeWeight\",\n        \"type\": \"uint32\"\n      },\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"_minimumPoolStake\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"internalType\": \"uint32\",\n        \"name\": \"_cobbDouglasAlphaNumerator\",\n        \"type\": \"uint32\"\n      },\n      {\n        \"internalType\": \"uint32\",\n        \"name\": \"_cobbDouglasAlphaDenominator\",\n        \"type\": \"uint32\"\n      }\n    ],\n    \"name\": \"setParams\",\n    \"outputs\": [],\n    \"payable\": false,\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": false,\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"amount\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"stake\",\n    \"outputs\": [],\n    \"payable\": false,\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [],\n    \"name\": \"stakingContract\",\n    \"outputs\": [{ \"internalType\": \"address\", \"name\": \"\", \"type\": \"address\" }],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": false,\n    \"inputs\": [\n      { \"internalType\": \"address\", \"name\": \"newOwner\", \"type\": \"address\" }\n    ],\n    \"name\": \"transferOwnership\",\n    \"outputs\": [],\n    \"payable\": false,\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": false,\n    \"inputs\": [\n      { \"internalType\": \"uint256\", \"name\": \"amount\", \"type\": \"uint256\" }\n    ],\n    \"name\": \"unstake\",\n    \"outputs\": [],\n    \"payable\": false,\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [{ \"internalType\": \"address\", \"name\": \"\", \"type\": \"address\" }],\n    \"name\": \"validExchanges\",\n    \"outputs\": [{ \"internalType\": \"bool\", \"name\": \"\", \"type\": \"bool\" }],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [],\n    \"name\": \"wethReservedForPoolRewards\",\n    \"outputs\": [{ \"internalType\": \"uint256\", \"name\": \"\", \"type\": \"uint256\" }],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": false,\n    \"inputs\": [\n      { \"internalType\": \"bytes32\", \"name\": \"poolId\", \"type\": \"bytes32\" }\n    ],\n    \"name\": \"withdrawDelegatorRewards\",\n    \"outputs\": [],\n    \"payable\": false,\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  }\n]";
    ///The parsed JSON ABI of the contract.
    pub static ZEROXSTAKINGPROXY_ABI: ::ethers::contract::Lazy<
        ::ethers::core::abi::Abi,
    > = ::ethers::contract::Lazy::new(|| {
        ::ethers::core::utils::__serde_json::from_str(__ABI)
            .expect("ABI is always valid")
    });
    pub struct zeroxstakingproxy<M>(::ethers::contract::Contract<M>);
    impl<M> ::core::clone::Clone for zeroxstakingproxy<M> {
        fn clone(&self) -> Self {
            Self(::core::clone::Clone::clone(&self.0))
        }
    }
    impl<M> ::core::ops::Deref for zeroxstakingproxy<M> {
        type Target = ::ethers::contract::Contract<M>;
        fn deref(&self) -> &Self::Target {
            &self.0
        }
    }
    impl<M> ::core::ops::DerefMut for zeroxstakingproxy<M> {
        fn deref_mut(&mut self) -> &mut Self::Target {
            &mut self.0
        }
    }
    impl<M> ::core::fmt::Debug for zeroxstakingproxy<M> {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            f.debug_tuple(stringify!(zeroxstakingproxy)).field(&self.address()).finish()
        }
    }
    impl<M: ::ethers::providers::Middleware> zeroxstakingproxy<M> {
        /// Creates a new contract instance with the specified `ethers` client at
        /// `address`. The contract derefs to a `ethers::Contract` object.
        pub fn new<T: Into<::ethers::core::types::Address>>(
            address: T,
            client: ::std::sync::Arc<M>,
        ) -> Self {
            Self(
                ::ethers::contract::Contract::new(
                    address.into(),
                    ZEROXSTAKINGPROXY_ABI.clone(),
                    client,
                ),
            )
        }
        ///Calls the contract's `addAuthorizedAddress` (0x42f1181e) function
        pub fn add_authorized_address(
            &self,
            target: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([66, 241, 24, 30], target)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `addExchangeAddress` (0x8a2e271a) function
        pub fn add_exchange_address(
            &self,
            addr: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([138, 46, 39, 26], addr)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `aggregatedStatsByEpoch` (0x38229d93) function
        pub fn aggregated_stats_by_epoch(
            &self,
            p0: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<
            M,
            (
                ::ethers::core::types::U256,
                ::ethers::core::types::U256,
                ::ethers::core::types::U256,
                ::ethers::core::types::U256,
                ::ethers::core::types::U256,
            ),
        > {
            self.0
                .method_hash([56, 34, 157, 147], p0)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `authorities` (0x494503d4) function
        pub fn authorities(
            &self,
            p0: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<
            M,
            ::ethers::core::types::Address,
        > {
            self.0
                .method_hash([73, 69, 3, 212], p0)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `authorized` (0xb9181611) function
        pub fn authorized(
            &self,
            p0: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([185, 24, 22, 17], p0)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `cobbDouglasAlphaDenominator` (0xe8eeb3f8) function
        pub fn cobb_douglas_alpha_denominator(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, u32> {
            self.0
                .method_hash([232, 238, 179, 248], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `cobbDouglasAlphaNumerator` (0x81666796) function
        pub fn cobb_douglas_alpha_numerator(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, u32> {
            self.0
                .method_hash([129, 102, 103, 150], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `computeRewardBalanceOfDelegator` (0xe907f003) function
        pub fn compute_reward_balance_of_delegator(
            &self,
            pool_id: [u8; 32],
            member: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([233, 7, 240, 3], (pool_id, member))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `computeRewardBalanceOfOperator` (0xbb7ef7e0) function
        pub fn compute_reward_balance_of_operator(
            &self,
            pool_id: [u8; 32],
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([187, 126, 247, 224], pool_id)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `createStakingPool` (0x68a7d6cd) function
        pub fn create_staking_pool(
            &self,
            operator_share: u32,
            add_operator_as_maker: bool,
        ) -> ::ethers::contract::builders::ContractCall<M, [u8; 32]> {
            self.0
                .method_hash(
                    [104, 167, 214, 205],
                    (operator_share, add_operator_as_maker),
                )
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `currentEpoch` (0x76671808) function
        pub fn current_epoch(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([118, 103, 24, 8], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `currentEpochStartTimeInSeconds` (0x587da023) function
        pub fn current_epoch_start_time_in_seconds(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([88, 125, 160, 35], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `decreaseStakingPoolOperatorShare` (0x5d91121d) function
        pub fn decrease_staking_pool_operator_share(
            &self,
            pool_id: [u8; 32],
            new_operator_share: u32,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([93, 145, 18, 29], (pool_id, new_operator_share))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `endEpoch` (0x0b9663db) function
        pub fn end_epoch(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([11, 150, 99, 219], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `epochDurationInSeconds` (0x63403801) function
        pub fn epoch_duration_in_seconds(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([99, 64, 56, 1], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `finalizePool` (0xff691b11) function
        pub fn finalize_pool(
            &self,
            pool_id: [u8; 32],
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([255, 105, 27, 17], pool_id)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getAuthorizedAddresses` (0xd39de6e9) function
        pub fn get_authorized_addresses(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<
            M,
            ::std::vec::Vec<::ethers::core::types::Address>,
        > {
            self.0
                .method_hash([211, 157, 230, 233], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getCurrentEpochEarliestEndTimeInSeconds` (0xb2baa33e) function
        pub fn get_current_epoch_earliest_end_time_in_seconds(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([178, 186, 163, 62], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getGlobalStakeByStatus` (0xe804d0a4) function
        pub fn get_global_stake_by_status(
            &self,
            stake_status: u8,
        ) -> ::ethers::contract::builders::ContractCall<M, StoredBalance> {
            self.0
                .method_hash([232, 4, 208, 164], stake_status)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getOwnerStakeByStatus` (0x44a6958b) function
        pub fn get_owner_stake_by_status(
            &self,
            staker: ::ethers::core::types::Address,
            stake_status: u8,
        ) -> ::ethers::contract::builders::ContractCall<M, StoredBalance> {
            self.0
                .method_hash([68, 166, 149, 139], (staker, stake_status))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getParams` (0x5e615a6b) function
        pub fn get_params(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<
            M,
            (::ethers::core::types::U256, u32, ::ethers::core::types::U256, u32, u32),
        > {
            self.0
                .method_hash([94, 97, 90, 107], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getStakeDelegatedToPoolByOwner` (0xf252b7a1) function
        pub fn get_stake_delegated_to_pool_by_owner(
            &self,
            staker: ::ethers::core::types::Address,
            pool_id: [u8; 32],
        ) -> ::ethers::contract::builders::ContractCall<M, StoredBalance> {
            self.0
                .method_hash([242, 82, 183, 161], (staker, pool_id))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getStakingPool` (0x4bcc3f67) function
        pub fn get_staking_pool(
            &self,
            pool_id: [u8; 32],
        ) -> ::ethers::contract::builders::ContractCall<M, Pool> {
            self.0
                .method_hash([75, 204, 63, 103], pool_id)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getStakingPoolStatsThisEpoch` (0x46b97959) function
        pub fn get_staking_pool_stats_this_epoch(
            &self,
            pool_id: [u8; 32],
        ) -> ::ethers::contract::builders::ContractCall<M, PoolStats> {
            self.0
                .method_hash([70, 185, 121, 89], pool_id)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getTotalStake` (0x1e7ff8f6) function
        pub fn get_total_stake(
            &self,
            staker: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([30, 127, 248, 246], staker)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getTotalStakeDelegatedToPool` (0x3e4ad732) function
        pub fn get_total_stake_delegated_to_pool(
            &self,
            pool_id: [u8; 32],
        ) -> ::ethers::contract::builders::ContractCall<M, StoredBalance> {
            self.0
                .method_hash([62, 74, 215, 50], pool_id)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getWethContract` (0x3c277fc5) function
        pub fn get_weth_contract(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<
            M,
            ::ethers::core::types::Address,
        > {
            self.0
                .method_hash([60, 39, 127, 197], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getZrxVault` (0x624a7232) function
        pub fn get_zrx_vault(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<
            M,
            ::ethers::core::types::Address,
        > {
            self.0
                .method_hash([98, 74, 114, 50], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `init` (0xe1c7392a) function
        pub fn init(&self) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([225, 199, 57, 42], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `joinStakingPoolAsMaker` (0xb3e33379) function
        pub fn join_staking_pool_as_maker(
            &self,
            pool_id: [u8; 32],
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([179, 227, 51, 121], pool_id)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `lastPoolId` (0xa657e579) function
        pub fn last_pool_id(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, [u8; 32]> {
            self.0
                .method_hash([166, 87, 229, 121], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `minimumPoolStake` (0xa26171e2) function
        pub fn minimum_pool_stake(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([162, 97, 113, 226], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `moveStake` (0x58f6c7e3) function
        pub fn move_stake(
            &self,
            from: StakeInfo,
            to: StakeInfo,
            amount: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([88, 246, 199, 227], (from, to, amount))
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
        ///Calls the contract's `payProtocolFee` (0xa3b4a327) function
        pub fn pay_protocol_fee(
            &self,
            maker_address: ::ethers::core::types::Address,
            payer_address: ::ethers::core::types::Address,
            protocol_fee: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash(
                    [163, 180, 163, 39],
                    (maker_address, payer_address, protocol_fee),
                )
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `poolIdByMaker` (0xf1876532) function
        pub fn pool_id_by_maker(
            &self,
            p0: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, [u8; 32]> {
            self.0
                .method_hash([241, 135, 101, 50], p0)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `poolStatsByEpoch` (0x2a94c279) function
        pub fn pool_stats_by_epoch(
            &self,
            p0: [u8; 32],
            p1: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<
            M,
            (
                ::ethers::core::types::U256,
                ::ethers::core::types::U256,
                ::ethers::core::types::U256,
            ),
        > {
            self.0
                .method_hash([42, 148, 194, 121], (p0, p1))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `removeAuthorizedAddress` (0x70712939) function
        pub fn remove_authorized_address(
            &self,
            target: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([112, 113, 41, 57], target)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `removeAuthorizedAddressAtIndex` (0x9ad26744) function
        pub fn remove_authorized_address_at_index(
            &self,
            target: ::ethers::core::types::Address,
            index: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([154, 210, 103, 68], (target, index))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `removeExchangeAddress` (0x01e28d84) function
        pub fn remove_exchange_address(
            &self,
            addr: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([1, 226, 141, 132], addr)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `rewardDelegatedStakeWeight` (0xe0ee036e) function
        pub fn reward_delegated_stake_weight(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, u32> {
            self.0
                .method_hash([224, 238, 3, 110], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `rewardsByPoolId` (0xc18c9141) function
        pub fn rewards_by_pool_id(
            &self,
            p0: [u8; 32],
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([193, 140, 145, 65], p0)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `setParams` (0x9c3ccc82) function
        pub fn set_params(
            &self,
            epoch_duration_in_seconds: ::ethers::core::types::U256,
            reward_delegated_stake_weight: u32,
            minimum_pool_stake: ::ethers::core::types::U256,
            cobb_douglas_alpha_numerator: u32,
            cobb_douglas_alpha_denominator: u32,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash(
                    [156, 60, 204, 130],
                    (
                        epoch_duration_in_seconds,
                        reward_delegated_stake_weight,
                        minimum_pool_stake,
                        cobb_douglas_alpha_numerator,
                        cobb_douglas_alpha_denominator,
                    ),
                )
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `stake` (0xa694fc3a) function
        pub fn stake(
            &self,
            amount: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([166, 148, 252, 58], amount)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `stakingContract` (0xee99205c) function
        pub fn staking_contract(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<
            M,
            ::ethers::core::types::Address,
        > {
            self.0
                .method_hash([238, 153, 32, 92], ())
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
        ///Calls the contract's `unstake` (0x2e17de78) function
        pub fn unstake(
            &self,
            amount: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([46, 23, 222, 120], amount)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `validExchanges` (0x5bd4ab73) function
        pub fn valid_exchanges(
            &self,
            p0: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([91, 212, 171, 115], p0)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `wethReservedForPoolRewards` (0xb0531524) function
        pub fn weth_reserved_for_pool_rewards(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([176, 83, 21, 36], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `withdrawDelegatorRewards` (0xb510879f) function
        pub fn withdraw_delegator_rewards(
            &self,
            pool_id: [u8; 32],
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([181, 16, 135, 159], pool_id)
                .expect("method not found (this should never happen)")
        }
        ///Gets the contract's `AuthorizedAddressAdded` event
        pub fn authorized_address_added_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            AuthorizedAddressAddedFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `AuthorizedAddressRemoved` event
        pub fn authorized_address_removed_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            AuthorizedAddressRemovedFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `EpochEnded` event
        pub fn epoch_ended_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            EpochEndedFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `EpochFinalized` event
        pub fn epoch_finalized_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            EpochFinalizedFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `ExchangeAdded` event
        pub fn exchange_added_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            ExchangeAddedFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `ExchangeRemoved` event
        pub fn exchange_removed_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            ExchangeRemovedFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `MakerStakingPoolSet` event
        pub fn maker_staking_pool_set_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            MakerStakingPoolSetFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `MoveStake` event
        pub fn move_stake_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            MoveStakeFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `OperatorShareDecreased` event
        pub fn operator_share_decreased_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            OperatorShareDecreasedFilter,
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
        ///Gets the contract's `ParamsSet` event
        pub fn params_set_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            ParamsSetFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `RewardsPaid` event
        pub fn rewards_paid_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            RewardsPaidFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `Stake` event
        pub fn stake_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, StakeFilter> {
            self.0.event()
        }
        ///Gets the contract's `StakingPoolCreated` event
        pub fn staking_pool_created_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            StakingPoolCreatedFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `StakingPoolEarnedRewardsInEpoch` event
        pub fn staking_pool_earned_rewards_in_epoch_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            StakingPoolEarnedRewardsInEpochFilter,
        > {
            self.0.event()
        }
        ///Gets the contract's `Unstake` event
        pub fn unstake_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, UnstakeFilter> {
            self.0.event()
        }
        /// Returns an `Event` builder for all the events of this contract.
        pub fn events(
            &self,
        ) -> ::ethers::contract::builders::Event<
            ::std::sync::Arc<M>,
            M,
            zeroxstakingproxyEvents,
        > {
            self.0.event_with_filter(::core::default::Default::default())
        }
    }
    impl<M: ::ethers::providers::Middleware> From<::ethers::contract::Contract<M>>
    for zeroxstakingproxy<M> {
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
        name = "AuthorizedAddressAdded",
        abi = "AuthorizedAddressAdded(address,address)"
    )]
    pub struct AuthorizedAddressAddedFilter {
        #[ethevent(indexed)]
        pub target: ::ethers::core::types::Address,
        #[ethevent(indexed)]
        pub caller: ::ethers::core::types::Address,
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
        name = "AuthorizedAddressRemoved",
        abi = "AuthorizedAddressRemoved(address,address)"
    )]
    pub struct AuthorizedAddressRemovedFilter {
        #[ethevent(indexed)]
        pub target: ::ethers::core::types::Address,
        #[ethevent(indexed)]
        pub caller: ::ethers::core::types::Address,
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
        name = "EpochEnded",
        abi = "EpochEnded(uint256,uint256,uint256,uint256,uint256)"
    )]
    pub struct EpochEndedFilter {
        #[ethevent(indexed)]
        pub epoch: ::ethers::core::types::U256,
        pub num_pools_to_finalize: ::ethers::core::types::U256,
        pub rewards_available: ::ethers::core::types::U256,
        pub total_fees_collected: ::ethers::core::types::U256,
        pub total_weighted_stake: ::ethers::core::types::U256,
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
    #[ethevent(name = "EpochFinalized", abi = "EpochFinalized(uint256,uint256,uint256)")]
    pub struct EpochFinalizedFilter {
        #[ethevent(indexed)]
        pub epoch: ::ethers::core::types::U256,
        pub rewards_paid: ::ethers::core::types::U256,
        pub rewards_remaining: ::ethers::core::types::U256,
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
    #[ethevent(name = "ExchangeAdded", abi = "ExchangeAdded(address)")]
    pub struct ExchangeAddedFilter {
        pub exchange_address: ::ethers::core::types::Address,
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
    #[ethevent(name = "ExchangeRemoved", abi = "ExchangeRemoved(address)")]
    pub struct ExchangeRemovedFilter {
        pub exchange_address: ::ethers::core::types::Address,
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
        name = "MakerStakingPoolSet",
        abi = "MakerStakingPoolSet(address,bytes32)"
    )]
    pub struct MakerStakingPoolSetFilter {
        #[ethevent(indexed)]
        pub maker_address: ::ethers::core::types::Address,
        #[ethevent(indexed)]
        pub pool_id: [u8; 32],
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
        name = "MoveStake",
        abi = "MoveStake(address,uint256,uint8,bytes32,uint8,bytes32)"
    )]
    pub struct MoveStakeFilter {
        #[ethevent(indexed)]
        pub staker: ::ethers::core::types::Address,
        pub amount: ::ethers::core::types::U256,
        pub from_status: u8,
        #[ethevent(indexed)]
        pub from_pool: [u8; 32],
        pub to_status: u8,
        #[ethevent(indexed)]
        pub to_pool: [u8; 32],
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
        name = "OperatorShareDecreased",
        abi = "OperatorShareDecreased(bytes32,uint32,uint32)"
    )]
    pub struct OperatorShareDecreasedFilter {
        #[ethevent(indexed)]
        pub pool_id: [u8; 32],
        pub old_operator_share: u32,
        pub new_operator_share: u32,
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
    #[ethevent(
        name = "ParamsSet",
        abi = "ParamsSet(uint256,uint32,uint256,uint256,uint256)"
    )]
    pub struct ParamsSetFilter {
        pub epoch_duration_in_seconds: ::ethers::core::types::U256,
        pub reward_delegated_stake_weight: u32,
        pub minimum_pool_stake: ::ethers::core::types::U256,
        pub cobb_douglas_alpha_numerator: ::ethers::core::types::U256,
        pub cobb_douglas_alpha_denominator: ::ethers::core::types::U256,
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
        name = "RewardsPaid",
        abi = "RewardsPaid(uint256,bytes32,uint256,uint256)"
    )]
    pub struct RewardsPaidFilter {
        #[ethevent(indexed)]
        pub epoch: ::ethers::core::types::U256,
        #[ethevent(indexed)]
        pub pool_id: [u8; 32],
        pub operator_reward: ::ethers::core::types::U256,
        pub members_reward: ::ethers::core::types::U256,
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
    #[ethevent(name = "Stake", abi = "Stake(address,uint256)")]
    pub struct StakeFilter {
        #[ethevent(indexed)]
        pub staker: ::ethers::core::types::Address,
        pub amount: ::ethers::core::types::U256,
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
        name = "StakingPoolCreated",
        abi = "StakingPoolCreated(bytes32,address,uint32)"
    )]
    pub struct StakingPoolCreatedFilter {
        pub pool_id: [u8; 32],
        pub operator: ::ethers::core::types::Address,
        pub operator_share: u32,
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
        name = "StakingPoolEarnedRewardsInEpoch",
        abi = "StakingPoolEarnedRewardsInEpoch(uint256,bytes32)"
    )]
    pub struct StakingPoolEarnedRewardsInEpochFilter {
        #[ethevent(indexed)]
        pub epoch: ::ethers::core::types::U256,
        #[ethevent(indexed)]
        pub pool_id: [u8; 32],
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
    #[ethevent(name = "Unstake", abi = "Unstake(address,uint256)")]
    pub struct UnstakeFilter {
        #[ethevent(indexed)]
        pub staker: ::ethers::core::types::Address,
        pub amount: ::ethers::core::types::U256,
    }
    ///Container type for all of the contract's events
    #[derive(Clone, ::ethers::contract::EthAbiType, Debug, PartialEq, Eq, Hash)]
    pub enum zeroxstakingproxyEvents {
        AuthorizedAddressAddedFilter(AuthorizedAddressAddedFilter),
        AuthorizedAddressRemovedFilter(AuthorizedAddressRemovedFilter),
        EpochEndedFilter(EpochEndedFilter),
        EpochFinalizedFilter(EpochFinalizedFilter),
        ExchangeAddedFilter(ExchangeAddedFilter),
        ExchangeRemovedFilter(ExchangeRemovedFilter),
        MakerStakingPoolSetFilter(MakerStakingPoolSetFilter),
        MoveStakeFilter(MoveStakeFilter),
        OperatorShareDecreasedFilter(OperatorShareDecreasedFilter),
        OwnershipTransferredFilter(OwnershipTransferredFilter),
        ParamsSetFilter(ParamsSetFilter),
        RewardsPaidFilter(RewardsPaidFilter),
        StakeFilter(StakeFilter),
        StakingPoolCreatedFilter(StakingPoolCreatedFilter),
        StakingPoolEarnedRewardsInEpochFilter(StakingPoolEarnedRewardsInEpochFilter),
        UnstakeFilter(UnstakeFilter),
    }
    impl ::ethers::contract::EthLogDecode for zeroxstakingproxyEvents {
        fn decode_log(
            log: &::ethers::core::abi::RawLog,
        ) -> ::core::result::Result<Self, ::ethers::core::abi::Error> {
            if let Ok(decoded) = AuthorizedAddressAddedFilter::decode_log(log) {
                return Ok(
                    zeroxstakingproxyEvents::AuthorizedAddressAddedFilter(decoded),
                );
            }
            if let Ok(decoded) = AuthorizedAddressRemovedFilter::decode_log(log) {
                return Ok(
                    zeroxstakingproxyEvents::AuthorizedAddressRemovedFilter(decoded),
                );
            }
            if let Ok(decoded) = EpochEndedFilter::decode_log(log) {
                return Ok(zeroxstakingproxyEvents::EpochEndedFilter(decoded));
            }
            if let Ok(decoded) = EpochFinalizedFilter::decode_log(log) {
                return Ok(zeroxstakingproxyEvents::EpochFinalizedFilter(decoded));
            }
            if let Ok(decoded) = ExchangeAddedFilter::decode_log(log) {
                return Ok(zeroxstakingproxyEvents::ExchangeAddedFilter(decoded));
            }
            if let Ok(decoded) = ExchangeRemovedFilter::decode_log(log) {
                return Ok(zeroxstakingproxyEvents::ExchangeRemovedFilter(decoded));
            }
            if let Ok(decoded) = MakerStakingPoolSetFilter::decode_log(log) {
                return Ok(zeroxstakingproxyEvents::MakerStakingPoolSetFilter(decoded));
            }
            if let Ok(decoded) = MoveStakeFilter::decode_log(log) {
                return Ok(zeroxstakingproxyEvents::MoveStakeFilter(decoded));
            }
            if let Ok(decoded) = OperatorShareDecreasedFilter::decode_log(log) {
                return Ok(
                    zeroxstakingproxyEvents::OperatorShareDecreasedFilter(decoded),
                );
            }
            if let Ok(decoded) = OwnershipTransferredFilter::decode_log(log) {
                return Ok(zeroxstakingproxyEvents::OwnershipTransferredFilter(decoded));
            }
            if let Ok(decoded) = ParamsSetFilter::decode_log(log) {
                return Ok(zeroxstakingproxyEvents::ParamsSetFilter(decoded));
            }
            if let Ok(decoded) = RewardsPaidFilter::decode_log(log) {
                return Ok(zeroxstakingproxyEvents::RewardsPaidFilter(decoded));
            }
            if let Ok(decoded) = StakeFilter::decode_log(log) {
                return Ok(zeroxstakingproxyEvents::StakeFilter(decoded));
            }
            if let Ok(decoded) = StakingPoolCreatedFilter::decode_log(log) {
                return Ok(zeroxstakingproxyEvents::StakingPoolCreatedFilter(decoded));
            }
            if let Ok(decoded) = StakingPoolEarnedRewardsInEpochFilter::decode_log(log) {
                return Ok(
                    zeroxstakingproxyEvents::StakingPoolEarnedRewardsInEpochFilter(
                        decoded,
                    ),
                );
            }
            if let Ok(decoded) = UnstakeFilter::decode_log(log) {
                return Ok(zeroxstakingproxyEvents::UnstakeFilter(decoded));
            }
            Err(::ethers::core::abi::Error::InvalidData)
        }
    }
    impl ::core::fmt::Display for zeroxstakingproxyEvents {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            match self {
                Self::AuthorizedAddressAddedFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::AuthorizedAddressRemovedFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::EpochEndedFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::EpochFinalizedFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::ExchangeAddedFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::ExchangeRemovedFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::MakerStakingPoolSetFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::MoveStakeFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::OperatorShareDecreasedFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::OwnershipTransferredFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::ParamsSetFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::RewardsPaidFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::StakeFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::StakingPoolCreatedFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::StakingPoolEarnedRewardsInEpochFilter(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::UnstakeFilter(element) => ::core::fmt::Display::fmt(element, f),
            }
        }
    }
    impl ::core::convert::From<AuthorizedAddressAddedFilter>
    for zeroxstakingproxyEvents {
        fn from(value: AuthorizedAddressAddedFilter) -> Self {
            Self::AuthorizedAddressAddedFilter(value)
        }
    }
    impl ::core::convert::From<AuthorizedAddressRemovedFilter>
    for zeroxstakingproxyEvents {
        fn from(value: AuthorizedAddressRemovedFilter) -> Self {
            Self::AuthorizedAddressRemovedFilter(value)
        }
    }
    impl ::core::convert::From<EpochEndedFilter> for zeroxstakingproxyEvents {
        fn from(value: EpochEndedFilter) -> Self {
            Self::EpochEndedFilter(value)
        }
    }
    impl ::core::convert::From<EpochFinalizedFilter> for zeroxstakingproxyEvents {
        fn from(value: EpochFinalizedFilter) -> Self {
            Self::EpochFinalizedFilter(value)
        }
    }
    impl ::core::convert::From<ExchangeAddedFilter> for zeroxstakingproxyEvents {
        fn from(value: ExchangeAddedFilter) -> Self {
            Self::ExchangeAddedFilter(value)
        }
    }
    impl ::core::convert::From<ExchangeRemovedFilter> for zeroxstakingproxyEvents {
        fn from(value: ExchangeRemovedFilter) -> Self {
            Self::ExchangeRemovedFilter(value)
        }
    }
    impl ::core::convert::From<MakerStakingPoolSetFilter> for zeroxstakingproxyEvents {
        fn from(value: MakerStakingPoolSetFilter) -> Self {
            Self::MakerStakingPoolSetFilter(value)
        }
    }
    impl ::core::convert::From<MoveStakeFilter> for zeroxstakingproxyEvents {
        fn from(value: MoveStakeFilter) -> Self {
            Self::MoveStakeFilter(value)
        }
    }
    impl ::core::convert::From<OperatorShareDecreasedFilter>
    for zeroxstakingproxyEvents {
        fn from(value: OperatorShareDecreasedFilter) -> Self {
            Self::OperatorShareDecreasedFilter(value)
        }
    }
    impl ::core::convert::From<OwnershipTransferredFilter> for zeroxstakingproxyEvents {
        fn from(value: OwnershipTransferredFilter) -> Self {
            Self::OwnershipTransferredFilter(value)
        }
    }
    impl ::core::convert::From<ParamsSetFilter> for zeroxstakingproxyEvents {
        fn from(value: ParamsSetFilter) -> Self {
            Self::ParamsSetFilter(value)
        }
    }
    impl ::core::convert::From<RewardsPaidFilter> for zeroxstakingproxyEvents {
        fn from(value: RewardsPaidFilter) -> Self {
            Self::RewardsPaidFilter(value)
        }
    }
    impl ::core::convert::From<StakeFilter> for zeroxstakingproxyEvents {
        fn from(value: StakeFilter) -> Self {
            Self::StakeFilter(value)
        }
    }
    impl ::core::convert::From<StakingPoolCreatedFilter> for zeroxstakingproxyEvents {
        fn from(value: StakingPoolCreatedFilter) -> Self {
            Self::StakingPoolCreatedFilter(value)
        }
    }
    impl ::core::convert::From<StakingPoolEarnedRewardsInEpochFilter>
    for zeroxstakingproxyEvents {
        fn from(value: StakingPoolEarnedRewardsInEpochFilter) -> Self {
            Self::StakingPoolEarnedRewardsInEpochFilter(value)
        }
    }
    impl ::core::convert::From<UnstakeFilter> for zeroxstakingproxyEvents {
        fn from(value: UnstakeFilter) -> Self {
            Self::UnstakeFilter(value)
        }
    }
    ///Container type for all input parameters for the `addAuthorizedAddress` function with signature `addAuthorizedAddress(address)` and selector `0x42f1181e`
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
    #[ethcall(name = "addAuthorizedAddress", abi = "addAuthorizedAddress(address)")]
    pub struct AddAuthorizedAddressCall {
        pub target: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `addExchangeAddress` function with signature `addExchangeAddress(address)` and selector `0x8a2e271a`
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
    #[ethcall(name = "addExchangeAddress", abi = "addExchangeAddress(address)")]
    pub struct AddExchangeAddressCall {
        pub addr: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `aggregatedStatsByEpoch` function with signature `aggregatedStatsByEpoch(uint256)` and selector `0x38229d93`
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
    #[ethcall(name = "aggregatedStatsByEpoch", abi = "aggregatedStatsByEpoch(uint256)")]
    pub struct AggregatedStatsByEpochCall(pub ::ethers::core::types::U256);
    ///Container type for all input parameters for the `authorities` function with signature `authorities(uint256)` and selector `0x494503d4`
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
    #[ethcall(name = "authorities", abi = "authorities(uint256)")]
    pub struct AuthoritiesCall(pub ::ethers::core::types::U256);
    ///Container type for all input parameters for the `authorized` function with signature `authorized(address)` and selector `0xb9181611`
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
    #[ethcall(name = "authorized", abi = "authorized(address)")]
    pub struct AuthorizedCall(pub ::ethers::core::types::Address);
    ///Container type for all input parameters for the `cobbDouglasAlphaDenominator` function with signature `cobbDouglasAlphaDenominator()` and selector `0xe8eeb3f8`
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
        name = "cobbDouglasAlphaDenominator",
        abi = "cobbDouglasAlphaDenominator()"
    )]
    pub struct CobbDouglasAlphaDenominatorCall;
    ///Container type for all input parameters for the `cobbDouglasAlphaNumerator` function with signature `cobbDouglasAlphaNumerator()` and selector `0x81666796`
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
    #[ethcall(name = "cobbDouglasAlphaNumerator", abi = "cobbDouglasAlphaNumerator()")]
    pub struct CobbDouglasAlphaNumeratorCall;
    ///Container type for all input parameters for the `computeRewardBalanceOfDelegator` function with signature `computeRewardBalanceOfDelegator(bytes32,address)` and selector `0xe907f003`
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
        name = "computeRewardBalanceOfDelegator",
        abi = "computeRewardBalanceOfDelegator(bytes32,address)"
    )]
    pub struct ComputeRewardBalanceOfDelegatorCall {
        pub pool_id: [u8; 32],
        pub member: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `computeRewardBalanceOfOperator` function with signature `computeRewardBalanceOfOperator(bytes32)` and selector `0xbb7ef7e0`
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
        name = "computeRewardBalanceOfOperator",
        abi = "computeRewardBalanceOfOperator(bytes32)"
    )]
    pub struct ComputeRewardBalanceOfOperatorCall {
        pub pool_id: [u8; 32],
    }
    ///Container type for all input parameters for the `createStakingPool` function with signature `createStakingPool(uint32,bool)` and selector `0x68a7d6cd`
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
    #[ethcall(name = "createStakingPool", abi = "createStakingPool(uint32,bool)")]
    pub struct CreateStakingPoolCall {
        pub operator_share: u32,
        pub add_operator_as_maker: bool,
    }
    ///Container type for all input parameters for the `currentEpoch` function with signature `currentEpoch()` and selector `0x76671808`
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
    #[ethcall(name = "currentEpoch", abi = "currentEpoch()")]
    pub struct CurrentEpochCall;
    ///Container type for all input parameters for the `currentEpochStartTimeInSeconds` function with signature `currentEpochStartTimeInSeconds()` and selector `0x587da023`
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
        name = "currentEpochStartTimeInSeconds",
        abi = "currentEpochStartTimeInSeconds()"
    )]
    pub struct CurrentEpochStartTimeInSecondsCall;
    ///Container type for all input parameters for the `decreaseStakingPoolOperatorShare` function with signature `decreaseStakingPoolOperatorShare(bytes32,uint32)` and selector `0x5d91121d`
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
        name = "decreaseStakingPoolOperatorShare",
        abi = "decreaseStakingPoolOperatorShare(bytes32,uint32)"
    )]
    pub struct DecreaseStakingPoolOperatorShareCall {
        pub pool_id: [u8; 32],
        pub new_operator_share: u32,
    }
    ///Container type for all input parameters for the `endEpoch` function with signature `endEpoch()` and selector `0x0b9663db`
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
    #[ethcall(name = "endEpoch", abi = "endEpoch()")]
    pub struct EndEpochCall;
    ///Container type for all input parameters for the `epochDurationInSeconds` function with signature `epochDurationInSeconds()` and selector `0x63403801`
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
    #[ethcall(name = "epochDurationInSeconds", abi = "epochDurationInSeconds()")]
    pub struct EpochDurationInSecondsCall;
    ///Container type for all input parameters for the `finalizePool` function with signature `finalizePool(bytes32)` and selector `0xff691b11`
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
    #[ethcall(name = "finalizePool", abi = "finalizePool(bytes32)")]
    pub struct FinalizePoolCall {
        pub pool_id: [u8; 32],
    }
    ///Container type for all input parameters for the `getAuthorizedAddresses` function with signature `getAuthorizedAddresses()` and selector `0xd39de6e9`
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
    #[ethcall(name = "getAuthorizedAddresses", abi = "getAuthorizedAddresses()")]
    pub struct GetAuthorizedAddressesCall;
    ///Container type for all input parameters for the `getCurrentEpochEarliestEndTimeInSeconds` function with signature `getCurrentEpochEarliestEndTimeInSeconds()` and selector `0xb2baa33e`
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
        name = "getCurrentEpochEarliestEndTimeInSeconds",
        abi = "getCurrentEpochEarliestEndTimeInSeconds()"
    )]
    pub struct GetCurrentEpochEarliestEndTimeInSecondsCall;
    ///Container type for all input parameters for the `getGlobalStakeByStatus` function with signature `getGlobalStakeByStatus(uint8)` and selector `0xe804d0a4`
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
    #[ethcall(name = "getGlobalStakeByStatus", abi = "getGlobalStakeByStatus(uint8)")]
    pub struct GetGlobalStakeByStatusCall {
        pub stake_status: u8,
    }
    ///Container type for all input parameters for the `getOwnerStakeByStatus` function with signature `getOwnerStakeByStatus(address,uint8)` and selector `0x44a6958b`
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
        name = "getOwnerStakeByStatus",
        abi = "getOwnerStakeByStatus(address,uint8)"
    )]
    pub struct GetOwnerStakeByStatusCall {
        pub staker: ::ethers::core::types::Address,
        pub stake_status: u8,
    }
    ///Container type for all input parameters for the `getParams` function with signature `getParams()` and selector `0x5e615a6b`
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
    #[ethcall(name = "getParams", abi = "getParams()")]
    pub struct GetParamsCall;
    ///Container type for all input parameters for the `getStakeDelegatedToPoolByOwner` function with signature `getStakeDelegatedToPoolByOwner(address,bytes32)` and selector `0xf252b7a1`
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
        name = "getStakeDelegatedToPoolByOwner",
        abi = "getStakeDelegatedToPoolByOwner(address,bytes32)"
    )]
    pub struct GetStakeDelegatedToPoolByOwnerCall {
        pub staker: ::ethers::core::types::Address,
        pub pool_id: [u8; 32],
    }
    ///Container type for all input parameters for the `getStakingPool` function with signature `getStakingPool(bytes32)` and selector `0x4bcc3f67`
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
    #[ethcall(name = "getStakingPool", abi = "getStakingPool(bytes32)")]
    pub struct GetStakingPoolCall {
        pub pool_id: [u8; 32],
    }
    ///Container type for all input parameters for the `getStakingPoolStatsThisEpoch` function with signature `getStakingPoolStatsThisEpoch(bytes32)` and selector `0x46b97959`
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
        name = "getStakingPoolStatsThisEpoch",
        abi = "getStakingPoolStatsThisEpoch(bytes32)"
    )]
    pub struct GetStakingPoolStatsThisEpochCall {
        pub pool_id: [u8; 32],
    }
    ///Container type for all input parameters for the `getTotalStake` function with signature `getTotalStake(address)` and selector `0x1e7ff8f6`
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
    #[ethcall(name = "getTotalStake", abi = "getTotalStake(address)")]
    pub struct GetTotalStakeCall {
        pub staker: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `getTotalStakeDelegatedToPool` function with signature `getTotalStakeDelegatedToPool(bytes32)` and selector `0x3e4ad732`
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
        name = "getTotalStakeDelegatedToPool",
        abi = "getTotalStakeDelegatedToPool(bytes32)"
    )]
    pub struct GetTotalStakeDelegatedToPoolCall {
        pub pool_id: [u8; 32],
    }
    ///Container type for all input parameters for the `getWethContract` function with signature `getWethContract()` and selector `0x3c277fc5`
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
    #[ethcall(name = "getWethContract", abi = "getWethContract()")]
    pub struct GetWethContractCall;
    ///Container type for all input parameters for the `getZrxVault` function with signature `getZrxVault()` and selector `0x624a7232`
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
    #[ethcall(name = "getZrxVault", abi = "getZrxVault()")]
    pub struct GetZrxVaultCall;
    ///Container type for all input parameters for the `init` function with signature `init()` and selector `0xe1c7392a`
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
    #[ethcall(name = "init", abi = "init()")]
    pub struct InitCall;
    ///Container type for all input parameters for the `joinStakingPoolAsMaker` function with signature `joinStakingPoolAsMaker(bytes32)` and selector `0xb3e33379`
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
    #[ethcall(name = "joinStakingPoolAsMaker", abi = "joinStakingPoolAsMaker(bytes32)")]
    pub struct JoinStakingPoolAsMakerCall {
        pub pool_id: [u8; 32],
    }
    ///Container type for all input parameters for the `lastPoolId` function with signature `lastPoolId()` and selector `0xa657e579`
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
    #[ethcall(name = "lastPoolId", abi = "lastPoolId()")]
    pub struct LastPoolIdCall;
    ///Container type for all input parameters for the `minimumPoolStake` function with signature `minimumPoolStake()` and selector `0xa26171e2`
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
    #[ethcall(name = "minimumPoolStake", abi = "minimumPoolStake()")]
    pub struct MinimumPoolStakeCall;
    ///Container type for all input parameters for the `moveStake` function with signature `moveStake((uint8,bytes32),(uint8,bytes32),uint256)` and selector `0x58f6c7e3`
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
        name = "moveStake",
        abi = "moveStake((uint8,bytes32),(uint8,bytes32),uint256)"
    )]
    pub struct MoveStakeCall {
        pub from: StakeInfo,
        pub to: StakeInfo,
        pub amount: ::ethers::core::types::U256,
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
    ///Container type for all input parameters for the `payProtocolFee` function with signature `payProtocolFee(address,address,uint256)` and selector `0xa3b4a327`
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
    #[ethcall(name = "payProtocolFee", abi = "payProtocolFee(address,address,uint256)")]
    pub struct PayProtocolFeeCall {
        pub maker_address: ::ethers::core::types::Address,
        pub payer_address: ::ethers::core::types::Address,
        pub protocol_fee: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `poolIdByMaker` function with signature `poolIdByMaker(address)` and selector `0xf1876532`
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
    #[ethcall(name = "poolIdByMaker", abi = "poolIdByMaker(address)")]
    pub struct PoolIdByMakerCall(pub ::ethers::core::types::Address);
    ///Container type for all input parameters for the `poolStatsByEpoch` function with signature `poolStatsByEpoch(bytes32,uint256)` and selector `0x2a94c279`
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
    #[ethcall(name = "poolStatsByEpoch", abi = "poolStatsByEpoch(bytes32,uint256)")]
    pub struct PoolStatsByEpochCall(pub [u8; 32], pub ::ethers::core::types::U256);
    ///Container type for all input parameters for the `removeAuthorizedAddress` function with signature `removeAuthorizedAddress(address)` and selector `0x70712939`
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
        name = "removeAuthorizedAddress",
        abi = "removeAuthorizedAddress(address)"
    )]
    pub struct RemoveAuthorizedAddressCall {
        pub target: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `removeAuthorizedAddressAtIndex` function with signature `removeAuthorizedAddressAtIndex(address,uint256)` and selector `0x9ad26744`
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
        name = "removeAuthorizedAddressAtIndex",
        abi = "removeAuthorizedAddressAtIndex(address,uint256)"
    )]
    pub struct RemoveAuthorizedAddressAtIndexCall {
        pub target: ::ethers::core::types::Address,
        pub index: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `removeExchangeAddress` function with signature `removeExchangeAddress(address)` and selector `0x01e28d84`
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
    #[ethcall(name = "removeExchangeAddress", abi = "removeExchangeAddress(address)")]
    pub struct RemoveExchangeAddressCall {
        pub addr: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `rewardDelegatedStakeWeight` function with signature `rewardDelegatedStakeWeight()` and selector `0xe0ee036e`
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
    #[ethcall(name = "rewardDelegatedStakeWeight", abi = "rewardDelegatedStakeWeight()")]
    pub struct RewardDelegatedStakeWeightCall;
    ///Container type for all input parameters for the `rewardsByPoolId` function with signature `rewardsByPoolId(bytes32)` and selector `0xc18c9141`
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
    #[ethcall(name = "rewardsByPoolId", abi = "rewardsByPoolId(bytes32)")]
    pub struct RewardsByPoolIdCall(pub [u8; 32]);
    ///Container type for all input parameters for the `setParams` function with signature `setParams(uint256,uint32,uint256,uint32,uint32)` and selector `0x9c3ccc82`
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
        name = "setParams",
        abi = "setParams(uint256,uint32,uint256,uint32,uint32)"
    )]
    pub struct SetParamsCall {
        pub epoch_duration_in_seconds: ::ethers::core::types::U256,
        pub reward_delegated_stake_weight: u32,
        pub minimum_pool_stake: ::ethers::core::types::U256,
        pub cobb_douglas_alpha_numerator: u32,
        pub cobb_douglas_alpha_denominator: u32,
    }
    ///Container type for all input parameters for the `stake` function with signature `stake(uint256)` and selector `0xa694fc3a`
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
    #[ethcall(name = "stake", abi = "stake(uint256)")]
    pub struct StakeCall {
        pub amount: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `stakingContract` function with signature `stakingContract()` and selector `0xee99205c`
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
    #[ethcall(name = "stakingContract", abi = "stakingContract()")]
    pub struct StakingContractCall;
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
    ///Container type for all input parameters for the `unstake` function with signature `unstake(uint256)` and selector `0x2e17de78`
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
    #[ethcall(name = "unstake", abi = "unstake(uint256)")]
    pub struct UnstakeCall {
        pub amount: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `validExchanges` function with signature `validExchanges(address)` and selector `0x5bd4ab73`
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
    #[ethcall(name = "validExchanges", abi = "validExchanges(address)")]
    pub struct ValidExchangesCall(pub ::ethers::core::types::Address);
    ///Container type for all input parameters for the `wethReservedForPoolRewards` function with signature `wethReservedForPoolRewards()` and selector `0xb0531524`
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
    #[ethcall(name = "wethReservedForPoolRewards", abi = "wethReservedForPoolRewards()")]
    pub struct WethReservedForPoolRewardsCall;
    ///Container type for all input parameters for the `withdrawDelegatorRewards` function with signature `withdrawDelegatorRewards(bytes32)` and selector `0xb510879f`
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
        name = "withdrawDelegatorRewards",
        abi = "withdrawDelegatorRewards(bytes32)"
    )]
    pub struct WithdrawDelegatorRewardsCall {
        pub pool_id: [u8; 32],
    }
    ///Container type for all of the contract's call
    #[derive(Clone, ::ethers::contract::EthAbiType, Debug, PartialEq, Eq, Hash)]
    pub enum zeroxstakingproxyCalls {
        AddAuthorizedAddress(AddAuthorizedAddressCall),
        AddExchangeAddress(AddExchangeAddressCall),
        AggregatedStatsByEpoch(AggregatedStatsByEpochCall),
        Authorities(AuthoritiesCall),
        Authorized(AuthorizedCall),
        CobbDouglasAlphaDenominator(CobbDouglasAlphaDenominatorCall),
        CobbDouglasAlphaNumerator(CobbDouglasAlphaNumeratorCall),
        ComputeRewardBalanceOfDelegator(ComputeRewardBalanceOfDelegatorCall),
        ComputeRewardBalanceOfOperator(ComputeRewardBalanceOfOperatorCall),
        CreateStakingPool(CreateStakingPoolCall),
        CurrentEpoch(CurrentEpochCall),
        CurrentEpochStartTimeInSeconds(CurrentEpochStartTimeInSecondsCall),
        DecreaseStakingPoolOperatorShare(DecreaseStakingPoolOperatorShareCall),
        EndEpoch(EndEpochCall),
        EpochDurationInSeconds(EpochDurationInSecondsCall),
        FinalizePool(FinalizePoolCall),
        GetAuthorizedAddresses(GetAuthorizedAddressesCall),
        GetCurrentEpochEarliestEndTimeInSeconds(
            GetCurrentEpochEarliestEndTimeInSecondsCall,
        ),
        GetGlobalStakeByStatus(GetGlobalStakeByStatusCall),
        GetOwnerStakeByStatus(GetOwnerStakeByStatusCall),
        GetParams(GetParamsCall),
        GetStakeDelegatedToPoolByOwner(GetStakeDelegatedToPoolByOwnerCall),
        GetStakingPool(GetStakingPoolCall),
        GetStakingPoolStatsThisEpoch(GetStakingPoolStatsThisEpochCall),
        GetTotalStake(GetTotalStakeCall),
        GetTotalStakeDelegatedToPool(GetTotalStakeDelegatedToPoolCall),
        GetWethContract(GetWethContractCall),
        GetZrxVault(GetZrxVaultCall),
        Init(InitCall),
        JoinStakingPoolAsMaker(JoinStakingPoolAsMakerCall),
        LastPoolId(LastPoolIdCall),
        MinimumPoolStake(MinimumPoolStakeCall),
        MoveStake(MoveStakeCall),
        Owner(OwnerCall),
        PayProtocolFee(PayProtocolFeeCall),
        PoolIdByMaker(PoolIdByMakerCall),
        PoolStatsByEpoch(PoolStatsByEpochCall),
        RemoveAuthorizedAddress(RemoveAuthorizedAddressCall),
        RemoveAuthorizedAddressAtIndex(RemoveAuthorizedAddressAtIndexCall),
        RemoveExchangeAddress(RemoveExchangeAddressCall),
        RewardDelegatedStakeWeight(RewardDelegatedStakeWeightCall),
        RewardsByPoolId(RewardsByPoolIdCall),
        SetParams(SetParamsCall),
        Stake(StakeCall),
        StakingContract(StakingContractCall),
        TransferOwnership(TransferOwnershipCall),
        Unstake(UnstakeCall),
        ValidExchanges(ValidExchangesCall),
        WethReservedForPoolRewards(WethReservedForPoolRewardsCall),
        WithdrawDelegatorRewards(WithdrawDelegatorRewardsCall),
    }
    impl ::ethers::core::abi::AbiDecode for zeroxstakingproxyCalls {
        fn decode(
            data: impl AsRef<[u8]>,
        ) -> ::core::result::Result<Self, ::ethers::core::abi::AbiError> {
            let data = data.as_ref();
            if let Ok(decoded) = <AddAuthorizedAddressCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::AddAuthorizedAddress(decoded));
            }
            if let Ok(decoded) = <AddExchangeAddressCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::AddExchangeAddress(decoded));
            }
            if let Ok(decoded) = <AggregatedStatsByEpochCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::AggregatedStatsByEpoch(decoded));
            }
            if let Ok(decoded) = <AuthoritiesCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::Authorities(decoded));
            }
            if let Ok(decoded) = <AuthorizedCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::Authorized(decoded));
            }
            if let Ok(decoded) = <CobbDouglasAlphaDenominatorCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::CobbDouglasAlphaDenominator(decoded));
            }
            if let Ok(decoded) = <CobbDouglasAlphaNumeratorCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::CobbDouglasAlphaNumerator(decoded));
            }
            if let Ok(decoded) = <ComputeRewardBalanceOfDelegatorCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::ComputeRewardBalanceOfDelegator(decoded));
            }
            if let Ok(decoded) = <ComputeRewardBalanceOfOperatorCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::ComputeRewardBalanceOfOperator(decoded));
            }
            if let Ok(decoded) = <CreateStakingPoolCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::CreateStakingPool(decoded));
            }
            if let Ok(decoded) = <CurrentEpochCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::CurrentEpoch(decoded));
            }
            if let Ok(decoded) = <CurrentEpochStartTimeInSecondsCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::CurrentEpochStartTimeInSeconds(decoded));
            }
            if let Ok(decoded) = <DecreaseStakingPoolOperatorShareCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::DecreaseStakingPoolOperatorShare(decoded));
            }
            if let Ok(decoded) = <EndEpochCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::EndEpoch(decoded));
            }
            if let Ok(decoded) = <EpochDurationInSecondsCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::EpochDurationInSeconds(decoded));
            }
            if let Ok(decoded) = <FinalizePoolCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::FinalizePool(decoded));
            }
            if let Ok(decoded) = <GetAuthorizedAddressesCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::GetAuthorizedAddresses(decoded));
            }
            if let Ok(decoded) = <GetCurrentEpochEarliestEndTimeInSecondsCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::GetCurrentEpochEarliestEndTimeInSeconds(decoded));
            }
            if let Ok(decoded) = <GetGlobalStakeByStatusCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::GetGlobalStakeByStatus(decoded));
            }
            if let Ok(decoded) = <GetOwnerStakeByStatusCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::GetOwnerStakeByStatus(decoded));
            }
            if let Ok(decoded) = <GetParamsCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::GetParams(decoded));
            }
            if let Ok(decoded) = <GetStakeDelegatedToPoolByOwnerCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::GetStakeDelegatedToPoolByOwner(decoded));
            }
            if let Ok(decoded) = <GetStakingPoolCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::GetStakingPool(decoded));
            }
            if let Ok(decoded) = <GetStakingPoolStatsThisEpochCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::GetStakingPoolStatsThisEpoch(decoded));
            }
            if let Ok(decoded) = <GetTotalStakeCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::GetTotalStake(decoded));
            }
            if let Ok(decoded) = <GetTotalStakeDelegatedToPoolCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::GetTotalStakeDelegatedToPool(decoded));
            }
            if let Ok(decoded) = <GetWethContractCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::GetWethContract(decoded));
            }
            if let Ok(decoded) = <GetZrxVaultCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::GetZrxVault(decoded));
            }
            if let Ok(decoded) = <InitCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::Init(decoded));
            }
            if let Ok(decoded) = <JoinStakingPoolAsMakerCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::JoinStakingPoolAsMaker(decoded));
            }
            if let Ok(decoded) = <LastPoolIdCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::LastPoolId(decoded));
            }
            if let Ok(decoded) = <MinimumPoolStakeCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::MinimumPoolStake(decoded));
            }
            if let Ok(decoded) = <MoveStakeCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::MoveStake(decoded));
            }
            if let Ok(decoded) = <OwnerCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::Owner(decoded));
            }
            if let Ok(decoded) = <PayProtocolFeeCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::PayProtocolFee(decoded));
            }
            if let Ok(decoded) = <PoolIdByMakerCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::PoolIdByMaker(decoded));
            }
            if let Ok(decoded) = <PoolStatsByEpochCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::PoolStatsByEpoch(decoded));
            }
            if let Ok(decoded) = <RemoveAuthorizedAddressCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::RemoveAuthorizedAddress(decoded));
            }
            if let Ok(decoded) = <RemoveAuthorizedAddressAtIndexCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::RemoveAuthorizedAddressAtIndex(decoded));
            }
            if let Ok(decoded) = <RemoveExchangeAddressCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::RemoveExchangeAddress(decoded));
            }
            if let Ok(decoded) = <RewardDelegatedStakeWeightCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::RewardDelegatedStakeWeight(decoded));
            }
            if let Ok(decoded) = <RewardsByPoolIdCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::RewardsByPoolId(decoded));
            }
            if let Ok(decoded) = <SetParamsCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::SetParams(decoded));
            }
            if let Ok(decoded) = <StakeCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::Stake(decoded));
            }
            if let Ok(decoded) = <StakingContractCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::StakingContract(decoded));
            }
            if let Ok(decoded) = <TransferOwnershipCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::TransferOwnership(decoded));
            }
            if let Ok(decoded) = <UnstakeCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::Unstake(decoded));
            }
            if let Ok(decoded) = <ValidExchangesCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::ValidExchanges(decoded));
            }
            if let Ok(decoded) = <WethReservedForPoolRewardsCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::WethReservedForPoolRewards(decoded));
            }
            if let Ok(decoded) = <WithdrawDelegatorRewardsCall as ::ethers::core::abi::AbiDecode>::decode(
                data,
            ) {
                return Ok(Self::WithdrawDelegatorRewards(decoded));
            }
            Err(::ethers::core::abi::Error::InvalidData.into())
        }
    }
    impl ::ethers::core::abi::AbiEncode for zeroxstakingproxyCalls {
        fn encode(self) -> Vec<u8> {
            match self {
                Self::AddAuthorizedAddress(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::AddExchangeAddress(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::AggregatedStatsByEpoch(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::Authorities(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::Authorized(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::CobbDouglasAlphaDenominator(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::CobbDouglasAlphaNumerator(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::ComputeRewardBalanceOfDelegator(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::ComputeRewardBalanceOfOperator(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::CreateStakingPool(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::CurrentEpoch(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::CurrentEpochStartTimeInSeconds(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::DecreaseStakingPoolOperatorShare(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::EndEpoch(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::EpochDurationInSeconds(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::FinalizePool(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetAuthorizedAddresses(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetCurrentEpochEarliestEndTimeInSeconds(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetGlobalStakeByStatus(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetOwnerStakeByStatus(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetParams(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetStakeDelegatedToPoolByOwner(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetStakingPool(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetStakingPoolStatsThisEpoch(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetTotalStake(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetTotalStakeDelegatedToPool(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetWethContract(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetZrxVault(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::Init(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::JoinStakingPoolAsMaker(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::LastPoolId(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::MinimumPoolStake(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::MoveStake(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::Owner(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::PayProtocolFee(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::PoolIdByMaker(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::PoolStatsByEpoch(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::RemoveAuthorizedAddress(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::RemoveAuthorizedAddressAtIndex(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::RemoveExchangeAddress(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::RewardDelegatedStakeWeight(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::RewardsByPoolId(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::SetParams(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::Stake(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::StakingContract(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::TransferOwnership(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::Unstake(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::ValidExchanges(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::WethReservedForPoolRewards(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::WithdrawDelegatorRewards(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
            }
        }
    }
    impl ::core::fmt::Display for zeroxstakingproxyCalls {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            match self {
                Self::AddAuthorizedAddress(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::AddExchangeAddress(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::AggregatedStatsByEpoch(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::Authorities(element) => ::core::fmt::Display::fmt(element, f),
                Self::Authorized(element) => ::core::fmt::Display::fmt(element, f),
                Self::CobbDouglasAlphaDenominator(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::CobbDouglasAlphaNumerator(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::ComputeRewardBalanceOfDelegator(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::ComputeRewardBalanceOfOperator(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::CreateStakingPool(element) => ::core::fmt::Display::fmt(element, f),
                Self::CurrentEpoch(element) => ::core::fmt::Display::fmt(element, f),
                Self::CurrentEpochStartTimeInSeconds(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::DecreaseStakingPoolOperatorShare(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::EndEpoch(element) => ::core::fmt::Display::fmt(element, f),
                Self::EpochDurationInSeconds(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::FinalizePool(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetAuthorizedAddresses(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::GetCurrentEpochEarliestEndTimeInSeconds(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::GetGlobalStakeByStatus(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::GetOwnerStakeByStatus(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::GetParams(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetStakeDelegatedToPoolByOwner(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::GetStakingPool(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetStakingPoolStatsThisEpoch(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::GetTotalStake(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetTotalStakeDelegatedToPool(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::GetWethContract(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetZrxVault(element) => ::core::fmt::Display::fmt(element, f),
                Self::Init(element) => ::core::fmt::Display::fmt(element, f),
                Self::JoinStakingPoolAsMaker(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::LastPoolId(element) => ::core::fmt::Display::fmt(element, f),
                Self::MinimumPoolStake(element) => ::core::fmt::Display::fmt(element, f),
                Self::MoveStake(element) => ::core::fmt::Display::fmt(element, f),
                Self::Owner(element) => ::core::fmt::Display::fmt(element, f),
                Self::PayProtocolFee(element) => ::core::fmt::Display::fmt(element, f),
                Self::PoolIdByMaker(element) => ::core::fmt::Display::fmt(element, f),
                Self::PoolStatsByEpoch(element) => ::core::fmt::Display::fmt(element, f),
                Self::RemoveAuthorizedAddress(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::RemoveAuthorizedAddressAtIndex(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::RemoveExchangeAddress(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::RewardDelegatedStakeWeight(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::RewardsByPoolId(element) => ::core::fmt::Display::fmt(element, f),
                Self::SetParams(element) => ::core::fmt::Display::fmt(element, f),
                Self::Stake(element) => ::core::fmt::Display::fmt(element, f),
                Self::StakingContract(element) => ::core::fmt::Display::fmt(element, f),
                Self::TransferOwnership(element) => ::core::fmt::Display::fmt(element, f),
                Self::Unstake(element) => ::core::fmt::Display::fmt(element, f),
                Self::ValidExchanges(element) => ::core::fmt::Display::fmt(element, f),
                Self::WethReservedForPoolRewards(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
                Self::WithdrawDelegatorRewards(element) => {
                    ::core::fmt::Display::fmt(element, f)
                }
            }
        }
    }
    impl ::core::convert::From<AddAuthorizedAddressCall> for zeroxstakingproxyCalls {
        fn from(value: AddAuthorizedAddressCall) -> Self {
            Self::AddAuthorizedAddress(value)
        }
    }
    impl ::core::convert::From<AddExchangeAddressCall> for zeroxstakingproxyCalls {
        fn from(value: AddExchangeAddressCall) -> Self {
            Self::AddExchangeAddress(value)
        }
    }
    impl ::core::convert::From<AggregatedStatsByEpochCall> for zeroxstakingproxyCalls {
        fn from(value: AggregatedStatsByEpochCall) -> Self {
            Self::AggregatedStatsByEpoch(value)
        }
    }
    impl ::core::convert::From<AuthoritiesCall> for zeroxstakingproxyCalls {
        fn from(value: AuthoritiesCall) -> Self {
            Self::Authorities(value)
        }
    }
    impl ::core::convert::From<AuthorizedCall> for zeroxstakingproxyCalls {
        fn from(value: AuthorizedCall) -> Self {
            Self::Authorized(value)
        }
    }
    impl ::core::convert::From<CobbDouglasAlphaDenominatorCall>
    for zeroxstakingproxyCalls {
        fn from(value: CobbDouglasAlphaDenominatorCall) -> Self {
            Self::CobbDouglasAlphaDenominator(value)
        }
    }
    impl ::core::convert::From<CobbDouglasAlphaNumeratorCall>
    for zeroxstakingproxyCalls {
        fn from(value: CobbDouglasAlphaNumeratorCall) -> Self {
            Self::CobbDouglasAlphaNumerator(value)
        }
    }
    impl ::core::convert::From<ComputeRewardBalanceOfDelegatorCall>
    for zeroxstakingproxyCalls {
        fn from(value: ComputeRewardBalanceOfDelegatorCall) -> Self {
            Self::ComputeRewardBalanceOfDelegator(value)
        }
    }
    impl ::core::convert::From<ComputeRewardBalanceOfOperatorCall>
    for zeroxstakingproxyCalls {
        fn from(value: ComputeRewardBalanceOfOperatorCall) -> Self {
            Self::ComputeRewardBalanceOfOperator(value)
        }
    }
    impl ::core::convert::From<CreateStakingPoolCall> for zeroxstakingproxyCalls {
        fn from(value: CreateStakingPoolCall) -> Self {
            Self::CreateStakingPool(value)
        }
    }
    impl ::core::convert::From<CurrentEpochCall> for zeroxstakingproxyCalls {
        fn from(value: CurrentEpochCall) -> Self {
            Self::CurrentEpoch(value)
        }
    }
    impl ::core::convert::From<CurrentEpochStartTimeInSecondsCall>
    for zeroxstakingproxyCalls {
        fn from(value: CurrentEpochStartTimeInSecondsCall) -> Self {
            Self::CurrentEpochStartTimeInSeconds(value)
        }
    }
    impl ::core::convert::From<DecreaseStakingPoolOperatorShareCall>
    for zeroxstakingproxyCalls {
        fn from(value: DecreaseStakingPoolOperatorShareCall) -> Self {
            Self::DecreaseStakingPoolOperatorShare(value)
        }
    }
    impl ::core::convert::From<EndEpochCall> for zeroxstakingproxyCalls {
        fn from(value: EndEpochCall) -> Self {
            Self::EndEpoch(value)
        }
    }
    impl ::core::convert::From<EpochDurationInSecondsCall> for zeroxstakingproxyCalls {
        fn from(value: EpochDurationInSecondsCall) -> Self {
            Self::EpochDurationInSeconds(value)
        }
    }
    impl ::core::convert::From<FinalizePoolCall> for zeroxstakingproxyCalls {
        fn from(value: FinalizePoolCall) -> Self {
            Self::FinalizePool(value)
        }
    }
    impl ::core::convert::From<GetAuthorizedAddressesCall> for zeroxstakingproxyCalls {
        fn from(value: GetAuthorizedAddressesCall) -> Self {
            Self::GetAuthorizedAddresses(value)
        }
    }
    impl ::core::convert::From<GetCurrentEpochEarliestEndTimeInSecondsCall>
    for zeroxstakingproxyCalls {
        fn from(value: GetCurrentEpochEarliestEndTimeInSecondsCall) -> Self {
            Self::GetCurrentEpochEarliestEndTimeInSeconds(value)
        }
    }
    impl ::core::convert::From<GetGlobalStakeByStatusCall> for zeroxstakingproxyCalls {
        fn from(value: GetGlobalStakeByStatusCall) -> Self {
            Self::GetGlobalStakeByStatus(value)
        }
    }
    impl ::core::convert::From<GetOwnerStakeByStatusCall> for zeroxstakingproxyCalls {
        fn from(value: GetOwnerStakeByStatusCall) -> Self {
            Self::GetOwnerStakeByStatus(value)
        }
    }
    impl ::core::convert::From<GetParamsCall> for zeroxstakingproxyCalls {
        fn from(value: GetParamsCall) -> Self {
            Self::GetParams(value)
        }
    }
    impl ::core::convert::From<GetStakeDelegatedToPoolByOwnerCall>
    for zeroxstakingproxyCalls {
        fn from(value: GetStakeDelegatedToPoolByOwnerCall) -> Self {
            Self::GetStakeDelegatedToPoolByOwner(value)
        }
    }
    impl ::core::convert::From<GetStakingPoolCall> for zeroxstakingproxyCalls {
        fn from(value: GetStakingPoolCall) -> Self {
            Self::GetStakingPool(value)
        }
    }
    impl ::core::convert::From<GetStakingPoolStatsThisEpochCall>
    for zeroxstakingproxyCalls {
        fn from(value: GetStakingPoolStatsThisEpochCall) -> Self {
            Self::GetStakingPoolStatsThisEpoch(value)
        }
    }
    impl ::core::convert::From<GetTotalStakeCall> for zeroxstakingproxyCalls {
        fn from(value: GetTotalStakeCall) -> Self {
            Self::GetTotalStake(value)
        }
    }
    impl ::core::convert::From<GetTotalStakeDelegatedToPoolCall>
    for zeroxstakingproxyCalls {
        fn from(value: GetTotalStakeDelegatedToPoolCall) -> Self {
            Self::GetTotalStakeDelegatedToPool(value)
        }
    }
    impl ::core::convert::From<GetWethContractCall> for zeroxstakingproxyCalls {
        fn from(value: GetWethContractCall) -> Self {
            Self::GetWethContract(value)
        }
    }
    impl ::core::convert::From<GetZrxVaultCall> for zeroxstakingproxyCalls {
        fn from(value: GetZrxVaultCall) -> Self {
            Self::GetZrxVault(value)
        }
    }
    impl ::core::convert::From<InitCall> for zeroxstakingproxyCalls {
        fn from(value: InitCall) -> Self {
            Self::Init(value)
        }
    }
    impl ::core::convert::From<JoinStakingPoolAsMakerCall> for zeroxstakingproxyCalls {
        fn from(value: JoinStakingPoolAsMakerCall) -> Self {
            Self::JoinStakingPoolAsMaker(value)
        }
    }
    impl ::core::convert::From<LastPoolIdCall> for zeroxstakingproxyCalls {
        fn from(value: LastPoolIdCall) -> Self {
            Self::LastPoolId(value)
        }
    }
    impl ::core::convert::From<MinimumPoolStakeCall> for zeroxstakingproxyCalls {
        fn from(value: MinimumPoolStakeCall) -> Self {
            Self::MinimumPoolStake(value)
        }
    }
    impl ::core::convert::From<MoveStakeCall> for zeroxstakingproxyCalls {
        fn from(value: MoveStakeCall) -> Self {
            Self::MoveStake(value)
        }
    }
    impl ::core::convert::From<OwnerCall> for zeroxstakingproxyCalls {
        fn from(value: OwnerCall) -> Self {
            Self::Owner(value)
        }
    }
    impl ::core::convert::From<PayProtocolFeeCall> for zeroxstakingproxyCalls {
        fn from(value: PayProtocolFeeCall) -> Self {
            Self::PayProtocolFee(value)
        }
    }
    impl ::core::convert::From<PoolIdByMakerCall> for zeroxstakingproxyCalls {
        fn from(value: PoolIdByMakerCall) -> Self {
            Self::PoolIdByMaker(value)
        }
    }
    impl ::core::convert::From<PoolStatsByEpochCall> for zeroxstakingproxyCalls {
        fn from(value: PoolStatsByEpochCall) -> Self {
            Self::PoolStatsByEpoch(value)
        }
    }
    impl ::core::convert::From<RemoveAuthorizedAddressCall> for zeroxstakingproxyCalls {
        fn from(value: RemoveAuthorizedAddressCall) -> Self {
            Self::RemoveAuthorizedAddress(value)
        }
    }
    impl ::core::convert::From<RemoveAuthorizedAddressAtIndexCall>
    for zeroxstakingproxyCalls {
        fn from(value: RemoveAuthorizedAddressAtIndexCall) -> Self {
            Self::RemoveAuthorizedAddressAtIndex(value)
        }
    }
    impl ::core::convert::From<RemoveExchangeAddressCall> for zeroxstakingproxyCalls {
        fn from(value: RemoveExchangeAddressCall) -> Self {
            Self::RemoveExchangeAddress(value)
        }
    }
    impl ::core::convert::From<RewardDelegatedStakeWeightCall>
    for zeroxstakingproxyCalls {
        fn from(value: RewardDelegatedStakeWeightCall) -> Self {
            Self::RewardDelegatedStakeWeight(value)
        }
    }
    impl ::core::convert::From<RewardsByPoolIdCall> for zeroxstakingproxyCalls {
        fn from(value: RewardsByPoolIdCall) -> Self {
            Self::RewardsByPoolId(value)
        }
    }
    impl ::core::convert::From<SetParamsCall> for zeroxstakingproxyCalls {
        fn from(value: SetParamsCall) -> Self {
            Self::SetParams(value)
        }
    }
    impl ::core::convert::From<StakeCall> for zeroxstakingproxyCalls {
        fn from(value: StakeCall) -> Self {
            Self::Stake(value)
        }
    }
    impl ::core::convert::From<StakingContractCall> for zeroxstakingproxyCalls {
        fn from(value: StakingContractCall) -> Self {
            Self::StakingContract(value)
        }
    }
    impl ::core::convert::From<TransferOwnershipCall> for zeroxstakingproxyCalls {
        fn from(value: TransferOwnershipCall) -> Self {
            Self::TransferOwnership(value)
        }
    }
    impl ::core::convert::From<UnstakeCall> for zeroxstakingproxyCalls {
        fn from(value: UnstakeCall) -> Self {
            Self::Unstake(value)
        }
    }
    impl ::core::convert::From<ValidExchangesCall> for zeroxstakingproxyCalls {
        fn from(value: ValidExchangesCall) -> Self {
            Self::ValidExchanges(value)
        }
    }
    impl ::core::convert::From<WethReservedForPoolRewardsCall>
    for zeroxstakingproxyCalls {
        fn from(value: WethReservedForPoolRewardsCall) -> Self {
            Self::WethReservedForPoolRewards(value)
        }
    }
    impl ::core::convert::From<WithdrawDelegatorRewardsCall> for zeroxstakingproxyCalls {
        fn from(value: WithdrawDelegatorRewardsCall) -> Self {
            Self::WithdrawDelegatorRewards(value)
        }
    }
    ///Container type for all return fields from the `aggregatedStatsByEpoch` function with signature `aggregatedStatsByEpoch(uint256)` and selector `0x38229d93`
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
    pub struct AggregatedStatsByEpochReturn {
        pub rewards_available: ::ethers::core::types::U256,
        pub num_pools_to_finalize: ::ethers::core::types::U256,
        pub total_fees_collected: ::ethers::core::types::U256,
        pub total_weighted_stake: ::ethers::core::types::U256,
        pub total_rewards_finalized: ::ethers::core::types::U256,
    }
    ///Container type for all return fields from the `authorities` function with signature `authorities(uint256)` and selector `0x494503d4`
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
    pub struct AuthoritiesReturn(pub ::ethers::core::types::Address);
    ///Container type for all return fields from the `authorized` function with signature `authorized(address)` and selector `0xb9181611`
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
    pub struct AuthorizedReturn(pub bool);
    ///Container type for all return fields from the `cobbDouglasAlphaDenominator` function with signature `cobbDouglasAlphaDenominator()` and selector `0xe8eeb3f8`
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
    pub struct CobbDouglasAlphaDenominatorReturn(pub u32);
    ///Container type for all return fields from the `cobbDouglasAlphaNumerator` function with signature `cobbDouglasAlphaNumerator()` and selector `0x81666796`
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
    pub struct CobbDouglasAlphaNumeratorReturn(pub u32);
    ///Container type for all return fields from the `computeRewardBalanceOfDelegator` function with signature `computeRewardBalanceOfDelegator(bytes32,address)` and selector `0xe907f003`
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
    pub struct ComputeRewardBalanceOfDelegatorReturn {
        pub reward: ::ethers::core::types::U256,
    }
    ///Container type for all return fields from the `computeRewardBalanceOfOperator` function with signature `computeRewardBalanceOfOperator(bytes32)` and selector `0xbb7ef7e0`
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
    pub struct ComputeRewardBalanceOfOperatorReturn {
        pub reward: ::ethers::core::types::U256,
    }
    ///Container type for all return fields from the `createStakingPool` function with signature `createStakingPool(uint32,bool)` and selector `0x68a7d6cd`
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
    pub struct CreateStakingPoolReturn {
        pub pool_id: [u8; 32],
    }
    ///Container type for all return fields from the `currentEpoch` function with signature `currentEpoch()` and selector `0x76671808`
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
    pub struct CurrentEpochReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `currentEpochStartTimeInSeconds` function with signature `currentEpochStartTimeInSeconds()` and selector `0x587da023`
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
    pub struct CurrentEpochStartTimeInSecondsReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `endEpoch` function with signature `endEpoch()` and selector `0x0b9663db`
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
    pub struct EndEpochReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `epochDurationInSeconds` function with signature `epochDurationInSeconds()` and selector `0x63403801`
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
    pub struct EpochDurationInSecondsReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `getAuthorizedAddresses` function with signature `getAuthorizedAddresses()` and selector `0xd39de6e9`
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
    pub struct GetAuthorizedAddressesReturn(
        pub ::std::vec::Vec<::ethers::core::types::Address>,
    );
    ///Container type for all return fields from the `getCurrentEpochEarliestEndTimeInSeconds` function with signature `getCurrentEpochEarliestEndTimeInSeconds()` and selector `0xb2baa33e`
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
    pub struct GetCurrentEpochEarliestEndTimeInSecondsReturn(
        pub ::ethers::core::types::U256,
    );
    ///Container type for all return fields from the `getGlobalStakeByStatus` function with signature `getGlobalStakeByStatus(uint8)` and selector `0xe804d0a4`
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
    pub struct GetGlobalStakeByStatusReturn {
        pub balance: StoredBalance,
    }
    ///Container type for all return fields from the `getOwnerStakeByStatus` function with signature `getOwnerStakeByStatus(address,uint8)` and selector `0x44a6958b`
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
    pub struct GetOwnerStakeByStatusReturn {
        pub balance: StoredBalance,
    }
    ///Container type for all return fields from the `getParams` function with signature `getParams()` and selector `0x5e615a6b`
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
    pub struct GetParamsReturn {
        pub epoch_duration_in_seconds: ::ethers::core::types::U256,
        pub reward_delegated_stake_weight: u32,
        pub minimum_pool_stake: ::ethers::core::types::U256,
        pub cobb_douglas_alpha_numerator: u32,
        pub cobb_douglas_alpha_denominator: u32,
    }
    ///Container type for all return fields from the `getStakeDelegatedToPoolByOwner` function with signature `getStakeDelegatedToPoolByOwner(address,bytes32)` and selector `0xf252b7a1`
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
    pub struct GetStakeDelegatedToPoolByOwnerReturn {
        pub balance: StoredBalance,
    }
    ///Container type for all return fields from the `getStakingPool` function with signature `getStakingPool(bytes32)` and selector `0x4bcc3f67`
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
    pub struct GetStakingPoolReturn(pub Pool);
    ///Container type for all return fields from the `getStakingPoolStatsThisEpoch` function with signature `getStakingPoolStatsThisEpoch(bytes32)` and selector `0x46b97959`
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
    pub struct GetStakingPoolStatsThisEpochReturn(pub PoolStats);
    ///Container type for all return fields from the `getTotalStake` function with signature `getTotalStake(address)` and selector `0x1e7ff8f6`
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
    pub struct GetTotalStakeReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `getTotalStakeDelegatedToPool` function with signature `getTotalStakeDelegatedToPool(bytes32)` and selector `0x3e4ad732`
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
    pub struct GetTotalStakeDelegatedToPoolReturn {
        pub balance: StoredBalance,
    }
    ///Container type for all return fields from the `getWethContract` function with signature `getWethContract()` and selector `0x3c277fc5`
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
    pub struct GetWethContractReturn {
        pub weth_contract: ::ethers::core::types::Address,
    }
    ///Container type for all return fields from the `getZrxVault` function with signature `getZrxVault()` and selector `0x624a7232`
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
    pub struct GetZrxVaultReturn {
        pub zrx_vault: ::ethers::core::types::Address,
    }
    ///Container type for all return fields from the `lastPoolId` function with signature `lastPoolId()` and selector `0xa657e579`
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
    pub struct LastPoolIdReturn(pub [u8; 32]);
    ///Container type for all return fields from the `minimumPoolStake` function with signature `minimumPoolStake()` and selector `0xa26171e2`
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
    pub struct MinimumPoolStakeReturn(pub ::ethers::core::types::U256);
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
    ///Container type for all return fields from the `poolIdByMaker` function with signature `poolIdByMaker(address)` and selector `0xf1876532`
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
    pub struct PoolIdByMakerReturn(pub [u8; 32]);
    ///Container type for all return fields from the `poolStatsByEpoch` function with signature `poolStatsByEpoch(bytes32,uint256)` and selector `0x2a94c279`
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
    pub struct PoolStatsByEpochReturn {
        pub fees_collected: ::ethers::core::types::U256,
        pub weighted_stake: ::ethers::core::types::U256,
        pub members_stake: ::ethers::core::types::U256,
    }
    ///Container type for all return fields from the `rewardDelegatedStakeWeight` function with signature `rewardDelegatedStakeWeight()` and selector `0xe0ee036e`
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
    pub struct RewardDelegatedStakeWeightReturn(pub u32);
    ///Container type for all return fields from the `rewardsByPoolId` function with signature `rewardsByPoolId(bytes32)` and selector `0xc18c9141`
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
    pub struct RewardsByPoolIdReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `stakingContract` function with signature `stakingContract()` and selector `0xee99205c`
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
    pub struct StakingContractReturn(pub ::ethers::core::types::Address);
    ///Container type for all return fields from the `validExchanges` function with signature `validExchanges(address)` and selector `0x5bd4ab73`
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
    pub struct ValidExchangesReturn(pub bool);
    ///Container type for all return fields from the `wethReservedForPoolRewards` function with signature `wethReservedForPoolRewards()` and selector `0xb0531524`
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
    pub struct WethReservedForPoolRewardsReturn(pub ::ethers::core::types::U256);
    ///`Pool(address,uint32)`
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
    pub struct Pool {
        pub operator: ::ethers::core::types::Address,
        pub operator_share: u32,
    }
    ///`PoolStats(uint256,uint256,uint256)`
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
    pub struct PoolStats {
        pub fees_collected: ::ethers::core::types::U256,
        pub weighted_stake: ::ethers::core::types::U256,
        pub members_stake: ::ethers::core::types::U256,
    }
    ///`StakeInfo(uint8,bytes32)`
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
    pub struct StakeInfo {
        pub status: u8,
        pub pool_id: [u8; 32],
    }
    ///`StoredBalance(uint64,uint96,uint96)`
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
    pub struct StoredBalance {
        pub current_epoch: u64,
        pub current_epoch_balance: u128,
        pub next_epoch_balance: u128,
    }
}
