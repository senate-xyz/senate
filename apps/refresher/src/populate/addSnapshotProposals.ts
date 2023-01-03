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

export const addSnapshotProposalsToQueue = async () => {
    console.log({
        action: 'snapshot_dao_proposals_queue',
        details: 'start'
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
                                refreshStatus: {
                                    in: [RefreshStatus.DONE, RefreshStatus.NEW]
                                }
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
                        //force refresh interval
                        AND: [
                            { type: DAOHandlerType.SNAPSHOT },
                            {
                                refreshStatus: {
                                    in: [RefreshStatus.PENDING]
                                }
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
            }
        })

        console.log({
            action: 'snapshot_dao_proposals_queue',
            details: 'list of DAOs to be updated',
            daos: snapshotDaoHandlers.map((daoHandler) => daoHandler.daoId)
        })

        if (!snapshotDaoHandlers.length) {
            console.log({
                action: 'snapshot_dao_proposals_queue',
                details: 'skip'
            })
            return
        }

        const previousPrio = (await tx.refreshQueue.findFirst({
            where: {
                refreshType: RefreshType.DAOSNAPSHOTPROPOSALS
            },
            orderBy: { priority: 'desc' },
            take: 1,
            select: { priority: true }
        })) ?? { priority: 50 } //default to 50

        console.log({
            action: 'snapshot_dao_proposals_queue',
            details: 'previous max priority for DAOSNAPSHOTPROPOSALS',
            priority: previousPrio.priority
        })

        const queueRes = await tx.refreshQueue.createMany({
            data: snapshotDaoHandlers.map((daoHandler) => {
                return {
                    clientId: daoHandler.id,
                    refreshType: RefreshType.DAOSNAPSHOTPROPOSALS,
                    priority: Number(previousPrio.priority) + 1
                }
            })
        })

        console.log({
            action: 'snapshot_dao_proposals_queue',
            details: 'queue result',
            queue: queueRes
        })

        const statusRes = await tx.dAOHandler.updateMany({
            where: {
                id: {
                    in: snapshotDaoHandlers.map((daoHandler) => daoHandler.id)
                }
            },
            data: {
                refreshStatus: RefreshStatus.PENDING
            }
        })

        console.log({
            action: 'snapshot_dao_proposals_queue',
            details: 'status res',
            status: statusRes
        })
    })
    console.log({
        action: 'snapshot_dao_proposals_queue',
        details: 'end'
    })
}
