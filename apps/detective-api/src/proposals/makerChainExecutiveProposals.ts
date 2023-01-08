/*
    @banteg's article on MakerDAO's governance was incredibly helpful in understanding
    how to fetch executive proposals. Thank you ser!

    https://medium.com/@banteg/deep-dive-into-makerdao-governance-437c89493203
*/

import { InternalServerErrorException } from '@nestjs/common'
import { log_pd, log_node } from '@senate/axiom'
import { prisma } from '@senate/database'
import axios from 'axios'
import { ethers } from 'ethers'
import moment, { ISO_8601 } from 'moment'

const provider = new ethers.providers.JsonRpcProvider({
    url: String(process.env.PROVIDER_URL)
})

const senateProvider = new ethers.providers.JsonRpcProvider({
    url: String(process.env.SENATE_NODE_URL)
})

export const updateMakerChainExecutiveProposals = async (
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
    const currentBlock = await senateProvider.blockNumber

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

        let logs
        if (minBlockNumber < (await provider.blockNumber) - 120)
            logs = await provider.getLogs({
                fromBlock: Number(minBlockNumber),
                address: daoHandler.decoder['address'],
                topics: [[voteMultipleActionsTopic, voteSingleActionTopic]]
            })
        else
            logs = await senateProvider.getLogs({
                fromBlock: Number(minBlockNumber),
                address: daoHandler.decoder['address'],
                topics: [[voteMultipleActionsTopic, voteSingleActionTopic]]
            })

        log_node.log({
            level: 'info',
            message: `getLogs`,
            data: {
                fromBlock: Number(minBlockNumber),
                address: daoHandler.decoder['address'],
                topics: [[voteMultipleActionsTopic, voteSingleActionTopic]]
            }
        })

        const spellAddressesSet = new Set<string>()
        for (let i = 0; i < logs.length; i++) {
            const log = logs[i]
            const eventArgs = iface.decodeEventLog('LogNote', log.data)

            log_pd.log({
                level: 'info',
                message: `Maker executive log ${i}`
            })

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

        proposals = Array.from(spellAddressesSet)

        log_pd.log({
            level: 'info',
            message: `Got proposals for ${daoHandler.dao.name} - ${daoHandler.type}`,
            data: {
                proposals: proposals
            }
        })

        const prismaData = await Promise.all(
            proposals.map(async (proposal) => {
                if (proposal == '0x0000000000000000000000000000000000000000')
                    return

                const res = await axios
                    .get('https://vote.makerdao.com/api/executive/' + proposal)
                    .catch(() => {
                        return { status: 404, data: {} }
                    })

                if (!res.data || res.status == 404) {
                    return
                }

                if (
                    !moment(
                        new Date(res.data.spellData.expiration),
                        ISO_8601
                    ).isValid() ||
                    !moment(new Date(res.data.date), ISO_8601).isValid() ||
                    !moment(new Date(res.data.date), ISO_8601).isValid()
                )
                    return

                return {
                    externalId: proposal,
                    name: res.data.title.slice(0, 1024),
                    daoId: daoHandler.daoId,
                    daoHandlerId: daoHandler.id,
                    timeEnd: new Date(res.data.spellData.expiration),
                    timeStart: new Date(res.data.date),
                    timeCreated: new Date(res.data.date),
                    data: {},
                    url: daoHandler.decoder['proposalUrl'] + proposal
                }
            })
        )

        await prisma.proposal
            .createMany({
                data: prismaData,
                skipDuplicates: true
            })
            .then(async (r) => {
                log_pd.log({
                    level: 'info',
                    message: `Upserted new proposals for ${daoHandler.dao.name} - ${daoHandler.type}`,
                    data: {
                        proposals: r,
                        lastChainProposalCreatedBlock: currentBlock
                    }
                })
                await prisma.dAOHandler.update({
                    where: {
                        id: daoHandler.id
                    },
                    data: {
                        lastChainProposalCreatedBlock: currentBlock
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

const getSlateYays = async (chiefContract: ethers.Contract, slate: string) => {
    const yays = []
    let count = 0

    while (true) {
        let spellAddress
        try {
            spellAddress = await chiefContract.slates(slate, count)
            log_node.log({
                level: 'info',
                message: `slates`,
                data: {
                    function: JSON.stringify(chiefContract.slates),
                    slate: slate,
                    count: count
                }
            })

            yays.push(spellAddress)
            count++
        } catch (e) {
            break
        }
    }

    return yays
}
