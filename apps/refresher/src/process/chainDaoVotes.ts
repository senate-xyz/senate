import { log_ref } from '@senate/axiom'
import { RefreshStatus, type RefreshArgs, prisma } from '@senate/database'
import { RefreshType, type RefreshQueueType } from '..'
import axios from 'axios'

export const processChainDaoVotes = async (item: RefreshQueueType) => {
    const voters = [...(item.args as RefreshArgs).voters]

    try {
        const response = await axios.post(
            `${process.env.DETECTIVE_URL}/updateChainDaoVotes`,
            {
                daoHandlerId: item.handlerId,
                voters: voters
            }
        )

        const data = response.data

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
                    daoHandlerId: item.handlerId
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
                                .filter((result) => result.response == 'nok')
                                .map((result) => result.voterAddress)
                        }
                    },
                    daoHandlerId: item.handlerId
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
            type: RefreshType.DAOCHAINVOTES,
            voters: voters,
            postRequest: `${process.env.DETECTIVE_URL}/updateChainDaoVotes`,
            postBody: { daoHandlerId: item.handlerId, voters: voters },
            response: data
        })
    } catch (e) {
        await prisma.voterHandler.updateMany({
            where: {
                voter: {
                    address: {
                        in: voters.map((voter) => voter)
                    }
                },
                daoHandlerId: item.handlerId
            },
            data: {
                refreshStatus: RefreshStatus.NEW,
                lastRefresh: new Date(),
                chainIndex: { decrement: 50000 }
            }
        })

        log_ref.log({
            level: 'error',
            message: `Process refresh items`,
            daoHandler: item.handlerId,
            type: RefreshType.DAOCHAINVOTES,
            voters: voters,
            postRequest: `${process.env.DETECTIVE_URL}/updateChainDaoVotes`,
            postBody: { daoHandlerId: item.handlerId, voters: voters },
            errorMessage: (e as Error).message,
            errorStack: (e as Error).stack
        })
    }
}
