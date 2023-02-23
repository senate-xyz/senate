import { log_pd } from '@senate/axiom'
import { DAOHandler, Decoder, ProposalState } from '@senate/database'
import { ethers } from 'ethers'

export const hopProposals = async (
    provider: ethers.JsonRpcProvider,
    daoHandler: DAOHandler,
    fromBlock: number,
    toBlock: number
) => {
    const iface = new ethers.Interface((daoHandler.decoder as Decoder).abi)

    const logs = await provider.getLogs({
        fromBlock: fromBlock,
        toBlock: toBlock,
        address: (daoHandler.decoder as Decoder).address,
        topics: [iface.getEvent('ProposalCreated').topicHash]
    })

    const args = logs.map((log) => ({
        txBlock: log.blockNumber,
        txHash: log.transactionHash,
        eventData: iface.parseLog({
            topics: log.topics as string[],
            data: log.data
        }).args
    }))

    const govContract = new ethers.Contract(
        (daoHandler.decoder as Decoder).address,
        (daoHandler.decoder as Decoder).abi,
        provider
    )

    const proposals =
        (
            await Promise.all(
                args.map(async (arg) => {
                    const proposalCreatedTimestamp = (
                        await provider.getBlock(arg.txBlock)
                    ).timestamp

                    const votingStartsTimestamp =
                        proposalCreatedTimestamp +
                        (Number(arg.eventData.startBlock) - arg.txBlock) * 12
                    const votingEndsTimestamp =
                        proposalCreatedTimestamp +
                        (Number(arg.eventData.endBlock) - arg.txBlock) * 12
                    const title = await formatTitle(arg.eventData.description)
                    const proposalOnChainId =
                        arg.eventData.proposalId.toString()
                    const proposalUrl =
                        (daoHandler.decoder as Decoder).proposalUrl +
                        proposalOnChainId

                    const onchainProposal = await govContract.proposalVotes(
                        proposalOnChainId
                    )

                    return {
                        externalId: proposalOnChainId,
                        name: String(title).slice(0, 1024),
                        daoId: daoHandler.daoId,
                        daoHandlerId: daoHandler.id,
                        timeEnd: new Date(votingEndsTimestamp * 1000),
                        timeStart: new Date(votingStartsTimestamp * 1000),
                        timeCreated: new Date(proposalCreatedTimestamp * 1000),
                        choices: ['For', 'Abstain', 'Against'],
                        scores: [
                            parseFloat(onchainProposal.forVotes),
                            parseFloat(onchainProposal.abstainVotes),
                            parseFloat(onchainProposal.againstVotes)
                        ],
                        scoresTotal:
                            parseFloat(onchainProposal.forVotes) +
                            parseFloat(onchainProposal.abstainVotes) +
                            parseFloat(onchainProposal.againstVotes),
                        state: ProposalState.CLOSED,
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
