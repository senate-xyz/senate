import { log_ref } from '@senate/axiom'
import { RefreshQueue, RefreshStatus, prisma } from '@senate/database'
import fetch from 'node-fetch'

export const processSnapshotProposals = async (item: RefreshQueue) => {
    const daoHandler = await prisma.dAOHandler.findFirst({
        where: { id: item.clientId }
    })

    log_ref.log({
        level: 'info',
        message: `Process dao chain proposals item`,
        data: {
            daoHandler: daoHandler
        }
    })

    const proposalDetectiveReq = `${
        process.env.DETECTIVE_URL
    }/updateSnapshotProposals?daoHandlerIds=${
        item.clientId
    }&minCreatedAt=${daoHandler?.lastSnapshotProposalCreatedTimestamp?.valueOf()}`

    log_ref.log({
        level: 'info',
        message: `Snapshot proposals detective request`,
        data: {
            url: proposalDetectiveReq
        }
    })
    await fetch(proposalDetectiveReq, {
        method: 'POST'
    })
        .then((response) => response.json())
        .then(async (data) => {
            log_ref.log({
                level: 'info',
                message: `Snapshot proposals detective response`,
                data: {
                    data: data
                }
            })

            if (!data) return
            if (!Array.isArray(data)) return

            await prisma.dAOHandler
                .updateMany({
                    where: {
                        id: {
                            in: data
                                .filter((result) => result.response == 'ok')
                                .map((result) => result.daoHandlerId)
                        }
                    },
                    data: {
                        refreshStatus: RefreshStatus.DONE,
                        lastRefreshTimestamp: new Date(),
                        lastSnapshotProposalCreatedTimestamp: new Date()
                    }
                })
                .then((r) => {
                    log_ref.log({
                        level: 'info',
                        message: `Succesfully updated refresh status for ok responses`,
                        data: {
                            voters: data
                                .filter((result) => result.response == 'ok')
                                .map((result) => result.daoHandlerId),
                            result: r
                        }
                    })
                    return
                })
                .catch((e) => {
                    log_ref.log({
                        level: 'error',
                        message: `Could not update refresh status for ok responses`,
                        data: {
                            voters: data
                                .filter((result) => result.response == 'ok')
                                .map((result) => result.daoHandlerId),
                            error: e
                        }
                    })
                })

            await prisma.dAOHandler
                .updateMany({
                    where: {
                        id: {
                            in: data
                                .filter((result) => result.response == 'nok')
                                .map((result) => result.daoHandlerId)
                        }
                    },
                    data: {
                        refreshStatus: RefreshStatus.NEW,
                        lastRefreshTimestamp: new Date(1),
                        lastSnapshotProposalCreatedTimestamp: new Date(1)
                    }
                })
                .then((r) => {
                    log_ref.log({
                        level: 'info',
                        message: `Succesfully updated refresh status for nok responses`,
                        data: {
                            voters: data
                                .filter((result) => result.response == 'nok')
                                .map((result) => result.daoHandlerId),
                            result: r
                        }
                    })
                    return
                })
                .catch((e) => {
                    log_ref.log({
                        level: 'error',
                        message: `Could not update refresh status for nok responses`,
                        data: {
                            voters: data
                                .filter((result) => result.response == 'nok')
                                .map((result) => result.daoHandlerId),
                            error: e
                        }
                    })
                })

            return
        })
        .catch(async (e) => {
            log_ref.log({
                level: 'error',
                message: `Snapshot proposals detective request failed`,
                data: {
                    error: e
                }
            })

            await prisma.dAOHandler
                .update({
                    where: {
                        id: item.clientId
                    },
                    data: {
                        refreshStatus: RefreshStatus.NEW
                    }
                }) // eslint-disable-next-line promise/no-nesting
                .then((r) => {
                    log_ref.log({
                        level: 'info',
                        message: `Succesfully forced refresh for all failed daos`,
                        data: {
                            daoHandlerId: item.clientId,
                            result: r
                        }
                    })
                    return
                })
                // eslint-disable-next-line promise/no-nesting
                .catch((e) => {
                    log_ref.log({
                        level: 'error',
                        message: `Failed to force refresh for all failed daos`,
                        data: {
                            daoHandlerId: item.clientId,
                            error: e
                        }
                    })
                })
        })
}
