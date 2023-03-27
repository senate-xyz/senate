import { config, loadConfig } from './config'
import { createVoterHandlers } from './createHandlers'
import { addChainProposalsToQueue } from './populate/addChainProposals'
import { addChainDaoVotes } from './populate/addChainDaoVotes'
import { scheduleJob } from 'node-schedule'
import { log_ref } from '@senate/axiom'
import { processChainDaoVotes } from './process/chainDaoVotes'
import { processSnapshotDaoVotes } from './process/snapshotDaoVotes'
import { processSnapshotProposals } from './process/snapshotProposals'
import { processChainProposals } from './process/chainProposals'
import { addSnapshotDaoVotes } from './populate/addSnapshotDaoVotes'
import { addSnapshotProposalsToQueue } from './populate/addSnapshotProposals'

export enum RefreshType {
    DAOCHAINPROPOSALS,
    DAOSNAPSHOTPROPOSALS,
    DAOCHAINVOTES,
    DAOSNAPSHOTVOTES
}

export type RefreshQueueType = {
    handlerId: string
    refreshType: RefreshType
    args: object
}
export const refreshQueue: RefreshQueueType[] = []

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
        console.log(refreshQueue)

        if (refreshQueue.length) {
            process(processSnapshotProposals)
            process(processSnapshotDaoVotes)
            process(processChainProposals)
            process(processChainDaoVotes)
        }
    }, config.REFRESH_PROCESS_INTERVAL_MS)
}

const process = async (
    processHandler: (item: RefreshQueueType) => Promise<void>
) => {
    const item = refreshQueue.pop()

    if (item) {
        await processHandler(item)
    }
}

main()
