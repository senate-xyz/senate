"use server";

import { db, eq, user } from "@senate/database";
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

export const userEmail = async () => {
  const session = await getServerSession(authOptions());

  if (!session || !session.user || !session.user.name)
    return {
      enabled: false,
      email: "",
      verified: true,
      quorum: false,
      empty: false,
    };
  const userAddress = session.user.name;

  const [u] = await db.select().from(user).where(eq(user.address, userAddress));

  if (!u)
    return {
      enabled: false,
      email: "",
      verified: true,
      quorum: false,
      empty: false,
    };

  return {
    enabled: u.emaildailybulletin ?? false,
    email: u.email ?? "",
    verified: u.verifiedemail,
    quorum: u.emailquorumwarning ?? false,
    empty: u.emptydailybulletin ?? false,
  };
};

export const setBulletin = async (value: boolean) => {
  const session = await getServerSession(authOptions());

  if (!session || !session.user || !session.user.name) return;
  const userAddress = session.user.name;

  await db
    .update(user)
    .set({ emaildailybulletin: value, emailquorumwarning: value })
    .where(eq(user.address, userAddress));

  posthog.capture({
    distinctId: userAddress ?? "unknown",
    event: value ? "email_bulletin_enable" : "email_bulletin_disable",
    properties: {
      props: {
        app: "web-backend",
      },
    },
  });
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

  await db
    .update(user)
    .set({
      email: input,
      emaildailybulletin: true,
      emailquorumwarning: true,
      verifiedemail: false,
      challengecode: challengeCode,
    })
    .where(eq(user.address, userAddress));

  const emailClient = new ServerClient(
    process.env.POSTMARK_TOKEN ?? "Missing Token",
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
      distinctId: userAddress ?? "unknown",
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
    distinctId: userAddress ?? "unknown",
    event: "email_bulletin_enable",
    properties: {
      email: input,
      props: {
        app: "web-backend",
      },
    },
  });

  posthog.capture({
    distinctId: userAddress ?? "unknown",
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

  await db
    .update(user)
    .set({
      challengecode: challengeCode,
      verifiedemail: false,
    })
    .where(eq(user.address, userAddress));

  const emailClient = new ServerClient(
    process.env.POSTMARK_TOKEN ?? "Missing Token",
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

  await db
    .update(user)
    .set({
      emailquorumwarning: value,
    })
    .where(eq(user.address, userAddress));

  posthog.capture({
    distinctId: userAddress ?? "unknown",
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

  await db
    .update(user)
    .set({
      emptydailybulletin: value,
    })
    .where(eq(user.address, userAddress));

  posthog.capture({
    distinctId: userAddress ?? "unknown",
    event: value ? "email_empty_enable" : "email_empty_disable",
    properties: {
      props: {
        app: "web-backend",
      },
    },
  });
};

export const userDiscord = async () => {
  const session = await getServerSession(authOptions());

  if (!session || !session.user || !session.user.name)
    return {
      enabled: false,
      webhook: "",
      reminders: false,
      includeVotes: false,
    };
  const userAddress = session.user.name;

  const [u] = await db.select().from(user).where(eq(user.address, userAddress));

  if (!u)
    return {
      enabled: false,
      webhook: "",
      reminders: false,
      includeVotes: false,
    };

  return {
    enabled: u.discordnotifications ?? false,
    webhook: u.discordwebhook ?? "",
    reminders: u.discordreminders,
    includeVotes: u.discordincludevotes ?? false,
  };
};

export const setDiscord = async (value: boolean) => {
  const session = await getServerSession(authOptions());

  if (!session || !session.user || !session.user.name) return;
  const userAddress = session.user.name;

  await db
    .update(user)
    .set({
      discordnotifications: value,
    })
    .where(eq(user.address, userAddress));

  posthog.capture({
    distinctId: userAddress ?? "unknown",
    event: value ? "discord_enable" : "discord_disable",
    properties: {
      props: {
        app: "web-backend",
      },
    },
  });
};

export const setWebhookAndEnableDiscord = async (input: string) => {
  const session = await getServerSession(authOptions());

  const schema = z.coerce.string().includes("discord");

  try {
    schema.parse(input);
  } catch {
    return;
  }

  if (!session || !session.user || !session.user.name) return;
  const userAddress = session.user.name;

  revalidateTag("discord");

  await db
    .update(user)
    .set({
      discordnotifications: true,
      discordwebhook: input,
    })
    .where(eq(user.address, userAddress));

  posthog.capture({
    distinctId: userAddress ?? "unknown",
    event: "discord_webhook_sets",
    properties: {
      email: input,
      props: {
        app: "web-backend",
      },
    },
  });

  posthog.capture({
    distinctId: userAddress ?? "unknown",
    event: "discord_enable",
    properties: {
      email: input,
      props: {
        app: "web-backend",
      },
    },
  });
};

export const setDiscordReminders = async (value: boolean) => {
  const session = await getServerSession(authOptions());

  if (!session || !session.user || !session.user.name) return;
  const userAddress = session.user.name;

  await db
    .update(user)
    .set({
      discordreminders: value,
    })
    .where(eq(user.address, userAddress));

  posthog.capture({
    distinctId: userAddress ?? "unknown",
    event: value ? "discord_reminders_enable" : "discord_reminders_disable",
    properties: {
      props: {
        app: "web-backend",
      },
    },
  });
};

export const setDiscordIncludeVotes = async (value: boolean) => {
  const session = await getServerSession(authOptions());

  if (!session || !session.user || !session.user.name) return;
  const userAddress = session.user.name;

  await db
    .update(user)
    .set({
      discordincludevotes: value,
    })
    .where(eq(user.address, userAddress));

  posthog.capture({
    distinctId: userAddress ?? "unknown",
    event: value ? "discord_votes_enable" : "discord_votes_disable",
    properties: {
      props: {
        app: "web-backend",
      },
    },
  });
};

export const userTelegram = async () => {
  const session = await getServerSession(authOptions());

  if (!session || !session.user || !session.user.name)
    return {
      userId: "",
      enabled: false,
      reminders: false,
      includeVotes: false,
      chatId: "",
      chatTitle: "",
    };
  const userAddress = session.user.name;

  const [u] = await db.select().from(user).where(eq(user.address, userAddress));

  if (!u)
    return {
      userId: "",
      enabled: false,
      reminders: false,
      includeVotes: false,
      chatId: "",
      chatTitle: "",
    };

  return {
    userId: u.id ?? "",
    enabled: u.telegramnotifications ?? false,
    reminders: u.telegramreminders,
    includeVotes: u.telegramincludevotes ?? false,
    chatId: u.telegramchatid,
    chatTitle: u.telegramchattitle,
  };
};

export const setTelegram = async (value: boolean) => {
  const session = await getServerSession(authOptions());

  if (!session || !session.user || !session.user.name) return;
  const userAddress = session.user.name;

  await db
    .update(user)
    .set({
      telegramnotifications: value,
    })
    .where(eq(user.address, userAddress));

  posthog.capture({
    distinctId: userAddress ?? "unknown",
    event: value ? "telegram_enable" : "telegram_disable",
    properties: {
      props: {
        app: "web-backend",
      },
    },
  });
};

export const setTelegramReminders = async (value: boolean) => {
  const session = await getServerSession(authOptions());

  if (!session || !session.user || !session.user.name) return;
  const userAddress = session.user.name;

  await db
    .update(user)
    .set({
      telegramreminders: value,
    })
    .where(eq(user.address, userAddress));

  posthog.capture({
    distinctId: userAddress ?? "unknown",
    event: value ? "telegram_reminders_enable" : "telegram_reminders_disable",
    properties: {
      props: {
        app: "web-backend",
      },
    },
  });
};

export const setTelegramIncludeVotes = async (value: boolean) => {
  const session = await getServerSession(authOptions());

  if (!session || !session.user || !session.user.name) return;
  const userAddress = session.user.name;

  await db
    .update(user)
    .set({
      telegramincludevotes: value,
    })
    .where(eq(user.address, userAddress));

  posthog.capture({
    distinctId: userAddress ?? "unknown",
    event: value ? "telegram_votes_enable" : "telegram_votes_disable",
    properties: {
      props: {
        app: "web-backend",
      },
    },
  });
};

export const setAaveMagicUser = async (value: boolean) => {
  const session = await getServerSession(authOptions());

  if (!session || !session.user || !session.user.name) return;
  const userAddress = session.user.name;

  await db
    .update(user)
    .set({
      isaaveuser: value ? "ENABLED" : "DISABLED",
    })
    .where(eq(user.address, userAddress));
};

export const setUniswapMagicUser = async (value: boolean) => {
  const session = await getServerSession(authOptions());

  if (!session || !session.user || !session.user.name) return;
  const userAddress = session.user.name;

  await db
    .update(user)
    .set({
      isuniswapuser: value ? "ENABLED" : "DISABLED",
    })
    .where(eq(user.address, userAddress));
};

export const getMagicUser = async () => {
  const session = await getServerSession(authOptions());

  if (!session || !session.user || !session.user.name)
    return { aave: false, uniswap: false };
  const userAddress = session.user.name;

  const [u] = await db.select().from(user).where(eq(user.address, userAddress));

  if (!u) return { aave: false, uniswap: false };

  return {
    aave: u.isaaveuser == "ENABLED" ? true : false,
    uniswap: u.isuniswapuser == "ENABLED" ? true : false,
  };
};
