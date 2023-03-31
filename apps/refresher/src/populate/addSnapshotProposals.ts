import { DAOHandlerType, RefreshStatus, prisma } from '@senate/database'
import { RefreshType } from '..'
import { log_ref } from '@senate/axiom'
import { CONFIG } from '../config'

export const addSnapshotProposalsToQueue = async () => {
    const normalRefresh = new Date(
        Date.now() - CONFIG.normal_snapshot_proposals
    )
    const forceRefresh = new Date(Date.now() - CONFIG.force_snapshot_proposals)
    const newRefresh = new Date(Date.now() - CONFIG.new_snapshot_proposals)

    const queueItems = await prisma.$transaction(
        async (tx) => {
            const daoHandlers = await tx.daohandler.findMany({
                where: {
                    type: DAOHandlerType.SNAPSHOT,
                    OR: [
                        {
                            refreshstatus: RefreshStatus.DONE,
                            lastrefresh: {
                                lt: normalRefresh
                            }
                        },
                        {
                            refreshstatus: RefreshStatus.PENDING,
                            lastrefresh: {
                                lt: forceRefresh
                            }
                        },
                        {
                            refreshstatus: RefreshStatus.NEW,
                            lastrefresh: {
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
                return []
            }

            await tx.daohandler.updateMany({
                where: {
                    id: {
                        in: daoHandlers.map((daoHandler) => daoHandler.id)
                    }
                },
                data: {
                    refreshstatus: RefreshStatus.PENDING,
                    lastrefresh: new Date()
                }
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

            const refreshEntries = daoHandlers.map((daoHandler) => {
                return {
                    handlerId: daoHandler.id,
                    refreshType: RefreshType.DAOSNAPSHOTPROPOSALS,
                    args: {}
                }
            })

            return refreshEntries
        },
        {
            maxWait: 50000,
            timeout: 10000
        }
    )
    return queueItems
}
