import {
    DAOHandlerType,
    RefreshStatus,
    RefreshType,
    prisma
} from '@senate/database'
import {
    DAOS_VOTES_SNAPSHOT_INTERVAL,
    DAOS_VOTES_SNAPSHOT_INTERVAL_FORCE
} from '../config'

export const addSnapshotDaoVotes = async () => {
    console.log({
        action: 'snapshot_dao_votes_queue',
        details: 'start'
    })
    await prisma.$transaction(async (tx) => {
        const snapshotDaoHandlers = await tx.dAOHandler.findMany({
            where: {
                OR: [
                    {
                        AND: [
                            { type: DAOHandlerType.SNAPSHOT },
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
                                                            DAOS_VOTES_SNAPSHOT_INTERVAL *
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
                            { type: DAOHandlerType.SNAPSHOT },
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
                                                            DAOS_VOTES_SNAPSHOT_INTERVAL_FORCE *
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
            action: 'snapshot_dao_votes_queue',
            details: 'list of DAOs to be updated',
            daos: snapshotDaoHandlers.map((daoHandler) => daoHandler.dao.name)
        })

        if (!snapshotDaoHandlers.length) {
            console.log({
                action: 'snapshot_dao_votes_queue',
                details: 'skip'
            })
            return
        }

        const previousPrio = (await tx.refreshQueue.findFirst({
            where: {
                refreshType: RefreshType.DAOSNAPSHOTVOTES
            },
            orderBy: { priority: 'desc' },
            take: 1,
            select: { priority: true }
        })) ?? { priority: 1 } //default to 1

        console.log({
            action: 'snapshot_dao_votes_queue',
            details: 'previous max priority for DAOSNAPSHOTVOTES',
            priority: previousPrio.priority
        })

        const queueRes = await tx.refreshQueue.createMany({
            data: snapshotDaoHandlers.map((daoHandler) => {
                return {
                    clientId: daoHandler.id,
                    refreshType: RefreshType.DAOSNAPSHOTVOTES,
                    priority: Number(previousPrio.priority) + 1
                }
            })
        })

        console.log({
            action: 'snapshot_dao_votes_queue',
            details: 'queue result',
            queue: queueRes
        })

        const statusRes = await tx.voterHandler.updateMany({
            where: {
                daoHandlerId: {
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
        action: 'snapshot_dao_votes_queue',
        details: 'end'
    })
}
