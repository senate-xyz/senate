import {
    prisma,
    type DAOHandler,
    DAOHandlerType,
    type Decoder,
    type Proposal
} from '@senate/database'

import { schedule } from 'node-cron'
import { log_sanity } from '@senate/axiom'
import { callApiWithDelayedRetries } from '../utils'

type GraphQLProposal = {
    id: string
    title: string
    created: number
    start: number
    end: number
    link: string
}

export const snapshotProposalsSanity = schedule('29 * * * *', async () => {
    log_sanity.log({
        level: 'info',
        message: '[PROPOSALS] Starting sanity check for snapshot proposals',
        date: new Date(Date.now())
    })

    const SEARCH_FROM: number = Date.now() - 240 * 60 * 60 * 1000 // hours * minutes * seconds * milliseconds
    const SEARCH_TO: number = Date.now() - 15 * 60 * 1000 //  minutes * seconds * milliseconds

    try {
        const daoHandlers: DAOHandler[] = await prisma.daohandler.findMany({
            where: {
                type: DAOHandlerType.SNAPSHOT
            }
        })

        for (const daoHandler of daoHandlers) {
            await checkAndSanitizeProposalsRoutine(
                daoHandler,
                SEARCH_FROM,
                SEARCH_TO
            )
        }

        log_sanity.log({
            level: 'info',
            message: '[PROPOSALS] FINISHED sanity check for snapshot proposals'
        })
        
    } catch (error) {
        log_sanity.log({
            level: 'error',
            message: `[PROPOSALS] Failed sanity check for snapshot proposals`,
            error: error
        })
    }

})

const checkAndSanitizeProposalsRoutine = async (
    daoHandler: DAOHandler,
    fromTimestamp: number,
    toTimestamp: number
) => {

    console.log("Fetching from db")
    const proposalsFromDatabase = await fetchProposalsFromDatabase(
        daoHandler.id,
        new Date(fromTimestamp),
        new Date(toTimestamp)
    )

    console.log("Fetching from snapshot")
    const proposalsFromSnapshotAPI: GraphQLProposal[] =
        await fetchProposalsFromSnapshotAPI(
            (daoHandler.decoder as Decoder).space,
            Math.floor(fromTimestamp / 1000),
            Math.floor(toTimestamp / 1000)
        )

    console.log("Computing stuff")
    // ========== CHECK FOR PROPOSALS WHICH SHOULD BE DELETED FROM DATABASE ==============
    const proposalsNotOnSnapshot: Proposal[] = proposalsFromDatabase.filter(
        (proposal: Proposal) => {
            return !proposalsFromSnapshotAPI
                .map((proposal: GraphQLProposal) => proposal.id)
                .includes(proposal.externalid)
        }
    )
    
    if (proposalsNotOnSnapshot.length > 0) {
        // we have proposals which have been removed from snapshot. need to purge them from the database.
        log_sanity.log({
            level: 'warn',
            message: `Found ${proposalsNotOnSnapshot.length} proposals to remove`,
            proposals: proposalsNotOnSnapshot.map(proposal => proposal.url)
        })

        const deletedVotes = prisma.vote.deleteMany({
            where: {
                daohandlerid: daoHandler.id,
                proposalid: {
                    in: proposalsNotOnSnapshot.map(proposal => proposal.id)
                }
            }
        })

        const deletedProposals = prisma.proposal.deleteMany({
            where: {
                daohandlerid: daoHandler.id,
                id: {
                    in: proposalsNotOnSnapshot.map(
                        (proposal) => proposal.id
                    )
                }
            }
        })

        const deletedRows = await prisma.$transaction([deletedVotes, deletedProposals])

        log_sanity.log({
            level: 'info',
            message: `Proposal deleted successfully`,
            deletedRows: deletedRows
        })
    }

    // ================ CHECK FOR MISSING PROPOSALS ==================
    const proposalsNotInDatabase: GraphQLProposal[] =
        proposalsFromSnapshotAPI.filter((proposal: GraphQLProposal) => {
            return !proposalsFromDatabase
                .map((proposal: Proposal) => proposal.externalid)
                .includes(proposal.id)
        })

    if (proposalsNotInDatabase.length > 0) {
        // we are missing proposals from the database. need to set the snapshotIndex backwards to fetch them
        log_sanity.log({
            level: 'warn',
            message: `Missing proposals: ${proposalsNotInDatabase.length} proposals `,
            proposals: proposalsNotInDatabase.map(proposal => proposal.link)
        })
    }

    console.log("\nHandler", (daoHandler.decoder as Decoder).space)
    console.log("Proposals from snapshot", proposalsFromSnapshotAPI.length)
    console.log("Proposals from db", proposalsFromDatabase.length)
    console.log("Proposals not on snapshot", proposalsNotOnSnapshot.length, proposalsNotOnSnapshot)
    console.log("Proposals not in database", proposalsNotInDatabase.length, proposalsNotInDatabase)
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

    try {
        const responseBody = await callApiWithDelayedRetries(graphqlQuery, 5)
        return responseBody.proposals as GraphQLProposal[]
    } catch (e) {
        log_sanity.log({
            level: 'error',
            message: 'Failed to fetch voting data from snapshot.',
            errorName: (e as Error).name,
            errorMessage: (e as Error).message,
            errorStack: (e as Error).stack,
        })

        throw e
    }
    
}

const fetchProposalsFromDatabase = async (
    daoHandlerId: string,
    searchFrom: Date,
    searchTo: Date
): Promise<Proposal[]> => {
    return await prisma.proposal.findMany({
        where: {
            daohandlerid: daoHandlerId,
            timecreated: {
                gte: searchFrom,
                lte: searchTo
            }
        }
    })
}
