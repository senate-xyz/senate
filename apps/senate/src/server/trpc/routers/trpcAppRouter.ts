import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

import { publicRouter } from './public'
import { trackerRouter } from './tracker'
import { userRouter } from './user/user'
import { router } from '../trpc'

export const trpcAppRouter = router({
    public: publicRouter,
    tracker: trackerRouter,
    user: userRouter
})

// export type definition of API
export type TrpcAppRouter = typeof trpcAppRouter

export type RouterInput = inferRouterInputs<TrpcAppRouter>
export type RouterOutput = inferRouterOutputs<TrpcAppRouter>
