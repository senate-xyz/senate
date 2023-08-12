import { type NextApiRequest, type NextApiResponse } from "next";
import { dao, db } from "@senate/database";
import { PostHog } from "posthog-node";

const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
  host: `${process.env.NEXT_PUBLIC_WEB_URL ?? ""}/ingest`,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const daos = await db.select().from(dao);

  const daoMap = daos.reduce<Record<string, string>>((acc, dao) => {
    acc[dao.id] = dao.name;
    return acc;
  }, {});

  const users = await db.query.user.findMany({
    with: { subscriptions: true, notifications: true },
  });

  for (const u of users) {
    posthog.identify({
      distinctId: u.address ?? "visitor",
      properties: {
        email: u.email,
        subscriptions: u.subscriptions.map((s) => daoMap[s.daoid]),
        notifications: u.notifications.length,
        emaildailybulletin: u.emaildailybulletin,
        emptydailybulletin: u.emptydailybulletin,
        discordnotifications: u.discordnotifications,
        telegramnotifications: u.telegramnotifications,
        lastactive: u.lastactive,
        sessioncount: u.sessioncount,
      },
    });
  }

  res.status(200).send("");
}
