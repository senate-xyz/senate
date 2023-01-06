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
import { log_ref } from '@senate/axiom'

export const addChainDaoVotes = async () => {
    log_ref.log({
        level: 'info',
        message: `Add new dao chain votes to queue`
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
                                                refreshStatus:
                                                    RefreshStatus.DONE
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
                                                refreshStatus: RefreshStatus.NEW
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
                                                refreshStatus:
                                                    RefreshStatus.PENDING
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

        if (!daoHandlers.length) {
            log_ref.log({
                level: 'info',
                message: `Nothing to update`
            })
            return
        }

        log_ref.log({
            level: 'info',
            message: `List of DAOs to be added to queue`,
            data: {
                item: daoHandlers,
                daos: daoHandlers.map((daoHandler) => daoHandler.dao.name)
            }
        })

        const previousPrio = (await tx.refreshQueue.findFirst({
            where: {
                refreshType: RefreshType.DAOCHAINVOTES
            },
            orderBy: { priority: 'desc' },
            take: 1,
            select: { priority: true }
        })) ?? { priority: 1 } //default to 1

        log_ref.log({
            level: 'info',
            message: `Previous max priority`,
            data: {
                priority: previousPrio.priority
            }
        })

        await tx.refreshQueue
            .createMany({
                data: daoHandlers.map((daoHandler) => {
                    return {
                        clientId: daoHandler.id,
                        refreshType: RefreshType.DAOCHAINVOTES,
                        priority: Number(previousPrio.priority) + 1
                    }
                })
            })
            .then((r) => {
                log_ref.log({
                    level: 'info',
                    message: `Succesfully added to queue`,
                    data: {
                        item: r
                    }
                })
                return
            })
            .catch((e) => {
                log_ref.log({
                    level: 'error',
                    message: `Failed to add to queue`,
                    data: {
                        error: e
                    }
                })
            })

        await tx.voterHandler
            .updateMany({
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
            .then((r) => {
                log_ref.log({
                    level: 'info',
                    message: `Succesfully updated refresh statuses`,
                    data: {
                        item: r
                    }
                })
                return
            })
            .catch((e) => {
                log_ref.log({
                    level: 'error',
                    message: `Failed to update refresh statuses`,
                    data: {
                        error: e
                    }
                })
            })
    })
}
