import { PrismaClient } from "@prisma/client";
import { NotificationChannelTypes } from "../types";
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.user.deleteMany();
    await prisma.dao.deleteMany();
    await prisma.proposal.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.notificationChannel.deleteMany();
    await prisma.notificationSettings.deleteMany();
  } catch (e) {
    console.log("db already empty");
  }

  await prisma.user.upsert({
    where: { address: "0xalice" },
    update: {},
    create: {
      address: "0xalice",
    },
  });

  await prisma.user.upsert({
    where: { address: "0xbob" },
    update: {},
    create: {
      address: "0xbob",
    },
  });

  const dd = await prisma.dao.upsert({
    where: { address: "0xdd" },
    update: {},
    create: {
      name: "DeveloperDAO",
      address: "0xdd",
    },
  });

  await prisma.proposal.upsert({
    where: { id: 0 },
    update: {},
    create: {
      title: "P19: S1 Specification & Budget",
      description:
        "This is the Developer DAO Season 1 specification. If this proposal passes, the following will apply",
      url: "https://snapshot.org/#/devdao.eth/proposal/0x268cb7e88aa20d7cd9850b5b0ac29c4936bb56706f5c8b36488c78fff78dedc0",
      daoId: dd.id,
      timeCreated: new Date(Date.now()),
      timeEnd: new Date(Date.now() + 1000),
    },
  });

  await prisma.proposal.upsert({
    where: { id: 0 },
    update: {},
    create: {
      title: "P-18: The Developer DAO Foundation",
      description:
        "This proposal outlines the structure, purpose and implications of The Developer DAO Foundation (the “Foundation”) on Developer DAO and, therefore members.",
      url: "https://snapshot.org/#/devdao.eth/proposal/0x0354fad305c13eae8ba78b2395117b45191465433c20f76efcf3eba4c5600436",
      daoId: dd.id,
      timeCreated: new Date(Date.now()),
      timeEnd: new Date(Date.now() + 1000),
    },
  });

  const fwb = await prisma.dao.upsert({
    where: { address: "0xfwb_dao" },
    update: {},
    create: {
      name: "Friends with Benefits",
      address: "0xfwb_dao",
    },
  });

  await prisma.proposal.upsert({
    where: { id: 0 },
    update: {},
    create: {
      title: "FWB x thEM Partnership",
      description:
        "This proposal seeks to form a partnership between Early Majority (thEM), an outdoor community that makes gear for its members and empowers them to enjoy it, and FWB.",
      url: "https://snapshot.org/#/friendswithbenefits.eth/proposal/0xbda228740cabcf63fb63ec98c5c09956b4464ee6cd97fea305c9982a3acb1b09",
      daoId: fwb.id,
      timeCreated: new Date(Date.now()),
      timeEnd: new Date(Date.now() + 1000),
    },
  });

  await prisma.proposal.upsert({
    where: { id: 0 },
    update: {},
    create: {
      title:
        "FWB Season 7 Operational Budget (August 2022 through December 2022)",
      description:
        "This proposal covers accrued expenses for August as well as a proposed budget through December 2022. A detailed breakout of requested approvals / expenses may be found here Season 7 Operating Budget",
      url: "https://snapshot.org/#/friendswithbenefits.eth/proposal/0xbd81656fd633c9708b9b0b82897dba66b54248e70e9453b5ff9960c708c6de1f",
      daoId: fwb.id,
      timeCreated: new Date(Date.now()),
      timeEnd: new Date(Date.now() + 1000),
    },
  });

  await prisma.proposal.upsert({
    where: { id: 0 },
    update: {},
    create: {
      title: "FWB Wiki",
      description:
        "The FWB Wiki started as a community led knowledge base for all things FWB, providing a static place for important member information. With this proposal we want to refresh the Wiki to make it up to date, assign internal team members to keep it that way, and establish a seasonal contributor team to help maintain the FWB and field questions from the greater community to determine what else would be beneficial to add.",
      url: "https://snapshot.org/#/friendswithbenefits.eth/proposal/0x2f464bb9c94ef16e93cfdc290dcf59541dd6607d0c4494f52173faa3af654e7b",
      daoId: fwb.id,
      timeCreated: new Date(Date.now()),
      timeEnd: new Date(Date.now() + 1000),
    },
  });

  await prisma.user.update({
    where: { address: "0xalice" },
    data: {
      subscriptions: {
        create: [
          {
            daoId: fwb.id,
            notificationChannels: {
              create: [
                {
                  type: NotificationChannelTypes.Discord,
                  connector: "#discordChannel",
                },
                {
                  type: NotificationChannelTypes.Slack,
                  connector: "#slackChannel",
                },
              ],
            },
            notificationSettings: {
              create: [
                { time: new Date(1662410000000) },
                { time: new Date(1662420000000) },
                { time: new Date(1662430000000) },
              ],
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
            daoId: fwb.id,
            notificationChannels: {
              create: [
                {
                  type: NotificationChannelTypes.Discord,
                  connector: "#discordChannel",
                },
                {
                  type: NotificationChannelTypes.Slack,
                  connector: "#slackChannel",
                },
              ],
            },
            notificationSettings: {
              create: [
                { time: new Date(1662440000000) },
                { time: new Date(1662450000000) },
                { time: new Date(1662460000000) },
              ],
            },
          },
          {
            daoId: dd.id,
            notificationChannels: {
              create: [
                {
                  type: NotificationChannelTypes.Discord,
                  connector: "#discordChannel",
                },
              ],
            },
            notificationSettings: {
              create: [
                { time: new Date(1662470000000) },
                { time: new Date(1662480000000) },
                { time: new Date(1662500000000) },
                { time: new Date(1662510000000) },
                { time: new Date(1662520000000) },
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
