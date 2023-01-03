/*
    @banteg's article on MakerDAO's governance was incredibly helpful in understanding
    how to fetch executive proposals. Thank you ser!

    https://medium.com/@banteg/deep-dive-into-makerdao-governance-437c89493203
*/

import { InternalServerErrorException, Logger } from '@nestjs/common'
import { prisma } from '@senate/database'
import axios from 'axios'
import { ethers } from 'ethers'

const provider = new ethers.providers.JsonRpcProvider({
    url: String(process.env.PROVIDER_URL)
})

const logger = new Logger('updateMakerChainPolls')

export const updateMakerChainPolls = async (
    daoHandlerId: string,
    minBlockNumber: number
) => {
    const daoHandler = await prisma.dAOHandler.findFirst({
        where: { id: daoHandlerId }
    })

    if (!(await provider.blockNumber))
        return [{ daoHandlerId: daoHandlerId, response: 'nok' }]

    if (!daoHandler.decoder) {
        return [{ daoHandlerId: daoHandlerId, response: 'nok' }]
    }

    logger.log(`Searching polls from block ${Number(minBlockNumber)} ...`)
    let proposals

    try {
        const pollingContractIface = new ethers.utils.Interface(
            daoHandler.decoder['abi']
        )

        const logs = await provider.getLogs({
            fromBlock: Number(minBlockNumber),
            address: daoHandler.decoder['address'],
            topics: [pollingContractIface.getEventTopic('PollCreated')]
        })

        proposals = logs.map((log) => ({
            txBlock: log.blockNumber,
            txHash: log.transactionHash,
            eventData: pollingContractIface.parseLog({
                topics: log.topics,
                data: log.data
            }).args
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

            await prisma.dAOHandler.update({
                where: {
                    id: daoHandler.id
                },
                data: {
                    lastChainProposalCreatedBlock: proposals[i].txBlock + 1
                }
            })

            const proposal = await prisma.proposal.upsert({
                where: {
                    externalId_daoId: {
                        daoId: daoHandler.daoId,
                        externalId: proposalOnChainId
                    }
                },
                update: {},
                create: {
                    externalId: proposalOnChainId,
                    name: String(title),
                    daoId: daoHandler.daoId,
                    daoHandlerId: daoHandler.id,
                    timeEnd: new Date(votingEndsTimestamp * 1000),
                    timeStart: new Date(votingStartsTimestamp * 1000),
                    timeCreated: new Date(proposalCreatedTimestamp * 1000),
                    data: {},
                    url: proposalUrl
                }
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

    return [{ daoHandlerId: daoHandlerId, response: 'ok' }]
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
