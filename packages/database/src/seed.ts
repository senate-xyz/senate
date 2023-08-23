/* eslint-disable @typescript-eslint/no-unused-vars */
import cuid from "cuid";
import { db, dao, daohandler, user, subscription, voter } from "./index";

const seedData = async () => {
  console.log("Inserting daos");

  const aave_id = cuid();

  await db.insert(dao).ignore().values({
    id: aave_id,
    name: "Aave",
    picture: "/assets/Project_Icons/aave",
    quorumwarningemailsupport: true,
    backgroundcolor: "#a5a9c6",
  });

  await db
    .insert(daohandler)
    .ignore()
    .ignore()
    .values([
      {
        id: cuid(),
        daoid: aave_id,
        type: "AAVE_CHAIN",
        decoder: {
          address: "0xEC568fffba86c094cf06b22134B23074DFE2252c",
          proposalUrl: "https://app.aave.com/governance/proposal/?proposalId=",
          governancePortal: "https://app.aave.com/governance",
        },
      },
      {
        id: cuid(),
        daoid: aave_id,
        type: "SNAPSHOT",
        decoder: {
          space: "aave.eth",
          governancePortal: "https://snapshot.org/#/aave.eth",
        },
      },
    ]);

  const maker_id = cuid();
  await db.insert(dao).ignore().values({
    id: maker_id,
    name: "MakerDAO",
    picture: "/assets/Project_Icons/makerdao",
    quorumwarningemailsupport: false,
    backgroundcolor: "#68baaa",
  });

  await db
    .insert(daohandler)
    .ignore()
    .ignore()
    .values([
      {
        id: cuid(),
        daoid: maker_id,
        type: "MAKER_EXECUTIVE",
        decoder: {
          address: "0x0a3f6849f78076aefaDf113F5BED87720274dDC0",
          proposalUrl: "https://vote.makerdao.com/executive/",
          governancePortal: "https://vote.makerdao.com/executive",
        },
      },
      {
        id: cuid(),
        daoid: maker_id,
        type: "MAKER_POLL",
        decoder: {
          address_create: "0xf9be8f0945acddeedaa64dfca5fe9629d0cf8e5d",
          address_vote: "0xD3A9FE267852281a1e6307a1C37CDfD76d39b133",
          proposalUrl: "https://vote.makerdao.com/polling/",
          governancePortal: "https://vote.makerdao.com/polling",
        },
      },
      {
        id: cuid(),
        daoid: maker_id,
        type: "MAKER_POLL_ARBITRUM",
        decoder: {
          address_vote: "0x4f4e551b4920a5417F8d4e7f8f099660dAdadcEC",
          governancePortal: "https://vote.makerdao.com/polling",
        },
      },
    ]);

  const balancer_id = cuid();
  await db.insert(dao).ignore().values({
    id: balancer_id,
    name: "Balancer",
    picture: "/assets/Project_Icons/balancer",
    quorumwarningemailsupport: false,
    backgroundcolor: "#747474",
  });
  await db
    .insert(daohandler)
    .ignore()
    .values([
      {
        id: cuid(),
        daoid: balancer_id,
        type: "SNAPSHOT",
        decoder: {
          space: "balancer.eth",
          governancePortal: "https://snapshot.org/#/balancer.eth",
        },
      },
    ]);

  const optimism_id = cuid();
  await db.insert(dao).ignore().values({
    id: optimism_id,
    name: "Optimism",
    picture: "/assets/Project_Icons/optimism",
    quorumwarningemailsupport: false,
    backgroundcolor: "#ff444b",
  });
  await db
    .insert(daohandler)
    .ignore()
    .values([
      {
        id: cuid(),
        daoid: optimism_id,
        type: "SNAPSHOT",
        decoder: {
          space: "opcollective.eth",
          governancePortal: "https://snapshot.org/#/opcollective.eth",
        },
      },
      {
        id: cuid(),
        daoid: optimism_id,
        type: "OPTIMISM_CHAIN",
        decoder: {
          address: "0xcDF27F107725988f2261Ce2256bDfCdE8B382B10",
          proposalUrl: "https://vote.optimism.io/proposals/",
          governancePortal: "https://vote.optimism.io/proposals",
        },
      },
    ]);

  const element_id = cuid();
  await db.insert(dao).ignore().values({
    id: element_id,
    name: "Element",
    picture: "/assets/Project_Icons/element-dao",
    quorumwarningemailsupport: false,
    backgroundcolor: "#6f7d83",
  });
  await db
    .insert(daohandler)
    .ignore()
    .values([
      {
        id: cuid(),
        daoid: element_id,
        type: "SNAPSHOT",
        decoder: {
          space: "elfi.eth",
          governancePortal: "https://snapshot.org/#/elfi.eth",
        },
      },
    ]);

  const oneinch_id = cuid();
  await db.insert(dao).ignore().values({
    id: oneinch_id,
    name: "1inch",
    picture: "/assets/Project_Icons/1inch",
    quorumwarningemailsupport: false,
    backgroundcolor: "#646573",
  });
  await db
    .insert(daohandler)
    .ignore()
    .values([
      {
        id: cuid(),
        daoid: oneinch_id,
        type: "SNAPSHOT",
        decoder: {
          space: "1inch.eth",
          governancePortal: "https://snapshot.org/#/1inch.eth",
        },
      },
    ]);

  const hopprotocol_id = cuid();
  await db.insert(dao).ignore().values({
    id: hopprotocol_id,
    name: "Hop Protocol",
    picture: "/assets/Project_Icons/hop-protocol",
    quorumwarningemailsupport: false,
    backgroundcolor: "#d27ecc",
  });
  await db
    .insert(daohandler)
    .ignore()
    .values([
      {
        id: cuid(),
        daoid: hopprotocol_id,
        type: "SNAPSHOT",
        decoder: {
          space: "hop.eth",
          governancePortal: "https://snapshot.org/#/hop.eth",
        },
      },
      {
        id: cuid(),
        daoid: hopprotocol_id,
        type: "HOP_CHAIN",
        decoder: {
          address: "0xed8Bdb5895B8B7f9Fdb3C087628FD8410E853D48",
          proposalUrl: "https://www.tally.xyz/gov/hop/proposal/",
          governancePortal: "https://www.tally.xyz/gov/hop",
        },
      },
    ]);

  const safe_id = cuid();
  await db.insert(dao).ignore().values({
    id: safe_id,
    name: "SafeDAO",
    picture: "/assets/Project_Icons/safedao",
    quorumwarningemailsupport: false,
    backgroundcolor: "#737375",
  });
  await db
    .insert(daohandler)
    .ignore()
    .values([
      {
        id: cuid(),
        daoid: safe_id,
        type: "SNAPSHOT",
        decoder: {
          space: "safe.eth",
          governancePortal: "https://snapshot.org/#/safe.eth",
        },
      },
    ]);

  const compound_id = cuid();
  await db.insert(dao).ignore().values({
    id: compound_id,
    name: "Compound",
    picture: "/assets/Project_Icons/compound",
    quorumwarningemailsupport: false,
    backgroundcolor: "#00573e",
  });
  await db
    .insert(daohandler)
    .ignore()
    .values([
      {
        id: cuid(),
        daoid: compound_id,
        type: "SNAPSHOT",
        decoder: {
          space: "comp-vote.eth",
          governancePortal: "https://snapshot.org/#/comp-vote.eth",
        },
      },
      {
        id: cuid(),
        daoid: compound_id,
        type: "COMPOUND_CHAIN",
        decoder: {
          address: "0xc0Da02939E1441F497fd74F78cE7Decb17B66529",
          proxyAddress: "0xeF3B6E9e13706A8F01fe98fdCf66335dc5CfdEED",
          proposalUrl: "https://compound.finance/governance/proposals/",
          governancePortal: "https://compound.finance/governance",
        },
      },
    ]);

  const synthetix_id = cuid();
  await db.insert(dao).ignore().values({
    id: synthetix_id,
    name: "Synthetix",
    picture: "/assets/Project_Icons/synthetix",
    quorumwarningemailsupport: false,
    backgroundcolor: "#0d506b",
  });
  await db
    .insert(daohandler)
    .ignore()
    .values([
      {
        id: cuid(),
        daoid: synthetix_id,
        type: "SNAPSHOT",
        decoder: {
          space: "snxgov.eth",
          governancePortal: "https://snapshot.org/#/snxgov.eth",
        },
      },
    ]);

  const dydx_id = cuid();
  await db.insert(dao).ignore().values({
    id: dydx_id,
    name: "dYdX",
    picture: "/assets/Project_Icons/dYdX",
    quorumwarningemailsupport: false,
    backgroundcolor: "#51515a",
  });
  await db
    .insert(daohandler)
    .ignore()
    .values([
      {
        id: cuid(),
        daoid: dydx_id,
        type: "SNAPSHOT",
        decoder: {
          space: "dydxgov.eth",
          governancePortal: "https://snapshot.org/#/dydxgov.eth",
        },
      },
      {
        id: cuid(),
        daoid: dydx_id,
        type: "DYDX_CHAIN",
        decoder: {
          address: "0x7E9B1672616FF6D6629Ef2879419aaE79A9018D2",
          proposalUrl: "https://dydx.community/dashboard/proposal/",
          governancePortal: "https://dydx.community/dashboard",
        },
      },
    ]);

  const uniswap_id = cuid();
  await db.insert(dao).ignore().values({
    id: uniswap_id,
    name: "Uniswap",
    picture: "/assets/Project_Icons/uniswap",
    quorumwarningemailsupport: true,
    backgroundcolor: "#ffd5f5",
  });
  await db
    .insert(daohandler)
    .ignore()
    .values([
      {
        id: cuid(),
        daoid: uniswap_id,
        type: "SNAPSHOT",
        decoder: {
          space: "uniswap",
          governancePortal: "https://snapshot.org/#/uniswap",
        },
      },
      {
        id: cuid(),
        daoid: uniswap_id,
        type: "UNISWAP_CHAIN",
        decoder: {
          address: "0x408ED6354d4973f66138C91495F2f2FCbd8724C3",
          proxyAddress: "0x53a328f4086d7c0f1fa19e594c9b842125263026",
          proposalUrl: "https://app.uniswap.org/#/vote/2/",
          governancePortal: "https://app.uniswap.org/#/vote",
        },
      },
    ]);

  const ens_id = cuid();
  await db.insert(dao).ignore().values({
    id: ens_id,
    name: "ENS",
    picture: "/assets/Project_Icons/ens",
    quorumwarningemailsupport: false,
    backgroundcolor: "#6daef6",
  });
  await db
    .insert(daohandler)
    .ignore()
    .values([
      {
        id: cuid(),
        daoid: ens_id,
        type: "SNAPSHOT",
        decoder: {
          space: "ens.eth",
          governancePortal: "https://snapshot.org/#/ens.eth",
        },
      },
      {
        id: cuid(),
        daoid: ens_id,
        type: "ENS_CHAIN",
        decoder: {
          address: "0x323A76393544d5ecca80cd6ef2A560C6a395b7E3",
          proposalUrl: "https://www.tally.xyz/gov/ens/proposal/",
          governancePortal: "https://www.tally.xyz/gov/ens",
        },
      },
    ]);

  const fwb_id = cuid();
  await db.insert(dao).ignore().values({
    id: fwb_id,
    name: "FWB",
    picture: "/assets/Project_Icons/friends-with-benefits",
    quorumwarningemailsupport: false,
    backgroundcolor: "#5a5a5a",
  });
  await db
    .insert(daohandler)
    .ignore()
    .values([
      {
        id: cuid(),
        daoid: fwb_id,
        type: "SNAPSHOT",
        decoder: {
          space: "friendswithbenefits.eth",
          governancePortal: "https://snapshot.org/#/friendswithbenefits.eth",
        },
      },
    ]);

  const gnosis_id = cuid();
  await db.insert(dao).ignore().values({
    id: gnosis_id,
    name: "GnosisDAO",
    picture: "/assets/Project_Icons/gnosis",
    quorumwarningemailsupport: false,
    backgroundcolor: "#7b837f",
  });
  await db
    .insert(daohandler)
    .ignore()
    .values([
      {
        id: cuid(),
        daoid: gnosis_id,
        type: "SNAPSHOT",
        decoder: {
          space: "gnosis.eth",
          governancePortal: "https://snapshot.org/#/gnosis.eth",
        },
      },
    ]);

  const index_coop_id = cuid();
  await db.insert(dao).ignore().values({
    id: index_coop_id,
    name: "Index Coop",
    picture: "/assets/Project_Icons/index-coop",
    quorumwarningemailsupport: false,
    backgroundcolor: "#797979",
  });
  await db
    .insert(daohandler)
    .ignore()
    .values([
      {
        id: cuid(),
        daoid: index_coop_id,
        type: "SNAPSHOT",
        decoder: {
          space: "index-coop.eth",
          governancePortal: "https://snapshot.org/#/index-coop.eth",
        },
      },
    ]);

  const paladin_id = cuid();
  await db.insert(dao).ignore().values({
    id: paladin_id,
    name: "Paladin",
    picture: "/assets/Project_Icons/paladin",
    quorumwarningemailsupport: false,
    backgroundcolor: "#86411c",
  });
  await db
    .insert(daohandler)
    .ignore()
    .values([
      {
        id: cuid(),
        daoid: paladin_id,
        type: "SNAPSHOT",
        decoder: {
          space: "palvote.eth",
          governancePortal: "https://snapshot.org/#/palvote.eth",
        },
      },
    ]);

  const sushi_id = cuid();
  await db.insert(dao).ignore().values({
    id: sushi_id,
    name: "Sushi",
    picture: "/assets/Project_Icons/sushiswap",
    quorumwarningemailsupport: false,
    backgroundcolor: "#7e6c7c",
  });
  await db
    .insert(daohandler)
    .ignore()
    .values([
      {
        id: cuid(),
        daoid: sushi_id,
        type: "SNAPSHOT",
        decoder: {
          space: "sushigov.eth",
          governancePortal: "https://snapshot.org/#/sushigov.eth",
        },
      },
    ]);

  const instadapp_id = cuid();
  await db.insert(dao).ignore().values({
    id: instadapp_id,
    name: "Instadapp",
    picture: "/assets/Project_Icons/instadapp",
    quorumwarningemailsupport: false,
    backgroundcolor: "#8fa6ff",
  });
  await db
    .insert(daohandler)
    .ignore()
    .values([
      {
        id: cuid(),
        daoid: instadapp_id,
        type: "SNAPSHOT",
        decoder: {
          space: "instadapp-gov.eth",
          governancePortal: "https://snapshot.org/#/instadapp-gov.eth",
        },
      },
    ]);

  const gitcoin_id = cuid();
  await db.insert(dao).ignore().values({
    id: gitcoin_id,
    name: "Gitcoin",
    picture: "/assets/Project_Icons/gitcoin",
    quorumwarningemailsupport: false,
    backgroundcolor: "#05d4a2",
  });
  await db
    .insert(daohandler)
    .ignore()
    .values([
      {
        id: cuid(),
        daoid: gitcoin_id,
        type: "SNAPSHOT",
        decoder: {
          space: "gitcoindao.eth",
          governancePortal: "https://snapshot.org/#/gitcoindao.eth",
        },
      },
      {
        id: cuid(),
        daoid: gitcoin_id,
        type: "GITCOIN_CHAIN",
        decoder: {
          address: "0xDbD27635A534A3d3169Ef0498beB56Fb9c937489",
          proposalUrl: "https://www.tally.xyz/gov/gitcoin/proposal/",
          governancePortal: "https://www.tally.xyz/gov/gitcoin",
        },
      },
    ]);

  const gearbox_id = cuid();
  await db.insert(dao).ignore().values({
    id: gearbox_id,
    name: "Gearbox",
    picture: "/assets/Project_Icons/gearbox",
    quorumwarningemailsupport: false,
    backgroundcolor: "#735462",
  });
  await db
    .insert(daohandler)
    .ignore()
    .values([
      {
        id: cuid(),
        daoid: gearbox_id,
        type: "SNAPSHOT",
        decoder: {
          space: "gearbox.eth",
          governancePortal: "https://snapshot.org/#/gearbox.eth",
        },
      },
    ]);

  const euler_id = cuid();
  await db.insert(dao).ignore().values({
    id: euler_id,
    name: "Euler",
    picture: "/assets/Project_Icons/euler",
    quorumwarningemailsupport: false,
    backgroundcolor: "#4d4641",
  });
  await db
    .insert(daohandler)
    .ignore()
    .values([
      {
        id: cuid(),
        daoid: euler_id,
        type: "SNAPSHOT",
        decoder: {
          space: "eulerdao.eth",
          governancePortal: "https://snapshot.org/#/eulerdao.eth",
        },
      },
    ]);

  const aura_finance_id = cuid();
  await db.insert(dao).ignore().values({
    id: aura_finance_id,
    name: "Aura Finance",
    picture: "/assets/Project_Icons/aura-finance",
    quorumwarningemailsupport: false,
    backgroundcolor: "#9166ef",
  });
  await db
    .insert(daohandler)
    .ignore()
    .values([
      {
        id: cuid(),
        daoid: aura_finance_id,
        type: "SNAPSHOT",
        decoder: {
          space: "aurafinance.eth",
          governancePortal: "https://snapshot.org/#/aurafinance.eth",
        },
      },
    ]);

  const developerdao_id = cuid();
  await db.insert(dao).ignore().values({
    id: developerdao_id,
    name: "Developer DAO",
    picture: "/assets/Project_Icons/developerdao",
    quorumwarningemailsupport: false,
    backgroundcolor: "#484848",
  });
  await db
    .insert(daohandler)
    .ignore()
    .values([
      {
        id: cuid(),
        daoid: developerdao_id,
        type: "SNAPSHOT",
        decoder: {
          space: "devdao.eth",
          governancePortal: "https://snapshot.org/#/devdao.eth",
        },
      },
    ]);

  const apwine_id = cuid();
  await db.insert(dao).ignore().values({
    id: apwine_id,
    name: "APWine",
    picture: "/assets/Project_Icons/APWine",
    quorumwarningemailsupport: false,
    backgroundcolor: "#d5d9fa",
  });
  await db
    .insert(daohandler)
    .ignore()
    .values([
      {
        id: cuid(),
        daoid: apwine_id,
        type: "SNAPSHOT",
        decoder: {
          space: "apwine.eth",
          governancePortal: "https://snapshot.org/#/apwine.eth",
        },
      },
    ]);

  const morpho_id = cuid();
  await db.insert(dao).ignore().values({
    id: morpho_id,
    name: "Morpho",
    picture: "/assets/Project_Icons/morpho",
    quorumwarningemailsupport: false,
    backgroundcolor: "#546275",
  });
  await db
    .insert(daohandler)
    .ignore()
    .values([
      {
        id: cuid(),
        daoid: morpho_id,
        type: "SNAPSHOT",
        decoder: {
          space: "morpho.eth",
          governancePortal: "https://snapshot.org/#/morpho.eth",
        },
      },
    ]);

  const lido_id = cuid();
  await db.insert(dao).ignore().values({
    id: lido_id,
    name: "Lido DAO",
    picture: "/assets/Project_Icons/lido",
    quorumwarningemailsupport: false,
    backgroundcolor: "#f8afa3",
  });
  await db
    .insert(daohandler)
    .ignore()
    .values([
      {
        id: cuid(),
        daoid: lido_id,
        type: "SNAPSHOT",
        decoder: {
          space: "lido-snapshot.eth",
          governancePortal: "https://snapshot.org/#/lido-snapshot.eth",
        },
      },
    ]);

  const starknet_id = cuid();
  await db.insert(dao).ignore().values({
    id: starknet_id,
    name: "Starknet",
    picture: "/assets/Project_Icons/starknet",
    quorumwarningemailsupport: false,
    backgroundcolor: "#635672",
  });
  await db
    .insert(daohandler)
    .ignore()
    .values([
      {
        id: cuid(),
        daoid: starknet_id,
        type: "SNAPSHOT",
        decoder: {
          space: "starknet.eth",
          governancePortal: "https://snapshot.org/#/starknet.eth",
        },
      },
    ]);

  const arbitrum_id = cuid();
  await db.insert(dao).ignore().values({
    id: arbitrum_id,
    name: "Arbitrum DAO",
    picture: "/assets/Project_Icons/arbitrum",
    quorumwarningemailsupport: false,
    backgroundcolor: "#55677b",
  });
  await db
    .insert(daohandler)
    .ignore()
    .values([
      {
        id: cuid(),
        daoid: arbitrum_id,
        type: "SNAPSHOT",
        decoder: {
          space: "arbitrumfoundation.eth",
          governancePortal: "https://snapshot.org/#/arbitrumfoundation.eth",
        },
      },
      {
        id: cuid(),
        daoid: arbitrum_id,
        type: "ARBITRUM_CORE_CHAIN",
        decoder: {
          address: "0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9",
          proposalUrl: "https://www.tally.xyz/gov/arbitrum/proposal/",
          governancePortal: "https://www.tally.xyz/gov/arbitrum",
        },
      },
      {
        id: cuid(),
        daoid: arbitrum_id,
        type: "ARBITRUM_TREASURY_CHAIN",
        decoder: {
          address: "0x789fC99093B09aD01C34DC7251D0C89ce743e5a4",
          proposalUrl: "https://www.tally.xyz/gov/arbitrum/proposal/",
          governancePortal: "https://www.tally.xyz/gov/arbitrum",
        },
      },
    ]);

  const dorg_id = cuid();
  await db.insert(dao).ignore().values({
    id: dorg_id,
    name: "dOrg",
    picture: "/assets/Project_Icons/dOrg",
    quorumwarningemailsupport: false,
    backgroundcolor: "#382b22",
  });
  await db
    .insert(daohandler)
    .ignore()
    .values([
      {
        id: cuid(),
        daoid: dorg_id,
        type: "SNAPSHOT",
        decoder: {
          space: "dorg.eth",
          governancePortal: "https://snapshot.org/#/dorg.eth",
        },
      },
    ]);

  const solace_id = cuid();
  await db.insert(dao).ignore().values({
    id: solace_id,
    name: "Solace DAO",
    picture: "/assets/Project_Icons/solace-dao",
    quorumwarningemailsupport: false,
    backgroundcolor: "#3a3632",
  });
  await db
    .insert(daohandler)
    .ignore()
    .values([
      {
        id: cuid(),
        daoid: solace_id,
        type: "SNAPSHOT",
        decoder: {
          space: "solace-dao.eth",
          governancePortal: "https://snapshot.org/#/solace-dao.eth",
        },
      },
    ]);

  const interest_protocol_id = cuid();
  await db.insert(dao).ignore().values({
    id: interest_protocol_id,
    name: "Interest Protocol",
    picture: "/assets/Project_Icons/interest",
    quorumwarningemailsupport: false,
    backgroundcolor: "#c3d1bc",
  });
  await db
    .insert(daohandler)
    .ignore()
    .values([
      {
        id: cuid(),
        daoid: interest_protocol_id,
        type: "INTEREST_PROTOCOL_CHAIN",
        decoder: {
          address: "0x266d1020A84B9E8B0ed320831838152075F8C4cA",
          proxyAddress: "0x6b91A0Ba78Acc4a8C7919f96c181a895D5b31563",
          proposalUrl: "https://interestprotocol.io/#/proposal/",
          governancePortal: "https://interestprotocol.io/#/proposal",
        },
      },
    ]);

  const rocket_pool_id = cuid();
  await db.insert(dao).ignore().values({
    id: rocket_pool_id,
    name: "Rocket Pool",
    picture: "/assets/Project_Icons/rocket-pool",
    quorumwarningemailsupport: false,
    backgroundcolor: "#f79070",
  });
  await db
    .insert(daohandler)
    .ignore()
    .values([
      {
        id: cuid(),
        daoid: rocket_pool_id,
        type: "SNAPSHOT",
        decoder: {
          space: "rocketpool-dao.eth",
          governancePortal: "https://snapshot.org/#/rocketpool-dao.eth",
        },
      },
    ]);

  const zerox_protocol_id = cuid();
  await db.insert(dao).ignore().values({
    id: zerox_protocol_id,
    name: "0x Protocol",
    picture: "/assets/Project_Icons/0x-protocol",
    quorumwarningemailsupport: false,
    backgroundcolor: "#636364",
  });
  await db
    .insert(daohandler)
    .ignore()
    .values([
      {
        id: cuid(),
        daoid: zerox_protocol_id,
        type: "SNAPSHOT",
        decoder: {
          space: "0xgov.eth",
          governancePortal: "https://snapshot.org/#/0xgov.eth",
        },
      },
      {
        id: cuid(),
        daoid: zerox_protocol_id,
        type: "ZEROX_PROTOCOL_CHAIN",
        decoder: {
          address: "0x0bB1810061C2f5b2088054eE184E6C79e1591101",
          proposalUrl: "https://governance.0xprotocol.org/vote/proposal/",
          governancePortal: "https://governance.0xprotocol.org/vote",
        },
      },
    ]);

  console.log("Inserting seed user");

  const userid = cuid();
  await db.insert(user).ignore().values({
    id: userid,
    address: "0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF",
  });

  await db.insert(voter).ignore().values({
    id: cuid(),
    address: "0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF",
  });

  console.log("Inserting subscriptions");

  const alldaos = await db.select().from(dao);

  for (const dao of alldaos) {
    await db
      .insert(subscription)
      .ignore()
      .values({ id: cuid(), userid: userid, daoid: dao.id });
  }
  console.log("Done seeding data");
};

// async function maintenance() {
//   const usersToDelete = [""];

//   await prisma.user.deleteMany({ where: { email: { in: usersToDelete } }}).catch();
// }

async function main() {
  // await maintenance();
  await seedData();
  // await seedVoters();
  // await testUsers();
}

void main();
