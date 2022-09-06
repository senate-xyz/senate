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

  const userProposals = await prisma.proposal.findMany({
    where: {
      daoId: {
        in: userDaos.map((dao) => dao.daoId),
      },
    },
    include: {
      dao: true,
    },
  });

  res.status(200).json(userProposals);
}
