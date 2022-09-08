import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

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

  const userSubscriptions = await prisma.subscription.findMany({
    where: {
      userId: userId?.id,
    },
    distinct: "daoId",
    include: {
      Dao: true,
      notificationChannels: {
        select: {
          type: true,
          connector: true,
        },
      },
      notificationSettings: {
        select: {
          createdTime: true,
          delay: true,
        },
      },
    },
  });

  res.status(200).json(userSubscriptions);
}
