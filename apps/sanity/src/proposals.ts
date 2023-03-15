import {
    prisma,
    DAOHandler,
    DAOHandlerType,
    Decoder,
    Proposal
} from '@senate/database'

import { schedule } from 'node-cron'
import superagent from 'superagent'
import { log_sanity } from '@senate/axiom'

type GraphQLProposal = {
    id: string
    title: string
    created: number
    start: number
    end: number
    link: string
}

export const proposalSanity = schedule('15 * * * *', async () => {
    log_sanity.log({
        level: 'info',
        message: '[PROPOSALS] Starting sanity check for snapshot proposals',
        date: new Date(Date.now())
    })

    const SEARCH_FROM: number = Date.now() - 12 * 60 * 60 * 1000 // hours * minutes * seconds * milliseconds
    const SEARCH_TO: number = Date.now() - 15 * 60 * 1000 //  minutes * seconds * milliseconds

    try {
        const daoHandlers: DAOHandler[] = await prisma.dAOHandler.findMany({
            where: {
                type: DAOHandlerType.SNAPSHOT
            }
        })

        await checkAndSanitizeProposalsRoutine(
            daoHandlers,
            SEARCH_FROM,
            SEARCH_TO
        )
        
    } catch (error) {
        log_sanity.log({
            level: 'error',
            message: `[PROPOSALS] Failed sanity check for snapshot proposals`,
            error: error
        })
    }

    log_sanity.log({
        level: 'info',
        message: '[PROPOSALS] FINISHED sanity check for snapshot proposals'
    })
})

const checkAndSanitizeProposalsRoutine = async (
    daoHandlers: DAOHandler[],
    fromTimestamp: number,
    toTimestamp: number
) => {
    for (const daoHandler of daoHandlers) {
        const proposalsFromDatabase = await fetchProposalsFromDatabase(
            daoHandler.id,
            new Date(fromTimestamp),
            new Date(toTimestamp)
        )

        const proposalsFromSnapshotAPI: GraphQLProposal[] =
            await fetchProposalsFromSnapshotAPI(
                (daoHandler.decoder as Decoder).space,
                Math.floor(fromTimestamp / 1000),
                Math.floor(toTimestamp / 1000)
            )

        const proposalsNotOnSnapshot: Proposal[] = proposalsFromDatabase.filter(
            (proposal: Proposal) => {
                return !proposalsFromSnapshotAPI
                    .map((proposal: GraphQLProposal) => proposal.id)
                    .includes(proposal.externalId)
            }
        )

        const proposalsNotInDatabase: GraphQLProposal[] =
            proposalsFromSnapshotAPI.filter((proposal: GraphQLProposal) => {
                return !proposalsFromDatabase
                    .map((proposal: Proposal) => proposal.externalId)
                    .includes(proposal.id)
            })

        console.log(proposalsNotOnSnapshot, proposalsNotInDatabase)

        if (proposalsNotOnSnapshot.length > 0) {
            // we have proposals which have been removed from snapshot. need to purge them from the database.
            log_sanity.log({
                level: 'warn',
                message: `Found ${proposalsNotOnSnapshot.length} proposals to remove`,
                proposals: proposalsNotOnSnapshot
            })

            await prisma.proposal.deleteMany({
                where: {
                    daoHandlerId: daoHandler.id,
                    id: {
                        in: proposalsNotOnSnapshot.map(
                            (proposal) => proposal.id
                        )
                    }
                }
            })
        }

        if (proposalsNotInDatabase.length > 0) {
            // we are missing proposals from the database. need to set the snapshotIndex backwards to fetch them
            log_sanity.log({
                level: 'warn',
                message: `Missing proposals: ${proposalsFromDatabase.length} proposals `,
                proposals: proposalsNotOnSnapshot
            })
        }
    }
}

const fetchProposalsFromSnapshotAPI = async (
    space: string,
    searchFrom: number,
    searchTo: number
): Promise<GraphQLProposal[]> => {
    const graphqlQuery = `{
        proposals(
            first:1000,
            orderBy: "created",
            orderDirection: asc,
            where: {
                space: "${space}",
                created_gte: ${searchFrom},
                created_lte: ${searchTo}
            }
        ) 
        {
            id
            title
            body
            created
            start
            end
            link
        }
    }`

    return (await superagent
        .get('https://hub.snapshot.org/graphql')
        .query({
            query: graphqlQuery
        })
        .timeout({
            response: 10000,
            deadline: 30000
        })
        .retry(3, (err, res) => {
            if (err) return true
            if (res.status == 200) return false
            return true
        })
        .then(
            (response: {
                body: { data: { proposals: GraphQLProposal[] } }
            }) => {
                return response.body.data.proposals
            }
        )) as GraphQLProposal[]
}

const fetchProposalsFromDatabase = async (
    daoHandlerId: string,
    searchFrom: Date,
    searchTo: Date
): Promise<Proposal[]> => {
    return await prisma.proposal.findMany({
        where: {
            daoHandlerId: daoHandlerId,
            timeCreated: {
                gte: searchFrom,
                lte: searchTo
            }
        }
    })
}