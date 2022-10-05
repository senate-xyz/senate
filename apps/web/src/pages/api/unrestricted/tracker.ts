import { prisma } from "@senate/database";
import type { NextApiRequest, NextApiResponse } from "next";

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
      return { id: "0" };
    });

  if (user.id == "0") return;

  const subscriptions = await prisma.subscription.findMany({
    where: { userId: user.id },
    select: {
      daoId: true,
    },
  });

  if (!subscriptions.length) return;

  const userProposalsVoted = await prisma.proposal.findMany({
    where: {
      AND: {
        daoId: {
          in: subscriptions.map((dao: any) => dao.daoId),
        },
        data: {
          path: "$.timeStart",
          lt: Number(new Date()),
        },
        votes: {
          every: {
            userId: user.id,
          },
        },
      },
    },
    include: {
      dao: true,
      votes: {
        where: {
          userId: user.id,
        },
      },
    },
  });

  res.status(200).json(userProposalsVoted);
}
