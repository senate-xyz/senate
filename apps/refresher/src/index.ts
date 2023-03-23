import { prisma } from '@senate/database'
import { config, loadConfig } from './config'
import { createVoterHandlers } from './createHandlers'
import { processSnapshotProposals } from './process/snapshotProposals'
import { processSnapshotDaoVotes } from './process/snapshotDaoVotes'
import { processChainProposals } from './process/chainProposals'
import { processChainDaoVotes } from './process/chainDaoVotes'
import { addChainProposalsToQueue } from './populate/addChainProposals'
import { addChainDaoVotes } from './populate/addChainDaoVotes'
import { addSnapshotDaoVotes } from './populate/addSnapshotDaoVotes'
import { addSnapshotProposalsToQueue } from './populate/addSnapshotProposals'
import { prismaLogs, sleep } from './utils'
import { scheduleJob } from 'node-schedule'

const main = async () => {
    await loadConfig()
    await createVoterHandlers()

    scheduleJob('* * * * * *', async () => {
        await loadConfig()
        await createVoterHandlers()

        await addSnapshotProposalsToQueue()
        await addSnapshotDaoVotes()

        await addChainProposalsToQueue()
        await addChainDaoVotes()
    })

    scheduleJob('*/10 * * * * *', async () => {
        await prismaLogs()
    })

    let start = Date.now()

    while (true) {
        start = Date.now()

        const hasQueue = await prisma.refreshQueue.count()

        if (hasQueue) {
            processSnapshotProposals()
            processSnapshotDaoVotes()
            processChainProposals()
            processChainDaoVotes()
        }

        while (Date.now() - start < config.REFRESH_PROCESS_INTERVAL_MS) {
            await sleep(10)
        }
    }
}

main()
