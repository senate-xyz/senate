import { createProtectedRouter } from "./context";
import { prisma } from "@senate/database";
import { z } from "zod";

// Example router with queries that can only be hit if the user requesting is signed in
export const userRouter = createProtectedRouter()
  .query("getSession", {
    resolve({ ctx }) {
      return ctx.session;
    },
  })
  .query("proposals", {
    async resolve({ ctx }) {
      const user = await prisma.user
        .findFirstOrThrow({
          where: {
            address: { equals: String(ctx.session.user.name) },
          },
          select: {
            id: true,
          },
        })
        .catch(() => {
          return { id: "0" };
        });

      const userSubscriptions = await prisma.subscription.findMany({
        where: {
          AND: {
            userId: user?.id,
          },
        },
        select: {
          daoId: true,
        },
      });

      const userProposals = await prisma.proposal.findMany({
        where: {
          daoId: {
            in: userSubscriptions.map((sub) => sub.daoId),
          },
        },
        include: {
          dao: {
            include: {
              handlers: {
                select: {
                  type: true,
                },
              },
            },
          },
          votes: {
            where: {
              userId: user?.id,
            },
            include: {
              user: true,
            },
          },
        },
      });
      return userProposals;
    },
  })
  .query("daos", {
    async resolve({ ctx }) {
      const user = await prisma.user
        .findFirstOrThrow({
          where: {
            address: { equals: String(ctx.session.user.name) },
          },
          select: {
            id: true,
          },
        })
        .catch(() => {
          return { id: "0" };
        });

      const daosList = await prisma.dAO.findMany({
        where: {},
        orderBy: {
          id: "asc",
        },
        distinct: "id",
        include: {
          handlers: true,
          subscriptions: {
            where: {
              userId: { contains: user.id },
            },
          },
        },
      });
      return daosList;
    },
  })
  .mutation("subscribe", {
    input: z.object({
      daoId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const user = await prisma.user
        .findFirstOrThrow({
          where: {
            address: { equals: String(ctx.session.user.name) },
          },
          select: {
            id: true,
          },
        })
        .catch(() => {
          return { id: "0" };
        });

      await prisma.subscription
        .upsert({
          where: {
            userId_daoId: {
              userId: user.id,
              daoId: input.daoId,
            },
          },
          update: {},
          create: {
            userId: user.id,
            daoId: input.daoId,
          },
        })
        .then((res) => {
          return res;
        });
    },
  })
  .mutation("unsubscribe", {
    input: z.object({
      daoId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const user = await prisma.user
        .findFirstOrThrow({
          where: {
            address: { equals: String(ctx.session.user.name) },
          },
          select: {
            id: true,
          },
        })
        .catch(() => {
          return { id: "0" };
        });

      await prisma.subscription
        .delete({
          where: {
            userId_daoId: {
              userId: user.id,
              daoId: input.daoId,
            },
          },
        })
        .then(() => {
          return true;
        });
    },
  });
