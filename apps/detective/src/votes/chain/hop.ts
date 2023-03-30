import { log_pd } from '@senate/axiom'
import { DAOHandlerWithDAO, Decoder, prisma } from '@senate/database'
import { ethers } from 'ethers'
import getAbi from '../../utils'

interface DecodedLog {
    txBlock: number
    txHash: string
    eventData: ethers.Result
}

export const getHopVotes = async (
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

    const decodedLogs: DecodedLog[] = logs.map((log) => ({
        txBlock: log.blockNumber,
        txHash: log.transactionHash,
        eventData: new ethers.Interface(abi).parseLog({
            topics: log.topics as string[],
            data: log.data
        }).args
    }))

    const result = await Promise.all(
        voterAddresses.map((voterAddress) => {
            const voterLogs = decodedLogs.filter(
                (log) =>
                    log.eventData.voter.toLowerCase() ===
                    voterAddress.toLowerCase()
            )
            return getVotesForVoter(voterLogs, daoHandler, voterAddress)
        })
    )

    return result
}

export const getVotesForVoter = async (
    voterLogs: DecodedLog[],
    daoHandler: DAOHandlerWithDAO,
    voterAddress: string
) => {
    let success = true

    const votes =
        (
            await Promise.all(
                voterLogs.map(async (log) => {
                    try {
                        const proposal = await prisma.proposal.findFirst({
                            where: {
                                externalid: BigInt(
                                    log.eventData.proposalId
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
                            blockcreated: log.txBlock,
                            voteraddress: ethers.getAddress(voterAddress),
                            daoid: daoHandler.daoid,
                            proposalid: proposal.id,
                            daohandlerid: daoHandler.id,
                            choice: String(log.eventData.support) ? 1 : 3,
                            reason: String(log.eventData.reason),
                            votingpower: parseFloat(log.eventData.weight),
                            proposalactive:
                                proposal.timeend.getTime() >
                                new Date().getTime()
                        }
                    } catch (e) {
                        log_pd.log({
                            level: 'error',
                            message: `Error fetching votes for ${voterAddress} - ${daoHandler.dao.name} - ${daoHandler.type}`,
                            event: log.eventData,
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
