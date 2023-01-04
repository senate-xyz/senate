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
import { addChainDaoVotes } from './populate/addChainDaoVotes'
import { processChainDaoVotes } from './process/chainDaoVotes'

let INITIAL_RUN_CREATED_VOTE_HANDLERS = false
let RUNNING_PROCESS_QUEUE = false

const main = async () => {
    console.log({ action: 'refresh_start' })
    await loadConfig()

    cron.schedule('*/1 * * * * *', async () => {
        await loadConfig()
        await createVoterHandlers()
        INITIAL_RUN_CREATED_VOTE_HANDLERS = true
    })

    setInterval(async () => {
        if (!INITIAL_RUN_CREATED_VOTE_HANDLERS) return
        processQueue()
    }, 250)

    cron.schedule('*/10 * * * * *', async () => {
        if (!INITIAL_RUN_CREATED_VOTE_HANDLERS) return

        console.log({ action: 'populate_queue', details: 'start' })

        await addSnapshotProposalsToQueue()
        await addSnapshotDaoVotes()
        await addChainProposalsToQueue()
        await addChainDaoVotes()

        console.log({ action: 'populate_queue', details: 'end' })
    })
}

const processQueue = async () => {
    if (RUNNING_PROCESS_QUEUE == true) return
    RUNNING_PROCESS_QUEUE = true

    console.log({ action: 'process_queue', details: 'start' })

    const item = await prisma.refreshQueue.findFirst({
        orderBy: { priority: 'desc' }
    })

    if (!item) {
        console.log({ action: 'process_queue', details: 'empty queue' })
        console.log({ action: 'process_queue', details: 'end' })
        RUNNING_PROCESS_QUEUE = false
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

        case RefreshType.DAOCHAINVOTES: {
            processChainDaoVotes(item)
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
    RUNNING_PROCESS_QUEUE = false
}

main()
