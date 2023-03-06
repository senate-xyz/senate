import Image from 'next/image'
import { extend } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Vote, prisma, JsonArray } from '@senate/database'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../pages/api/auth/[...nextauth]'

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
            name: { equals: userAddress }
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
                        voterAddress: {
                            in:
                                proxy == 'any'
                                    ? user?.voters.map((voter) => voter.address)
                                    : proxy
                        }
                    }
                }
            }

            break
        case 'yes':
            voteStatusQuery = {
                votes: {
                    some: {
                        voterAddress: {
                            in:
                                proxy == 'any'
                                    ? user?.voters.map((voter) => voter.address)
                                    : proxy
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
            userId: user?.id
        },
        include: {
            dao: true
        }
    })

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
                                : String(from)
                    }
                },
                {
                    timeEnd: Boolean(active)
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
            daoHandler: true,
            votes: {
                where: {
                    voterAddress: {
                        in:
                            proxy == 'any'
                                ? user?.voters.map((voter) => voter.address)
                                : proxy
                    }
                }
            }
        }
    })

    const result =
        userProposals.map((proposal) => {
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

            return {
                daoName: proposal.dao.name,
                onchain: proposal.daoHandler.type == 'SNAPSHOT' ? false : true,
                daoPicture: proposal.dao.picture,
                proposalTitle: proposal.name,
                proposalLink: proposal.url,
                timeEnd: proposal.timeEnd,
                voted: user
                    ? proposal.votes.map((vote: Vote) => vote.choice).length > 0
                    : false,
                highestScoreChoice: highestScoreChoice,
                highestScore: highestScore,
                scoresTotal: proposal.scoresTotal
            }
        }) ?? []

    return result
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
                        <th className='h-[56px] w-[200px] items-center font-normal'>
                            <div className='flex gap-1'>
                                <div>Ended on</div>
                                <Image
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
                        /* @ts-expect-error Server Component */
                        <ActiveProposal key={index} proposal={proposal} />
                    ))}
                </tbody>
            </table>

            {proposals.length == 0 && (
                <div className='h-[96px] w-full items-center justify-evenly pt-10 text-center text-[#EDEDED]'>
                    Subscribe to some DAOs to see their proposals.
                </div>
            )}
        </div>
    )
}

const ActiveProposal = async (props: {
    proposal: {
        daoName: string
        onchain: boolean
        daoPicture: string
        proposalTitle: string
        proposalLink: string
        timeEnd: Date
        voted: boolean
        highestScoreChoice: string
        highestScore: number
        scoresTotal: number
    }
}) => {
    return (
        <tr className='h-[96px] w-full items-center justify-evenly bg-[#121212] text-[#EDEDED]'>
            <td>
                <div className='m-[12px] flex w-max flex-row items-center gap-[8px]'>
                    <div className='border border-b-2 border-r-2 border-t-0 border-l-0'>
                        <Image
                            width={64}
                            height={64}
                            src={props.proposal.daoPicture + '.svg'}
                            alt={props.proposal.daoName}
                        />
                    </div>
                    <div className='flex flex-col gap-2 pl-2'>
                        <div className='text-[24px] font-light leading-[30px]'>
                            {props.proposal.daoName}
                        </div>
                        <div>
                            {props.proposal.onchain ? (
                                <Image
                                    width={94}
                                    height={26}
                                    src={'/assets/Icon/OnChainProposal.svg'}
                                    alt='off-chain'
                                />
                            ) : (
                                <Image
                                    width={94}
                                    height={26}
                                    src={'/assets/Icon/OffChainProposal.svg'}
                                    alt='off-chain'
                                />
                            )}
                        </div>
                    </div>
                </div>
            </td>
            <td className='cursor-pointer hover:underline'>
                <a
                    href={
                        props.proposal.proposalLink.includes('snapshot.org')
                            ? props.proposal.proposalLink + '?app=senate'
                            : props.proposal.proposalLink
                    }
                    target='_blank'
                    rel='noreferrer'
                >
                    <div className='pr-5 text-[18px] font-normal'>
                        {props.proposal.proposalTitle}
                    </div>
                </a>
            </td>
            <td>
                <div className='flex h-[96px] flex-col justify-between py-2'>
                    {props.proposal.highestScoreChoice != 'undefined' ? (
                        <div>
                            <div className='flex flex-row'>
                                <div className='text-[21px] leading-[26px] text-white'>
                                    {props.proposal.highestScoreChoice}
                                </div>
                            </div>
                            <div className='w-[340px] bg-[#262626]'>
                                <div
                                    style={{
                                        width: `${(
                                            (props.proposal.highestScore /
                                                props.proposal.scoresTotal) *
                                            100
                                        ).toFixed(0)}%`
                                    }}
                                    className={`h-full bg-[#EDEDED]`}
                                >
                                    <div className='px-2 text-black'>
                                        {(
                                            (props.proposal.highestScore /
                                                props.proposal.scoresTotal) *
                                            100
                                        ).toFixed(2)}
                                        %
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='text-[17px] leading-[26px] text-white'>
                            Unable to fetch results data
                        </div>
                    )}

                    <div className='text-[15px] leading-[19px]'>
                        {props.proposal.timeEnd.toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            second: 'numeric',
                            timeZone: 'UTC',
                            hour12: false
                        })}{' '}
                        UTC
                    </div>
                </div>
            </td>
            <td>
                <div className='text-end'>
                    {props.proposal.voted ? (
                        <div className='flex w-full flex-col items-center'>
                            <Image
                                src='/assets/Icon/Voted.svg'
                                alt='voted'
                                width={32}
                                height={32}
                            />
                            <div className='text-[18px]'>Voted</div>
                        </div>
                    ) : (
                        <div className='flex w-full flex-col items-center'>
                            <Image
                                src='/assets/Icon/DidntVote.svg'
                                alt='voted'
                                width={32}
                                height={32}
                            />
                            <div className='text-[18px]'>Didn’t Vote</div>
                        </div>
                    )}
                </div>
            </td>
        </tr>
    )
}
