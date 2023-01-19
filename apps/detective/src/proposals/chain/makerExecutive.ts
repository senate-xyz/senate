import { log_node, log_pd } from '@senate/axiom'
import { DAOHandler } from '@senate/database'
import axios from 'axios'
import { ethers } from 'ethers'

export const makerExecutiveProposals = async (
    provider: ethers.providers.JsonRpcProvider,
    daoHandler: DAOHandler,
    fromBlock: number,
    toBlock: number
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

    const logs = await provider.getLogs({
        fromBlock: fromBlock,
        toBlock: toBlock,
        address: daoHandler.decoder['address'],
        topics: [[voteMultipleActionsTopic, voteSingleActionTopic]]
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
                : await getSlateYays(chiefContract, decodedFunctionData.slate)

        spells.forEach((spell) => {
            spellAddressesSet.add(spell)
        })
    }

    const spellAddressesArray = Array.from(spellAddressesSet)

    const proposals =
        (
            await Promise.all(
                spellAddressesArray.map(async (proposal) => {
                    if (
                        proposal == '0x0000000000000000000000000000000000000000'
                    )
                        return

                    const res = await axios
                        .get(
                            'https://vote.makerdao.com/api/executive/' +
                                proposal
                        )
                        .catch(() => {
                            return { status: 404, data: {} }
                        })

                    if (!res.data || res.status == 404) {
                        return
                    }

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
        ).filter((n) => n) ?? []

    return proposals
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
