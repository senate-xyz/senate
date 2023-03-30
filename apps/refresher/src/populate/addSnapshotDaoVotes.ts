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
            const daoHandlers = await tx.daohandler.findMany({
                where: {
                    type: DAOHandlerType.SNAPSHOT,
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
                (daoHandlers) => daoHandlers.proposals.length
            )

            if (!filteredDaoHandlers.length) {
                return []
            }

            let voterHandlerToRefresh: VoterHandler[] = []

            const refreshEntries = filteredDaoHandlers
                .map((daoHandler) => {
                    const voterHandlers = daoHandler.voterhandlers

                    const voteTimestamps = voterHandlers.map((voterHandler) =>
                        Number(voterHandler.snapshotindex?.getTime())
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
                                                voterHandler.snapshotindex?.getTime()
                                            ) &&
                                        Number(
                                            voterHandler.snapshotindex?.getTime()
                                        ) < bucketMax
                                )
                                .slice(0, 25)

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
