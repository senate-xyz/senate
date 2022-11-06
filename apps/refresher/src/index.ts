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
  const daosRefreshList = await prisma.dAORefreshQueue.findMany({});

  if (!daosRefreshList) console.log("No DAOs to refresh.");

  for (const daoRefreshEntry of daosRefreshList) {
    console.log(`Refresh daoId ${daoRefreshEntry.daoId}`);
    if (daoRefreshEntry.status == RefreshStatus.NEW) {
      await fetch(
        `${process.env.DETECTIVE_URL}/updateProposals?daoId=${daoRefreshEntry.daoId}`,
        {
          method: "POST",
        }
      );
    } else if (daoRefreshEntry.status == RefreshStatus.PENDING)
      console.log(`Refresh for daoId ${daoRefreshEntry.daoId} already pending`);
  }
};

const refreshUsers = async () => {
  console.log("Refresh Users");

  const usersRefreshList = await prisma.userRefreshQueue.findMany({});

  if (!usersRefreshList) console.log("No users to refresh.");

  for (const userRefreshEntry of usersRefreshList) {
    console.log(`Refresh userId: ${userRefreshEntry.userId}`);
    if (userRefreshEntry.status == RefreshStatus.NEW) {
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
        await fetch(
          `${process.env.DETECTIVE_URL}/updateVotes?daoId=${sub.daoId}&voterAddress=${user.address}`,
          {
            method: "POST",
          }
        );

        for (const proxy of userProxies) {
          await fetch(
            `${process.env.DETECTIVE_URL}/updateVotes?daoId=${sub.daoId}&voterAddress=${proxy.address}`,
            {
              method: "POST",
            }
          );
        }
      }
    } else if (userRefreshEntry.status == RefreshStatus.PENDING)
      console.log(
        `Refresh for userId ${userRefreshEntry.userId} already pending`
      );
  }
};

main();
