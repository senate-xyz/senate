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
import { scheduleJob } from 'node-schedule'
import { log_ref } from '@senate/axiom'

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
            processSnapshotProposals()
            processSnapshotDaoVotes()
            processChainProposals()
            processChainDaoVotes()
        }
    }, config.REFRESH_PROCESS_INTERVAL_MS)
}

main()
