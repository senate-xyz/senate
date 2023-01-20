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
                                        lt: new Date(
                                            Date.now() -
                                                DAOS_VOTES_CHAIN_INTERVAL *
                                                    60 *
                                                    1000
                                        )
                                    }
                                },
                                {
                                    refreshStatus: RefreshStatus.PENDING,
                                    lastRefreshTimestamp: {
                                        lt: new Date(
                                            Date.now() -
                                                DAOS_VOTES_CHAIN_INTERVAL_FORCE *
                                                    60 *
                                                    1000
                                        )
                                    }
                                },
                                {
                                    refreshStatus: RefreshStatus.NEW,
                                    lastRefreshTimestamp: {
                                        lt: new Date(Date.now() - 15 * 1000)
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
                    const voteTimestamps = daoHandler.voterHandlers.map(
                        (voterHandler) =>
                            Number(voterHandler.lastChainVoteCreatedBlock)
                    )

                    const voteTimestampBuckets = bin()
                        .domain([0, 17000000])
                        .thresholds(10)(voteTimestamps)

                    const refreshItemsDao = voteTimestampBuckets
                        .map((bucket) => {
                            const bucketMax = Number(bucket['x1'])
                            const bucketMin = Number(bucket['x0'])

                            const votershandlers =
                                daoHandler.voterHandlers.filter(
                                    (voterHandler) =>
                                        Number(
                                            voterHandler.lastChainVoteCreatedBlock
                                        ) >= bucketMin &&
                                        Number(
                                            voterHandler.lastChainVoteCreatedBlock
                                        ) < bucketMax
                                )

                            voterHandlersRefreshed = [
                                ...voterHandlersRefreshed,
                                ...votershandlers
                            ]

                            return {
                                bucket: `[${bucketMin}, ${bucketMax}] - ${votershandlers.length} items`,
                                query: {
                                    handlerId: daoHandler.id,
                                    refreshType: RefreshType.DAOCHAINVOTES,
                                    args: {
                                        voters: votershandlers.map(
                                            (vhandler) => vhandler.voter.address
                                        )
                                    },
                                    priority: Number(previousPrio.priority) + 1
                                }
                            }
                        })
                        .filter((el) => el.query.args.voters.length)

                    log_ref.log({
                        level: 'info',
                        message: `Added items to queue`,
                        data: {
                            dao: daoHandler.dao.name,
                            type: RefreshType.DAOCHAINVOTES,
                            noOfBuckets: refreshItemsDao.length,
                            items: refreshItemsDao
                        }
                    })

                    return refreshItemsDao
                })
                .flat(2)

            await tx.refreshQueue.createMany({
                data: refreshEntries.map((q) => q.query)
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
