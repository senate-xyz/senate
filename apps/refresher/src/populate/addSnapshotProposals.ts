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
                type: DAOHandlerType.SNAPSHOT,
                OR: [
                    {
                        refreshStatus: RefreshStatus.DONE,
                        lastRefreshTimestamp: {
                            lt: new Date(
                                Date.now() -
                                    DAOS_PROPOSALS_SNAPSHOT_INTERVAL * 60 * 1000
                            )
                        }
                    },
                    {
                        refreshStatus: RefreshStatus.PENDING,
                        lastRefreshTimestamp: {
                            lt: new Date(
                                Date.now() -
                                    DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE *
                                        60 *
                                        1000
                            )
                        }
                    },
                    {
                        refreshStatus: RefreshStatus.NEW,
                        lastRefreshTimestamp: {
                            lt: new Date(Date.now() - 15 * 1000)
                        }
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
