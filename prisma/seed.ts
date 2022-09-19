import { PrismaClient } from "@prisma/client";
import {
  DaoOnChainHandler,
  NotificationChannelEnum,
  NotificationIntervalEnum,
} from "../types";

import aaveGovBravo from "../abis/aaveGovBravo.json";
import uniswapGovBravo from "../abis/uniswapGovBravo.json";
import compoundGovBravo from "../abis/compountGovBravo.json";
import makerChief from "../abis/makerChief.json";
const prisma = new PrismaClient();

async function main() {
  // await prisma.userVote.deleteMany();
  // await prisma.proposal.deleteMany();
  // await prisma.notificationChannel.deleteMany();
  // await prisma.notificationSetting.deleteMany();
  // await prisma.subscription.deleteMany();
  // await prisma.dao.deleteMany();
  // await prisma.user.deleteMany();

  const aave = await prisma.dao.upsert({
    where: { id: 0 },
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
    where: { id: 0 },
    update: {},
    create: {
      name: "Uniswap",
      address: "0x408ED6354d4973f66138C91495F2f2FCbd8724C3",
      onchainHandler: DaoOnChainHandler.Bravo2,
      snapshotSpace: "uniswap",
      picture:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Uniswap_Logo.svg/2051px-Uniswap_Logo.svg.png",
      latestBlock: 13059157,
      proposalUrl: "https://app.uniswap.org/#/vote/",
      abi: uniswapGovBravo.abi,
    },
  });

  const compound = await prisma.dao.upsert({
    where: { id: 0 },
    update: {},
    create: {
      name: "Compound",
      address: "0xc0Da02939E1441F497fd74F78cE7Decb17B66529",
      onchainHandler: DaoOnChainHandler.Bravo2,
      snapshotSpace: "comp-vote.eth",
      picture: "https://avatars.githubusercontent.com/u/32911405?s=200&v=4",
      latestBlock: 12006099,
      proposalUrl: "https://compound.finance/governance/proposals/",
      abi: compoundGovBravo.abi,
    },
  });

  const dd = await prisma.dao.upsert({
    where: { id: 0 },
    update: {},
    create: {
      name: "DeveloperDAO",
      address: "",
      onchainHandler: DaoOnChainHandler.None,
      snapshotSpace: "devdao.eth",
      picture: "https://avatars.githubusercontent.com/u/90118409?s=200&v=4",
      latestBlock: 12006099,
      proposalUrl: "https://github.com/Developer-DAO",
      abi: "none",
    },
  });

  const stakeborg = await prisma.dao.upsert({
    where: { id: 0 },
    update: {},
    create: {
      name: "StakeborgDAO",
      address: "",
      onchainHandler: DaoOnChainHandler.None,
      snapshotSpace: "stakeborgdao.eth",
      picture:
        "https://assets.coingecko.com/coins/images/20119/small/stquY-WB_400x400.jpg?1636522705",
      latestBlock: 12006099,
      proposalUrl: "https://github.com/Stakeborg-Community",
      abi: "none",
    },
  });

  const maker = await prisma.dao.upsert({
    where: { id: 0 },
    update: {},
    create: {
      name: "MakerDAO",
      address: "0x0a3f6849f78076aefaDf113F5BED87720274dDC0",
      onchainHandler: DaoOnChainHandler.Maker,
      snapshotSpace: "",
      picture:
        "https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png",
      latestBlock: 15446733,
      proposalUrl: "https://vote.makerdao.com/executive/",
      abi: makerChief.abi,
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
            daoId: maker.id,
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
          {
            daoId: stakeborg.id,
          },
        ],
      },
    },
  });

  await prisma.user.create({
    data: {
      address: "0x1dd7c29dba3cfc8cd64220f7331e214a791a5989",
    },
  });

  await prisma.user.update({
    where: { address: "0x1dd7c29dba3cfc8cd64220f7331e214a791a5989" },
    data: {
      subscriptions: {
        create: [
          {
            daoId: aave.id,
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
          {
            daoId: stakeborg.id,
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
