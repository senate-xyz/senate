import { ethers } from 'ethers'
import { Logger, InternalServerErrorException } from '@nestjs/common'
import { prisma } from '@senate/database'
import { Proposal, DAOHandler, DAOHandlerType } from '@senate/common-types'
import { hexZeroPad } from 'ethers/lib/utils'

const provider = new ethers.providers.JsonRpcProvider({
    url: String(process.env.PROVIDER_URL),
})

const logger = new Logger('MakerExecutiveVotes')

export const updateMakerVotes = async (
    daoHandler: DAOHandler,
    voterAddress: string
) => {
    logger.log(`Updating Maker votes for ${voterAddress}`)
    let votedSpells

    try {
        const voterLatestVoteBlock =
            await prisma.voterLatestVoteBlock.findFirst({
                where: {
                    voterAddress: voterAddress,
                    daoHandlerId: daoHandler.id,
                },
            })

        const latestVoteBlock = voterLatestVoteBlock
            ? Number(voterLatestVoteBlock.latestVoteBlock)
            : 0
        const currentBlock = await provider.getBlockNumber()

        votedSpells = await getVotes(daoHandler, voterAddress, latestVoteBlock)
        if (!votedSpells) return

        for (const votedSpellAddress of votedSpells) {
            const proposal = await prisma.proposal.findFirst({
                where: {
                    externalId: votedSpellAddress,
                    daoId: daoHandler.daoId,
                    daoHandlerId: daoHandler.id,
                },
            })

            if (!proposal) {
                console.log(
                    `MKR Executive proposal with externalId ${votedSpellAddress} does not exist in DB`
                )
                continue
            }

            await prisma.vote.upsert({
                where: {
                    voterAddress_daoId_proposalId: {
                        voterAddress: voterAddress,
                        daoId: daoHandler.daoId,
                        proposalId: proposal.id,
                    },
                },
                update: {},
                create: {
                    voterAddress: voterAddress,
                    daoId: daoHandler.daoId,
                    proposalId: proposal.id,
                    daoHandlerId: daoHandler.id,
                    options: {
                        create: {
                            option: '1',
                            optionName: 'Yes',
                        },
                    },
                },
            })

            await prisma.voterLatestVoteBlock.upsert({
                where: {
                    voterAddress_daoHandlerId: {
                        voterAddress: voterAddress,
                        daoHandlerId: daoHandler.id,
                    },
                },
                update: {
                    latestVoteBlock: currentBlock,
                },
                create: {
                    voterAddress: voterAddress,
                    daoHandlerId: daoHandler.id,
                    latestVoteBlock: currentBlock,
                },
            })
        }
    } catch (err) {
        logger.error('Error while updating maker executive proposals', err)
        throw new InternalServerErrorException()
    }

    console.log(`updated ${votedSpells.length} maker executive votes`)
}

const getVotes = async (
    daoHandler: DAOHandler,
    voterAddress: string,
    latestVoteBlock: number
): Promise<string[]> => {
    if (!daoHandler.decoder) return []
    if (!Array.isArray(daoHandler.decoder)) return []

    const iface = new ethers.utils.Interface(daoHandler.decoder['abi'])
    const chiefContract = new ethers.Contract(
        daoHandler.decoder['address'],
        daoHandler.decoder['abi'],
        provider
    )

    if (daoHandler.type != DAOHandlerType.MAKER_EXECUTIVE) return []

    const voteMultipleActionsTopic =
        '0xed08132900000000000000000000000000000000000000000000000000000000'
    const voteSingleActionTopic =
        '0xa69beaba00000000000000000000000000000000000000000000000000000000'
    const voterAddressTopic = '0x' + '0'.repeat(24) + voterAddress.substring(2)
    console.log('\n')
    console.log(voterAddressTopic, voterAddressTopic.length)
    const tmp = hexZeroPad(voterAddress, 32)
    console.log(tmp, tmp.length)
    console.log('\n')

    const logs = await provider.getLogs({
        fromBlock: latestVoteBlock,
        address: daoHandler.decoder['address'],
        topics: [
            [voteMultipleActionsTopic, voteSingleActionTopic],
            voterAddressTopic,
        ],
    })

    const spellAddressesSet = new Set<string>()
    for (let i = 0; i < logs.length; i++) {
        const log = logs[i]
        const eventArgs = iface.decodeEventLog('LogNote', log.data)

        const decodedFunctionData =
            log.topics[0] === voteSingleActionTopic
                ? iface.decodeFunctionData('vote(bytes32)', eventArgs.fax)
                : iface.decodeFunctionData('vote(address[])', eventArgs.fax)

        const spells: string[] =
            decodedFunctionData.yays !== undefined
                ? decodedFunctionData.yays
                : await getSlateYays(chiefContract, decodedFunctionData.slate)

        spells.forEach((spell) => {
            spellAddressesSet.add(spell)
        })
    }

    return Array.from(spellAddressesSet)
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
