import { log_pd } from '@senate/axiom'
import { DAOHandlerWithDAO, prisma } from '@senate/database'
import { ethers, Log } from 'ethers'
import { hexZeroPad } from 'ethers/lib/utils'

export const getUniswapVotes = async (
    provider: ethers.JsonRpcProvider,
    daoHandler: DAOHandlerWithDAO,
    voterAddresses: string[],
    fromBlock: number,
    toBlock: number
) => {
    const govBravoIface = new ethers.Interface(
        JSON.parse(daoHandler.decoder as string).abi
    )

    const logs = await provider.getLogs({
        fromBlock: fromBlock,
        toBlock: toBlock,
        address: JSON.parse(daoHandler.decoder as string).address,
        topics: [
            govBravoIface.getEventName('VoteCast'),
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
    logs: Log[],
    daoHandler: DAOHandlerWithDAO,
    voterAddress: string
) => {
    let success = true
    const govBravoIface = new ethers.Interface(
        JSON.parse(daoHandler.decoder as string).abi
    )
    const votes = await Promise.all(
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
                        externalId: BigInt(eventData.proposalId).toString(),
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

    return { success, votes, voterAddress }
}
