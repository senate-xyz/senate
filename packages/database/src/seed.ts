import aaveGovBravo from "./abis/aaveGovBravo.json";
import uniswapGovBravo from "./abis/uniswapGovBravo.json";
import compoundGovBravo from "./abis/compountGovBravo.json";
import makerChief from "./abis/makerChief.json";
import makerPolling from "./abis/makerPolling.json";
import { prisma } from "./client";
import { DaoOnChainHandler } from "@senate/common-types";

async function main() {
  // await prisma.userVote.deleteMany();
  // await prisma.proposal.deleteMany();
  // await prisma.notificationChannel.deleteMany();
  // await prisma.notificationSetting.deleteMany();
  // await prisma.subscription.deleteMany();
  // await prisma.dao.deleteMany();
  // await prisma.user.deleteMany();

  const aave = await prisma.dao.upsert({
    where: { name: "Aave" },
    update: {},
    create: {
      name: "Aave",
      address: "0xEC568fffba86c094cf06b22134B23074DFE2252c",
      onchainHandler: DaoOnChainHandler.Bravo1,
      snapshotSpace: "aave.eth",
      picture: "https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png",
      latestBlock: 15446733,
      proposalUrl: "https://app.aave.com/governance/proposal/?proposalId=",
      abi: aaveGovBravo.abi,
    },
  });

  const uniswap = await prisma.dao.upsert({
    where: { name: "Uniswap" },
    update: {},
    create: {
      name: "Uniswap",
      address: "0x408ED6354d4973f66138C91495F2f2FCbd8724C3",
      onchainHandler: DaoOnChainHandler.Bravo2,
      snapshotSpace: "uniswap",
      picture:
        "https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png",
      latestBlock: 13059157,
      proposalUrl: "https://app.uniswap.org/#/vote/",
      abi: uniswapGovBravo.abi,
    },
  });

  const compound = await prisma.dao.upsert({
    where: { name: "Compound" },
    update: {},
    create: {
      name: "Compound",
      address: "0xc0Da02939E1441F497fd74F78cE7Decb17B66529",
      onchainHandler: DaoOnChainHandler.Bravo2,
      snapshotSpace: "comp-vote.eth",
      picture: "https://avatars.githubusercontent.com/u/32911405?s=200&v=4",
      latestBlock: 10000000,
      proposalUrl: "https://compound.finance/governance/proposals/",
      abi: compoundGovBravo.abi,
    },
  });

  const dd = await prisma.dao.upsert({
    where: { name: "DeveloperDAO" },
    update: {},
    create: {
      name: "DeveloperDAO",
      address: "",
      onchainHandler: DaoOnChainHandler.None,
      snapshotSpace: "devdao.eth",
      picture: "https://avatars.githubusercontent.com/u/90118409?s=200&v=4",
      latestBlock: 10000000,
      proposalUrl: "https://github.com/Developer-DAO",
      abi: "none",
    },
  });

  const maker = await prisma.dao.upsert({
    where: { name: "MakerDAO" },
    update: {},
    create: {
      name: "MakerDAO",
      address: "0x0a3f6849f78076aefaDf113F5BED87720274dDC0",
      onchainHandler: DaoOnChainHandler.Maker,
      snapshotSpace: "",
      picture:
        "https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png",
      latestBlock: 10000000,
      proposalUrl: "https://vote.makerdao.com/executive/",
      abi: makerChief.abi,
    },
  });

  const makerPolls = await prisma.dao.upsert({
    where: { name: "MakerDAO Polls" },
    update: {},
    create: {
      name: "MakerDAO Polls",
      address: "0xf9be8f0945acddeedaa64dfca5fe9629d0cf8e5d",
      onchainHandler: DaoOnChainHandler.MakerPolling,
      snapshotSpace: "",
      picture:
        "https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png",
      latestBlock: 10000000,
      proposalUrl: "https://vote.makerdao.com/polling/",
      abi: makerPolling.abi,
    },
  });

  await prisma.dao.upsert({
    where: { name: "Optimism" },
    update: {},
    create: {
      name: "Optimism",
      address: "",
      onchainHandler: DaoOnChainHandler.None,
      snapshotSpace: "opcollective.eth",
      picture:
        "https://assets.coingecko.com/coins/images/25244/small/Optimism.png",
      latestBlock: 0,
      proposalUrl: "",
      abi: "",
    },
  });

  await prisma.dao.upsert({
    where: { name: "ENS" },
    update: {},
    create: {
      name: "ENS",
      address: "",
      onchainHandler: DaoOnChainHandler.None,
      snapshotSpace: "ens.eth",
      picture:
        "https://assets.coingecko.com/coins/images/19785/small/acatxTm8_400x400.jpg",
      latestBlock: 0,
      proposalUrl: "",
      abi: "",
    },
  });

  await prisma.dao.upsert({
    where: { name: "Yearn" },
    update: {},
    create: {
      name: "Yearn",
      address: "",
      onchainHandler: DaoOnChainHandler.None,
      snapshotSpace: "ybaby.eth",
      picture:
        "https://assets.coingecko.com/coins/images/11849/small/yfi-192x192.png",
      latestBlock: 0,
      proposalUrl: "",
      abi: "",
    },
  });

  await prisma.dao.upsert({
    where: { name: "Gitcoin" },
    update: {},
    create: {
      name: "Gitcoin",
      address: "",
      onchainHandler: DaoOnChainHandler.None,
      snapshotSpace: "gitcoindao.eth",
      picture:
        "https://assets.coingecko.com/coins/images/15810/small/gitcoin.png",
      latestBlock: 0,
      proposalUrl: "",
      abi: "",
    },
  });

  await prisma.dao.upsert({
    where: { name: "Curve" },
    update: {},
    create: {
      name: "Curve",
      address: "",
      onchainHandler: DaoOnChainHandler.None,
      snapshotSpace: "curve.eth",
      picture:
        "https://assets.coingecko.com/coins/images/12124/small/Curve.png",
      latestBlock: 0,
      proposalUrl: "",
      abi: "",
    },
  });

  await prisma.dao.upsert({
    where: { name: "Element DAO" },
    update: {},
    create: {
      name: "Element DAO",
      address: "",
      onchainHandler: DaoOnChainHandler.None,
      snapshotSpace: "elfi.eth",
      picture:
        "https://assets.coingecko.com/coins/images/24734/small/new-large.png",
      latestBlock: 0,
      proposalUrl: "",
      abi: "",
    },
  });

  await prisma.dao.upsert({
    where: { name: "Friends With Benefits" },
    update: {},
    create: {
      name: "Friends With Benefits",
      address: "",
      onchainHandler: DaoOnChainHandler.None,
      snapshotSpace: "friendswithbenefits.eth",
      picture:
        "https://assets.coingecko.com/coins/images/14391/small/xRGEXmQN_400x400.png",
      latestBlock: 0,
      proposalUrl: "",
      abi: "",
    },
  });

  await prisma.dao.upsert({
    where: { name: "Seed Club" },
    update: {},
    create: {
      name: "Seed Club",
      address: "",
      onchainHandler: DaoOnChainHandler.None,
      snapshotSpace: "club.eth",
      picture: "https://s2.coinmarketcap.com/static/img/coins/64x64/16802.png",
      latestBlock: 0,
      proposalUrl: "",
      abi: "",
    },
  });

  await prisma.dao.upsert({
    where: { name: "Goldfinch" },
    update: {},
    create: {
      name: "Goldfinch",
      address: "",
      onchainHandler: DaoOnChainHandler.None,
      snapshotSpace: "goldfinch.eth",
      picture:
        "https://assets.coingecko.com/coins/images/19081/small/GOLDFINCH.png",
      latestBlock: 0,
      proposalUrl: "",
      abi: "",
    },
  });

  await prisma.dao.upsert({
    where: { name: "Gelato" },
    update: {},
    create: {
      name: "Gelato",
      address: "",
      onchainHandler: DaoOnChainHandler.None,
      snapshotSpace: "gelato.eth",
      picture:
        "https://assets.coingecko.com/coins/images/15026/small/Gelato_Icon_Logo_1024x1024.png",
      latestBlock: 0,
      proposalUrl: "",
      abi: "",
    },
  });

  await prisma.dao.upsert({
    where: { name: "EPNS" },
    update: {},
    create: {
      name: "EPNS",
      address: "",
      onchainHandler: DaoOnChainHandler.None,
      snapshotSpace: "epns.eth",
      picture:
        "https://assets.coingecko.com/coins/images/14769/small/epns_logo.jpg",
      latestBlock: 0,
      proposalUrl: "",
      abi: "",
    },
  });

  await prisma.dao.upsert({
    where: { name: "APwine" },
    update: {},
    create: {
      name: "APwine",
      address: "",
      onchainHandler: DaoOnChainHandler.None,
      snapshotSpace: "apwine.eth",
      picture:
        "https://assets.coingecko.com/coins/images/15597/small/ApWine.png",
      latestBlock: 0,
      proposalUrl: "",
      abi: "",
    },
  });

  await prisma.dao.upsert({
    where: { name: "The Graph" },
    update: {},
    create: {
      name: "The Graph",
      address: "",
      onchainHandler: DaoOnChainHandler.None,
      snapshotSpace: "graphprotocol.eth",
      picture:
        "https://assets.coingecko.com/coins/images/13397/small/Graph_Token.png",
      latestBlock: 0,
      proposalUrl: "",
      abi: "",
    },
  });

  await prisma.dao.upsert({
    where: { name: "Sismo DAO" },
    update: {},
    create: {
      name: "Sismo DAO",
      address: "",
      onchainHandler: DaoOnChainHandler.None,
      snapshotSpace: "sismo.eth",
      picture:
        "https://cdn.stamp.fyi/space/sismo.eth?s=160&cb=1162619a0d16cd16",
      latestBlock: 0,
      proposalUrl: "",
      abi: "",
    },
  });

  await prisma.dao.upsert({
    where: { name: "Covalent" },
    update: {},
    create: {
      name: "Covalent",
      address: "",
      onchainHandler: DaoOnChainHandler.None,
      snapshotSpace: "covalenthq.eth",
      picture:
        "https://assets.coingecko.com/coins/images/14168/small/covalent-cqt.png",
      latestBlock: 0,
      proposalUrl: "",
      abi: "",
    },
  });

  await prisma.dao.upsert({
    where: { name: "Unlock Protocol" },
    update: {},
    create: {
      name: "Unlock Protocol",
      address: "",
      onchainHandler: DaoOnChainHandler.None,
      snapshotSpace: "unlock-protocol.eth",
      picture:
        "https://assets.coingecko.com/coins/images/14545/small/unlock.jpg",
      latestBlock: 0,
      proposalUrl: "",
      abi: "",
    },
  });

  await prisma.dao.upsert({
    where: { name: "Streamr" },
    update: {},
    create: {
      name: "Streamr",
      address: "",
      onchainHandler: DaoOnChainHandler.None,
      snapshotSpace: "streamr.eth",
      picture:
        "https://assets.coingecko.com/coins/images/17869/small/DATA_new_symbol_3x.png",
      latestBlock: 0,
      proposalUrl: "",
      abi: "",
    },
  });

  await prisma.dao.upsert({
    where: { name: "Balancer" },
    update: {},
    create: {
      name: "Balancer",
      address: "",
      onchainHandler: DaoOnChainHandler.None,
      snapshotSpace: "balancer.eth",
      picture:
        "https://assets.coingecko.com/coins/images/11683/small/Balancer.png",
      latestBlock: 0,
      proposalUrl: "",
      abi: "",
    },
  });

  await prisma.dao.upsert({
    where: { name: "dYdX" },
    update: {},
    create: {
      name: "dYdX",
      address: "",
      onchainHandler: DaoOnChainHandler.None,
      snapshotSpace: "dydxgov.eth",
      picture:
        "https://assets.coingecko.com/coins/images/17500/small/hjnIm9bV.jpg",
      latestBlock: 0,
      proposalUrl: "",
      abi: "",
    },
  });

  await prisma.dao.upsert({
    where: { name: "Sushi" },
    update: {},
    create: {
      name: "Sushi",
      address: "",
      onchainHandler: DaoOnChainHandler.None,
      snapshotSpace: "sushigov.eth",
      picture:
        "https://assets.coingecko.com/coins/images/12271/small/512x512_Logo_no_chop.png",
      latestBlock: 0,
      proposalUrl: "",
      abi: "",
    },
  });

  await prisma.dao.upsert({
    where: { name: "Hop" },
    update: {},
    create: {
      name: "Hop",
      address: "",
      onchainHandler: DaoOnChainHandler.None,
      snapshotSpace: "hop.eth",
      picture:
        "https://assets.coingecko.com/coins/images/25445/small/BVcNR51u_400x400.jpg",
      latestBlock: 0,
      proposalUrl: "",
      abi: "",
    },
  });

  await prisma.dao.upsert({
    where: { name: "GnosisDAO" },
    update: {},
    create: {
      name: "GnosisDAO",
      address: "",
      onchainHandler: DaoOnChainHandler.None,
      snapshotSpace: "gnosis.eth",
      picture:
        "https://assets.coingecko.com/coins/images/662/small/logo_square_simple_300px.png",
      latestBlock: 0,
      proposalUrl: "",
      abi: "",
    },
  });

  await prisma.dao.upsert({
    where: { name: "Index Coop" },
    update: {},
    create: {
      name: "Index Coop",
      address: "",
      onchainHandler: DaoOnChainHandler.None,
      snapshotSpace: "index-coop.eth",
      picture:
        "https://assets.coingecko.com/coins/images/12729/small/index.png",
      latestBlock: 0,
      proposalUrl: "",
      abi: "",
    },
  });

  const stakeborg = await prisma.dao.upsert({
    where: { name: "StakeborgDAO" },
    update: {},
    create: {
      name: "StakeborgDAO",
      address: "",
      onchainHandler: DaoOnChainHandler.None,
      snapshotSpace: "stakeborgdao.eth",
      picture:
        "https://assets.coingecko.com/coins/images/20119/small/stquY-WB_400x400.jpg?1636522705",
      latestBlock: 10000000,
      proposalUrl: "https://github.com/Stakeborg-Community",
      abi: "none",
    },
  });

  const delegate = await prisma.user.upsert({
    where: { address: "0xCdB792c14391F7115Ba77A7Cd27f724fC9eA2091" },
    update: {},
    create: {
      address: "0xCdB792c14391F7115Ba77A7Cd27f724fC9eA2091",
    },
  });

  await prisma.user.update({
    where: { address: "0xCdB792c14391F7115Ba77A7Cd27f724fC9eA2091" },
    data: {
      subscriptions: {
        create: [
          {
            daoId: aave.id,
          },
          {
            daoId: maker.id,
          },
          {
            daoId: makerPolls.id,
          },
          {
            daoId: compound.id,
          },
          {
            daoId: uniswap.id,
          },
          {
            daoId: dd.id,
          },
        ],
      },
    },
  });
}

main();
