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

export enum RefreshType {
    DAOCHAINPROPOSALS,
    DAOSNAPSHOTPROPOSALS,
    DAOCHAINVOTES,
    DAOSNAPSHOTVOTES
}

export type RefreshQueueType = {
    handlerId: string
    refreshType: RefreshType
    priority: number
    args: object
}
export let refreshQueue: RefreshQueueType[] = []

const main = async () => {
    log_ref.log({
        level: 'info',
        message: `Started refresher`
    })

    await loadConfig()
    await createVoterHandlers()

    scheduleJob('* * * * * *', async () => {
        await createVoterHandlers()

        // await addSnapshotProposalsToQueue()
        // await addSnapshotDaoVotes()

        await addChainProposalsToQueue()
        await addChainDaoVotes()
    })

    setInterval(async () => {
        console.log(refreshQueue)

        if (refreshQueue.length) {
            process(RefreshType.DAOSNAPSHOTPROPOSALS, processSnapshotProposals)
            process(RefreshType.DAOSNAPSHOTVOTES, processSnapshotDaoVotes)
            process(RefreshType.DAOCHAINPROPOSALS, processChainProposals)
            process(RefreshType.DAOCHAINVOTES, processChainDaoVotes)
        }
    }, config.REFRESH_PROCESS_INTERVAL_MS)
}

const process = async (
    refreshType: RefreshType,
    processHandler: (item: RefreshQueueType) => Promise<void>
) => {
    const item = refreshQueue
        .filter((o) => o.refreshType == refreshType)
        .reduce(
            (prev, current) => {
                return prev.priority < current.priority ? prev : current
            },
            {
                handlerId: '',
                refreshType: 0,
                priority: Number.MAX_VALUE,
                args: {}
            }
        )

    if (item && item.handlerId != '') {
        refreshQueue = refreshQueue.filter((o) => o !== item)
        await processHandler(item)
    }
}

main()
