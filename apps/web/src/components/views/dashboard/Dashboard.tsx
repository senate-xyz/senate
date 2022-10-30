import { useSession } from 'next-auth/react'

import { trpc } from '../../../utils/trpc'
import { DashboardTable } from './table/DashboardTable'

export const DashboardHeader = () => <p>Dashboard</p>

export const DashboardView = (props: { proposals }) => {
    const refreshAllProposals = trpc.useMutation('public.refreshAllProposals')
    const refreshAllVotes = trpc.useMutation('public.refreshAllVotes')
    const refreshAllProxyVotes = trpc.useMutation('public.refreshAllProxyVotes')

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
                <DashboardTable proposals={props.proposals} />
            </div>
        </div>
    )
}

export const Dashboard = () => {
    const { data: session } = useSession()

    const proposals = trpc.useQuery([
        session ? 'user.proposals' : 'public.proposals',
    ])

    if (!proposals.data) return <div>Loading</div>

    return <DashboardView proposals={proposals} />
}

export default Dashboard
