import { router, privateProcedure } from '../trpc'
import { z } from 'zod'
import { prisma } from '@senate/database'
import { PostHog } from 'posthog-node'

const posthog = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY || '', {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST
})

export const subscriptionsRouter = router({
    subscribe: privateProcedure
        .input(
            z.object({
                daoId: z.string()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const username = await ctx.user.name

            const user = await prisma.user.findFirstOrThrow({
                where: {
                    address: {
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
                    userid: user.id,
                    daoid: input.daoId
                },
                create: {
                    userid: user.id,
                    daoid: input.daoId
                }
            })

            posthog.capture({
                distinctId: user.address,
                event: 'subscribed dao',
                properties: {
                    dao: input.daoId
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
                    address: {
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

            posthog.capture({
                distinctId: user.address,
                event: 'unsubscribed dao',
                properties: {
                    dao: input.daoId
                }
            })

            return result
        })
})
