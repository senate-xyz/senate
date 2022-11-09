import { prisma } from "@senate/database";
import { RefreshStatus } from "@senate/common-types";
import fetch from "node-fetch";
import * as cron from "node-cron";

const main = () => {
  console.log("Refresher start");

  cron.schedule("* * * * *", () => {
    console.log("Running refresher");
    refreshDaos();
    refreshUsers();
  });
};

const refreshDaos = async () => {
  console.log("Refresh DAOs");

  const daosRefreshList = await prisma.dAORefreshQueue.findMany({
    where: { status: RefreshStatus.NEW },
    distinct: ["daoId"],
  });

  if (!daosRefreshList.length) console.log("No DAOs to refresh.");

  for (const daoRefreshEntry of daosRefreshList) {
    await prisma.dAORefreshQueue.update({
      where: {
        id: daoRefreshEntry.id,
      },
      data: {
        status: RefreshStatus.PENDING,
        updatedAt: new Date(),
      },
    });

    console.log(`Refresh daoId ${daoRefreshEntry.daoId}`);

    await fetch(
      `${process.env.DETECTIVE_URL}/updateProposals?daoId=${daoRefreshEntry.daoId}`,
      {
        method: "POST",
      }
    );
  }
};

const refreshUsers = async () => {
  console.log("Refresh Users");

  const usersRefreshList = await prisma.usersRefreshQueue.findMany({
    where: { status: RefreshStatus.NEW },
    distinct: ["userId"],
  });

  if (!usersRefreshList.length) console.log("No users to refresh.");

  for (const userRefreshEntry of usersRefreshList) {
    console.log(`Refresh userId: ${userRefreshEntry.userId}`);

    await prisma.usersRefreshQueue.update({
      where: {
        id: userRefreshEntry.id,
      },
      data: {
        status: RefreshStatus.PENDING,
      },
    });

    const user = await prisma.user.findFirst({
      where: {
        id: userRefreshEntry.userId,
      },
    });

    if (!user) return;

    const userProxies = await prisma.userProxy.findMany({
      where: {
        userId: user.id,
      },
    });

    const userSubs = await prisma.subscription.findMany({
      where: { userId: user.id },
    });

    for (const sub of userSubs) {
      console.log(
        `${process.env.DETECTIVE_URL}/updateVotes?daoId=${sub.daoId}&voterAddress=${user.address}`
      );
      await fetch(
        `${process.env.DETECTIVE_URL}/updateVotes?daoId=${sub.daoId}&voterAddress=${user.address}`,
        {
          method: "POST",
        }
      ).catch((e) => {
        console.log(e);
      });

      for (const proxy of userProxies) {
        console.log(
          `${process.env.DETECTIVE_URL}/updateVotes?daoId=${sub.daoId}&voterAddress=${proxy.address}`
        );
        await fetch(
          `${process.env.DETECTIVE_URL}/updateVotes?daoId=${sub.daoId}&voterAddress=${proxy.address}`,
          {
            method: "POST",
          }
        ).catch((e) => {
          console.log(e);
        });
      }
    }
  }
};

main();
