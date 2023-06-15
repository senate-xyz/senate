import Image from 'next/image'
import { extend } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
    type Vote,
    prisma,
    type JsonArray,
    ProposalState
} from '@senate/database'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../pages/api/auth/[...nextauth]'
import 'server-only'
import { MobilePastProposal } from './MobileRow'
import { PastProposal } from './DesktopRow'

extend(relativeTime)

const getProposals = async (
    from: string,
    end: number,
    voted: string,
    proxy: string
) => {
    const active = false

    const session = await getServerSession(authOptions())
    const userAddress = session?.user?.name ?? ''

    const user = await prisma.user.findFirst({
        where: {
            address: { equals: userAddress }
        },
        include: {
            voters: true
        }
    })

    let voteStatusQuery
    switch (String(voted)) {
        case 'no':
            voteStatusQuery = {
                votes: {
                    none: {
                        voteraddress: {
                            in:
                                proxy == 'any'
                                    ? user?.voters.map((voter) => voter.address)
                                    : [proxy]
                        }
                    }
                }
            }

            break
        case 'yes':
            voteStatusQuery = {
                votes: {
                    some: {
                        voteraddress: {
                            in:
                                proxy == 'any'
                                    ? user?.voters.map((voter) => voter.address)
                                    : [proxy]
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
            userid: user?.id
        },
        include: {
            dao: true
        }
    })

    const dao = await (
        await prisma.dao.findMany({})
    ).filter(
        (dao) =>
            dao.name.toLowerCase().replace(' ', '') ==
            from.toLowerCase().replace(' ', '')
    )[0]

    const userProposals = await prisma.proposal.findMany({
        where: {
            AND: [
                {
                    dao: {
                        name:
                            from == 'any'
                                ? {
                                      in: userSubscriptions.map(
                                          (sub) => sub.dao.name
                                      )
                                  }
                                : {
                                      equals: String(dao?.name)
                                  }
                    }
                },
                {
                    timeend: Boolean(active)
                        ? {
                              lte: new Date(
                                  Date.now() + Number(end * 24 * 60 * 60 * 1000)
                              )
                          }
                        : {
                              gte: new Date(
                                  Date.now() - Number(end * 24 * 60 * 60 * 1000)
                              )
                          }
                },
                {
                    state: Boolean(active)
                        ? {
                              in: [ProposalState.ACTIVE, ProposalState.PENDING]
                          }
                        : {
                              in: [
                                  ProposalState.QUEUED,
                                  ProposalState.DEFEATED,
                                  ProposalState.EXECUTED,
                                  ProposalState.EXPIRED,
                                  ProposalState.SUCCEEDED,
                                  ProposalState.HIDDEN,
                                  ProposalState.UNKNOWN
                              ]
                          }
                },
                voteStatusQuery
            ]
        },
        orderBy: {
            timeend: Boolean(active) ? 'asc' : 'desc'
        },
        include: {
            dao: true,
            daohandler: true,
            votes: {
                where: {
                    voteraddress: {
                        in:
                            proxy == 'any'
                                ? user?.voters.map((voter) => voter.address)
                                : [proxy]
                    }
                }
            }
        }
    })

    const result =
        userProposals.map(async (proposal) => {
            let highestScore = 0.0
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

                for (let i = 0; i < scores.length; i++) {
                    if (
                        parseFloat(String(scores[i]?.toString())) > highestScore
                    ) {
                        highestScore = parseFloat(String(scores[i]?.toString()))
                        highestScoreIndex = i
                    }
                }

                highestScoreChoice = String(proposal.choices[highestScoreIndex])
            }

            return {
                daoName: proposal.dao.name,
                daoHandlerId: proposal.daohandlerid,
                daoHandlerType: proposal.daohandler.type,
                onchain: proposal.daohandler.type == 'SNAPSHOT' ? false : true,
                daoPicture: proposal.dao.picture,
                proposalTitle: proposal.name,
                state: proposal.state,
                proposalLink: proposal.url,
                timeEnd: proposal.timeend,
                voted: user
                    ? String(
                          proposal.votes.map((vote: Vote) => vote.choice)
                              .length > 0
                      )
                    : 'not-connected',
                highestScoreChoice: highestScoreChoice,
                highestScore: highestScore,
                scoresTotal: parseFloat(
                    proposal.scorestotal?.toString() ?? '0.0'
                ),
                passedQuorum:
                    Number(proposal.quorum) < Number(proposal.scorestotal)
            }
        }) ?? []

    return Promise.all(result)
}

export const isUpToDate = async (daohandlerid: string) => {
    const session = await getServerSession(authOptions())
    const userAddress = session?.user?.name ?? ''

    const user = await prisma.user.findFirst({
        where: {
            address: { equals: userAddress }
        },
        include: {
            voters: true
        }
    })

    const voterHandlers = await prisma.voterhandler.findMany({
        where: {
            daohandlerid: { equals: daohandlerid },
            voter: { id: { in: user?.voters.map((v) => v.id) } }
        }
    })

    let uptodate = true

    voterHandlers.map((vh) => {
        if (!vh.uptodate) uptodate = false
    })

    return uptodate
}

export default async function Table(props: {
    from?: string
    end?: number
    voted?: string
    proxy?: string
}) {
    const proposals = await getProposals(
        props.from ?? 'any',
        props.end ?? 90,
        props.voted ?? 'any',
        props.proxy ?? 'any'
    )

    return (
        <div className={`mt-[16px] flex flex-col`}>
            <div className='flex w-full flex-col lg:hidden'>
                {proposals.map((proposal, index) => (
                    <MobilePastProposal key={index} proposal={proposal} />
                ))}
            </div>
            <div className='hidden lg:flex'>
                <table className='w-full table-auto border-separate border-spacing-y-[4px] text-left'>
                    <thead className='h-[56px] bg-black text-white'>
                        <tr>
                            <th className='h-[56px] w-[200px] items-center pl-[16px]'>
                                <div className='flex gap-1'>
                                    <div>DAO</div>
                                </div>
                            </th>
                            <th className='h-[56px] items-center'>
                                <div className='flex gap-1'>
                                    <div>Proposal Title</div>
                                </div>
                            </th>
                            <th className='h-[56px] w-[250px] items-center font-normal'>
                                <div className='flex gap-1'>
                                    <div>Ended on</div>
                                    <Image
                                        loading='eager'
                                        priority={true}
                                        width={24}
                                        height={24}
                                        src={'/assets/Icon/SortDiscending.svg'}
                                        alt='ended-on'
                                    />
                                </div>
                            </th>
                            <th className='h-[56px] w-[200px] items-center text-center font-normal'>
                                <div className='flex justify-center gap-1'>
                                    <div>Vote status</div>
                                </div>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {proposals.map((proposal, index: number) => (
                            <PastProposal key={index} proposal={proposal} />
                        ))}
                    </tbody>
                </table>
            </div>

            {proposals.length == 0 && (
                <div className='h-[96px] w-full items-center justify-evenly pt-10 text-center text-[#EDEDED]'>
                    There are no past proposals.
                </div>
            )}
        </div>
    )
}
