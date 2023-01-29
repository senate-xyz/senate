import {
    DAOHandlerType,
    RefreshStatus,
    RefreshType,
    VoterHandler,
    prisma
} from '@senate/database'
import {
    DAOS_VOTES_CHAIN_INTERVAL,
    DAOS_VOTES_CHAIN_INTERVAL_FORCE
} from '../config'
import { bin } from 'd3-array'
import { log_ref } from '@senate/axiom'

export const addChainDaoVotes = async () => {
    const normalRefresh = new Date(
        Date.now() - DAOS_VOTES_CHAIN_INTERVAL * 60 * 1000
    )
    const forceRefresh = new Date(
        Date.now() - DAOS_VOTES_CHAIN_INTERVAL_FORCE * 60 * 1000
    )
    const newRefresh = new Date(Date.now() - 5 * 1000)

    await prisma.$transaction(
        async (tx) => {
            let daoHandlers = await tx.dAOHandler.findMany({
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
                    voterHandlers: {
                        some: {
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
                        }
                    }
                },
                include: {
                    voterHandlers: {
                        include: { voter: true }
                    },
                    dao: true,
                    proposals: true
                }
            })

            daoHandlers = daoHandlers.filter(
                (daoHandlers) => daoHandlers.proposals.length
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

            let voterHandlersRefreshed: VoterHandler[] = []

            const refreshEntries = daoHandlers
                .map((daoHandler) => {
                    //this makes sense to be filtered inside the prisma query but
                    //if we do that prisma won't let us include voter anymore for some reason
                    const voterHandlers = daoHandler.voterHandlers.filter(
                        (vh) =>
                            (vh.refreshStatus == RefreshStatus.DONE &&
                                vh.lastRefreshTimestamp < normalRefresh) ||
                            (vh.refreshStatus == RefreshStatus.PENDING &&
                                vh.lastRefreshTimestamp < forceRefresh) ||
                            (vh.refreshStatus == RefreshStatus.NEW &&
                                vh.lastRefreshTimestamp < newRefresh)
                    )

                    const voteTimestamps = voterHandlers.map((voterHandler) =>
                        Number(voterHandler.lastChainVoteCreatedBlock)
                    )

                    const voteTimestampBuckets = bin()
                        .domain([0, 17000000])
                        .thresholds(10)(voteTimestamps)

                    const refreshItemsDao = voteTimestampBuckets
                        .map((bucket) => {
                            const bucketMax = Number(bucket['x1'])
                            const bucketMin = Number(bucket['x0'])

                            const bucketVh = voterHandlers
                                .filter(
                                    (voterHandler) =>
                                        Number(
                                            voterHandler.lastChainVoteCreatedBlock
                                        ) +
                                            1 >=
                                            bucketMin &&
                                        Number(
                                            voterHandler.lastChainVoteCreatedBlock
                                        ) < bucketMax
                                )
                                .slice(0, 250)

                            voterHandlersRefreshed = [
                                ...voterHandlersRefreshed,
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
                where: { id: { in: voterHandlersRefreshed.map((v) => v.id) } },
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
