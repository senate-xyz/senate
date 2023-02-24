import { log_pd } from '@senate/axiom'
import { Decoder } from '@senate/database'
import { type DAOHandlerWithDAO, prisma } from '@senate/database'
import { ethers, Log } from 'ethers'
import { hexlify, zeroPadValue } from 'ethers'

export const getAaveVotes = async (
    provider: ethers.JsonRpcProvider,
    daoHandler: DAOHandlerWithDAO,
    voterAddresses: string[],
    fromBlock: number,
    toBlock: number
) => {
    const govBravoIface = new ethers.Interface(
        (daoHandler.decoder as Decoder).abi
    )

    const logs = await provider.getLogs({
        fromBlock: fromBlock,
        toBlock: toBlock,
        address: (daoHandler.decoder as Decoder).address,
        topics: [
            govBravoIface.getEvent('VoteEmitted').topicHash,
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
    const govBravoIface = new ethers.Interface(
        (daoHandler.decoder as Decoder).abi
    )
    const votes = (
        await Promise.all(
            logs.map(async (log: Log) => {
                try {
                    const eventData = govBravoIface.parseLog({
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
                            externalId: BigInt(eventData.id).toString(),
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
                        choice: String(eventData.support) ? 1 : 3,
                        reason: '',
                        votingPower: parseFloat(eventData.votingPower),
                        proposalState: proposal.state
                    }
                } catch (e) {
                    log_pd.log({
                        level: 'error',
                        message: `Error fetching votes for ${voterAddress} - ${daoHandler.dao.name} - ${daoHandler.type}`,
                        logs: logs,
                        errorName: (e as Error).name,
                        errorMessage: (e as Error).message,
                        errorStack: (e as Error).stack
                    })
                    success = false
                    return null
                }
            })
        )
    ).filter((vote) => vote != null)

    return { success, votes, voterAddress }
}
