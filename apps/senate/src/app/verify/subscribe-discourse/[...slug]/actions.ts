import { db, user, eq, dao, subscription } from "@senate/database";
import cuid from "cuid";
import { PostHog } from "posthog-node";

const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
  host: `${process.env.NEXT_PUBLIC_WEB_URL ?? ""}/ingest`,
});

export const isValidChallenge = async (challenge: string) => {
  "use server";
  const c = await db
    .select({ challenge: user.challengecode })
    .from(user)
    .where(eq(user.challengecode, challenge));

  return c ? true : false;
};

export const verifyUser = async (daoName: string, challenge: string) => {
  "use server";

  const [u] = await db
    .select()
    .from(user)
    .where(eq(user.challengecode, challenge));

  const [d] = await db.select().from(dao).where(eq(dao.name, daoName));

  switch (daoName) {
    case "aave": {
      await db
        .update(user)
        .set({ challengecode: "", isaaveuser: "ENABLED" })
        .where(eq(user.challengecode, challenge));

      break;
    }
    case "uniswap": {
      await db
        .update(user)
        .set({ challengecode: "", isuniswapuser: "ENABLED" })
        .where(eq(user.challengecode, challenge));

      break;
    }
  }

  await db
    .insert(subscription)
    .values({ id: cuid(), userid: u.id, daoid: d.id });

  let dao_name: string;
  switch (daoName) {
    case "aave":
      dao_name = "Aave";
      break;
    case "uniswap":
      dao_name = "Uniswap";
      break;
    default:
      dao_name = "Unknown";
      break;
  }

  posthog.capture({
    distinctId: u.address ?? "unknown",
    event: "subscribe_discourse",
    properties: {
      dao: dao_name,
    },
  });
};
