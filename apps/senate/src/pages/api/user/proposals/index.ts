import { prisma } from '@senate/database'
import { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]'

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { from, end, voted, active } = req.query

    const session = await unstable_getServerSession(req, res, authOptions())

    const user = await prisma.user.findFirstOrThrow({
        where: {
            name: { equals: String(session?.user?.name) }
        },
        include: {
            voters: true
        }
    })

    console.log(voted)
    let voteStatusQuery
    switch (Number(voted)) {
        case 0:
            voteStatusQuery = {
                votes: {
                    none: {
                        voterAddress: {
                            in: user.voters.map((voter) => voter.address)
                        }
                    }
                }
            }

            break
        case 1:
            voteStatusQuery = {
                votes: {
                    some: {
                        voterAddress: {
                            in: user.voters.map((voter) => voter.address)
                        }
                    }
                }
            }
            break
        default:
            voteStatusQuery = {}
            break
    }

    const userSubscriptions = await prisma.subscription.findMany({
        where: {
            userId: user.id
        }
    })

    const userProposals = await prisma.proposal.findMany({
        where: {
            AND: [
                {
                    daoId:
                        from == '0'
                            ? {
                                  in: userSubscriptions.map((sub) => sub.daoId)
                              }
                            : String(from)
                },
                {
                    timeEnd: Boolean(active)
                        ? {
                              lte: new Date(Date.now() + Number(end))
                          }
                        : { gte: new Date(Date.now() - Number(end)) }
                },
                {
                    timeEnd: Boolean(active)
                        ? {
                              gte: new Date()
                          }
                        : {
                              lt: new Date()
                          }
                },
                voteStatusQuery
            ]
        },
        orderBy: {
            timeEnd: Boolean(active) ? 'asc' : 'desc'
        },
        include: {
            dao: true,
            votes: {
                where: {
                    voterAddress: {
                        in: user.voters.map((voter) => voter.address)
                    }
                }
            }
        }
    })

    const result = userProposals.map((proposal) => {
        return {
            daoName: proposal.dao.name,
            daoPicture: proposal.dao.picture,
            proposalTitle: proposal.name,
            proposalLink: proposal.url,
            timeEnd: proposal.timeEnd,
            voted: proposal.votes.map((vote: any) => vote.choice).length > 0
        }
    })

    res.json(result)
}
