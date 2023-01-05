/*
    @banteg's article on MakerDAO's governance was incredibly helpful in understanding
    how to fetch executive proposals. Thank you ser!

    https://medium.com/@banteg/deep-dive-into-makerdao-governance-437c89493203
*/

import { InternalServerErrorException } from '@nestjs/common'
import { axiom } from '@senate/axiom'
import { prisma } from '@senate/database'
import axios from 'axios'
import { ethers } from 'ethers'

const provider = new ethers.providers.JsonRpcProvider({
    url: String(process.env.PROVIDER_URL)
})

export const updateMakerChainPolls = async (
    daoHandlerId: string,
    minBlockNumber: number
) => {
    const daoHandler = await prisma.dAOHandler.findFirst({
        where: { id: daoHandlerId }
    })

    await axiom.datasets.ingestEvents(
        `proposal-detective-${process.env.AXIOM_DEPLOYMENT}`,
        [
            {
                event: 'updateMakerChainPolls',
                details: `run`,
                item: { daoHandler: daoHandler, minBlockNumber: minBlockNumber }
            }
        ]
    )

    if (!(await provider.blockNumber)) {
        await axiom.datasets.ingestEvents(
            `proposal-detective-${process.env.AXIOM_DEPLOYMENT}`,
            [
                {
                    event: 'updateMakerChainPolls',
                    details: `run`,
                    err: 'could not get provider.blockNumber'
                }
            ]
        )
        return [{ daoHandlerId: daoHandlerId, response: 'nok' }]
    }

    if (!daoHandler.decoder) {
        await axiom.datasets.ingestEvents(
            `proposal-detective-${process.env.AXIOM_DEPLOYMENT}`,
            [
                {
                    event: 'updateMakerChainPolls',
                    details: `run`,
                    err: 'could not get daoHandler decoder'
                }
            ]
        )
        return [{ daoHandlerId: daoHandlerId, response: 'nok' }]
    }

    let proposals

    try {
        const pollingContractIface = new ethers.utils.Interface(
            daoHandler.decoder['abi_create']
        )

        const logs = await provider.getLogs({
            fromBlock: Number(minBlockNumber),
            address: daoHandler.decoder['address_create'],
            topics: [pollingContractIface.getEventTopic('PollCreated')]
        })

        proposals = logs.map((log) => ({
            txBlock: log.blockNumber,
            txHash: log.transactionHash,
            eventData: pollingContractIface.parseLog({
                topics: log.topics,
                data: log.data
            }).args
        }))

        for (let i = 0; i < proposals.length; i++) {
            const proposalCreatedTimestamp = Number(
                proposals[i].eventData.blockCreated
            )

            const votingStartsTimestamp = Number(
                proposals[i].eventData.startDate
            )
            const votingEndsTimestamp = Number(proposals[i].eventData.endDate)
            const title = await getProposalTitle(proposals[i].eventData.url)
            const proposalUrl =
                daoHandler.decoder['proposalUrl'] +
                proposals[i].eventData.multiHash.substring(0, 7)
            const proposalOnChainId = Number(
                proposals[i].eventData.pollId
            ).toString()

            await axiom.datasets.ingestEvents(
                `proposal-detective-${process.env.AXIOM_DEPLOYMENT}`,
                [
                    {
                        event: 'updateMakerChainPolls',
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
                        `proposal-detective-${process.env.AXIOM_DEPLOYMENT}`,
                        [
                            {
                                event: 'updateMakerChainPolls',
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
                        `proposal-detective-${process.env.AXIOM_DEPLOYMENT}`,
                        [
                            {
                                event: 'updateMakerChainPolls',
                                details: `new-proposal`,
                                err: JSON.stringify(e)
                            }
                        ]
                    )
                    console.log(e)
                    return
                })
        }
    } catch (e) {
        await axiom.datasets.ingestEvents(
            `proposal-detective-${process.env.AXIOM_DEPLOYMENT}`,
            [
                {
                    event: 'updateMakerChainPolls',
                    details: `run`,
                    err: JSON.stringify(e)
                }
            ]
        )
        console.log(e)
        throw new InternalServerErrorException()
    }
    await axiom.datasets.ingestEvents(
        `proposal-detective-${process.env.AXIOM_DEPLOYMENT}`,
        [
            {
                event: 'updateMakerChainPolls',
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
    const temp = text.split('summary:')[0].split('title: ')[1]

    return temp
}

const getProposalTitle = async (url: string): Promise<unknown> => {
    let title
    try {
        const response = await axios.get(url)
        title = formatTitle(response.data)
    } catch (e) {
        title = 'Unknown'
        await axiom.datasets.ingestEvents(
            `proposal-detective-${process.env.AXIOM_DEPLOYMENT}`,
            [
                {
                    event: 'updateMakerChainPolls',
                    details: `fetch-ipfs`,
                    err: JSON.stringify(e)
                }
            ]
        )
        console.log(e)
    }

    return title
}
