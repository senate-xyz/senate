import { DAOHandler, prisma, Vote, Proposal } from '@senate/database'
import { BigNumber, ethers } from 'ethers'
import { hexZeroPad } from 'ethers/lib/utils'

export const getMakerPollVotesFromArbitrum = async (
    provider: ethers.providers.JsonRpcProvider,
    daoHandler: DAOHandler,
    voterAddresses: string[],
    fromBlock: number,
    toBlock: number
) => {
    const iface = new ethers.utils.Interface(
        JSON.parse(daoHandler.decoder['abi_vote'])
    )

    const logs = await provider.getLogs({
        fromBlock: fromBlock,
        toBlock: toBlock,
        address: daoHandler.decoder['address_vote'],
        topics: [
            iface.getEventTopic('Voted'),
            voterAddresses.map((voterAddress) => hexZeroPad(voterAddress, 32))
        ]
    })

    const eventData = logs.map((log) => {
        return iface.parseLog({
            topics: log.topics,
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

    console.log('VOTES FOUND: ', result.length)
    console.log(result)

    return result
}

export const getVotesForVoter = async (
    eventsForVoter: Array<any>,
    daoHandler,
    voterAddress: string
) => {
    let success = true

    const uniquePollIds: Set<string> = new Set(
        eventsForVoter.map((event) => BigNumber.from(event.pollId).toString())
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
    events: Array<any>,
    proposalsMap: Map<string, Proposal>
) => {
    return events.map((event) => {
        const proposal = proposalsMap.get(
            BigNumber.from(event.pollId).toString()
        )
        return {
            voterAddress: event.voter,
            daoId: proposal.daoId,
            proposalId: proposal.id,
            daoHandlerId: proposal.daoHandlerId,
            choiceId: BigNumber.from(event.optionId).toString(),
            choice: BigNumber.from(event.optionId).toString() ? 'Yes' : 'No'
        }
    })
}
