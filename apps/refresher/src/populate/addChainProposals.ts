import {
    DAOHandlerType,
    RefreshStatus,
    RefreshType,
    prisma
} from '@senate/database'
import {
    DAOS_PROPOSALS_CHAIN_INTERVAL,
    DAOS_PROPOSALS_CHAIN_INTERVAL_FORCE
} from '../config'

export const addChainProposalsToQueue = async () => {
    console.log({
        action: 'chain_proposals_queue',
        details: 'start'
    })
    await prisma.$transaction(async (tx) => {
        const daoHandlers = await tx.dAOHandler.findMany({
            where: {
                OR: [
                    {
                        //normal refresh interval
                        AND: [
                            {
                                type: {
                                    in: [
                                        DAOHandlerType.AAVE_CHAIN,
                                        DAOHandlerType.COMPOUND_CHAIN,
                                        DAOHandlerType.MAKER_EXECUTIVE,
                                        DAOHandlerType.MAKER_POLL,
                                        DAOHandlerType.UNISWAP_CHAIN
                                    ]
                                }
                            },
                            {
                                refreshStatus: {
                                    in: [RefreshStatus.DONE, RefreshStatus.NEW]
                                }
                            },
                            {
                                lastRefreshTimestamp: {
                                    lt: new Date(
                                        Date.now() -
                                            DAOS_PROPOSALS_CHAIN_INTERVAL *
                                                60 *
                                                1000
                                    )
                                }
                            }
                        ]
                    },
                    {
                        //force refresh interval
                        AND: [
                            {
                                type: {
                                    in: [
                                        DAOHandlerType.AAVE_CHAIN,
                                        DAOHandlerType.COMPOUND_CHAIN,
                                        DAOHandlerType.MAKER_EXECUTIVE,
                                        DAOHandlerType.MAKER_POLL,
                                        DAOHandlerType.UNISWAP_CHAIN
                                    ]
                                }
                            },
                            {
                                refreshStatus: {
                                    in: [RefreshStatus.PENDING]
                                }
                            },
                            {
                                lastRefreshTimestamp: {
                                    lt: new Date(
                                        Date.now() -
                                            DAOS_PROPOSALS_CHAIN_INTERVAL_FORCE *
                                                60 *
                                                1000
                                    )
                                }
                            }
                        ]
                    }
                ]
            }
        })

        console.log({
            action: 'chain_proposals_queue',
            details: 'list of DAOs to be updated',
            daos: daoHandlers.map((daoHandler) => daoHandler.daoId)
        })

        if (!daoHandlers.length) {
            console.log({
                action: 'chain_proposals_queue',
                details: 'skip'
            })
            return
        }

        const previousPrio = (await tx.refreshQueue.findFirst({
            where: {
                refreshType: RefreshType.DAOCHAINPROPOSALS
            },
            orderBy: { priority: 'desc' },
            take: 1,
            select: { priority: true }
        })) ?? { priority: 50 } //default to 50

        console.log({
            action: 'chain_proposals_queue',
            details: 'previous max priority for DAOCHAINPROPOSALS',
            priority: previousPrio.priority
        })

        const queueRes = await tx.refreshQueue.createMany({
            data: daoHandlers.map((daoHandler) => {
                return {
                    clientId: daoHandler.id,
                    refreshType: RefreshType.DAOCHAINPROPOSALS,
                    priority: Number(previousPrio.priority) + 1
                }
            })
        })

        console.log({
            action: 'chain_proposals_queue',
            details: 'queue result',
            queue: queueRes
        })

        const statusRes = await tx.dAOHandler.updateMany({
            where: {
                id: {
                    in: daoHandlers.map((daoHandler) => daoHandler.id)
                }
            },
            data: {
                refreshStatus: RefreshStatus.PENDING,
                lastRefreshTimestamp: new Date()
            }
        })

        console.log({
            action: 'chain_proposals_queue',
            details: 'status res',
            status: statusRes
        })
    })
    console.log({
        action: 'chain_proposals_queue',
        details: 'end'
    })
}
