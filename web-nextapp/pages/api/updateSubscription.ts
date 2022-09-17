import { Prisma, PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  interface Payload {
    userId: number;
    daoId: number;
    subId: number;
    notificationSettings: Prisma.NotificationSettingCreateWithoutSubscriptionInput[];
    notificationChannels: Prisma.NotificationChannelCreateWithoutSubscriptionInput[];
  }

  const payload: Payload = req.body;

  console.log(payload);

  res.send(200);
}
