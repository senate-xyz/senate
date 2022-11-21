import relativeTime from 'dayjs/plugin/relativeTime'

import { extend as dayJsExtend } from 'dayjs'
import Link from 'next/link'
import NavBar from '../../../../components/navbar/NavBar'
import { PastProposals } from '../../../../components/views/proposals/PastProposals'
import DashboardHeader from '../../../../components/DashboardHeader'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

dayJsExtend(relativeTime)

const tabs: { id: number; name: string; color: string; link: string }[] = [
    {
        id: 0,
        name: 'Active Proposals',
        color: 'text-gray-400 text-5xl cursor-pointer',
        link: '/dashboard/proposals/active',
    },
    {
        id: 1,
        name: 'Past Proposals',
        color: 'text-gray-100 text-5xl cursor-pointer',
        link: '/dashboard/proposals/past',
    },
]

export const ProposalsView = () => {
    const router = useRouter()
    const { user } = router.query
    const session = useSession()

    return (
        <div className="w-full p-5">
            <div className="flex flex-col">
                <div className="flex w-full flex-row gap-10">
                    {tabs.map((tab) => {
                        return (
                            <Link
                                key={tab.id}
                                className={tab.color}
                                href={
                                    tab.link +
                                    `?user=${
                                        session.data?.user?.name
                                            ? session.data?.user?.name
                                            : String(user)
                                    }`
                                }
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
        </div>
    )
}

export const Proposals = () => {
    return (
        <div className="flex flex-row">
            <NavBar />
            <DashboardHeader title="Proposals" component={<ProposalsView />} />
        </div>
    )
}

export default Proposals
