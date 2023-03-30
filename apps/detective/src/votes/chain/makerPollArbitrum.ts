import { DAOHandler, prisma, Proposal, Decoder } from '@senate/database'
import { ethers } from 'ethers'
import getAbi from '../../utils'

interface DecodedLog {
    txBlock: number
    txHash: string
    eventData: ethers.Result
}

export const getMakerPollVotesFromArbitrum = async (
    provider: ethers.JsonRpcProvider,
    daoHandler: DAOHandler,
    voterAddresses: string[],
    fromBlock: number,
    toBlock: number
) => {
    const abi = await getAbi(
        (daoHandler.decoder as Decoder).address_vote,
        'arbitrum'
    )

    const logs = await provider.getLogs({
        fromBlock: fromBlock,
        toBlock: toBlock,
        address: (daoHandler.decoder as Decoder).address_vote,
        topics: [
            new ethers.Interface(abi).getEvent('Voted').topicHash,
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
    daoHandler: DAOHandler,
    voterAddress: string
) => {
    let success = true

    const uniquePollIds: Set<string> = new Set(
        voterLogs.map((log) => BigInt(log.eventData.pollId).toString())
    )

    const proposals = await prisma.proposal.findMany({
        where: {
            externalid: {
                in: Array.from(uniquePollIds)
            },
            daoid: daoHandler.daoid
        }
    })

    if (proposals.length < uniquePollIds.size) {
        success = false
        return { success, votes: [], voteraddress: voterAddress }
    }

    const proposalsMap: Map<string, Proposal> = new Map(
        proposals.map((proposal) => {
            return [proposal.externalid, proposal]
        })
    )

    const votes = await formatVotes(voterLogs, proposalsMap)

    return { success, votes, voteraddress: voterAddress }
}

const formatVotes = async (
    decodedLogs: DecodedLog[],
    proposalsMap: Map<string, Proposal>
) => {
    return decodedLogs.map((log) => {
        const proposal = proposalsMap.get(
            BigInt(log.eventData.pollId).toString()
        )
        return {
            blockcreated: log.txBlock,
            voteraddress: log.eventData.voter,
            daoid: proposal.daoid,
            proposalid: proposal.id,
            daohandlerid: proposal.daohandlerid,
            choice: BigInt(log.eventData.optionId).toString() ? 1 : 2,
            reason: '',
            votingpower: 0,
            proposalactive: proposal.timeend.getTime() > new Date().getTime()
        }
    })
}
