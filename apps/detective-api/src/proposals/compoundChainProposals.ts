import { InternalServerErrorException } from '@nestjs/common'
import { axiom } from '@senate/axiom'
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
        where: { id: daoHandlerId }
    })

    await axiom.datasets.ingestEvents(
        `proposal-detective-${process.env.DEPLOYMENT}`,
        [
            {
                event: 'updateCompoundChainProposals',
                details: `run`,
                item: { daoHandler: daoHandler, minBlockNumber: minBlockNumber }
            }
        ]
    )

    if (!(await provider.blockNumber)) {
        await axiom.datasets.ingestEvents(
            `proposal-detective-${process.env.DEPLOYMENT}`,
            [
                {
                    event: 'updateCompoundChainProposals',
                    details: `run`,
                    err: 'could not get provider.blockNumber'
                }
            ]
        )
        return [{ daoHandlerId: daoHandlerId, response: 'nok' }]
    }

    if (!daoHandler.decoder) {
        await axiom.datasets.ingestEvents(
            `proposal-detective-${process.env.DEPLOYMENT}`,
            [
                {
                    event: 'updateCompoundChainProposals',
                    details: `run`,
                    err: 'could not get daoHandler decoder'
                }
            ]
        )
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

            await axiom.datasets.ingestEvents(
                `proposal-detective-${process.env.DEPLOYMENT}`,
                [
                    {
                        event: 'updateCompoundChainProposals',
                        details: `new-proposal`,
                        item: { proposal: proposals[i] }
                    }
                ]
            )

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
                    await prisma.dAOHandler.update({
                        where: {
                            id: daoHandler.id
                        },
                        data: {
                            lastChainProposalCreatedBlock:
                                proposals[i].txBlock + 1
                        }
                    })
                    await axiom.datasets.ingestEvents(
                        `proposal-detective-${process.env.DEPLOYMENT}`,
                        [
                            {
                                event: 'updateCompoundChainProposals',
                                details: `new-proposal`,
                                item: { proposal: r }
                            }
                        ]
                    )
                    return
                })
                .catch(async (e) => {
                    await prisma.dAOHandler.update({
                        where: {
                            id: daoHandler.id
                        },
                        data: {
                            lastChainProposalCreatedBlock: 0
                        }
                    })
                    await axiom.datasets.ingestEvents(
                        `proposal-detective-${process.env.DEPLOYMENT}`,
                        [
                            {
                                event: 'updateCompoundChainProposals',
                                details: `new-proposal`,
                                err: JSON.stringify(e)
                            }
                        ]
                    )
                    console.log(e)
                })
        }
    } catch (e) {
        await axiom.datasets.ingestEvents(
            `proposal-detective-${process.env.DEPLOYMENT}`,
            [
                {
                    event: 'updateCompoundChainProposals',
                    details: `run`,
                    err: JSON.stringify(e)
                }
            ]
        )
        console.log(e)
        throw new InternalServerErrorException()
    }

    await axiom.datasets.ingestEvents(
        `proposal-detective-${process.env.DEPLOYMENT}`,
        [
            {
                event: 'updateCompoundChainProposals',
                details: `success`,
                item: {
                    proposals: proposals.length,
                    response: [{ daoHandlerId: daoHandlerId, response: 'ok' }]
                }
            }
        ]
    )

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
