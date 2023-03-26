import {
    RefreshStatus,
    RefreshType,
    type DAOHandlerWithDAO,
    type RefreshQueue
} from '@senate/database'
import superagent from 'superagent'
import { log_ref } from '@senate/axiom'
import { config } from '../config'
import { prisma } from '..'

export const processChainProposals = async () => {
    let item: RefreshQueue, daoHandler: DAOHandlerWithDAO

    await prisma.$transaction(async (tx) => {
        item = await tx.refreshQueue.findFirst({
            where: {
                refreshType: RefreshType.DAOCHAINPROPOSALS
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
    })

    if (!item) return
    await superagent
        .post(`${process.env.DETECTIVE_URL}/updateChainProposals`)
        .send({
            daoHandlerId: item.handlerId
        })

        .type('application/json')
        .timeout({
            response:
                config.DAOS_PROPOSALS_CHAIN_INTERVAL_FORCE * 60 * 1000 - 5000,
            deadline:
                config.DAOS_PROPOSALS_CHAIN_INTERVAL_FORCE * 60 * 1000 - 5000
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
                dao: daoHandler.dao.name,
                daoHandler: daoHandler.id,
                type: RefreshType.DAOCHAINPROPOSALS,
                postReqeust: `${process.env.DETECTIVE_URL}/updateChainProposals`,
                postBody: {
                    daoHandlerId: item.handlerId,
                    minBlockNumber: daoHandler?.chainIndex?.valueOf()
                },
                response: data
            })

            return
        })
        .catch(async (e) => {
            await prisma.dAOHandler.update({
                where: {
                    id: item.handlerId
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
                type: RefreshType.DAOCHAINPROPOSALS,
                postReqeust: `${process.env.DETECTIVE_URL}/updateChainProposals`,
                postBody: {
                    daoHandlerId: item.handlerId,
                    minBlockNumber: daoHandler?.chainIndex?.valueOf()
                },
                errorMessage: e.message,
                errorStack: e.stack
            })
        })
}
