import { prisma } from "@senate/database";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userProposals = await prisma.proposal.findMany({
    where: {
      data: {
        path: "$.timeEnd",
        lt: Number(new Date()),
      },
    },
    include: {
      dao: {
        include: {
          handlers: {
            select: {
              type: true,
            },
          },
        },
      },
    },
  });

  res.status(200).json(userProposals);
}
