import { log_pd } from '@senate/axiom'
import { DAOHandlerWithDAO, Decoder, prisma } from '@senate/database'
import { ethers } from 'ethers'

export const getGitcoinVotes = async (
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
            iface.getEvent('VoteCast').topicHash
            // voterAddresses.map((voterAddress) =>
            //     hexlify(zeroPadValue(voterAddress, 32))
            // )
            // ^ the voter address is not indexed in Gitcoin's contract so we cannot use it to filter the logs.
        ]
    })

    const events = logs.map((log) => {
        return iface.parseLog({
            topics: log.topics as string[],
            data: log.data
        }).args
    })

    const result = await Promise.all(
        voterAddresses.map((voterAddress) => {
            const voterEvents = events.filter(
                (event) =>
                    event.voter.toLowerCase() === voterAddress.toLowerCase()
            )
            return getVotesForVoter(voterEvents, daoHandler, voterAddress)
        })
    )

    return result
}

export const getVotesForVoter = async (
    eventsForVoter: ethers.Result[],
    daoHandler: DAOHandlerWithDAO,
    voterAddress: string
) => {
    let success = true

    const votes =
        (
            await Promise.all(
                eventsForVoter.map(async (eventData) => {
                    try {
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
                            choice: String(eventData.support) ? 1 : 2,
                            reason: '',
                            votingPower: parseFloat(eventData.votes),
                            proposalActive:
                                proposal.timeEnd.getTime() >
                                new Date().getTime()
                        }
                    } catch (e) {
                        log_pd.log({
                            level: 'error',
                            message: `Error fetching votes for ${voterAddress} - ${daoHandler.dao.name} - ${daoHandler.type}`,
                            event: eventData,
                            errorName: (e as Error).name,
                            errorMessage: (e as Error).message,
                            errorStack: (e as Error).stack
                        })
                        success = false
                        return null
                    }
                })
            )
        ).filter((n) => n) ?? []

    return { success, votes, voterAddress }
}
