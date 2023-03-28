import superagent from 'superagent'
import { log_ref } from '@senate/axiom'
import { RefreshStatus, prisma } from '@senate/database'
import { RefreshType, type RefreshQueueType } from '..'

export const processChainProposals = async (item: RefreshQueueType) => {
    console.log(`refresh ${item.handlerId}`)
    await superagent
        .post(`${process.env.DETECTIVE_URL}/updateChainProposals`)
        .send({
            daoHandlerId: item.handlerId
        })
        .type('application/json')
        .then(async (response) => response.body)
        .then(async (data) => {
            if (!data) return
            if (!Array.isArray(data)) return

            // await prisma.$transaction([
            //     prisma.dAOHandler.updateMany({
            //         where: {
            //             id: {
            //                 in: data
            //                     .filter((result) => result.response == 'ok')
            //                     .map((result) => result.daoHandlerId)
            //             }
            //         },
            //         data: {
            //             refreshStatus: RefreshStatus.DONE,
            //             lastRefresh: new Date()
            //         }
            //     }),
            //     prisma.dAOHandler.updateMany({
            //         where: {
            //             id: {
            //                 in: data
            //                     .filter((result) => result.response == 'nok')
            //                     .map((result) => result.daoHandlerId)
            //             }
            //         },
            //         data: {
            //             refreshStatus: RefreshStatus.NEW,
            //             lastRefresh: new Date()
            //         }
            //     })
            // ])

            log_ref.log({
                level: 'info',
                message: `Process refresh items`,
                daoHandler: item.handlerId,
                type: RefreshType.DAOCHAINPROPOSALS,
                postReqeust: `${process.env.DETECTIVE_URL}/updateChainProposals`,
                postBody: {
                    daoHandlerId: item.handlerId
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
                daoHandler: item.handlerId,
                type: RefreshType.DAOCHAINPROPOSALS,
                postReqeust: `${process.env.DETECTIVE_URL}/updateChainProposals`,
                postBody: {
                    daoHandlerId: item.handlerId
                },
                errorMessage: e.message,
                errorStack: e.stack
            })
        })
}
