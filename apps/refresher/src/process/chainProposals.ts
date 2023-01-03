import { RefreshQueue, RefreshStatus, prisma } from '@senate/database'
import fetch from 'node-fetch'

export const processChainProposals = async (item: RefreshQueue) => {
    const daoHandler = await prisma.dAOHandler.findFirst({
        where: { id: item.clientId }
    })
    console.log({
        action: 'process_queue',
        details: 'DAOCHAINPROPOSALS REQUEST',
        item: `${process.env.DETECTIVE_URL}/updateChainProposals?daoHandlerId=${
            item.clientId
        }&minBlockNumber=${daoHandler?.lastChainProposalCreatedBlock?.valueOf()}`
    })
    await fetch(
        `${process.env.DETECTIVE_URL}/updateChainProposals?daoHandlerId=${
            item.clientId
        }&minBlockNumber=${daoHandler?.lastChainProposalCreatedBlock?.valueOf()}`,
        {
            method: 'POST'
        }
    )
        .then((response) => response.json())
        .then((data) => {
            if (!data) return
            if (!Array.isArray(data)) return

            data.map(async (result) => {
                if (
                    result.response == 'ok' &&
                    item.clientId == result.daoHandlerId
                ) {
                    const daoHandler = await prisma.dAOHandler.update({
                        where: {
                            id: item.clientId
                        },
                        data: {
                            refreshStatus: RefreshStatus.DONE,
                            lastRefreshTimestamp: new Date()
                        }
                    })
                    console.log({
                        action: 'process_queue',
                        details: 'DAOCHAINPROPOSALS DONE',
                        item: daoHandler
                    })
                }
            })
            return
        })
        .catch(async (e) => {
            const daoHandler = await prisma.dAOHandler.update({
                where: {
                    id: item.clientId
                },
                data: {
                    refreshStatus: RefreshStatus.NEW
                }
            })
            console.log({
                action: 'process_queue',
                details: 'DAOCHAINPROPOSALS FAILED',
                item: daoHandler,
                error: e
            })
        })
}
