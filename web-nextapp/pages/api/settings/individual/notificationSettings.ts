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

  switch (method) {
    case "GET":
      let user = await prisma.user
        .findFirstOrThrow({
          where: {
            address: String(userAddress),
          },
        })
        .catch(() => {
          res.status(200).json([]);
        });

      let subscription = await prisma.subscription.findFirst({
        where: {
          userId: user?.id,
          daoId: Number(daoId),
        },
      });

      let notificationSettings = await prisma.notificationSetting.findMany({
        where: {
          subscriptionId: subscription?.id ?? 0,
        },
      });

      res.status(200).json(notificationSettings);
      break;
    case "PUT":
      let putPayload: NotificationSetting = JSON.parse(body);

      let putUser = await prisma.user.findFirstOrThrow({
        where: {
          address: String(userAddress),
        },
      });

      let putSubscription = await prisma.subscription.findFirst({
        where: {
          userId: putUser?.id,
          daoId: Number(daoId),
        },
        select: {
          id: true,
        },
      });

      await prisma.subscription.upsert({
        where: {
          id: putSubscription?.id ?? 0,
        },
        update: {
          notificationSettings: {
            create: putPayload,
          },
        },
        create: {
          userId: putUser?.id!,
          daoId: Number(daoId),
          notificationChannels: {
            create: [],
          },
          notificationSettings: {
            create: putPayload,
          },
        },
      });

      res.send(200);
      break;

    case "DELETE":
      let payload: NotificationSetting = JSON.parse(body);

      let deleteUser = await prisma.user.findFirstOrThrow({
        where: {
          address: String(userAddress),
        },
      });

      let deleteSubscription = await prisma.subscription.findFirst({
        where: {
          userId: deleteUser?.id,
          daoId: Number(daoId),
        },
        select: {
          id: true,
        },
      });

      await prisma.subscription.update({
        where: {
          id: deleteSubscription?.id ?? 0,
        },
        data: {
          notificationSettings: {
            deleteMany: {
              delay: payload.delay,
            },
          },
        },
      });

      res.send(200);
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
