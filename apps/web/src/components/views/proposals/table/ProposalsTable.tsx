import { inferProcedureOutput } from '@trpc/server'
import { AppRouter } from '../../../../server/trpc/router/_app'
import { ProposalsRow } from './ProposalsRow'

const tableHeader = ['DAO', 'Proposal', 'Time left', 'Vote']

export const ProposalsThead = () => (
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

export const ProposalsTable = (props: {
    proposals:
        | inferProcedureOutput<AppRouter['user']['userProposals']>
        | inferProcedureOutput<AppRouter['public']['proposals']>
}) => {
    return (
        <div className="w-full">
            <table className="w-full text-left text-sm">
                <ProposalsThead />
                <tbody>
                    {props.proposals.map((proposal, index) => {
                        return <ProposalsRow key={index} proposal={proposal} />
                    })}
                </tbody>
            </table>
        </div>
    )
}
