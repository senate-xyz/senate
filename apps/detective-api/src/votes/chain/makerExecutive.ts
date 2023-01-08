import { log_node } from '@senate/axiom'
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
        fromBlock: lastVoteBlock,
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
            fromBlock: lastVoteBlock,
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

    let newLastVoteBlock = (await provider.getBlockNumber()) ?? 0

    const votes =
        (await Promise.all(
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
                    newLastVoteBlock = 0
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
        )) ?? []

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
