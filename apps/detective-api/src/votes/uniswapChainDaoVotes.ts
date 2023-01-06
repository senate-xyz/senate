import { log_node, log_pd } from '@senate/axiom'
import { DAOHandler, DAOHandlerType, prisma } from '@senate/database'
import { BigNumber, ethers } from 'ethers'
import { hexZeroPad } from 'ethers/lib/utils'

const provider = new ethers.providers.JsonRpcProvider({
    url: String(process.env.PROVIDER_URL)
})

type Vote = {
    proposalOnChainId: string
    support: string
}

export const updateUniswapChainDaoVotes = async (
    daoHandlerId: string,
    voters: [string]
) => {
    if (!Array.isArray(voters)) voters = [voters]

    const daoHandler = await prisma.dAOHandler.findFirstOrThrow({
        where: { id: daoHandlerId, type: DAOHandlerType.UNISWAP_CHAIN },
        include: {
            dao: {
                include: {
                    votes: { where: { daoHandlerId: daoHandlerId } }
                }
            }
        }
    })

    log_pd.log({
        level: 'info',
        message: `New votes update for ${daoHandler.dao.name} - ${daoHandler.type}`,
        data: {
            daoHandlerId: daoHandlerId,
            voters: voters
        }
    })

    const results = new Map()

    for (const voter of voters) {
        results.set(voter, 'ok')
        let votes

        const voterHandler = await prisma.voterHandler.findFirstOrThrow({
            where: {
                daoHandlerId: daoHandlerId,
                voter: {
                    is: {
                        address: voter
                    }
                }
            }
        })

        const voterLatestVoteBlock = voterHandler.lastChainVoteCreatedBlock

        try {
            const latestVoteBlock = Number(voterLatestVoteBlock) ?? 0
            const currentBlock = await provider.getBlockNumber()

            log_node.log({
                level: 'info',
                message: `getBlockNumber`,
                data: {}
            })

            votes = await getVotes(daoHandler, voter, latestVoteBlock)

            if (!votes) {
                log_pd.log({
                    level: 'info',
                    message: `Nothing to update for ${voter} in ${daoHandler.dao.name} - ${daoHandler.type}`
                })
                continue
            }

            for (const vote of votes) {
                const proposal = await prisma.proposal.findFirst({
                    where: {
                        externalId: vote.proposalOnChainId,
                        daoId: daoHandler.daoId,
                        daoHandlerId: daoHandler.id
                    }
                })

                if (!proposal) {
                    results.set(voter, 'nok')
                    log_pd.log({
                        level: 'error',
                        message: `Missing proposal for ${voter} in ${daoHandler.dao.name} - ${daoHandler.type}`,
                        data: {
                            daoHandlerId: daoHandlerId,
                            proposalOnChainId: vote.proposalOnChainId
                        }
                    })
                    break
                }

                await prisma.vote
                    .upsert({
                        where: {
                            voterAddress_daoId_proposalId: {
                                voterAddress: voter,
                                daoId: daoHandler.daoId,
                                proposalId: proposal.id
                            }
                        },
                        update: {
                            choiceId: vote.support,
                            choice: vote.support ? 'Yes' : 'No'
                        },
                        create: {
                            voterAddress: voter,
                            daoId: daoHandler.daoId,
                            proposalId: proposal.id,
                            daoHandlerId: daoHandler.id,
                            choiceId: vote.support,
                            choice: vote.support ? 'Yes' : 'No'
                        }
                    })
                    .then(async (r) => {
                        log_pd.log({
                            level: 'info',
                            message: `Updated vote for ${voter} in ${daoHandler.dao.name} - ${daoHandler.type}`,
                            data: {
                                vote: r
                            }
                        })
                        await prisma.voterHandler.update({
                            where: {
                                id: voterHandler.id
                            },
                            data: {
                                lastChainVoteCreatedBlock: currentBlock
                            }
                        })

                        return
                    })
                    .catch(async (e) => {
                        results.set(voter, 'nok')
                        log_pd.log({
                            level: 'error',
                            message: `Could not update vote for ${voter} in ${daoHandler.dao.name} - ${daoHandler.type}`,
                            data: {
                                error: e,
                                voterAddress: voter,
                                daoId: daoHandler.daoId,
                                proposalId: proposal.id,
                                daoHandlerId: daoHandler.id,
                                choiceId: vote.support,
                                choice: vote.support ? 'Yes' : 'No'
                            }
                        })
                    })
            }
        } catch (e) {
            results.set(voter, 'nok')
            log_pd.log({
                level: 'error',
                message: `Could not update votes for ${voter} in ${daoHandler.dao.name} - ${daoHandler.type}`,
                data: {
                    error: e
                }
            })
        }
    }

    const resultsArray = Array.from(results, ([name, value]) => ({
        voterAddress: name,
        response: value
    }))

    log_pd.log({
        level: 'info',
        message: `Succesfully updated votes for ${daoHandler.dao.name} - ${daoHandler.type}`,
        data: {
            result: resultsArray
        }
    })

    return resultsArray
}

const getVotes = async (
    daoHandler: DAOHandler,
    voterAddress: string,
    latestVoteBlock: number
): Promise<Vote[]> => {
    const govBravoIface = new ethers.utils.Interface(daoHandler.decoder['abi'])

    let logs = []

    logs = await provider.getLogs({
        fromBlock: latestVoteBlock,
        address: daoHandler.decoder['address'],
        topics: [
            govBravoIface.getEventTopic('VoteCast'),
            [hexZeroPad(voterAddress, 32)]
        ]
    })

    log_node.log({
        level: 'info',
        message: `getLogs`,
        data: {
            fromBlock: latestVoteBlock,
            address: daoHandler.decoder['address'],
            topics: [
                govBravoIface.getEventTopic('VoteCast'),
                [hexZeroPad(voterAddress, 32)]
            ]
        }
    })

    const votes = logs.map((log) => {
        const eventData = govBravoIface.parseLog({
            topics: log.topics,
            data: log.data
        }).args

        return {
            proposalOnChainId: BigNumber.from(eventData.proposalId).toString(),
            support: String(eventData.support)
        }
    })

    return votes
}
