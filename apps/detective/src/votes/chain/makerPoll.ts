import { log_node, log_pd } from '@senate/axiom'
import { DAOHandler, prisma } from '@senate/database'
import { BigNumber, ethers } from 'ethers'
import { hexZeroPad } from 'ethers/lib/utils'

export const getMakerPollVotes = async (
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

    log_node.log({
        level: 'info',
        message: `getLogs`,
        data: {
            fromBlock: fromBlock,
            toBlock: toBlock,
            address: daoHandler.decoder['address_vote'],
            topics: [
                iface.getEventTopic('Voted'),
                voterAddresses.map((voterAddress) =>
                    hexZeroPad(voterAddress, 32)
                )
            ]
        }
    })

    const result = await Promise.all(
        voterAddresses.map((voterAddress) => {
            return getVotesForVoter(logs, daoHandler, voterAddress)
        })
    )

    return result
}

export const getVotesForVoter = async (
    logs,
    daoHandler,
    voterAddress: string
) => {
    let success = true
    const iface = new ethers.utils.Interface(
        JSON.parse(daoHandler.decoder['abi_vote'])
    )
    const votes =
        (
            await Promise.all(
                logs.map(async (log) => {
                    try {
                        const eventData = iface.parseLog({
                            topics: log.topics,
                            data: log.data
                        }).args

                        if (String(eventData.voter) != voterAddress) return

                        const proposal = await prisma.proposal.findFirst({
                            where: {
                                externalId: BigNumber.from(
                                    eventData.pollId
                                ).toString(),
                                daoId: daoHandler.daoId,
                                daoHandlerId: daoHandler.id
                            }
                        })

                        if (!proposal) {
                            log_pd.log({
                                level: 'warn',
                                message: `Proposal does not exist while updating votes in ${daoHandler.id} - ${daoHandler.type}. Resetting newLastVoteBlock.`,
                                data: {
                                    externalId: BigNumber.from(
                                        eventData.id
                                    ).toString()
                                }
                            })
                            success = false
                            return
                        }

                        return {
                            voterAddress: voterAddress,
                            daoId: daoHandler.daoId,
                            proposalId: proposal.id,
                            daoHandlerId: daoHandler.id,
                            choiceId: BigNumber.from(
                                eventData.optionId
                            ).toString(),
                            choice: BigNumber.from(
                                eventData.optionId
                            ).toString()
                                ? 'Yes'
                                : 'No'
                        }
                    } catch (e) {
                        log_pd.log({
                            level: 'error',
                            message: `Get votes error for ${daoHandler.id} - ${daoHandler.type}. Resetting newLastVoteBlock.`,
                            data: {
                                error: e
                            }
                        })
                        success = false
                    }
                })
            )
        ).filter((n) => n) ?? []

    return { success, votes, voterAddress }
}
