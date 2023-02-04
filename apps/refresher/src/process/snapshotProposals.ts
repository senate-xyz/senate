import {
    RefreshQueue,
    RefreshStatus,
    RefreshType,
    prisma
} from '@senate/database'
import superagent from 'superagent'
import { DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE } from '../config'
import { log_ref } from '@senate/axiom'

export const processSnapshotProposals = async (item: RefreshQueue) => {
    const daoHandler = await prisma.dAOHandler.findFirst({
        where: { id: item.handlerId },
        include: { dao: true }
    })

    await superagent
        .post(`${process.env.DETECTIVE_URL}/updateSnapshotProposals`)
        .send({
            daoHandlerId: item.handlerId,
            minCreatedAt:
                daoHandler?.lastSnapshotProposalCreatedTimestamp?.valueOf()
        })
        .type('application/json')
        .timeout({
            response: DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE * 60 * 1000 - 5000,
            deadline: DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE * 60 * 1000 - 5000
        })
        .retry(3, (err, res) => {
            if (res.status == 201) return false
            if (err) return true
            return false
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
                    lastRefreshTimestamp: new Date()
                }
            })

            log_ref.log({
                level: 'info',
                message: `Process refresh items`,
                dao: daoHandler.dao.name,
                daoHandler: daoHandler.id,
                type: RefreshType.DAOSNAPSHOTPROPOSALS,
                postRequest: `${process.env.DETECTIVE_URL}/updateSnapshotProposals`,
                postBody: {
                    daoHandlerId: item.handlerId,
                    minCreatedAt:
                        daoHandler?.lastSnapshotProposalCreatedTimestamp?.valueOf()
                },
                response: data
            })

            return
        })
        .catch(async (e) => {
            await prisma.dAOHandler.update({
                where: {
                    id: item.handlerId
                },
                data: {
                    refreshStatus: RefreshStatus.NEW,
                    lastRefreshTimestamp: new Date(),
                    lastSnapshotProposalCreatedTimestamp: new Date(
                        Date.now() - 1000 * 60 * 60 * 24 * 90
                    )
                }
            })

            log_ref.log({
                level: 'error',
                message: `Process refresh items`,
                dao: daoHandler.dao.name,
                daoHandler: daoHandler.id,
                type: RefreshType.DAOSNAPSHOTPROPOSALS,
                postRequest: `${process.env.DETECTIVE_URL}/updateSnapshotProposals`,
                postBody: {
                    daoHandlerId: item.handlerId,
                    minCreatedAt:
                        daoHandler?.lastSnapshotProposalCreatedTimestamp?.valueOf()
                },
                errorMessage: e.message,
                errorStack: e.stack
            })
        })
}
