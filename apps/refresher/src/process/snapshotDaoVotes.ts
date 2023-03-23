import {
    type DAOHandlerWithDAO,
    prisma,
    type RefreshArgs,
    type RefreshQueue,
    RefreshStatus,
    RefreshType
} from '@senate/database'
import superagent from 'superagent'
import { config } from '../config'

export const processSnapshotDaoVotes = async () => {
    let item: RefreshQueue, daoHandler: DAOHandlerWithDAO

    await prisma.$transaction(
        async (tx) => {
            item = await tx.refreshQueue.findFirst({
                where: {
                    refreshType: RefreshType.DAOSNAPSHOTVOTES
                },
                orderBy: {
                    priority: 'asc'
                }
            })

            if (!item) return

            await tx.refreshQueue.delete({
                where: {
                    id: item.id
                }
            })

            daoHandler = await tx.dAOHandler.findFirst({
                where: { id: item.handlerId },
                include: { dao: true }
            })
        },
        {
            maxWait: 30000
        }
    )

    if (!item) return

    const voters = [...(item.args as RefreshArgs).voters]

    await superagent
        .post(`${process.env.DETECTIVE_URL}/updateSnapshotDaoVotes`)
        .send({ daoHandlerId: daoHandler.id, voters: voters })
        .type('application/json')
        .timeout({
            response:
                config.DAOS_VOTES_SNAPSHOT_INTERVAL_FORCE * 60 * 1000 - 5000,
            deadline:
                config.DAOS_VOTES_SNAPSHOT_INTERVAL_FORCE * 60 * 1000 - 5000
        })
        .retry(3, (err, res) => {
            if (res.status == 201) return false
            if (err) return true
            return false
        })
        .then(async (response) => response.body)
        .then(async (data) => {
            if (!data) return
            if (!Array.isArray(data)) return

            await prisma.$transaction([
                prisma.voterHandler.updateMany({
                    where: {
                        voter: {
                            address: {
                                in: data
                                    .filter((result) => result.response == 'ok')
                                    .map((result) => result.voterAddress)
                            }
                        },
                        daoHandlerId: daoHandler?.id
                    },
                    data: {
                        refreshStatus: RefreshStatus.DONE,
                        lastRefresh: new Date()
                    }
                }),

                prisma.voterHandler.updateMany({
                    where: {
                        voter: {
                            address: {
                                in: data
                                    .filter(
                                        (result) => result.response == 'nok'
                                    )
                                    .map((result) => result.voterAddress)
                            }
                        },
                        daoHandlerId: daoHandler?.id
                    },
                    data: {
                        refreshStatus: RefreshStatus.NEW,
                        lastRefresh: new Date()
                    }
                })
            ])

            return
        })
        .catch(async (e) => {
            await prisma.voterHandler.updateMany({
                where: {
                    voter: {
                        address: {
                            in: voters.map((voter) => voter)
                        }
                    },
                    daoHandlerId: daoHandler?.id
                },
                data: {
                    refreshStatus: RefreshStatus.NEW,
                    lastRefresh: new Date(),
                    snapshotIndex: new Date('2009-01-09T04:54:25.00Z')
                }
            })
        })
}
