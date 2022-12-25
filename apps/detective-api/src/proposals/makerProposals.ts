import { InternalServerErrorException, Logger } from '@nestjs/common'
import { DAOHandler, ProposalType } from '@senate/common-types'
import { prisma } from '@senate/database'
import axios from 'axios'
import { ethers } from 'ethers'

const provider = new ethers.providers.JsonRpcProvider({
    url: String(process.env.PROVIDER_URL),
})

const logger = new Logger('MakerExecutiveProposals')

export const updateMakerProposals = async (daoHandler: DAOHandler) => {
    if (!daoHandler.decoder) {
        console.log('Decoder nok.')
        return
    }

    logger.log(
        `Searching executive proposals from block ${daoHandler.decoder['latestProposalBlock']} ...`
    )
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
            fromBlock: daoHandler.decoder['latestProposalBlock'],
            address: daoHandler.decoder['address'],
            topics: [[voteMultipleActionsTopic, voteSingleActionTopic]],
        })

        const spellAddressesSet = new Set<string>()
        for (let i = 0; i < logs.length; i++) {
            console.log(`maker event ${i} out of ${logs.length}`)

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
            logger.log(`inserting spell address ${spellAddresses[i]}`)

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
                // logger.warn(
                //     `Maker API did not return any data for spell ${spellAddresses[i]}`
                // )
                continue
            }

            const proposal = await prisma.proposal.upsert({
                where: {
                    externalId_daoId: {
                        daoId: daoHandler.daoId,
                        externalId: spellAddresses[i],
                    },
                },
                update: {},
                create: {
                    externalId: spellAddresses[i],
                    name: response.data.title,
                    daoId: daoHandler.daoId,
                    daoHandlerId: daoHandler.id,
                    proposalType: ProposalType.MAKER_EXECUTIVE,
                    timeEnd: new Date(
                        calculateVotingPeriodEndDate(response.data.spellData)
                    ),
                    timeStart: new Date(response.data.date),
                    timeCreated: new Date(response.data.date),
                    data: {},
                    url: daoHandler.decoder['proposalUrl'] + spellAddresses[i],
                },
            })

            logger.log('inserted executive proposal with id ' + proposal.id)
        }

        const decoder = daoHandler.decoder
        decoder['latestProposalBlock'] = latestBlock

        await prisma.dAOHandler.update({
            where: {
                id: daoHandler.id,
            },
            data: {
                decoder: decoder,
            },
        })
    } catch (err) {
        logger.error('Error while updating maker executive proposals', err)
        throw new InternalServerErrorException()
    }

    logger.log('\n\n')
    logger.log(`inserted ${spellAddresses.length} maker executive proposals`)
    logger.log('======================================================\n\n')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const calculateVotingPeriodEndDate = (spellData: any) => {
    return spellData.hasBeenCast
        ? spellData.dateExecuted
        : spellData.hasBeenScheduled
        ? spellData.nextCastTime
        : spellData.expiration
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
        } catch (err) {
            break
        }
    }

    return yays
}
