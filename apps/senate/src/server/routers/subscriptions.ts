import { router, privateProcedure } from '../trpc'
import { z } from 'zod'
import { prisma } from '@senate/database'

export const subscriptionsRouter = router({
    subscribe: privateProcedure
        .input(
            z.object({
                daoId: z.string()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const user = await prisma.user
                .findFirstOrThrow({
                    where: {
                        name: { equals: String(ctx.user.name) }
                    },
                    select: {
                        id: true,
                        voters: true
                    }
                })
                .catch(() => {
                    return { id: '0', voters: [] }
                })

            const result = await prisma.subscription
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
            return result
        }),
    unsubscribe: privateProcedure
        .input(
            z.object({
                daoId: z.string()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const user = await prisma.user
                .findFirstOrThrow({
                    where: {
                        name: { equals: String(ctx.user.name) }
                    },
                    select: {
                        id: true,
                        voters: true
                    }
                })
                .catch(() => {
                    return { id: '0', voters: [] }
                })

            const result = await prisma.subscription
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

            return result
        })
})
