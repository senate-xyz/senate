import { router, privateProcedure } from '../trpc'
import { z } from 'zod'
import { prisma } from '@senate/database'

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
                    name: String(username)
                },
                create: {
                    name: String(username),
                    email: input.email,
                    dailyBulletin: true,
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
                update: { email: input.email, dailyBulletin: true }
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
            const username = await ctx.user.name

            const user = await prisma.user.upsert({
                where: {
                    name: String(username)
                },
                create: {
                    name: String(username),
                    email: input.email,
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
                update: { email: input.email }
            })

            return user
        }),

    getEmail: privateProcedure.query(async ({ ctx }) => {
        const username = await ctx.user.name

        const user = await prisma.user.findFirst({
            where: {
                name: {
                    equals: String(username)
                }
            }
        })

        return user?.email
    }),

    voters: privateProcedure.query(async ({ ctx }) => {
        const username = await ctx.user.name

        const user = await prisma.user.findFirst({
            where: {
                name: {
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
                    name: {
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
                    name: {
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
                name: {
                    equals: String(username)
                }
            }
        })

        return user
    }),

    updateDailyEmails: privateProcedure
        .input(
            z.object({
                dailyBulletin: z.boolean()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const username = await ctx.user.name

            const user = await prisma.user.upsert({
                where: {
                    name: String(username)
                },
                create: {
                    name: String(username),
                    dailyBulletin: input.dailyBulletin
                },
                update: { dailyBulletin: input.dailyBulletin }
            })

            return user
        })
})
