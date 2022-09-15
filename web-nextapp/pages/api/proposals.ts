import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userInputAddress } = req.query;

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

  const DAYS_AGO = 10;
  let date = new Date(new Date().setDate(new Date().getDate() - DAYS_AGO));
  const userProposals = await prisma.proposal.findMany({
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
    },
  });

  res.status(200).json(userProposals);
}
