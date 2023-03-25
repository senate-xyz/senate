import { log_pd } from '@senate/axiom'
import { Decoder } from '@senate/database'
import { DAOHandlerWithDAO, prisma } from '@senate/database'
import { ethers, InterfaceAbi, Log, zeroPadValue } from 'ethers'
import { hexlify } from 'ethers'
import getAbi from '../../utils'

export const getMakerPollVotes = async (
    provider: ethers.JsonRpcProvider,
    daoHandler: DAOHandlerWithDAO,
    voterAddresses: string[],
    fromBlock: number,
    toBlock: number
) => {
    const abi = await getAbi(
        (daoHandler.decoder as Decoder).address_vote,
        'ethereum'
    )

    const logs = await provider.getLogs({
        fromBlock: fromBlock,
        toBlock: toBlock,
        address: (daoHandler.decoder as Decoder).address_vote,
        topics: [
            new ethers.Interface(abi).getEvent('Voted').topicHash,
            voterAddresses.map((voterAddress) =>
                hexlify(zeroPadValue(voterAddress, 32))
            )
        ]
    })

    const result = await Promise.all(
        voterAddresses.map((voterAddress) => {
            return getVotesForVoter(logs, daoHandler, voterAddress, abi)
        })
    )

    return result
}

export const getVotesForVoter = async (
    logs: Log[],
    daoHandler: DAOHandlerWithDAO,
    voterAddress: string,
    abi: InterfaceAbi
) => {
    let success = true

    const votes = (
        await Promise.all(
            logs.map(async (log: Log) => {
                try {
                    const eventData = new ethers.Interface(abi).parseLog({
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
                        blockCreated: log.blockNumber,
                        voterAddress: ethers.getAddress(voterAddress),
                        daoId: daoHandler.daoId,
                        proposalId: proposal.id,
                        daoHandlerId: daoHandler.id,
                        choice: BigInt(eventData.optionId).toString() ? 1 : 2,
                        reason: '',
                        votingPower: 0,
                        proposalActive:
                            proposal.timeEnd.getTime() > new Date().getTime()
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
