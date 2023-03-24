import { z } from 'zod'
import { publicProcedure, router } from '../trpc'
import { prisma } from '@senate/database'

export const publicRouter = router({
    allDAOs: publicProcedure.query(async () => {
        const allDAOs = await prisma.dAO.findMany({})

        return allDAOs
    }),
    proposal: publicProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ input }) => {
            const proposal = await prisma.proposal.findFirst({
                where: {
                    id: input.id
                },
                include: {
                    dao: true
                }
            })

            return proposal
        })
})
