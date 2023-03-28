import { scheduleJob } from 'node-schedule'
import { loadConfig } from './config'
import { createVoterHandlers } from './createHandlers'
import { log_ref } from '@senate/axiom'
import { processChainDaoVotes } from './process/chainDaoVotes'
import { processChainProposals } from './process/chainProposals'
import { processSnapshotDaoVotes } from './process/snapshotDaoVotes'
import { processSnapshotProposals } from './process/snapshotProposals'
import { addChainDaoVotes } from './populate/addChainDaoVotes'
import { addChainProposalsToQueue } from './populate/addChainProposals'
import { addSnapshotDaoVotes } from './populate/addSnapshotDaoVotes'
import { addSnapshotProposalsToQueue } from './populate/addSnapshotProposals'

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
    await createVoterHandlers()

    scheduleJob('* * * * * *', async () => {
        createVoterHandlers()

        refreshQueue.push(...(await addSnapshotProposalsToQueue()))
        refreshQueue.push(...(await addSnapshotDaoVotes()))

        refreshQueue.push(...(await addChainProposalsToQueue()))
        refreshQueue.push(...(await addChainDaoVotes()))

        console.log(JSON.stringify(refreshQueue))
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
