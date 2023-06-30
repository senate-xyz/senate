import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { type JsonArray, prisma, type Vote } from "@senate/database";

export const publicRouter = router({
  featureFlags: publicProcedure.query(() => {
    const flags = process.env.NEXT_PUBLIC_FEATURE_FLAGS;

    const split = flags?.split(" ") ?? [];

    return split;
  }),

  proposal: publicProcedure
    .input(
      z.object({
        url: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const user = await prisma.user.findFirst({
        where: {
          address: ctx.user?.name ?? "",
        },
        include: {
          voters: true,
        },
      });

      const proposal = await prisma.proposal.findFirstOrThrow({
        where: {
          url: input.url,
        },
        include: {
          dao: true,
          daohandler: true,
          votes: {
            where: {
              voteraddress: {
                in: user?.voters.map((voter) => voter.address),
              },
            },
          },
        },
      });

      let highestScore = 0;
      let highestScoreIndex = 0;
      let highestScoreChoice = "";

      if (
        proposal.scores &&
        typeof proposal.scores === "object" &&
        Array.isArray(proposal?.scores) &&
        proposal.choices &&
        typeof proposal.choices === "object" &&
        Array.isArray(proposal?.choices)
      ) {
        const scores = proposal.scores as JsonArray;

        for (const score of scores) {
          if (Number(score) > highestScore) {
            highestScore = Number(score);
            highestScoreIndex++;
          }
        }

        highestScoreChoice = String(proposal.choices[highestScoreIndex - 1]);
      }

      const result = {
        daoName: proposal.dao.name,
        onchain: proposal.daohandler.type == "SNAPSHOT" ? false : true,
        daoPicture: proposal.dao.picture,
        proposalTitle: proposal.name,
        proposalLink: proposal.url,
        timeEnd: proposal.timeend,
        highestScoreChoice: highestScoreChoice,
        highestScore: highestScore,
        scoresTotal: proposal.scorestotal,
        passedQuorum: Number(proposal.quorum) < Number(proposal.scorestotal),
        voted: user
          ? String(proposal.votes.map((vote: Vote) => vote.choice).length > 0)
          : "not-connected",
      };

      return result;
    }),
});
