import { createProtectedRouter } from "./context";
import { prisma } from "@senate/database";

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
            address: ctx.session.user.id,
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
            in: userSubscriptions.map((sub: any) => sub.daoId),
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
              userId: ctx.session.user.id,
            },
          },
        },
      });
      return daosList;
    },
  });
