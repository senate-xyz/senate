import {
    DAOHandlerType,
    RefreshStatus,
    RefreshType,
    prisma
} from '@senate/database'
import {
    DAOS_PROPOSALS_SNAPSHOT_INTERVAL,
    DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE
} from '../config'
import { log_ref } from '@senate/axiom'

export const addSnapshotProposalsToQueue = async () => {
    const normalRefresh = new Date(
        Date.now() - DAOS_PROPOSALS_SNAPSHOT_INTERVAL * 60 * 1000
    )
    const forceRefresh = new Date(
        Date.now() - DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE * 60 * 1000
    )
    const newRefresh = new Date(Date.now() - 15 * 1000)

    await prisma.$transaction(
        async (tx) => {
            const daoHandlers = await tx.dAOHandler.findMany({
                where: {
                    type: DAOHandlerType.SNAPSHOT,
                    OR: [
                        {
                            refreshStatus: RefreshStatus.DONE,
                            lastRefreshDate: {
                                lt: normalRefresh
                            }
                        },
                        {
                            refreshStatus: RefreshStatus.PENDING,
                            lastRefreshDate: {
                                lt: forceRefresh
                            }
                        },
                        {
                            refreshStatus: RefreshStatus.NEW,
                            lastRefreshDate: {
                                lt: newRefresh
                            }
                        }
                    ]
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
            })) ?? { priority: 50 }

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
                    type: RefreshType.DAOCHAINPROPOSALS
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
                    lastRefreshDate: new Date()
                }
            })
        },
        {
            maxWait: 20000,
            timeout: 60000
        }
    )
}
