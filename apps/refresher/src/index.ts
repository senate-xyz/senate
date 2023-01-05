import { prisma, RefreshType } from '@senate/database'
import * as cron from 'node-cron'
import { loadConfig } from './config'
import { createVoterHandlers } from './createHandlers'
import { processSnapshotProposals } from './process/snapshotProposals'
import { processSnapshotDaoVotes } from './process/snapshotDaoVotes'
import { addSnapshotDaoVotes } from './populate/addSnapshotDaoVotes'
import { processChainProposals } from './process/chainProposals'
import { addChainDaoVotes } from './populate/addChainDaoVotes'
import { processChainDaoVotes } from './process/chainDaoVotes'
import { addChainProposalsToQueue } from './populate/addChainProposals'
import { addSnapshotProposalsToQueue } from './populate/addSnapshotProposals'
import { log_ref } from '@senate/axiom'

let RUNNING_PROCESS_QUEUE = false

const main = async () => {
    log_ref.log({
        level: 'info',
        message: `Refresher start`
    })
    await loadConfig()

    setInterval(async () => {
        processQueue()
    }, 250)

    cron.schedule('*/10 * * * * *', async () => {
        await loadConfig()
        await createVoterHandlers()
        await addSnapshotProposalsToQueue()
        await addSnapshotDaoVotes()
        await addChainProposalsToQueue()
        await addChainDaoVotes()
    })
}

const processQueue = async () => {
    if (RUNNING_PROCESS_QUEUE == true) return
    RUNNING_PROCESS_QUEUE = true

    log_ref.log({
        level: 'info',
        message: `Process queue`
    })

    const item = await prisma.refreshQueue.findFirst({
        orderBy: { priority: 'desc' }
    })

    if (!item) {
        log_ref.log({
            level: 'info',
            message: `Queue empty`
        })

        RUNNING_PROCESS_QUEUE = false
        return
    }

    log_ref.log({
        level: 'info',
        message: `Queue item`,
        data: {
            item: item
        }
    })

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

    await prisma.refreshQueue
        .delete({
            where: { id: item?.id }
        })
        .then((r) => {
            log_ref.log({
                level: 'info',
                message: `Succesfully deleted queue item`,
                data: { item: r }
            })
            return
        })
        .catch((e) => {
            log_ref.log({
                level: 'error',
                message: `Failed to delete queue item`,
                data: { error: e }
            })
        })

    RUNNING_PROCESS_QUEUE = false
}

main()
