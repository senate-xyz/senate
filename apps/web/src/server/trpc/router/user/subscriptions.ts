import { prisma } from '@senate/database'
import { z } from 'zod'
import { router, publicProcedure } from '../../trpc'

export const userSubscriptionsRouter = router({
    subscribedDAOs: publicProcedure.query(async ({ ctx }) => {
        const user = await prisma.user
            .findFirstOrThrow({
                where: {
                    name: { equals: String(ctx.session?.user?.name) },
                },
                select: {
                    id: true,
                },
            })
            .catch(() => {
                return { id: '0' }
            })

        const daosList = await prisma.dAO.findMany({
            where: {
                subscriptions: {
                    some: {
                        user: { is: user },
                    },
                },
            },
            orderBy: {
                id: 'asc',
            },
            distinct: 'id',
            include: {
                handlers: true,
                subscriptions: {
                    where: {
                        userId: { contains: user.id },
                    },
                },
            },
        })
        return daosList
    }),
    subscribe: publicProcedure
        .input(
            z.object({
                daoId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = await prisma.user
                .findFirstOrThrow({
                    where: {
                        name: { equals: String(ctx.session?.user?.name) },
                    },
                    select: {
                        id: true,
                    },
                })
                .catch(() => {
                    return { id: '0' }
                })

            await prisma.subscription
                .upsert({
                    where: {
                        userId_daoId: {
                            userId: user.id,
                            daoId: input.daoId,
                        },
                    },
                    update: {},
                    create: {
                        userId: user.id,
                        daoId: input.daoId,
                    },
                })
                .then(() => {
                    return true
                })
                .catch(() => {
                    return false
                })
        }),

    unsubscribe: publicProcedure
        .input(
            z.object({
                daoId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = await prisma.user
                .findFirstOrThrow({
                    where: {
                        name: { equals: String(ctx.session?.user?.name) },
                    },
                    select: {
                        id: true,
                    },
                })
                .catch(() => {
                    return { id: '0' }
                })

            await prisma.subscription
                .delete({
                    where: {
                        userId_daoId: {
                            userId: user.id,
                            daoId: input.daoId,
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
