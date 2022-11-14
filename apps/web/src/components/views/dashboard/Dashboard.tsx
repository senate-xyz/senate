import { useSession } from 'next-auth/react'

import { trpc } from '../../../utils/trpc'
import { DashboardTable } from './table/DashboardTable'

export const DashboardHeader = () => <p>Dashboard</p>

export const DashboardView = () => {
    const trpcUtil = trpc.useContext()
    const refreshMyVotes = trpc.user.refreshMyVotes.useMutation({
        onSuccess: () => {
            voters.refetch()
        },
    })
    const voters = trpc.user.voters.useQuery()

    const { data: session } = useSession()

    const proposals = session
        ? trpc.user.userProposals.useQuery()
        : trpc.public.proposals.useQuery()

    if (!proposals.data) return <div>Loading</div>

    return (
        <div className="w-full">
            <p>Dashboard</p>
            <div className="w-full">
                {voters.data
                    ?.map((voter) => voter.refreshStatus)
                    .every((status) => status == 'DONE') ? (
                    <button
                        className={
                            'w-auto self-end m-2 bg-green-200 p-1 rounded-sm'
                        }
                        onClick={() => {
                            refreshMyVotes.mutate()
                            trpcUtil.invalidate()
                        }}
                        disabled={false}
                    >
                        Refresh my votes
                    </button>
                ) : (
                    <button
                        className={
                            'w-auto self-end m-2 bg-red-200 p-1 rounded-sm'
                        }
                        disabled={true}
                    >
                        Refresh my votes - pending...
                    </button>
                )}

                <div>
                    Refresh status: <br />
                    {voters.data?.map((voter) => (
                        <div className="flex flex-col">
                            {voter.address} - {voter.refreshStatus}
                        </div>
                    ))}
                </div>
                <DashboardTable proposals={proposals.data} />
            </div>
        </div>
    )
}

export const Dashboard = () => {
    return <DashboardView />
}

export default Dashboard
