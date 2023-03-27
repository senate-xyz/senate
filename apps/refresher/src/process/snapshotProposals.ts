import superagent from 'superagent'
import { log_ref } from '@senate/axiom'
import { config } from '../config'
import { RefreshStatus, RefreshType, prisma } from '..'

export const processSnapshotProposals = async () => {
    const [item, daoHandler] = await prisma.$transaction(async (tx) => {
        const item = await tx.refreshQueue.findFirst({
            where: {
                refreshType: RefreshType.DAOSNAPSHOTPROPOSALS
            },
            orderBy: {
                priority: 'asc'
            }
        })

        if (item == null) return [null, null]

        const daoHandler = await tx.dAOHandler.findFirst({
            where: { id: item.handlerId },
            include: { dao: true }
        })

        await tx.refreshQueue.delete({
            where: {
                id: item.id
            }
        })

        return [item, daoHandler]
    })

    if (!item) return

    await superagent
        .post(`${process.env.DETECTIVE_URL}/updateSnapshotProposals`)
        .send({
            daoHandlerId: item.handlerId
        })
        .type('application/json')
        .timeout({
            response:
                config.DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE * 60 * 1000 -
                5000,
            deadline:
                config.DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE * 60 * 1000 - 5000
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
                    minCreatedAt: daoHandler?.snapshotIndex?.valueOf()
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
                    snapshotIndex: new Date('2009-01-09T04:54:25.00Z')
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
                    minCreatedAt: daoHandler?.snapshotIndex?.valueOf()
                },
                errorMessage: e.message,
                errorStack: e.stack
            })
        })
}
