import { router, privateProcedure } from '../trpc'
import { z } from 'zod'
import { prisma } from '@senate/database'
import { ServerClient } from 'postmark'
import { MagicUserState } from '@senate/database'

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

            const user = await prisma.user.findFirst({
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

            const user = await prisma.user.findFirst({
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
