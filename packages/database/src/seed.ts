/* eslint-disable @typescript-eslint/no-unused-vars */
import cuid from "cuid";
import { db, dao, daohandler, user, subscription } from "./index";

const seedData = async () => {
  console.log("Inserting daos");

  const aave_id = cuid();
  await db
    .insert(dao)
    .values({
      id: aave_id,
      name: "Aave",
      picture: "/assets/Project_Icons/aave",
      quorumwarningemailsupport: true,
    })
    .catch();
  await db
    .insert(daohandler)
    .values([
      {
        id: cuid(),
        daoid: aave_id,
        type: "AAVE_CHAIN",
        decoder: {
          address: "0xEC568fffba86c094cf06b22134B23074DFE2252c",
          proposalUrl: "https://app.aave.com/governance/proposal/?proposalId=",
        },
      },
      {
        id: cuid(),
        daoid: aave_id,
        type: "SNAPSHOT",
        decoder: {
          space: "aave.eth",
        },
      },
    ])
    .catch();

  const maker_id = cuid();
  await db
    .insert(dao)
    .values({
      id: maker_id,
      name: "MakerDAO",
      picture: "/assets/Project_Icons/makerdao",
      quorumwarningemailsupport: false,
    })
    .catch();
  await db
    .insert(daohandler)
    .values([
      {
        id: cuid(),
        daoid: maker_id,
        type: "MAKER_EXECUTIVE",
        decoder: {
          address: "0x0a3f6849f78076aefaDf113F5BED87720274dDC0",
          proposalUrl: "https://vote.makerdao.com/executive/",
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
        },
      },
      {
        id: cuid(),
        daoid: maker_id,
        type: "MAKER_POLL_ARBITRUM",
        decoder: {
          address_vote: "0x4f4e551b4920a5417F8d4e7f8f099660dAdadcEC",
        },
      },
    ])
    .catch();

  const balancer_id = cuid();
  await db
    .insert(dao)
    .values({
      id: balancer_id,
      name: "Balancer",
      picture: "/assets/Project_Icons/balancer",
      quorumwarningemailsupport: false,
    })
    .catch();
  await db
    .insert(daohandler)
    .values([
      {
        id: cuid(),
        daoid: balancer_id,
        type: "SNAPSHOT",
        decoder: {
          space: "balancer.eth",
        },
      },
    ])
    .catch();

  const optimism_id = cuid();
  await db
    .insert(dao)
    .values({
      id: optimism_id,
      name: "Optimism",
      picture: "/assets/Project_Icons/optimism",
      quorumwarningemailsupport: false,
    })
    .catch();
  await db
    .insert(daohandler)
    .values([
      {
        id: cuid(),
        daoid: optimism_id,
        type: "SNAPSHOT",
        decoder: {
          space: "opcollective.eth",
        },
      },
    ])
    .catch();

  const element_id = cuid();
  await db
    .insert(dao)
    .values({
      id: element_id,
      name: "Element",
      picture: "/assets/Project_Icons/element-dao",
      quorumwarningemailsupport: false,
    })
    .catch();
  await db
    .insert(daohandler)
    .values([
      {
        id: cuid(),
        daoid: element_id,
        type: "SNAPSHOT",
        decoder: {
          space: "elfi.eth",
        },
      },
    ])
    .catch();

  const oneinch_id = cuid();
  await db
    .insert(dao)
    .values({
      id: oneinch_id,
      name: "1inch",
      picture: "/assets/Project_Icons/1inch",
      quorumwarningemailsupport: false,
    })
    .catch();
  await db
    .insert(daohandler)
    .values([
      {
        id: cuid(),
        daoid: oneinch_id,
        type: "SNAPSHOT",
        decoder: {
          space: "1inch.eth",
        },
      },
    ])
    .catch();

  const hopprotocol_id = cuid();
  await db
    .insert(dao)
    .values({
      id: hopprotocol_id,
      name: "Hop Protocol",
      picture: "/assets/Project_Icons/hop-protocol",
      quorumwarningemailsupport: false,
    })
    .catch();
  await db
    .insert(daohandler)
    .values([
      {
        id: cuid(),
        daoid: hopprotocol_id,
        type: "SNAPSHOT",
        decoder: {
          space: "hop.eth",
        },
      },
      {
        id: cuid(),
        daoid: hopprotocol_id,
        type: "HOP_CHAIN",
        decoder: {
          address: "0xed8Bdb5895B8B7f9Fdb3C087628FD8410E853D48",
          proposalUrl: "https://www.tally.xyz/gov/hop/proposal/",
        },
      },
    ])
    .catch();

  const safe_id = cuid();
  await db
    .insert(dao)
    .values({
      id: safe_id,
      name: "SafeDAO",
      picture: "/assets/Project_Icons/safedao",
      quorumwarningemailsupport: false,
    })
    .catch();
  await db
    .insert(daohandler)
    .values([
      {
        id: cuid(),
        daoid: safe_id,
        type: "SNAPSHOT",
        decoder: {
          space: "safe.eth",
        },
      },
    ])
    .catch();

  const compound_id = cuid();
  await db
    .insert(dao)
    .values({
      id: compound_id,
      name: "Compound",
      picture: "/assets/Project_Icons/compound",
      quorumwarningemailsupport: false,
    })
    .catch();
  await db
    .insert(daohandler)
    .values([
      {
        id: cuid(),
        daoid: compound_id,
        type: "SNAPSHOT",
        decoder: {
          space: "comp-vote.eth",
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
        },
      },
    ])
    .catch();

  const synthetix_id = cuid();
  await db
    .insert(dao)
    .values({
      id: synthetix_id,
      name: "Synthetix",
      picture: "/assets/Project_Icons/synthetix",
      quorumwarningemailsupport: false,
    })
    .catch();
  await db
    .insert(daohandler)
    .values([
      {
        id: cuid(),
        daoid: synthetix_id,
        type: "SNAPSHOT",
        decoder: {
          space: "snxgov.eth",
        },
      },
    ])
    .catch();

  const dydx_id = cuid();
  await db
    .insert(dao)
    .values({
      id: dydx_id,
      name: "dYdX",
      picture: "/assets/Project_Icons/dYdX",
      quorumwarningemailsupport: false,
    })
    .catch();
  await db
    .insert(daohandler)
    .values([
      {
        id: cuid(),
        daoid: dydx_id,
        type: "SNAPSHOT",
        decoder: {
          space: "dydxgov.eth",
        },
      },
      {
        id: cuid(),
        daoid: dydx_id,
        type: "DYDX_CHAIN",
        decoder: {
          address: "0x7E9B1672616FF6D6629Ef2879419aaE79A9018D2",
          proposalUrl: "https://dydx.community/dashboard/proposal/",
        },
      },
    ])
    .catch();

  const uniswap_id = cuid();
  await db
    .insert(dao)
    .values({
      id: uniswap_id,
      name: "Uniswap",
      picture: "/assets/Project_Icons/uniswap",
      quorumwarningemailsupport: true,
    })
    .catch();
  await db
    .insert(daohandler)
    .values([
      {
        id: cuid(),
        daoid: uniswap_id,
        type: "SNAPSHOT",
        decoder: {
          space: "uniswap",
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
        },
      },
    ])
    .catch();

  const ens_id = cuid();
  await db
    .insert(dao)
    .values({
      id: ens_id,
      name: "ENS",
      picture: "/assets/Project_Icons/ens",
      quorumwarningemailsupport: false,
    })
    .catch();
  await db
    .insert(daohandler)
    .values([
      {
        id: cuid(),
        daoid: ens_id,
        type: "SNAPSHOT",
        decoder: {
          space: "ens.eth",
        },
      },
      {
        id: cuid(),
        daoid: ens_id,
        type: "ENS_CHAIN",
        decoder: {
          address: "0x323A76393544d5ecca80cd6ef2A560C6a395b7E3",
          proposalUrl: "https://www.tally.xyz/gov/ens/proposal/",
        },
      },
    ])
    .catch();

  const fwb_id = cuid();
  await db
    .insert(dao)
    .values({
      id: fwb_id,
      name: "FWB",
      picture: "/assets/Project_Icons/friends-with-benefits",
      quorumwarningemailsupport: false,
    })
    .catch();
  await db
    .insert(daohandler)
    .values([
      {
        id: cuid(),
        daoid: fwb_id,
        type: "SNAPSHOT",
        decoder: {
          space: "friendswithbenefits.eth",
        },
      },
    ])
    .catch();

  const gnosis_id = cuid();
  await db
    .insert(dao)
    .values({
      id: gnosis_id,
      name: "GnosisDAO",
      picture: "/assets/Project_Icons/gnosis",
      quorumwarningemailsupport: false,
    })
    .catch();
  await db
    .insert(daohandler)
    .values([
      {
        id: cuid(),
        daoid: gnosis_id,
        type: "SNAPSHOT",
        decoder: {
          space: "gnosis.eth",
        },
      },
    ])
    .catch();

  const index_coop_id = cuid();
  await db
    .insert(dao)
    .values({
      id: index_coop_id,
      name: "Index Coop",
      picture: "/assets/Project_Icons/index-coop",
      quorumwarningemailsupport: false,
    })
    .catch();
  await db
    .insert(daohandler)
    .values([
      {
        id: cuid(),
        daoid: index_coop_id,
        type: "SNAPSHOT",
        decoder: {
          space: "index-coop.eth",
        },
      },
    ])
    .catch();

  const paladin_id = cuid();
  await db
    .insert(dao)
    .values({
      id: paladin_id,
      name: "Paladin",
      picture: "/assets/Project_Icons/paladin",
      quorumwarningemailsupport: false,
    })
    .catch();
  await db
    .insert(daohandler)
    .values([
      {
        id: cuid(),
        daoid: paladin_id,
        type: "SNAPSHOT",
        decoder: {
          space: "palvote.eth",
        },
      },
    ])
    .catch();

  const sushi_id = cuid();
  await db
    .insert(dao)
    .values({
      id: sushi_id,
      name: "Sushi",
      picture: "/assets/Project_Icons/sushiswap",
      quorumwarningemailsupport: false,
    })
    .catch();
  await db
    .insert(daohandler)
    .values([
      {
        id: cuid(),
        daoid: sushi_id,
        type: "SNAPSHOT",
        decoder: {
          space: "sushigov.eth",
        },
      },
    ])
    .catch();

  const instadapp_id = cuid();
  await db
    .insert(dao)
    .values({
      id: instadapp_id,
      name: "Instadapp",
      picture: "/assets/Project_Icons/instadapp",
      quorumwarningemailsupport: false,
    })
    .catch();
  await db
    .insert(daohandler)
    .values([
      {
        id: cuid(),
        daoid: instadapp_id,
        type: "SNAPSHOT",
        decoder: {
          space: "instadapp-gov.eth",
        },
      },
    ])
    .catch();

  const gitcoin_id = cuid();
  await db
    .insert(dao)
    .values({
      id: gitcoin_id,
      name: "Gitcoin",
      picture: "/assets/Project_Icons/gitcoin",
      quorumwarningemailsupport: false,
    })
    .catch();
  await db
    .insert(daohandler)
    .values([
      {
        id: cuid(),
        daoid: gitcoin_id,
        type: "SNAPSHOT",
        decoder: {
          space: "gitcoindao.eth",
        },
      },
      {
        id: cuid(),
        daoid: gitcoin_id,
        type: "GITCOIN_CHAIN",

        decoder: {
          address: "0xDbD27635A534A3d3169Ef0498beB56Fb9c937489",
          proposalUrl: "https://www.tally.xyz/gov/gitcoin/proposal/",
        },
      },
    ])
    .catch();

  const gearbox_id = cuid();
  await db
    .insert(dao)
    .values({
      id: gearbox_id,
      name: "Gearbox",
      picture: "/assets/Project_Icons/gearbox",
      quorumwarningemailsupport: false,
    })
    .catch();
  await db
    .insert(daohandler)
    .values([
      {
        id: cuid(),
        daoid: gearbox_id,
        type: "SNAPSHOT",
        decoder: {
          space: "gearbox.eth",
        },
      },
    ])
    .catch();

  const euler_id = cuid();
  await db
    .insert(dao)
    .values({
      id: euler_id,
      name: "Euler",
      picture: "/assets/Project_Icons/euler",
      quorumwarningemailsupport: false,
    })
    .catch();
  await db
    .insert(daohandler)
    .values([
      {
        id: cuid(),
        daoid: euler_id,
        type: "SNAPSHOT",
        decoder: {
          space: "eulerdao.eth",
        },
      },
    ])
    .catch();

  const aura_finance_id = cuid();
  await db
    .insert(dao)
    .values({
      id: aura_finance_id,
      name: "Aura Finance",
      picture: "/assets/Project_Icons/aura-finance",
      quorumwarningemailsupport: false,
    })
    .catch();
  await db
    .insert(daohandler)
    .values([
      {
        id: cuid(),
        daoid: aura_finance_id,
        type: "SNAPSHOT",
        decoder: {
          space: "aurafinance.eth",
        },
      },
    ])
    .catch();

  const developerdao_id = cuid();
  await db
    .insert(dao)
    .values({
      id: developerdao_id,
      name: "Developer DAO",
      picture: "/assets/Project_Icons/developerdao",
      quorumwarningemailsupport: false,
    })
    .catch();
  await db
    .insert(daohandler)
    .values([
      {
        id: cuid(),
        daoid: developerdao_id,
        type: "SNAPSHOT",
        decoder: {
          space: "devdao.eth",
        },
      },
    ])
    .catch();

  const apwine_id = cuid();
  await db
    .insert(dao)
    .values({
      id: apwine_id,
      name: "APWine",
      picture: "/assets/Project_Icons/APWine",
      quorumwarningemailsupport: false,
    })
    .catch();
  await db
    .insert(daohandler)
    .values([
      {
        id: cuid(),
        daoid: apwine_id,
        type: "SNAPSHOT",
        decoder: {
          space: "apwine.eth",
        },
      },
    ])
    .catch();

  const morpho_id = cuid();
  await db
    .insert(dao)
    .values({
      id: morpho_id,
      name: "Morpho",
      picture: "/assets/Project_Icons/morpho",
      quorumwarningemailsupport: false,
    })
    .catch();
  await db
    .insert(daohandler)
    .values([
      {
        id: cuid(),
        daoid: morpho_id,
        type: "SNAPSHOT",
        decoder: {
          space: "morpho.eth",
        },
      },
    ])
    .catch();

  const lido_id = cuid();
  await db
    .insert(dao)
    .values({
      id: lido_id,
      name: "Lido DAO",
      picture: "/assets/Project_Icons/lido",
      quorumwarningemailsupport: false,
    })
    .catch();
  await db
    .insert(daohandler)
    .values([
      {
        id: cuid(),
        daoid: lido_id,
        type: "SNAPSHOT",
        decoder: {
          space: "lido-snapshot.eth",
        },
      },
    ])
    .catch();

  const starknet_id = cuid();
  await db
    .insert(dao)
    .values({
      id: starknet_id,
      name: "Starknet",
      picture: "/assets/Project_Icons/starknet",
      quorumwarningemailsupport: false,
    })
    .catch();
  await db
    .insert(daohandler)
    .values([
      {
        id: cuid(),
        daoid: starknet_id,
        type: "SNAPSHOT",
        decoder: {
          space: "starknet.eth",
        },
      },
    ])
    .catch();

  const arbitrum_id = cuid();
  await db
    .insert(dao)
    .values({
      id: arbitrum_id,
      name: "Arbitrum DAO",
      picture: "/assets/Project_Icons/arbitrum",
      quorumwarningemailsupport: false,
    })
    .catch();
  await db
    .insert(daohandler)
    .values([
      {
        id: cuid(),
        daoid: arbitrum_id,
        type: "SNAPSHOT",
        decoder: {
          space: "arbitrumfoundation.eth",
        },
      },
    ])
    .catch();

  const dorg_id = cuid();
  await db
    .insert(dao)
    .values({
      id: dorg_id,
      name: "dOrg",
      picture: "/assets/Project_Icons/dOrg",
      quorumwarningemailsupport: false,
    })
    .catch();
  await db
    .insert(daohandler)
    .values([
      {
        id: cuid(),
        daoid: dorg_id,
        type: "SNAPSHOT",
        decoder: {
          space: "dorg.eth",
        },
      },
    ])
    .catch();

  const solace_id = cuid();
  await db
    .insert(dao)
    .values({
      id: solace_id,
      name: "Solace DAO",
      picture: "/assets/Project_Icons/solace-dao",
      quorumwarningemailsupport: false,
    })
    .catch();
  await db
    .insert(daohandler)
    .values([
      {
        id: cuid(),
        daoid: solace_id,
        type: "SNAPSHOT",
        decoder: {
          space: "solace-dao.eth",
        },
      },
    ])
    .catch();

  const interest_protocol_id = cuid();
  await db
    .insert(dao)
    .values({
      id: interest_protocol_id,
      name: "Interest Protocol",
      picture: "/assets/Project_Icons/interest",
      quorumwarningemailsupport: false,
    })
    .catch();
  await db
    .insert(daohandler)
    .values([
      {
        id: cuid(),
        daoid: interest_protocol_id,
        type: "INTEREST_PROTOCOL_CHAIN",
        decoder: {
          address: "0x266d1020A84B9E8B0ed320831838152075F8C4cA",
          proxyAddress: "0x6b91A0Ba78Acc4a8C7919f96c181a895D5b31563",
          proposalUrl: "https://interestprotocol.io/#/proposal/",
        },
      },
    ])
    .catch();

  const rocket_pool_id = cuid();
  await db
    .insert(dao)
    .values({
      id: rocket_pool_id,
      name: "Rocket Pool",
      picture: "/assets/Project_Icons/rocket-pool",
      quorumwarningemailsupport: false,
    })
    .catch();
  await db
    .insert(daohandler)
    .values([
      {
        id: cuid(),
        daoid: rocket_pool_id,
        type: "SNAPSHOT",
        decoder: {
          space: "rocketpool-dao.eth",
        },
      },
    ])
    .catch();

  const zerox_protocol_id = cuid();
  await db
    .insert(dao)
    .values({
      id: zerox_protocol_id,
      name: "0x Protocol",
      picture: "/assets/Project_Icons/0x-protocol",
      quorumwarningemailsupport: false,
    })
    .catch();
  await db
    .insert(daohandler)
    .values([
      {
        id: cuid(),
        daoid: zerox_protocol_id,
        type: "SNAPSHOT",
        decoder: {
          space: "0xgov.eth",
        },
      },
      {
        id: cuid(),
        daoid: zerox_protocol_id,
        type: "ZEROX_PROTOCOL_CHAIN",
        decoder: {
          address: "0x0bB1810061C2f5b2088054eE184E6C79e1591101",
          proposalUrl: "https://governance.0xprotocol.org/vote/proposal/",
        },
      },
    ])
    .catch();

  console.log("Inserting seed user");

  const userid = cuid();
  await db
    .insert(user)
    .values({
      id: userid,
      address: "0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF",
    })
    .catch();

  console.log("Inserting subscriptions");

  const alldaos = await db.select().from(dao);

  for (const dao of alldaos) {
    await db
      .insert(subscription)
      .values({ id: cuid(), userid: userid, daoid: dao.id })
      .catch();
  }
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
