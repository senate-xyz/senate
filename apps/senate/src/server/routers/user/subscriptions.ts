import { z } from 'zod'
import { router, protectedProcedure, publicProcedure } from '../../trpc'

export const userSubscriptionsRouter = router({
    subscribedDAOs: publicProcedure
        .input(
            z.object({
                userAddress: z.string()
            })
        )
        .query(async ({ input, ctx }) => {
            const user = await ctx.prisma?.user
                .findFirstOrThrow({
                    where: {
                        name: { equals: String(input.userAddress) }
                    },
                    select: {
                        id: true
                    }
                })
                .catch(() => {
                    return { id: '0' }
                })

            const daosList = await ctx.prisma?.dAO.findMany({
                where: {
                    subscriptions: {
                        some: {
                            user: { is: user }
                        }
                    }
                },
                orderBy: {
                    id: 'asc'
                },
                distinct: 'id',
                include: {
                    handlers: true,
                    subscriptions: {
                        where: {
                            userId: { contains: user.id }
                        }
                    }
                }
            })
            return daosList
        }),
    subscribe: protectedProcedure
        .input(
            z.object({
                daoId: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.prisma?.user
                .findFirstOrThrow({
                    where: {
                        name: { equals: String(ctx.session?.user?.name) }
                    },
                    select: {
                        id: true,
                        voters: true
                    }
                })
                .catch(() => {
                    return { id: '0', voters: [] }
                })

            await ctx.prisma?.subscription
                .upsert({
                    where: {
                        userId_daoId: {
                            userId: user.id,
                            daoId: input.daoId
                        }
                    },
                    update: {},
                    create: {
                        userId: user.id,
                        daoId: input.daoId
                    }
                })
                .then(() => {
                    return true
                })
                .catch(() => {
                    return false
                })
        }),

    unsubscribe: protectedProcedure
        .input(
            z.object({
                daoId: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.prisma?.user
                .findFirstOrThrow({
                    where: {
                        name: { equals: String(ctx.session?.user?.name) }
                    },
                    select: {
                        id: true
                    }
                })
                .catch(() => {
                    return { id: '0' }
                })

            await ctx.prisma?.subscription
                .delete({
                    where: {
                        userId_daoId: {
                            userId: user.id,
                            daoId: input.daoId
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
