import { trpcAppRouter } from '../server/trpc/routers/trpcAppRouter'

export const serverQuery = trpcAppRouter.createCaller({})
