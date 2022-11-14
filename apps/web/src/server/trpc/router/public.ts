import { prisma } from '@senate/database'
import { z } from 'zod'
import { RefreshStatus } from '@senate/common-types'

import { router, publicProcedure } from '../trpc'

export const publicRouter = router({
    proposals: publicProcedure.query(async () => {
        const userProposals = await prisma.proposal.findMany({
            where: {
                data: {
                    path: '$.timeEnd',
                    gte: Date.now() / 1000,
                },
            },
            include: {
                dao: {
                    include: {
                        handlers: {
                            select: {
                                type: true,
                            },
                        },
                    },
                },
                votes: {
                    where: {
                        voterAddress: '',
                    },
                    include: {
                        options: true,
                    },
                },
            },
        })

        return userProposals
    }),
    daos: publicProcedure.query(async () => {
        const daosList = await prisma.dAO.findMany({
            where: {},
            orderBy: {
                id: 'asc',
            },
            distinct: 'id',
            include: {
                handlers: true,
                subscriptions: {
                    take: 0, //needed in order to maintain type safety
                },
            },
        })
        return daosList
    }),
    refreshDao: publicProcedure
        .input(
            z.object({
                daoId: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            await prisma.dAO.update({
                where: {
                    id: input.daoId,
                },
                data: {
                    refreshStatus: RefreshStatus.NEW,
                },
            })
        }),
    refreshStatus: publicProcedure
        .input(
            z.object({
                daoId: z.string(),
            })
        )
        .query(async ({ input }) => {
            return await prisma.dAO.findFirst({
                where: {
                    id: input.daoId,
                },
            })
        }),
})
