import { prisma } from '@senate/database'
import { z } from 'zod'
import { RefreshStatus } from '../../../../../../packages/common-types/dist'

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
            const dao = await prisma.dAO
                .findFirstOrThrow({
                    where: {
                        id: input.daoId,
                    },
                    select: {
                        id: true,
                    },
                })
                .catch(() => {
                    return { id: '0' }
                })
            await prisma.dAORefreshQueue.create({
                data: {
                    status: RefreshStatus.NEW,
                    daoId: dao.id,
                },
            })
        }),
    // refreshAllProposals: publicProcedure.mutation(async () => {
    //     const daos = await prisma.dAO.findMany({})

    //     daos.forEach(async (dao) => {
    //         await fetch(
    //             `${process.env.DETECTIVE_URL}/updateProposals?daoId=${dao.id}`,
    //             {
    //                 method: 'POST',
    //             }
    //         )
    //     })
    // }),
    // refreshAllVotes: publicProcedure.mutation(async () => {
    //     const daos = await prisma.dAO.findMany({})
    //     const users = await prisma.user.findMany({})
    //     const userProxies = await prisma.userProxy.findMany({})

    //     daos.forEach(async (dao) => {
    //         users.forEach(async (user) => {
    //             await fetch(
    //                 `${process.env.DETECTIVE_URL}/updateVotes?daoId=${dao.id}&voterAddress=${user.address}`,
    //                 {
    //                     method: 'POST',
    //                 }
    //             )
    //         })
    //         userProxies.forEach(async (userProxy) => {
    //             await fetch(
    //                 `${process.env.DETECTIVE_URL}/updateVotes?daoId=${dao.id}&voterAddress=${userProxy.address}`,
    //                 {
    //                     method: 'POST',
    //                 }
    //             )
    //         })
    //     })
    // }),
    // refreshAllProxyVotes: publicProcedure.mutation(() => {
    //     console.log('refreshAllProxyVotes')
    // }),
})
