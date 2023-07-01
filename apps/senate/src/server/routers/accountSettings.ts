import { privateProcedure, publicProcedure, router } from "../trpc";
import { z } from "zod";
import { MagicUserState, prisma } from "@senate/database";
import { ServerClient } from "postmark";
import { PostHog } from "posthog-node";

const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
  host: `${process.env.NEXT_PUBLIC_WEB_URL ?? ""}/ingest`,
  disableGeoip: true,
});

export const accountSettingsRouter = router({
  setEmailAndEnableBulletin: privateProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const username = ctx.user.name;

      const challengeCode = Math.random().toString(36).substring(2);

      const user = await prisma.user.update({
        where: {
          address: String(username),
        },
        data: {
          email: input.email,
          emaildailybulletin: true,
          emailquorumwarning: true,
          verifiedemail: false,
          challengecode: challengeCode,
        },
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

      posthog.capture({
        distinctId: user.address,
        event: "email_bulletin_enable",
        properties: {
          email: input.email,
          props: {
            app: "web-backend",
          },
        },
      });

      posthog.capture({
        distinctId: user.address,
        event: "email_update",
        properties: {
          email: input.email,
          props: {
            app: "web-backend",
          },
        },
      });

      return user;
    }),

  setEmail: privateProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const emailClient = new ServerClient(
        process.env.POSTMARK_TOKEN ?? "Missing Token"
      );
      const username = ctx.user.name;

      // const existingTempUser = await prisma.user.findFirst({
      //   where: {
      //     email: input.email,
      //   },
      //   select: {
      //     isaaveuser: true,
      //     isuniswapuser: true,
      //     subscriptions: true,
      //   },
      // });

      // if (existingTempUser) {
      //   await prisma.user.deleteMany({
      //     where: { email: input.email },
      //   });
      // }

      const challengeCode = Math.random().toString(36).substring(2);

      const user = await prisma.user.update({
        where: {
          address: String(username),
        },
        data: {
          email: input.email,
          verifiedemail: false,
          challengecode: challengeCode,
          // isaaveuser: existingTempUser?.isaaveuser,
          // isuniswapuser: existingTempUser?.isuniswapuser,
        },
      });

      // if (existingTempUser)
      //   for (const sub of existingTempUser.subscriptions) {
      //     await prisma.subscription.createMany({
      //       data: {
      //         userid: user.id,
      //         daoid: String(sub.daoid),
      //       },
      //       skipDuplicates: true,
      //     });
      //   }

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

      posthog.capture({
        distinctId: user.address,
        event: "email_update",
        properties: {
          email: input.email,
          props: {
            app: "web-backend",
          },
        },
      });

      return user;
    }),

  resendVerification: privateProcedure.mutation(async ({ ctx }) => {
    const emailClient = new ServerClient(
      process.env.POSTMARK_TOKEN ?? "Missing Token"
    );

    const username = ctx.user.name;
    const challengeCode = Math.random().toString(36).substring(2);

    const user = await prisma.user.update({
      where: {
        address: String(username),
      },
      data: { challengecode: challengeCode, verifiedemail: false },
    });

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

    return user;
  }),

  updateDailyEmails: privateProcedure
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
          emaildailybulletin: input.val,
          emailquorumwarning: input.val,
        },
      });

      posthog.capture({
        distinctId: user.address,
        event: input.val ? "email_bulletin_enable" : "email_bulletin_disable",
        properties: {
          props: {
            app: "web-backend",
          },
        },
      });

      return user;
    }),

  updateEmptyEmails: privateProcedure
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
        data: { emptydailybulletin: input.val },
      });

      posthog.capture({
        distinctId: user.address,
        event: input.val
          ? "email_bulletin_empty_enable"
          : "email_bulletin_empty_disable",
        properties: {
          props: {
            app: "web-backend",
          },
        },
      });

      return user;
    }),

  updateQuorumEmails: privateProcedure
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
        data: { emailquorumwarning: input.val },
      });

      posthog.capture({
        distinctId: user.address,
        event: input.val ? "email_quorum_enable" : "email_quorum_disable",
        properties: {
          props: {
            app: "web-backend",
          },
        },
      });

      return user;
    }),

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

  voters: privateProcedure.query(async ({ ctx }) => {
    const username = ctx.user.name;

    const user = await prisma.user.findFirst({
      where: {
        address: {
          equals: String(username),
        },
      },
      include: {
        voters: true,
      },
    });

    const filteredVoters = user?.voters.filter(
      (voter) => voter.address !== username
    );

    return filteredVoters ?? [];
  }),

  addVoter: privateProcedure
    .input(
      z.object({
        address: z.string().startsWith("0x").length(42),
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

      const result = await prisma.user.update({
        where: {
          id: user?.id,
        },
        data: {
          voters: {
            connectOrCreate: {
              where: {
                address: input.address,
              },
              create: {
                address: input.address,
              },
            },
          },
        },
      });

      posthog.capture({
        distinctId: user.address,
        event: "add_voter",
        properties: {
          voter: input.address,
          props: {
            app: "web-backend",
          },
        },
      });

      return result;
    }),

  removeVoter: privateProcedure
    .input(
      z.object({
        address: z.string().startsWith("0x").length(42),
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

      const result = await prisma.user.update({
        where: {
          id: user?.id,
        },
        data: {
          voters: {
            disconnect: {
              address: input.address,
            },
          },
        },
      });

      posthog.capture({
        distinctId: user.address,
        event: "remove_voter",
        properties: {
          voter: input.address,
          props: {
            app: "web-backend",
          },
        },
      });

      return result;
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

  deleteUser: privateProcedure.mutation(async ({ ctx }) => {
    const username = ctx.user.name;

    const user = await prisma.user.findFirst({
      where: {
        address: {
          equals: String(username),
        },
      },
    });
    await prisma.user.delete({
      where: { id: user?.id },
    });
  }),
});
