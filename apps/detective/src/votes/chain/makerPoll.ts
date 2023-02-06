import { log_pd } from '@senate/axiom'
import { Decoder } from '@senate/database'
import { DAOHandlerWithDAO, prisma } from '@senate/database'
import { ethers, Log, zeroPadValue } from 'ethers'
import { hexlify } from 'ethers'

export const getMakerPollVotes = async (
    provider: ethers.JsonRpcProvider,
    daoHandler: DAOHandlerWithDAO,
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

    const result = await Promise.all(
        voterAddresses.map((voterAddress) => {
            return getVotesForVoter(logs, daoHandler, voterAddress)
        })
    )

    return result
}

export const getVotesForVoter = async (
    logs: Log[],
    daoHandler: DAOHandlerWithDAO,
    voterAddress: string
) => {
    let success = true
    const iface = new ethers.Interface((daoHandler.decoder as Decoder).abi_vote)
    const votes = await Promise.all(
        logs.map(async (log: Log) => {
            try {
                const eventData = iface.parseLog({
                    topics: log.topics as string[],
                    data: log.data
                }).args

                if (
                    String(eventData.voter).toLowerCase() !=
                    voterAddress.toLowerCase()
                )
                    return null

                const proposal = await prisma.proposal.findFirst({
                    where: {
                        externalId: BigInt(eventData.pollId).toString(),
                        daoId: daoHandler.daoId,
                        daoHandlerId: daoHandler.id
                    }
                })

                if (!proposal) {
                    success = false
                    return null
                }

                return {
                    voterAddress: ethers.getAddress(voterAddress),
                    daoId: daoHandler.daoId,
                    proposalId: proposal.id,
                    daoHandlerId: daoHandler.id,
                    choiceId: BigInt(eventData.optionId).toString(),
                    choice: BigInt(eventData.optionId).toString() ? 'Yes' : 'No'
                }
            } catch (e: any) {
                log_pd.log({
                    level: 'error',
                    message: `Error fetching votes for ${voterAddress} - ${daoHandler.dao.name} - ${daoHandler.type}`,
                    logs: logs,
                    errorMessage: e.message,
                    errorStack: e.stack
                })
                success = false
                return null
            }
        })
    )

    return { success, votes, voterAddress }
}
