import {publicProcedure, router} from '../trpc'

export const healthRouter = router({
    healthCheck: publicProcedure.query(() => 'yay!')
})
