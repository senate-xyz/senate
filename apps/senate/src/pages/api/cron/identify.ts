import { type NextApiRequest, type NextApiResponse } from "next";
import { prisma } from "@senate/database";
import { PostHog } from "posthog-node";

const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
  host: `${process.env.NEXT_PUBLIC_WEB_URL ?? ""}/ingest`,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const daos = await prisma.dao.findMany({
    where: {},
    select: { id: true, name: true },
  });

  const daoMap = daos.reduce<Record<string, string>>((acc, dao) => {
    acc[dao.id] = dao.name;
    return acc;
  }, {});

  const users = await prisma.user.findMany({
    where: {},
    include: {
      _count: true,
      subscriptions: true,
    },
  });

  for (const user of users) {
    posthog.identify({
      distinctId: user.address ?? "visitor",
      properties: {
        email: user.email,
        subscriptions: user.subscriptions.map((s) => daoMap[s.daoid]),
        notifications: user._count.notifications,
        emaildailybulletin: user.emaildailybulletin,
        emptydailybulletin: user.emptydailybulletin,
        discordnotifications: user.discordnotifications,
        telegramnotifications: user.telegramnotifications,
        lastactive: user.lastactive,
        sessioncount: user.sessioncount,
      },
    });
  }

  res.status(200).send("");
}
