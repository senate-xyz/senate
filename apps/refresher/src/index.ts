import { config, loadConfig } from './config'
import { createVoterHandlers } from './createHandlers'
import { addChainProposalsToQueue } from './populate/addChainProposals'
import { addChainDaoVotes } from './populate/addChainDaoVotes'
import { addSnapshotDaoVotes } from './populate/addSnapshotDaoVotes'
import { addSnapshotProposalsToQueue } from './populate/addSnapshotProposals'
import { scheduleJob } from 'node-schedule'
import { log_ref } from '@senate/axiom'
import { RefreshType, type RefreshQueue } from '@senate/database'
import { processChainDaoVotes } from './process/chainDaoVotes'
import { processSnapshotDaoVotes } from './process/snapshotDaoVotes'
import { processSnapshotProposals } from './process/snapshotProposals'
import { prisma } from '@senate/database'
import { processChainProposals } from './process/chainProposals'

const main = async () => {
    log_ref.log({
        level: 'info',
        message: `Started refresher`
    })

    await loadConfig()
    await createVoterHandlers()

    scheduleJob('* * * * * *', async () => {
        await createVoterHandlers()

        await addSnapshotProposalsToQueue()
        await addSnapshotDaoVotes()

        await addChainProposalsToQueue()
        await addChainDaoVotes()
    })

    setInterval(async () => {
        const hasQueue = await prisma.refreshQueue.count()

        if (hasQueue) {
            process(RefreshType.DAOSNAPSHOTPROPOSALS, processSnapshotProposals)

            process(RefreshType.DAOSNAPSHOTVOTES, processSnapshotDaoVotes)

            process(RefreshType.DAOCHAINPROPOSALS, processChainProposals)

            process(RefreshType.DAOCHAINVOTES, processChainDaoVotes)
        }
    }, config.REFRESH_PROCESS_INTERVAL_MS)
}

const process = async (
    refreshType: RefreshType,
    processHandler: (item: RefreshQueue) => Promise<void>
) => {
    const item = await prisma.$transaction(async (tx) => {
        const item = await tx.refreshQueue.findFirst({
            where: {
                refreshType: refreshType
            },
            orderBy: {
                priority: 'asc'
            }
        })

        if (item == null) return null

        await tx.refreshQueue.delete({
            where: {
                id: item.id
            }
        })

        return item
    })

    if (item) await processHandler(item)
}

main()
