import { router } from '../trpc'
import { publicRouter } from './public'
import { userRouter } from './user/user'

export const appRouter = router({
    public: publicRouter,
    user: userRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
