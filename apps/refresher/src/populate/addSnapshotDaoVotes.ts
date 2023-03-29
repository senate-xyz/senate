import { bin } from 'd3-array'
import { thresholdsTime } from '../utils'
import { log_ref } from '@senate/axiom'
import {
    DAOHandlerType,
    RefreshStatus,
    prisma,
    type VoterHandler
} from '@senate/database'
import { RefreshType } from '..'

export const addSnapshotDaoVotes = async () => {
    const normalRefresh = new Date(Date.now() - 1 * 60 * 1000)
    const forceRefresh = new Date(Date.now() - 10 * 60 * 1000)
    const newRefresh = new Date(Date.now() - 5 * 1000)

    const queueItems = await prisma.$transaction(
        async (tx) => {
            let daoHandlers = await tx.dAOHandler.findMany({
                where: {
                    type: DAOHandlerType.SNAPSHOT,
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
                (daoHandlers) => daoHandlers.proposals.length
            )

            if (!daoHandlers.length) {
                return []
            }

            let voterHandlerToRefresh: VoterHandler[] = []

            const refreshEntries = daoHandlers
                .map((daoHandler) => {
                    const voterHandlers = daoHandler.voterHandlers

                    const voteTimestamps = voterHandlers.map((voterHandler) =>
                        Number(voterHandler.snapshotIndex?.getTime())
                    )

                    const voteTimestampBuckets = bin<number, Date>()
                        .domain([
                            new Date('2009-01-09T04:54:25.00Z'),
                            new Date(Date.now() + 60 * 60 * 1000)
                        ])
                        .thresholds(thresholdsTime(10))(voteTimestamps)

                    const refreshItemsDao = voteTimestampBuckets
                        .map((bucket) => {
                            const bucketMax = Number(bucket['x1'])
                            const bucketMin = Number(bucket['x0'])

                            const bucketVh = voterHandlers
                                .filter(
                                    (voterHandler) =>
                                        bucketMin <=
                                            Number(
                                                voterHandler.snapshotIndex?.getTime()
                                            ) &&
                                        Number(
                                            voterHandler.snapshotIndex?.getTime()
                                        ) < bucketMax
                                )
                                .slice(0, 100)

                            voterHandlerToRefresh = [
                                ...voterHandlerToRefresh,
                                ...bucketVh
                            ]

                            return {
                                handlerId: daoHandler.id,
                                refreshType: RefreshType.DAOSNAPSHOTVOTES,
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
                        type: RefreshType.DAOSNAPSHOTVOTES,
                        noOfBuckets: refreshItemsDao.length,
                        items: refreshItemsDao
                    })

                    return refreshItemsDao
                })
                .flat(2)

            await tx.voterHandler.updateMany({
                where: { id: { in: voterHandlerToRefresh.map((v) => v.id) } },
                data: {
                    refreshStatus: RefreshStatus.PENDING,
                    lastRefresh: new Date()
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
