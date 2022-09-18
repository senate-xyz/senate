import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userInputAddress } = req.query;

  const user = await prisma.user
    .findFirstOrThrow({
      where: {
        address: userInputAddress as string,
      },
      select: {
        id: true,
      },
    })
    .catch(() => {
      res.status(200).json([]);
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
        some: {
          userId: user?.id,
        },
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

  res.status(200).json(userProposals);
}
