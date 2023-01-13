import useSWR from 'swr'
import Image from 'next/image'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function InnerTable(props: {
    from: string
    endingIn: number
    withVoteStatus: number
}) {
    const proposals = useSWR(
        [
            `/api/user/proposals?from=${props.from}&endingIn=${props.endingIn}&withVoteStatus=${props.withVoteStatus}&active=true`
        ],
        fetcher
    )

    return (
        <div className='mt-[16px] flex flex-col'>
            {proposals.data?.length ? (
                <table
                    className='w-full table-auto border-separate border-spacing-y-[4px] text-left'
                    data-testid='table'
                >
                    <thead className='h-[56px] bg-black text-white'>
                        <tr>
                            <th className='w-[200px] pl-[16px] font-normal'>
                                DAO
                            </th>
                            <th className='font-normal'>Proposal Title</th>
                            <th className='w-[200px]  font-normal'>Ends in</th>
                            <th className='w-[200px] text-center font-normal'>
                                Vote status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {proposals.data?.map((proposal: any, index: number) => (
                            <ActiveProposal
                                data-testid={`proposal-${index}`}
                                key={index}
                                proposal={proposal}
                            />
                        ))}
                    </tbody>
                </table>
            ) : (
                <div data-testid='no-proposals'>
                    No active proposals for current selection
                </div>
            )}
        </div>
    )
}

const ActiveProposal = (props: { proposal: any }) => {
    return (
        <tr
            className='h-[96px] w-full items-center justify-evenly bg-[#121212] text-[#EDEDED]'
            data-testid='active-proposal'
        >
            <td data-testid='col1'>
                <div className='m-[12px] flex w-max flex-row items-center gap-[8px]'>
                    <div className='border border-b-2 border-r-2 border-t-0 border-l-0'>
                        <Image
                            width={64}
                            height={64}
                            src={props.proposal.daoPicture + '.svg'}
                            alt={props.proposal.daoName}
                            data-testid='dao-picture'
                        />
                    </div>
                    <div
                        className='text-[24px] font-thin'
                        data-testid='dao-name'
                    >
                        {props.proposal.daoName}
                    </div>
                </div>
            </td>
            <td className='cursor-pointer hover:underline' data-testid='col2'>
                <a
                    href={props.proposal.proposalLink}
                    target='_blank'
                    rel='noreferrer'
                    data-testid='proposal-url'
                >
                    <div
                        className='text-[18px] font-normal'
                        data-testid='proposal-name'
                    >
                        {props.proposal.proposalTitle}
                    </div>
                </a>
            </td>
            <td data-testid='col3'>
                <div className='text-[21px]' data-testid='proposal-ending'>
                    {dayjs(props.proposal.timeEnd).fromNow()}
                </div>
            </td>
            <td data-testid='col4'>
                <div className='text-end'>
                    {props.proposal.voted ? (
                        <div
                            className='flex w-full flex-col items-center'
                            data-testid='proposal-voted'
                        >
                            <Image
                                src='/assets/Icon/Voted.svg'
                                alt='voted'
                                width={32}
                                height={32}
                            />
                            <div className='text-[18px]'>Voted</div>
                        </div>
                    ) : (
                        <div
                            className='flex w-full flex-col items-center'
                            data-testid='proposal-not-voted'
                        >
                            <Image
                                src='/assets/Icon/NotVotedYet.svg'
                                alt='voted'
                                width={32}
                                height={32}
                            />
                            <div className='text-[18px]'>Not Voted Yet</div>
                        </div>
                    )}
                </div>
            </td>
        </tr>
    )
}
