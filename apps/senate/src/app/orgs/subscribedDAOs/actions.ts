"use server";

import { db, eq, user, dao, subscription } from "@senate/database";
import { getServerSession } from "next-auth";
import { PostHog } from "posthog-node";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import { revalidateTag } from "next/cache";
import { and } from "@senate/database";

const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
  host: `${process.env.NEXT_PUBLIC_WEB_URL ?? ""}/ingest`,
  disableGeoip: true,
});

export async function unsubscribe(daoId: string) {
  revalidateTag("subscriptions");
  const session = await getServerSession(authOptions());
  const userAddress = session?.user?.name ?? "";

  const [u] = await db.select().from(user).where(eq(user.address, userAddress));
  const [d] = await db.select().from(dao).where(eq(dao.id, daoId));

  await db.delete(subscription).where(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
    and(
      eq(subscription.userid, u.id ?? ""),
      eq(subscription.daoid, d.id ?? ""),
    ),
  );

  posthog.capture({
    distinctId: u.address ?? "unknown",
    event: "unsubscribe",
    properties: {
      dao: d.name,
      props: {
        app: "web-backend",
      },
    },
  });
}
