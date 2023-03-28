import { scheduleJob } from 'node-schedule'
import { config, loadConfig } from './config'
import { createVoterHandlers } from './createHandlers'
import { log_ref } from '@senate/axiom'
import { addChainProposalsToQueue } from './populate/addChainProposals'
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
        //createVoterHandlers()

        refreshQueue.push(...(await addSnapshotProposalsToQueue()))
        // refreshQueue.push(...(await addSnapshotDaoVotes()))

        refreshQueue.push(...(await addChainProposalsToQueue()))
        // refreshQueue.push(...(await addChainDaoVotes()))

        console.log(refreshQueue, refreshQueue.length)
    })

    setInterval(() => {
        if (refreshQueue.length) {
            const item = refreshQueue.pop()

            switch (item.refreshType) {
                case RefreshType.DAOSNAPSHOTPROPOSALS:
                    //processSnapshotProposals(item)
                    break
                case RefreshType.DAOSNAPSHOTVOTES:
                    //processSnapshotDaoVotes(item)
                    break
                case RefreshType.DAOCHAINPROPOSALS:
                    //processChainProposals(item)
                    break
                case RefreshType.DAOCHAINVOTES:
                    //processChainDaoVotes(item)
                    break
            }
        }
    }, config.REFRESH_PROCESS_INTERVAL_MS)
}

main()
