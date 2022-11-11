import { prisma } from "@senate/database";
import { RefreshStatus, Subscription } from "@senate/common-types";
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

  const daos = await prisma.dAO.findMany({
    where: { refreshStatus: RefreshStatus.NEW },
  });

  if (!daos.length) console.log("No DAOs to refresh.");

  for (const dao of daos) {
    await prisma.dAO.update({
      where: {
        id: dao.id,
      },
      data: {
        refreshStatus: RefreshStatus.PENDING,
        lastRefresh: new Date(),
      },
    });

    console.log(
      `Refresh - PENDING -  daoId ${dao.id} - ${dao.name} at ${dao.lastRefresh}`
    );

    await fetch(
      `${process.env.DETECTIVE_URL}/updateProposals?daoId=${dao.id}`,
      {
        method: "POST",
      }
    );
  }
};

const refreshUsers = async () => {
  console.log("Refresh Voters");

  const voters = await prisma.voter.findMany({
    where: { refreshStatus: RefreshStatus.NEW },
  });

  if (!voters.length) console.log("No users to refresh.");

  for (const voter of voters) {
    console.log(`Refresh voter id: ${voter.id}`);

    await prisma.voter.update({
      where: {
        id: voter.id,
      },
      data: {
        refreshStatus: RefreshStatus.PENDING,
      },
    });

    const users = await prisma.user.findMany({
      where: {
        voters: {
          some: {
            id: voter.id,
          },
        },
      },
      include: {
        subscriptions: true,
      },
    });

    const subs = users.map((user) => user.subscriptions);

    let totalSubs: Subscription[] = [];

    for (const sub of subs) {
      totalSubs = [...sub];
    }

    for (const sub of totalSubs) {
      console.log(
        `Refresh - PENDING -  voterId ${voter.address} - ${sub.daoId} at ${voter.lastRefresh} -> ${process.env.DETECTIVE_URL}/updateVotes?daoId=${sub.daoId}&voterAddress=${voter.address}`
      );
      await fetch(
        `${process.env.DETECTIVE_URL}/updateVotes?daoId=${sub.daoId}&voterAddress=${voter.address}`,
        {
          method: "POST",
        }
      ).catch((e) => {
        console.log(e);
      });
    }
  }
};

main();
