import { z } from 'zod'

import { router, publicProcedure } from '../trpc'

export const trackerRouter = router({
    track: publicProcedure
        .input(
            z.object({
                addresses: z.array(z.string().startsWith('0x').length(42))
            })
        )
        .query(async ({ ctx, input }) => {
            const userProposalsVoted = await ctx.prisma.proposal.findMany({
                where: {
                    votes: {
                        some: {
                            voterAddress: {
                                in: input.addresses
                            }
                        }
                    }
                },
                include: {
                    dao: true,
                    votes: {
                        where: {
                            voterAddress: {
                                in: input.addresses
                            }
                        }
                    }
                }
            })

            return userProposalsVoted
        })
})
