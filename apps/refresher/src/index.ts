import { scheduleJob } from 'node-schedule'
import { createVoterHandlers } from './createHandlers'
import { log_ref } from '@senate/axiom'
import { addChainDaoVotesToQueue } from './populate/addChainDaoVotes'
import { addChainProposalsToQueue } from './populate/addChainProposals'
import { addSnapshotDaoVotes } from './populate/addSnapshotDaoVotes'
import { addSnapshotProposalsToQueue } from './populate/addSnapshotProposals'
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

    scheduleJob('*/10 * * * * *', async () => {
        await createVoterHandlers()
    })

    scheduleJob('* * * * * *', async () => {
        const newSnapshotProposals = JSON.parse(
            JSON.stringify(await addSnapshotProposalsToQueue())
        )
        const newSnapshotVotes = JSON.parse(
            JSON.stringify(await addSnapshotDaoVotes())
        )
        const newChainProposals = JSON.parse(
            JSON.stringify(await addChainProposalsToQueue())
        )
        const newChainVotes = JSON.parse(
            JSON.stringify(await addChainDaoVotesToQueue())
        )

        refreshQueue.push(...newSnapshotProposals)
        refreshQueue.push(...newSnapshotVotes)

        refreshQueue.push(...newChainProposals)
        refreshQueue.push(...newChainVotes)
        global.gc()
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
    }, 300)
}

main()
