import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Image from 'next/image'

import { TrackerProposalType } from '@senate/common-types'
import { inferProcedureOutput } from '@trpc/server'
import { AppRouter } from '../../../../server/trpc/router/_app'

dayjs.extend(relativeTime)

const tableHeader = ['Proposal', 'Time Ago', 'Voted']

export const TrackerThead = () => (
    <thead className="text-xs uppercase">
        <tr>
            {tableHeader.map((column, index) => {
                return (
                    <th scope="col" className="py-3 px-6" key={index}>
                        {column}
                    </th>
                )
            })}
        </tr>
    </thead>
)

export const TrackerTable = (props: {
    votes: inferProcedureOutput<AppRouter['tracker']['track']>
    selectedDao: string | undefined
}) => {
    if (!props.votes) return <div>Loading</div>
    return (
        <div>
            <table className="w-full text-left text-sm">
                <TrackerThead />

                <tbody>
                    {props.votes
                        .filter((vote) => vote.dao.name === props.selectedDao)
                        .map((proposal: TrackerProposalType) => {
                            return proposal.data ? (
                                <tr key={proposal.id} className="border-b">
                                    <td className="py-4 px-6">
                                        <div className="flex">
                                            <Image
                                                src={proposal.dao.picture}
                                                width="20"
                                                height="20"
                                                alt="dao image"
                                            />
                                            {proposal.proposalType}
                                            <Image
                                                width="20"
                                                height="20"
                                                alt="proposal type"
                                                src={
                                                    proposal.proposalType ==
                                                    'SNAPSHOT'
                                                        ? 'https://avatars.githubusercontent.com/u/72904068?s=200&v=4'
                                                        : 'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png'
                                                }
                                            />

                                            <a
                                                href={proposal.data[
                                                    'url'
                                                ]?.toString()}
                                            >
                                                <p>{proposal.name}</p>
                                            </a>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        {dayjs(
                                            proposal.data['timeEnd']
                                        ).fromNow()}
                                    </td>
                                    <td className="py-4 px-6">
                                        {proposal.votes.map((vote) => {
                                            return vote['options'][0][
                                                'optionName'
                                            ]
                                        })}
                                    </td>
                                </tr>
                            ) : (
                                <div>Invalid</div>
                            )
                        })}
                </tbody>
            </table>
        </div>
    )
}
