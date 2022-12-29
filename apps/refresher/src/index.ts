import {
    DAOHandlerType,
    prisma,
    RefreshStatus,
    RefreshType,
    type PrismaPromise
} from '@senate/database'
import fetch from 'node-fetch'
import * as cron from 'node-cron'

const DAOS_PROPOSALS_SNAPSHOT_INTERVAL = 1

const main = () => {
    console.log({ action: 'refresh_start' })

    cron.schedule('*/1 * * * * *', async () => {
        processQueue()

        // refreshUsers()
    })

    cron.schedule('*/10 * * * * *', async () => {
        console.log({ action: 'populate_queue' })
        addSnapshotProposalsToQueue()
        // refreshUsers()
    })

    // cron.schedule(
    //     process.env.REFRESHER_INTERVAL ?? '*/10 * * * *',
    //     async () => {
    //         console.log('Auto refresh request')
    //         await autoRefreshRequest()
    //     }
    // )

    // cron.schedule(
    //     process.env.REFRESHER_FORCE_INTERVAL ?? '5 */3 * * *',
    //     async () => {
    //         console.log('Auto force refresh request')
    //         await autoForceRefreshRequest()
    //     }
    // )
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
        processQueueState = PROCESS_QUEUE.NOT_RUNNING
        return
    }

    // make PD request and wait for result
    // if result is ok

    const txList: PrismaPromise<any>[] = []

    txList.push(
        prisma.dAOHandler.update({
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
    )

    txList.push(
        prisma.refreshQueue.delete({
            where: { id: item?.id }
        })
    )

    const [refreshQueue] = await prisma.$transaction(txList)

    console.log({
        action: 'process_queue',
        details: 'remove item',
        item: refreshQueue
    })

    processQueueState = PROCESS_QUEUE.NOT_RUNNING
}

const addSnapshotProposalsToQueue = async () => {
    await prisma.$transaction(async (tx) => {
        console.log({ action: 'snapshot_proposals_queue', details: 'start' })
        const snapshotDaos = await tx.dAO.findMany({
            where: {
                handlers: {
                    some: {
                        type: DAOHandlerType.SNAPSHOT,
                        refreshStatus: {
                            in: [RefreshStatus.DONE, RefreshStatus.NEW]
                        },
                        lastRefreshTimestamp: {
                            lt: new Date(
                                Date.now() -
                                    DAOS_PROPOSALS_SNAPSHOT_INTERVAL * 60 * 1000
                            )
                        }
                    }
                }
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
            action: 'snapshot_proposals_queue',
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
            action: 'snapshot_proposals_queue',
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
            action: 'snapshot_proposals_queue',
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
            action: 'snapshot_proposals_queue',
            details: 'status res',
            status: statusRes
        })
    })
}

// const autoRefreshRequest = async () => {
//     await prisma.dAO.updateMany({
//         where: {
//             refreshStatus: RefreshStatus.DONE
//         },
//         data: {
//             refreshStatus: RefreshStatus.NEW
//         }
//     })
//     await prisma.voter.updateMany({
//         where: {
//             refreshStatus: RefreshStatus.DONE
//         },
//         data: {
//             refreshStatus: RefreshStatus.NEW
//         }
//     })
// }

// const autoForceRefreshRequest = async () => {
//     await prisma.dAO.updateMany({
//         where: {
//             refreshStatus: RefreshStatus.PENDING
//         },
//         data: {
//             refreshStatus: RefreshStatus.NEW
//         }
//     })
//     await prisma.voter.updateMany({
//         where: {
//             refreshStatus: RefreshStatus.PENDING
//         },
//         data: {
//             refreshStatus: RefreshStatus.NEW
//         }
//     })
// }
// const refreshDaos = async () => {
//     console.log('Refresh DAOs')

//     const daos = await prisma.dAO.findMany({
//         where: {
//             refreshStatus: RefreshStatus.NEW
//         },
//         orderBy: {
//             lastRefresh: 'asc'
//         },
//         take: 1
//     })

//     if (!daos.length) {
//         console.log('No DAOs to refresh.')
//         return
//     } else console.log(`Refreshing ${daos.length} DAOs`)

//     for (let i = 0; i < daos.length; i++) {
//         const dao = daos[i]

//         await prisma.dAO.update({
//             where: {
//                 id: dao.id
//             },
//             data: {
//                 refreshStatus: RefreshStatus.PENDING
//             }
//         })

//         console.log(
//             `Refresh - PENDING - ${dao.name} (${dao.id}) at ${dao.lastRefresh}`
//         )

//         await new Promise((resolve) => setTimeout(resolve, 100))

//         fetch(`${process.env.DETECTIVE_URL}/updateProposals?daoId=${dao.id}`, {
//             method: 'POST'
//         })
//             .then(async (res) => {
//                 if (res.ok) {
//                     console.log(
//                         `Refresh - DONE - ${dao.name} (${dao.id}) at ${dao.lastRefresh}`
//                     )
//                     await prisma.dAO.update({
//                         where: {
//                             id: dao.id
//                         },
//                         data: {
//                             refreshStatus: RefreshStatus.DONE,
//                             lastRefresh: new Date()
//                         }
//                     })
//                 }
//                 return
//             })
//             .catch((e) => {
//                 console.log(e)
//             })
//     }
// }

// const refreshUsers = async () => {
//     console.log('Refresh Voters')

//     const voters = await prisma.voter.findMany({
//         where: {
//             refreshStatus: RefreshStatus.NEW
//         },
//         orderBy: {
//             lastRefresh: 'asc'
//         },
//         take: 1
//     })

//     if (!voters.length) {
//         console.log('No users to refresh.')
//         return
//     } else console.log(`Refreshing ${voters.length} voters`)

//     for (let i = 0; i < voters.length; i++) {
//         const voter = voters[i]

//         if (!voter.address) continue

//         console.log(`Refresh voter: ${voter.address} (${voter.id})`)

//         const users = await prisma.user.findMany({
//             where: {
//                 voters: {
//                     some: {
//                         id: voter.id
//                     }
//                 }
//             },
//             include: {
//                 subscriptions: true
//             }
//         })

//         const subs = users.map((user) => user.subscriptions)

//         let totalSubs: Subscription[] = []

//         for (const sub of subs) {
//             totalSubs = [...sub]
//         }

//         if (totalSubs.length) {
//             await prisma.voter.update({
//                 where: {
//                     id: voter.id
//                 },
//                 data: {
//                     refreshStatus: RefreshStatus.PENDING
//                 }
//             })
//         } else {
//             //nothing to update
//             await prisma.voter.update({
//                 where: {
//                     id: voter.id
//                 },
//                 data: {
//                     refreshStatus: RefreshStatus.DONE,
//                     lastRefresh: new Date()
//                 }
//             })
//         }

//         for (let i = 0; i < totalSubs.length; i++) {
//             const sub = totalSubs[i]
//             console.log(
//                 `Refresh - PENDING - voter ${voter.address} - daoId ${sub.daoId} -> ${process.env.DETECTIVE_URL}/updateVotes?daoId=${sub.daoId}&voterAddress=${voter.address}`
//             )

//             await new Promise((resolve) => setTimeout(resolve, 100))

//             fetch(
//                 `${process.env.DETECTIVE_URL}/updateVotes?daoId=${sub.daoId}&voterAddress=${voter.address}`,
//                 {
//                     method: 'POST'
//                 }
//             )
//                 .then(async (res) => {
//                     if (res.ok) {
//                         console.log(
//                             `Refresh - DONE -  voter ${voter.address} - ${sub.daoId} -> ${process.env.DETECTIVE_URL}/updateVotes?daoId=${sub.daoId}&voterAddress=${voter.address}`
//                         )
//                         await prisma.voter.update({
//                             where: {
//                                 id: voter.id
//                             },
//                             data: {
//                                 refreshStatus: RefreshStatus.DONE,
//                                 lastRefresh: new Date()
//                             }
//                         })
//                     }
//                     return
//                 })
//                 .catch((e) => {
//                     console.log(e)
//                 })
//         }
//     }
// }

main()
