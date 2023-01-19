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

export const addChainDaoVotes = async () => {
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
                    voterHandlers: { include: { voter: true } },
                    dao: true
                }
            })

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

                    const voteTimestampBuckets =
                        bin().thresholds(10)(voteTimestamps)

                    return voteTimestampBuckets.map((bucket) => {
                        const bucketMax = Number(bucket['x1'])
                        const bucketMin = Number(bucket['x0'])

                        const votershandlers = daoHandler.voterHandlers.filter(
                            (voterHandler) =>
                                Number(
                                    voterHandler.lastChainVoteCreatedBlock
                                ) >= bucketMin &&
                                Number(
                                    voterHandler.lastChainVoteCreatedBlock
                                ) <= bucketMax
                        )

                        voterHandlersRefreshed = [
                            ...voterHandlersRefreshed,
                            ...votershandlers
                        ]

                        return {
                            handlerId: daoHandler.id,
                            refreshType: RefreshType.DAOCHAINVOTES,
                            args: {
                                voters: votershandlers.map(
                                    (voter) => voter.voter.address
                                )
                            },
                            priority: Number(previousPrio.priority) + 1
                        }
                    })
                })
                .flat(2)
                .filter((el) => el.args.voters.length)

            await tx.refreshQueue.createMany({
                data: refreshEntries
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
