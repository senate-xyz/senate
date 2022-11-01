import { prisma } from '@senate/database'
import { z } from 'zod'

import { router, publicProcedure } from '../trpc'

export const trackerRouter = router({
    track: publicProcedure
        .input(
            z.object({
                addresses: z.string().array(),
            })
        )
        .query(async ({ input }) => {
            const user = await prisma.user.findMany({
                where: {
                    address: {
                        in: input.addresses,
                    },
                },
                select: {
                    address: true,
                },
            })

            const userProposalsVoted = await prisma.proposal.findMany({
                where: {
                    AND: {
                        votes: {
                            some: {
                                voterAddress: {
                                    in: user.map((user) => user.address),
                                },
                            },
                        },
                    },
                },
                include: {
                    dao: true,
                    votes: {
                        include: {
                            options: {
                                select: {
                                    optionName: true,
                                },
                            },
                        },
                        where: {
                            voterAddress: {
                                in: user.map((user) => user.address),
                            },
                        },
                    },
                },
            })

            return userProposalsVoted
        }),
})
