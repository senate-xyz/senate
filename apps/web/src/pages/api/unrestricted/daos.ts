import { prisma } from "@senate/database";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const daosList = await prisma.dAO.findMany({
    where: {},
    orderBy: {
      id: "asc",
    },
    distinct: "id",
    include: {
      handlers: true,
    },
  });

  res.status(200).json(daosList);
}
