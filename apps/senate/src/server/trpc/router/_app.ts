import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { router } from '../trpc'
import { publicRouter } from './public'
import { trackerRouter } from './tracker'
import { userRouter } from './user/user'

export const appRouter = router({
    public: publicRouter,
    tracker: trackerRouter,
    user: userRouter
})

// export type definition of API
export type AppRouter = typeof appRouter

export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>
