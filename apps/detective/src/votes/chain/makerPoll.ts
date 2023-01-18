import { log_node, log_pd } from '@senate/axiom'
import { DAOHandler, prisma } from '@senate/database'
import { BigNumber, ethers } from 'ethers'
import { hexZeroPad } from 'ethers/lib/utils'

export const getMakerPollVotes = async (
    provider: ethers.providers.JsonRpcProvider,
    daoHandler: DAOHandler,
    voterAddress: string,
    lastVoteBlock: number
) => {
    const iface = new ethers.utils.Interface(
        JSON.parse(daoHandler.decoder['abi_vote'])
    )
    const logs = await provider.getLogs({
        fromBlock: Number(lastVoteBlock),
        toBlock: Number(lastVoteBlock + 1000000),
        address: daoHandler.decoder['address_vote'],
        topics: [iface.getEventTopic('Voted'), hexZeroPad(voterAddress, 32)]
    })

    log_node.log({
        level: 'info',
        message: `getLogs`,
        data: {
            fromBlock: Number(lastVoteBlock),
            toBlock: Number(lastVoteBlock + 1000000),
            address: daoHandler.decoder['address_vote'],
            topics: [iface.getEventTopic('Voted'), hexZeroPad(voterAddress, 32)]
        }
    })

    let newLastVoteBlock = Math.max(...logs.map((log) => log.blockNumber)) ?? 0

    const votes =
        (
            await Promise.all(
                logs.map(async (log) => {
                    const eventData = iface.parseLog({
                        topics: log.topics,
                        data: log.data
                    }).args

                    const proposal = await prisma.proposal.findFirst({
                        where: {
                            externalId: BigNumber.from(
                                eventData.pollId
                            ).toString(),
                            daoId: daoHandler.daoId,
                            daoHandlerId: daoHandler.id
                        }
                    })

                    //missing proposal, force sync from infura
                    if (!proposal) {
                        log_pd.log({
                            level: 'warn',
                            message: `Proposal does not exist while updating votes for ${voterAddress} in ${daoHandler.id} - ${daoHandler.type}. Resetting newLastVoteBlock.`,
                            data: {
                                externalId: BigNumber.from(
                                    eventData.pollId
                                ).toString()
                            }
                        })
                        newLastVoteBlock = 0
                        return
                    }

                    return {
                        voterAddress: voterAddress,
                        daoId: daoHandler.daoId,
                        proposalId: proposal.id,
                        daoHandlerId: daoHandler.id,
                        choiceId: BigNumber.from(eventData.optionId).toString(),
                        choice: BigNumber.from(eventData.optionId).toString()
                            ? 'Yes'
                            : 'No'
                    }
                })
            )
        ).filter((n) => n) ?? []

    return { votes, newLastVoteBlock }
}
