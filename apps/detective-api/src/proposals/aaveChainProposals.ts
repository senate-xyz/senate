import { InternalServerErrorException } from '@nestjs/common'
import { log_pd, log_node } from '@senate/axiom'
import { prisma } from '@senate/database'
import axios from 'axios'
import { ethers } from 'ethers'

const provider = new ethers.providers.JsonRpcProvider({
    url: String(process.env.PROVIDER_URL)
})

const senateProvider = new ethers.providers.JsonRpcProvider({
    url: String(process.env.SENATE_NODE_URL)
})

export const updateAaveChainProposals = async (
    daoHandlerId: string,
    minBlockNumber: number
) => {
    let response = 'ok'
    const daoHandler = await prisma.dAOHandler.findFirst({
        where: { id: daoHandlerId },
        include: { dao: true }
    })
    log_pd.log({
        level: 'info',
        message: `New proposals update for ${daoHandler.dao.name} - ${daoHandler.type}`,
        data: {
            daoHandlerId: daoHandlerId,
            minBlockNumber: minBlockNumber
        }
    })

    if (!daoHandler.decoder) {
        log_pd.log({
            level: 'error',
            message: 'Could not get daoHandler decoder'
        })
        return [{ daoHandlerId: daoHandlerId, response: 'nok' }]
    }

    let proposals

    try {
        const govBravoIface = new ethers.utils.Interface(
            daoHandler.decoder['abi']
        )
        let logs
        if (minBlockNumber < (await provider.blockNumber) - 120)
            logs = await provider.getLogs({
                fromBlock: Number(minBlockNumber),
                address: daoHandler.decoder['address'],
                topics: [govBravoIface.getEventTopic('ProposalCreated')]
            })
        else
            logs = await senateProvider.getLogs({
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

        proposals = logs.map((log) => ({
            txBlock: log.blockNumber,
            txHash: log.transactionHash,
            eventData: govBravoIface.parseLog({
                topics: log.topics,
                data: log.data
            }).args
        }))

        log_pd.log({
            level: 'info',
            message: `Got proposals for ${daoHandler.dao.name} - ${daoHandler.type}`,
            data: {
                proposals: proposals
            }
        })

        const prismaData = await Promise.all(
            proposals.map(async (proposal) => {
                const proposalCreatedTimestamp = (
                    await provider.getBlock(proposal.txBlock)
                ).timestamp

                log_node.log({
                    level: 'info',
                    message: `getBlock`,
                    data: {
                        block: proposal.txBlock
                    }
                })
                const votingStartsTimestamp =
                    proposalCreatedTimestamp +
                    (proposal.eventData.startBlock - proposal.txBlock) * 12
                const votingEndsTimestamp =
                    proposalCreatedTimestamp +
                    (proposal.eventData.endBlock - proposal.txBlock) * 12
                const title = await getProposalTitle(
                    daoHandler.decoder['address'],
                    proposal.eventData.ipfsHash
                        ? proposal.eventData.ipfsHash
                        : proposal.eventData.description
                )
                const proposalUrl =
                    daoHandler.decoder['proposalUrl'] + proposal.eventData.id
                const proposalOnChainId = Number(
                    proposal.eventData.id
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

        await prisma.proposal
            .createMany({
                data: prismaData,
                skipDuplicates: true
            })
            .then(async (r) => {
                const lastChainProposalCreatedBlock =
                    Math.max(...proposals.map((proposal) => proposal.txBlock)) +
                    1

                log_pd.log({
                    level: 'info',
                    message: `Upserted new proposals for ${daoHandler.dao.name} - ${daoHandler.type}`,
                    data: {
                        proposals: r,
                        lastChainProposalCreatedBlock:
                            lastChainProposalCreatedBlock
                    }
                })
                await prisma.dAOHandler.update({
                    where: {
                        id: daoHandler.id
                    },
                    data: {
                        lastChainProposalCreatedBlock:
                            lastChainProposalCreatedBlock
                    }
                })

                return
            })
            .catch(async (e) => {
                response = 'nok'
                log_pd.log({
                    level: 'error',
                    message: `Could not upsert new proposals for ${daoHandler.dao.name} - ${daoHandler.type}`,
                    data: { proposals: proposals, error: e }
                })
            })
    } catch (e) {
        response = 'nok'
        log_pd.log({
            level: 'error',
            message: `Could not get new proposals for ${daoHandler.dao.name} - ${daoHandler.type}`,
            data: {
                error: e
            }
        })
        throw new InternalServerErrorException()
    }

    log_pd.log({
        level: 'info',
        message: `Succesfully updated proposals for ${daoHandler.dao.name} - ${daoHandler.type}`,
        data: {
            result: [{ daoHandlerId: daoHandlerId, response: response }]
        }
    })

    return [{ daoHandlerId: daoHandlerId, response: response }]
}

const fetchProposalInfoFromIPFS = async (
    hexHash: string
): Promise<{ title: string }> => {
    let title
    try {
        const response = await axios.get(
            process.env.IPFS_GATEWAY_URL + 'f01701220' + hexHash.substring(2)
        )
        title = response.data.title
    } catch (e) {
        title = 'Unknown'

        log_pd.log({
            level: 'error',
            message: `Could not get proposal title`,
            data: {
                hexHash: hexHash,
                url:
                    process.env.IPFS_GATEWAY_URL +
                    'f01701220' +
                    hexHash.substring(2),

                error: e
            }
        })
    }

    return title
}

const formatTitle = async (text: string): Promise<string> => {
    const temp = text.split('\n')[0]

    if (!temp) {
        return 'Title unavailable'
    }

    if (temp[0] === '#') {
        return temp.substring(2)
    }

    return temp
}

const getProposalTitle = async (
    daoAddress: string,
    text: string
): Promise<unknown> => {
    if (daoAddress === '0xEC568fffba86c094cf06b22134B23074DFE2252c') {
        // Aave
        return await fetchProposalInfoFromIPFS(text)
    } else {
        return formatTitle(text)
    }
}
