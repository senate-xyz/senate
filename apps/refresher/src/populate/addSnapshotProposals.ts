import {
    DAOHandlerType,
    prisma,
    RefreshStatus,
    RefreshType
} from '@senate/database'
import { log_ref } from '@senate/axiom'
import { config } from '../config'

export const addSnapshotProposalsToQueue = async () => {
    await prisma.$transaction(
        async (tx) => {
            const normalRefresh = new Date(
                Date.now() - config.DAOS_PROPOSALS_SNAPSHOT_INTERVAL * 60 * 1000
            )
            const forceRefresh = new Date(
                Date.now() -
                    config.DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE * 60 * 1000
            )
            const newRefresh = new Date(Date.now() - 15 * 1000)

            const daoHandlers = await tx.dAOHandler.findMany({
                where: {
                    type: DAOHandlerType.SNAPSHOT,
                    refreshStatus: {
                        in: [
                            RefreshStatus.DONE,
                            RefreshStatus.PENDING,
                            RefreshStatus.NEW
                        ]
                    },
                    lastRefresh: {
                        lt: {
                            [RefreshStatus.DONE]: normalRefresh,
                            [RefreshStatus.PENDING]: forceRefresh,
                            [RefreshStatus.NEW]: newRefresh
                        }[
                            RefreshStatus.DONE ||
                                RefreshStatus.PENDING ||
                                RefreshStatus.NEW
                        ]
                    }
                },
                include: {
                    dao: true
                }
            })

            if (!daoHandlers.length) {
                return
            }

            const previousPrio = (await tx.refreshQueue.findFirst({
                where: {
                    refreshType: RefreshType.DAOSNAPSHOTPROPOSALS
                },
                orderBy: { priority: 'desc' },
                take: 1,
                select: { priority: true }
            })) ?? { priority: 1 }

            await tx.refreshQueue.createMany({
                data: daoHandlers.map((daoHandler) => {
                    return {
                        handlerId: daoHandler.id,
                        refreshType: RefreshType.DAOSNAPSHOTPROPOSALS,
                        priority: Number(previousPrio.priority) + 1,
                        args: {}
                    }
                })
            })

            daoHandlers.map((daoHandler) =>
                log_ref.log({
                    level: 'info',
                    message: `Added refresh items to queue`,
                    dao: daoHandler.dao.name,
                    daoHandler: daoHandler.id,
                    type: RefreshType.DAOSNAPSHOTPROPOSALS
                })
            )

            await tx.dAOHandler.updateMany({
                where: {
                    id: {
                        in: daoHandlers.map((daoHandler) => daoHandler.id)
                    }
                },
                data: {
                    refreshStatus: RefreshStatus.PENDING,
                    lastRefresh: new Date()
                }
            })
        },
        { maxWait: 30000 }
    )
}
