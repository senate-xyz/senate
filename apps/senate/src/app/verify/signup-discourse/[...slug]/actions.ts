"use server";

import { verifyMessage } from "viem";
import { PostHog } from "posthog-node";
import { redirect } from "next/navigation";
import {
  dao,
  db,
  eq,
  subscription,
  user,
  userTovoter,
  voter,
} from "@senate/database";
import cuid from "cuid";

const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
  host: `${process.env.NEXT_PUBLIC_WEB_URL ?? ""}/ingest`,
  disableGeoip: true,
});

export const isValidChallenge = async (challenge: string) => {
  "use server";
  const c = await db
    .select({ challenge: user.challengecode })
    .from(user)
    .where(eq(user.challengecode, challenge));

  return c ? true : false;
};

export const discourseSignup = async (
  address: string,
  message: string,
  challenge: string,
  signature: string,
) => {
  const challengeRegex = /(?<=challenge:\s)[a-zA-Z0-9]+/;
  const challengeMatch = message.match(challengeRegex);
  if (!challengeMatch) throw new Error("Challenge does not match");

  if (challengeMatch[0] != challenge)
    throw new Error("Challenge does not match");
  const valid = await verifyMessage({
    address: address as `0x${string}`,
    message: message,
    signature: signature as `0x${string}`,
  });
  if (!valid) throw new Error("Signature does not match");

  const addressUser = await db.query.user.findFirst({
    where: eq(user.address, address),
  });

  if (addressUser) {
    const emailUser = await db.query.user.findFirst({
      where: eq(user.challengecode, challenge),
    });

    if (!emailUser) return;

    await db.delete(user).where(eq(user.id, emailUser.id));

    if (emailUser.isaaveuser == "VERIFICATION") {
      const [aave] = await db.select().from(dao).where(eq(dao.name, "Aave"));

      await db
        .insert(subscription)
        .ignore()
        .values({ id: cuid(), userid: addressUser.id, daoid: aave.id });
    }
    if (emailUser.isuniswapuser == "VERIFICATION") {
      const [uniswap] = await db
        .select()
        .from(dao)
        .where(eq(dao.name, "Uniswap"));

      await db
        .insert(subscription)
        .ignore()
        .values({ id: cuid(), userid: addressUser.id, daoid: uniswap.id });
    }

    await db
      .update(user)
      .set({
        isaaveuser:
          emailUser.isaaveuser == "VERIFICATION"
            ? "ENABLED"
            : addressUser.isaaveuser,
        isuniswapuser:
          emailUser.isuniswapuser == "VERIFICATION"
            ? "ENABLED"
            : addressUser.isuniswapuser,
        emaildailybulletin: true,
        emailquorumwarning: true,
        challengecode: "",
        email: emailUser.email,
        verifiedaddress: true,
        verifiedemail: true,
        acceptedterms: true,
        acceptedtermstimestamp: new Date(),
      })
      .where(eq(user.id, addressUser.id));

    posthog.capture({
      distinctId: addressUser.address ?? "unknown",
      event: "discourse_subscribe",
      properties: {
        dao:
          emailUser.isaaveuser == "VERIFICATION"
            ? "Aave"
            : emailUser.isuniswapuser == "VERIFICATION"
            ? "Uniswap"
            : "Unknown",
        props: {
          app: "web-backend",
        },
      },
    });
  } else {
    const [newUser] = await db
      .select()
      .from(user)
      .where(eq(user.challengecode, challenge));

    await db
      .update(user)
      .set({
        address: address,
        isaaveuser:
          newUser.isaaveuser == "VERIFICATION" ? "ENABLED" : newUser.isaaveuser,
        isuniswapuser:
          newUser.isuniswapuser == "VERIFICATION"
            ? "ENABLED"
            : newUser.isuniswapuser,
        emaildailybulletin: true,
        emailquorumwarning: true,
        challengecode: "",
        verifiedaddress: true,
        verifiedemail: true,
      })
      .where(eq(user.id, newUser.id));

    await db.insert(voter).ignore().values({ id: cuid(), address: address });

    const [newVoter] = await db
      .select()
      .from(voter)
      .where(eq(voter.address, address));

    await db.insert(userTovoter).values({ a: newUser.id, b: newVoter.id });

    if (newUser.isaaveuser == "VERIFICATION") {
      const [aave] = await db.select().from(dao).where(eq(dao.name, "Aave"));

      await db
        .insert(subscription)
        .ignore()
        .values({ id: cuid(), userid: newUser.id, daoid: aave.id });
    }
    if (newUser.isuniswapuser == "VERIFICATION") {
      const [uniswap] = await db
        .select()
        .from(dao)
        .where(eq(dao.name, "Uniswap"));

      await db
        .insert(subscription)
        .ignore()
        .values({ id: cuid(), userid: newUser.id, daoid: uniswap.id });
    }
    posthog.capture({
      distinctId: newUser.address ?? "unknown",
      event: "discourse_signup",
      properties: {
        dao:
          newUser.isaaveuser == "VERIFICATION"
            ? "Aave"
            : newUser.isuniswapuser == "VERIFICATION"
            ? "Uniswap"
            : "Unknown",
        props: {
          app: "web-backend",
        },
      },
    });
  }
  redirect("/orgs?connect");
};
