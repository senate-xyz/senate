import { log_pd } from '@senate/axiom'
import type { DAOHandler } from '@senate/database'
import { ethers } from 'ethers'

export const uniswapProposals = async (
    provider: ethers.JsonRpcProvider,
    daoHandler: DAOHandler,
    fromBlock: number,
    toBlock: number
) => {
    const govBravoIface = new ethers.Interface(daoHandler.decoder['abi'])

    const logs = await provider.getLogs({
        fromBlock: fromBlock,
        toBlock: toBlock,
        address: daoHandler.decoder['address'],
        topics: [govBravoIface.getEventName('ProposalCreated')]
    })

    const args = logs.map((log) => ({
        txBlock: log.blockNumber,
        txHash: log.transactionHash,
        eventData: govBravoIface.parseLog({
            topics: log.topics as string[],
            data: log.data
        }).args
    }))

    const proposals = await Promise.all(
        args.map(async (arg) => {
            const proposalCreatedTimestamp = (
                await provider.getBlock(arg.txBlock)
            ).timestamp

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
            const proposalOnChainId = Number(arg.eventData.id).toString()

            return {
                externalId: proposalOnChainId,
                name: String(title).slice(0, 1024),
                daoId: daoHandler.daoId,
                daoHandlerId: daoHandler.id,
                timeEnd: new Date(votingEndsTimestamp * 1000),
                timeStart: new Date(votingStartsTimestamp * 1000),
                timeCreated: new Date(proposalCreatedTimestamp * 1000),
                url: proposalUrl
            }
        })
    )

    return proposals
}

const formatTitle = async (text: string): Promise<string> => {
    const temp = text.split('\n')[0]

    if (!temp) {
        log_pd.log({
            level: 'warn',
            message: `Could not get proposal title`,
            text: text
        })
        return 'Title unavailable'
    }

    if (temp[0] === '#') {
        return temp.substring(2)
    }

    return temp
}
