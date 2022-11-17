import { useSession } from 'next-auth/react'

import { trpc } from '../../../utils/trpc'
import { ProposalsTable } from './table/ProposalsTable'

export const ProposalsHeader = () => <p>Dashboard</p>

export const ProposalsView = () => {
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
                            'm-2 w-auto self-end rounded-sm bg-green-200 p-1'
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
                            'm-2 w-auto self-end rounded-sm bg-red-200 p-1'
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
                <ProposalsTable proposals={proposals.data} />
            </div>
        </div>
    )
}

export const Proposals = () => {
    return <ProposalsView />
}

export default Proposals
