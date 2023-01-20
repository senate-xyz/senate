import {
    DAOHandlerType,
    RefreshStatus,
    RefreshType,
    VoterHandler,
    prisma
} from '@senate/database'
import {
    DAOS_VOTES_SNAPSHOT_INTERVAL,
    DAOS_VOTES_SNAPSHOT_INTERVAL_FORCE
} from '../config'
import { bin } from 'd3-array'
import { thresholdsTime } from '../utils'
import { log_ref } from '@senate/axiom'

export const addSnapshotDaoVotes = async () => {
    await prisma.$transaction(
        async (tx) => {
            let daoHandlers = await tx.dAOHandler.findMany({
                where: {
                    type: DAOHandlerType.SNAPSHOT,
                    voterHandlers: {
                        some: {
                            OR: [
                                {
                                    refreshStatus: RefreshStatus.DONE,
                                    lastRefreshTimestamp: {
                                        lt: new Date(
                                            Date.now() -
                                                DAOS_VOTES_SNAPSHOT_INTERVAL *
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
                                                DAOS_VOTES_SNAPSHOT_INTERVAL_FORCE *
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
                    refreshType: RefreshType.DAOSNAPSHOTVOTES
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
                            Number(
                                voterHandler.lastSnapshotVoteCreatedTimestamp?.valueOf()
                            )
                    )

                    const voteTimestampBuckets = bin<number, Date>()
                        .domain([new Date(0), new Date(Date.now() + 5000)])
                        .thresholds(thresholdsTime(10))(voteTimestamps)

                    const refreshItemsDao = voteTimestampBuckets
                        .map((bucket) => {
                            const bucketMax = Number(bucket['x1'])
                            const bucketMin = Number(bucket['x0'])

                            const votershandlers =
                                daoHandler.voterHandlers.filter(
                                    (voterHandler) =>
                                        Number(
                                            voterHandler.lastSnapshotVoteCreatedTimestamp?.valueOf()
                                        ) >= bucketMin &&
                                        Number(
                                            voterHandler.lastSnapshotVoteCreatedTimestamp?.valueOf()
                                        ) < bucketMax
                                )

                            voterHandlersRefreshed = [
                                ...voterHandlersRefreshed,
                                ...votershandlers
                            ]

                            return {
                                bucket: `[${new Date(
                                    bucketMin
                                ).toUTCString()}, ${new Date(
                                    bucketMax
                                ).toUTCString()}] - ${
                                    votershandlers.length
                                } items`,
                                query: {
                                    handlerId: daoHandler.id,
                                    refreshType: RefreshType.DAOSNAPSHOTVOTES,
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
                            type: RefreshType.DAOSNAPSHOTVOTES,
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
