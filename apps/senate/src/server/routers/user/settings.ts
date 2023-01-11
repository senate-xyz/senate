import { z } from 'zod'
import { router, protectedProcedure } from '../../trpc'

export const userSettingsRouter = router({
    email: protectedProcedure.query(async ({ ctx }) => {
        if (!ctx.session) return

        const user = await ctx.prisma?.user.findFirstOrThrow({
            where: {
                name: String(ctx.session?.user?.name)
            }
        })
        return user.email
    }),

    setEmail: protectedProcedure
        .input(
            z.object({
                emailAddress: z.string().email()
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (!ctx.session) return

            const user = await ctx.prisma?.user.update({
                where: {
                    name: String(ctx.session?.user?.name)
                },
                data: {
                    email: input.emailAddress
                },
                select: {
                    email: true
                }
            })

            return user.email
        }),

    setTerms: protectedProcedure
        .input(
            z.object({
                value: z.boolean()
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (!ctx.session) return

            const user = await ctx.prisma?.user.update({
                where: {
                    name: String(ctx.session?.user?.name)
                },
                data: {
                    acceptedTerms: input.value
                },
                select: {
                    acceptedTerms: true
                }
            })

            return user.acceptedTerms
        }),

    setNewUser: protectedProcedure
        .input(
            z.object({
                value: z.boolean()
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (!ctx.session) return

            const user = await ctx.prisma?.user.update({
                where: {
                    name: String(ctx.session?.user?.name)
                },
                data: {
                    newUser: input.value
                },
                select: {
                    newUser: true
                }
            })

            return user.newUser
        }),

    isNewUser: protectedProcedure.query(async ({ ctx }) => {
        let result = false

        const user = await ctx.prisma?.user.findFirst({
            where: {
                name: { equals: String(ctx.session?.user?.name) }
            },
            select: {
                newUser: true
            }
        })

        result = user?.newUser ?? false

        return { newUser: result }
    }),

    userSettings: protectedProcedure.query(async ({ ctx }) => {
        const user = await ctx.prisma?.user.findFirst({
            where: {
                name: { equals: String(ctx.session?.user?.name) }
            },
            select: {
                userSettings: true
            }
        })
        return user?.userSettings
    }),

    setDailyBulletin: protectedProcedure
        .input(
            z.object({
                value: z.boolean()
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (!ctx.session) return

            const user = await ctx.prisma?.user.findFirst({
                where: {
                    name: { equals: String(ctx.session?.user?.name) }
                },
                select: {
                    id: true
                }
            })

            const userSettings = await ctx.prisma?.userSettings.upsert({
                where: { userId: user?.id },
                create: {
                    userId: user?.id ?? 'null',
                    dailyBulletinEmail: input.value
                },
                update: {
                    dailyBulletinEmail: input.value
                }
            })

            return userSettings
        }),

    voters: protectedProcedure.query(async ({ ctx }) => {
        if (!ctx.session) return

        const proxyAddresses = await ctx.prisma?.voter.findMany({
            where: {
                users: {
                    some: {
                        name: { equals: String(ctx.session?.user?.name) }
                    }
                }
            }
        })
        return proxyAddresses
    }),
    addVoter: protectedProcedure
        .input(
            z.object({
                address: z.string().startsWith('0x').length(42)
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (!ctx.session) return

            await ctx.prisma?.user
                .update({
                    where: {
                        name: String(ctx.session?.user?.name)
                    },
                    data: {
                        voters: {
                            connectOrCreate: {
                                where: { address: input.address },
                                create: {
                                    address: input.address
                                }
                            }
                        }
                    }
                })
                .then(() => {
                    return true
                })
                .catch(() => {
                    return false
                })
        }),
    removeVoter: protectedProcedure
        .input(
            z.object({
                address: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (!ctx.session) return

            await ctx.prisma?.user
                .update({
                    where: {
                        name: String(ctx.session?.user?.name)
                    },
                    data: {
                        voters: {
                            disconnect: {
                                address: input.address
                            }
                        }
                    }
                })
                .then(() => {
                    return true
                })
                .catch(() => {
                    return false
                })
        })
})
