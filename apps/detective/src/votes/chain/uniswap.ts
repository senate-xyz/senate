import { log_pd } from '@senate/axiom'
import { DAOHandler, prisma } from '@senate/database'
import { BigNumber, ethers } from 'ethers'
import { hexZeroPad } from 'ethers/lib/utils'

export const getUniswapVotes = async (
    provider: ethers.providers.JsonRpcProvider,
    daoHandler: DAOHandler,
    voterAddresses: string[],
    fromBlock: number,
    toBlock: number
) => {
    const govBravoIface = new ethers.utils.Interface(daoHandler.decoder['abi'])

    const logs = await provider.getLogs({
        fromBlock: fromBlock,
        toBlock: toBlock,
        address: daoHandler.decoder['address'],
        topics: [
            govBravoIface.getEventTopic('VoteCast'),
            voterAddresses.map((voterAddress) => hexZeroPad(voterAddress, 32))
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
    logs,
    daoHandler,
    voterAddress: string
) => {
    let success = true
    const govBravoIface = new ethers.utils.Interface(daoHandler.decoder['abi'])
    const votes =
        (
            await Promise.all(
                logs.map(async (log) => {
                    try {
                        const eventData = govBravoIface.parseLog({
                            topics: log.topics,
                            data: log.data
                        }).args

                        if (String(eventData.voter) != voterAddress) return

                        const proposal = await prisma.proposal.findFirst({
                            where: {
                                externalId: BigNumber.from(
                                    eventData.proposalId
                                ).toString(),
                                daoId: daoHandler.daoId,
                                daoHandlerId: daoHandler.id
                            }
                        })

                        if (!proposal) {
                            success = false
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
                    } catch (e) {
                        log_pd.log({
                            level: 'error',
                            message: `Error fetching votes for ${voterAddress} - ${daoHandler.dao.name} - ${daoHandler.type}`,
                            logs: logs,
                            error: e
                        })
                        success = false
                    }
                })
            )
        ).filter((n) => n) ?? []

    return { success, votes, voterAddress }
}
