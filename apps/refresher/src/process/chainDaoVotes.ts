import {
    DAOHandlerWithDAO,
    prisma,
    RefreshQueue,
    RefreshStatus,
    RefreshType
} from '@senate/database'
import superagent from 'superagent'
import { DAOS_VOTES_CHAIN_INTERVAL_FORCE } from '../config'
import { log_ref } from '@senate/axiom'
import type { RefreshArgs } from '@senate/database'

export const processChainDaoVotes = async () => {
    let item: RefreshQueue, daoHandler: DAOHandlerWithDAO

    await prisma.$transaction(
        async (tx) => {
            item = await tx.refreshQueue.findFirst({
                where: {
                    refreshType: RefreshType.DAOCHAINVOTES
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
        .post(`${process.env.DETECTIVE_URL}/updateChainDaoVotes`)
        .send({ daoHandlerId: daoHandler.id, voters: voters })
        .type('application/json')
        .timeout({
            response: DAOS_VOTES_CHAIN_INTERVAL_FORCE * 60 * 1000 - 5000,
            deadline: DAOS_VOTES_CHAIN_INTERVAL_FORCE * 60 * 1000 - 5000
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

            log_ref.log({
                level: 'info',
                message: `Process refresh items`,
                dao: daoHandler.dao.name,
                daoHandler: daoHandler.id,
                type: RefreshType.DAOCHAINVOTES,
                voters: voters,
                postRequest: `${process.env.DETECTIVE_URL}/updateChainDaoVotes`,
                postBody: { daoHandlerId: daoHandler.id, voters: voters },
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
                    daoHandlerId: daoHandler?.id
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
                dao: daoHandler.dao.name,
                daoHandler: daoHandler.id,
                type: RefreshType.DAOCHAINVOTES,
                voters: voters,
                postRequest: `${process.env.DETECTIVE_URL}/updateChainDaoVotes`,
                postBody: { daoHandlerId: daoHandler.id, voters: voters },
                errorMessage: e.message,
                errorStack: e.stack
            })
        })
}
