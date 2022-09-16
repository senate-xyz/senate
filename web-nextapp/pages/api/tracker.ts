import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userInputAddress } = req.query;

  const user = await prisma.user.findUnique({
    where: {
      address: userInputAddress as string,
    },
    select: {
      id: true,
    },
  });

  const userDaos = await prisma.subscription.findMany({
    where: { userId: user?.id },
    select: {
      daoId: true,
    },
  });

  let userProposals;

  userProposals = await prisma.proposal.findMany({
    where: {
      daoId: {
        in: userDaos.map((dao: any) => dao.daoId),
      },
      voteEnds: {
        lt: new Date(),
      },

      userVote: {
        some: {},
      },
    },
    include: {
      dao: {
        select: {
          id: true,
          name: true,
          picture: true,
          address: true,
          snapshotSpace: true,
        },
      },

      userVote: {
        select: {
          voteName: true,
          voteOption: true,
        },
      },
    },
    orderBy: {
      voteEnds: "desc",
    },
  });

  console.log(userProposals);

  res.status(200).json(userProposals);
}
