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
                        id: true,
                    },
                })
                .catch(() => {
                    return { id: '0' }
                })

            if (user.id == '0') return

            const userProposalsVoted = await prisma.proposal.findMany({
                where: {
                    AND: {
                        votes: {
                            some: {
                                user: user,
                            },
                        },
                    },
                },
                include: {
                    dao: true,
                    votes: {
                        where: {
                            user: user,
                        },
                    },
                },
            })

            return userProposalsVoted
        }),
})
