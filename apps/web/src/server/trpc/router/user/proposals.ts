import { prisma } from '@senate/database'
import { z } from 'zod'
import { router, publicProcedure } from '../../trpc'

export const userProposalsRouter = router({
    proposals: publicProcedure.query(async ({ ctx }) => {
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

    filteredActiveProposals: publicProcedure
        .input(
            z.object({
                fromDao: z.string(),
                endingIn: z.number(),
                withVoteStatus: z.number(),
            })
        )
        .query(async ({ input, ctx }) => {
            const user = await prisma.user.findFirstOrThrow({
                where: {
                    name: { equals: String(ctx.session?.user?.name) },
                },
                include: {
                    voters: true,
                },
            })

            let voteStatusQuery
            switch (input.withVoteStatus) {
                case 1:
                    voteStatusQuery = {
                        votes: {
                            some: {
                                voterAddress: {
                                    in: user.voters.map(
                                        (voter) => voter.address
                                    ),
                                },
                            },
                        },
                    }
                    break
                case 2:
                    voteStatusQuery = {
                        votes: {
                            none: {
                                voterAddress: {
                                    in: user.voters.map(
                                        (voter) => voter.address
                                    ),
                                },
                            },
                        },
                    }
                    break
                default:
                    voteStatusQuery = {}
                    break
            }

            const userSubscriptions = await prisma.subscription.findMany({
                where: {
                    userId: user.id,
                },
            })

            const userProposals = await prisma.proposal.findMany({
                where: {
                    AND: [
                        {
                            daoId:
                                input.fromDao == 'any'
                                    ? {
                                          in: userSubscriptions.map(
                                              (sub) => sub.daoId
                                          ),
                                      }
                                    : input.fromDao,
                        },
                        {
                            timeEnd: {
                                lte: new Date(Date.now() + input.endingIn),
                            },
                        },
                        {
                            timeEnd: {
                                gte: new Date(),
                            },
                        },
                        voteStatusQuery,
                    ],
                },
                orderBy: {
                    timeEnd: 'asc',
                },
                include: {
                    dao: true,
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

    filteredPastProposals: publicProcedure
        .input(
            z.object({
                fromDao: z.string(),
                endingIn: z.number(),
                withVoteStatus: z.number(),
            })
        )
        .query(async ({ input, ctx }) => {
            const user = await prisma.user.findFirstOrThrow({
                where: {
                    name: { equals: String(ctx.session?.user?.name) },
                },
                include: {
                    voters: true,
                },
            })

            let voteStatusQuery
            switch (input.withVoteStatus) {
                case 1:
                    voteStatusQuery = {
                        votes: {
                            some: {
                                voterAddress: {
                                    in: user.voters.map(
                                        (voter) => voter.address
                                    ),
                                },
                            },
                        },
                    }
                    break
                case 2:
                    voteStatusQuery = {
                        votes: {
                            none: {
                                voterAddress: {
                                    in: user.voters.map(
                                        (voter) => voter.address
                                    ),
                                },
                            },
                        },
                    }
                    break
                default:
                    voteStatusQuery = {}
                    break
            }

            const userSubscriptions = await prisma.subscription.findMany({
                where: {
                    userId: user.id,
                },
            })

            const userProposals = await prisma.proposal.findMany({
                where: {
                    AND: [
                        {
                            daoId:
                                input.fromDao == 'any'
                                    ? {
                                          in: userSubscriptions.map(
                                              (sub) => sub.daoId
                                          ),
                                      }
                                    : input.fromDao,
                        },
                        {
                            timeEnd: {
                                gte: new Date(Date.now() - input.endingIn),
                            },
                        },
                        {
                            timeEnd: {
                                lt: new Date(Date.now()),
                            },
                        },

                        voteStatusQuery,
                    ],
                },
                orderBy: {
                    timeEnd: 'asc',
                },
                include: {
                    dao: true,
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
})
