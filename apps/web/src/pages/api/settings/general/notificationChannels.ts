import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@senate/database";

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
      return null;
    });

  switch (method) {
    case "GET":
      let generalChannels = await prisma.generalNotificationChannel.findMany({
        where: {
          user: {
            every: {
              id: user?.id,
            },
          },
        },
      });

      res.status(200).json(generalChannels);
      break;

    case "PUT": {
      let { type, connector } = JSON.parse(body);

      await prisma.generalNotificationChannel.create({
        data: {
          user: {
            connect: {
              id: user?.id,
            },
          },
          type: type,
          connector: connector,
        },
      });

      res.status(200).json({});
      break;
    }
    case "DELETE": {
      let { type, connector } = JSON.parse(body);
      await prisma.generalNotificationChannel.deleteMany({
        where: {
          AND: {
            user: {
              every: {
                id: user?.id,
              },
            },
            type: type,
            connector: connector,
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
