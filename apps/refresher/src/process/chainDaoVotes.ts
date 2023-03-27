import superagent from 'superagent'
import { log_ref } from '@senate/axiom'
import {
    RefreshStatus,
    RefreshType,
    type RefreshArgs,
    type RefreshQueue,
    prisma
} from '@senate/database'
import { config } from '../config'

export const processChainDaoVotes = async (item: RefreshQueue) => {
    const voters = [...(item.args as RefreshArgs).voters]

    await superagent
        .post(`${process.env.DETECTIVE_URL}/updateChainDaoVotes`)
        .send({ daoHandlerId: item.handlerId, voters: voters })
        .type('application/json')
        .timeout({
            response: config.DAOS_VOTES_CHAIN_INTERVAL_FORCE * 60 * 1000 - 5000,
            deadline: config.DAOS_VOTES_CHAIN_INTERVAL_FORCE * 60 * 1000 - 5000
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
