import { log_node, log_pd } from '@senate/axiom'
import { DAOHandler, prisma } from '@senate/database'
import { ethers } from 'ethers'
import { hexZeroPad } from 'ethers/lib/utils'

export const getMakerExecutiveVotes = async (
    provider: ethers.providers.JsonRpcProvider,
    daoHandler: DAOHandler,
    voterAddresses: string[],
    fromBlock: number,
    toBlock: number
) => {
    const voteMultipleActionsTopic =
        '0xed08132900000000000000000000000000000000000000000000000000000000'
    const voteSingleActionTopic =
        '0xa69beaba00000000000000000000000000000000000000000000000000000000'

    const logs = await provider.getLogs({
        fromBlock: fromBlock,
        toBlock: toBlock,
        address: daoHandler.decoder['address'],
        topics: [
            [voteMultipleActionsTopic, voteSingleActionTopic],
            voterAddresses.map((voterAddress) => hexZeroPad(voterAddress, 32))
        ]
    })

    log_node.log({
        level: 'info',
        message: `getLogs`,
        data: {
            fromBlock: fromBlock,
            toBlock: toBlock,
            address: daoHandler.decoder['address'],
            topics: [
                [voteMultipleActionsTopic, voteSingleActionTopic],
                voterAddresses.map((voterAddress) =>
                    hexZeroPad(voterAddress, 32)
                )
            ]
        }
    })

    const result = await Promise.all(
        voterAddresses.map((voterAddress) => {
            return getVotesForVoter(logs, daoHandler, voterAddress, provider)
        })
    )

    return result
}

export const getVotesForVoter = async (
    logs,
    daoHandler,
    voterAddress: string,
    provider
) => {
    let success = true

    const voteSingleActionTopic =
        '0xa69beaba00000000000000000000000000000000000000000000000000000000'
    const iface = new ethers.utils.Interface(daoHandler.decoder['abi'])
    const chiefContract = new ethers.Contract(
        daoHandler.decoder['address'],
        daoHandler.decoder['abi'],
        provider
    )
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

    const intermediaryVotes = Array.from(spellAddressesSet)
    const votes =
        (
            await Promise.all(
                intermediaryVotes.map(async (vote) => {
                    try {
                        const proposal = await prisma.proposal.findFirst({
                            where: {
                                externalId: vote,
                                daoId: daoHandler.daoId,
                                daoHandlerId: daoHandler.id
                            }
                        })

                        //missing proposal, force sync from infura
                        if (!proposal) {
                            if (
                                vote !=
                                '0x0000000000000000000000000000000000000000' //except this one because we know it's a bad proposal and will always trigger reset
                            )
                                success = false

                            log_pd.log({
                                level: 'warn',
                                message: `Proposal does not exist while updating votes for ${voterAddress} in ${daoHandler.id} - ${daoHandler.type}. Resetting newLastVoteBlock.`,
                                data: {
                                    externalId: vote
                                }
                            })

                            return
                        }

                        return {
                            voterAddress: voterAddress,
                            daoId: daoHandler.daoId,
                            proposalId: proposal.id,
                            daoHandlerId: daoHandler.id,
                            choiceId: '1',
                            choice: 'Yes'
                        }
                    } catch (e) {
                        log_pd.log({
                            level: 'error',
                            message: `Get votes error for ${daoHandler.id} - ${daoHandler.type}. Resetting newLastVoteBlock.`,
                            data: {
                                error: e
                            }
                        })
                        success = false
                    }
                })
            )
        ).filter((n) => n) ?? []

    return { success, votes, voterAddress }
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
