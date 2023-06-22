import { privateProcedure, router } from "../trpc";
import { z } from "zod";
import { prisma } from "@senate/database";
import { PostHog } from "posthog-node";

const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
  host: `${process.env.NEXT_PUBLIC_WEB_URL ?? ""}/ingest`,
});

export const subscriptionsRouter = router({
  subscribe: privateProcedure
    .input(
      z.object({
        daoId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const username = ctx.user.name;

      const user = await prisma.user.findFirstOrThrow({
        where: {
          address: {
            equals: String(username),
          },
        },
      });

      const result = await prisma.subscription.upsert({
        where: {
          userid_daoid: {
            userid: user.id,
            daoid: input.daoId,
          },
        },
        update: {
          userid: user.id,
          daoid: input.daoId,
        },
        create: {
          userid: user.id,
          daoid: input.daoId,
        },
      });

      const dao = await prisma.dao.findFirst({
        where: { id: input.daoId },
      });

      posthog.capture({
        distinctId: user.address,
        event: "subscribe",
        properties: {
          dao: dao?.name,
        },
      });

      return result;
    }),

  unsubscribe: privateProcedure
    .input(
      z.object({
        daoId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const username = ctx.user.name;

      const user = await prisma.user.findFirstOrThrow({
        where: {
          address: {
            equals: String(username),
          },
        },
      });

      const result = await prisma.subscription.delete({
        where: {
          userid_daoid: {
            userid: user?.id,
            daoid: input.daoId,
          },
        },
      });

      const dao = await prisma.dao.findFirst({
        where: { id: input.daoId },
      });

      posthog.capture({
        distinctId: user.address,
        event: "unsubscribe",
        properties: {
          dao: dao?.name,
        },
      });

      return result;
    }),
});
