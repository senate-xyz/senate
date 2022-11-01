import { prisma } from '@senate/database'

import { router, publicProcedure } from '../trpc'

export const publicRouter = router({
    proposals: publicProcedure.query(async () => {
        const userProposals = await prisma.proposal.findMany({
            where: {
                data: {
                    path: '$.timeEnd',
                    lt: Number(new Date()),
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
    refreshAllProposals: publicProcedure.mutation(async () => {
        const daos = await prisma.dAO.findMany({})

        daos.forEach(async (dao) => {
            await fetch(
                `${process.env.DETECTIVE_URL}/updateProposals?daoId=${dao.id}`,
                {
                    method: 'POST',
                }
            )
        })
    }),
    refreshAllVotes: publicProcedure.mutation(async () => {
        const daos = await prisma.dAO.findMany({})
        const users = await prisma.user.findMany({})

        daos.forEach(async (dao) => {
            users.forEach(async (user) => {
                await fetch(
                    `${process.env.DETECTIVE_URL}/updateVotes?daoId=${dao.id}&userId=${user.id}`,
                    {
                        method: 'POST',
                    }
                )
            })
        })
    }),
    refreshAllProxyVotes: publicProcedure.mutation(() => {
        console.log('refreshAllProxyVotes')
    }),
})
