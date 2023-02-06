import { log_pd } from '@senate/axiom'
import { Decoder } from '@senate/database'
import { DAOHandlerWithDAO, prisma } from '@senate/database'
import { ethers, Log, zeroPadValue } from 'ethers'
import { hexlify } from 'ethers'

export const getMakerExecutiveVotes = async (
    provider: ethers.JsonRpcProvider,
    daoHandler: DAOHandlerWithDAO,
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
        address: (daoHandler.decoder as Decoder).address,
        topics: [
            [voteMultipleActionsTopic, voteSingleActionTopic],
            voterAddresses.map((voterAddress) =>
                hexlify(zeroPadValue(voterAddress, 32))
            )
        ]
    })

    const result = await Promise.all(
        voterAddresses.map((voterAddress) => {
            return getVotesForVoter(logs, daoHandler, voterAddress, provider)
        })
    )

    return result
}

export const getVotesForVoter = async (
    logs: Log[],
    daoHandler: DAOHandlerWithDAO,
    voterAddress: string,
    provider: ethers.JsonRpcProvider
) => {
    let success = true

    const voteSingleActionTopic =
        '0xa69beaba00000000000000000000000000000000000000000000000000000000'
    const iface = new ethers.Interface((daoHandler.decoder as Decoder).abi)
    const chiefContract = new ethers.Contract(
        (daoHandler.decoder as Decoder).address,
        (daoHandler.decoder as Decoder).abi,
        provider
    )

    const spellAddressesSet = new Set<string>()

    for (let i = 0; i < logs.length; i++) {
        const log = logs[i]

        if (
            String(log.topics[1]).toLowerCase() !=
            hexlify(voterAddress).toLowerCase()
        )
            continue

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
    const votes = (
        await Promise.all(
            intermediaryVotes.map(async (vote) => {
                try {
                    const proposal = await prisma.proposal.findFirstOrThrow({
                        where: {
                            externalId: vote,
                            daoId: daoHandler.daoId,
                            daoHandlerId: daoHandler.id
                        }
                    })

                    return {
                        voterAddress: ethers.getAddress(voterAddress),
                        daoId: daoHandler.daoId,
                        proposalId: proposal.id,
                        daoHandlerId: daoHandler.id,
                        choiceId: '1',
                        choice: 'Yes'
                    }
                } catch (e) {
                    if (e instanceof Error)
                        log_pd.log({
                            level: 'error',
                            message: `Error fetching votes for ${voterAddress} - ${daoHandler.dao.name} - ${daoHandler.type}`,
                            logs: logs,
                            errorMessage: e.message,
                            errorStack: e.stack
                        })
                    success = false
                    return null
                }
            })
        )
    ).filter((vote) => vote != null)

    return { success, votes, voterAddress }
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
            break
        }
    }

    return yays
}
