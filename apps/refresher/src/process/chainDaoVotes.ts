import superagent from 'superagent'
import { log_ref } from '@senate/axiom'
import { RefreshStatus, type RefreshArgs, prisma } from '@senate/database'
import { RefreshType, type RefreshQueueType } from '..'

export const processChainDaoVotes = async (item: RefreshQueueType) => {
    const voters = [...(item.args as RefreshArgs).voters]

    await superagent
        .post(`${process.env.DETECTIVE_URL}/updateChainDaoVotes`)
        .send({ daoHandlerId: item.handlerId, voters: voters })
        .type('application/json')
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
                                    .filter(
                                        (result) => result.response == 'nok'
                                    )
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
                errorMessage: e.message,
                errorStack: e.stack
            })
        })
}
