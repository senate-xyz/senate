import { log_pd } from '@senate/axiom'
import { DAOHandlerWithDAO, Decoder, prisma } from '@senate/database'
import { ethers, Log, zeroPadValue, hexlify } from 'ethers'

export const getENSVotes = async (
    provider: ethers.JsonRpcProvider,
    daoHandler: DAOHandlerWithDAO,
    voterAddresses: string[],
    fromBlock: number,
    toBlock: number
) => {
    const iface = new ethers.Interface((daoHandler.decoder as Decoder).abi)

    const logs = await provider.getLogs({
        fromBlock: fromBlock,
        toBlock: toBlock,
        address: (daoHandler.decoder as Decoder).address,
        topics: [
            iface.getEvent('VoteCast').topicHash,
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
    const votes =
        (
            await Promise.all(
                logs.map(async (log) => {
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
                                externalId: BigInt(
                                    eventData.proposalId
                                ).toString(),
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
                            choiceId: String(eventData.support),
                            choice: String(eventData.support) ? 'Yes' : 'No'
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
        ).filter((n) => n) ?? []

    return { success, votes, voterAddress }
}
