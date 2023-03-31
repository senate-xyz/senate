import { log_ref } from '@senate/axiom'
import { RefreshStatus, prisma } from '@senate/database'
import { RefreshType, type RefreshQueueType } from '..'
import axios from 'axios'

export const processChainProposals = async (item: RefreshQueueType) => {
    const daoHandler = await prisma.daohandler.findFirst({
        where: { id: item.handlerId }
    })
    try {
        const response = await axios.post(
            `${process.env.DETECTIVE_URL}/updateChainProposals`,
            {
                daoHandlerId: item.handlerId
            },
            { timeout: 60 * 1000 }
        )

        const { data } = response

        if (!data) return
        if (!Array.isArray(data)) return

        await prisma.$transaction([
            prisma.daohandler.updateMany({
                where: {
                    id: {
                        in: data
                            .filter((result) => result.response == 'ok')
                            .map((result) => result.daoHandlerId)
                    }
                },
                data: {
                    refreshstatus: RefreshStatus.DONE,
                    lastrefresh: new Date(),
                    refreshspeed: {
                        increment:
                            daoHandler.refreshspeed < 1000000
                                ? Math.round(
                                      Number(daoHandler.refreshspeed) / 10
                                  )
                                : 0
                    }
                }
            }),

            prisma.daohandler.updateMany({
                where: {
                    id: {
                        in: data
                            .filter((result) => result.response == 'nok')
                            .map((result) => result.daoHandlerId)
                    }
                },
                data: {
                    refreshstatus: RefreshStatus.NEW,
                    refreshspeed: {
                        decrement:
                            Math.floor(Number(daoHandler.refreshspeed) / 5) + 1
                    },
                    lastrefresh: new Date()
                }
            })
        ])

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
    } catch (e) {
        await prisma.daohandler.update({
            where: {
                id: item.handlerId
            },
            data: {
                refreshstatus: RefreshStatus.NEW,
                chainindex: {
                    decrement: daoHandler.chainindex > 10000 ? 10000 : 0
                },
                refreshspeed: {
                    decrement:
                        Math.floor(Number(daoHandler.refreshspeed) / 2) + 1
                },
                lastrefresh: new Date()
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
            errorMessage: (e as Error).message,
            errorStack: (e as Error).stack
        })
    }
}
