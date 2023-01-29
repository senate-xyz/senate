import { log_pd } from '@senate/axiom'
import { DAOHandler, prisma } from '@senate/database'
import { BigNumber, ethers } from 'ethers'
import { hexZeroPad } from 'ethers/lib/utils'

export const getENSVotes = async (
    provider: ethers.providers.JsonRpcProvider,
    daoHandler: DAOHandler,
    voterAddresses: string[],
    fromBlock: number,
    toBlock: number
) => {
    const govBravoIface = new ethers.utils.Interface(daoHandler.decoder['abi'])

    const infuraProvider = new ethers.providers.JsonRpcProvider({
        url: String(process.env.INFURA_NODE_URL)
    })
    const logs = await infuraProvider.getLogs({
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
                        console.log(eventData)

                        if (
                            String(eventData.voter).toLowerCase() !=
                            voterAddress.toLowerCase()
                        )
                            return

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
                            voterAddress: ethers.utils.getAddress(voterAddress),
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
                    }
                })
            )
        ).filter((n) => n) ?? []

    return { success, votes, voterAddress }
}
