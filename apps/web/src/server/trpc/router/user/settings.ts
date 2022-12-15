import { prisma } from '@senate/database'
import { z } from 'zod'
import { RefreshStatus } from '@senate/common-types'
import { router, publicProcedure } from '../../trpc'
import { Input } from 'postcss'

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
