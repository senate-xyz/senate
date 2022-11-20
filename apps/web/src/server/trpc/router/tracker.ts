import { prisma } from '@senate/database'
import { z } from 'zod'

import { router, publicProcedure } from '../trpc'

export const trackerRouter = router({
    track: publicProcedure
        .input(
            z.object({
                addresses: z.array(z.string().startsWith('0x').length(42)),
            })
        )
        .query(async ({ input }) => {
            const userProposalsVoted = await prisma.proposal.findMany({
                where: {
                    votes: {
                        some: {
                            voterAddress: {
                                in: input.addresses,
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
                                in: input.addresses,
                            },
                        },
                    },
                },
            })

            return userProposalsVoted
        }),
})
