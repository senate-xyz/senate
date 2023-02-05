import { log_pd } from '@senate/axiom'
import type { DAOHandler } from '@senate/database'
import axios from 'axios'
import { ethers } from 'ethers'

const VOTE_MULTIPLE_ACTIONS_TOPIC =
    '0xed08132900000000000000000000000000000000000000000000000000000000'
const VOTE_SINGE_ACTION_TOPIC =
    '0xa69beaba00000000000000000000000000000000000000000000000000000000'
const ONE_MONTH_MS = 1000 * 60 * 60 * 24 * 30

export const makerExecutiveProposals = async (
    provider: ethers.JsonRpcProvider,
    daoHandler: DAOHandler,
    fromBlock: number,
    toBlock: number
) => {
    const iface = new ethers.Interface(
        JSON.parse(daoHandler.decoder as string).abi
    )
    const chiefContract = new ethers.Contract(
        JSON.parse(daoHandler.decoder as string).address,
        JSON.parse(daoHandler.decoder as string).abi,
        provider
    )

    const logs = await provider.getLogs({
        fromBlock: fromBlock,
        toBlock: toBlock,
        address: JSON.parse(daoHandler.decoder as string).address,
        topics: [[VOTE_MULTIPLE_ACTIONS_TOPIC, VOTE_SINGE_ACTION_TOPIC]]
    })

    const spellAddresses = await getSpellAddressArrayFromLogs(
        logs,
        iface,
        chiefContract
    )

    const proposals = await Promise.all(
        spellAddresses.map(async (spellAddress) => {
            const proposalData = await getProposalData(spellAddress)

            return {
                externalId: spellAddress,
                name: proposalData.title.slice(0, 1024) ?? 'Unknown',
                daoId: daoHandler.daoId,
                daoHandlerId: daoHandler.id,
                timeEnd: new Date(
                    proposalData.spellData.expiration ??
                        Date.now() + ONE_MONTH_MS
                ),
                timeStart: new Date(proposalData.date ?? Date.now()),
                timeCreated: new Date(proposalData.date ?? Date.now()),
                url:
                    JSON.parse(daoHandler.decoder as string).proposalUrl +
                    spellAddress
            }
        })
    )

    return proposals
}

const getProposalData = async (spellAddress: string) => {
    let response = {
        title: 'Unknown',
        spellData: {
            expiration: new Date(0)
        },
        date: new Date(0)
    }
    try {
        let retriesLeft = 5
        while (retriesLeft) {
            try {
                response = (
                    await axios.get(
                        'https://vote.makerdao.com/api/executive/' +
                            spellAddress
                    )
                ).data

                break
            } catch (err) {
                retriesLeft--
                if (!retriesLeft) throw err

                await new Promise((resolve) =>
                    setTimeout(
                        resolve,
                        calculateExponentialBackoffTimeInMs(retriesLeft)
                    )
                )
            }
        }
    } catch (err) {
        log_pd.log({
            level: 'warn',
            message: `Error fetching Maker executive proposal data for ${spellAddress}`
        })
    }

    return response
}

const calculateExponentialBackoffTimeInMs = (retriesLeft: number) => {
    return 1000 * Math.pow(2, 5 - retriesLeft)
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

async function getSpellAddressArrayFromLogs(
    logs: ethers.Log[],
    iface: ethers.Interface,
    chiefContract: ethers.Contract
): Promise<string[]> {
    const spellAddressesSet = new Set<string>()
    for (let i = 0; i < logs.length; i++) {
        const log = logs[i]
        const eventArgs = iface.decodeEventLog('LogNote', log.data)

        const decodedFunctionData =
            log.topics[0] === VOTE_SINGE_ACTION_TOPIC
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
    return Array.from(spellAddressesSet).filter(
        (spellAddress) =>
            spellAddress !== '0x0000000000000000000000000000000000000000'
    )
}
