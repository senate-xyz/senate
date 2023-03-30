import { router, privateProcedure } from '../trpc'
import { z } from 'zod'
import { prisma } from '@senate/database'

export const subscriptionsRouter = router({
    subscribe: privateProcedure
        .input(
            z.object({
                daoId: z.string(),
                notificationsEnabled: z.boolean()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const username = await ctx.user.name

            const user = await prisma.user.findFirstOrThrow({
                where: {
                    name: {
                        equals: String(username)
                    }
                }
            })

            const result = await prisma.subscription.upsert({
                where: {
                    userid_daoid: {
                        userid: user.id,
                        daoid: input.daoId
                    }
                },
                update: {
                    notificationsenabled: input.notificationsEnabled
                },
                create: {
                    userid: user.id,
                    daoid: input.daoId,
                    notificationsenabled: input.notificationsEnabled
                }
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
            const username = await ctx.user.name

            const user = await prisma.user.findFirstOrThrow({
                where: {
                    name: {
                        equals: String(username)
                    }
                }
            })

            const result = await prisma.subscription.delete({
                where: {
                    userid_daoid: {
                        userid: user?.id,
                        daoid: input.daoId
                    }
                }
            })

            return result
        }),

    updateSubscription: privateProcedure
        .input(
            z.object({
                daoId: z.string(),
                notificationsEnabled: z.boolean()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const username = await ctx.user.name

            const user = await prisma.user.findFirstOrThrow({
                where: {
                    name: {
                        equals: String(username)
                    }
                }
            })

            const result = await prisma.subscription.update({
                where: {
                    userid_daoid: {
                        userid: user.id,
                        daoid: input.daoId
                    }
                },
                data: {
                    notificationsenabled: input.notificationsEnabled
                }
            })

            return result
        })
})
