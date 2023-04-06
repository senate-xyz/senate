import {
    prisma,
    type DAOHandler,
    DAOHandlerType,
    type Decoder,
    type Proposal
} from '@senate/database'

import { schedule } from 'node-cron'
import { log_sanity } from '@senate/axiom'
import {getAbi, getClosestBlock} from '../../../../utilities/utils'
import {ethers} from 'ethers'

export const makerPollsSanity = schedule('51 * * * *', async () => {
    log_sanity.log({
        level: 'info',
        message: '[PROPOSALS] Starting sanity check for Maker polls',
        date: new Date(Date.now())
    })

    const SEARCH_FROM: number = Date.now() - 72 * 60 * 60 * 1000 // hours * minutes * seconds * milliseconds
    const SEARCH_TO: number = Date.now() - 15 * 60 * 1000 //  minutes * seconds * milliseconds

    try {
        const daoHandler: DAOHandler = await prisma.daohandler.findFirst({
            where: {
                type: DAOHandlerType.MAKER_POLL
            }
        })

        const proposalsFromDatabase = await fetchProposalsFromDatabase(
            daoHandler.id,
            new Date(SEARCH_FROM),
            new Date(SEARCH_TO)
        )

        console.log(proposalsFromDatabase)

        const provider = new ethers.JsonRpcProvider(
            String(process.env.ALCHEMY_NODE_URL)
        )

        const fromBlock = await getClosestBlock(SEARCH_FROM, provider)
        const toBlock = await getClosestBlock(SEARCH_TO, provider)

        // console.log(new Date(SEARCH_FROM), new Date(SEARCH_TO))
        // console.log(fromBlock, toBlock)
        // console.log(new Date((await provider.getBlock(fromBlock)).timestamp), new Date((await provider.getBlock(toBlock)).timestamp))

        const events = await fetchPollCreatedEvents(
            daoHandler,
            fromBlock,
            toBlock,
            provider
        )

        console.log("Returned events:", events.length)

        log_sanity.log({
            level: 'info',
            message: '[PROPOSALS] FINISHED sanity check for Maker polls'
        })


    } catch (e) {
        log_sanity.log({
            level: 'error',
            message: `[PROPOSALS] Failed sanity check for Maker polls`,
            errorName: (e as Error).name,
            errorMessage: (e as Error).message,
            errorStack: (e as Error).stack,
        })
    }
})

// const checkAndSanitizeProposalsRoutine = async (
//     daoHandler: DAOHandler,
//     fromTimestamp: number,
//     toTimestamp: number
// ) => {
//     for (const daoHandler of daoHandlers) {
    

//         const proposalsNotOnSnapshot: Proposal[] = proposalsFromDatabase.filter(
//             (proposal: Proposal) => {
//                 return !proposalsFromSnapshotAPI
//                     .map((proposal: GraphQLProposal) => proposal.id)
//                     .includes(proposal.externalid)
//             }
//         )

//         const proposalsNotInDatabase: GraphQLProposal[] =
//             proposalsFromSnapshotAPI.filter((proposal: GraphQLProposal) => {
//                 return !proposalsFromDatabase
//                     .map((proposal: Proposal) => proposal.externalid)
//                     .includes(proposal.id)
//             })

//         console.log(proposalsNotOnSnapshot, proposalsNotInDatabase)

//         if (proposalsNotOnSnapshot.length > 0) {
//             // we have proposals which have been removed from snapshot. need to purge them from the database.
//             log_sanity.log({
//                 level: 'warn',
//                 message: `Found ${proposalsNotOnSnapshot.length} proposals to remove`,
//                 proposals: proposalsNotOnSnapshot
//             })

//             await prisma.proposal.deleteMany({
//                 where: {
//                     daohandlerid: daoHandler.id,
//                     id: {
//                         in: proposalsNotOnSnapshot.map(
//                             (proposal) => proposal.id
//                         )
//                     }
//                 }
//             })
//         }

//         if (proposalsNotInDatabase.length > 0) {
//             // we are missing proposals from the database. need to set the snapshotIndex backwards to fetch them
//             log_sanity.log({
//                 level: 'warn',
//                 message: `Missing proposals: ${proposalsFromDatabase.length} proposals `,
//                 proposals: proposalsNotOnSnapshot
//             })
//         }
//     }
// }

const fetchPollCreatedEvents = async (
    daoHandler: DAOHandler,
    fromBlock: number,
    toBlock: number,
    provider: ethers.JsonRpcProvider
) : Promise<ethers.Result[]> => {
    const abi = await getAbi(
        (daoHandler.decoder as Decoder).address_create,
        'ethereum'
    )
    const govIface = new ethers.Interface(abi)

    const logs = await provider.getLogs({
        fromBlock: fromBlock,
        toBlock: toBlock,
        address: (daoHandler.decoder as Decoder).address_create,
        topics: [govIface.getEvent('PollCreated').topicHash]
    })

    const eventsData = logs.map((log) => (
        govIface.parseLog({
            topics: log.topics as string[],
            data: log.data
        }).args
    ))

    console.log(eventsData[0])

    return eventsData
}

const fetchProposalsFromDatabase = async (
    daoHandlerId: string,
    searchFrom: Date,
    searchTo: Date
): Promise<Proposal[]> => {
    return await prisma.proposal.findMany({
        where: {
            externalid: daoHandlerId,
            timecreated: {
                gte: searchFrom,
                lte: searchTo
            }
        }
    })
}