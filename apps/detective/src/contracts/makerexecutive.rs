pub use makerexecutive::*;
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
pub mod makerexecutive {
    #[rustfmt::skip]
    const __ABI: &str = "[\n  {\n    \"inputs\": [\n      {\n        \"internalType\": \"contract DSToken\",\n        \"name\": \"GOV\",\n        \"type\": \"address\"\n      },\n      {\n        \"internalType\": \"contract DSToken\",\n        \"name\": \"IOU\",\n        \"type\": \"address\"\n      },\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"MAX_YAYS\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"constructor\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"bytes32\",\n        \"name\": \"slate\",\n        \"type\": \"bytes32\"\n      }\n    ],\n    \"name\": \"Etch\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": true,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"bytes4\",\n        \"name\": \"sig\",\n        \"type\": \"bytes4\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"guy\",\n        \"type\": \"address\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"bytes32\",\n        \"name\": \"foo\",\n        \"type\": \"bytes32\"\n      },\n      {\n        \"indexed\": true,\n        \"internalType\": \"bytes32\",\n        \"name\": \"bar\",\n        \"type\": \"bytes32\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"uint256\",\n        \"name\": \"wad\",\n        \"type\": \"uint256\"\n      },\n      {\n        \"indexed\": false,\n        \"internalType\": \"bytes\",\n        \"name\": \"fax\",\n        \"type\": \"bytes\"\n      }\n    ],\n    \"name\": \"LogNote\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"authority\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"LogSetAuthority\",\n    \"type\": \"event\"\n  },\n  {\n    \"anonymous\": false,\n    \"inputs\": [\n      {\n        \"indexed\": true,\n        \"internalType\": \"address\",\n        \"name\": \"owner\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"LogSetOwner\",\n    \"type\": \"event\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [],\n    \"name\": \"GOV\",\n    \"outputs\": [\n      {\n        \"internalType\": \"contract DSToken\",\n        \"name\": \"\",\n        \"type\": \"address\"\n      }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [],\n    \"name\": \"IOU\",\n    \"outputs\": [\n      {\n        \"internalType\": \"contract DSToken\",\n        \"name\": \"\",\n        \"type\": \"address\"\n      }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [],\n    \"name\": \"MAX_YAYS\",\n    \"outputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [\n      {\n        \"internalType\": \"address\",\n        \"name\": \"\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"approvals\",\n    \"outputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [],\n    \"name\": \"authority\",\n    \"outputs\": [\n      {\n        \"internalType\": \"contract DSAuthority\",\n        \"name\": \"\",\n        \"type\": \"address\"\n      }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [\n      {\n        \"internalType\": \"address\",\n        \"name\": \"caller\",\n        \"type\": \"address\"\n      },\n      {\n        \"internalType\": \"address\",\n        \"name\": \"code\",\n        \"type\": \"address\"\n      },\n      {\n        \"internalType\": \"bytes4\",\n        \"name\": \"sig\",\n        \"type\": \"bytes4\"\n      }\n    ],\n    \"name\": \"canCall\",\n    \"outputs\": [\n      {\n        \"internalType\": \"bool\",\n        \"name\": \"\",\n        \"type\": \"bool\"\n      }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [\n      {\n        \"internalType\": \"address\",\n        \"name\": \"\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"deposits\",\n    \"outputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": false,\n    \"inputs\": [\n      {\n        \"internalType\": \"address[]\",\n        \"name\": \"yays\",\n        \"type\": \"address[]\"\n      }\n    ],\n    \"name\": \"etch\",\n    \"outputs\": [\n      {\n        \"internalType\": \"bytes32\",\n        \"name\": \"slate\",\n        \"type\": \"bytes32\"\n      }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": false,\n    \"inputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"wad\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"free\",\n    \"outputs\": [],\n    \"payable\": false,\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [\n      {\n        \"internalType\": \"address\",\n        \"name\": \"code\",\n        \"type\": \"address\"\n      },\n      {\n        \"internalType\": \"bytes4\",\n        \"name\": \"sig\",\n        \"type\": \"bytes4\"\n      }\n    ],\n    \"name\": \"getCapabilityRoles\",\n    \"outputs\": [\n      {\n        \"internalType\": \"bytes32\",\n        \"name\": \"\",\n        \"type\": \"bytes32\"\n      }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [\n      {\n        \"internalType\": \"address\",\n        \"name\": \"who\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"getUserRoles\",\n    \"outputs\": [\n      {\n        \"internalType\": \"bytes32\",\n        \"name\": \"\",\n        \"type\": \"bytes32\"\n      }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [\n      {\n        \"internalType\": \"address\",\n        \"name\": \"who\",\n        \"type\": \"address\"\n      },\n      {\n        \"internalType\": \"uint8\",\n        \"name\": \"role\",\n        \"type\": \"uint8\"\n      }\n    ],\n    \"name\": \"hasUserRole\",\n    \"outputs\": [\n      {\n        \"internalType\": \"bool\",\n        \"name\": \"\",\n        \"type\": \"bool\"\n      }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [],\n    \"name\": \"hat\",\n    \"outputs\": [\n      {\n        \"internalType\": \"address\",\n        \"name\": \"\",\n        \"type\": \"address\"\n      }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [\n      {\n        \"internalType\": \"address\",\n        \"name\": \"code\",\n        \"type\": \"address\"\n      },\n      {\n        \"internalType\": \"bytes4\",\n        \"name\": \"sig\",\n        \"type\": \"bytes4\"\n      }\n    ],\n    \"name\": \"isCapabilityPublic\",\n    \"outputs\": [\n      {\n        \"internalType\": \"bool\",\n        \"name\": \"\",\n        \"type\": \"bool\"\n      }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [\n      {\n        \"internalType\": \"address\",\n        \"name\": \"who\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"isUserRoot\",\n    \"outputs\": [\n      {\n        \"internalType\": \"bool\",\n        \"name\": \"\",\n        \"type\": \"bool\"\n      }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [\n      {\n        \"internalType\": \"address\",\n        \"name\": \"\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"last\",\n    \"outputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": false,\n    \"inputs\": [],\n    \"name\": \"launch\",\n    \"outputs\": [],\n    \"payable\": false,\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": false,\n    \"inputs\": [\n      {\n        \"internalType\": \"address\",\n        \"name\": \"whom\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"lift\",\n    \"outputs\": [],\n    \"payable\": false,\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [],\n    \"name\": \"live\",\n    \"outputs\": [\n      {\n        \"internalType\": \"bool\",\n        \"name\": \"\",\n        \"type\": \"bool\"\n      }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": false,\n    \"inputs\": [\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"wad\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"lock\",\n    \"outputs\": [],\n    \"payable\": false,\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [],\n    \"name\": \"owner\",\n    \"outputs\": [\n      {\n        \"internalType\": \"address\",\n        \"name\": \"\",\n        \"type\": \"address\"\n      }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": false,\n    \"inputs\": [\n      {\n        \"internalType\": \"contract DSAuthority\",\n        \"name\": \"authority_\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"setAuthority\",\n    \"outputs\": [],\n    \"payable\": false,\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": false,\n    \"inputs\": [\n      {\n        \"internalType\": \"address\",\n        \"name\": \"owner_\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"setOwner\",\n    \"outputs\": [],\n    \"payable\": false,\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": false,\n    \"inputs\": [\n      {\n        \"internalType\": \"address\",\n        \"name\": \"code\",\n        \"type\": \"address\"\n      },\n      {\n        \"internalType\": \"bytes4\",\n        \"name\": \"sig\",\n        \"type\": \"bytes4\"\n      },\n      {\n        \"internalType\": \"bool\",\n        \"name\": \"enabled\",\n        \"type\": \"bool\"\n      }\n    ],\n    \"name\": \"setPublicCapability\",\n    \"outputs\": [],\n    \"payable\": false,\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": false,\n    \"inputs\": [\n      {\n        \"internalType\": \"uint8\",\n        \"name\": \"role\",\n        \"type\": \"uint8\"\n      },\n      {\n        \"internalType\": \"address\",\n        \"name\": \"code\",\n        \"type\": \"address\"\n      },\n      {\n        \"internalType\": \"bytes4\",\n        \"name\": \"sig\",\n        \"type\": \"bytes4\"\n      },\n      {\n        \"internalType\": \"bool\",\n        \"name\": \"enabled\",\n        \"type\": \"bool\"\n      }\n    ],\n    \"name\": \"setRoleCapability\",\n    \"outputs\": [],\n    \"payable\": false,\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": false,\n    \"inputs\": [\n      {\n        \"internalType\": \"address\",\n        \"name\": \"who\",\n        \"type\": \"address\"\n      },\n      {\n        \"internalType\": \"bool\",\n        \"name\": \"enabled\",\n        \"type\": \"bool\"\n      }\n    ],\n    \"name\": \"setRootUser\",\n    \"outputs\": [],\n    \"payable\": false,\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": false,\n    \"inputs\": [\n      {\n        \"internalType\": \"address\",\n        \"name\": \"who\",\n        \"type\": \"address\"\n      },\n      {\n        \"internalType\": \"uint8\",\n        \"name\": \"role\",\n        \"type\": \"uint8\"\n      },\n      {\n        \"internalType\": \"bool\",\n        \"name\": \"enabled\",\n        \"type\": \"bool\"\n      }\n    ],\n    \"name\": \"setUserRole\",\n    \"outputs\": [],\n    \"payable\": false,\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [\n      {\n        \"internalType\": \"bytes32\",\n        \"name\": \"\",\n        \"type\": \"bytes32\"\n      },\n      {\n        \"internalType\": \"uint256\",\n        \"name\": \"\",\n        \"type\": \"uint256\"\n      }\n    ],\n    \"name\": \"slates\",\n    \"outputs\": [\n      {\n        \"internalType\": \"address\",\n        \"name\": \"\",\n        \"type\": \"address\"\n      }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": false,\n    \"inputs\": [\n      {\n        \"internalType\": \"bytes32\",\n        \"name\": \"slate\",\n        \"type\": \"bytes32\"\n      }\n    ],\n    \"name\": \"vote\",\n    \"outputs\": [],\n    \"payable\": false,\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": false,\n    \"inputs\": [\n      {\n        \"internalType\": \"address[]\",\n        \"name\": \"yays\",\n        \"type\": \"address[]\"\n      }\n    ],\n    \"name\": \"vote\",\n    \"outputs\": [\n      {\n        \"internalType\": \"bytes32\",\n        \"name\": \"\",\n        \"type\": \"bytes32\"\n      }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"nonpayable\",\n    \"type\": \"function\"\n  },\n  {\n    \"constant\": true,\n    \"inputs\": [\n      {\n        \"internalType\": \"address\",\n        \"name\": \"\",\n        \"type\": \"address\"\n      }\n    ],\n    \"name\": \"votes\",\n    \"outputs\": [\n      {\n        \"internalType\": \"bytes32\",\n        \"name\": \"\",\n        \"type\": \"bytes32\"\n      }\n    ],\n    \"payable\": false,\n    \"stateMutability\": \"view\",\n    \"type\": \"function\"\n  }\n]\n";
    ///The parsed JSON ABI of the contract.
    pub static MAKEREXECUTIVE_ABI: ::ethers::contract::Lazy<::ethers::core::abi::Abi> =
        ::ethers::contract::Lazy::new(|| {
            ::ethers::core::utils::__serde_json::from_str(__ABI).expect("ABI is always valid")
        });
    pub struct makerexecutive<M>(::ethers::contract::Contract<M>);
    impl<M> ::core::clone::Clone for makerexecutive<M> {
        fn clone(&self) -> Self {
            Self(::core::clone::Clone::clone(&self.0))
        }
    }
    impl<M> ::core::ops::Deref for makerexecutive<M> {
        type Target = ::ethers::contract::Contract<M>;
        fn deref(&self) -> &Self::Target {
            &self.0
        }
    }
    impl<M> ::core::ops::DerefMut for makerexecutive<M> {
        fn deref_mut(&mut self) -> &mut Self::Target {
            &mut self.0
        }
    }
    impl<M> ::core::fmt::Debug for makerexecutive<M> {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            f.debug_tuple(stringify!(makerexecutive))
                .field(&self.address())
                .finish()
        }
    }
    impl<M: ::ethers::providers::Middleware> makerexecutive<M> {
        /// Creates a new contract instance with the specified `ethers` client at
        /// `address`. The contract derefs to a `ethers::Contract` object.
        pub fn new<T: Into<::ethers::core::types::Address>>(
            address: T,
            client: ::std::sync::Arc<M>,
        ) -> Self {
            Self(::ethers::contract::Contract::new(
                address.into(),
                MAKEREXECUTIVE_ABI.clone(),
                client,
            ))
        }
        ///Calls the contract's `GOV` (0x180cb47f) function
        pub fn gov(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::Address> {
            self.0
                .method_hash([24, 12, 180, 127], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `IOU` (0x046c472f) function
        pub fn iou(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::Address> {
            self.0
                .method_hash([4, 108, 71, 47], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `MAX_YAYS` (0x362344b8) function
        pub fn max_yays(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([54, 35, 68, 184], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `approvals` (0x5d0341ba) function
        pub fn approvals(
            &self,
            p0: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([93, 3, 65, 186], p0)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `authority` (0xbf7e214f) function
        pub fn authority(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::Address> {
            self.0
                .method_hash([191, 126, 33, 79], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `canCall` (0xb7009613) function
        pub fn can_call(
            &self,
            caller: ::ethers::core::types::Address,
            code: ::ethers::core::types::Address,
            sig: [u8; 4],
        ) -> ::ethers::contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([183, 0, 150, 19], (caller, code, sig))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `deposits` (0xfc7e286d) function
        pub fn deposits(
            &self,
            p0: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([252, 126, 40, 109], p0)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `etch` (0x5123e1fa) function
        pub fn etch(
            &self,
            yays: ::std::vec::Vec<::ethers::core::types::Address>,
        ) -> ::ethers::contract::builders::ContractCall<M, [u8; 32]> {
            self.0
                .method_hash([81, 35, 225, 250], yays)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `free` (0xd8ccd0f3) function
        pub fn free(
            &self,
            wad: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([216, 204, 208, 243], wad)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getCapabilityRoles` (0x27538e90) function
        pub fn get_capability_roles(
            &self,
            code: ::ethers::core::types::Address,
            sig: [u8; 4],
        ) -> ::ethers::contract::builders::ContractCall<M, [u8; 32]> {
            self.0
                .method_hash([39, 83, 142, 144], (code, sig))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `getUserRoles` (0x06a36aee) function
        pub fn get_user_roles(
            &self,
            who: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, [u8; 32]> {
            self.0
                .method_hash([6, 163, 106, 238], who)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `hasUserRole` (0xa078f737) function
        pub fn has_user_role(
            &self,
            who: ::ethers::core::types::Address,
            role: u8,
        ) -> ::ethers::contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([160, 120, 247, 55], (who, role))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `hat` (0xfe95a5ce) function
        pub fn hat(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::Address> {
            self.0
                .method_hash([254, 149, 165, 206], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `isCapabilityPublic` (0x2f47571f) function
        pub fn is_capability_public(
            &self,
            code: ::ethers::core::types::Address,
            sig: [u8; 4],
        ) -> ::ethers::contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([47, 71, 87, 31], (code, sig))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `isUserRoot` (0xfbf80773) function
        pub fn is_user_root(
            &self,
            who: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([251, 248, 7, 115], who)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `last` (0x9a816f7d) function
        pub fn last(
            &self,
            p0: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::U256> {
            self.0
                .method_hash([154, 129, 111, 125], p0)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `launch` (0x01339c21) function
        pub fn launch(&self) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([1, 51, 156, 33], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `lift` (0x3c278bd5) function
        pub fn lift(
            &self,
            whom: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([60, 39, 139, 213], whom)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `live` (0x957aa58c) function
        pub fn live(&self) -> ::ethers::contract::builders::ContractCall<M, bool> {
            self.0
                .method_hash([149, 122, 165, 140], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `lock` (0xdd467064) function
        pub fn lock(
            &self,
            wad: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([221, 70, 112, 100], wad)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `owner` (0x8da5cb5b) function
        pub fn owner(
            &self,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::Address> {
            self.0
                .method_hash([141, 165, 203, 91], ())
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `setAuthority` (0x7a9e5e4b) function
        pub fn set_authority(
            &self,
            authority: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([122, 158, 94, 75], authority)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `setOwner` (0x13af4035) function
        pub fn set_owner(
            &self,
            owner: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([19, 175, 64, 53], owner)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `setPublicCapability` (0xc6b0263e) function
        pub fn set_public_capability(
            &self,
            code: ::ethers::core::types::Address,
            sig: [u8; 4],
            enabled: bool,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([198, 176, 38, 62], (code, sig, enabled))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `setRoleCapability` (0x7d40583d) function
        pub fn set_role_capability(
            &self,
            role: u8,
            code: ::ethers::core::types::Address,
            sig: [u8; 4],
            enabled: bool,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([125, 64, 88, 61], (role, code, sig, enabled))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `setRootUser` (0xd381ba7c) function
        pub fn set_root_user(
            &self,
            who: ::ethers::core::types::Address,
            enabled: bool,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([211, 129, 186, 124], (who, enabled))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `setUserRole` (0x67aff484) function
        pub fn set_user_role(
            &self,
            who: ::ethers::core::types::Address,
            role: u8,
            enabled: bool,
        ) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([103, 175, 244, 132], (who, role, enabled))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `slates` (0xc2ffc7bb) function
        pub fn slates(
            &self,
            p0: [u8; 32],
            p1: ::ethers::core::types::U256,
        ) -> ::ethers::contract::builders::ContractCall<M, ::ethers::core::types::Address> {
            self.0
                .method_hash([194, 255, 199, 187], (p0, p1))
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `vote` (0xa69beaba) function
        pub fn vote(&self, slate: [u8; 32]) -> ::ethers::contract::builders::ContractCall<M, ()> {
            self.0
                .method_hash([166, 155, 234, 186], slate)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `vote` (0xed081329) function
        pub fn vote_with_yays(
            &self,
            yays: ::std::vec::Vec<::ethers::core::types::Address>,
        ) -> ::ethers::contract::builders::ContractCall<M, [u8; 32]> {
            self.0
                .method_hash([237, 8, 19, 41], yays)
                .expect("method not found (this should never happen)")
        }
        ///Calls the contract's `votes` (0xd8bff5a5) function
        pub fn votes(
            &self,
            p0: ::ethers::core::types::Address,
        ) -> ::ethers::contract::builders::ContractCall<M, [u8; 32]> {
            self.0
                .method_hash([216, 191, 245, 165], p0)
                .expect("method not found (this should never happen)")
        }
        ///Gets the contract's `Etch` event
        pub fn etch_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, EtchFilter> {
            self.0.event()
        }
        ///Gets the contract's `LogNote` event
        pub fn log_note_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, LogNoteFilter> {
            self.0.event()
        }
        ///Gets the contract's `LogSetAuthority` event
        pub fn log_set_authority_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, LogSetAuthorityFilter>
        {
            self.0.event()
        }
        ///Gets the contract's `LogSetOwner` event
        pub fn log_set_owner_filter(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, LogSetOwnerFilter>
        {
            self.0.event()
        }
        /// Returns an `Event` builder for all the events of this contract.
        pub fn events(
            &self,
        ) -> ::ethers::contract::builders::Event<::std::sync::Arc<M>, M, makerexecutiveEvents>
        {
            self.0
                .event_with_filter(::core::default::Default::default())
        }
    }
    impl<M: ::ethers::providers::Middleware> From<::ethers::contract::Contract<M>>
        for makerexecutive<M>
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
    #[ethevent(name = "Etch", abi = "Etch(bytes32)")]
    pub struct EtchFilter {
        #[ethevent(indexed)]
        pub slate: [u8; 32],
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
        name = "LogNote",
        abi = "LogNote(bytes4,address,bytes32,bytes32,uint256,bytes) anonymous"
    )]
    pub struct LogNoteFilter {
        #[ethevent(indexed)]
        pub sig: [u8; 4],
        #[ethevent(indexed)]
        pub guy: ::ethers::core::types::Address,
        #[ethevent(indexed)]
        pub foo: [u8; 32],
        #[ethevent(indexed)]
        pub bar: [u8; 32],
        pub wad: ::ethers::core::types::U256,
        pub fax: ::ethers::core::types::Bytes,
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
    #[ethevent(name = "LogSetAuthority", abi = "LogSetAuthority(address)")]
    pub struct LogSetAuthorityFilter {
        #[ethevent(indexed)]
        pub authority: ::ethers::core::types::Address,
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
    #[ethevent(name = "LogSetOwner", abi = "LogSetOwner(address)")]
    pub struct LogSetOwnerFilter {
        #[ethevent(indexed)]
        pub owner: ::ethers::core::types::Address,
    }
    ///Container type for all of the contract's events
    #[derive(Clone, ::ethers::contract::EthAbiType, Debug, PartialEq, Eq, Hash)]
    pub enum makerexecutiveEvents {
        EtchFilter(EtchFilter),
        LogNoteFilter(LogNoteFilter),
        LogSetAuthorityFilter(LogSetAuthorityFilter),
        LogSetOwnerFilter(LogSetOwnerFilter),
    }
    impl ::ethers::contract::EthLogDecode for makerexecutiveEvents {
        fn decode_log(
            log: &::ethers::core::abi::RawLog,
        ) -> ::core::result::Result<Self, ::ethers::core::abi::Error> {
            if let Ok(decoded) = EtchFilter::decode_log(log) {
                return Ok(makerexecutiveEvents::EtchFilter(decoded));
            }
            if let Ok(decoded) = LogNoteFilter::decode_log(log) {
                return Ok(makerexecutiveEvents::LogNoteFilter(decoded));
            }
            if let Ok(decoded) = LogSetAuthorityFilter::decode_log(log) {
                return Ok(makerexecutiveEvents::LogSetAuthorityFilter(decoded));
            }
            if let Ok(decoded) = LogSetOwnerFilter::decode_log(log) {
                return Ok(makerexecutiveEvents::LogSetOwnerFilter(decoded));
            }
            Err(::ethers::core::abi::Error::InvalidData)
        }
    }
    impl ::core::fmt::Display for makerexecutiveEvents {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            match self {
                Self::EtchFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::LogNoteFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::LogSetAuthorityFilter(element) => ::core::fmt::Display::fmt(element, f),
                Self::LogSetOwnerFilter(element) => ::core::fmt::Display::fmt(element, f),
            }
        }
    }
    impl ::core::convert::From<EtchFilter> for makerexecutiveEvents {
        fn from(value: EtchFilter) -> Self {
            Self::EtchFilter(value)
        }
    }
    impl ::core::convert::From<LogNoteFilter> for makerexecutiveEvents {
        fn from(value: LogNoteFilter) -> Self {
            Self::LogNoteFilter(value)
        }
    }
    impl ::core::convert::From<LogSetAuthorityFilter> for makerexecutiveEvents {
        fn from(value: LogSetAuthorityFilter) -> Self {
            Self::LogSetAuthorityFilter(value)
        }
    }
    impl ::core::convert::From<LogSetOwnerFilter> for makerexecutiveEvents {
        fn from(value: LogSetOwnerFilter) -> Self {
            Self::LogSetOwnerFilter(value)
        }
    }
    ///Container type for all input parameters for the `GOV` function with signature `GOV()` and selector `0x180cb47f`
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
    #[ethcall(name = "GOV", abi = "GOV()")]
    pub struct GovCall;
    ///Container type for all input parameters for the `IOU` function with signature `IOU()` and selector `0x046c472f`
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
    #[ethcall(name = "IOU", abi = "IOU()")]
    pub struct IouCall;
    ///Container type for all input parameters for the `MAX_YAYS` function with signature `MAX_YAYS()` and selector `0x362344b8`
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
    #[ethcall(name = "MAX_YAYS", abi = "MAX_YAYS()")]
    pub struct MaxYaysCall;
    ///Container type for all input parameters for the `approvals` function with signature `approvals(address)` and selector `0x5d0341ba`
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
    #[ethcall(name = "approvals", abi = "approvals(address)")]
    pub struct ApprovalsCall(pub ::ethers::core::types::Address);
    ///Container type for all input parameters for the `authority` function with signature `authority()` and selector `0xbf7e214f`
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
    #[ethcall(name = "authority", abi = "authority()")]
    pub struct AuthorityCall;
    ///Container type for all input parameters for the `canCall` function with signature `canCall(address,address,bytes4)` and selector `0xb7009613`
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
    #[ethcall(name = "canCall", abi = "canCall(address,address,bytes4)")]
    pub struct CanCallCall {
        pub caller: ::ethers::core::types::Address,
        pub code: ::ethers::core::types::Address,
        pub sig: [u8; 4],
    }
    ///Container type for all input parameters for the `deposits` function with signature `deposits(address)` and selector `0xfc7e286d`
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
    #[ethcall(name = "deposits", abi = "deposits(address)")]
    pub struct DepositsCall(pub ::ethers::core::types::Address);
    ///Container type for all input parameters for the `etch` function with signature `etch(address[])` and selector `0x5123e1fa`
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
    #[ethcall(name = "etch", abi = "etch(address[])")]
    pub struct EtchCall {
        pub yays: ::std::vec::Vec<::ethers::core::types::Address>,
    }
    ///Container type for all input parameters for the `free` function with signature `free(uint256)` and selector `0xd8ccd0f3`
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
    #[ethcall(name = "free", abi = "free(uint256)")]
    pub struct FreeCall {
        pub wad: ::ethers::core::types::U256,
    }
    ///Container type for all input parameters for the `getCapabilityRoles` function with signature `getCapabilityRoles(address,bytes4)` and selector `0x27538e90`
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
        name = "getCapabilityRoles",
        abi = "getCapabilityRoles(address,bytes4)"
    )]
    pub struct GetCapabilityRolesCall {
        pub code: ::ethers::core::types::Address,
        pub sig: [u8; 4],
    }
    ///Container type for all input parameters for the `getUserRoles` function with signature `getUserRoles(address)` and selector `0x06a36aee`
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
    #[ethcall(name = "getUserRoles", abi = "getUserRoles(address)")]
    pub struct GetUserRolesCall {
        pub who: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `hasUserRole` function with signature `hasUserRole(address,uint8)` and selector `0xa078f737`
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
    #[ethcall(name = "hasUserRole", abi = "hasUserRole(address,uint8)")]
    pub struct HasUserRoleCall {
        pub who: ::ethers::core::types::Address,
        pub role: u8,
    }
    ///Container type for all input parameters for the `hat` function with signature `hat()` and selector `0xfe95a5ce`
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
    #[ethcall(name = "hat", abi = "hat()")]
    pub struct HatCall;
    ///Container type for all input parameters for the `isCapabilityPublic` function with signature `isCapabilityPublic(address,bytes4)` and selector `0x2f47571f`
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
        name = "isCapabilityPublic",
        abi = "isCapabilityPublic(address,bytes4)"
    )]
    pub struct IsCapabilityPublicCall {
        pub code: ::ethers::core::types::Address,
        pub sig: [u8; 4],
    }
    ///Container type for all input parameters for the `isUserRoot` function with signature `isUserRoot(address)` and selector `0xfbf80773`
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
    #[ethcall(name = "isUserRoot", abi = "isUserRoot(address)")]
    pub struct IsUserRootCall {
        pub who: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `last` function with signature `last(address)` and selector `0x9a816f7d`
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
    #[ethcall(name = "last", abi = "last(address)")]
    pub struct LastCall(pub ::ethers::core::types::Address);
    ///Container type for all input parameters for the `launch` function with signature `launch()` and selector `0x01339c21`
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
    #[ethcall(name = "launch", abi = "launch()")]
    pub struct LaunchCall;
    ///Container type for all input parameters for the `lift` function with signature `lift(address)` and selector `0x3c278bd5`
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
    #[ethcall(name = "lift", abi = "lift(address)")]
    pub struct LiftCall {
        pub whom: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `live` function with signature `live()` and selector `0x957aa58c`
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
    #[ethcall(name = "live", abi = "live()")]
    pub struct LiveCall;
    ///Container type for all input parameters for the `lock` function with signature `lock(uint256)` and selector `0xdd467064`
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
    #[ethcall(name = "lock", abi = "lock(uint256)")]
    pub struct LockCall {
        pub wad: ::ethers::core::types::U256,
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
        Hash,
    )]
    #[ethcall(name = "owner", abi = "owner()")]
    pub struct OwnerCall;
    ///Container type for all input parameters for the `setAuthority` function with signature `setAuthority(address)` and selector `0x7a9e5e4b`
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
    #[ethcall(name = "setAuthority", abi = "setAuthority(address)")]
    pub struct SetAuthorityCall {
        pub authority: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `setOwner` function with signature `setOwner(address)` and selector `0x13af4035`
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
    #[ethcall(name = "setOwner", abi = "setOwner(address)")]
    pub struct SetOwnerCall {
        pub owner: ::ethers::core::types::Address,
    }
    ///Container type for all input parameters for the `setPublicCapability` function with signature `setPublicCapability(address,bytes4,bool)` and selector `0xc6b0263e`
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
        name = "setPublicCapability",
        abi = "setPublicCapability(address,bytes4,bool)"
    )]
    pub struct SetPublicCapabilityCall {
        pub code: ::ethers::core::types::Address,
        pub sig: [u8; 4],
        pub enabled: bool,
    }
    ///Container type for all input parameters for the `setRoleCapability` function with signature `setRoleCapability(uint8,address,bytes4,bool)` and selector `0x7d40583d`
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
        name = "setRoleCapability",
        abi = "setRoleCapability(uint8,address,bytes4,bool)"
    )]
    pub struct SetRoleCapabilityCall {
        pub role: u8,
        pub code: ::ethers::core::types::Address,
        pub sig: [u8; 4],
        pub enabled: bool,
    }
    ///Container type for all input parameters for the `setRootUser` function with signature `setRootUser(address,bool)` and selector `0xd381ba7c`
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
    #[ethcall(name = "setRootUser", abi = "setRootUser(address,bool)")]
    pub struct SetRootUserCall {
        pub who: ::ethers::core::types::Address,
        pub enabled: bool,
    }
    ///Container type for all input parameters for the `setUserRole` function with signature `setUserRole(address,uint8,bool)` and selector `0x67aff484`
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
    #[ethcall(name = "setUserRole", abi = "setUserRole(address,uint8,bool)")]
    pub struct SetUserRoleCall {
        pub who: ::ethers::core::types::Address,
        pub role: u8,
        pub enabled: bool,
    }
    ///Container type for all input parameters for the `slates` function with signature `slates(bytes32,uint256)` and selector `0xc2ffc7bb`
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
    #[ethcall(name = "slates", abi = "slates(bytes32,uint256)")]
    pub struct SlatesCall(pub [u8; 32], pub ::ethers::core::types::U256);
    ///Container type for all input parameters for the `vote` function with signature `vote(bytes32)` and selector `0xa69beaba`
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
    #[ethcall(name = "vote", abi = "vote(bytes32)")]
    pub struct VoteCall {
        pub slate: [u8; 32],
    }
    ///Container type for all input parameters for the `vote` function with signature `vote(address[])` and selector `0xed081329`
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
    #[ethcall(name = "vote", abi = "vote(address[])")]
    pub struct VoteWithYaysCall {
        pub yays: ::std::vec::Vec<::ethers::core::types::Address>,
    }
    ///Container type for all input parameters for the `votes` function with signature `votes(address)` and selector `0xd8bff5a5`
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
    #[ethcall(name = "votes", abi = "votes(address)")]
    pub struct VotesCall(pub ::ethers::core::types::Address);
    ///Container type for all of the contract's call
    #[derive(Clone, ::ethers::contract::EthAbiType, Debug, PartialEq, Eq, Hash)]
    pub enum makerexecutiveCalls {
        Gov(GovCall),
        Iou(IouCall),
        MaxYays(MaxYaysCall),
        Approvals(ApprovalsCall),
        Authority(AuthorityCall),
        CanCall(CanCallCall),
        Deposits(DepositsCall),
        Etch(EtchCall),
        Free(FreeCall),
        GetCapabilityRoles(GetCapabilityRolesCall),
        GetUserRoles(GetUserRolesCall),
        HasUserRole(HasUserRoleCall),
        Hat(HatCall),
        IsCapabilityPublic(IsCapabilityPublicCall),
        IsUserRoot(IsUserRootCall),
        Last(LastCall),
        Launch(LaunchCall),
        Lift(LiftCall),
        Live(LiveCall),
        Lock(LockCall),
        Owner(OwnerCall),
        SetAuthority(SetAuthorityCall),
        SetOwner(SetOwnerCall),
        SetPublicCapability(SetPublicCapabilityCall),
        SetRoleCapability(SetRoleCapabilityCall),
        SetRootUser(SetRootUserCall),
        SetUserRole(SetUserRoleCall),
        Slates(SlatesCall),
        Vote(VoteCall),
        VoteWithYays(VoteWithYaysCall),
        Votes(VotesCall),
    }
    impl ::ethers::core::abi::AbiDecode for makerexecutiveCalls {
        fn decode(
            data: impl AsRef<[u8]>,
        ) -> ::core::result::Result<Self, ::ethers::core::abi::AbiError> {
            let data = data.as_ref();
            if let Ok(decoded) = <GovCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Gov(decoded));
            }
            if let Ok(decoded) = <IouCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Iou(decoded));
            }
            if let Ok(decoded) = <MaxYaysCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::MaxYays(decoded));
            }
            if let Ok(decoded) = <ApprovalsCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Approvals(decoded));
            }
            if let Ok(decoded) = <AuthorityCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Authority(decoded));
            }
            if let Ok(decoded) = <CanCallCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::CanCall(decoded));
            }
            if let Ok(decoded) = <DepositsCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Deposits(decoded));
            }
            if let Ok(decoded) = <EtchCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Etch(decoded));
            }
            if let Ok(decoded) = <FreeCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Free(decoded));
            }
            if let Ok(decoded) =
                <GetCapabilityRolesCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::GetCapabilityRoles(decoded));
            }
            if let Ok(decoded) = <GetUserRolesCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::GetUserRoles(decoded));
            }
            if let Ok(decoded) = <HasUserRoleCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::HasUserRole(decoded));
            }
            if let Ok(decoded) = <HatCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Hat(decoded));
            }
            if let Ok(decoded) =
                <IsCapabilityPublicCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::IsCapabilityPublic(decoded));
            }
            if let Ok(decoded) = <IsUserRootCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::IsUserRoot(decoded));
            }
            if let Ok(decoded) = <LastCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Last(decoded));
            }
            if let Ok(decoded) = <LaunchCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Launch(decoded));
            }
            if let Ok(decoded) = <LiftCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Lift(decoded));
            }
            if let Ok(decoded) = <LiveCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Live(decoded));
            }
            if let Ok(decoded) = <LockCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Lock(decoded));
            }
            if let Ok(decoded) = <OwnerCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Owner(decoded));
            }
            if let Ok(decoded) = <SetAuthorityCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::SetAuthority(decoded));
            }
            if let Ok(decoded) = <SetOwnerCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::SetOwner(decoded));
            }
            if let Ok(decoded) =
                <SetPublicCapabilityCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::SetPublicCapability(decoded));
            }
            if let Ok(decoded) =
                <SetRoleCapabilityCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::SetRoleCapability(decoded));
            }
            if let Ok(decoded) = <SetRootUserCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::SetRootUser(decoded));
            }
            if let Ok(decoded) = <SetUserRoleCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::SetUserRole(decoded));
            }
            if let Ok(decoded) = <SlatesCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Slates(decoded));
            }
            if let Ok(decoded) = <VoteCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Vote(decoded));
            }
            if let Ok(decoded) = <VoteWithYaysCall as ::ethers::core::abi::AbiDecode>::decode(data)
            {
                return Ok(Self::VoteWithYays(decoded));
            }
            if let Ok(decoded) = <VotesCall as ::ethers::core::abi::AbiDecode>::decode(data) {
                return Ok(Self::Votes(decoded));
            }
            Err(::ethers::core::abi::Error::InvalidData.into())
        }
    }
    impl ::ethers::core::abi::AbiEncode for makerexecutiveCalls {
        fn encode(self) -> Vec<u8> {
            match self {
                Self::Gov(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::Iou(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::MaxYays(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::Approvals(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::Authority(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::CanCall(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::Deposits(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::Etch(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::Free(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::GetCapabilityRoles(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::GetUserRoles(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::HasUserRole(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::Hat(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::IsCapabilityPublic(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::IsUserRoot(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::Last(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::Launch(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::Lift(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::Live(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::Lock(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::Owner(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::SetAuthority(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::SetOwner(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::SetPublicCapability(element) => {
                    ::ethers::core::abi::AbiEncode::encode(element)
                }
                Self::SetRoleCapability(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::SetRootUser(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::SetUserRole(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::Slates(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::Vote(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::VoteWithYays(element) => ::ethers::core::abi::AbiEncode::encode(element),
                Self::Votes(element) => ::ethers::core::abi::AbiEncode::encode(element),
            }
        }
    }
    impl ::core::fmt::Display for makerexecutiveCalls {
        fn fmt(&self, f: &mut ::core::fmt::Formatter<'_>) -> ::core::fmt::Result {
            match self {
                Self::Gov(element) => ::core::fmt::Display::fmt(element, f),
                Self::Iou(element) => ::core::fmt::Display::fmt(element, f),
                Self::MaxYays(element) => ::core::fmt::Display::fmt(element, f),
                Self::Approvals(element) => ::core::fmt::Display::fmt(element, f),
                Self::Authority(element) => ::core::fmt::Display::fmt(element, f),
                Self::CanCall(element) => ::core::fmt::Display::fmt(element, f),
                Self::Deposits(element) => ::core::fmt::Display::fmt(element, f),
                Self::Etch(element) => ::core::fmt::Display::fmt(element, f),
                Self::Free(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetCapabilityRoles(element) => ::core::fmt::Display::fmt(element, f),
                Self::GetUserRoles(element) => ::core::fmt::Display::fmt(element, f),
                Self::HasUserRole(element) => ::core::fmt::Display::fmt(element, f),
                Self::Hat(element) => ::core::fmt::Display::fmt(element, f),
                Self::IsCapabilityPublic(element) => ::core::fmt::Display::fmt(element, f),
                Self::IsUserRoot(element) => ::core::fmt::Display::fmt(element, f),
                Self::Last(element) => ::core::fmt::Display::fmt(element, f),
                Self::Launch(element) => ::core::fmt::Display::fmt(element, f),
                Self::Lift(element) => ::core::fmt::Display::fmt(element, f),
                Self::Live(element) => ::core::fmt::Display::fmt(element, f),
                Self::Lock(element) => ::core::fmt::Display::fmt(element, f),
                Self::Owner(element) => ::core::fmt::Display::fmt(element, f),
                Self::SetAuthority(element) => ::core::fmt::Display::fmt(element, f),
                Self::SetOwner(element) => ::core::fmt::Display::fmt(element, f),
                Self::SetPublicCapability(element) => ::core::fmt::Display::fmt(element, f),
                Self::SetRoleCapability(element) => ::core::fmt::Display::fmt(element, f),
                Self::SetRootUser(element) => ::core::fmt::Display::fmt(element, f),
                Self::SetUserRole(element) => ::core::fmt::Display::fmt(element, f),
                Self::Slates(element) => ::core::fmt::Display::fmt(element, f),
                Self::Vote(element) => ::core::fmt::Display::fmt(element, f),
                Self::VoteWithYays(element) => ::core::fmt::Display::fmt(element, f),
                Self::Votes(element) => ::core::fmt::Display::fmt(element, f),
            }
        }
    }
    impl ::core::convert::From<GovCall> for makerexecutiveCalls {
        fn from(value: GovCall) -> Self {
            Self::Gov(value)
        }
    }
    impl ::core::convert::From<IouCall> for makerexecutiveCalls {
        fn from(value: IouCall) -> Self {
            Self::Iou(value)
        }
    }
    impl ::core::convert::From<MaxYaysCall> for makerexecutiveCalls {
        fn from(value: MaxYaysCall) -> Self {
            Self::MaxYays(value)
        }
    }
    impl ::core::convert::From<ApprovalsCall> for makerexecutiveCalls {
        fn from(value: ApprovalsCall) -> Self {
            Self::Approvals(value)
        }
    }
    impl ::core::convert::From<AuthorityCall> for makerexecutiveCalls {
        fn from(value: AuthorityCall) -> Self {
            Self::Authority(value)
        }
    }
    impl ::core::convert::From<CanCallCall> for makerexecutiveCalls {
        fn from(value: CanCallCall) -> Self {
            Self::CanCall(value)
        }
    }
    impl ::core::convert::From<DepositsCall> for makerexecutiveCalls {
        fn from(value: DepositsCall) -> Self {
            Self::Deposits(value)
        }
    }
    impl ::core::convert::From<EtchCall> for makerexecutiveCalls {
        fn from(value: EtchCall) -> Self {
            Self::Etch(value)
        }
    }
    impl ::core::convert::From<FreeCall> for makerexecutiveCalls {
        fn from(value: FreeCall) -> Self {
            Self::Free(value)
        }
    }
    impl ::core::convert::From<GetCapabilityRolesCall> for makerexecutiveCalls {
        fn from(value: GetCapabilityRolesCall) -> Self {
            Self::GetCapabilityRoles(value)
        }
    }
    impl ::core::convert::From<GetUserRolesCall> for makerexecutiveCalls {
        fn from(value: GetUserRolesCall) -> Self {
            Self::GetUserRoles(value)
        }
    }
    impl ::core::convert::From<HasUserRoleCall> for makerexecutiveCalls {
        fn from(value: HasUserRoleCall) -> Self {
            Self::HasUserRole(value)
        }
    }
    impl ::core::convert::From<HatCall> for makerexecutiveCalls {
        fn from(value: HatCall) -> Self {
            Self::Hat(value)
        }
    }
    impl ::core::convert::From<IsCapabilityPublicCall> for makerexecutiveCalls {
        fn from(value: IsCapabilityPublicCall) -> Self {
            Self::IsCapabilityPublic(value)
        }
    }
    impl ::core::convert::From<IsUserRootCall> for makerexecutiveCalls {
        fn from(value: IsUserRootCall) -> Self {
            Self::IsUserRoot(value)
        }
    }
    impl ::core::convert::From<LastCall> for makerexecutiveCalls {
        fn from(value: LastCall) -> Self {
            Self::Last(value)
        }
    }
    impl ::core::convert::From<LaunchCall> for makerexecutiveCalls {
        fn from(value: LaunchCall) -> Self {
            Self::Launch(value)
        }
    }
    impl ::core::convert::From<LiftCall> for makerexecutiveCalls {
        fn from(value: LiftCall) -> Self {
            Self::Lift(value)
        }
    }
    impl ::core::convert::From<LiveCall> for makerexecutiveCalls {
        fn from(value: LiveCall) -> Self {
            Self::Live(value)
        }
    }
    impl ::core::convert::From<LockCall> for makerexecutiveCalls {
        fn from(value: LockCall) -> Self {
            Self::Lock(value)
        }
    }
    impl ::core::convert::From<OwnerCall> for makerexecutiveCalls {
        fn from(value: OwnerCall) -> Self {
            Self::Owner(value)
        }
    }
    impl ::core::convert::From<SetAuthorityCall> for makerexecutiveCalls {
        fn from(value: SetAuthorityCall) -> Self {
            Self::SetAuthority(value)
        }
    }
    impl ::core::convert::From<SetOwnerCall> for makerexecutiveCalls {
        fn from(value: SetOwnerCall) -> Self {
            Self::SetOwner(value)
        }
    }
    impl ::core::convert::From<SetPublicCapabilityCall> for makerexecutiveCalls {
        fn from(value: SetPublicCapabilityCall) -> Self {
            Self::SetPublicCapability(value)
        }
    }
    impl ::core::convert::From<SetRoleCapabilityCall> for makerexecutiveCalls {
        fn from(value: SetRoleCapabilityCall) -> Self {
            Self::SetRoleCapability(value)
        }
    }
    impl ::core::convert::From<SetRootUserCall> for makerexecutiveCalls {
        fn from(value: SetRootUserCall) -> Self {
            Self::SetRootUser(value)
        }
    }
    impl ::core::convert::From<SetUserRoleCall> for makerexecutiveCalls {
        fn from(value: SetUserRoleCall) -> Self {
            Self::SetUserRole(value)
        }
    }
    impl ::core::convert::From<SlatesCall> for makerexecutiveCalls {
        fn from(value: SlatesCall) -> Self {
            Self::Slates(value)
        }
    }
    impl ::core::convert::From<VoteCall> for makerexecutiveCalls {
        fn from(value: VoteCall) -> Self {
            Self::Vote(value)
        }
    }
    impl ::core::convert::From<VoteWithYaysCall> for makerexecutiveCalls {
        fn from(value: VoteWithYaysCall) -> Self {
            Self::VoteWithYays(value)
        }
    }
    impl ::core::convert::From<VotesCall> for makerexecutiveCalls {
        fn from(value: VotesCall) -> Self {
            Self::Votes(value)
        }
    }
    ///Container type for all return fields from the `GOV` function with signature `GOV()` and selector `0x180cb47f`
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
    pub struct GovReturn(pub ::ethers::core::types::Address);
    ///Container type for all return fields from the `IOU` function with signature `IOU()` and selector `0x046c472f`
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
    pub struct IouReturn(pub ::ethers::core::types::Address);
    ///Container type for all return fields from the `MAX_YAYS` function with signature `MAX_YAYS()` and selector `0x362344b8`
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
    pub struct MaxYaysReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `approvals` function with signature `approvals(address)` and selector `0x5d0341ba`
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
    pub struct ApprovalsReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `authority` function with signature `authority()` and selector `0xbf7e214f`
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
    pub struct AuthorityReturn(pub ::ethers::core::types::Address);
    ///Container type for all return fields from the `canCall` function with signature `canCall(address,address,bytes4)` and selector `0xb7009613`
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
    pub struct CanCallReturn(pub bool);
    ///Container type for all return fields from the `deposits` function with signature `deposits(address)` and selector `0xfc7e286d`
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
    pub struct DepositsReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `etch` function with signature `etch(address[])` and selector `0x5123e1fa`
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
    pub struct EtchReturn {
        pub slate: [u8; 32],
    }
    ///Container type for all return fields from the `getCapabilityRoles` function with signature `getCapabilityRoles(address,bytes4)` and selector `0x27538e90`
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
    pub struct GetCapabilityRolesReturn(pub [u8; 32]);
    ///Container type for all return fields from the `getUserRoles` function with signature `getUserRoles(address)` and selector `0x06a36aee`
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
    pub struct GetUserRolesReturn(pub [u8; 32]);
    ///Container type for all return fields from the `hasUserRole` function with signature `hasUserRole(address,uint8)` and selector `0xa078f737`
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
    pub struct HasUserRoleReturn(pub bool);
    ///Container type for all return fields from the `hat` function with signature `hat()` and selector `0xfe95a5ce`
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
    pub struct HatReturn(pub ::ethers::core::types::Address);
    ///Container type for all return fields from the `isCapabilityPublic` function with signature `isCapabilityPublic(address,bytes4)` and selector `0x2f47571f`
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
    pub struct IsCapabilityPublicReturn(pub bool);
    ///Container type for all return fields from the `isUserRoot` function with signature `isUserRoot(address)` and selector `0xfbf80773`
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
    pub struct IsUserRootReturn(pub bool);
    ///Container type for all return fields from the `last` function with signature `last(address)` and selector `0x9a816f7d`
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
    pub struct LastReturn(pub ::ethers::core::types::U256);
    ///Container type for all return fields from the `live` function with signature `live()` and selector `0x957aa58c`
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
    pub struct LiveReturn(pub bool);
    ///Container type for all return fields from the `owner` function with signature `owner()` and selector `0x8da5cb5b`
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
    pub struct OwnerReturn(pub ::ethers::core::types::Address);
    ///Container type for all return fields from the `slates` function with signature `slates(bytes32,uint256)` and selector `0xc2ffc7bb`
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
    pub struct SlatesReturn(pub ::ethers::core::types::Address);
    ///Container type for all return fields from the `vote` function with signature `vote(address[])` and selector `0xed081329`
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
    pub struct VoteWithYaysReturn(pub [u8; 32]);
    ///Container type for all return fields from the `votes` function with signature `votes(address)` and selector `0xd8bff5a5`
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
    pub struct VotesReturn(pub [u8; 32]);
}
