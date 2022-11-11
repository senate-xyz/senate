import { prisma } from '@senate/database'
import { z } from 'zod'
import { RefreshStatus } from '../../../../../../packages/common-types/dist'
import { router, publicProcedure } from '../trpc'

export const userRouter = router({
    voters: publicProcedure.query(async ({ ctx }) => {
        if (!ctx.session) return

        const proxyAddresses = await prisma.voter.findMany({
            where: {
                users: {
                    some: {
                        name: { equals: String(ctx.session?.user?.name) },
                    },
                },
            },
        })
        return proxyAddresses
    }),
    addVoter: publicProcedure
        .input(
            z.object({
                address: z.string().startsWith('0x').length(42),
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (!ctx.session) return

            await prisma.user.update({
                where: {
                    name: String(ctx.session?.user?.name),
                },
                data: {
                    voters: {
                        connectOrCreate: {
                            where: { address: input.address },
                            create: {
                                address: input.address,
                                refreshStatus: RefreshStatus.NEW,
                                lastRefresh: new Date(),
                            },
                        },
                    },
                },
            })
        }),
    removeVoter: publicProcedure
        .input(
            z.object({
                address: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            if (!ctx.session) return

            await prisma.user
                .update({
                    where: {
                        name: String(ctx.session?.user?.name),
                    },
                    data: {
                        voters: {
                            disconnect: {
                                address: input.address,
                            },
                        },
                    },
                })
                .then((res) => console.log(res))
                .catch((err) => console.log(err))
        }),
    userProposals: publicProcedure.query(async ({ ctx }) => {
        const user = await prisma.user.findFirstOrThrow({
            where: {
                name: { equals: String(ctx.session?.user?.name) },
            },
            select: {
                id: true,
                voters: true,
            },
        })

        const userSubscriptions = await prisma.subscription.findMany({
            where: {
                AND: {
                    userId: user?.id,
                },
            },
            select: {
                daoId: true,
            },
        })

        const userProposals = await prisma.proposal.findMany({
            where: {
                AND: [
                    {
                        daoId: {
                            in: userSubscriptions.map((sub) => sub.daoId),
                        },
                    },
                    {
                        data: {
                            path: '$.timeEnd',
                            gte: Date.now() / 1000,
                        },
                    },
                ],
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
                        voterAddress: {
                            in: user.voters.map((voter) => voter.address),
                        },
                    },
                    include: {
                        options: true,
                    },
                },
            },
        })

        return userProposals
    }),
    userDaos: publicProcedure.query(async ({ ctx }) => {
        const user = await prisma.user
            .findFirstOrThrow({
                where: {
                    name: { equals: String(ctx.session?.user?.name) },
                },
                select: {
                    id: true,
                },
            })
            .catch(() => {
                return { id: '0' }
            })

        const daosList = await prisma.dAO.findMany({
            where: {},
            orderBy: {
                id: 'asc',
            },
            distinct: 'id',
            include: {
                handlers: true,
                subscriptions: {
                    where: {
                        userId: { contains: user.id },
                    },
                },
            },
        })
        return daosList
    }),
    userSubscribe: publicProcedure
        .input(
            z.object({
                daoId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = await prisma.user
                .findFirstOrThrow({
                    where: {
                        name: { equals: String(ctx.session?.user?.name) },
                    },
                    select: {
                        id: true,
                    },
                })
                .catch(() => {
                    return { id: '0' }
                })

            await prisma.subscription
                .upsert({
                    where: {
                        userId_daoId: {
                            userId: user.id,
                            daoId: input.daoId,
                        },
                    },
                    update: {},
                    create: {
                        userId: user.id,
                        daoId: input.daoId,
                    },
                })
                .then((res) => {
                    return res
                })
        }),

    userUnsubscribe: publicProcedure
        .input(
            z.object({
                daoId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = await prisma.user
                .findFirstOrThrow({
                    where: {
                        name: { equals: String(ctx.session?.user?.name) },
                    },
                    select: {
                        id: true,
                    },
                })
                .catch(() => {
                    return { id: '0' }
                })

            await prisma.subscription
                .delete({
                    where: {
                        userId_daoId: {
                            userId: user.id,
                            daoId: input.daoId,
                        },
                    },
                })
                .then(() => {
                    return true
                })
        }),

    refreshStatus: publicProcedure.query(async ({ ctx }) => {
        const user = await prisma.user
            .findFirstOrThrow({
                where: {
                    name: { equals: String(ctx.session?.user?.name) },
                },
                select: {
                    id: true,
                },
            })
            .catch(() => {
                return { id: '0' }
            })
        const status = await prisma.voter.findMany({
            where: {
                users: {
                    every: {
                        id: user.id,
                    },
                },
            },
        })
        return status
    }),

    refreshMyVotes: publicProcedure.mutation(async ({ ctx }) => {
        const user = await prisma.user
            .findFirstOrThrow({
                where: {
                    name: { equals: String(ctx.session?.user?.name) },
                },
                select: {
                    id: true,
                },
            })
            .catch(() => {
                return { id: '0' }
            })

        const voters = await prisma.voter.findMany({
            where: {
                users: {
                    every: { id: user.id },
                },
            },
        })

        await prisma.voter.updateMany({
            where: {
                id: {
                    in: voters.map((voter) => voter.id),
                },
            },
            data: {
                refreshStatus: RefreshStatus.NEW,
                lastRefresh: new Date(),
            },
        })
    }),
})
