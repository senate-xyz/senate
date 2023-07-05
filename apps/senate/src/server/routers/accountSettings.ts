import { privateProcedure, router } from "../trpc";
import { z } from "zod";
import { prisma } from "@senate/database";
import { PostHog } from "posthog-node";

const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
  host: `${process.env.NEXT_PUBLIC_WEB_URL ?? ""}/ingest`,
  disableGeoip: true,
});

export const accountSettingsRouter = router({
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
