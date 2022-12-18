import { prisma } from '@senate/database'
import { z } from 'zod'
import { RefreshStatus } from '@senate/common-types'
import { router, publicProcedure } from '../../trpc'

export const userSettingsRouter = router({
    email: publicProcedure.query(async ({ ctx }) => {
        if (!ctx.session) return

        const user = await prisma.user.findFirstOrThrow({
            where: {
                name: String(ctx.session?.user?.name),
            },
        })
        return user.email
    }),

    setEmail: publicProcedure
        .input(
            z.object({
                emailAddress: z.string().email(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (!ctx.session) return

            const user = await prisma.user.update({
                where: {
                    name: String(ctx.session?.user?.name),
                },
                data: {
                    email: input.emailAddress,
                },
                select: {
                    email: true,
                },
            })

            return user.email
        }),

    setTerms: publicProcedure
        .input(
            z.object({
                value: z.boolean(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (!ctx.session) return

            const user = await prisma.user.update({
                where: {
                    name: String(ctx.session?.user?.name),
                },
                data: {
                    acceptedTerms: input.value,
                },
                select: {
                    acceptedTerms: true,
                },
            })

            return user.acceptedTerms
        }),

    setNewUser: publicProcedure
        .input(
            z.object({
                value: z.boolean(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (!ctx.session) return

            const user = await prisma.user.update({
                where: {
                    name: String(ctx.session?.user?.name),
                },
                data: {
                    newUser: input.value,
                },
                select: {
                    newUser: true,
                },
            })

            return user.newUser
        }),

    newUser: publicProcedure.query(async ({ ctx }) => {
        let result = false

        const user = await prisma.user.findFirst({
            where: {
                name: { equals: String(ctx.session?.user?.name) },
            },
            select: {
                newUser: true,
            },
        })

        result = user?.newUser ?? false

        return { newUser: result }
    }),

    userSettings: publicProcedure.query(async ({ ctx }) => {
        const user = await prisma.user.findFirst({
            where: {
                name: { equals: String(ctx.session?.user?.name) },
            },
            select: {
                userSettings: true,
            },
        })
        return user?.userSettings
    }),

    setDailyBulletin: publicProcedure
        .input(
            z.object({
                value: z.boolean(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (!ctx.session) return

            const user = await prisma.user.findFirst({
                where: {
                    name: { equals: String(ctx.session?.user?.name) },
                },
                select: {
                    id: true,
                },
            })

            const userSettings = await prisma.userSettings.upsert({
                where: { userId: user?.id },
                create: {
                    userId: user?.id ?? 'null',
                    dailyBulletinEmail: input.value,
                },
                update: {
                    dailyBulletinEmail: input.value,
                },
            })

            return userSettings
        }),

    voters: publicProcedure.query(async ({ ctx }) => {
        if (!ctx.session) return

        const proxyAddresses = await prisma.voter.findMany({
            where: {
                users: {
                    some: {
                        name: { equals: String(ctx.session?.user?.name) },
                    },
                },
            },
        })
        return proxyAddresses
    }),
    addVoter: publicProcedure
        .input(
            z.object({
                address: z.string().startsWith('0x').length(42),
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (!ctx.session) return

            await prisma.user
                .update({
                    where: {
                        name: String(ctx.session?.user?.name),
                    },
                    data: {
                        voters: {
                            connectOrCreate: {
                                where: { address: input.address },
                                create: {
                                    address: input.address,
                                    refreshStatus: RefreshStatus.NEW,
                                    lastRefresh: new Date(0),
                                },
                            },
                        },
                    },
                })
                .then(() => {
                    return true
                })
                .catch(() => {
                    return false
                })
        }),
    removeVoter: publicProcedure
        .input(
            z.object({
                address: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (!ctx.session) return

            await prisma.user
                .update({
                    where: {
                        name: String(ctx.session?.user?.name),
                    },
                    data: {
                        voters: {
                            disconnect: {
                                address: input.address,
                            },
                        },
                    },
                })
                .then(() => {
                    return true
                })
                .catch(() => {
                    return false
                })
        }),
})
