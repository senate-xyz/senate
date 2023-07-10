"use server";

import { prisma } from "@senate/database";
import { verifyMessage } from "viem";
import { PostHog } from "posthog-node";

const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
  host: `${process.env.NEXT_PUBLIC_WEB_URL ?? ""}/ingest`,
  disableGeoip: true,
});

export const discourseSignup = async (
  address: string,
  message: string,
  challenge: string,
  signature: string
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
  const addressUser = await prisma.user.findFirst({
    where: {
      address: address,
    },
  });
  if (addressUser) {
    const emailUser = await prisma.user.findFirstOrThrow({
      where: {
        challengecode: challenge,
      },
    });
    if (emailUser.isaaveuser == "VERIFICATION") {
      const aave = await prisma.dao.findFirstOrThrow({
        where: {
          name: {
            equals: "Aave",
          },
        },
      });
      await prisma.subscription.createMany({
        data: {
          userid: addressUser.id,
          daoid: aave.id,
        },
        skipDuplicates: true,
      });
    }
    if (emailUser.isuniswapuser == "VERIFICATION") {
      const uniswap = await prisma.dao.findFirstOrThrow({
        where: {
          name: {
            equals: "Uniswap",
          },
        },
      });
      await prisma.subscription.createMany({
        data: {
          userid: addressUser.id,
          daoid: uniswap.id,
        },
        skipDuplicates: true,
      });
    }
    await prisma.user.update({
      where: { id: addressUser.id },
      data: {
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
      },
    });
    posthog.capture({
      distinctId: addressUser.address,
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
    await prisma.user.deleteMany({
      where: { id: emailUser.id },
    });
  } else {
    const newUser = await prisma.user.findFirstOrThrow({
      where: {
        challengecode: challenge,
      },
    });
    await prisma.user.update({
      where: { id: newUser.id },
      data: {
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
      },
    });
    if (newUser.isaaveuser == "VERIFICATION") {
      const aave = await prisma.dao.findFirstOrThrow({
        where: {
          name: { equals: "Aave" },
        },
      });
      await prisma.subscription.createMany({
        data: {
          userid: newUser.id,
          daoid: aave.id,
        },
        skipDuplicates: true,
      });
    }
    if (newUser.isuniswapuser == "VERIFICATION") {
      const uniswap = await prisma.dao.findFirstOrThrow({
        where: {
          name: { equals: "Uniswap" },
        },
      });
      await prisma.subscription.createMany({
        data: {
          userid: newUser.id,
          daoid: uniswap.id,
        },
        skipDuplicates: true,
      });
      posthog.capture({
        distinctId: newUser.address,
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
  }
};
