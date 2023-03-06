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
                    dailyBulletin: true
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
                    email: input.email
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

        return user?.voters
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

    setTerms: privateProcedure
        .input(
            z.object({
                value: z.boolean(),
                timestamp: z.number()
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
                    acceptedTerms: input.value,
                    acceptedTermsTimestamp: new Date(input.timestamp)
                },
                update: {
                    acceptedTerms: input.value,
                    acceptedTermsTimestamp: new Date(input.timestamp)
                }
            })

            return user
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
