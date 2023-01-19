import { RefreshQueue, RefreshStatus, prisma } from '@senate/database'
import superagent from 'superagent'
import { DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE } from '../config'

export const processSnapshotProposals = async (item: RefreshQueue) => {
    const daoHandler = await prisma.dAOHandler.findFirst({
        where: { id: item.handlerId }
    })

    const proposalDetectiveReq = `${
        process.env.DETECTIVE_URL
    }/updateSnapshotProposals?daoHandlerIds=${
        item.handlerId
    }&minCreatedAt=${daoHandler?.lastSnapshotProposalCreatedTimestamp?.valueOf()}`

    await superagent
        .post(proposalDetectiveReq)
        .type('application/json')
        .timeout({
            response: DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE * 60 * 1000 - 5000,
            deadline: DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE * 60 * 1000 - 5000
        })
        .retry(3, (err, res) => {
            if (res.status == 201) return false
            if (err) return true
        })
        .then(async (response) => response.body)
        .then(async (data) => {
            if (!data) return
            if (!Array.isArray(data)) return

            await prisma.dAOHandler.updateMany({
                where: {
                    id: {
                        in: data
                            .filter((result) => result.response == 'ok')
                            .map((result) => result.daoHandlerId)
                    }
                },
                data: {
                    refreshStatus: RefreshStatus.DONE,
                    lastRefreshTimestamp: new Date()
                }
            })

            await prisma.dAOHandler.updateMany({
                where: {
                    id: {
                        in: data
                            .filter((result) => result.response == 'nok')
                            .map((result) => result.daoHandlerId)
                    }
                },
                data: {
                    refreshStatus: RefreshStatus.NEW,
                    lastRefreshTimestamp: new Date(0),
                    lastChainProposalCreatedBlock: 0,
                    lastSnapshotProposalCreatedTimestamp: new Date(0)
                }
            })

            return
        })
        .catch(async () => {
            await prisma.dAOHandler.update({
                where: {
                    id: item.handlerId
                },
                data: {
                    refreshStatus: RefreshStatus.NEW,
                    lastRefreshTimestamp: new Date(0),
                    lastChainProposalCreatedBlock: 0,
                    lastSnapshotProposalCreatedTimestamp: new Date(0)
                }
            })
        })
}
