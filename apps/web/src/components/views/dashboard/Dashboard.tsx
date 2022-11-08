import { useSession } from 'next-auth/react'

import { trpc } from '../../../utils/trpc'
import { DashboardTable } from './table/DashboardTable'

export const DashboardHeader = () => <p>Dashboard</p>

export const DashboardView = () => {
    const trpcUtil = trpc.useContext()
    const refreshMyVotes = trpc.user.refreshMyVotes.useMutation()
    const refreshStatus = trpc.user.refreshStatus.useQuery()

    const { data: session } = useSession()

    const proposals = session
        ? trpc.user.userProposals.useQuery()
        : trpc.public.proposals.useQuery()

    if (!proposals.data) return <div>Loading</div>

    return (
        <div className="w-full">
            <p>Dashboard</p>
            <div className="w-full">
                <button
                    className="w-auto self-end m-2 bg-red-200 p-1 rounded-sm"
                    onClick={() => {
                        refreshMyVotes.mutate()
                        trpcUtil.invalidate()
                    }}
                    disabled={
                        refreshStatus.data?.status == 'PENDING' ||
                        refreshStatus.data?.status == 'NEW'
                    }
                >
                    Refresh my votes
                </button>
                Refresh status: {refreshStatus.data?.status}
                <DashboardTable proposals={proposals.data} />
            </div>
        </div>
    )
}

export const Dashboard = () => {
    return <DashboardView />
}

export default Dashboard
