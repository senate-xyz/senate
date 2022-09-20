import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { type } from "os";

const prisma = new PrismaClient();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { userAddress },
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
      res.status(200).json({});
      return;
    });

  switch (method) {
    case "GET":
      let generalSettings = await prisma.generalNotificationSetting.findMany({
        where: {
          user: {
            every: {
              id: user?.id,
            },
          },
        },
      });

      res.status(200).json(generalSettings);
      break;

    case "PUT": {
      let { delay, createdTime } = JSON.parse(body);

      await prisma.generalNotificationSetting.create({
        data: {
          user: {
            connect: {
              id: user?.id,
            },
          },
          delay: delay,
          createdTime: createdTime,
        },
      });

      res.status(200).json({});
      break;
    }
    case "DELETE": {
      let { delay, createdTime } = JSON.parse(body);
      await prisma.generalNotificationSetting.deleteMany({
        where: {
          AND: {
            user: {
              every: {
                id: user?.id,
              },
            },
            delay: delay,
          },
        },
      });

      res.status(200).json({});
      break;
    }

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
