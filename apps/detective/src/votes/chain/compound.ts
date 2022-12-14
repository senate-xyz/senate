import { log_node, log_pd } from '@senate/axiom'
import { DAOHandler, prisma } from '@senate/database'
import { BigNumber, ethers } from 'ethers'
import { hexZeroPad } from 'ethers/lib/utils'

export const getCompoundVotes = async (
    provider: ethers.providers.JsonRpcProvider,
    daoHandler: DAOHandler,
    voterAddress: string,
    lastVoteBlock: number
) => {
    const govBravoIface = new ethers.utils.Interface(daoHandler.decoder['abi'])

    const logs = await provider.getLogs({
        fromBlock: lastVoteBlock,
        address: daoHandler.decoder['address'],
        topics: [
            govBravoIface.getEventTopic('VoteCast'),
            hexZeroPad(voterAddress, 32)
        ]
    })

    log_node.log({
        level: 'info',
        message: `getLogs`,
        data: {
            fromBlock: lastVoteBlock,
            address: daoHandler.decoder['address'],
            topics: [
                govBravoIface.getEventTopic('VoteCast'),
                hexZeroPad(voterAddress, 32)
            ]
        }
    })

    let newLastVoteBlock = (await provider.getBlockNumber()) ?? 0

    const votes =
        (
            await Promise.all(
                logs.map(async (log) => {
                    const eventData = govBravoIface.parseLog({
                        topics: log.topics,
                        data: log.data
                    }).args

                    const proposal = await prisma.proposal.findFirst({
                        where: {
                            externalId: BigNumber.from(
                                eventData.proposalId
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
                                    eventData.id
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
                        choiceId: String(eventData.support),
                        choice: String(eventData.support) ? 'Yes' : 'No'
                    }
                })
            )
        ).filter((n) => n) ?? []

    return { votes, newLastVoteBlock }
}
