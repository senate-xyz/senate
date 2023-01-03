import { RefreshQueue, RefreshStatus, prisma } from '@senate/database'
import fetch from 'node-fetch'

export const processSnapshotProposals = async (item: RefreshQueue) => {
    const daoHandler = await prisma.dAOHandler.findFirst({
        where: { id: item.clientId }
    })
    console.log({
        action: 'process_queue',
        details: 'DAOSNAPSHOTPROPOSALS REQUEST',
        item: `${
            process.env.DETECTIVE_URL
        }/updateSnapshotProposals?daoHandlerIds=${
            item.clientId
        }&minCreatedAt=${daoHandler?.lastSnapshotProposalCreatedTimestamp?.valueOf()}`
    })
    await fetch(
        `${process.env.DETECTIVE_URL}/updateSnapshotProposals?daoHandlerIds=${
            item.clientId
        }&minCreatedAt=${daoHandler?.lastSnapshotProposalCreatedTimestamp?.valueOf()}`,
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
                            lastRefreshTimestamp: new Date(),
                            lastSnapshotProposalCreatedTimestamp: new Date()
                        }
                    })
                    console.log({
                        action: 'process_queue',
                        details: 'DAOSNAPSHOTPROPOSALS DONE',
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
                details: 'DAOSNAPSHOTPROPOSALS FAILED',
                item: daoHandler,
                error: e
            })
        })
}
