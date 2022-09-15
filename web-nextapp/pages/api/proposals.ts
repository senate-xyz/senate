import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userInputAddress, includePastDays } = req.query;

  const userId = await prisma.user.findUnique({
    where: {
      address: userInputAddress as string,
    },
    select: {
      id: true,
    },
  });

  const userDaos = await prisma.subscription.findMany({
    where: { userId: userId?.id },
    select: {
      daoId: true,
    },
  });

  let userProposals;

  if (includePastDays) {
    let date = new Date(
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
        userVote: true,
      },
      orderBy: {
        voteEnds: "desc",
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
        userVote: true,
      },
    });
  }

  res.status(200).json(userProposals);
}
