import { createRouter } from './context'
import { prisma } from '@senate/database'
import { z } from 'zod'

export const trackerRouter = createRouter().query('track', {
    input: z.object({
        address: z.string(),
    }),
    async resolve({ input }) {
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

        console.log(`Tracker for ${user.id}`)

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
    },
})
