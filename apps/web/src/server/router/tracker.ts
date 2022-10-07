import { createRouter } from "./context";
import { prisma } from "@senate/database";
import { z } from "zod";

export const trackerRouter = createRouter().query("track", {
  input: z.object({
    address: z.string(),
  }),
  async resolve({ input }) {
    const user = await prisma.user
      .findFirstOrThrow({
        where: {
          address: input.address,
        },
        select: {
          id: true,
        },
      })
      .catch(() => {
        return { id: "0" };
      });

    if (user.id == "0") return;

    const subscriptions = await prisma.subscription.findMany({
      where: { userId: user.id },
      select: {
        daoId: true,
      },
    });

    if (!subscriptions.length) return;

    const userProposalsVoted = await prisma.proposal.findMany({
      where: {
        AND: {
          daoId: {
            in: subscriptions.map((dao: any) => dao.daoId),
          },
          data: {
            path: "$.timeStart",
            lt: Number(new Date()),
          },
          votes: {
            every: {
              userId: user.id,
            },
          },
        },
      },
      include: {
        dao: true,
        votes: {
          where: {
            userId: user.id,
          },
        },
      },
    });

    return userProposalsVoted;
  },
});
