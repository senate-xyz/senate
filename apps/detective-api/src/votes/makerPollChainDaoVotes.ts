import { Logger } from '@nestjs/common'
import { DAOHandler, DAOHandlerType, prisma } from '@senate/database'
import { BigNumber, ethers } from 'ethers'
import { hexZeroPad } from 'ethers/lib/utils'

const provider = new ethers.providers.JsonRpcProvider({
    url: String(process.env.PROVIDER_URL)
})

const logger = new Logger('updateMakerPollChainDaoVotes')

export const updateMakerPollChainDaoVotes = async (
    daoHandlerId: string,
    voters: [string]
) => {
    logger.log({
        action: 'updateMakerPollChainDaoVotes',
        details: 'start'
    })
    if (!Array.isArray(voters)) voters = [voters]

    logger.log({
        action: 'updateMakerPollChainDaoVotes',
        details: 'voters',
        item: voters
    })

    const daoHandler = await prisma.dAOHandler.findFirstOrThrow({
        where: { id: daoHandlerId, type: DAOHandlerType.MAKER_POLL },
        include: {
            dao: {
                include: {
                    votes: { where: { daoHandlerId: daoHandlerId } }
                }
            }
        }
    })

    logger.log({
        action: 'updateMakerPollChainDaoVotes',
        details: 'daohandler',
        item: daoHandler
    })

    const results = new Map()

    for (const voter of voters) {
        results.set(voter, 'nok')
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

        logger.log({
            action: 'updateMakerPollChainDaoVotes',
            details: 'fetching voter',
            item: {
                voter: voter,
                lastChainVoteCreatedBlock: voterLatestVoteBlock
            }
        })

        try {
            const latestVoteBlock = Number(voterLatestVoteBlock) ?? 0
            const currentBlock = await provider.getBlockNumber()

            votes = await getVotes(daoHandler, voter, latestVoteBlock)

            if (!votes) {
                results.set(voter, 'ok')
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
                    logger.error(
                        `Poll with externalId ${vote.proposalOnChainId} does not exist in DB for daoId: ${daoHandler.daoId} & daoHandlerId: ${daoHandler.id}`
                    )
                    await prisma.voterHandler.update({
                        where: {
                            id: voterHandler.id
                        },
                        data: {
                            lastChainVoteCreatedBlock: 0
                        }
                    })
                    continue
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
                        logger.log({
                            action: 'updateMakerPollChainDaoVotes',
                            details: 'upsert vote',
                            item: r
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
            }
        } catch (err) {
            logger.error('Error while updating maker poll votes', err)
            results.set(voter, 'nok')
            await prisma.voterHandler.update({
                where: {
                    id: voterHandler.id
                },
                data: {
                    lastChainVoteCreatedBlock: 0
                }
            })
        }
        results.set(voter, 'ok')
    }

    logger.log({
        action: 'updateMakerPollChainDaoVotes',
        details: 'voters',
        item: voters
    })

    const resultsArray = Array.from(results, ([name, value]) => ({
        voterAddress: name,
        response: value
    }))

    logger.log({
        action: 'updateMakerPollChainDaoVotes',
        details: 'result',
        item: resultsArray
    })
    return resultsArray
}

const getVotes = async (
    daoHandler: DAOHandler,
    voterAddress: string,
    latestVoteBlock: number
): Promise<unknown> => {
    const iface = new ethers.utils.Interface(
        JSON.parse(daoHandler.decoder['abi_vote'])
    )

    const logs = await provider.getLogs({
        fromBlock: latestVoteBlock,
        address: daoHandler.decoder['address_vote'],
        topics: [iface.getEventTopic('Voted'), hexZeroPad(voterAddress, 32)]
    })

    const votes = logs.map((log) => {
        const eventData = iface.parseLog({
            topics: log.topics,
            data: log.data
        }).args

        return {
            proposalOnChainId: BigNumber.from(eventData.pollId).toString(),
            support: BigNumber.from(eventData.optionId).toString()
        }
    })

    return votes
}
