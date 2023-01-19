import { prisma, RefreshQueue, RefreshStatus } from '@senate/database'
import superagent from 'superagent'
import { DAOS_VOTES_CHAIN_INTERVAL_FORCE } from '../config'

export const processChainDaoVotes = async (item: RefreshQueue) => {
    const daoHandler = await prisma.dAOHandler.findFirst({
        where: { id: item.handlerId }
    })

    const voters = [...item.args['voters']]

    let votersReq = ''

    voters.map((voter) => (votersReq += `voters=${voter}&`))

    const proposalDetectiveReq = `${process.env.DETECTIVE_URL}/updateChainDaoVotes?daoHandlerId=${daoHandler?.id}&${votersReq}`

    await superagent
        .post(proposalDetectiveReq)
        .type('application/json')
        .timeout({
            response: DAOS_VOTES_CHAIN_INTERVAL_FORCE * 60 * 1000 - 5000,
            deadline: DAOS_VOTES_CHAIN_INTERVAL_FORCE * 60 * 1000 - 5000
        })
        .retry(3, (err, res) => {
            if (res.status == 201) return false

            if (err) return true
        })
        .then(async (response) => response.body)
        .then(async (data) => {
            if (!data) return
            if (!Array.isArray(data)) return

            await prisma.voterHandler.updateMany({
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
                    lastRefreshTimestamp: new Date()
                }
            })

            await prisma.voterHandler.updateMany({
                where: {
                    voter: {
                        address: {
                            in: data
                                .filter((result) => result.response == 'nok')
                                .map((result) => result.voterAddress)
                        }
                    },
                    daoHandlerId: daoHandler?.id
                },
                data: {
                    refreshStatus: RefreshStatus.NEW,
                    lastRefreshTimestamp: new Date(0)
                }
            })

            return
        })
        .catch(async () => {
            await prisma.voterHandler.updateMany({
                where: {
                    voter: {
                        address: {
                            in: voters.map((voter) => voter.address)
                        }
                    },
                    daoHandlerId: daoHandler?.id
                },
                data: {
                    refreshStatus: RefreshStatus.NEW,
                    lastRefreshTimestamp: new Date(0),
                    lastChainVoteCreatedBlock: 0,
                    lastSnapshotVoteCreatedTimestamp: new Date(0)
                }
            })
        })
}
