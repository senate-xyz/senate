import { log_node } from '@senate/axiom'
import { DAOHandler } from '@senate/database'
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
        fromBlock: lastVoteBlock,
        address: daoHandler.decoder['address_vote'],
        topics: [iface.getEventTopic('Voted'), hexZeroPad(voterAddress, 32)]
    })

    log_node.log({
        level: 'info',
        message: `getLogs`,
        data: {
            fromBlock: lastVoteBlock,
            address: daoHandler.decoder['address_vote'],
            topics: [iface.getEventTopic('Voted'), hexZeroPad(voterAddress, 32)]
        }
    })

    let newLastVoteBlock = (await provider.getBlockNumber()) ?? 0

    const votes =
        (await Promise.all(
            logs.map(async (log) => {
                const eventData = iface.parseLog({
                    topics: log.topics,
                    data: log.data
                }).args

                const proposal = await prisma.proposal.findFirst({
                    where: {
                        externalId: BigNumber.from(eventData.pollId).toString(),
                        daoId: daoHandler.daoId,
                        daoHandlerId: daoHandler.id
                    }
                })

                //missing proposal, force sync from infura
                if (!proposal) newLastVoteBlock = 0

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
        )) ?? []

    return { votes, newLastVoteBlock }
}
