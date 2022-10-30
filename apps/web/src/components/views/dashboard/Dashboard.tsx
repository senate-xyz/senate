import { TRPCContext } from '@trpc/react-query/shared'
import { useSession } from 'next-auth/react'

import { trpc } from '../../../utils/trpc'
import { DashboardTable } from './table/DashboardTable'

export const DashboardHeader = () => <p>Dashboard</p>

export const DashboardView = () => {
    const refreshAllProposals = trpc.public.refreshAllProposals.useMutation()
    const refreshAllVotes = trpc.public.refreshAllVotes.useMutation()
    const refreshAllProxyVotes = trpc.public.refreshAllProxyVotes.useMutation()

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
                        refreshAllProposals.mutate()
                    }}
                >
                    Refresh all proposals
                </button>

                <button
                    className="w-auto self-end m-2 bg-red-200 p-1 rounded-sm"
                    onClick={() => {
                        refreshAllVotes.mutate()
                    }}
                >
                    Refresh all votes
                </button>

                <button
                    className="w-auto self-end m-2 bg-red-200 p-1 rounded-sm"
                    onClick={() => {
                        refreshAllProxyVotes.mutate()
                    }}
                >
                    Refresh all proxy votes
                </button>

                <DashboardTable proposals={proposals.data} />
            </div>
        </div>
    )
}

export const Dashboard = () => {
    return <DashboardView />
}

export default Dashboard
