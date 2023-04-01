import { scheduleJob } from 'node-schedule'
import { createVoterHandlers } from './createHandlers'
import { log_ref } from '@senate/axiom'
import { CONFIG, loadConfig } from './config'
import { addChainDaoVotesToQueue } from './populate/addChainDaoVotes'
import { addChainProposalsToQueue } from './populate/addChainProposals'
import { addSnapshotDaoVotes } from './populate/addSnapshotDaoVotes'
import { addSnapshotProposalsToQueue } from './populate/addSnapshotProposals'
import { processChainDaoVotes } from './process/chainDaoVotes'
import { processChainProposals } from './process/chainProposals'
import { processSnapshotDaoVotes } from './process/snapshotDaoVotes'
import { processSnapshotProposals } from './process/snapshotProposals'

export enum RefreshType {
    DAOCHAINPROPOSALS,
    DAOSNAPSHOTPROPOSALS,
    DAOCHAINVOTES,
    DAOSNAPSHOTVOTES
}

export type RefreshQueueType = {
    refreshType: RefreshType
    handlerId: string
    args: object
}
export const refreshQueue: RefreshQueueType[] = []

const main = async () => {
    log_ref.log({
        level: 'info',
        message: `Started refresher`
    })

    await loadConfig()

    setInterval(() => {
        if (global.gc) global.gc()
    }, 5 * 30 * 1000)

    scheduleJob('*/10 * * * * *', async () => {
        await loadConfig()
        await createVoterHandlers()
    })

    scheduleJob('* * * * * *', async () => {
        const newSnapshotProposals = await addSnapshotProposalsToQueue()
        const newSnapshotVotes = await addSnapshotDaoVotes()

        refreshQueue.push(...newSnapshotProposals)
        refreshQueue.push(...newSnapshotVotes)

        const newChainProposals = await addChainProposalsToQueue()
        const newChainVotes = await addChainDaoVotesToQueue()

        refreshQueue.push(...newChainProposals)
        refreshQueue.push(...newChainVotes)
    })

    setInterval(() => {
        if (refreshQueue.length) {
            const item = refreshQueue.shift()

            switch (item.refreshType) {
                case RefreshType.DAOSNAPSHOTPROPOSALS:
                    processSnapshotProposals(item)
                    break
                case RefreshType.DAOSNAPSHOTVOTES:
                    processSnapshotDaoVotes(item)
                    break
                case RefreshType.DAOCHAINPROPOSALS:
                    processChainProposals(item)
                    break
                case RefreshType.DAOCHAINVOTES:
                    processChainDaoVotes(item)
                    break
                default:
                    break
            }
        }
    }, CONFIG.refresh_interval)
}

main()
