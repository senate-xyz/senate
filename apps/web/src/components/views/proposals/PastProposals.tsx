import { inferProcedureOutput } from '@trpc/server'
import dayjs from 'dayjs'
import { useState } from 'react'
import { AppRouter } from '../../../server/trpc/router/_app'
import { trpc } from '../../../utils/trpc'
import Image from 'next/image'

const endedOnOptions: { name: string; time: number }[] = [
    {
        name: 'Last 24 hours',
        time: 24 * 60 * 60 * 1000,
    },
    {
        name: 'Last 7 days',
        time: 7 * 24 * 60 * 60 * 1000,
    },
    {
        name: 'Last 30 days',
        time: 30 * 24 * 60 * 60 * 1000,
    },
    {
        name: 'Last 90 days',
        time: 90 * 24 * 60 * 60 * 1000,
    },
]

const voteStatus: { id: number; name: string }[] = [
    {
        id: 0,
        name: 'Any status',
    },
    {
        id: 1,
        name: 'Voted on',
    },
    {
        id: 2,
        name: 'Not voted on',
    },
]

export const PastProposals = () => {
    const followingDAOs = trpc.user.userSubscribedDAOs.useQuery()

    const [from, setFrom] = useState('any')
    const [endedOn, setEndedOn] = useState(24 * 60 * 60 * 1000)
    const [withVoteStatus, setWithVoteStatus] = useState(0)

    const filteredPastProposals = trpc.user.filteredPastProposals.useQuery({
        fromDao: from ?? 'any',
        endingIn: endedOn,
        withVoteStatus: withVoteStatus,
    })

    return (
        <div>
            <div className="flex flex-row gap-5">
                <div className="flex flex-col">
                    <label htmlFor="fromDao">From</label>
                    <select
                        id="fromDao"
                        onChange={(e) => {
                            setFrom(e.target.value)
                        }}
                    >
                        <option key="any" value="any">
                            Any
                        </option>
                        {followingDAOs.data?.map((followingDAO) => {
                            return (
                                <option
                                    key={followingDAO.id}
                                    value={followingDAO.id}
                                >
                                    {followingDAO.name}
                                </option>
                            )
                        })}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="endedOn">Ended on</label>
                    <select
                        id="endedOn"
                        onChange={(e) => {
                            setEndedOn(Number(e.target.value))
                        }}
                    >
                        {endedOnOptions.map((endedOn) => {
                            return (
                                <option key={endedOn.time} value={endedOn.time}>
                                    {endedOn.name}
                                </option>
                            )
                        })}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="voteStatus">With vote status of</label>
                    <select
                        id="voteStatus"
                        onChange={(e) => {
                            setWithVoteStatus(Number(e.target.value))
                        }}
                    >
                        {voteStatus.map((status) => {
                            return (
                                <option key={status.id} value={status.id}>
                                    {status.name}
                                </option>
                            )
                        })}
                    </select>
                </div>
            </div>
            <div className="flex flex-col">
                <table className="w-full table-auto border-separate border-spacing-y-4 text-left">
                    <thead>
                        <th>DAO</th>
                        <th>Proposal Title</th>
                        <th>Ended on</th>
                        <th>Vote status</th>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                        {filteredPastProposals.data?.map((proposal) => (
                            <PastProposal proposal={proposal} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const PastProposal = (props: {
    proposal: inferProcedureOutput<
        AppRouter['user']['filteredActiveProposals']
    >[0]
}) => {
    return (
        <tr className="h-32 w-full items-center justify-evenly bg-slate-300">
            <td>
                <div className="m-2 flex w-max flex-row items-center">
                    <Image
                        width="88"
                        height="88"
                        src={props.proposal.dao.picture}
                        alt={props.proposal.dao.name}
                    />
                    <p>{props.proposal.dao.name}</p>
                </div>
            </td>
            <td className="cursor-pointer hover:underline">
                <a href={props.proposal.url} target="_blank" rel="noreferrer">
                    <p>{props.proposal.name}</p>
                </a>
            </td>
            <td>
                <p>{dayjs(props.proposal.timeEnd).fromNow()}</p>
            </td>
            <td>
                <p>
                    {props.proposal.votes.map((vote) =>
                        vote.options.map((options) => options.optionName)
                    ).length > 0
                        ? 'Voted - ' +
                          props.proposal.votes.map((vote) =>
                              vote.options.map((options) => options.optionName)
                          )
                        : 'Not voted yet'}
                </p>
            </td>
        </tr>
    )
}
