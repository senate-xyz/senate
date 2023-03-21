import { log_pd } from '@senate/axiom'
import { DAOHandler } from '@senate/database'
import { Decoder } from '@senate/database'
import axios from 'axios'
import { ethers } from 'ethers'
import getAbi from '../../utils'

const IPFS_GATEWAY_URLS = [
    'https://ipfs.io/ipfs/',
    'https://ipfs.infura.io/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
    'https://gateway.pinata.cloud/ipfs/'
]

export const aaveProposals = async (
    provider: ethers.JsonRpcProvider,
    daoHandler: DAOHandler,
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
            new ethers.Interface(abi).getEvent('ProposalCreated').topicHash
        ]
    })

    const args = logs.map((log) => ({
        txBlock: log.blockNumber,
        txHash: log.transactionHash,
        eventData: new ethers.Interface(abi).parseLog({
            topics: log.topics as string[],
            data: log.data
        }).args
    }))

    const govContract = new ethers.Contract(
        (daoHandler.decoder as Decoder).address,
        abi,
        provider
    )

    const proposals = await Promise.all(
        args.map(async (arg) => {
            const proposalCreatedTimestamp = (
                await provider.getBlock(arg.txBlock)
            ).timestamp

            const votingStartsTimestamp =
                proposalCreatedTimestamp +
                (Number(arg.eventData.startBlock) - arg.txBlock) * 12
            const votingEndsTimestamp =
                proposalCreatedTimestamp +
                (Number(arg.eventData.endBlock) - arg.txBlock) * 12
            const title = await fetchTitleFromIPFS(arg.eventData.ipfsHash)
            const proposalUrl =
                (daoHandler.decoder as Decoder).proposalUrl + arg.eventData.id
            const proposalOnChainId = Number(arg.eventData.id).toString()

            const onchainProposal = await govContract.getProposalById(
                proposalOnChainId
            )

            const executorAbi = await getAbi(
                onchainProposal.executor,
                'ethereum'
            )

            const executorContract = new ethers.Contract(
                onchainProposal.executor,
                executorAbi,
                provider
            )

            const strategyAbi = await getAbi(
                onchainProposal.strategy,
                'ethereum'
            )

            const strategyContract = new ethers.Contract(
                onchainProposal.strategy,
                strategyAbi,
                provider
            )

            const totalVotingPowerAt =
                await strategyContract.getTotalVotingSupplyAt(arg.txBlock)

            const minQuorum = await executorContract.MINIMUM_QUORUM()
            const oneHundedWithPrecision =
                await executorContract.ONE_HUNDRED_WITH_PRECISION()

            const quorum =
                (totalVotingPowerAt * minQuorum) / oneHundedWithPrecision

            return {
                externalId: proposalOnChainId,
                name: String(title).slice(0, 1024),
                daoId: daoHandler.daoId,
                daoHandlerId: daoHandler.id,
                timeEnd: new Date(votingEndsTimestamp * 1000),
                timeStart: new Date(votingStartsTimestamp * 1000),
                timeCreated: new Date(proposalCreatedTimestamp * 1000),
                blockCreated: arg.txBlock,
                choices: ['For', 'Against'],
                scores: [
                    parseFloat(onchainProposal.forVotes),
                    parseFloat(onchainProposal.againstVotes)
                ],
                scoresTotal:
                    parseFloat(onchainProposal.forVotes) +
                    parseFloat(onchainProposal.againstVotes),
                quorum: Number(quorum),
                url: proposalUrl
            }
        })
    )

    return proposals
}

const fetchTitleFromIPFS = async (hexHash: string): Promise<string> => {
    let title = 'Unknown'
    try {
        let retries = 12
        let gatewayIndex = 0
        while (retries) {
            try {
                const response = await axios.get(
                    IPFS_GATEWAY_URLS[gatewayIndex] +
                        'f01701220' +
                        hexHash.substring(2)
                )

                if (!response.data || !response.data.title) {
                    log_pd.log({
                        level: 'warn',
                        message: `Could not find proposal title in response`,
                        responseData: response.data
                    })
                }

                title = response.data.title
                break
            } catch (e) {
                retries--

                if (!retries) {
                    throw e
                }

                gatewayIndex = (gatewayIndex + 1) % IPFS_GATEWAY_URLS.length
            }
        }
    } catch (e) {
        log_pd.log({
            level: 'warn',
            message: `Could not get proposal title`,
            hexHash: hexHash,
            url: IPFS_GATEWAY_URLS[0] + 'f01701220' + hexHash.substring(2),
            errorName: (e as Error).name,
            errorMessage: (e as Error).message,
            errorStack: (e as Error).stack
        })
    }

    return title
}
