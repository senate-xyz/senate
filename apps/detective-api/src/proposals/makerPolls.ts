import { InternalServerErrorException, Logger } from '@nestjs/common'
import { DAOHandler, DAOHandlerType, ProposalType } from '@senate/common-types'
import { prisma } from '@senate/database'
import axios from 'axios'
import { ethers } from 'ethers'

const provider = new ethers.providers.JsonRpcProvider({
    url: String(process.env.PROVIDER_URL),
})

const logger = new Logger('MakerPollProposals')

export const updateMakerPolls = async (daoHandler: DAOHandler) => {
    if (!daoHandler.decoder) {
        console.log('Decoder nok.')
        return
    }

    logger.log(
        `Searching polls from block ${daoHandler.decoder['latestProposalBlock']} ...`
    )
    let proposals

    try {
        const mkrPollVoteHandler = await prisma.dAOHandler.findFirst({
            where: {
                daoId: daoHandler.daoId,
                type: DAOHandlerType.MAKER_POLL_VOTE,
            },
        })

        if (!mkrPollVoteHandler) return

        const pollingContractIface = new ethers.utils.Interface(
            daoHandler.decoder['abi']
        )

        const logs = await provider.getLogs({
            fromBlock: daoHandler.decoder['latestProposalBlock'],
            address: daoHandler.decoder['address'],
            topics: [pollingContractIface.getEventTopic('PollCreated')],
        })

        proposals = logs.map((log) => ({
            txBlock: log.blockNumber,
            txHash: log.transactionHash,
            eventData: pollingContractIface.parseLog({
                topics: log.topics,
                data: log.data,
            }).args,
        }))

        for (let i = 0; i < proposals.length; i++) {
            const proposalCreatedTimestamp = Number(
                proposals[i].eventData.blockCreated
            )

            const votingStartsTimestamp = Number(
                proposals[i].eventData.startDate
            )
            const votingEndsTimestamp = Number(proposals[i].eventData.endDate)
            const title = await getProposalTitle(proposals[i].eventData.url)
            const proposalUrl =
                daoHandler.decoder['proposalUrl'] +
                proposals[i].eventData.multiHash.substring(0, 7)
            const proposalOnChainId = Number(
                proposals[i].eventData.pollId
            ).toString()

            // Update latest block
            const decoder = daoHandler.decoder
            decoder['latestProposalBlock'] = proposals[i].txBlock + 1
            await prisma.dAOHandler.update({
                where: {
                    id: daoHandler.id,
                },
                data: {
                    decoder: decoder,
                },
            })

            const proposal = await prisma.proposal.upsert({
                where: {
                    externalId_daoId: {
                        daoId: daoHandler.daoId,
                        externalId: proposalOnChainId,
                    },
                },
                update: {},
                create: {
                    externalId: proposalOnChainId,
                    name: String(title),
                    daoId: daoHandler.daoId,
                    daoHandlerId: mkrPollVoteHandler.id,
                    proposalType: ProposalType.MAKER_POLL,
                    timeEnd: new Date(votingEndsTimestamp * 1000),
                    timeStart: new Date(votingStartsTimestamp * 1000),
                    timeCreated: new Date(proposalCreatedTimestamp * 1000),
                    data: {},
                    url: proposalUrl,
                    addedAt: Date.now(),
                },
            })

            console.log('Inserted poll with id' + proposal.id)
        }
    } catch (err) {
        logger.log('Error while updating Maker Polls', err)
        throw new InternalServerErrorException()
    }

    logger.log('\n\n')
    logger.log(`Updated ${proposals.length} maker polls`)
    logger.log('======================================================\n\n')
}

const formatTitle = (text: string): string => {
    const temp = text.split('summary:')[0].split('title: ')[1]

    return temp
}

const getProposalTitle = async (url: string): Promise<unknown> => {
    let title
    try {
        const response = await axios.get(url)
        title = formatTitle(response.data)
    } catch (error) {
        title = 'Unknown'
    }

    return title
}
