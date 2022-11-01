import { prisma } from '@senate/database'
import { z } from 'zod'

import { router, publicProcedure } from '../trpc'

export const trackerRouter = router({
    track: publicProcedure
        .input(
            z.object({
                address: z.string(),
            })
        )
        .query(async ({ input }) => {
            const user = await prisma.user
                .findFirstOrThrow({
                    where: {
                        address: input.address,
                    },
                    select: {
                        address: true,
                    },
                })
                .catch(() => {
                    return { address: '0' }
                })

            if (user.address == '0') return

            const userProposalsVoted = await prisma.proposal.findMany({
                where: {
                    AND: {
                        votes: {
                            some: {
                                voterAddress: user.address,
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
                            voterAddress: user.address,
                        },
                    },
                },
            })

            return userProposalsVoted
        }),
})
