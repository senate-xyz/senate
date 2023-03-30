import { log_ref } from '@senate/axiom'
import { bin } from 'd3-array'
import {
    DAOHandlerType,
    RefreshStatus,
    prisma,
    type VoterHandler
} from '@senate/database'
import { RefreshType } from '..'

export const addChainDaoVotesToQueue = async () => {
    const normalRefresh = new Date(Date.now() - 1 * 60 * 1000)
    const forceRefresh = new Date(Date.now() - 10 * 60 * 1000)
    const newRefresh = new Date(Date.now() - 5 * 1000)

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
                            DAOHandlerType.MAKER_POLL_ARBITRUM,
                            DAOHandlerType.UNISWAP_CHAIN,
                            DAOHandlerType.ENS_CHAIN,
                            DAOHandlerType.GITCOIN_CHAIN,
                            DAOHandlerType.HOP_CHAIN,
                            DAOHandlerType.DYDX_CHAIN
                        ]
                    },
                    voterhandlers: {
                        some: {
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
                        }
                    }
                },
                include: {
                    voterhandlers: {
                        where: {
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
                        include: { voter: true }
                    },
                    dao: true,
                    proposals: true
                }
            })

            const filteredDaoHandlers = daoHandlers.filter(
                (daoHandler) =>
                    daoHandler.proposals.length &&
                    daoHandler.type != DAOHandlerType.MAKER_POLL_ARBITRUM
            )

            if (!filteredDaoHandlers.length) {
                return []
            }

            let voterHandlerToRefresh: VoterHandler[] = []

            const refreshEntries = filteredDaoHandlers
                .map((daoHandler) => {
                    const voterHandlers = daoHandler.voterhandlers

                    const voteTimestamps = voterHandlers.map((voterHandler) =>
                        Number(voterHandler.chainindex)
                    )

                    const domainLimit =
                        daoHandler.type === DAOHandlerType.MAKER_POLL_ARBITRUM
                            ? 100000000
                            : 17000000

                    const voteTimestampBuckets = bin()
                        .domain([0, domainLimit])
                        .thresholds(10)(voteTimestamps)

                    const refreshItemsDao = voteTimestampBuckets
                        .map((bucket) => {
                            const bucketMax = Number(bucket['x1'])
                            const bucketMin = Number(bucket['x0'])

                            const bucketVh = voterHandlers
                                .filter(
                                    (voterHandler) =>
                                        bucketMin <=
                                            Number(voterHandler.chainindex) &&
                                        Number(voterHandler.chainindex) <
                                            bucketMax
                                )
                                .slice(0, 100)

                            voterHandlerToRefresh = [
                                ...voterHandlerToRefresh,
                                ...bucketVh
                            ]

                            return {
                                handlerId: daoHandler.id,
                                refreshType: RefreshType.DAOCHAINVOTES,
                                args: {
                                    voters: bucketVh.map(
                                        (vhandler) => vhandler.voter.address
                                    )
                                }
                            }
                        })
                        .filter((el) => el.args.voters.length)

                    log_ref.log({
                        level: 'info',
                        message: `Added refresh items to queue`,
                        dao: daoHandler.dao.name,
                        daoHandler: daoHandler.id,
                        type: RefreshType.DAOCHAINVOTES,
                        noOfBuckets: refreshItemsDao.length,
                        items: refreshItemsDao
                    })

                    return refreshItemsDao
                })
                .flat(2)

            await tx.voterhandler.updateMany({
                where: { id: { in: voterHandlerToRefresh.map((v) => v.id) } },
                data: {
                    refreshstatus: RefreshStatus.PENDING,
                    lastrefresh: new Date()
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
