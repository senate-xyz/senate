import { InternalServerErrorException, Logger } from '@nestjs/common'
import { DAOHandlerType } from '@prisma/client'
import { DAOHandler, Proposal, User } from '@senate/common-types'
import { prisma } from '@senate/database'
import { BigNumber, ethers } from 'ethers'
import { hexZeroPad } from 'ethers/lib/utils'

const provider = new ethers.providers.JsonRpcProvider({
    url: String(process.env.PROVIDER_URL),
})

type Vote = {
    proposalOnChainId: string
    support: string
}

const logger = new Logger('MakerExecutiveProposals')

export const updateGovernorBravoVotes = async (
    daoHandler: DAOHandler,
    user: User,
    daoName: string
) => {
    logger.log(`Updating Governor Bravo votes for ${daoName}`)
    let votes

    try {
        const userLatestVoteBlock = await prisma.userLatestVoteBlock.findFirst({
            where: {
                userId: user.id,
                daoHandlerId: daoHandler.id,
            },
        })

        const latestVoteBlock = userLatestVoteBlock
            ? Number(userLatestVoteBlock.latestVoteBlock)
            : 0
        const currentBlock = await provider.getBlockNumber()

        votes = await getVotes(daoHandler, user, latestVoteBlock)
        if (!votes) return

        for (const vote of votes) {
            const proposal: Proposal = await prisma.proposal.findFirst({
                where: {
                    externalId: vote.proposalOnChainId,
                    daoId: daoHandler.daoId,
                    daoHandlerId: daoHandler.id,
                },
            })

            await prisma.vote.upsert({
                where: {
                    userId_daoId_proposalId: {
                        userId: user.id,
                        daoId: daoHandler.daoId,
                        proposalId: proposal.id,
                    },
                },
                update: {
                    options: {
                        update: {
                            where: {
                                voteProposalId_option: {
                                    voteProposalId: proposal.id,
                                    option: vote.support,
                                },
                            },
                            data: {
                                option: vote.support,
                                optionName: vote.support ? 'Yes' : 'No',
                            },
                        },
                    },
                },
                create: {
                    userId: user.id,
                    daoId: daoHandler.daoId,
                    proposalId: proposal.id,
                    daoHandlerId: daoHandler.id,
                    options: {
                        create: {
                            option: vote.support,
                            optionName: vote.support ? 'Yes' : 'No',
                        },
                    },
                },
            })
        }

        await prisma.userLatestVoteBlock.upsert({
            where: {
                userId_daoHandlerId: {
                    userId: user.id,
                    daoHandlerId: daoHandler.id,
                },
            },
            update: {
                latestVoteBlock: currentBlock,
            },
            create: {
                userId: user.id,
                daoHandlerId: daoHandler.id,
                latestVoteBlock: currentBlock,
            },
        })
    } catch (err) {
        logger.error('Error while updating governor bravo votes', err)
        throw new InternalServerErrorException()
    }

    logger.log(`Updated ${votes.length} Governor Bravo votes for ${daoName}`)
}

const getVotes = async (
    daoHandler: DAOHandler,
    user: User,
    latestVoteBlock: number
): Promise<Vote[]> => {
    const govBravoIface = new ethers.utils.Interface(daoHandler.decoder['abi'])

    if (
        daoHandler.type !== DAOHandlerType.BRAVO1 &&
        daoHandler.type !== DAOHandlerType.BRAVO2
    )
        return []

    let logs: any[] = []
    switch (daoHandler.type) {
        case DAOHandlerType.BRAVO1:
            logs = await provider.getLogs({
                fromBlock: latestVoteBlock,
                address: daoHandler.decoder['address'],
                topics: [
                    govBravoIface.getEventTopic('VoteEmitted'),
                    null,
                    hexZeroPad(user.address, 32),
                ],
            })
            break
        case DAOHandlerType.BRAVO2:
            logs = await provider.getLogs({
                fromBlock: 0 /*daoHandler.decoder["latestVoteBlock"]*/,
                address: daoHandler.decoder['address'],
                topics: [
                    govBravoIface.getEventTopic('VoteCast'),
                    hexZeroPad(user.address, 32),
                ],
            })
            break
    }

    const votes = logs.map((log) => {
        const eventData = govBravoIface.parseLog({
            topics: log.topics,
            data: log.data,
        }).args

        return {
            proposalOnChainId: BigNumber.from(eventData.proposalId).toString(),
            support: String(eventData.support),
        }
    })

    return votes
}
