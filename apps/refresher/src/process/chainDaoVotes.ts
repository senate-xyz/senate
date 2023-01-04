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

    let votersReq = ''

    voters.map((voter) => (votersReq += `voters=${voter.address}&`))

    votersReq.slice(0, -1)
    console.log({
        action: 'process_queue',
        details: 'DAOSNAPSHOTVOTES REQUEST',
        item: `${process.env.DETECTIVE_URL}/updateChainDaoVotes?daoHandlerId=${daoHandler?.id}&${votersReq}`
    })

    await fetch(
        `${process.env.DETECTIVE_URL}/updateChainDaoVotes?daoHandlerId=${daoHandler?.id}&${votersReq}`,
        {
            method: 'POST'
        }
    )
        .then((response) => response.json())
        .then(async (data) => {
            if (!data) return
            if (!Array.isArray(data)) return

            const okres = await prisma.voterHandler.updateMany({
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

            console.log({
                action: 'process_queue',
                details: 'DAOSNAPSHOTVOTES DONE',
                item: okres
            })

            const nokres = await prisma.voterHandler.updateMany({
                where: {
                    voter: {
                        address: {
                            in: data
                                .filter((result) => result.response == 'nok')
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
                    refreshStatus: RefreshStatus.NEW
                }
            })

            console.log({
                action: 'process_queue',
                details: 'DAOCHAINVOTES FAILED FOR ONE',
                item: nokres
            })

            return
        })
        .catch(async (e) => {
            await prisma.voterHandler.updateMany({
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
            console.log({
                action: 'process_queue',
                details: 'DAOCHAINVOTES FAILED FOR ALL',
                item: daoHandler,
                error: e
            })
        })
}
