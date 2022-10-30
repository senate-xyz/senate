import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Image from 'next/image'

import { PrismaJsonObject, TrackerProposalType } from '@senate/common-types'
import { inferProcedureOutput } from '@trpc/server'
import { AppRouter } from '../../../../server/trpc/router/_app'

dayjs.extend(relativeTime)

const tableHeader = ['Proposal', 'Time Ag', 'Voted']

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
    selectedDao
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
                            return (
                                <tr key={proposal.id} className="border-b">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            <Image
                                                className="absolute bottom-0 left-0"
                                                src={proposal.dao.picture}
                                                width="40"
                                                height="40"
                                                alt="dao image"
                                            />

                                            <a
                                                href={(
                                                    proposal.data as PrismaJsonObject
                                                )['url']?.toString()}
                                            >
                                                <p>{proposal.name}</p>
                                            </a>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        {dayjs(
                                            (proposal.data as PrismaJsonObject)[
                                                'timeEnd'
                                            ]?.toString()
                                        ).fromNow()}
                                    </td>
                                    <td className="py-4 px-6">idk</td>
                                </tr>
                            )
                        })}
                </tbody>
            </table>
        </div>
    )
}
