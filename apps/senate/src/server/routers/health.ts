import { router, publicProcedure } from '../trpc'

export const healthRouter = router({
    healthCheck: publicProcedure.query(() => 'yay!')
})
