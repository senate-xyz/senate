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
    #[allow(deprecated)]
    fn __abi() -> ::ethers::core::abi::Abi {
        ::ethers::core::abi::ethabi::Contract {
            constructor: ::core::option::Option::Some(::ethers::core::abi::ethabi::Constructor {
                inputs: ::std::vec![
                    ::ethers::core::abi::ethabi::Param {
                        name: ::std::borrow::ToOwned::to_owned("stakingProxy_"),
                        kind: ::ethers::core::abi::ethabi::ParamType::Address,
                        internal_type: ::core::option::Option::Some(
                            ::std::borrow::ToOwned::to_owned("contract IStaking"),
                        ),
                    },
                    ::ethers::core::abi::ethabi::Param {
                        name: ::std::borrow::ToOwned::to_owned("params"),
                        kind: ::ethers::core::abi::ethabi::ParamType::Tuple(
                            ::std::vec![
                                ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize),
                            ],
                        ),
                        internal_type: ::core::option::Option::Some(
                            ::std::borrow::ToOwned::to_owned(
                                "struct IZrxTreasury.TreasuryParameters",
                            ),
                        ),
                    },
                ],
            }),
            functions: ::core::convert::From::from([
                (
                    ::std::borrow::ToOwned::to_owned("castVote"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("castVote"),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("proposalId"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Uint(
                                        256usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("uint256"),
                                    ),
                                },
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("support"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Bool,
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("bool"),
                                    ),
                                },
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("operatedPoolIds"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Array(
                                        ::std::boxed::Box::new(
                                            ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize),
                                        ),
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("bytes32[]"),
                                    ),
                                },
                            ],
                            outputs: ::std::vec![],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::NonPayable,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("defaultPoolId"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("defaultPoolId"),
                            inputs: ::std::vec![],
                            outputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::string::String::new(),
                                    kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(
                                        32usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("bytes32"),
                                    ),
                                },
                            ],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("defaultPoolOperator"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned(
                                "defaultPoolOperator",
                            ),
                            inputs: ::std::vec![],
                            outputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::string::String::new(),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned(
                                            "contract DefaultPoolOperator",
                                        ),
                                    ),
                                },
                            ],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("execute"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("execute"),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("proposalId"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Uint(
                                        256usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("uint256"),
                                    ),
                                },
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("actions"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Array(
                                        ::std::boxed::Box::new(
                                            ::ethers::core::abi::ethabi::ParamType::Tuple(
                                                ::std::vec![
                                                    ::ethers::core::abi::ethabi::ParamType::Address,
                                                    ::ethers::core::abi::ethabi::ParamType::Bytes,
                                                    ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                                ],
                                            ),
                                        ),
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned(
                                            "struct IZrxTreasury.ProposedAction[]",
                                        ),
                                    ),
                                },
                            ],
                            outputs: ::std::vec![],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::Payable,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("getVotingPower"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("getVotingPower"),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("account"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("address"),
                                    ),
                                },
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("operatedPoolIds"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Array(
                                        ::std::boxed::Box::new(
                                            ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize),
                                        ),
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("bytes32[]"),
                                    ),
                                },
                            ],
                            outputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("votingPower"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Uint(
                                        256usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("uint256"),
                                    ),
                                },
                            ],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("hasVoted"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("hasVoted"),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::string::String::new(),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Uint(
                                        256usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("uint256"),
                                    ),
                                },
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::string::String::new(),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("address"),
                                    ),
                                },
                            ],
                            outputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::string::String::new(),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Bool,
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("bool"),
                                    ),
                                },
                            ],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("proposalCount"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("proposalCount"),
                            inputs: ::std::vec![],
                            outputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("count"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Uint(
                                        256usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("uint256"),
                                    ),
                                },
                            ],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("proposalThreshold"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("proposalThreshold"),
                            inputs: ::std::vec![],
                            outputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::string::String::new(),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Uint(
                                        256usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("uint256"),
                                    ),
                                },
                            ],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("proposals"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("proposals"),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::string::String::new(),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Uint(
                                        256usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("uint256"),
                                    ),
                                },
                            ],
                            outputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("actionsHash"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::FixedBytes(
                                        32usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("bytes32"),
                                    ),
                                },
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("executionEpoch"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Uint(
                                        256usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("uint256"),
                                    ),
                                },
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("voteEpoch"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Uint(
                                        256usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("uint256"),
                                    ),
                                },
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("votesFor"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Uint(
                                        256usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("uint256"),
                                    ),
                                },
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("votesAgainst"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Uint(
                                        256usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("uint256"),
                                    ),
                                },
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("executed"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Bool,
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("bool"),
                                    ),
                                },
                            ],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("propose"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("propose"),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("actions"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Array(
                                        ::std::boxed::Box::new(
                                            ::ethers::core::abi::ethabi::ParamType::Tuple(
                                                ::std::vec![
                                                    ::ethers::core::abi::ethabi::ParamType::Address,
                                                    ::ethers::core::abi::ethabi::ParamType::Bytes,
                                                    ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                                ],
                                            ),
                                        ),
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned(
                                            "struct IZrxTreasury.ProposedAction[]",
                                        ),
                                    ),
                                },
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("executionEpoch"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Uint(
                                        256usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("uint256"),
                                    ),
                                },
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("description"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::String,
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("string"),
                                    ),
                                },
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("operatedPoolIds"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Array(
                                        ::std::boxed::Box::new(
                                            ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize),
                                        ),
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("bytes32[]"),
                                    ),
                                },
                            ],
                            outputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned("proposalId"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Uint(
                                        256usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("uint256"),
                                    ),
                                },
                            ],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::NonPayable,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("quorumThreshold"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("quorumThreshold"),
                            inputs: ::std::vec![],
                            outputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::string::String::new(),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Uint(
                                        256usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("uint256"),
                                    ),
                                },
                            ],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("stakingProxy"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("stakingProxy"),
                            inputs: ::std::vec![],
                            outputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::string::String::new(),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("contract IStaking"),
                                    ),
                                },
                            ],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("updateThresholds"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("updateThresholds"),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned(
                                        "newProposalThreshold",
                                    ),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Uint(
                                        256usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("uint256"),
                                    ),
                                },
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::borrow::ToOwned::to_owned(
                                        "newQuorumThreshold",
                                    ),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Uint(
                                        256usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("uint256"),
                                    ),
                                },
                            ],
                            outputs: ::std::vec![],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::NonPayable,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("votingPeriod"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Function {
                            name: ::std::borrow::ToOwned::to_owned("votingPeriod"),
                            inputs: ::std::vec![],
                            outputs: ::std::vec![
                                ::ethers::core::abi::ethabi::Param {
                                    name: ::std::string::String::new(),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Uint(
                                        256usize,
                                    ),
                                    internal_type: ::core::option::Option::Some(
                                        ::std::borrow::ToOwned::to_owned("uint256"),
                                    ),
                                },
                            ],
                            constant: ::core::option::Option::None,
                            state_mutability: ::ethers::core::abi::ethabi::StateMutability::View,
                        },
                    ],
                ),
            ]),
            events: ::core::convert::From::from([
                (
                    ::std::borrow::ToOwned::to_owned("ProposalCreated"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Event {
                            name: ::std::borrow::ToOwned::to_owned("ProposalCreated"),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::EventParam {
                                    name: ::std::borrow::ToOwned::to_owned("proposer"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                    indexed: false,
                                },
                                ::ethers::core::abi::ethabi::EventParam {
                                    name: ::std::borrow::ToOwned::to_owned("operatedPoolIds"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Array(
                                        ::std::boxed::Box::new(
                                            ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize),
                                        ),
                                    ),
                                    indexed: false,
                                },
                                ::ethers::core::abi::ethabi::EventParam {
                                    name: ::std::borrow::ToOwned::to_owned("proposalId"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Uint(
                                        256usize,
                                    ),
                                    indexed: false,
                                },
                                ::ethers::core::abi::ethabi::EventParam {
                                    name: ::std::borrow::ToOwned::to_owned("actions"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Array(
                                        ::std::boxed::Box::new(
                                            ::ethers::core::abi::ethabi::ParamType::Tuple(
                                                ::std::vec![
                                                    ::ethers::core::abi::ethabi::ParamType::Address,
                                                    ::ethers::core::abi::ethabi::ParamType::Bytes,
                                                    ::ethers::core::abi::ethabi::ParamType::Uint(256usize),
                                                ],
                                            ),
                                        ),
                                    ),
                                    indexed: false,
                                },
                                ::ethers::core::abi::ethabi::EventParam {
                                    name: ::std::borrow::ToOwned::to_owned("executionEpoch"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Uint(
                                        256usize,
                                    ),
                                    indexed: false,
                                },
                                ::ethers::core::abi::ethabi::EventParam {
                                    name: ::std::borrow::ToOwned::to_owned("description"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::String,
                                    indexed: false,
                                },
                            ],
                            anonymous: false,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("ProposalExecuted"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Event {
                            name: ::std::borrow::ToOwned::to_owned("ProposalExecuted"),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::EventParam {
                                    name: ::std::borrow::ToOwned::to_owned("proposalId"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Uint(
                                        256usize,
                                    ),
                                    indexed: false,
                                },
                            ],
                            anonymous: false,
                        },
                    ],
                ),
                (
                    ::std::borrow::ToOwned::to_owned("VoteCast"),
                    ::std::vec![
                        ::ethers::core::abi::ethabi::Event {
                            name: ::std::borrow::ToOwned::to_owned("VoteCast"),
                            inputs: ::std::vec![
                                ::ethers::core::abi::ethabi::EventParam {
                                    name: ::std::borrow::ToOwned::to_owned("voter"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Address,
                                    indexed: false,
                                },
                                ::ethers::core::abi::ethabi::EventParam {
                                    name: ::std::borrow::ToOwned::to_owned("operatedPoolIds"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Array(
                                        ::std::boxed::Box::new(
                                            ::ethers::core::abi::ethabi::ParamType::FixedBytes(32usize),
                                        ),
                                    ),
                                    indexed: false,
                                },
                                ::ethers::core::abi::ethabi::EventParam {
                                    name: ::std::borrow::ToOwned::to_owned("proposalId"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Uint(
                                        256usize,
                                    ),
                                    indexed: false,
                                },
                                ::ethers::core::abi::ethabi::EventParam {
                                    name: ::std::borrow::ToOwned::to_owned("support"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Bool,
                                    indexed: false,
                                },
                                ::ethers::core::abi::ethabi::EventParam {
                                    name: ::std::borrow::ToOwned::to_owned("votingPower"),
                                    kind: ::ethers::core::abi::ethabi::ParamType::Uint(
                                        256usize,
                                    ),
                                    indexed: false,
                                },
                            ],
                            anonymous: false,
                        },
                    ],
                ),
            ]),
            errors: ::std::collections::BTreeMap::new(),
            receive: true,
            fallback: false,
        }
    }
    ///The parsed JSON ABI of the contract.
    pub static ZEROXTREASURY_ABI: ::ethers::contract::Lazy<::ethers::core::abi::Abi> = ::ethers::contract::Lazy::new(
        __abi,
    );
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
            f.debug_tuple(::core::stringify!(zeroxtreasury))
                .field(&self.address())
                .finish()
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
            if let Ok(decoded)
                = <CastVoteCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::CastVote(decoded));
            }
            if let Ok(decoded)
                = <DefaultPoolIdCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::DefaultPoolId(decoded));
            }
            if let Ok(decoded)
                = <DefaultPoolOperatorCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::DefaultPoolOperator(decoded));
            }
            if let Ok(decoded)
                = <ExecuteCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Execute(decoded));
            }
            if let Ok(decoded)
                = <GetVotingPowerCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::GetVotingPower(decoded));
            }
            if let Ok(decoded)
                = <HasVotedCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::HasVoted(decoded));
            }
            if let Ok(decoded)
                = <ProposalCountCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::ProposalCount(decoded));
            }
            if let Ok(decoded)
                = <ProposalThresholdCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::ProposalThreshold(decoded));
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
                = <QuorumThresholdCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::QuorumThreshold(decoded));
            }
            if let Ok(decoded)
                = <StakingProxyCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::StakingProxy(decoded));
            }
            if let Ok(decoded)
                = <UpdateThresholdsCall as ::ethers::core::abi::AbiDecode>::decode(
                    data,
                ) {
                return Ok(Self::UpdateThresholds(decoded));
            }
            if let Ok(decoded)
                = <VotingPeriodCall as ::ethers::core::abi::AbiDecode>::decode(data) {
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
