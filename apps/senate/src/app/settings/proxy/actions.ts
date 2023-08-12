"use server";

import { db, eq, user, userTovoter, voter, and } from "@senate/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import { PostHog } from "posthog-node";
import { revalidateTag } from "next/cache";
import cuid from "cuid";

const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
  host: `${process.env.NEXT_PUBLIC_WEB_URL ?? ""}/ingest`,
  disableGeoip: true,
});

export const addVoter = async (address: string) => {
  "use server";

  revalidateTag("voters");

  const session = await getServerSession(authOptions());
  if (!session || !session.user || !session.user.name) return;

  const userAddress = session.user.name;

  const [u] = await db.select().from(user).where(eq(user.address, userAddress));

  await db.insert(voter).ignore().values({ id: cuid(), address: address });

  const [newVoter] = await db
    .select()
    .from(voter)
    .where(eq(voter.address, address));

  await db.insert(userTovoter).values({ a: u.id, b: newVoter.id });

  posthog.capture({
    distinctId: userAddress ?? "unknown",
    event: "add_voter",
    properties: {
      voter: address,
      props: {
        app: "web-backend",
      },
    },
  });
};

export const removeVoter = async (address: string) => {
  "use server";

  revalidateTag("voters");

  const session = await getServerSession(authOptions());
  if (!session || !session.user || !session.user.name) return;

  const userAddress = session.user.name;

  const [u] = await db.select().from(user).where(eq(user.address, userAddress));

  const [v] = await db.select().from(voter).where(eq(voter.address, address));

  await db
    .delete(userTovoter)
    .where(and(eq(userTovoter.a, u.id), eq(userTovoter.b, v.id)));

  posthog.capture({
    distinctId: userAddress ?? "unknown",
    event: "remove_voter",
    properties: {
      voter: address,
      props: {
        app: "web-backend",
      },
    },
  });
};

export const getVoters = async () => {
  "use server";

  revalidateTag("voters");

  const session = await getServerSession(authOptions());

  if (!session || !session.user || !session.user.name) return [];
  const userAddress = session.user.name;

  const [u] = await db.select().from(user).where(eq(user.address, userAddress));

  const voters = await db
    .select()
    .from(userTovoter)
    .leftJoin(user, eq(userTovoter.a, user.id))
    .leftJoin(voter, eq(userTovoter.b, voter.id))
    .where(u ? eq(user.id, u.id) : undefined);

  const result: Array<string> = [];

  voters.map((p) => {
    if (p.voter && p.voter.address.length > 0 && p.voter.address != u.address) {
      result.push(p.voter.address);
    }
  });

  return result;
};
