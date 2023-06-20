import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { prisma } from "@senate/database";
import { verifyMessage } from "viem";
import { PostHog } from "posthog-node";

const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
  host: `${process.env.NEXT_PUBLIC_WEB_URL || ""}/ingest`,
});

export const verifyRouter = router({
  userOfChallenge: publicProcedure
    .input(
      z.object({
        challenge: z.string(),
      })
    )
    .query(async ({ input }) => {
      const user = await prisma.user.findFirst({
        where: {
          challengecode: input.challenge,
        },
      });

      return user;
    }),

  isValidChallenge: publicProcedure
    .input(
      z.object({
        challenge: z.string(),
      })
    )
    .query(async ({ input }) => {
      const user = await prisma.user.findFirst({
        where: {
          challengecode: input.challenge,
        },
      });

      return user ? true : false;
    }),

  discourseSignup: publicProcedure
    .input(
      z.object({
        address: z.string().startsWith("0x"),
        message: z.string(),
        challenge: z.string(),
        signature: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const challengeRegex = /(?<=challenge:\s)[a-zA-Z0-9]+/;
      const challengeMatch = input.message.match(challengeRegex);

      if (!challengeMatch) throw new Error("Challenge does not match");
      if (challengeMatch[0] != input.challenge)
        throw new Error("Challenge does not match");

      const valid = verifyMessage({
        address: input.address as `0x${string}`,
        message: input.message,
        signature: input.signature as `0x${string}`,
      });
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      if (!valid) throw new Error("Signature does not match");

      const addressUser = await prisma.user.findFirst({
        where: {
          address: input.address,
        },
      });

      if (addressUser) {
        const emailUser = await prisma.user.findFirstOrThrow({
          where: {
            challengecode: input.challenge,
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
          event: "subscribe_discourse",
          properties: {
            dao:
              emailUser.isaaveuser == "VERIFICATION"
                ? "Aave"
                : emailUser.isuniswapuser == "VERIFICATION"
                ? "Uniswap"
                : "Unknown",
          },
        });

        await prisma.user.deleteMany({
          where: { id: emailUser.id },
        });
      } else {
        const newUser = await prisma.user.findFirstOrThrow({
          where: {
            challengecode: input.challenge,
          },
        });

        await prisma.user.update({
          where: { id: newUser.id },
          data: {
            address: input.address,
            isaaveuser:
              newUser.isaaveuser == "VERIFICATION"
                ? "ENABLED"
                : newUser.isaaveuser,
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
            event: "signup_discourse",
            properties: {
              dao:
                newUser.isaaveuser == "VERIFICATION"
                  ? "Aave"
                  : newUser.isuniswapuser == "VERIFICATION"
                  ? "Uniswap"
                  : "Unknown",
            },
          });
        }
      }
    }),
});
