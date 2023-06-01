import { DAOHandlerType, ProposalState } from '@senate/database'
import { isUpToDate } from './Table'
import Image from 'next/image'

export const MobilePastProposal = async (props: {
    proposal: {
        daoName: string
        daoHandlerId: string
        daoHandlerType: string
        onchain: boolean
        daoPicture: string
        proposalTitle: string
        state: string
        proposalLink: string
        timeEnd: Date
        voted: string
        highestScoreChoice: string
        highestScore: number
        scoresTotal: number
        passedQuorum: boolean
    }
}) => {
    const loading = !(await isUpToDate(props.proposal.daoHandlerId))
    const daoPicture = await fetch(
        process.env.NEXT_PUBLIC_WEB_URL + props.proposal.daoPicture + '.svg'
    )
        .then((res) => {
            if (res.ok)
                return (
                    process.env.NEXT_PUBLIC_WEB_URL +
                    props.proposal.daoPicture +
                    '.svg'
                )
            else
                return (
                    process.env.NEXT_PUBLIC_WEB_URL +
                    '/assets/Project_Icons/placeholder_medium.png'
                )
        })
        .catch(() => {
            return (
                process.env.NEXT_PUBLIC_WEB_URL +
                '/assets/Project_Icons/placeholder_medium.png'
            )
        })

    return (
        <div className='my-1 flex w-full flex-col items-start bg-[#121212] text-[#EDEDED]'>
            <div className='flex w-full flex-col gap-2 p-2'>
                <div className='flex flex-row gap-2'>
                    <div className='flex flex-col items-center justify-start gap-2'>
                        <div className='w-[48px] border border-b-2 border-l-0 border-r-2 border-t-0'>
                            <Image
                                loading='eager'
                                priority={true}
                                width={48}
                                height={48}
                                src={daoPicture}
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
                    <div className='flex w-3/4 flex-col justify-between gap-1'>
                        {props.proposal.daoHandlerType ==
                            DAOHandlerType.MAKER_EXECUTIVE && (
                            <div>
                                <div className='text-[21px] leading-[26px] text-white'>
                                    {(props.proposal.state ==
                                        ProposalState.EXECUTED ||
                                        props.proposal.state ==
                                            ProposalState.QUEUED) && (
                                        <div className='flex flex-row gap-2'>
                                            <div className='h-[24px] w-[24px] items-center justify-center bg-[#D9D9D9]'>
                                                <Image
                                                    loading='eager'
                                                    priority={true}
                                                    width={22}
                                                    height={22}
                                                    src={
                                                        '/assets/Icon/Check.svg'
                                                    }
                                                    alt='off-chain'
                                                />
                                            </div>

                                            <div>Passed</div>
                                        </div>
                                    )}
                                    {props.proposal.state ==
                                        ProposalState.EXPIRED && (
                                        <div className='flex flex-row gap-2'>
                                            <div className='h-[24px] w-[24px] items-center justify-center bg-[#D9D9D9]'>
                                                <Image
                                                    loading='eager'
                                                    priority={true}
                                                    width={22}
                                                    height={22}
                                                    src={
                                                        '/assets/Icon/NoCheck.svg'
                                                    }
                                                    alt='off-chain'
                                                />
                                            </div>

                                            <div>Did not pass</div>
                                        </div>
                                    )}
                                </div>
                                <div className='text-[18px] leading-[26px] text-white'>
                                    with{' '}
                                    {(
                                        props.proposal.scoresTotal /
                                        1000000000000000000
                                    ).toFixed(2)}{' '}
                                    MKR
                                </div>
                            </div>
                        )}
                        {props.proposal.daoHandlerType !=
                            DAOHandlerType.MAKER_EXECUTIVE &&
                            props.proposal.state != 'HIDDEN' &&
                            props.proposal.highestScoreChoice !=
                                'undefined' && (
                                <div>
                                    {props.proposal.passedQuorum ? (
                                        <div>
                                            <div className='flex flex-row gap-2'>
                                                <div className='flex h-[24px] w-[24px] items-center justify-center bg-[#D9D9D9]'>
                                                    <Image
                                                        loading='eager'
                                                        priority={true}
                                                        width={22}
                                                        height={22}
                                                        src={
                                                            '/assets/Icon/Check.svg'
                                                        }
                                                        alt='off-chain'
                                                    />
                                                </div>
                                                <div className='truncate text-[21px] leading-[26px] text-white'>
                                                    {
                                                        props.proposal
                                                            .highestScoreChoice
                                                    }
                                                </div>
                                            </div>
                                            <div className='mt-1 bg-[#262626]'>
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
                                        <div className='flex flex-row gap-2'>
                                            <div className='flex h-[24px] w-[24px] items-center justify-center bg-[#D9D9D9]'>
                                                <Image
                                                    loading='eager'
                                                    priority={true}
                                                    width={22}
                                                    height={22}
                                                    src={
                                                        '/assets/Icon/NoCheck.svg'
                                                    }
                                                    alt='off-chain'
                                                />
                                            </div>
                                            <div className='text-[21px] leading-[26px] text-white'>
                                                No Quorum
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                        {props.proposal.state == 'HIDDEN' && (
                            <div>
                                <div className='flex flex-row gap-2'>
                                    <div className='flex h-[24px] w-[24px] items-center justify-center bg-[#D9D9D9]'>
                                        <Image
                                            loading='eager'
                                            priority={true}
                                            width={22}
                                            height={22}
                                            src={'/assets/Icon/Hidden.svg'}
                                            alt='off-chain'
                                        />
                                    </div>

                                    <div className='text-[21px] leading-[26px] text-white'>
                                        Hidden Results
                                    </div>
                                </div>
                                <div className='mt-1 bg-[#262626]'>
                                    <div
                                        style={{
                                            width: '100%'
                                        }}
                                        className={`h-full bg-[#EDEDED]`}
                                    >
                                        <div className='px-2 text-black'>
                                            ??
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {props.proposal.daoHandlerType !=
                            DAOHandlerType.MAKER_EXECUTIVE &&
                            props.proposal.highestScoreChoice ==
                                'undefined' && (
                                <div className='text-[17px] leading-[26px] text-white'>
                                    Unable to fetch results data
                                </div>
                            )}

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
                    {loading && (
                        <div className='p-2'>
                            <div className='flex w-full flex-col items-center'>
                                <Image
                                    loading='eager'
                                    priority={true}
                                    src='/assets/Senate_Logo/Loading/senate-loading-onDark.svg'
                                    alt='loading'
                                    width={32}
                                    height={32}
                                />
                            </div>
                        </div>
                    )}
                    {!loading && (
                        <div className='p-2'>
                            {props.proposal.voted == 'true' && (
                                <div className='flex w-full flex-col items-center'>
                                    <Image
                                        loading='eager'
                                        priority={true}
                                        src='/assets/Icon/Voted.svg'
                                        alt='voted'
                                        width={32}
                                        height={32}
                                    />
                                </div>
                            )}
                            {props.proposal.voted == 'false' && (
                                <div className='flex w-full flex-col items-center'>
                                    <Image
                                        loading='eager'
                                        priority={true}
                                        src='/assets/Icon/NotVotedYet.svg'
                                        alt='voted'
                                        width={32}
                                        height={32}
                                    />
                                </div>
                            )}
                            {props.proposal.voted == 'not-connected' && (
                                <div className='p-2 text-center text-[17px] leading-[26px] text-white'>
                                    Connect wallet to see your vote status
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
