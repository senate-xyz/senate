import { log_pd } from '@senate/axiom'
import { DAOHandlerWithDAO, Decoder, prisma } from '@senate/database'
import { ethers } from 'ethers'
import getAbi from '../../utils'

export const getENSVotes = async (
    provider: ethers.JsonRpcProvider,
    daoHandler: DAOHandlerWithDAO,
    voterAddresses: string[],
    fromBlock: number,
    toBlock: number
) => {
    const abi = await getAbi(
        (daoHandler.decoder as Decoder).address,
        'ethereum'
    )

    const logs = await provider.getLogs({
        fromBlock: fromBlock,
        toBlock: toBlock,
        address: (daoHandler.decoder as Decoder).address,
        topics: [
            new ethers.Interface(abi).getEvent('VoteCast').topicHash,
            voterAddresses.map((voterAddress) =>
                ethers.hexlify(ethers.zeroPadValue(voterAddress, 32))
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
    logs: ethers.Log[],
    daoHandler: DAOHandlerWithDAO,
    voterAddress: string,
    abi: string
) => {
    let success = true

    const votes =
        (
            await Promise.all(
                logs.map(async (log) => {
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
                                externalid: BigInt(
                                    eventData.proposalId
                                ).toString(),
                                daoid: daoHandler.daoid,
                                daohandlerid: daoHandler.id
                            }
                        })

                        if (!proposal) {
                            success = false
                            return null
                        }

                        return {
                            blockcreated: log.blockNumber,
                            voteraddress: ethers.getAddress(voterAddress),
                            daoid: daoHandler.daoid,
                            proposalid: proposal.id,
                            daohandlerid: daoHandler.id,
                            choice: String(eventData.support) ? 1 : 3,
                            reason: String(eventData.reason),
                            votingpower: parseFloat(eventData.weight),
                            proposalactive:
                                proposal.timeend.getTime() >
                                new Date().getTime()
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
        ).filter((n) => n) ?? []

    return { success, votes, voteraddress: voterAddress }
}
