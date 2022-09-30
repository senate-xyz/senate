import { prisma } from "database";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userInputAddress, includePastDays } = req.query;

  const user = await prisma.user.findUnique({
    where: {
      address: userInputAddress as string,
    },
    select: {
      id: true,
    },
  });

  const userDaos = await prisma.subscription.findMany({
    where: {
      AND: {
        userId: user?.id,
        notificationChannels: {
          every: {},
        },
      },
    },
    select: {
      daoId: true,
    },
  });

  let userProposals;

  if (includePastDays) {
    const date = new Date(
      new Date().setDate(new Date().getDate() - Number(includePastDays))
    );

    userProposals = await prisma.proposal.findMany({
      where: {
        daoId: {
          in: userDaos.map((dao: any) => dao.daoId),
        },
        voteEnds: {
          gt: date,
        },
      },
      include: {
        dao: true,
        userVote: {
          where: {
            userId: user?.id,
          },
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        voteEnds: "asc",
      },
    });
  } else {
    userProposals = await prisma.proposal.findMany({
      where: {
        daoId: {
          in: userDaos.map((dao: any) => dao.daoId),
        },
      },
      include: {
        dao: true,
        userVote: {
          where: {
            userId: user?.id,
          },
          include: {
            user: true,
          },
        },
      },
    });
  }

  res.status(200).json(userProposals);
}
