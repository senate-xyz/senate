import { log_ref } from '@senate/axiom'
import {
    DAOHandlerType,
    prisma,
    RefreshQueue,
    RefreshStatus
} from '@senate/database'
import fetch from 'node-fetch'

export const processChainDaoVotes = async (item: RefreshQueue) => {
    const daoHandler = await prisma.dAOHandler.findFirst({
        where: { id: item.clientId }
    })

    const voters = await prisma.voter.findMany({
        where: {
            voterHandlers: {
                some: {
                    daoHandlerId: daoHandler?.id
                }
            }
        }
    })

    log_ref.log({
        level: 'info',
        message: `Process dao chain votes item`,
        data: {
            daoHandler: daoHandler,
            voters: voters
        }
    })

    let votersReq = ''

    voters.map((voter) => (votersReq += `voters=${voter.address}&`))
    votersReq.slice(0, -1)

    const proposalDetectiveReq = `${process.env.DETECTIVE_URL}/updateChainDaoVotes?daoHandlerId=${daoHandler?.id}&${votersReq}`

    log_ref.log({
        level: 'info',
        message: `Chain votes detective request`,
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
                message: `Chain votes detective response`,
                data: {
                    data: data
                }
            })

            if (!data) return
            if (!Array.isArray(data)) return

            await prisma.voterHandler
                .updateMany({
                    where: {
                        voter: {
                            address: {
                                in: data
                                    .filter((result) => result.response == 'ok')
                                    .map((result) => result.voterAddress)
                            }
                        },
                        daoHandler: {
                            type: {
                                in: [
                                    DAOHandlerType.AAVE_CHAIN,
                                    DAOHandlerType.COMPOUND_CHAIN,
                                    DAOHandlerType.MAKER_EXECUTIVE,
                                    DAOHandlerType.MAKER_POLL,
                                    DAOHandlerType.UNISWAP_CHAIN
                                ]
                            }
                        },
                        daoHandlerId: daoHandler?.id
                    },
                    data: {
                        refreshStatus: RefreshStatus.DONE,
                        lastRefreshTimestamp: new Date()
                    }
                })
                .then((r) => {
                    log_ref.log({
                        level: 'info',
                        message: `Succesfully updated refresh status for ok responses`,
                        data: {
                            voters: data
                                .filter((result) => result.response == 'ok')
                                .map((result) => result.voterAddress),
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
                                .map((result) => result.voterAddress),
                            error: e
                        }
                    })
                })

            await prisma.voterHandler
                .updateMany({
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
                        daoHandler: {
                            type: {
                                in: [
                                    DAOHandlerType.AAVE_CHAIN,
                                    DAOHandlerType.COMPOUND_CHAIN,
                                    DAOHandlerType.MAKER_EXECUTIVE,
                                    DAOHandlerType.MAKER_POLL,
                                    DAOHandlerType.UNISWAP_CHAIN
                                ]
                            }
                        },
                        daoHandlerId: daoHandler?.id
                    },
                    data: {
                        refreshStatus: RefreshStatus.NEW,
                        lastRefreshTimestamp: new Date(1),
                        lastChainVoteCreatedBlock: 0
                    }
                })
                .then((r) => {
                    log_ref.log({
                        level: 'info',
                        message: `Succesfully updated refresh status for nok responses`,
                        data: {
                            voters: data
                                .filter((result) => result.response == 'nok')
                                .map((result) => result.voterAddress),
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
                                .map((result) => result.voterAddress),
                            error: e
                        }
                    })
                })

            return
        })
        .catch(async (e) => {
            log_ref.log({
                level: 'error',
                message: `Chain votes detective request failed`,
                data: {
                    error: e
                }
            })

            await prisma.voterHandler
                .updateMany({
                    where: {
                        voter: {
                            address: {
                                in: voters.map((voter) => voter.address)
                            }
                        },
                        daoHandler: {
                            type: {
                                in: [
                                    DAOHandlerType.AAVE_CHAIN,
                                    DAOHandlerType.COMPOUND_CHAIN,
                                    DAOHandlerType.MAKER_EXECUTIVE,
                                    DAOHandlerType.MAKER_POLL,
                                    DAOHandlerType.UNISWAP_CHAIN
                                ]
                            }
                        }
                    },
                    data: {
                        refreshStatus: RefreshStatus.NEW
                    }
                })
                // eslint-disable-next-line promise/no-nesting
                .then((r) => {
                    log_ref.log({
                        level: 'info',
                        message: `Succesfully forced refresh for all failed voters`,
                        data: {
                            voters: voters.map((voter) => voter.address),
                            result: r
                        }
                    })
                    return
                })
                // eslint-disable-next-line promise/no-nesting
                .catch((e) => {
                    log_ref.log({
                        level: 'error',
                        message: `Failed to force refresh for all failed voters`,
                        data: {
                            voters: voters.map((voter) => voter.address),
                            error: e
                        }
                    })
                })
        })
}
