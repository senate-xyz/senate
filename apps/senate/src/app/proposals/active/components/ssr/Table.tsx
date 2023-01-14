import Image from 'next/image'
import dayjs, { extend } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { unstable_getServerSession } from 'next-auth'

import { Vote, prisma } from '@senate/database'
import { authOptions } from '../../../../../pages/api/auth/[...nextauth]'
extend(relativeTime)

const getProposals = async (from: string, end: number, voted: string) => {
    const active = true

    const session = await unstable_getServerSession(authOptions())

    const user = await prisma.user.findFirst({
        where: {
            name: { equals: String(session?.user?.name) }
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
                            in: user?.voters.map((voter) => voter.address)
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
                            in: user?.voters.map((voter) => voter.address)
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
        }
    })

    const userProposals = await prisma.proposal.findMany({
        where: {
            AND: [
                {
                    daoId:
                        from == 'any'
                            ? {
                                  in: userSubscriptions.map((sub) => sub.daoId)
                              }
                            : String(from)
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
            votes: {
                where: {
                    voterAddress: {
                        in: user?.voters.map((voter) => voter.address)
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
            voted: user
                ? proposal.votes.map((vote: Vote) => vote.choice).length > 0
                : false
        }
    })
    return result
}

export default async function Table(props: {
    from?: string
    end?: number
    voted?: string
}) {
    const proposals = await getProposals(
        props.from ?? 'any',
        props.end ?? 365,
        props.voted ?? 'any'
    )

    return (
        <div className='mt-[16px] flex flex-col'>
            <table
                className='w-full table-auto border-separate border-spacing-y-[4px] text-left'
                data-testid='table'
            >
                <thead className='h-[56px] bg-black text-white'>
                    <tr>
                        <th className='w-[200px] pl-[16px] font-normal'>DAO</th>
                        <th className='font-normal'>Proposal Title</th>
                        <th className='w-[200px]  font-normal'>Ends in</th>
                        <th className='w-[200px] text-center font-normal'>
                            Vote status
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {proposals.map(
                        (
                            proposal: {
                                daoName: string
                                daoPicture: string
                                proposalTitle: string
                                proposalLink: string
                                timeEnd: Date
                                voted: boolean
                            },
                            index: number
                        ) => (
                            <ActiveProposal
                                data-testid={`proposal-${index}`}
                                key={index}
                                proposal={proposal}
                            />
                        )
                    )}
                </tbody>
            </table>
        </div>
    )
}

const ActiveProposal = (props: {
    proposal: {
        daoName: string
        daoPicture: string
        proposalTitle: string
        proposalLink: string
        timeEnd: Date
        voted: boolean
    }
}) => {
    return (
        <tr
            className='h-[96px] w-full items-center justify-evenly bg-[#121212] text-[#EDEDED]'
            data-testid='active-proposal'
        >
            <td data-testid='col1'>
                <div className='m-[12px] flex w-max flex-row items-center gap-[8px]'>
                    <div className='border border-b-2 border-r-2 border-t-0 border-l-0'>
                        <Image
                            width={64}
                            height={64}
                            src={props.proposal.daoPicture + '.svg'}
                            alt={props.proposal.daoName}
                            data-testid='dao-picture'
                        />
                    </div>
                    <div
                        className='text-[24px] font-thin'
                        data-testid='dao-name'
                    >
                        {props.proposal.daoName}
                    </div>
                </div>
            </td>
            <td className='cursor-pointer hover:underline' data-testid='col2'>
                <a
                    href={props.proposal.proposalLink}
                    target='_blank'
                    rel='noreferrer'
                    data-testid='proposal-url'
                >
                    <div
                        className='pr-5 text-[18px] font-normal'
                        data-testid='proposal-name'
                    >
                        {props.proposal.proposalTitle}
                    </div>
                </a>
            </td>
            <td data-testid='col3'>
                <div className='text-[21px]' data-testid='proposal-ending'>
                    {dayjs(props.proposal.timeEnd).fromNow()}
                </div>
            </td>
            <td data-testid='col4'>
                <div className='text-end'>
                    {props.proposal.voted ? (
                        <div
                            className='flex w-full flex-col items-center'
                            data-testid='proposal-voted'
                        >
                            <Image
                                src='/assets/Icon/Voted.svg'
                                alt='voted'
                                width={32}
                                height={32}
                            />
                            <div className='text-[18px]'>Voted</div>
                        </div>
                    ) : (
                        <div
                            className='flex w-full flex-col items-center'
                            data-testid='proposal-not-voted'
                        >
                            <Image
                                src='/assets/Icon/NotVotedYet.svg'
                                alt='voted'
                                width={32}
                                height={32}
                            />
                            <div className='text-[18px]'>Not Voted Yet</div>
                        </div>
                    )}
                </div>
            </td>
        </tr>
    )
}
