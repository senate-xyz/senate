import {
    DAOHandlerType,
    RefreshStatus,
    RefreshType,
    prisma
} from '@senate/database'
import {
    DAOS_PROPOSALS_CHAIN_INTERVAL,
    DAOS_PROPOSALS_CHAIN_INTERVAL_FORCE
} from '../config'
import { log_ref } from '@senate/axiom'

export const addChainProposalsToQueue = async () => {
    const normalRefresh = new Date(
        Date.now() - DAOS_PROPOSALS_CHAIN_INTERVAL * 60 * 1000
    )
    const forceRefresh = new Date(
        Date.now() - DAOS_PROPOSALS_CHAIN_INTERVAL_FORCE * 60 * 1000
    )
    const newRefresh = new Date(Date.now() - 15 * 1000)

    await prisma.$transaction(
        async (tx) => {
            const daoHandlers = await tx.dAOHandler.findMany({
                where: {
                    type: {
                        in: [
                            DAOHandlerType.AAVE_CHAIN,
                            DAOHandlerType.COMPOUND_CHAIN,
                            DAOHandlerType.MAKER_EXECUTIVE,
                            DAOHandlerType.MAKER_POLL,
                            DAOHandlerType.UNISWAP_CHAIN
                        ]
                    },
                    OR: [
                        {
                            refreshStatus: RefreshStatus.DONE,
                            lastRefreshTimestamp: {
                                lt: normalRefresh
                            }
                        },
                        {
                            refreshStatus: RefreshStatus.PENDING,
                            lastRefreshTimestamp: {
                                lt: forceRefresh
                            }
                        },
                        {
                            refreshStatus: RefreshStatus.NEW,
                            lastRefreshTimestamp: {
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
                    refreshType: RefreshType.DAOCHAINPROPOSALS
                },
                orderBy: { priority: 'desc' },
                take: 1,
                select: { priority: true }
            })) ?? { priority: 50 }

            daoHandlers.map((daoHandler) =>
                log_ref.log({
                    level: 'info',
                    message: `Added refresh items to queue`,
                    dao: daoHandler.dao.name,
                    daoHandler: daoHandler.id,
                    type: RefreshType.DAOCHAINPROPOSALS
                })
            )

            await tx.refreshQueue.createMany({
                data: daoHandlers.map((daoHandler) => {
                    return {
                        handlerId: daoHandler.id,
                        refreshType: RefreshType.DAOCHAINPROPOSALS,
                        priority: Number(previousPrio.priority) + 1,
                        args: {}
                    }
                })
            })

            await tx.dAOHandler.updateMany({
                where: {
                    id: {
                        in: daoHandlers.map((daoHandler) => daoHandler.id)
                    }
                },
                data: {
                    refreshStatus: RefreshStatus.PENDING,
                    lastRefreshTimestamp: new Date()
                }
            })
        },
        {
            maxWait: 20000,
            timeout: 60000
        }
    )
}
