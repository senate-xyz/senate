import Image from 'next/image'
import dayjs, { extend } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { getServerSession } from 'next-auth'

import { Vote, prisma } from '@senate/database'
import { authOptions } from '../../../../../pages/api/auth/[...nextauth]'
import ConnectWalletModal from '../../../components/csr/ConnectWalletModal'
extend(relativeTime)

const getProposals = async (from: string, end: number, voted: string) => {
    const active = true

    const session = await getServerSession(authOptions())

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
            votes: {
                where: {
                    voterAddress: {
                        in: user?.voters.map((voter) => voter.address)
                    }
                }
            }
        }
    })

    const result =
        userProposals.map((proposal) => {
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
        }) ?? []

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
        <div className={`mt-[16px] flex flex-col`}>
            <ConnectWalletModal />
            <table className='w-full table-auto border-separate border-spacing-y-[4px] text-left'>
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
                            /* @ts-expect-error Server Component */
                            <ActiveProposal key={index} proposal={proposal} />
                        )
                    )}
                </tbody>
            </table>
        </div>
    )
}

const ActiveProposal = async (props: {
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
                    <div className='text-[24px] font-thin'>
                        {props.proposal.daoName}
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
                <div className='text-[21px]'>
                    {dayjs(props.proposal.timeEnd).fromNow()}
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
