import { log_ref } from '@senate/axiom'
import { RefreshStatus, prisma } from '@senate/database'
import { RefreshType, type RefreshQueueType } from '..'
import axios from 'axios'

export const processSnapshotProposals = async (item: RefreshQueueType) => {
    try {
        const response = await axios.post(
            `${process.env.DETECTIVE_URL}/updateSnapshotProposals`,
            {
                daoHandlerId: item.handlerId
            }
        )

        const data = response.data

        if (!data) return
        if (!Array.isArray(data)) return

        await prisma.$transaction([
            prisma.dAOHandler.updateMany({
                where: {
                    id: {
                        in: data
                            .filter((result) => result.response == 'ok')
                            .map((result) => result.daoHandlerId)
                    }
                },
                data: {
                    refreshStatus: RefreshStatus.DONE,
                    lastRefresh: new Date()
                }
            }),

            prisma.dAOHandler.updateMany({
                where: {
                    id: {
                        in: data
                            .filter((result) => result.response == 'nok')
                            .map((result) => result.daoHandlerId)
                    }
                },
                data: {
                    refreshStatus: RefreshStatus.NEW,
                    lastRefresh: new Date()
                }
            })
        ])

        log_ref.log({
            level: 'info',
            message: `Process refresh items`,
            daoHandler: item.handlerId,
            type: RefreshType.DAOSNAPSHOTPROPOSALS,
            postRequest: `${process.env.DETECTIVE_URL}/updateSnapshotProposals`,
            postBody: {
                daoHandlerId: item.handlerId
            },
            response: data
        })
    } catch (e) {
        await prisma.dAOHandler.update({
            where: {
                id: item.handlerId
            },
            data: {
                refreshStatus: RefreshStatus.NEW,
                lastRefresh: new Date(),
                snapshotIndex: new Date('2009-01-09T04:54:25.00Z')
            }
        })

        log_ref.log({
            level: 'error',
            message: `Process refresh items`,
            daoHandler: item.handlerId,
            type: RefreshType.DAOSNAPSHOTPROPOSALS,
            postRequest: `${process.env.DETECTIVE_URL}/updateSnapshotProposals`,
            postBody: {
                daoHandlerId: item.handlerId
            },
            errorMessage: (e as Error).message,
            errorStack: (e as Error).stack
        })
    }
}
