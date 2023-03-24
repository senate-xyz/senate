import { useRouter } from 'next/router'
import { TrpcClientProvider, trpc } from '../../../server/trpcClient'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { RouterOutputs } from '../../../server/trpc'
import Image from 'next/image'
import '../../../styles/globals.css'

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
        <div className='my-1 flex w-full flex-col items-start bg-[#121212] text-[#EDEDED]'>
            <div className='flex w-full flex-col gap-2 p-2'>
                <div className='flex flex-row gap-2'>
                    <div className='flex flex-col items-center justify-start gap-2'>
                        <div className='w-[48px] border border-b-2 border-r-2 border-t-0 border-l-0'>
                            <Image
                                loading='eager'
                                priority={true}
                                width={48}
                                height={48}
                                src={props.proposal.daoPicture + '_medium.png'}
                                alt={props.proposal.daoName}
                            />
                        </div>

                        <div>
                            {props.proposal.onchain ? (
                                <Image
                                    loading='eager'
                                    priority={true}
                                    width={50}
                                    height={15}
                                    src={'/assets/Icon/OnChainProposal.svg'}
                                    alt='off-chain'
                                />
                            ) : (
                                <Image
                                    loading='eager'
                                    priority={true}
                                    width={50}
                                    height={14}
                                    src={'/assets/Icon/OffChainProposal.svg'}
                                    alt='off-chain'
                                />
                            )}
                        </div>
                    </div>
                    <div className='cursor-pointer self-center pb-5 hover:underline'>
                        <a
                            href={
                                props.proposal.proposalLink.includes(
                                    'snapshot.org'
                                )
                                    ? props.proposal.proposalLink +
                                      '?app=senate'
                                    : props.proposal.proposalLink
                            }
                            target='_blank'
                            rel='noreferrer'
                        >
                            <div className='text-[15px] font-normal leading-[23px]'>
                                {props.proposal.proposalTitle}
                            </div>
                        </a>
                    </div>
                </div>

                <div className='flex w-full flex-row items-end justify-between'>
                    <div className='flex w-3/4 flex-col justify-between'>
                        <div>
                            {props.proposal.highestScoreChoice !=
                            'undefined' ? (
                                <div>
                                    <div className='flex flex-row'>
                                        <div className='text-[21px] leading-[26px] text-white'>
                                            {props.proposal.highestScoreChoice}
                                        </div>
                                    </div>
                                    <div className='bg-[#262626]'>
                                        <div
                                            style={{
                                                width: `${(
                                                    (props.proposal
                                                        .highestScore /
                                                        props.proposal
                                                            .scoresTotal) *
                                                    100
                                                ).toFixed(0)}%`
                                            }}
                                            className={`h-full bg-[#EDEDED]`}
                                        >
                                            <div className='px-2 text-black'>
                                                {(
                                                    (props.proposal
                                                        .highestScore /
                                                        props.proposal
                                                            .scoresTotal) *
                                                    100
                                                ).toFixed(2)}
                                                %
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className='text-[17px] leading-[26px] text-white'>
                                    Unable to fetch results data
                                </div>
                            )}
                        </div>
                        <div className='text-[12px] font-normal leading-[19px]'>
                            {`on ${new Date(
                                props.proposal.timeEnd
                            ).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric'
                            })} at ${new Date(
                                props.proposal.timeEnd
                            ).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                timeZone: 'UTC',
                                hour12: false
                            })} UTC
                    `}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmbeddedProposalHome
