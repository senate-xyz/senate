import { log_ref } from '@senate/axiom'
import { type RefreshArgs, RefreshStatus, prisma } from '@senate/database'
import { RefreshType, type RefreshQueueType } from '..'
import axios from 'axios'

export const processSnapshotDaoVotes = async (item: RefreshQueueType) => {
    const voters = [...(item.args as RefreshArgs).voters]

    try {
        const response = await axios.post(
            `${process.env.DETECTIVE_URL}/updateSnapshotDaoVotes`,
            { daoHandlerId: item.handlerId, voters: voters },
            { timeout: 60 * 1000 }
        )

        const { data } = response

        if (!data) return
        if (!Array.isArray(data)) return

        await prisma.$transaction([
            prisma.voterhandler.updateMany({
                where: {
                    voter: {
                        address: {
                            in: data
                                .filter((result) => result.response == 'ok')
                                .map((result) => result.voterAddress)
                        }
                    },
                    daohandlerid: item.handlerId
                },
                data: {
                    refreshstatus: RefreshStatus.DONE,
                    lastrefresh: new Date()
                }
            }),

            prisma.voterhandler.updateMany({
                where: {
                    voter: {
                        address: {
                            in: data
                                .filter((result) => result.response == 'nok')
                                .map((result) => result.voterAddress)
                        }
                    },
                    daohandlerid: item.handlerId
                },
                data: {
                    refreshstatus: RefreshStatus.NEW,
                    lastrefresh: new Date()
                }
            })
        ])

        log_ref.log({
            level: 'info',
            message: `Process refresh items`,
            daoHandler: item.handlerId,
            type: RefreshType.DAOSNAPSHOTVOTES,
            voters: voters,
            postRequest: `${process.env.DETECTIVE_URL}/updateChainDaoVotes`,
            postBody: { daoHandlerId: item.handlerId, voters: voters },
            response: data
        })
    } catch (e) {
        await prisma.voterhandler.updateMany({
            where: {
                voter: {
                    address: {
                        in: voters.map((voter) => voter)
                    }
                },
                daohandlerid: item.handlerId
            },
            data: {
                refreshstatus: RefreshStatus.NEW,
                lastrefresh: new Date(),
                snapshotindex: new Date('2009-01-09T04:54:25.00Z')
            }
        })

        log_ref.log({
            level: 'error',
            message: `Process refresh items`,
            daoHandler: item.handlerId,
            type: RefreshType.DAOSNAPSHOTVOTES,
            voters: voters,
            postRequest: `${process.env.DETECTIVE_URL}/updateChainDaoVotes`,
            postBody: { daoHandlerId: item.handlerId, voters: voters },
            errorMessage: (e as Error).message,
            errorStack: (e as Error).stack
        })
    }
}
