import { z } from 'zod'
import { publicProcedure, router } from '../trpc'
import { JsonArray, Vote, prisma } from '@senate/database'

export const publicRouter = router({
    allDAOs: publicProcedure.query(async () => {
        const allDAOs = await prisma.dAO.findMany({})

        return allDAOs
    }),
    proposal: publicProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ input, ctx }) => {
            const user = await prisma.user.findFirst({
                where: {
                    name: ctx.user?.name ?? ''
                },
                include: {
                    voters: true
                }
            })

            const proposal = await prisma.proposal.findFirstOrThrow({
                where: {
                    id: input.id
                },
                include: {
                    dao: true,
                    daoHandler: true,
                    votes: {
                        where: {
                            voterAddress: {
                                in: user?.voters.map((voter) => voter.address)
                            }
                        }
                    }
                }
            })

            let highestScore = 0
            let highestScoreIndex = 0
            let highestScoreChoice = ''

            if (
                proposal.scores &&
                typeof proposal.scores === 'object' &&
                Array.isArray(proposal?.scores) &&
                proposal.choices &&
                typeof proposal.choices === 'object' &&
                Array.isArray(proposal?.choices)
            ) {
                const scores = proposal.scores as JsonArray

                for (const score of scores) {
                    if (Number(score) > highestScore) {
                        highestScore = Number(score)
                        highestScoreIndex++
                    }
                }

                highestScoreChoice = String(
                    proposal.choices[highestScoreIndex - 1]
                )
            }

            const result = {
                daoName: proposal.dao.name,
                onchain: proposal.daoHandler.type == 'SNAPSHOT' ? false : true,
                daoPicture: proposal.dao.picture,
                proposalTitle: proposal.name,
                proposalLink: proposal.url,
                timeEnd: proposal.timeEnd,
                highestScoreChoice: highestScoreChoice,
                highestScore: highestScore,
                scoresTotal: proposal.scoresTotal,
                passedQuorum: proposal.quorum < proposal.scoresTotal,
                voted: user
                    ? String(
                          proposal.votes.map((vote: Vote) => vote.choice)
                              .length > 0
                      )
                    : 'not-connected'
            }

            return result
        })
})
