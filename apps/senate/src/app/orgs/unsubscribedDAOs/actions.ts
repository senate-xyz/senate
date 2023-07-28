"use server";

import { db, eq, user, dao, subscription } from "@senate/database";
import { getServerSession } from "next-auth";
import { PostHog } from "posthog-node";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import { revalidateTag } from "next/cache";
import cuid from "cuid";

const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
  host: `${process.env.NEXT_PUBLIC_WEB_URL ?? ""}/ingest`,
  disableGeoip: true,
});

export async function subscribe(daoId: string) {
  revalidateTag("subscriptions");
  const session = await getServerSession(authOptions());
  const userAddress = session?.user?.name ?? "";

  const [u] = await db.select().from(user).where(eq(user.address, userAddress));
  const [d] = await db.select().from(dao).where(eq(dao.id, daoId));

  await db
    .insert(subscription)
    .values({ id: cuid(), daoid: d.id, userid: u.id })
    .catch();

  posthog.capture({
    distinctId: u.address ?? "unknown",
    event: "subscribe",
    properties: {
      dao: d.name,
      props: {
        app: "web-backend",
      },
    },
  });
}
