import { ConnectButton } from '@rainbow-me/rainbowkit'
import { inferProcedureOutput } from '@trpc/server'
import dayjs from 'dayjs'
import { useState } from 'react'
import { AppRouter } from '../../../server/trpc/router/_app'

import { trpc } from '../../../utils/trpc'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const tabs: { id: number; name: string }[] = [
    {
        id: 0,
        name: 'Active Proposals',
    },
    {
        id: 1,
        name: 'Past Proposals',
    },
]

const endingInOptions: { name: string; time: number }[] = [
    {
        name: 'Any day',
        time: 365 * 24 * 60 * 60 * 1000,
    },
    {
        name: '7 days',
        time: 7 * 24 * 60 * 60 * 1000,
    },
    {
        name: '5 days',
        time: 5 * 24 * 60 * 60 * 1000,
    },
    {
        name: '3 days',
        time: 3 * 24 * 60 * 60 * 1000,
    },
    {
        name: '1 days',
        time: 1 * 24 * 60 * 60 * 1000,
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

export const ProposalsView = () => {
    const followingDAOs = trpc.user.userSubscribedDAOs.useQuery()

    const [currentTab, setCurrentTab] = useState(tabs[0])
    const [from, setFrom] = useState(followingDAOs.data?.[0].id)
    const [endingIn, setEndingIn] = useState(365 * 24 * 60 * 60 * 1000)
    const [withVoteStatus, setWithVoteStatus] = useState(0)

    const filteredActiveProposals = trpc.user.filteredActiveProposals.useQuery({
        fromDao: from ?? 'undefined',
        endingIn: endingIn,
        withVoteStatus: withVoteStatus,
    })

    return (
        <div className="w-full p-5">
            <div className="flex flex-col">
                <div className="flex w-full flex-row gap-10">
                    {tabs.map((tab) => {
                        return (
                            <div
                                key={tab.id}
                                className={
                                    (currentTab.id == tab.id
                                        ? 'text-gray-100'
                                        : 'text-gray-400') + ' text-5xl'
                                }
                                onClick={() => {
                                    setCurrentTab(tab)
                                }}
                            >
                                {tab.name}
                            </div>
                        )
                    })}
                </div>
                <div className="mt-2">
                    {currentTab == tabs[0] && (
                        <div className="flex flex-row gap-5">
                            <div className="flex flex-col">
                                <label htmlFor="fromDao">From</label>
                                <select
                                    id="fromDao"
                                    onChange={(e) => {
                                        setFrom(e.target.value)
                                    }}
                                >
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
                                <label htmlFor="endingIn">Ending in</label>
                                <select
                                    id="endingIn"
                                    onChange={(e) => {
                                        setEndingIn(Number(e.target.value))
                                    }}
                                >
                                    {endingInOptions.map((endingIn) => {
                                        return (
                                            <option
                                                key={endingIn.time}
                                                value={endingIn.time}
                                            >
                                                {endingIn.name}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="voteStatus">
                                    With vote status of
                                </label>
                                <select
                                    id="voteStatus"
                                    onChange={(e) => {
                                        setWithVoteStatus(
                                            Number(e.target.value)
                                        )
                                    }}
                                >
                                    {voteStatus.map((status) => {
                                        return (
                                            <option
                                                key={status.id}
                                                value={status.id}
                                            >
                                                {status.name}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col">
                        {filteredActiveProposals.data?.map((proposal) => (
                            <ActiveProposal proposal={proposal} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

const ActiveProposal = (props: {
    proposal: inferProcedureOutput<
        AppRouter['user']['filteredActiveProposals']
    >[0]
}) => {
    return (
        <div className="my-2 flex h-32 w-full flex-row items-center justify-evenly bg-slate-300 p-2">
            <img width="88" src={props.proposal.dao.picture} />
            <p>{props.proposal.dao.name}</p>
            <p>{props.proposal.name}</p>
            <p>{dayjs(props.proposal.timeEnd).fromNow()}</p>
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
        </div>
    )
}

export const Proposals = () => {
    return (
        <div className="h-full w-full bg-slate-700">
            <div className="flex w-full flex-col">
                <div className="flex h-48 items-center justify-between bg-slate-800 px-10">
                    <h1 className="text-5xl">Proposals</h1>
                    <ConnectButton />
                </div>
                <ProposalsView />
            </div>
        </div>
    )
}

export default Proposals
