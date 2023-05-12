import { router, privateProcedure } from '../trpc'
import { z } from 'zod'
import { prisma } from '@senate/database'
import { ServerClient } from 'postmark'

export const accountSettingsRouter = router({
    setEmailAndEnableBulletin: privateProcedure
        .input(
            z.object({
                email: z.string().email()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const username = await ctx.user.name

            const user = await prisma.user.upsert({
                where: {
                    address: String(username)
                },
                create: {
                    address: String(username),
                    email: input.email,
                    emaildailybulletin: true,
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
                update: { email: input.email, emaildailybulletin: true }
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

            emailClient.sendEmail({
                From: 'info@senatelabs.xyz',
                To: user.email,
                Subject: 'Confirm your email',
                TextBody: `${process.env.NEXT_PUBLIC_WEB_URL}/verify/${challengeCode}`
            })

            return user
        }),

    updateDailyEmails: privateProcedure
        .input(
            z.object({
                emaildailybulletin: z.boolean()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const username = await ctx.user.name

            const user = await prisma.user.upsert({
                where: {
                    address: String(username)
                },
                create: {
                    address: String(username),
                    emaildailybulletin: input.emaildailybulletin
                },
                update: { emaildailybulletin: input.emaildailybulletin }
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
                isaaveuser: false
            },
            update: { isaaveuser: false }
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
                isuniswapuser: false
            },
            update: { isuniswapuser: false }
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
    })
})
