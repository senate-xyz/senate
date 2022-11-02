import { inferProcedureOutput } from '@trpc/server'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Image from 'next/image'
import Link from 'next/link'
import { AppRouter } from '../../../../server/trpc/router/_app'

dayjs.extend(relativeTime)

export const DashboardRow = (props: {
    proposal:
        | inferProcedureOutput<AppRouter['user']['userProposals']>[0]
        | inferProcedureOutput<AppRouter['public']['proposals']>[0]
}) => {
    if (!props.proposal.data) return <div>Invalid</div>

    return (
        <tr className="border-b">
            <td className="py-4 px-6">
                <div className="relative">
                    <Image
                        className="absolute bottom-0 left-0"
                        src={props.proposal.dao.picture}
                        width="40"
                        height="40"
                        alt="dao image"
                    />
                    <Image
                        className="absolute bottom-0 left-0"
                        width="20"
                        height="20"
                        alt="proposal type"
                        src={
                            props.proposal.proposalType == 'SNAPSHOT'
                                ? 'https://avatars.githubusercontent.com/u/72904068?s=200&v=4'
                                : 'https://assets.coingecko.com/coins/images/279/thumb/ethereum.png'
                        }
                    />
                </div>
            </td>
            <td className="py-4 px-6">
                <div>
                    <Link href={props.proposal.url}>{props.proposal.name}</Link>
                </div>
            </td>

            <td className="py-4 px-6">
                {dayjs(props.proposal.data['timeEnd'] * 1000).fromNow(false)}
            </td>

            <td className="py-4 px-6">
                {props.proposal.votes.map((vote) =>
                    vote.options.map(
                        (option) =>
                            `${option.optionName} voted by ${option.voterAddress}`
                    )
                )}
            </td>
        </tr>
    )
}
