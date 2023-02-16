import { DAOHandler, prisma, Proposal, Decoder } from '@senate/database'
import { ethers, hexlify, zeroPadValue } from 'ethers'

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

    const eventData = logs.map((log) => {
        return iface.parseLog({
            topics: log.topics as string[],
            data: log.data
        }).args
    })

    const result = await Promise.all(
        voterAddresses.map((voterAddress) => {
            const eventsForVoter = eventData.filter(
                (event) =>
                    event.voter.toLowerCase() == voterAddress.toLowerCase()
            )
            return getVotesForVoter(eventsForVoter, daoHandler, voterAddress)
        })
    )

    return result
}

export const getVotesForVoter = async (
    eventsForVoter: ethers.Result[],
    daoHandler: DAOHandler,
    voterAddress: string
) => {
    let success = true

    const uniquePollIds: Set<string> = new Set(
        eventsForVoter.map((event) => BigInt(event.pollId).toString())
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

    const votes = await formatVotes(eventsForVoter, proposalsMap)

    return { success, votes, voterAddress }
}

const formatVotes = async (
    events: ethers.Result[],
    proposalsMap: Map<string, Proposal>
) => {
    return events.map((event) => {
        const proposal = proposalsMap.get(BigInt(event.pollId).toString())
        return {
            voterAddress: event.voter,
            daoId: proposal.daoId,
            proposalId: proposal.id,
            daoHandlerId: proposal.daoHandlerId,
            choice: JSON.stringify(
                BigInt(event.optionId).toString() ? 'Yes' : 'No'
            ),
            reason: '',
            votingPower: 0
        }
    })
}
