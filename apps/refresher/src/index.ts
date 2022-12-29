import {
    DAOHandlerType,
    prisma,
    RefreshStatus,
    RefreshType
} from '@senate/database'
import * as cron from 'node-cron'

const DAOS_PROPOSALS_SNAPSHOT_INTERVAL = 2 // in minutes
const DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE = 30 // in minutes

const DAOS_VOTES_SNAPSHOT_INTERVAL = 1 // in minutes
const DAOS_VOTES_SNAPSHOT_INTERVAL_FORCE = 30 // in minutes

const main = () => {
    console.log({ action: 'refresh_start' })

    cron.schedule('*/1 * * * * *', async () => {
        processQueue()
    })

    cron.schedule('*/10 * * * * *', async () => {
        console.log({ action: 'populate_queue' })
        addSnapshotProposalsToQueue()
        addDAOSnapshotVotesToQueue()
    })
}

enum PROCESS_QUEUE {
    RUNNING,
    NOT_RUNNING
}
let processQueueState = PROCESS_QUEUE.NOT_RUNNING

const processQueue = async () => {
    await prisma.$transaction(async (tx) => {
        if (processQueueState == PROCESS_QUEUE.RUNNING) return
        processQueueState = PROCESS_QUEUE.RUNNING

        console.log({ action: 'process_queue', details: 'start' })

        const item = await tx.refreshQueue.findFirst({
            orderBy: { priority: 'desc' }
        })

        if (!item) {
            console.log({ action: 'process_queue', details: 'empty queue' })
            processQueueState = PROCESS_QUEUE.NOT_RUNNING
            return
        }

        // make PD request and wait for result
        // if result is ok

        switch (item.refreshType) {
            case RefreshType.DAOSNAPSHOTPROPOSALS:
                await tx.dAOHandler.update({
                    where: {
                        daoId_type: {
                            daoId: item.clientId,
                            type: DAOHandlerType.SNAPSHOT
                        }
                    },
                    data: {
                        refreshStatus: RefreshStatus.DONE,
                        lastRefreshTimestamp: new Date()
                    }
                })
                break
            case RefreshType.DAOSNAPSHOTVOTES: {
                await tx.voterHandler.updateMany({
                    where: {
                        dAOHandlerId: item.clientId
                    },
                    data: {
                        refreshStatus: RefreshStatus.DONE,
                        lastRefreshTimestamp: new Date()
                    }
                })
            }
        }

        const refreshQueue = await tx.refreshQueue.delete({
            where: { id: item?.id }
        })

        console.log({
            action: 'process_queue',
            details: 'remove item',
            item: refreshQueue
        })

        processQueueState = PROCESS_QUEUE.NOT_RUNNING
    })
}

const addDAOSnapshotVotesToQueue = async () => {
    await prisma.$transaction(async (tx) => {
        console.log({
            action: 'snapshot_dao_votes_queue',
            details: 'start'
        })

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

        const previousPrio = (await tx.refreshQueue.findFirst({
            where: {
                refreshType: RefreshType.DAOSNAPSHOTVOTES
            },
            orderBy: { priority: 'desc' },
            take: 1,
            select: { priority: true }
        })) ?? { priority: 50 } //default to 50

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
                dAOHandlerId: {
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
}

const addSnapshotProposalsToQueue = async () => {
    await prisma.$transaction(async (tx) => {
        console.log({
            action: 'snapshot_dao_proposals_queue',
            details: 'start'
        })
        const snapshotDaos = await tx.dAO.findMany({
            where: {
                OR: [
                    {
                        //normal refresh interval
                        handlers: {
                            some: {
                                AND: [
                                    { type: DAOHandlerType.SNAPSHOT },
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
                                                    DAOS_PROPOSALS_SNAPSHOT_INTERVAL *
                                                        60 *
                                                        1000
                                            )
                                        }
                                    }
                                ]
                            }
                        }
                    },
                    {
                        //force refresh interval
                        handlers: {
                            some: {
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
                        }
                    }
                ]
            },
            include: {
                handlers: {
                    where: {
                        type: DAOHandlerType.SNAPSHOT
                    }
                }
            }
        })

        console.log({
            action: 'snapshot_dao_proposals_queue',
            details: 'list of DAOs to be updated',
            daos: snapshotDaos.map((dao) => dao.name)
        })

        const previousPrio = (await tx.refreshQueue.findFirst({
            where: {
                refreshType: RefreshType.DAOSNAPSHOTPROPOSALS
            },
            orderBy: { priority: 'desc' },
            take: 1,
            select: { priority: true }
        })) ?? { priority: 0 } //default to 0

        console.log({
            action: 'snapshot_dao_proposals_queue',
            details: 'previous max priority for DAOSNAPSHOTPROPOSALS',
            priority: previousPrio.priority
        })

        const queueRes = await tx.refreshQueue.createMany({
            data: snapshotDaos.map((dao) => {
                return {
                    clientId: dao.id,
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
                id: { in: snapshotDaos.map((dao) => dao.handlers[0].id) }
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
}

main()
