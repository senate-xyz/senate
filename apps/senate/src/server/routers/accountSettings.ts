import { privateProcedure, router } from '../trpc'
import { z } from 'zod'
import { MagicUserState, prisma } from '@senate/database'
import { ServerClient } from 'postmark'
import { PostHog } from 'posthog-node'

const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || '', {
    host: `${process.env.NEXT_PUBLIC_WEB_URL}/ingest`
})

export const accountSettingsRouter = router({
    setEmailAndEnableBulletin: privateProcedure
        .input(
            z.object({
                email: z.string().email()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const username = await ctx.user.name

            const challengeCode = Math.random().toString(36).substring(2)

            const user = await prisma.user.upsert({
                where: {
                    address: String(username)
                },
                create: {
                    address: String(username),
                    email: input.email,
                    emaildailybulletin: true,
                    emailquorumwarning: true,
                    verifiedemail: false,
                    challengecode: challengeCode,
                    voters: {
                        connectOrCreate: {
                            where: {
                                address: String(username)
                            },
                            create: {
                                address: String(username)
                            }
                        }
                    }
                },
                update: {
                    email: input.email,
                    emaildailybulletin: true,
                    emailquorumwarning: true,
                    verifiedemail: false,
                    challengecode: challengeCode
                }
            })

            const emailClient = new ServerClient(
                process.env.POSTMARK_TOKEN ?? 'Missing Token'
            )

            await emailClient.sendEmailWithTemplate({
                From: 'info@senatelabs.xyz',
                To: String(user.email),
                TemplateAlias: 'senate-confirm',
                TemplateModel: {
                    todaysDate: new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }),
                    url: `${process.env.NEXT_PUBLIC_WEB_URL}/verify/verify-email/${challengeCode}`
                }
            })

            posthog.capture({
                distinctId: user.address,
                event: 'enable_bulletin',
                properties: {
                    email: input.email
                }
            })

            posthog.capture({
                distinctId: user.address,
                event: 'update_email',
                properties: {
                    email: input.email
                }
            })

            return user
        }),

    setEmail: privateProcedure
        .input(
            z.object({
                email: z.string().email()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const emailClient = new ServerClient(
                process.env.POSTMARK_TOKEN ?? 'Missing Token'
            )
            const username = await ctx.user.name

            const existingTempUser = await prisma.user.findFirst({
                where: {
                    email: input.email
                },
                select: {
                    isaaveuser: true,
                    isuniswapuser: true,
                    subscriptions: true
                }
            })

            if (existingTempUser) {
                await prisma.user.deleteMany({
                    where: { email: input.email }
                })
            }

            const challengeCode = Math.random().toString(36).substring(2)

            const user = await prisma.user.upsert({
                where: {
                    address: String(username)
                },
                create: {
                    address: String(username),
                    email: input.email,
                    verifiedemail: false,
                    challengecode: challengeCode,
                    isaaveuser: existingTempUser?.isaaveuser,
                    isuniswapuser: existingTempUser?.isuniswapuser,
                    voters: {
                        connectOrCreate: {
                            where: {
                                address: String(username)
                            },
                            create: {
                                address: String(username)
                            }
                        }
                    }
                },
                update: {
                    email: input.email,
                    verifiedemail: false,
                    challengecode: challengeCode,
                    isaaveuser: existingTempUser?.isaaveuser,
                    isuniswapuser: existingTempUser?.isuniswapuser
                }
            })

            if (existingTempUser)
                for (const sub of existingTempUser.subscriptions) {
                    await prisma.subscription.createMany({
                        data: {
                            userid: user.id,
                            daoid: String(sub.daoid)
                        },
                        skipDuplicates: true
                    })
                }

            await emailClient.sendEmailWithTemplate({
                From: 'info@senatelabs.xyz',
                To: String(user.email),
                TemplateAlias: 'senate-confirm',
                TemplateModel: {
                    todaysDate: new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }),
                    url: `${process.env.NEXT_PUBLIC_WEB_URL}/verify/verify-email/${challengeCode}`
                }
            })

            posthog.capture({
                distinctId: user.address,
                event: 'update_email',
                properties: {
                    email: input.email
                }
            })

            return user
        }),

    resendVerification: privateProcedure.mutation(async ({ ctx }) => {
        const emailClient = new ServerClient(
            process.env.POSTMARK_TOKEN ?? 'Missing Token'
        )

        const username = await ctx.user.name
        const challengeCode = Math.random().toString(36).substring(2)

        const user = await prisma.user.update({
            where: {
                address: String(username)
            },
            data: { challengecode: challengeCode, verifiedemail: false }
        })

        emailClient.sendEmailWithTemplate({
            From: 'info@senatelabs.xyz',
            To: String(user.email),
            TemplateAlias: 'senate-confirm',
            TemplateModel: {
                todaysDate: new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                url: `${process.env.NEXT_PUBLIC_WEB_URL}/verify/verify-email/${challengeCode}`
            }
        })

        return user
    }),

    updateDailyEmails: privateProcedure
        .input(
            z.object({
                val: z.boolean()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const username = await ctx.user.name

            const user = await prisma.user.update({
                where: {
                    address: String(username)
                },
                data: {
                    emaildailybulletin: input.val,
                    emailquorumwarning: input.val
                }
            })

            posthog.capture({
                distinctId: user.address,
                event: input.val ? 'enable_bulletin' : 'disable_bulletin'
            })

            return user
        }),

    updateEmptyEmails: privateProcedure
        .input(
            z.object({
                val: z.boolean()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const username = await ctx.user.name

            const user = await prisma.user.update({
                where: {
                    address: String(username)
                },
                data: { emptydailybulletin: input.val }
            })

            posthog.capture({
                distinctId: user.address,
                event: input.val
                    ? 'enable_empty_bulletin'
                    : 'disable_empty_bulletin'
            })

            return user
        }),

    updateQuorumEmails: privateProcedure
        .input(
            z.object({
                val: z.boolean()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const username = await ctx.user.name

            const user = await prisma.user.update({
                where: {
                    address: String(username)
                },
                data: { emailquorumwarning: input.val }
            })

            posthog.capture({
                distinctId: user.address,
                event: input.val
                    ? 'enable_quorum_emails'
                    : 'disable_quorum_email'
            })

            return user
        }),

    disableAaveUser: privateProcedure.mutation(async ({ ctx }) => {
        const username = await ctx.user.name

        const user = await prisma.user.upsert({
            where: {
                address: String(username)
            },
            create: {
                address: String(username),
                isaaveuser: MagicUserState.DISABLED
            },
            update: { isaaveuser: MagicUserState.DISABLED }
        })

        return user
    }),

    disableUniswapUser: privateProcedure.mutation(async ({ ctx }) => {
        const username = await ctx.user.name

        const user = await prisma.user.upsert({
            where: {
                address: String(username)
            },
            create: {
                address: String(username),
                isuniswapuser: MagicUserState.DISABLED
            },
            update: { isuniswapuser: MagicUserState.DISABLED }
        })

        return user
    }),

    updateDiscordNotifications: privateProcedure
        .input(
            z.object({
                val: z.boolean()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const username = await ctx.user.name

            const user = await prisma.user.update({
                where: {
                    address: String(username)
                },

                data: {
                    discordnotifications: input.val
                }
            })

            posthog.capture({
                distinctId: user.address,
                event: input.val ? 'enable_discord' : 'disable_discord'
            })

            return user
        }),

    updateDiscordReminders: privateProcedure
        .input(
            z.object({
                val: z.boolean()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const username = await ctx.user.name

            const user = await prisma.user.update({
                where: {
                    address: String(username)
                },

                data: {
                    discordreminders: input.val
                }
            })

            posthog.capture({
                distinctId: user.address,
                event: input.val
                    ? 'enable_discord_reminders'
                    : 'disable_discord_reminders'
            })

            return user
        }),

    setDiscordWebhook: privateProcedure
        .input(
            z.object({
                url: z.string().url().includes('discord.com/api/webhooks/')
            })
        )
        .mutation(async ({ input, ctx }) => {
            const username = await ctx.user.name

            const user = await prisma.user.update({
                where: {
                    address: String(username)
                },

                data: {
                    discordwebhook: input.url
                }
            })

            posthog.capture({
                distinctId: user.address,
                event: 'set_discord_webhook',
                properties: {
                    webhook: input.url
                }
            })

            return user
        }),

    updateTelegramNotifications: privateProcedure
        .input(
            z.object({
                val: z.boolean()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const username = await ctx.user.name

            const user = await prisma.user.update({
                where: {
                    address: String(username)
                },

                data: {
                    telegramnotifications: input.val
                }
            })

            posthog.capture({
                distinctId: user.address,
                event: input.val ? 'enable_telegram' : 'disable_telegram'
            })

            return user
        }),

    updateTelegramReminders: privateProcedure
        .input(
            z.object({
                val: z.boolean()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const username = await ctx.user.name

            const user = await prisma.user.update({
                where: {
                    address: String(username)
                },

                data: {
                    telegramreminders: input.val
                }
            })

            posthog.capture({
                distinctId: user.address,
                event: input.val
                    ? 'enable_telegram_reminders'
                    : 'disable_telegram_reminders'
            })

            return user
        }),

    setTelegramChatId: privateProcedure
        .input(
            z.object({
                chatid: z.number().int()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const username = await ctx.user.name

            const user = await prisma.user.update({
                where: {
                    address: String(username)
                },

                data: {
                    telegramchatid: input.chatid.toString()
                }
            })

            posthog.capture({
                distinctId: user.address,
                event: 'set_telegram_chatid',
                properties: {
                    chatid: input.chatid
                }
            })

            return user
        }),

    getAcceptedTerms: privateProcedure.query(async ({ ctx }) => {
        const username = await ctx.user.name

        const user = await prisma.user.findFirst({
            where: {
                address: {
                    equals: String(username)
                }
            }
        })

        return user?.acceptedterms
    }),

    getAcceptedTermsTimestamp: privateProcedure.query(async ({ ctx }) => {
        const username = await ctx.user.name

        const user = await prisma.user.findFirst({
            where: {
                address: {
                    equals: String(username)
                }
            }
        })

        return user?.acceptedtermstimestamp
    }),

    voters: privateProcedure.query(async ({ ctx }) => {
        const username = await ctx.user.name

        const user = await prisma.user.findFirst({
            where: {
                address: {
                    equals: String(username)
                }
            },
            include: {
                voters: true
            }
        })

        const filteredVoters = user?.voters.filter(
            (voter) => voter.address !== username
        )

        return filteredVoters ?? []
    }),

    addVoter: privateProcedure
        .input(
            z.object({
                address: z.string().startsWith('0x').length(42)
            })
        )
        .mutation(async ({ input, ctx }) => {
            const username = await ctx.user.name

            const user = await prisma.user.findFirstOrThrow({
                where: {
                    address: {
                        equals: String(username)
                    }
                }
            })

            const result = await prisma.user.update({
                where: {
                    id: user?.id
                },
                data: {
                    voters: {
                        connectOrCreate: {
                            where: {
                                address: input.address
                            },
                            create: {
                                address: input.address
                            }
                        }
                    }
                }
            })

            posthog.capture({
                distinctId: user.address,
                event: 'add_proxy',
                properties: {
                    proxy: input.address
                }
            })

            return result
        }),

    removeVoter: privateProcedure
        .input(
            z.object({
                address: z.string().startsWith('0x').length(42)
            })
        )
        .mutation(async ({ input, ctx }) => {
            const username = await ctx.user.name

            const user = await prisma.user.findFirstOrThrow({
                where: {
                    address: {
                        equals: String(username)
                    }
                }
            })

            const result = await prisma.user.update({
                where: {
                    id: user?.id
                },
                data: {
                    voters: {
                        disconnect: {
                            address: input.address
                        }
                    }
                }
            })

            posthog.capture({
                distinctId: user.address,
                event: 'remove_proxy',
                properties: {
                    proxy: input.address
                }
            })

            return result
        }),

    getUser: privateProcedure.query(async ({ ctx }) => {
        const username = await ctx.user.name

        const user = await prisma.user.findFirst({
            where: {
                address: {
                    equals: String(username)
                }
            }
        })

        return user
    }),

    deleteUser: privateProcedure.mutation(async ({ ctx }) => {
        const username = await ctx.user.name

        const user = await prisma.user.findFirst({
            where: {
                address: {
                    equals: String(username)
                }
            }
        })
        await prisma.user.delete({
            where: { id: user?.id }
        })
    })
})
