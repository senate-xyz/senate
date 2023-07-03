"use server";

import { prisma } from "@senate/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import { PostHog } from "posthog-node";
import { ServerClient } from "postmark";
import { revalidateTag } from "next/cache";
import { z } from "zod";

const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
  host: `${process.env.NEXT_PUBLIC_WEB_URL ?? ""}/ingest`,
  disableGeoip: true,
});

export const bulletinEnabled = async () => {
  const session = await getServerSession(authOptions());

  if (!session || !session.user || !session.user.name) return false;
  const userAddress = session.user.name;

  const user = await prisma.user.findFirstOrThrow({
    where: {
      address: {
        equals: userAddress,
      },
    },
    select: { emaildailybulletin: true },
  });

  return user.emaildailybulletin;
};

export const setBulletin = async (value: boolean) => {
  const session = await getServerSession(authOptions());

  if (!session || !session.user || !session.user.name) return;
  const userAddress = session.user.name;

  const user = await prisma.user.update({
    where: {
      address: userAddress,
    },
    data: {
      emaildailybulletin: value,
      emailquorumwarning: value,
    },
  });

  posthog.capture({
    distinctId: user.address,
    event: value ? "email_bulletin_enable" : "email_bulletin_disable",
    properties: {
      props: {
        app: "web-backend",
      },
    },
  });
};

export const userEmail = async () => {
  const session = await getServerSession(authOptions());

  if (!session || !session.user || !session.user.name)
    return { email: "", verified: true, quorum: false, empty: false };
  const userAddress = session.user.name;

  const user = await prisma.user.findFirstOrThrow({
    where: {
      address: {
        equals: userAddress,
      },
    },
    select: {
      email: true,
      verifiedemail: true,
      emailquorumwarning: true,
      emptydailybulletin: true,
    },
  });

  return {
    email: user.email ?? "",
    verified: user.verifiedemail,
    quorum: user.emailquorumwarning ?? false,
    empty: user.emptydailybulletin ?? false,
  };
};

export const setEmailAndEnableBulletin = async (input: string) => {
  const session = await getServerSession(authOptions());

  const schema = z.coerce.string().email();

  try {
    schema.parse(input);
  } catch {
    return;
  }

  if (!session || !session.user || !session.user.name) return;
  const userAddress = session.user.name;

  const challengeCode = Math.random().toString(36).substring(2);

  revalidateTag("email");

  const user = await prisma.user.update({
    where: {
      address: userAddress,
    },
    data: {
      email: input,
      emaildailybulletin: true,
      emailquorumwarning: true,
      verifiedemail: false,
      challengecode: challengeCode,
    },
  });

  const emailClient = new ServerClient(
    process.env.POSTMARK_TOKEN ?? "Missing Token"
  );

  try {
    await emailClient.sendEmailWithTemplate({
      From: "info@senatelabs.xyz",
      To: String(user.email),
      TemplateAlias: "senate-confirm",
      TemplateModel: {
        todaysDate: new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        url: `${
          process.env.NEXT_PUBLIC_WEB_URL ?? ""
        }/verify/verify-email/${challengeCode}`,
      },
    });
  } catch {
    posthog.capture({
      distinctId: user.address,
      event: "email_update_error",
      properties: {
        email: input,
        props: {
          app: "web-backend",
        },
      },
    });
  }

  posthog.capture({
    distinctId: user.address,
    event: "email_bulletin_enable",
    properties: {
      email: input,
      props: {
        app: "web-backend",
      },
    },
  });

  posthog.capture({
    distinctId: user.address,
    event: "email_update",
    properties: {
      email: input,
      props: {
        app: "web-backend",
      },
    },
  });
};

export const resendVerification = async () => {
  const session = await getServerSession(authOptions());

  if (!session || !session.user || !session.user.name) return;
  const userAddress = session.user.name;

  const challengeCode = Math.random().toString(36).substring(2);

  const user = await prisma.user.update({
    where: {
      address: userAddress,
    },
    data: { challengecode: challengeCode, verifiedemail: false },
  });

  const emailClient = new ServerClient(
    process.env.POSTMARK_TOKEN ?? "Missing Token"
  );
  await emailClient.sendEmailWithTemplate({
    From: "info@senatelabs.xyz",
    To: String(user.email),
    TemplateAlias: "senate-confirm",
    TemplateModel: {
      todaysDate: new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      url: `${
        process.env.NEXT_PUBLIC_WEB_URL ?? ""
      }/verify/verify-email/${challengeCode}`,
    },
  });
};

export const setQuorumAlerts = async (value: boolean) => {
  const session = await getServerSession(authOptions());

  if (!session || !session.user || !session.user.name) return;
  const userAddress = session.user.name;

  const user = await prisma.user.update({
    where: {
      address: userAddress,
    },
    data: { emailquorumwarning: value },
  });

  posthog.capture({
    distinctId: user.address,
    event: value ? "email_quorum_enable" : "email_quorum_disable",
    properties: {
      props: {
        app: "web-backend",
      },
    },
  });
};

export const setEmptyEmails = async (value: boolean) => {
  const session = await getServerSession(authOptions());

  if (!session || !session.user || !session.user.name) return;
  const userAddress = session.user.name;

  const user = await prisma.user.update({
    where: {
      address: userAddress,
    },
    data: { emptydailybulletin: value },
  });

  posthog.capture({
    distinctId: user.address,
    event: value ? "email_empty_enable" : "email_empty_disable",
    properties: {
      props: {
        app: "web-backend",
      },
    },
  });
};
