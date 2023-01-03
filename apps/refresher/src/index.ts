import {
    DAOHandlerType,
    prisma,
    RefreshStatus,
    RefreshType
} from '@senate/database'
import * as cron from 'node-cron'
import fetch from 'node-fetch'

const DAOS_PROPOSALS_SNAPSHOT_INTERVAL = Number(
    (
        await prisma.config.upsert({
            where: {
                param: 'DAOS_PROPOSALS_SNAPSHOT_INTERVAL'
            },
            create: {
                param: 'DAOS_PROPOSALS_SNAPSHOT_INTERVAL',
                value: '10'
            },
            update: {}
        })
    ).value
)

const DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE = Number(
    (
        await prisma.config.upsert({
            where: {
                param: 'DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE'
            },
            create: {
                param: 'DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE',
                value: '30'
            },
            update: {}
        })
    ).value
)

const DAOS_VOTES_SNAPSHOT_INTERVAL = Number(
    (
        await prisma.config.upsert({
            where: {
                param: 'DAOS_VOTES_SNAPSHOT_INTERVAL'
            },
            create: {
                param: 'DAOS_VOTES_SNAPSHOT_INTERVAL',
                value: '5'
            },
            update: {}
        })
    ).value
)

const DAOS_VOTES_SNAPSHOT_INTERVAL_FORCE = Number(
    (
        await prisma.config.upsert({
            where: {
                param: 'DAOS_VOTES_SNAPSHOT_INTERVAL_FORCE'
            },
            create: {
                param: 'DAOS_VOTES_SNAPSHOT_INTERVAL_FORCE',
                value: '30'
            },
            update: {}
        })
    ).value
)

const main = () => {
    console.log({ action: 'refresh_start' })

    cron.schedule('*/1 * * * * *', async () => {
        processQueue()
    })

    cron.schedule('*/10 * * * * *', async () => {
        console.log({ action: 'populate_queue', details: 'start' })
        console.log({
            action: 'snapshot_dao_proposals_queue',
            details: 'start'
        })
        await addSnapshotProposalsToQueue()
        console.log({
            action: 'snapshot_dao_proposals_queue',
            details: 'end'
        })
        console.log({
            action: 'snapshot_dao_votes_queue',
            details: 'start'
        })
        await addDAOSnapshotVotesToQueue()
        console.log({
            action: 'snapshot_dao_votes_queue',
            details: 'end'
        })
        console.log({ action: 'populate_queue', details: 'end' })
    })
}

enum PROCESS_QUEUE {
    RUNNING,
    NOT_RUNNING
}
let processQueueState = PROCESS_QUEUE.NOT_RUNNING

const processQueue = async () => {
    if (processQueueState == PROCESS_QUEUE.RUNNING) return
    processQueueState = PROCESS_QUEUE.RUNNING

    console.log({ action: 'process_queue', details: 'start' })

    const item = await prisma.refreshQueue.findFirst({
        orderBy: { priority: 'desc' }
    })

    if (!item) {
        console.log({ action: 'process_queue', details: 'empty queue' })
        console.log({ action: 'process_queue', details: 'end' })
        processQueueState = PROCESS_QUEUE.NOT_RUNNING
        return
    }

    // make PD request and wait for result
    // if result is ok

    switch (item.refreshType) {
        case RefreshType.DAOSNAPSHOTPROPOSALS:
            const daoHandler = await prisma.dAOHandler.findFirst({
                where: { id: item.clientId }
            })
            console.log({
                action: 'process_queue',
                details: 'DAOSNAPSHOTPROPOSALS REQUEST',
                item: `${
                    process.env.DETECTIVE_URL
                }/updateSnapshotProposals?daoHandlerIds=${
                    item.clientId
                }&minCreatedAt=${daoHandler?.lastSnapshotProposalCreatedTimestamp?.valueOf()}`
            })
            await fetch(
                `${
                    process.env.DETECTIVE_URL
                }/updateSnapshotProposals?daoHandlerIds=${
                    item.clientId
                }&minCreatedAt=${daoHandler?.lastSnapshotProposalCreatedTimestamp?.valueOf()}`,
                {
                    method: 'POST'
                }
            )
                .then((response) => response.json())
                .then((data) => {
                    if (!data) return
                    if (!Array.isArray(data)) return

                    data.map(async (result) => {
                        if (
                            result.response == 'ok' &&
                            item.clientId == result.daoHandlerId
                        ) {
                            const daoHandler = await prisma.dAOHandler.update({
                                where: {
                                    id: item.clientId
                                },
                                data: {
                                    refreshStatus: RefreshStatus.DONE,
                                    lastRefreshTimestamp: new Date(),
                                    lastSnapshotProposalCreatedTimestamp:
                                        new Date()
                                }
                            })
                            console.log({
                                action: 'process_queue',
                                details: 'DAOSNAPSHOTPROPOSALS DONE',
                                item: daoHandler
                            })
                        }
                    })
                    return
                })
                .catch(async (e) => {
                    const daoHandler = await prisma.dAOHandler.update({
                        where: {
                            id: item.clientId
                        },
                        data: {
                            refreshStatus: RefreshStatus.NEW,
                            lastRefreshTimestamp: new Date()
                        }
                    })
                    console.log({
                        action: 'process_queue',
                        details: 'DAOSNAPSHOTPROPOSALS FAILED',
                        item: daoHandler,
                        error: e
                    })
                })

            break
        case RefreshType.DAOSNAPSHOTVOTES: {
            const daoHandler = await prisma.dAOHandler.findFirst({
                where: { id: item.clientId }
            })

            const voters = await prisma.voter.findMany({
                where: {
                    voterHandlers: {
                        some: {
                            daoHandlerId: daoHandler?.id
                        }
                    }
                }
            })

            console.log({
                action: 'process_queue',
                details: 'DAOSNAPSHOTVOTES REQUEST',
                item: `${
                    process.env.DETECTIVE_URL
                }/updateSnapshotDaoVotes?daoHandlerId=${
                    item.clientId
                }&${voters.map((voter) => `voters=${voter.address}`)}`
            })

            await fetch(
                `${
                    process.env.DETECTIVE_URL
                }/updateSnapshotDaoVotes?daoHandlerId=${
                    item.clientId
                }&${voters.map((voter) => `voters=${voter.address}`)}`,
                {
                    method: 'POST'
                }
            )
                .then((response) => response.json())
                .then((data) => {
                    if (!data) return
                    if (!Array.isArray(data)) return

                    data.map(async (result) => {
                        if ((result.response = 'ok')) {
                            const voterHandler =
                                await prisma.voterHandler.updateMany({
                                    where: {
                                        voter: {
                                            address: result.voterId
                                        }
                                    },
                                    data: {
                                        refreshStatus: RefreshStatus.DONE,
                                        lastRefreshTimestamp: new Date()
                                    }
                                })
                            console.log({
                                action: 'process_queue',
                                details: 'DAOSNAPSHOTVOTES DONE',
                                item: voterHandler
                            })
                        } else {
                            const voterHandler =
                                await prisma.voterHandler.updateMany({
                                    where: {
                                        voter: {
                                            address: result.voterId
                                        }
                                    },
                                    data: {
                                        refreshStatus: RefreshStatus.NEW,
                                        lastRefreshTimestamp: new Date()
                                    }
                                })
                            console.log({
                                action: 'process_queue',
                                details: 'DAOSNAPSHOTVOTES FAILED FOR ONE',
                                item: voterHandler
                            })
                        }
                    })
                    return
                })
                .catch(async (e) => {
                    await prisma.voterHandler.updateMany({
                        where: {
                            voter: {
                                address: {
                                    in: voters.map((voter) => voter.address)
                                }
                            }
                        },
                        data: {
                            refreshStatus: RefreshStatus.NEW,
                            lastRefreshTimestamp: new Date()
                        }
                    })
                    console.log({
                        action: 'process_queue',
                        details: 'DAOSNAPSHOTVOTES FAILED FOR ALL',
                        item: daoHandler,
                        error: e
                    })
                })

            break
        }
    }

    const refreshQueue = await prisma.refreshQueue.delete({
        where: { id: item?.id }
    })

    console.log({
        action: 'process_queue',
        details: 'remove item',
        item: refreshQueue
    })

    console.log({ action: 'process_queue', details: 'end' })
    processQueueState = PROCESS_QUEUE.NOT_RUNNING
}

const addDAOSnapshotVotesToQueue = async () => {
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

        if (!snapshotDaoHandlers.length) return

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
}

const addSnapshotProposalsToQueue = async () => {
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

        if (!snapshotDaoHandlers.length) return

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
}

main()
