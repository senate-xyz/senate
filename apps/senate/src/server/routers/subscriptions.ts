import { router, privateProcedure } from '../trpc'
import { z } from 'zod'
import { prisma } from '@senate/database'
import { clerkClient } from '@clerk/nextjs/server'

export const subscriptionsRouter = router({
    subscribe: privateProcedure
        .input(
            z.object({
                daoId: z.string(),
                notificationsEnabled: z.boolean()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const clerkUser = await clerkClient.users.getUser(
                ctx.auth?.userId || ''
            )

            const user = await prisma.user.findFirstOrThrow({
                where: {
                    name: {
                        equals: String(clerkUser.web3Wallets[0]?.web3Wallet)
                    }
                }
            })

            const result = await prisma.subscription.upsert({
                where: {
                    userId_daoId: {
                        userId: user.id,
                        daoId: input.daoId
                    }
                },
                update: {
                    notificationsEnabled: input.notificationsEnabled
                },
                create: {
                    userId: user.id,
                    daoId: input.daoId,
                    notificationsEnabled: input.notificationsEnabled
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
            const clerkUser = await clerkClient.users.getUser(
                ctx.auth?.userId || ''
            )

            const user = await prisma.user.findFirstOrThrow({
                where: {
                    name: {
                        equals: String(clerkUser.web3Wallets[0]?.web3Wallet)
                    }
                }
            })

            const result = await prisma.subscription.delete({
                where: {
                    userId_daoId: {
                        userId: user?.id,
                        daoId: input.daoId
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
            const clerkUser = await clerkClient.users.getUser(
                ctx.auth?.userId || ''
            )

            const user = await prisma.user.findFirstOrThrow({
                where: {
                    name: {
                        equals: String(clerkUser.web3Wallets[0]?.web3Wallet)
                    }
                }
            })

            const result = await prisma.subscription.update({
                where: {
                    userId_daoId: {
                        userId: user.id,
                        daoId: input.daoId
                    }
                },
                data: {
                    notificationsEnabled: input.notificationsEnabled
                }
            })

            return result
        })
})
