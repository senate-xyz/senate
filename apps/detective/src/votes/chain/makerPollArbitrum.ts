import { DAOHandler, prisma, Proposal, Decoder } from '@senate/database'
import { ethers, hexlify, zeroPadValue } from 'ethers'

interface DecodedLog {
    txBlock: number
    txHash: string
    eventData: ethers.Result
}

export const getMakerPollVotesFromArbitrum = async (
    provider: ethers.JsonRpcProvider,
    daoHandler: DAOHandler,
    voterAddresses: string[],
    fromBlock: number,
    toBlock: number
) => {
    const iface = new ethers.Interface((daoHandler.decoder as Decoder).abi_vote)

    const logs = await provider.getLogs({
        fromBlock: fromBlock,
        toBlock: toBlock,
        address: (daoHandler.decoder as Decoder).address_vote,
        topics: [
            iface.getEvent('Voted').topicHash,
            voterAddresses.map((voterAddress) =>
                hexlify(zeroPadValue(voterAddress, 32))
            )
        ]
    })

    const decodedLogs: DecodedLog[] = logs.map((log) => ({
        txBlock: log.blockNumber,
        txHash: log.transactionHash,
        eventData: iface.parseLog({
            topics: log.topics as string[],
            data: log.data
        }).args
    }))

    const result = await Promise.all(
        voterAddresses.map((voterAddress) => {
            const voterLogs = decodedLogs.filter(
                (log) =>
                    log.eventData.voter.toLowerCase() ===
                    voterAddress.toLowerCase()
            )
            return getVotesForVoter(voterLogs, daoHandler, voterAddress)
        })
    )

    return result
}

export const getVotesForVoter = async (
    voterLogs: DecodedLog[],
    daoHandler: DAOHandler,
    voterAddress: string
) => {
    let success = true

    const uniquePollIds: Set<string> = new Set(
        voterLogs.map((log) => BigInt(log.eventData.pollId).toString())
    )

    const proposals = await prisma.proposal.findMany({
        where: {
            externalId: {
                in: Array.from(uniquePollIds)
            },
            daoId: daoHandler.daoId
        }
    })

    if (proposals.length < uniquePollIds.size) {
        success = false
        return { success, votes: [], voterAddress }
    }

    const proposalsMap: Map<string, Proposal> = new Map(
        proposals.map((proposal) => {
            return [proposal.externalId, proposal]
        })
    )

    const votes = await formatVotes(voterLogs, proposalsMap)

    return { success, votes, voterAddress }
}

const formatVotes = async (
    decodedLogs: DecodedLog[],
    proposalsMap: Map<string, Proposal>
) => {
    return decodedLogs.map((log) => {
        const proposal = proposalsMap.get(
            BigInt(log.eventData.pollId).toString()
        )
        return {
            blockCreated: log.txBlock,
            voterAddress: log.eventData.voter,
            daoId: proposal.daoId,
            proposalId: proposal.id,
            daoHandlerId: proposal.daoHandlerId,
            choice: BigInt(log.eventData.optionId).toString() ? 1 : 2,
            reason: '',
            votingPower: 0,
            proposalActive: proposal.timeEnd.getTime() > new Date().getTime()
        }
    })
}
