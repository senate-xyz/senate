import { log_node } from '@senate/axiom'
import { DAOHandler } from '@senate/database'
import { ethers } from 'ethers'

export const uniswapProposals = async (
    provider: ethers.providers.JsonRpcProvider,
    daoHandler: DAOHandler,
    fromBlock: number,
    toBlock: number
) => {
    const govBravoIface = new ethers.utils.Interface(daoHandler.decoder['abi'])

    const logs = await provider.getLogs({
        fromBlock: fromBlock,
        toBlock: toBlock,
        address: daoHandler.decoder['address'],
        topics: [govBravoIface.getEventTopic('ProposalCreated')]
    })

    log_node.log({
        level: 'info',
        message: `getLogs`,
        data: {
            fromBlock: fromBlock,
            toBlock: toBlock,
            address: daoHandler.decoder['address'],
            topics: [govBravoIface.getEventTopic('ProposalCreated')]
        }
    })

    const args = logs.map((log) => ({
        txBlock: log.blockNumber,
        txHash: log.transactionHash,
        eventData: govBravoIface.parseLog({
            topics: log.topics,
            data: log.data
        }).args
    }))

    const proposals =
        (
            await Promise.all(
                args.map(async (arg) => {
                    const proposalCreatedTimestamp = (
                        await provider.getBlock(arg.txBlock)
                    ).timestamp

                    log_node.log({
                        level: 'info',
                        message: `getBlock`,
                        data: {
                            block: arg.txBlock
                        }
                    })
                    const votingStartsTimestamp =
                        proposalCreatedTimestamp +
                        (arg.eventData.startBlock - arg.txBlock) * 12
                    const votingEndsTimestamp =
                        proposalCreatedTimestamp +
                        (arg.eventData.endBlock - arg.txBlock) * 12
                    const title = await formatTitle(
                        arg.eventData.ipfsHash
                            ? arg.eventData.ipfsHash
                            : arg.eventData.description
                    )
                    const proposalUrl =
                        daoHandler.decoder['proposalUrl'] + arg.eventData.id
                    const proposalOnChainId = Number(
                        arg.eventData.id
                    ).toString()

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

    return proposals
}

const formatTitle = async (text: string): Promise<string> => {
    const temp = text.split('\n')[0]

    if (!temp) {
        return 'Title unavailable'
    }

    if (temp[0] === '#') {
        return temp.substring(2)
    }

    return temp
}
