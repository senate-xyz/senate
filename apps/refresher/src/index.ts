import { scheduleJob } from 'node-schedule'
import { loadConfig } from './config'
import { createVoterHandlers } from './createHandlers'
import { log_ref } from '@senate/axiom'
import { addChainDaoVotes } from './populate/addChainDaoVotes'
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

    scheduleJob('* * * * * *', async () => {
        await loadConfig()
        await createVoterHandlers()

        refreshQueue.push(...(await addSnapshotProposalsToQueue()))
        refreshQueue.push(...(await addSnapshotDaoVotes()))

        refreshQueue.push(...(await addChainProposalsToQueue()))
        refreshQueue.push(...(await addChainDaoVotes()))

        console.log(refreshQueue.length)
    })

    setInterval(() => {
        if (refreshQueue.length) {
            const item = refreshQueue.pop()

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
