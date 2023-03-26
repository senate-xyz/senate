import Image from 'next/image'
import dayjs, { extend } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { type Vote, prisma } from '@senate/database'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../../pages/api/auth/[...nextauth]'

extend(relativeTime)

const getProposals = async (
    from: string,
    end: number,
    voted: string,
    proxy: string
) => {
    const active = true

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

    const dao = await (
        await prisma.dAO.findMany({})
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
            return {
                daoName: proposal.dao.name,
                onchain: proposal.daoHandler.type == 'SNAPSHOT' ? false : true,
                daoPicture: proposal.dao.picture,
                proposalTitle: proposal.name,
                proposalLink: proposal.url,
                timeEnd: proposal.timeEnd,
                voted: user
                    ? String(
                          proposal.votes.map((vote: Vote) => vote.choice)
                              .length > 0
                      )
                    : 'not-connected'
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
        props.end ?? 365,
        props.voted ?? 'any',
        props.proxy ?? 'any'
    )

    return (
        <div className={`mt-[16px] flex flex-col`}>
            <div className='flex w-full flex-col lg:hidden'>
                {proposals.map((proposal, index) => (
                    /* @ts-expect-error Server Component */
                    <MobileActiveProposal key={index} proposal={proposal} />
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
                            <th className='h-[56px] w-[200px] items-center font-normal'>
                                <div className='flex gap-1'>
                                    <div>Ends in</div>
                                    <Image
                                        loading='eager'
                                        priority={true}
                                        width={24}
                                        height={24}
                                        src={'/assets/Icon/SortDiscending.svg'}
                                        alt='ends-in'
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
                        {proposals.map((proposal, index) => (
                            /* @ts-expect-error Server Component */
                            <ActiveProposal key={index} proposal={proposal} />
                        ))}
                    </tbody>
                </table>
            </div>

            {proposals.length == 0 && (
                <div className='h-[96px] w-full items-center justify-evenly pt-10 text-center text-[#EDEDED]'>
                    There are no active proposals.
                </div>
            )}
        </div>
    )
}

const MobileActiveProposal = async (props: {
    proposal: {
        daoName: string
        onchain: boolean
        daoPicture: string
        proposalTitle: string
        proposalLink: string
        timeEnd: Date
        voted: string
    }
}) => {
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
                    <div className='flex flex-col items-center gap-2'>
                        <div className='w-[48px] border border-b-2 border-r-2 border-t-0 border-l-0'>
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
                    <div className='flex flex-col justify-end'>
                        <div className='text-start text-[21px] font-semibold leading-[26px]'>
                            {dayjs(props.proposal.timeEnd).fromNow()}
                        </div>
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

                    <div className='self-end p-2'>
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
                </div>
            </div>
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
        voted: string
    }
}) => {
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
                    <div className='border border-b-2 border-r-2 border-t-0 border-l-0'>
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
                <div className='flex flex-col justify-between gap-2'>
                    <div className='text-[21px] font-semibold leading-[26px]'>
                        {dayjs(props.proposal.timeEnd).fromNow()}
                    </div>
                    <div className='text-[15px] font-normal leading-[19px]'>
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
            </td>
            <td className='hidden lg:table-cell'>
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
                                src='/assets/Icon/NotVotedYet.svg'
                                alt='voted'
                                width={32}
                                height={32}
                            />
                            <div className='text-[18px]'>Not Voted Yet</div>
                        </div>
                    )}
                    {props.proposal.voted == 'not-connected' && (
                        <div className='p-2 text-center text-[17px] leading-[26px] text-white'>
                            Connect wallet to see your vote status
                        </div>
                    )}
                </div>
            </td>
        </tr>
    )
}
