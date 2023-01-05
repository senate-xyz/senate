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

export const updateMakerChainExecutiveProposals = async (
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
                event: 'updateMakerChainExecutiveProposals',
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
                    event: 'updateMakerChainExecutiveProposals',
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
                    event: 'updateMakerChainExecutiveProposals',
                    details: `run`,
                    err: 'could not get daoHandler decoder'
                }
            ]
        )
        return [{ daoHandlerId: daoHandlerId, response: 'nok' }]
    }

    let spellAddresses

    try {
        const iface = new ethers.utils.Interface(daoHandler.decoder['abi'])
        const chiefContract = new ethers.Contract(
            daoHandler.decoder['address'],
            daoHandler.decoder['abi'],
            provider
        )

        const voteMultipleActionsTopic =
            '0xed08132900000000000000000000000000000000000000000000000000000000'
        const voteSingleActionTopic =
            '0xa69beaba00000000000000000000000000000000000000000000000000000000'

        const latestBlock = await provider.getBlockNumber()

        const logs = await provider.getLogs({
            fromBlock: Number(minBlockNumber),
            address: daoHandler.decoder['address'],
            topics: [[voteMultipleActionsTopic, voteSingleActionTopic]]
        })

        const spellAddressesSet = new Set<string>()
        for (let i = 0; i < logs.length; i++) {
            console.log(
                `[EXECUTIVE PROPOSAL] maker event ${i} out of ${logs.length}`
            )

            const log = logs[i]
            const eventArgs = iface.decodeEventLog('LogNote', log.data)

            const decodedFunctionData =
                log.topics[0] === voteSingleActionTopic
                    ? iface.decodeFunctionData('vote(bytes32)', eventArgs.fax)
                    : iface.decodeFunctionData('vote(address[])', eventArgs.fax)

            const spells: string[] =
                decodedFunctionData.yays !== undefined
                    ? decodedFunctionData.yays
                    : await getSlateYays(
                          chiefContract,
                          decodedFunctionData.slate
                      )

            spells.forEach((spell) => {
                spellAddressesSet.add(spell)
            })
        }

        spellAddresses = Array.from(spellAddressesSet)

        for (let i = 0; i < spellAddresses.length; i++) {
            await axiom.datasets.ingestEvents(
                `proposal-detective-${process.env.DEPLOYMENT}`,
                [
                    {
                        event: 'updateMakerChainExecutiveProposals',
                        details: `new-proposal`,
                        item: { proposal: spellAddresses[i] }
                    }
                ]
            )

            if (
                spellAddresses[i] ==
                '0x0000000000000000000000000000000000000000'
            )
                continue

            const response = await axios
                .get(
                    'https://vote.makerdao.com/api/executive/' +
                        spellAddresses[i]
                )
                .catch(() => {
                    return { status: 404, data: {} }
                })

            if (!response.data || response.status == 404) {
                await axiom.datasets.ingestEvents(
                    `proposal-detective-${process.env.DEPLOYMENT}`,
                    [
                        {
                            event: 'updateMakerChainExecutiveProposals',
                            details: `new-proposal`,
                            err: `Maker API did not return any data for spell ${spellAddresses[i]}`
                        }
                    ]
                )

                continue
            }

            await prisma.proposal
                .upsert({
                    where: {
                        externalId_daoId: {
                            daoId: daoHandler.daoId,
                            externalId: spellAddresses[i]
                        }
                    },
                    update: {
                        name: response.data.title.slice(0, 1024),
                        daoId: daoHandler.daoId,
                        daoHandlerId: daoHandler.id,
                        timeEnd: new Date(response.data.spellData.expiration),
                        timeStart: new Date(response.data.date),
                        timeCreated: new Date(response.data.date),
                        data: {},
                        url:
                            daoHandler.decoder['proposalUrl'] +
                            spellAddresses[i]
                    },
                    create: {
                        externalId: spellAddresses[i],
                        name: response.data.title.slice(0, 1024),
                        daoId: daoHandler.daoId,
                        daoHandlerId: daoHandler.id,
                        timeEnd: new Date(response.data.spellData.expiration),
                        timeStart: new Date(response.data.date),
                        timeCreated: new Date(response.data.date),
                        data: {},
                        url:
                            daoHandler.decoder['proposalUrl'] +
                            spellAddresses[i]
                    }
                })
                .then(async (r) => {
                    await prisma.dAOHandler.update({
                        where: {
                            id: daoHandler.id
                        },
                        data: {
                            lastChainProposalCreatedBlock: latestBlock
                        }
                    })
                    await axiom.datasets.ingestEvents(
                        `proposal-detective-${process.env.DEPLOYMENT}`,
                        [
                            {
                                event: 'updateMakerChainExecutiveProposals',
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
                                event: 'updateMakerChainExecutiveProposals',
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
                    event: 'updateMakerChainExecutiveProposals',
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
                event: 'updateMakerChainExecutiveProposals',
                details: `success`,
                item: {
                    proposals: spellAddresses.length,
                    response: [{ daoHandlerId: daoHandlerId, response: 'ok' }]
                }
            }
        ]
    )

    return [{ daoHandlerId: daoHandlerId, response: 'ok' }]
}

const getSlateYays = async (chiefContract: ethers.Contract, slate: string) => {
    const yays = []
    let count = 0

    while (true) {
        let spellAddress
        try {
            spellAddress = await chiefContract.slates(slate, count)
            yays.push(spellAddress)
            count++
        } catch (e) {
            await axiom.datasets.ingestEvents(
                `proposal-detective-${process.env.DEPLOYMENT}`,
                [
                    {
                        event: 'updateMakerChainExecutiveProposals',
                        details: `getslates`,
                        err: JSON.stringify(e)
                    }
                ]
            )
            console.log(e)
            break
        }
    }

    return yays
}
