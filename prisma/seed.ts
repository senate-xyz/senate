import { PrismaClient } from "@prisma/client";
import { NotificationChannelEnum, NotificationIntervalEnum } from "../types";

import aaveGovBravo from "../abis/aaveGovBravo.json";
import uniswapGovBravo from "../abis/uniswapGovBravo.json";
import compoundGovBravo from "../abis/compountGovBravo.json";
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.subscription.deleteMany();
    await prisma.notificationChannel.deleteMany();
    await prisma.notificationSetting.deleteMany();
    await prisma.user.deleteMany();
    await prisma.dao.deleteMany();
    await prisma.proposal.deleteMany();
  } catch (e) {
    console.log("db already empty");
  }

  const alice = await prisma.user.upsert({
    where: { address: "0xalice" },
    update: {},
    create: {
      address: "0xalice",
    },
  });

  const bob = await prisma.user.upsert({
    where: { address: "0xbob" },
    update: {},
    create: {
      address: "0xbob",
    },
  });

  const myself = await prisma.user.upsert({
    where: { address: "0xa93ae3a2ce1714f422ec2d799c48a56b2035c872" },
    update: {},
    create: {
      address: "0xa93ae3a2ce1714f422ec2d799c48a56b2035c872",
    },
  });

  const aave = await prisma.dao.upsert({
    where: { address: "0xaave" },
    update: {},
    create: {
      name: "Aave",
      address: "0xEC568fffba86c094cf06b22134B23074DFE2252c",
      snapshotSpace: "aave.eth",
      picture: "https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png",
      latestBlock: 11427398,
      proposalUrl: "https://app.aave.com/governance/proposal/?proposalId=",
      abi: aaveGovBravo.abi,
    },
  });

  const uniswap = await prisma.dao.upsert({
    where: { address: "0xuni" },
    update: {},
    create: {
      name: "Uniswap",
      address: "0x408ED6354d4973f66138C91495F2f2FCbd8724C3",
      snapshotSpace: "uniswap",
      picture:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Uniswap_Logo.svg/2051px-Uniswap_Logo.svg.png",
      latestBlock: 13059157,
      proposalUrl: "https://app.uniswap.org/#/vote/",
      abi: uniswapGovBravo.abi,
    },
  });

  const compound = await prisma.dao.upsert({
    where: { address: "0xcomp" },
    update: {},
    create: {
      name: "Compound",
      address: "0xc0Da02939E1441F497fd74F78cE7Decb17B66529",
      snapshotSpace: "comp-vote.eth",
      picture: "https://avatars.githubusercontent.com/u/32911405?s=200&v=4",
      latestBlock: 12006099,
      proposalUrl: "https://compound.finance/governance/proposals/",
      abi: compoundGovBravo.abi,
    },
  });

  const dd = await prisma.dao.upsert({
    where: { address: "0xdd" },
    update: {},
    create: {
      name: "DeveloperDAO",
      address: "devdao.eth",
      snapshotSpace: "devdao.eth",
      picture: "https://avatars.githubusercontent.com/u/90118409?s=200&v=4",
      latestBlock: 12006099,
      proposalUrl: "https://github.com/Developer-DAO",
      abi: "none",
    },
  });

  const stakeborg = await prisma.dao.upsert({
    where: { address: "0xstakeborg" },
    update: {},
    create: {
      name: "StakeborgDAO",
      address: "stakeborgdao.eth",
      snapshotSpace: "stakeborgdao.eth",
      picture:
        "https://assets.coingecko.com/coins/images/20119/small/stquY-WB_400x400.jpg?1636522705",
      latestBlock: 12006099,
      proposalUrl: "https://github.com/Stakeborg-Community",
      abi: "none",
    },
  });

  await prisma.user.update({
    where: { address: "0xa93ae3a2ce1714f422ec2d799c48a56b2035c872" },
    data: {
      subscriptions: {
        create: [
          {
            daoId: dd.id,
            notificationChannels: {
              create: [
                {
                  type: NotificationChannelEnum.Discord,
                  connector: "#discordChannel",
                },
              ],
            },
            notificationSettings: {
              create: [{ delay: NotificationIntervalEnum.OneHour }],
            },
          },
          {
            daoId: stakeborg.id,
            notificationChannels: {
              create: [
                {
                  type: NotificationChannelEnum.Discord,
                  connector: "#discordChannel",
                },
              ],
            },
            notificationSettings: {
              create: [{ delay: NotificationIntervalEnum.OneHour }],
            },
          },
        ],
      },
    },
  });

  await prisma.user.update({
    where: { address: "0xbob" },
    data: {
      subscriptions: {
        create: [
          {
            daoId: aave.id,
            notificationChannels: {
              create: [
                {
                  type: NotificationChannelEnum.Discord,
                  connector: "#discordChannel",
                },
              ],
            },
            notificationSettings: {
              create: [{ delay: NotificationIntervalEnum.OneHour }],
            },
          },
          {
            daoId: compound.id,
            notificationChannels: {
              create: [
                {
                  type: NotificationChannelEnum.Slack,
                  connector: "#slackChannel",
                },
              ],
            },
            notificationSettings: {
              create: [{ delay: NotificationIntervalEnum.TwoHours }],
            },
          },
          {
            daoId: uniswap.id,
            notificationChannels: {
              create: [
                {
                  type: NotificationChannelEnum.Discord,
                  connector: "#discordChannel",
                },
                {
                  type: NotificationChannelEnum.Slack,
                  connector: "#slackChannel",
                },
              ],
            },
            notificationSettings: {
              create: [
                { delay: NotificationIntervalEnum.OneHour },
                { delay: NotificationIntervalEnum.TwoHours },
              ],
            },
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
