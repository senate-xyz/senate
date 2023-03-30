import { log_ref } from '@senate/axiom'
import { DAOHandlerType, RefreshStatus, prisma } from '@senate/database'
import { RefreshType } from '..'

export const addChainProposalsToQueue = async () => {
    const normalRefresh = new Date(Date.now() - 1 * 60 * 1000)
    const forceRefresh = new Date(Date.now() - 10 * 60 * 1000)
    const newRefresh = new Date(Date.now() - 15 * 1000)

    const queueItems = await prisma.$transaction(
        async (tx) => {
            const daoHandlers = await tx.daohandler.findMany({
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
                    type: RefreshType.DAOCHAINPROPOSALS
                })
            )

            const refreshEntries = daoHandlers.map((daoHandler) => {
                return {
                    handlerId: daoHandler.id,
                    refreshType: RefreshType.DAOCHAINPROPOSALS,
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
