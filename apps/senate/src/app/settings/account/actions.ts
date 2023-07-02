"use server";

import { prisma, NotificationType } from "@senate/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";

export const deleteUser = async () => {
  "use server";
  const session = await getServerSession(authOptions());
  const userAddress = session?.user?.name ?? "";

  const user = await prisma.user.findFirst({
    where: {
      address: {
        equals: userAddress,
      },
    },
  });
  await prisma.user.delete({
    where: { id: user?.id },
  });
};

export const randomQA = async () => {
  "use server";
  const session = await getServerSession(authOptions());
  const userAddress = session?.user?.name ?? "";

  const proposalsCount = await prisma.proposal.count();

  const randomNumber = Math.floor(Math.random() * proposalsCount);

  const randomProposal = await prisma.proposal.findFirst({
    skip: randomNumber,
  });

  const user = await prisma.user.findFirst({
    where: {
      address: {
        equals: userAddress,
      },
    },
  });

  await prisma.notification.create({
    data: {
      proposalid: String(randomProposal?.id),
      userid: String(user?.id),
      type: NotificationType.QUORUM_NOT_REACHED_EMAIL,
    },
  });
};

export const lastQA = async () => {
  "use server";
  const session = await getServerSession(authOptions());
  const userAddress = session?.user?.name ?? "";

  const firstProposal = await prisma.proposal.findFirst({
    where: {
      state: "ACTIVE",
    },
    orderBy: {
      timeend: "asc",
    },
  });

  const user = await prisma.user.findFirst({
    where: {
      address: {
        equals: userAddress,
      },
    },
  });

  await prisma.notification.create({
    data: {
      proposalid: String(firstProposal?.id),
      userid: String(user?.id),
      type: NotificationType.QUORUM_NOT_REACHED_EMAIL,
    },
  });
};

export const aaveQA = async () => {
  "use server";
  const session = await getServerSession(authOptions());
  const userAddress = session?.user?.name ?? "";

  const firstProposal = await prisma.proposal.findFirst({
    where: {
      dao: {
        name: "Aave",
      },
      state: "ACTIVE",
    },
    orderBy: {
      timeend: "asc",
    },
  });

  const user = await prisma.user.findFirst({
    where: {
      address: {
        equals: userAddress,
      },
    },
  });

  await prisma.notification.create({
    data: {
      proposalid: String(firstProposal?.id),
      userid: String(user?.id),
      type: NotificationType.QUORUM_NOT_REACHED_EMAIL,
    },
  });
};

export const uniswapQA = async () => {
  "use server";
  const session = await getServerSession(authOptions());
  const userAddress = session?.user?.name ?? "";

  const firstProposal = await prisma.proposal.findFirst({
    where: {
      dao: {
        name: "Uniswap",
      },
      state: "ACTIVE",
    },
    orderBy: {
      timeend: "asc",
    },
  });

  const user = await prisma.user.findFirst({
    where: {
      address: {
        equals: userAddress,
      },
    },
  });

  await prisma.notification.create({
    data: {
      proposalid: String(firstProposal?.id),
      userid: String(user?.id),
      type: NotificationType.QUORUM_NOT_REACHED_EMAIL,
    },
  });
};

export const deleteNotifs = async () => {
  "use server";
  const session = await getServerSession(authOptions());
  const userAddress = session?.user?.name ?? "";

  const user = await prisma.user.findFirst({
    where: {
      address: {
        equals: userAddress,
      },
    },
  });
  await prisma.notification.deleteMany({
    where: { userid: user?.id },
  });
};

export const sendBulletin = async () => {
  "use server";
  const session = await getServerSession(authOptions());
  const userAddress = session?.user?.name ?? "";

  const user = await prisma.user.findFirst({
    where: {
      address: {
        equals: userAddress,
      },
    },
  });

  await prisma.notification.create({
    data: {
      userid: String(user?.id),
      type: NotificationType.BULLETIN_EMAIL,
    },
  });
};
