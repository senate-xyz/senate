import {
    DAOHandlerType,
    prisma,
    RefreshStatus,
    RefreshType
} from '@senate/database'

import { log_ref } from '@senate/axiom'
import { config } from '../config'

export const addChainProposalsToQueue = async () => {
    await prisma.$transaction(async (tx) => {
        const normalRefresh = new Date(
            Date.now() - config.DAOS_PROPOSALS_CHAIN_INTERVAL * 60 * 1000
        )
        const forceRefresh = new Date(
            Date.now() - config.DAOS_PROPOSALS_CHAIN_INTERVAL_FORCE * 60 * 1000
        )
        const newRefresh = new Date(Date.now() - 15 * 1000)

        const daoHandlers = await tx.dAOHandler.findMany({
            where: {
                type: {
                    in: [
                        DAOHandlerType.AAVE_CHAIN,
                        DAOHandlerType.COMPOUND_CHAIN,
                        DAOHandlerType.MAKER_EXECUTIVE,
                        DAOHandlerType.MAKER_POLL,
                        DAOHandlerType.UNISWAP_CHAIN,
                        DAOHandlerType.ENS_CHAIN,
                        DAOHandlerType.GITCOIN_CHAIN,
                        DAOHandlerType.HOP_CHAIN,
                        DAOHandlerType.DYDX_CHAIN
                    ]
                },
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

        const previousPrio = (await tx.refreshQueue.findFirst({
            where: {
                refreshType: RefreshType.DAOCHAINPROPOSALS
            },
            orderBy: { priority: 'desc' },
            take: 1,
            select: { priority: true }
        })) ?? { priority: 1 }

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
                lastRefresh: new Date()
            }
        })
    })
}
