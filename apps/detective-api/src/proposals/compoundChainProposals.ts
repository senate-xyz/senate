import { InternalServerErrorException } from '@nestjs/common'
import { log_pd } from '@senate/axiom'
import { prisma } from '@senate/database'
import { ethers } from 'ethers'

const provider = new ethers.providers.JsonRpcProvider({
    url: String(process.env.PROVIDER_URL)
})

export const updateCompoundChainProposals = async (
    daoHandlerId: string,
    minBlockNumber: number
) => {
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

    if (!(await provider.blockNumber)) {
        log_pd.log({
            level: 'error',
            message: 'Could not get blockNumber. Node provider offline?'
        })
        return [{ daoHandlerId: daoHandlerId, response: 'nok' }]
    }

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

        const logs = await provider.getLogs({
            fromBlock: Number(minBlockNumber),
            address: daoHandler.decoder['address'],
            topics: [govBravoIface.getEventTopic('ProposalCreated')]
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

        for (let i = 0; i < proposals.length; i++) {
            const proposalCreatedTimestamp = (
                await provider.getBlock(proposals[i].txBlock)
            ).timestamp

            const votingStartsTimestamp =
                proposalCreatedTimestamp +
                (proposals[i].eventData.startBlock - proposals[i].txBlock) * 12
            const votingEndsTimestamp =
                proposalCreatedTimestamp +
                (proposals[i].eventData.endBlock - proposals[i].txBlock) * 12
            const title = await formatTitle(
                proposals[i].eventData.ipfsHash
                    ? proposals[i].eventData.ipfsHash
                    : proposals[i].eventData.description
            )
            const proposalUrl =
                daoHandler.decoder['proposalUrl'] + proposals[i].eventData.id
            const proposalOnChainId = Number(
                proposals[i].eventData.id
            ).toString()

            await prisma.proposal
                .upsert({
                    where: {
                        externalId_daoId: {
                            daoId: daoHandler.daoId,
                            externalId: proposalOnChainId
                        }
                    },
                    update: {
                        name: String(title).slice(0, 1024),
                        daoId: daoHandler.daoId,
                        daoHandlerId: daoHandler.id,
                        timeEnd: new Date(votingEndsTimestamp * 1000),
                        timeStart: new Date(votingStartsTimestamp * 1000),
                        timeCreated: new Date(proposalCreatedTimestamp * 1000),
                        data: {},
                        url: proposalUrl
                    },
                    create: {
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
                .then(async (r) => {
                    log_pd.log({
                        level: 'info',
                        message: `Upserted new proposal for ${daoHandler.dao.name} - ${daoHandler.type}`,
                        data: {
                            proposal: r
                        }
                    })
                    await prisma.dAOHandler.update({
                        where: {
                            id: daoHandler.id
                        },
                        data: {
                            lastChainProposalCreatedBlock:
                                proposals[i].txBlock + 1
                        }
                    })

                    return
                })
                .catch(async (e) => {
                    log_pd.log({
                        level: 'error',
                        message: `Could not upsert new proposal for ${daoHandler.dao.name} - ${daoHandler.type}`,
                        data: { proposal: proposals[i], error: e }
                    })
                    await prisma.dAOHandler.update({
                        where: {
                            id: daoHandler.id
                        },
                        data: {
                            lastChainProposalCreatedBlock: 0
                        }
                    })
                })
        }
    } catch (e) {
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
            result: [{ daoHandlerId: daoHandlerId, response: 'ok' }]
        }
    })

    return [{ daoHandlerId: daoHandlerId, response: 'ok' }]
}

const formatTitle = (text: string): string => {
    const temp = text.split('\n')[0]

    if (!temp) {
        console.log(text)
        return 'Title unavailable'
    }

    if (temp[0] === '#') {
        return temp.substring(2)
    }

    return temp
}
