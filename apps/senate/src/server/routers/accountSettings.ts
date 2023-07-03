import { privateProcedure, router } from "../trpc";
import { z } from "zod";
import { MagicUserState, prisma } from "@senate/database";
import { ServerClient } from "postmark";
import { PostHog } from "posthog-node";

const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
  host: `${process.env.NEXT_PUBLIC_WEB_URL ?? ""}/ingest`,
  disableGeoip: true,
});

export const accountSettingsRouter = router({
  disableAaveUser: privateProcedure.mutation(async ({ ctx }) => {
    const username = ctx.user.name;

    const user = await prisma.user.upsert({
      where: {
        address: String(username),
      },
      create: {
        address: String(username),
        isaaveuser: MagicUserState.DISABLED,
      },
      update: { isaaveuser: MagicUserState.DISABLED },
    });

    return user;
  }),

  disableUniswapUser: privateProcedure.mutation(async ({ ctx }) => {
    const username = ctx.user.name;

    const user = await prisma.user.upsert({
      where: {
        address: String(username),
      },
      create: {
        address: String(username),
        isuniswapuser: MagicUserState.DISABLED,
      },
      update: { isuniswapuser: MagicUserState.DISABLED },
    });

    return user;
  }),

  updateDiscordNotifications: privateProcedure
    .input(
      z.object({
        val: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const username = ctx.user.name;

      const user = await prisma.user.update({
        where: {
          address: String(username),
        },

        data: {
          discordnotifications: input.val,
        },
      });

      posthog.capture({
        distinctId: user.address,
        event: input.val ? "discord_enable" : "discord_disable",
        properties: {
          props: {
            app: "web-backend",
          },
        },
      });

      posthog.capture({
        distinctId: user.address,
        event: user.discordreminders
          ? "discord_reminders_enable"
          : "discord_reminders_disable",
        properties: {
          props: {
            app: "web-backend",
          },
        },
      });

      return user;
    }),

  updateDiscordReminders: privateProcedure
    .input(
      z.object({
        val: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const username = ctx.user.name;

      const user = await prisma.user.update({
        where: {
          address: String(username),
        },

        data: {
          discordreminders: input.val,
        },
      });

      posthog.capture({
        distinctId: user.address,
        event: input.val
          ? "discord_reminders_enable"
          : "discord_reminders_disable",
        properties: {
          props: {
            app: "web-backend",
          },
        },
      });

      return user;
    }),

  setDiscordWebhook: privateProcedure
    .input(
      z.object({
        url: z.string().url().includes("discord.com/api/webhooks/"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const username = ctx.user.name;

      const user = await prisma.user.update({
        where: {
          address: String(username),
        },

        data: {
          discordwebhook: input.url,
        },
      });

      posthog.capture({
        distinctId: user.address,
        event: "discord_webhook_set",
        properties: {
          webhook: input.url,
          props: {
            app: "web-backend",
          },
        },
      });

      return user;
    }),

  updateDiscordNotificationsAndSetWebhook: privateProcedure
    .input(
      z.object({
        val: z.boolean(),
        url: z.nullable(z.string().url().includes("discord.com/api/webhooks/")),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const username = ctx.user.name;

      const user = await prisma.user.update({
        where: {
          address: String(username),
        },

        data: {
          discordnotifications: input.val,
          discordwebhook: input.url ?? "",
        },
      });

      posthog.capture({
        distinctId: user.address,
        event: input.val ? "discord_enable" : "discord_disable",
        properties: {
          props: {
            app: "web-backend",
          },
        },
      });

      if (input.val)
        posthog.capture({
          distinctId: user.address,
          event: "discord_webhook_sets",
          properties: {
            webhook: input.url,
            props: {
              app: "web-backend",
            },
          },
        });

      return user;
    }),

  updateTelegramNotifications: privateProcedure
    .input(
      z.object({
        val: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const username = ctx.user.name;

      const user = await prisma.user.update({
        where: {
          address: String(username),
        },

        data: {
          telegramnotifications: input.val,
        },
      });

      posthog.capture({
        distinctId: user.address,
        event: input.val ? "telegram_enable" : "telegram_disable",
        properties: {
          props: {
            app: "web-backend",
          },
        },
      });

      return user;
    }),

  updateTelegramReminders: privateProcedure
    .input(
      z.object({
        val: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const username = ctx.user.name;

      const user = await prisma.user.update({
        where: {
          address: String(username),
        },

        data: {
          telegramreminders: input.val,
        },
      });

      posthog.capture({
        distinctId: user.address,
        event: input.val
          ? "telegram_reminders_enable"
          : "telegram_reminders_disable",
        properties: {
          props: {
            app: "web-backend",
          },
        },
      });

      return user;
    }),

  setTelegramChatId: privateProcedure
    .input(
      z.object({
        chatid: z.number().int(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const username = ctx.user.name;

      const user = await prisma.user.update({
        where: {
          address: String(username),
        },

        data: {
          telegramchatid: input.chatid.toString(),
        },
      });

      posthog.capture({
        distinctId: user.address,
        event: "telegram_chatid_set",
        properties: {
          chatid: input.chatid,
          props: {
            app: "web-backend",
          },
        },
      });

      return user;
    }),

  getUser: privateProcedure.query(async ({ ctx }) => {
    const username = ctx.user.name;

    const user = await prisma.user.findFirst({
      where: {
        address: {
          equals: String(username),
        },
      },
    });

    return user;
  }),
});
