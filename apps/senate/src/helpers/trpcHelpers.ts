import { trpcAppRouter } from '../server/routers/trpcAppRouter'

import { createTrpcContext } from '../server/context'
import { prisma } from '@senate/database'

export const serverQuery = trpcAppRouter.createCaller({
    session: null,
    prisma: prisma
})

export const serverQueryWithContext = async () =>
    trpcAppRouter.createCaller(await createTrpcContext())
