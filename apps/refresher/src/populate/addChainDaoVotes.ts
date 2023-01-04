import {
    DAOHandlerType,
    RefreshStatus,
    RefreshType,
    prisma
} from '@senate/database'
import {
    DAOS_VOTES_CHAIN_INTERVAL,
    DAOS_VOTES_CHAIN_INTERVAL_FORCE
} from '../config'

export const addChainDaoVotes = async () => {
    console.log({
        action: 'chain_dao_votes_queue',
        details: 'start'
    })
    await prisma.$transaction(async (tx) => {
        const daoHandlers = await tx.dAOHandler.findMany({
            where: {
                OR: [
                    {
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
                                voterHandlers: {
                                    some: {
                                        AND: [
                                            {
                                                refreshStatus: {
                                                    in: [
                                                        RefreshStatus.DONE,
                                                        RefreshStatus.NEW
                                                    ]
                                                }
                                            },
                                            {
                                                lastRefreshTimestamp: {
                                                    lt: new Date(
                                                        Date.now() -
                                                            DAOS_VOTES_CHAIN_INTERVAL *
                                                                60 *
                                                                1000
                                                    )
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        ]
                    },
                    {
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
                                voterHandlers: {
                                    some: {
                                        AND: [
                                            {
                                                refreshStatus: {
                                                    in: [RefreshStatus.PENDING]
                                                }
                                            },
                                            {
                                                lastRefreshTimestamp: {
                                                    lt: new Date(
                                                        Date.now() -
                                                            DAOS_VOTES_CHAIN_INTERVAL_FORCE *
                                                                60 *
                                                                1000
                                                    )
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        ]
                    }
                ]
            },
            include: {
                voterHandlers: true,
                dao: true
            }
        })

        console.log({
            action: 'chain_dao_votes_queue',
            details: 'list of DAOs to be updated',
            daos: daoHandlers.map((daoHandler) => daoHandler.dao.name)
        })

        if (!daoHandlers.length) {
            console.log({
                action: 'chain_dao_votes_queue',
                details: 'skip'
            })
            return
        }

        const previousPrio = (await tx.refreshQueue.findFirst({
            where: {
                refreshType: RefreshType.DAOCHAINVOTES
            },
            orderBy: { priority: 'desc' },
            take: 1,
            select: { priority: true }
        })) ?? { priority: 1 } //default to 1

        console.log({
            action: 'chain_dao_votes_queue',
            details: 'previous max priority for DAOCHAINVOTES',
            priority: previousPrio.priority
        })

        const queueRes = await tx.refreshQueue.createMany({
            data: daoHandlers.map((daoHandler) => {
                return {
                    clientId: daoHandler.id,
                    refreshType: RefreshType.DAOCHAINVOTES,
                    priority: Number(previousPrio.priority) + 1
                }
            })
        })

        console.log({
            action: 'chain_dao_votes_queue',
            details: 'queue result',
            queue: queueRes
        })

        const statusRes = await tx.voterHandler.updateMany({
            where: {
                daoHandlerId: {
                    in: daoHandlers.map((daoHandler) => daoHandler.id)
                }
            },
            data: {
                refreshStatus: RefreshStatus.PENDING,
                lastRefreshTimestamp: new Date()
            }
        })

        console.log({
            action: 'chain_dao_votes_queue',
            details: 'status res',
            status: statusRes
        })
    })
    console.log({
        action: 'chain_dao_votes_queue',
        details: 'end'
    })
}
