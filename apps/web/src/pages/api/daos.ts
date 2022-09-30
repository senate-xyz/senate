import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@senate/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const daosList = await prisma.dao.findMany({
    where: {},
    orderBy: {
      id: "asc",
    },
    distinct: "id",
  });

  res.status(200).json(daosList);
}
