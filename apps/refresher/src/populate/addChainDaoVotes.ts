import { log_ref } from '@senate/axiom'
import { bin } from 'd3-array'
import { config } from '../config'
import {
    DAOHandlerType,
    RefreshStatus,
    RefreshType,
    prisma,
    type VoterHandler
} from '..'

export const addChainDaoVotes = async () => {
    await prisma.$transaction(async (tx) => {
        const normalRefresh = new Date(
            Date.now() - config.DAOS_VOTES_CHAIN_INTERVAL * 60 * 1000
        )
        const forceRefresh = new Date(
            Date.now() - config.DAOS_VOTES_CHAIN_INTERVAL_FORCE * 60 * 1000
        )
        const newRefresh = new Date(Date.now() - 5 * 1000)

        let daoHandlers = await tx.dAOHandler.findMany({
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
                voterHandlers: {
                    some: {
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
                    }
                }
            },
            include: {
                voterHandlers: {
                    where: {
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
                    include: { voter: true }
                },
                dao: true,
                proposals: true
            }
        })

        daoHandlers = daoHandlers.filter(
            (daoHandler) =>
                daoHandler.proposals.length ||
                daoHandler.type == DAOHandlerType.MAKER_POLL_ARBITRUM
        )

        if (!daoHandlers.length) {
            return
        }

        const previousPrio = (await tx.refreshQueue.findFirst({
            where: {
                refreshType: RefreshType.DAOCHAINVOTES
            },
            orderBy: { priority: 'desc' },
            take: 1,
            select: { priority: true }
        })) ?? { priority: 1 }

        let voterHandlerToRefresh: VoterHandler[] = []

        const refreshEntries = daoHandlers
            .map((daoHandler) => {
                const voterHandlers = daoHandler.voterHandlers

                const voteTimestamps = voterHandlers.map((voterHandler) =>
                    Number(voterHandler.chainIndex)
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
                                        Number(voterHandler.chainIndex) &&
                                    Number(voterHandler.chainIndex) < bucketMax
                            )
                            .slice(0, 100)

                        voterHandlerToRefresh = [
                            ...voterHandlerToRefresh,
                            ...bucketVh
                        ]

                        return {
                            bucket: `[${bucketMin}, ${bucketMax}] - ${bucketVh.length} items`,
                            item: {
                                handlerId: daoHandler.id,
                                refreshType: RefreshType.DAOCHAINVOTES,
                                args: {
                                    voters: bucketVh.map(
                                        (vhandler) => vhandler.voter.address
                                    )
                                },
                                priority: Number(previousPrio.priority) + 1
                            }
                        }
                    })
                    .filter((el) => el.item.args.voters.length)

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

        await tx.refreshQueue.createMany({
            data: refreshEntries.map((q) => q.item)
        })

        await tx.voterHandler.updateMany({
            where: { id: { in: voterHandlerToRefresh.map((v) => v.id) } },
            data: {
                refreshStatus: RefreshStatus.PENDING,
                lastRefresh: new Date()
            }
        })
    })
}
