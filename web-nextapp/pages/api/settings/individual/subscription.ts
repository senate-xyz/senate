import type { NextApiRequest, NextApiResponse } from "next";
import { NotificationSetting, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { userAddress, daoId },
    method,
    body,
  } = req;

  let user = await prisma.user
    .findFirstOrThrow({
      where: {
        address: String(userAddress),
      },
    })
    .catch((e) => {
      res.send(false);
      return;
    });

  switch (method) {
    case "GET":
      await prisma.subscription
        .findFirstOrThrow({
          where: {
            daoId: Number(daoId),
            userId: user?.id,
          },
        })
        .then((e) => {
          res.send(true);
        })
        .catch((e) => {
          res.send(false);
        });

      break;

    case "PUT":
      await prisma.subscription
        .create({
          data: {
            userId: user?.id!,
            daoId: Number(daoId),
          },
        })
        .then((e) => {
          res.send(true);
        })
        .catch((e) => {
          res.send(false);
        });

      break;

    case "DELETE":
      let sub = await prisma.subscription.findFirstOrThrow({
        where: {
          userId: user?.id!,
          daoId: Number(daoId),
        },
      });

      await prisma.subscription
        .delete({
          where: {
            id: sub.id,
          },
        })
        .then((e) => {
          res.send(true);
        })
        .catch((e) => {
          res.send(false);
        });
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
