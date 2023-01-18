import { log_node, log_pd } from '@senate/axiom'
import { DAOHandler, prisma } from '@senate/database'
import { ethers } from 'ethers'

export const getMakerExecutiveVotes = async (
    provider: ethers.providers.JsonRpcProvider,
    daoHandler: DAOHandler,
    voterAddress: string,
    lastVoteBlock: number
) => {
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
    const voterAddressTopic = '0x' + '0'.repeat(24) + voterAddress.substring(2)

    const logs = await provider.getLogs({
        fromBlock: Number(lastVoteBlock),
        toBlock: Number(lastVoteBlock + 1000000),
        address: daoHandler.decoder['address'],
        topics: [
            [voteMultipleActionsTopic, voteSingleActionTopic],
            voterAddressTopic
        ]
    })

    log_node.log({
        level: 'info',
        message: `getLogs`,
        data: {
            fromBlock: Number(lastVoteBlock),
            toBlock: Number(lastVoteBlock + 1000000),
            address: daoHandler.decoder['address'],
            topics: [
                [voteMultipleActionsTopic, voteSingleActionTopic],
                voterAddressTopic
            ]
        }
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

    const intermediaryVotes = Array.from(spellAddressesSet)

    let newLastVoteBlock = Math.max(...logs.map((log) => log.blockNumber)) ?? 0

    const votes =
        (
            await Promise.all(
                intermediaryVotes.map(async (vote) => {
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
                            vote != '0x0000000000000000000000000000000000000000' //except this one because we know it's a bad proposal and will always trigger reset
                        )
                            newLastVoteBlock = 0

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
                })
            )
        ).filter((n) => n) ?? []

    return { votes, newLastVoteBlock }
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
