import { router, privateProcedure } from '../trpc'
import { z } from 'zod'
import { prisma } from '@senate/database'

export const accountSettingsRouter = router({
    setEmail: privateProcedure
        .input(
            z.object({
                email: z.string().email()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const user = await prisma.user.findFirst({
                where: {
                    name: { equals: String(ctx.user.name) }
                }
            })

            const result = await prisma.user.update({
                where: {
                    id: user?.id
                },
                data: {
                    email: input.email
                }
            })

            return result
        }),

    getEmail: privateProcedure.query(async ({ ctx }) => {
        const user = await prisma.user.findFirst({
            where: {
                name: { equals: String(ctx.user.name) }
            }
        })

        return user?.email
    }),

    voters: privateProcedure.query(async ({ ctx }) => {
        const user = await prisma.user.findFirst({
            where: {
                name: { equals: String(ctx.user.name) }
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
                address: z.string()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const user = await prisma.user.findFirst({
                where: {
                    name: { equals: String(ctx.user.name) }
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
                address: z.string()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const user = await prisma.user.findFirst({
                where: {
                    name: { equals: String(ctx.user.name) }
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

    isNewUser: privateProcedure.query(async ({ ctx }) => {
        const user = await prisma.user.findFirst({
            where: {
                name: { equals: String(ctx.user.name) }
            }
        })

        return user?.newUser
    }),

    setNewUser: privateProcedure
        .input(
            z.object({
                value: z.boolean()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const user = await prisma.user.findFirst({
                where: {
                    name: { equals: String(ctx.user.name) }
                }
            })

            const result = await prisma.user.update({
                where: {
                    id: user?.id
                },
                data: {
                    newUser: input.value
                }
            })

            return result
        }),

    setTerms: privateProcedure
        .input(
            z.object({
                value: z.boolean()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const user = await prisma.user.findFirst({
                where: {
                    name: { equals: String(ctx.user.name) }
                }
            })

            const result = await prisma.user.update({
                where: {
                    id: user?.id
                },
                data: {
                    acceptedTerms: input.value
                }
            })

            return result
        }),

    getUser: privateProcedure.query(async ({ ctx }) => {
        const user = await prisma.user.findFirst({
            where: {
                name: { equals: String(ctx.user.name) }
            }
        })

        const result = await prisma.user.findFirst({
            where: {
                id: user?.id
            }
        })

        return result
    }),

    updateDailyEmails: privateProcedure
        .input(
            z.object({
                dailyBulletin: z.boolean()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const user = await prisma.user.findFirst({
                where: {
                    name: { equals: String(ctx.user.name) }
                }
            })

            const result = await prisma.user.update({
                where: {
                    id: user?.id
                },
                data: {
                    dailyBulletin: input.dailyBulletin
                }
            })

            return result
        })
})
