import {
    RefreshStatus,
    RefreshType,
    prisma,
    RefreshQueue,
    DAOHandlerWithDAO
} from '@senate/database'
import superagent from 'superagent'
import { DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE } from '../config'
import { log_ref } from '@senate/axiom'

export const processSnapshotProposals = async () => {
    let item: RefreshQueue, daoHandler: DAOHandlerWithDAO

    await prisma.$transaction(
        async (tx) => {
            item = await tx.refreshQueue.findFirst({
                where: {
                    refreshType: RefreshType.DAOSNAPSHOTPROPOSALS
                },
                orderBy: {
                    priority: 'asc'
                }
            })

            if (!item) return

            await tx.refreshQueue.delete({
                where: {
                    id: item.id
                }
            })

            daoHandler = await tx.dAOHandler.findFirst({
                where: { id: item.handlerId },
                include: { dao: true }
            })
        },
        {
            maxWait: 30000
        }
    )

    if (!item) return

    await superagent
        .post(`${process.env.DETECTIVE_URL}/updateSnapshotProposals`)
        .send({
            daoHandlerId: item.handlerId,
            minCreatedAt: daoHandler?.lastSnapshotRefresh?.valueOf()
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

            await prisma.$transaction([
                prisma.dAOHandler.updateMany({
                    where: {
                        id: {
                            in: data
                                .filter((result) => result.response == 'ok')
                                .map((result) => result.daoHandlerId)
                        }
                    },
                    data: {
                        refreshStatus: RefreshStatus.DONE,
                        lastRefresh: new Date()
                    }
                }),
                prisma.dAOHandler.updateMany({
                    where: {
                        id: {
                            in: data
                                .filter((result) => result.response == 'nok')
                                .map((result) => result.daoHandlerId)
                        }
                    },
                    data: {
                        refreshStatus: RefreshStatus.NEW,
                        lastRefresh: new Date()
                    }
                })
            ])

            log_ref.log({
                level: 'info',
                message: `Process refresh items`,
                dao: daoHandler.dao.name,
                daoHandler: daoHandler.id,
                type: RefreshType.DAOSNAPSHOTPROPOSALS,
                postRequest: `${process.env.DETECTIVE_URL}/updateSnapshotProposals`,
                postBody: {
                    daoHandlerId: item.handlerId,
                    minCreatedAt: daoHandler?.lastSnapshotRefresh?.valueOf()
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
                    lastRefresh: new Date(),
                    lastSnapshotRefresh: new Date(
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
                    minCreatedAt: daoHandler?.lastSnapshotRefresh?.valueOf()
                },
                errorMessage: e.message,
                errorStack: e.stack
            })
        })
}
