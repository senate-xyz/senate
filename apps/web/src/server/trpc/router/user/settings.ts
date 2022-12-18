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
                emailAddress: z.string(),
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
                    terms: input.value,
                },
            })

            return user.terms
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
            })

            return user.newUser
        }),

    newUser: publicProcedure.query(async ({ ctx }) => {
        let result = true

        const user = await prisma.user.findFirst({
            where: {
                name: { equals: String(ctx.session?.user?.name) },
            },
            select: {
                newUser: true,
            },
        })

        result = user?.newUser ?? true

        return { newUser: result }
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
