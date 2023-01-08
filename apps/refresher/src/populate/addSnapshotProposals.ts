import {
    DAOHandlerType,
    RefreshStatus,
    RefreshType,
    prisma
} from '@senate/database'
import {
    DAOS_PROPOSALS_SNAPSHOT_INTERVAL,
    DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE
} from '../config'
import { log_ref } from '@senate/axiom'

export const addSnapshotProposalsToQueue = async () => {
    log_ref.log({
        level: 'info',
        message: `Add new dao snapshot proposals to queue`
    })

    await prisma.$transaction(async (tx) => {
        const snapshotDaoHandlers = await tx.dAOHandler.findMany({
            where: {
                OR: [
                    {
                        //normal refresh interval
                        AND: [
                            { type: DAOHandlerType.SNAPSHOT },
                            {
                                refreshStatus: RefreshStatus.DONE
                            },
                            {
                                lastRefreshTimestamp: {
                                    lt: new Date(
                                        Date.now() -
                                            DAOS_PROPOSALS_SNAPSHOT_INTERVAL *
                                                60 *
                                                1000
                                    )
                                }
                            }
                        ]
                    },
                    {
                        AND: [
                            { type: DAOHandlerType.SNAPSHOT },
                            {
                                AND: [
                                    {
                                        refreshStatus: RefreshStatus.NEW
                                    },
                                    {
                                        lastRefreshTimestamp: {
                                            lt: new Date(Date.now() - 60 * 1000)
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        //force refresh interval
                        AND: [
                            { type: DAOHandlerType.SNAPSHOT },
                            {
                                refreshStatus: RefreshStatus.PENDING
                            },
                            {
                                lastRefreshTimestamp: {
                                    lt: new Date(
                                        Date.now() -
                                            DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE *
                                                60 *
                                                1000
                                    )
                                }
                            }
                        ]
                    }
                ]
            },
            include: {
                dao: true
            }
        })

        if (!snapshotDaoHandlers.length) {
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
                item: snapshotDaoHandlers,
                daos: snapshotDaoHandlers.map(
                    (daoHandler) => daoHandler.dao.name
                )
            }
        })

        const previousPrio = (await tx.refreshQueue.findFirst({
            where: {
                refreshType: RefreshType.DAOSNAPSHOTPROPOSALS
            },
            orderBy: { priority: 'desc' },
            take: 1,
            select: { priority: true }
        })) ?? { priority: 50 } //default to 50

        log_ref.log({
            level: 'info',
            message: `Previous max priority`,
            data: {
                priority: previousPrio.priority
            }
        })

        await tx.refreshQueue
            .createMany({
                data: snapshotDaoHandlers.map((daoHandler) => {
                    return {
                        clientId: daoHandler.id,
                        refreshType: RefreshType.DAOSNAPSHOTPROPOSALS,
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

        await tx.dAOHandler
            .updateMany({
                where: {
                    id: {
                        in: snapshotDaoHandlers.map(
                            (daoHandler) => daoHandler.id
                        )
                    }
                },
                data: {
                    refreshStatus: RefreshStatus.PENDING,
                    lastRefreshTimestamp: new Date()
                }
            })
            .then((r) => {
                log_ref.log({
                    level: 'error',
                    message: `Succesfully updated refresh statuses`,
                    data: {
                        item: r
                    }
                })
                return
            })
            .catch((e) => {
                log_ref.log({
                    level: 'info',
                    message: `Failed to update refresh statuses`,
                    data: {
                        error: e
                    }
                })
            })
    })
}
