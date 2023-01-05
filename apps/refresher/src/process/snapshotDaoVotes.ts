import {
    DAOHandlerType,
    prisma,
    RefreshQueue,
    RefreshStatus
} from '@senate/database'
import fetch from 'node-fetch'

export const processSnapshotDaoVotes = async (item: RefreshQueue) => {
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
        item: `${process.env.DETECTIVE_URL}/updateSnapshotDaoVotes?daoHandlerId=${daoHandler?.id}&${votersReq}`
    })

    await fetch(
        `${process.env.DETECTIVE_URL}/updateSnapshotDaoVotes?daoHandlerId=${daoHandler?.id}&${votersReq}`,
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
                        type: DAOHandlerType.SNAPSHOT
                    },
                    daoHandlerId: daoHandler?.id
                },
                data: {
                    refreshStatus: RefreshStatus.DONE,
                    lastRefreshTimestamp: new Date(),
                    lastSnapshotVoteCreatedTimestamp: new Date()
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
                        type: DAOHandlerType.SNAPSHOT
                    },
                    daoHandlerId: daoHandler?.id
                },
                data: {
                    refreshStatus: RefreshStatus.NEW,
                    lastSnapshotVoteCreatedTimestamp: new Date(1)
                }
            })

            console.log({
                action: 'process_queue',
                details: 'DAOSNAPSHOTVOTES FAILED FOR ONE',
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
                        type: DAOHandlerType.SNAPSHOT
                    }
                },
                data: {
                    refreshStatus: RefreshStatus.NEW
                }
            })
            console.log({
                action: 'process_queue',
                details: 'DAOSNAPSHOTVOTES FAILED FOR ALL',
                item: daoHandler,
                error: e
            })
        })
}
