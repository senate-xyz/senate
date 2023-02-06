/**
 * This file contains the root router of your tRPC-backend
 */
import { publicProcedure, router } from '../trpc'
import { healthRouter } from './health'
import { subscriptionsRouter } from './subscriptions'

export const appRouter = router({
    subscriptions: subscriptionsRouter,
    health: healthRouter,
    whoami: publicProcedure.query(({ ctx }) => {
        const user = ctx.user ?? null
        return user
    })
})

export type AppRouter = typeof appRouter
