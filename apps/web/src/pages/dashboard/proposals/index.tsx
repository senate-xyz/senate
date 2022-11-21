import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useState } from 'react'

import relativeTime from 'dayjs/plugin/relativeTime'

import { extend as dayJsExtend } from 'dayjs'
import NavBar from '../../../components/navbar/NavBar'
import { PastProposals } from '../../../components/views/proposals/PastProposals'
import { ActiveProposals } from '../../../components/views/proposals/ActiveProposals'

dayJsExtend(relativeTime)

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
                                        : 'text-gray-400') +
                                    ' text-5xl cursor-pointer'
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
                    {currentTab == tabs[1] && <PastProposals />}
                </div>
            </div>
        </div>
    )
}

export const Proposals = () => {
    return (
        <div className="flex flex-row">
            <NavBar />
            <div className="min-h-screen w-full">
                <div className="h-full w-full bg-slate-700">
                    <div className="flex w-full flex-col">
                        <div className="flex h-48 items-center justify-between bg-slate-800 px-10">
                            <h1 className="text-5xl">Proposals</h1>
                            <ConnectButton />
                        </div>
                        <ProposalsView />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Proposals
