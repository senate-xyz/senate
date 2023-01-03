import { prisma, RefreshType } from '@senate/database'
import * as cron from 'node-cron'
import { loadConfig } from './config'
import { createVoterHandlers } from './createHandlers'
import { processSnapshotProposals } from './process/snapshotProposals'
import { processSnapshotDaoVotes } from './process/snapshotDaoVotes'
import { addSnapshotDaoVotes } from './populate/addSnapshotDaoVotes'
import { addSnapshotProposalsToQueue } from './populate/addSnapshotProposals'
import { addChainProposalsToQueue } from './populate/addChainProposals'
import { processChainProposals } from './process/chainProposals'

const main = async () => {
    console.log({ action: 'refresh_start' })
    await loadConfig()

    cron.schedule('*/1 * * * * *', async () => {
        await loadConfig()
        await createVoterHandlers()
    })

    setInterval(async () => {
        processQueue()
    }, 250)

    cron.schedule('*/10 * * * * *', async () => {
        console.log({ action: 'populate_queue', details: 'start' })

        await addSnapshotProposalsToQueue()
        await addSnapshotDaoVotes()
        await addChainProposalsToQueue()

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

    switch (item.refreshType) {
        case RefreshType.DAOSNAPSHOTPROPOSALS:
            processSnapshotProposals(item)
            break

        case RefreshType.DAOSNAPSHOTVOTES: {
            processSnapshotDaoVotes(item)
            break
        }

        case RefreshType.DAOCHAINPROPOSALS: {
            processChainProposals(item)
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

main()
