import { publicProcedure, router } from '../trpc'
import { prisma } from '@senate/database'

export const publicRouter = router({
    allDAOs: publicProcedure.query(async () => {
        const allDAOs = await prisma.dAO.findMany({})

        return allDAOs
    })
})
