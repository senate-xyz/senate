import { Logger } from '@nestjs/common'
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

const logger = new Logger('updateCompoundChainDaoVotes')

export const updateCompoundChainDaoVotes = async (
    daoHandlerId: string,
    voters: [string]
) => {
    logger.log({ action: 'updateCompoundChainDaoVotes', details: 'start' })
    if (!Array.isArray(voters)) voters = [voters]

    logger.log({
        action: 'updateCompoundChainDaoVotes',
        details: 'voters',
        item: voters
    })

    const daoHandler = await prisma.dAOHandler.findFirstOrThrow({
        where: { id: daoHandlerId, type: DAOHandlerType.COMPOUND_CHAIN },
        include: {
            dao: {
                include: {
                    votes: { where: { daoHandlerId: daoHandlerId } }
                }
            }
        }
    })

    logger.log({
        action: 'updateCompoundChainDaoVotes',
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
            action: 'updateCompoundChainDaoVotes',
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
                        `GovBravo proposal with externalId ${vote.proposalOnChainId} does not exist in DB for daoId: ${daoHandler.daoId} & daoHandlerId: ${daoHandler.id}`
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
                            action: 'updateCompoundChainDaoVotes',
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
            logger.error('Error while updating governor bravo votes', err)
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
        action: 'updateCompoundChainDaoVotes',
        details: 'voters',
        item: voters
    })

    const resultsArray = Array.from(results, ([name, value]) => ({
        voterAddress: name,
        response: value
    }))

    logger.log({
        action: 'updateCompoundChainDaoVotes',
        details: 'result',
        item: resultsArray
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
            hexZeroPad(voterAddress, 32)
        ]
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
