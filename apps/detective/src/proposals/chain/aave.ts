import { log_node, log_pd } from '@senate/axiom'
import { DAOHandler } from '@senate/database'
import axios from 'axios'
import { ethers } from 'ethers'

const IPFS_GATEWAY_URLS = [
    'https://ipfs.io/ipfs/',
    'https://ipfs.infura.io/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
    'https://gateway.pinata.cloud/ipfs/'
]

export const aaveProposals = async (
    provider: ethers.providers.JsonRpcProvider,
    daoHandler: DAOHandler,
    minBlockNumber: number
) => {
    const govBravoIface = new ethers.utils.Interface(daoHandler.decoder['abi'])

    const logs = await provider.getLogs({
        fromBlock: Number(minBlockNumber),
        address: daoHandler.decoder['address'],
        topics: [govBravoIface.getEventTopic('ProposalCreated')]
    })

    log_node.log({
        level: 'info',
        message: `getLogs`,
        data: {
            fromBlock: Number(minBlockNumber),
            address: daoHandler.decoder['address'],
            topics: [govBravoIface.getEventTopic('ProposalCreated')]
        }
    })

    const args = logs.map((log) => ({
        txBlock: log.blockNumber,
        txHash: log.transactionHash,
        eventData: govBravoIface.parseLog({
            topics: log.topics,
            data: log.data
        }).args
    }))

    const proposals =
        (
            await Promise.all(
                args.map(async (arg) => {
                    const proposalCreatedTimestamp = (
                        await provider.getBlock(arg.txBlock)
                    ).timestamp

                    log_node.log({
                        level: 'info',
                        message: `getBlock`,
                        data: {
                            block: arg.txBlock
                        }
                    })
                    const votingStartsTimestamp =
                        proposalCreatedTimestamp +
                        (arg.eventData.startBlock - arg.txBlock) * 12
                    const votingEndsTimestamp =
                        proposalCreatedTimestamp +
                        (arg.eventData.endBlock - arg.txBlock) * 12
                    const title = await fetchTitleFromIPFS(
                        arg.eventData.ipfsHash
                    )
                    const proposalUrl =
                        daoHandler.decoder['proposalUrl'] + arg.eventData.id
                    const proposalOnChainId = Number(
                        arg.eventData.id
                    ).toString()

                    return {
                        externalId: proposalOnChainId,
                        name: String(title).slice(0, 1024),
                        daoId: daoHandler.daoId,
                        daoHandlerId: daoHandler.id,
                        timeEnd: new Date(votingEndsTimestamp * 1000),
                        timeStart: new Date(votingStartsTimestamp * 1000),
                        timeCreated: new Date(proposalCreatedTimestamp * 1000),
                        data: {},
                        url: proposalUrl
                    }
                })
            )
        ).filter((n) => n) ?? []

    const lastBlock = (await provider.getBlockNumber()) ?? 0

    return { proposals, lastBlock }
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

                if (!response || !response.data || !response.data.title) {
                    log_pd.log({
                        level: 'error',
                        message: `Could not find proposal title in response`,
                        data: {
                            response: response
                        }
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

                log_pd.log({
                    level: 'warn',
                    message: `Failed fetching proposal data from ${IPFS_GATEWAY_URLS[gatewayIndex]}. Retrying...`,
                    data: {}
                })
            }
        }
    } catch (e) {
        log_pd.log({
            level: 'error',
            message: `Could not get proposal title`,
            data: {
                hexHash: hexHash,
                url: IPFS_GATEWAY_URLS[0] + 'f01701220' + hexHash.substring(2),
                error: e
            }
        })
    }

    return title
}
