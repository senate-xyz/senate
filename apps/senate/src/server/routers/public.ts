import { z } from 'zod'
import { router, publicProcedure } from '../trpc'

export const publicRouter = router({
    proposals: publicProcedure.query(async ({ ctx }) => {
        const userProposals = await ctx.prisma?.proposal.findMany({
            where: {
                data: {
                    path: '$.timeEnd',
                    gte: Date.now() / 1000
                }
            },
            include: {
                dao: {
                    include: {
                        handlers: {
                            select: {
                                type: true
                            }
                        }
                    }
                },
                votes: {
                    where: {
                        voterAddress: ''
                    }
                }
            }
        })

        return userProposals
    }),
    daos: publicProcedure.query(async ({ ctx }) => {
        const daosList = await ctx.prisma?.dAO.findMany({
            where: {},
            orderBy: {
                id: 'asc'
            },
            distinct: 'id',
            include: {
                handlers: true,
                subscriptions: {
                    take: 0 //needed in order to maintain type safety
                }
            }
        })
        return daosList
    }),
    activeProposalsForDao: publicProcedure
        .input(
            z.object({
                daoId: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            return await ctx.prisma?.proposal.findMany({
                where: {
                    AND: [
                        {
                            daoId: input.daoId
                        }
                    ]
                }
            })
        })
})
