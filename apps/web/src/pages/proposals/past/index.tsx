import relativeTime from 'dayjs/plugin/relativeTime'

import { extend as dayJsExtend } from 'dayjs'
import Link from 'next/link'
import NavBar from '../../../components/navbar/NavBar'
import { PastProposals } from '../../../components/proposals/PastProposals'
import DashboardHeader from '../../../components/Dashboard'

dayJsExtend(relativeTime)

const tabs: { id: number; name: string; color: string; link: string }[] = [
    {
        id: 0,
        name: 'Active Proposals',
        color: 'text-[#808080] text-[36px] font-light cursor-pointer',
        link: '/proposals/active',
    },
    {
        id: 1,
        name: 'Past Proposals',
        color: 'text-white text-[36px] font-bold cursor-pointer',
        link: '/proposals/past',
    },
]

export const ProposalsView = () => {
    return (
        <div className="flex grow flex-col bg-[#1E1B20] p-5">
            <div className="flex flex-row gap-10">
                {tabs.map((tab) => {
                    return (
                        <Link
                            key={tab.id}
                            className={tab.color}
                            href={tab.link}
                        >
                            {tab.name}
                        </Link>
                    )
                })}
            </div>
            <div className="mt-2">
                <PastProposals />
            </div>
        </div>
    )
}

export const Proposals = () => {
    return (
        <div className="flex min-h-screen flex-row">
            <NavBar />
            <DashboardHeader title="Proposals" component={<ProposalsView />} />
        </div>
    )
}

export default Proposals
