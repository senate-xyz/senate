import { ConnectButton } from '@rainbow-me/rainbowkit'
import { inferProcedureOutput } from '@trpc/server'
import dayjs from 'dayjs'
import { useState } from 'react'
import { AppRouter } from '../../../server/trpc/router/_app'
import Image from 'next/image'

import { trpc } from '../../../utils/trpc'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ActiveProposals } from './ActiveProposals'
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

export const ProposalsView = () => {
    const [currentTab, setCurrentTab] = useState(tabs[0])

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
                    {currentTab == tabs[0] && <ActiveProposals />}
                </div>
            </div>
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
