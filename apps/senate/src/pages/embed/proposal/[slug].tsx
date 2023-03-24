import { useRouter } from 'next/router'
import { TrpcClientProvider, trpc } from '../../../server/trpcClient'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { RouterOutputs } from '../../../server/trpc'

dayjs.extend(relativeTime)

const EmbeddedProposalHome = () => {
    return (
        <TrpcClientProvider>
            <EmbeddedProposal />
        </TrpcClientProvider>
    )
}

const EmbeddedProposal = () => {
    const router = useRouter()
    const { slug } = router.query

    const { data: proposalData } = trpc.public.proposal.useQuery({
        id: String(slug) ?? ''
    })

    return (
        <div>
            {proposalData && (
                <div>
                    <Proposal proposal={proposalData} />
                </div>
            )}
        </div>
    )
}

const Proposal = (props: { proposal: RouterOutputs['public']['proposal'] }) => {
    return (
        <div className='flex flex-col'>
            <div>{props.proposal?.dao.name}</div>
            <div>{props.proposal?.name}</div>
            <div>{props.proposal?.timeStart.toISOString()}</div>
            <div>{props.proposal?.timeEnd.toISOString()}</div>
            <div>{props.proposal?.quorum}</div>
            <div>{props.proposal?.choices?.toString()}</div>
            <div>{props.proposal?.scores?.toString()}</div>
        </div>
    )
}

export default EmbeddedProposalHome
