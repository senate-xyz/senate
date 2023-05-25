import Image from 'next/image'
import { extend } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
    type Vote,
    prisma,
    type JsonArray,
    DAOHandlerType,
    ProposalState
} from '@senate/database'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../pages/api/auth/[...nextauth]'
import 'server-only'

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
                                      ),
                                      mode: 'insensitive'
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
                    if (parseFloat(scores[i]!.toString()) > highestScore) {
                        highestScore = parseFloat(scores[i]!.toString())
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
                scoresTotal: proposal.scorestotal,
                passedQuorum:
                    Number(proposal.quorum) < Number(proposal.scorestotal)
            }
        }) ?? []

    return Promise.all(result)
}
const isUpToDate = async (daohandlerid: string) => {
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
                    /* @ts-expect-error Server Component */
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
                            /* @ts-expect-error Server Component */
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

const MobilePastProposal = async (props: {
    proposal: {
        daoName: string
        daoHandlerId: string
        daoHandlerType: string
        onchain: boolean
        daoPicture: string
        proposalTitle: string
        state: string
        proposalLink: string
        timeEnd: Date
        voted: string
        highestScoreChoice: string
        highestScore: number
        scoresTotal: number
    }
}) => {
    const loading = !(await isUpToDate(props.proposal.daoHandlerId))
    const daoPicture = await fetch(
        process.env.NEXT_PUBLIC_WEB_URL + props.proposal.daoPicture + '.svg'
    )
        .then((res) => {
            if (res.ok)
                return (
                    process.env.NEXT_PUBLIC_WEB_URL +
                    props.proposal.daoPicture +
                    '.svg'
                )
            else
                return (
                    process.env.NEXT_PUBLIC_WEB_URL +
                    '/assets/Project_Icons/placeholder_medium.png'
                )
        })
        .catch(() => {
            return (
                process.env.NEXT_PUBLIC_WEB_URL +
                '/assets/Project_Icons/placeholder_medium.png'
            )
        })

    return (
        <div className='my-1 flex w-full flex-col items-start bg-[#121212] text-[#EDEDED]'>
            <div className='flex w-full flex-col gap-2 p-2'>
                <div className='flex flex-row gap-2'>
                    <div className='flex flex-col items-center justify-start gap-2'>
                        <div className='w-[48px] border border-b-2 border-l-0 border-r-2 border-t-0'>
                            <Image
                                loading='eager'
                                priority={true}
                                width={48}
                                height={48}
                                src={daoPicture}
                                alt={props.proposal.daoName}
                            />
                        </div>

                        <div>
                            {props.proposal.onchain ? (
                                <Image
                                    loading='eager'
                                    priority={true}
                                    width={50}
                                    height={15}
                                    src={'/assets/Icon/OnChainProposal.svg'}
                                    alt='off-chain'
                                />
                            ) : (
                                <Image
                                    loading='eager'
                                    priority={true}
                                    width={50}
                                    height={14}
                                    src={'/assets/Icon/OffChainProposal.svg'}
                                    alt='off-chain'
                                />
                            )}
                        </div>
                    </div>
                    <div className='cursor-pointer self-center pb-5 hover:underline'>
                        <a
                            href={
                                props.proposal.proposalLink.includes(
                                    'snapshot.org'
                                )
                                    ? props.proposal.proposalLink +
                                      '?app=senate'
                                    : props.proposal.proposalLink
                            }
                            target='_blank'
                            rel='noreferrer'
                        >
                            <div className='text-[15px] font-normal leading-[23px]'>
                                {props.proposal.proposalTitle}
                            </div>
                        </a>
                    </div>
                </div>

                <div className='flex w-full flex-row items-end justify-between'>
                    <div className='flex w-3/4 flex-col justify-between'>
                        {props.proposal.daoHandlerType ==
                        DAOHandlerType.MAKER_EXECUTIVE ? (
                            <div>
                                <div className='text-[21px] leading-[26px] text-white'>
                                    {(props.proposal.state ==
                                        ProposalState.EXECUTED ||
                                        props.proposal.state ==
                                            ProposalState.QUEUED) && (
                                        <div>Passed</div>
                                    )}
                                    {props.proposal.state ==
                                        ProposalState.EXPIRED && (
                                        <div>Did not pass</div>
                                    )}
                                </div>
                                <div className='text-[18px] leading-[26px] text-white'>
                                    with{' '}
                                    {(
                                        props.proposal.scoresTotal /
                                        1000000000000000000
                                    ).toFixed(2)}{' '}
                                    MKR
                                </div>
                            </div>
                        ) : (
                            <div>
                                {props.proposal.highestScoreChoice !=
                                'undefined' ? (
                                    <div>
                                        <div className='flex flex-row'>
                                            <div className='text-[21px] leading-[26px] text-white'>
                                                {props.proposal
                                                    .highestScoreChoice.length >
                                                27
                                                    ? props.proposal.highestScoreChoice.slice(
                                                          0,
                                                          27
                                                      ) + '...'
                                                    : props.proposal
                                                          .highestScoreChoice}
                                            </div>
                                        </div>
                                        <div className='bg-[#262626]'>
                                            <div
                                                style={{
                                                    width: `${(
                                                        (props.proposal
                                                            .highestScore /
                                                            props.proposal
                                                                .scoresTotal) *
                                                        100
                                                    ).toFixed(0)}%`
                                                }}
                                                className={`h-full bg-[#EDEDED]`}
                                            >
                                                <div className='px-2 text-black'>
                                                    {(
                                                        (props.proposal
                                                            .highestScore /
                                                            props.proposal
                                                                .scoresTotal) *
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
                            </div>
                        )}
                        <div className='text-[12px] font-normal leading-[19px]'>
                            {`on ${new Date(
                                props.proposal.timeEnd
                            ).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric'
                            })} at ${new Date(
                                props.proposal.timeEnd
                            ).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                timeZone: 'UTC',
                                hour12: false
                            })} UTC
                    `}
                        </div>
                    </div>
                    {loading && (
                        <div className='p-2'>
                            <div className='flex w-full flex-col items-center'>
                                <Image
                                    loading='eager'
                                    priority={true}
                                    src='/assets/Senate_Logo/Loading/senate-loading-onDark.svg'
                                    alt='loading'
                                    width={32}
                                    height={32}
                                />
                            </div>
                        </div>
                    )}
                    {!loading && (
                        <div className='p-2'>
                            {props.proposal.voted == 'true' && (
                                <div className='flex w-full flex-col items-center'>
                                    <Image
                                        loading='eager'
                                        priority={true}
                                        src='/assets/Icon/Voted.svg'
                                        alt='voted'
                                        width={32}
                                        height={32}
                                    />
                                </div>
                            )}
                            {props.proposal.voted == 'false' && (
                                <div className='flex w-full flex-col items-center'>
                                    <Image
                                        loading='eager'
                                        priority={true}
                                        src='/assets/Icon/NotVotedYet.svg'
                                        alt='voted'
                                        width={32}
                                        height={32}
                                    />
                                </div>
                            )}
                            {props.proposal.voted == 'not-connected' && (
                                <div className='p-2 text-center text-[17px] leading-[26px] text-white'>
                                    Connect wallet to see your vote status
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const PastProposal = async (props: {
    proposal: {
        daoName: string
        daoHandlerId: string
        daoHandlerType: string
        onchain: boolean
        daoPicture: string
        proposalTitle: string
        state: string
        proposalLink: string
        timeEnd: Date
        voted: string
        highestScoreChoice: string
        highestScore: number
        scoresTotal: number
        passedQuorum: boolean
    }
}) => {
    const loading = !(await isUpToDate(props.proposal.daoHandlerId))
    const daoPicture = await fetch(
        process.env.NEXT_PUBLIC_WEB_URL + props.proposal.daoPicture + '.svg'
    )
        .then((res) => {
            if (res.ok)
                return (
                    process.env.NEXT_PUBLIC_WEB_URL +
                    props.proposal.daoPicture +
                    '.svg'
                )
            else
                return (
                    process.env.NEXT_PUBLIC_WEB_URL +
                    '/assets/Project_Icons/placeholder_medium.png'
                )
        })
        .catch(() => {
            return (
                process.env.NEXT_PUBLIC_WEB_URL +
                '/assets/Project_Icons/placeholder_medium.png'
            )
        })

    return (
        <tr className='h-[96px] w-full items-center justify-evenly bg-[#121212] text-[#EDEDED] '>
            <td className='hidden lg:table-cell'>
                <div className='m-[12px] flex w-max flex-row items-center gap-[8px]'>
                    <div className='border border-b-2 border-l-0 border-r-2 border-t-0'>
                        <Image
                            loading='eager'
                            priority={true}
                            width={64}
                            height={64}
                            src={daoPicture}
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
                                    loading='eager'
                                    priority={true}
                                    width={94}
                                    height={26}
                                    src={'/assets/Icon/OnChainProposal.svg'}
                                    alt='off-chain'
                                />
                            ) : (
                                <Image
                                    loading='eager'
                                    priority={true}
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
            <td className='hidden cursor-pointer hover:underline lg:table-cell'>
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
            <td className='hidden lg:table-cell'>
                <div className='flex h-[96px] flex-col justify-between py-2'>
                    {props.proposal.daoHandlerType ==
                    DAOHandlerType.MAKER_EXECUTIVE ? (
                        <div className='text-[21px] leading-[26px] text-white'>
                            <div className='mb-1 flex flex-row gap-2'>
                                {(props.proposal.state ==
                                    ProposalState.EXECUTED ||
                                    props.proposal.state ==
                                        ProposalState.QUEUED) && (
                                    <div className='flex flex-row gap-2'>
                                        <div className='h-[24px] w-[24px] bg-[#D9D9D9]'>
                                            <Image
                                                loading='eager'
                                                priority={true}
                                                width={24}
                                                height={24}
                                                src={'/assets/Icon/Check.svg'}
                                                alt='off-chain'
                                            />
                                        </div>

                                        <div>Passed</div>
                                    </div>
                                )}
                                {props.proposal.state ==
                                    ProposalState.EXPIRED && (
                                    <div>
                                        <div className='h-[24px] w-[24px] bg-[#D9D9D9]'></div>
                                        <div>Did not pass</div>
                                    </div>
                                )}
                            </div>
                            <div className='text-[18px] leading-[26px] text-white'>
                                with{' '}
                                {(
                                    props.proposal.scoresTotal /
                                    1000000000000000000
                                ).toFixed(2)}{' '}
                                MKR
                            </div>
                        </div>
                    ) : props.proposal.highestScoreChoice != 'undefined' ? (
                        <div>
                            <div className='mb-1 flex flex-row gap-2'>
                                {props.proposal.passedQuorum ? (
                                    <div className='h-[24px] w-[24px] bg-[#D9D9D9]'>
                                        <Image
                                            loading='eager'
                                            priority={true}
                                            width={24}
                                            height={24}
                                            src={'/assets/Icon/Check.svg'}
                                            alt='off-chain'
                                        />
                                    </div>
                                ) : (
                                    <div className='h-[24px] w-[24px] bg-[#D9D9D9]'></div>
                                )}
                                <div className='text-[21px] leading-[26px] text-white'>
                                    {props.proposal.highestScoreChoice.length >
                                    27
                                        ? props.proposal.highestScoreChoice.slice(
                                              0,
                                              27
                                          ) + '...'
                                        : props.proposal.highestScoreChoice}
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
            <td className='hidden lg:table-cell'>
                {loading && (
                    <div className='text-end'>
                        <div className='flex w-full flex-col items-center'>
                            <Image
                                loading='eager'
                                priority={true}
                                src='/assets/Senate_Logo/Loading/senate-loading-onDark.svg'
                                alt='loading'
                                width={32}
                                height={32}
                            />
                        </div>
                    </div>
                )}

                {!loading && (
                    <div className='text-end'>
                        {props.proposal.voted == 'true' && (
                            <div className='flex w-full flex-col items-center'>
                                <Image
                                    loading='eager'
                                    priority={true}
                                    src='/assets/Icon/Voted.svg'
                                    alt='voted'
                                    width={32}
                                    height={32}
                                />
                                <div className='text-[18px]'>Voted</div>
                            </div>
                        )}
                        {props.proposal.voted == 'false' && (
                            <div className='flex w-full flex-col items-center'>
                                <Image
                                    loading='eager'
                                    priority={true}
                                    src='/assets/Icon/DidntVote.svg'
                                    alt='voted'
                                    width={32}
                                    height={32}
                                />
                                <div className='text-[18px]'>Didn’t Vote</div>
                            </div>
                        )}
                        {props.proposal.voted == 'not-connected' && (
                            <div className='p-2 text-center text-[17px] leading-[26px] text-white'>
                                Connect wallet to see your vote status
                            </div>
                        )}
                    </div>
                )}
            </td>
        </tr>
    )
}
