import { inferProcedureOutput } from '@trpc/server'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { AppRouter } from '../../server/trpc/router/_app'
import { trpc } from '../../utils/trpc'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

const endingInOptions: { name: string; time: number }[] = [
    {
        name: 'Any day',
        time: 365 * 24 * 60 * 60 * 1000
    },
    {
        name: '7 days',
        time: 7 * 24 * 60 * 60 * 1000
    },
    {
        name: '5 days',
        time: 5 * 24 * 60 * 60 * 1000
    },
    {
        name: '3 days',
        time: 3 * 24 * 60 * 60 * 1000
    },
    {
        name: '1 days',
        time: 1 * 24 * 60 * 60 * 1000
    }
]

const voteStatus: { id: number; name: string }[] = [
    {
        id: 0,
        name: 'Any status'
    },
    {
        id: 1,
        name: 'Voted on'
    },
    {
        id: 2,
        name: 'Not voted on'
    }
]

export const ActiveProposals = () => {
    const session = useSession()

    const router = useRouter()
    const { fromFilter } = router.query

    const [from, setFrom] = useState('any')
    const [endingIn, setEndingIn] = useState(365 * 24 * 60 * 60 * 1000)
    const [withVoteStatus, setWithVoteStatus] = useState(0)

    const followingDAOs = trpc.user.subscriptions.subscribedDAOs.useQuery()
    const filteredActiveProposals =
        trpc.user.proposals.filteredActiveProposals.useQuery({
            fromDao: from,
            endingIn: endingIn,
            withVoteStatus: withVoteStatus
        })

    useEffect(() => {
        if (fromFilter) {
            setFrom(String(fromFilter))
        }
    }, [fromFilter])

    useEffect(() => {
        followingDAOs.refetch()
        filteredActiveProposals.refetch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session])

    return (
        <div className=''>
            <div className='flex flex-row gap-5' data-testid='active-proposals'>
                <div className='flex h-[38px] w-[300px] flex-row items-center'>
                    <label
                        className='flex h-full min-w-max items-center bg-black py-[9px] px-[12px] text-[15px] text-white'
                        htmlFor='fromDao'
                    >
                        From
                    </label>
                    <select
                        className='h-full w-full text-black'
                        id='fromDao'
                        onChange={(e) => {
                            setFrom(e.target.value)
                        }}
                        value={from}
                        data-testid='from-selector'
                    >
                        <option key='any' value='any'>
                            Any
                        </option>
                        {followingDAOs.data?.map((followingDAO) => {
                            return (
                                <option
                                    key={followingDAO.id}
                                    value={followingDAO.id}
                                    data-testid={`select-${followingDAO.id}`}
                                >
                                    {followingDAO.name}
                                </option>
                            )
                        })}
                    </select>
                </div>

                <div className='flex h-[38px] w-[300px] flex-row items-center'>
                    <label
                        className='flex h-full min-w-max items-center bg-black py-[9px] px-[12px] text-[15px] text-white'
                        htmlFor='endingIn'
                    >
                        <div>Ending in</div>
                    </label>
                    <select
                        className='h-full w-full text-black'
                        id='endingIn'
                        onChange={(e) => {
                            setEndingIn(Number(e.target.value))
                        }}
                        data-testid='ending-selector'
                    >
                        {endingInOptions.map((endingIn) => {
                            return (
                                <option
                                    key={endingIn.time}
                                    value={endingIn.time}
                                    data-testid={`select-${endingIn.time}`}
                                >
                                    {endingIn.name}
                                </option>
                            )
                        })}
                    </select>
                </div>

                <div className='flex h-[38px] w-[300px] flex-row items-center'>
                    <label
                        className='flex h-full min-w-max items-center bg-black py-[9px] px-[12px] text-[15px] text-white'
                        htmlFor='voteStatus'
                    >
                        <div>With Vote Status of</div>
                    </label>
                    <select
                        className='h-full w-full text-black'
                        id='voteStatus'
                        onChange={(e) => {
                            setWithVoteStatus(Number(e.target.value))
                        }}
                        data-testid='status-selector'
                    >
                        {voteStatus.map((status) => {
                            return (
                                <option
                                    key={status.id}
                                    value={status.id}
                                    data-testid={`select-${status.id}`}
                                >
                                    {status.name}
                                </option>
                            )
                        })}
                    </select>
                </div>
            </div>
            <div className='mt-[16px] flex flex-col'>
                {filteredActiveProposals.data?.length ? (
                    <table
                        className='w-full table-auto border-separate border-spacing-y-[4px] text-left'
                        data-testid='table'
                    >
                        <thead className='h-[56px] bg-black text-white'>
                            <tr>
                                <th className='w-[200px] pl-[16px] font-normal'>
                                    DAO
                                </th>
                                <th className='font-normal'>Proposal Title</th>
                                <th className='w-[200px]  font-normal'>
                                    Ends in
                                </th>
                                <th className='w-[200px] text-center font-normal'>
                                    Vote status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredActiveProposals.data?.map(
                                (proposal, index) => (
                                    <ActiveProposal
                                        data-testid={`proposal-${index}`}
                                        key={index}
                                        proposal={proposal}
                                    />
                                )
                            )}
                        </tbody>
                    </table>
                ) : (
                    <div data-testid='no-proposals'>
                        No active proposals for current selection
                    </div>
                )}
            </div>
        </div>
    )
}

const ActiveProposal = (props: {
    proposal: inferProcedureOutput<
        AppRouter['user']['proposals']['filteredActiveProposals']
    >[0]
}) => {
    const voted = props.proposal.votes.map((vote) => vote.choice).length > 0

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
                            src={props.proposal.dao.picture + '.svg'}
                            alt={props.proposal.dao.name}
                            data-testid='dao-picture'
                        />
                    </div>
                    <div
                        className='text-[24px] font-thin'
                        data-testid='dao-name'
                    >
                        {props.proposal.dao.name}
                    </div>
                </div>
            </td>
            <td className='cursor-pointer hover:underline' data-testid='col2'>
                <a
                    href={props.proposal.url}
                    target='_blank'
                    rel='noreferrer'
                    data-testid='proposal-url'
                >
                    <div
                        className='text-[18px] font-normal'
                        data-testid='proposal-name'
                    >
                        {props.proposal.name}
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
                    {voted ? (
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
