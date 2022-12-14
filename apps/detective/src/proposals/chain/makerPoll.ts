import { log_node, log_pd } from '@senate/axiom'
import { DAOHandler } from '@senate/database'
import axios from 'axios'
import { ethers } from 'ethers'

export const makerPolls = async (
    provider: ethers.providers.JsonRpcProvider,
    daoHandler: DAOHandler,
    minBlockNumber: number
) => {
    const pollingContractIface = new ethers.utils.Interface(
        daoHandler.decoder['abi_create']
    )
    const logs = await provider.getLogs({
        fromBlock: Number(minBlockNumber),
        address: daoHandler.decoder['address_create'],
        topics: [pollingContractIface.getEventTopic('PollCreated')]
    })

    log_node.log({
        level: 'info',
        message: `getLogs`,
        data: {
            fromBlock: Number(minBlockNumber),
            address: daoHandler.decoder['address_create'],
            topics: [pollingContractIface.getEventTopic('PollCreated')]
        }
    })

    const args = logs.map((log) => ({
        txBlock: log.blockNumber,
        txHash: log.transactionHash,
        eventData: pollingContractIface.parseLog({
            topics: log.topics,
            data: log.data
        }).args
    }))

    const proposals =
        (
            await Promise.all(
                args.map(async (arg) => {
                    const proposalCreatedTimestamp = Number(
                        arg.eventData.blockCreated
                    )

                    const votingStartsTimestamp = Number(
                        arg.eventData.startDate
                    )
                    const votingEndsTimestamp = Number(arg.eventData.endDate)
                    const title =
                        (await getProposalTitle(arg.eventData.url)) ?? 'Unknown'
                    const proposalUrl =
                        daoHandler.decoder['proposalUrl'] +
                        arg.eventData.multiHash.substring(0, 7)
                    const proposalOnChainId = Number(
                        arg.eventData.pollId
                    ).toString()

                    if (
                        proposalOnChainId == '1' //we know for sure this is a bad proposal
                    )
                        return

                    return {
                        externalId: proposalOnChainId,
                        name: String(title).slice(0, 1024),
                        daoId: daoHandler.daoId,
                        daoHandlerId: daoHandler.id,
                        timeEnd: new Date(votingEndsTimestamp * 1000),
                        timeStart: new Date(votingStartsTimestamp * 1000),
                        timeCreated: new Date(proposalCreatedTimestamp * 1000),
                        data: {},
                        url: proposalUrl
                    }
                })
            )
        ).filter((n) => n) ?? []

    const lastBlock = (await provider.getBlockNumber()) ?? 0

    return { proposals, lastBlock }
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
    } catch (e) {
        title = 'Unknown'
        log_pd.log({
            level: 'error',
            message: `Could not get proposal title`,
            data: {
                url: url,
                error: e
            }
        })
    }

    return title
}
