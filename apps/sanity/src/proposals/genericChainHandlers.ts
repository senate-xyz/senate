import {
    prisma,
    type DAOHandler,
    DAOHandlerType,
    type Decoder,
    type Proposal
} from '@senate/database'

import { schedule } from 'node-cron'
import { log_sanity } from '@senate/axiom'
import { getAbi, getClosestBlock } from '../utils'
import { ethers } from 'ethers'

// Run at :45
export const genericChainHandlersSanity = schedule('45 * * * *', async () => {
    const SEARCH_FROM: number = Date.now() - 240 * 60 * 60 * 1000 // hours * minutes * seconds * milliseconds
    const SEARCH_TO: number = Date.now() - 15 * 60 * 1000 //  minutes * seconds * milliseconds

    log_sanity.log({
        level: 'info',
        message: '[PROPOSALS] Starting sanity check for generic chain handlers',
        date: new Date(Date.now()),
        searchFrom: new Date(SEARCH_FROM),
        searchTo: new Date(SEARCH_TO)
    })

    try {
        const provider = new ethers.JsonRpcProvider(
            String(process.env.ALCHEMY_NODE_URL)
        )

        const daoHandlers: DAOHandler[] = await prisma.daohandler.findMany({
            where: {
                type: {
                    in: [
                        DAOHandlerType.AAVE_CHAIN,
                        DAOHandlerType.COMPOUND_CHAIN,
                        DAOHandlerType.UNISWAP_CHAIN,
                        DAOHandlerType.GITCOIN_CHAIN,
                        DAOHandlerType.HOP_CHAIN,
                        DAOHandlerType.ENS_CHAIN,
                        DAOHandlerType.DYDX_CHAIN
                    ]
                }
            }
        })

        for (const daoHandler of daoHandlers) {
            const proposalsFromDatabase = await fetchProposalsFromDatabase(
                daoHandler.id,
                new Date(SEARCH_FROM),
                new Date(SEARCH_TO)
            )

            const fromBlock = await getClosestBlock(SEARCH_FROM, provider)
            const toBlock = await getClosestBlock(SEARCH_TO, provider)

            const proposalCreatedEvents = await fetchProposalCreatedEvents(
                fromBlock,
                toBlock,
                daoHandler,
                provider
            )

            const proposalsNotInDatabase: ethers.Result[] =
                proposalCreatedEvents.filter((event: ethers.Result) => {
                    return !proposalsFromDatabase
                        .map((proposal: Proposal) => proposal.externalid)
                        .includes(event[0].toString())
                })

            if (proposalsNotInDatabase.length > 0) {
                log_sanity.log({
                    level: 'warn',
                    message: `[${daoHandler.type}] Missing proposals: ${proposalsNotInDatabase.length}`,
                    proposals: proposalsNotInDatabase.map((event) =>
                        event[0].toString()
                    ),
                    daoHandler: daoHandler.type
                })
            }
        }

        log_sanity.log({
            level: 'info',
            message:
                '[PROPOSALS] FINISHED sanity check for generic chain handler'
        })
    } catch (e) {
        log_sanity.log({
            level: 'error',
            message: `[PROPOSALS] Failed sanity check for generic chain handlers`,
            errorName: (e as Error).name,
            errorMessage: (e as Error).message,
            errorStack: (e as Error).stack
        })
    }
})

const fetchProposalCreatedEvents = async (
    fromBlock: number,
    toBlock: number,
    daoHandler: DAOHandler,
    provider: ethers.JsonRpcProvider
): Promise<ethers.Result[]> => {
    const abi = await getAbi(
        (daoHandler.decoder as Decoder).address,
        'ethereum'
    )
    const govIface = new ethers.Interface(abi)

    const logs = await provider.getLogs({
        fromBlock: fromBlock,
        toBlock: toBlock,
        address: (daoHandler.decoder as Decoder).address,
        topics: [govIface.getEvent(`ProposalCreated`).topicHash]
    })

    const eventsData = logs.map(
        (log) =>
            govIface.parseLog({
                topics: log.topics as string[],
                data: log.data
            }).args
    )

    return eventsData
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