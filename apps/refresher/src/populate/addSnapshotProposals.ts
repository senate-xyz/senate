import { log_ref } from '@senate/axiom'
import { config } from '../config'
import { DAOHandlerType, RefreshStatus, prisma } from '@senate/database'
import { RefreshType, refreshQueue } from '..'

export const addSnapshotProposalsToQueue = async () => {
    const normalRefresh = new Date(
        Date.now() - config.DAOS_PROPOSALS_SNAPSHOT_INTERVAL * 60 * 1000
    )
    const forceRefresh = new Date(
        Date.now() - config.DAOS_PROPOSALS_SNAPSHOT_INTERVAL_FORCE * 60 * 1000
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
                            lastRefresh: {
                                lt: normalRefresh
                            }
                        },
                        {
                            refreshStatus: RefreshStatus.PENDING,
                            lastRefresh: {
                                lt: forceRefresh
                            }
                        },
                        {
                            refreshStatus: RefreshStatus.NEW,
                            lastRefresh: {
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

            const previousPrio = Math.max(
                ...refreshQueue
                    .filter(
                        (o) => o.refreshType == RefreshType.DAOSNAPSHOTPROPOSALS
                    )
                    .map((o) => o.priority),
                0
            )

            refreshQueue.push(
                ...daoHandlers.map((daoHandler) => {
                    return {
                        handlerId: daoHandler.id,
                        refreshType: RefreshType.DAOSNAPSHOTPROPOSALS,
                        priority: Number(previousPrio) + 1,
                        args: {}
                    }
                })
            )

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
        {
            maxWait: 50000,
            timeout: 10000
        }
    )
}
