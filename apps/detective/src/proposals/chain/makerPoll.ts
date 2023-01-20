import { log_pd } from '@senate/axiom'
import { DAOHandler } from '@senate/database'
import axios from 'axios'
import { ethers } from 'ethers'

export const makerPolls = async (
    provider: ethers.providers.JsonRpcProvider,
    daoHandler: DAOHandler,
    fromBlock: number,
    toBlock: number
) => {
    const pollingContractIface = new ethers.utils.Interface(
        daoHandler.decoder['abi_create']
    )
    const logs = await provider.getLogs({
        fromBlock: fromBlock,
        toBlock: toBlock,
        address: daoHandler.decoder['address_create'],
        topics: [pollingContractIface.getEventTopic('PollCreated')]
    })

    const args = logs.map((log) => ({
        txBlock: log.blockNumber,
        txHash: log.transactionHash,
        eventData: pollingContractIface.parseLog({
            topics: log.topics,
            data: log.data
        }).args
    }))

    const proposals =
        (
            await Promise.all(
                args.map(async (arg) => {
                    const proposalOnChainId = Number(
                        arg.eventData.pollId
                    ).toString()

                    const proposalUrl =
                        daoHandler.decoder['proposalUrl'] + proposalOnChainId
                    const proposalCreatedTimestamp = Number(
                        arg.eventData.blockCreated
                    )
                    const votingStartsTimestamp = Number(
                        arg.eventData.startDate
                    )
                    const votingEndsTimestamp = Number(arg.eventData.endDate)
                    const title = await getProposalTitle(
                        arg.eventData.url,
                        proposalOnChainId
                    )

                    if (proposalOnChainId == '1')
                        //we know for sure this is a bad proposal
                        return

                    return {
                        externalId: proposalOnChainId,
                        name: String(title).slice(0, 1024),
                        daoId: daoHandler.daoId,
                        daoHandlerId: daoHandler.id,
                        timeEnd: new Date(votingEndsTimestamp * 1000),
                        timeStart: new Date(votingStartsTimestamp * 1000),
                        timeCreated: new Date(proposalCreatedTimestamp * 1000),
                        data: {},
                        url: proposalUrl
                    }
                })
            )
        ).filter((n) => n) ?? []

    return proposals
}

const formatTitle = (text: string): string => {
    const temp = text.split('summary:')[0].split('title: ')[1]

    return temp
}

const getProposalTitle = async (
    url: string,
    onChainId: string
): Promise<string> => {
    let response

    try {
        let retriesLeft = 5
        while (retriesLeft) {
            try {
                response = await (await axios.get(url)).data
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
    } catch (e) {
        log_pd.log({
            level: 'warn',
            message: `Error fetching title for Maker poll ${onChainId}`,
            data: {}
        })
    }

    return response ? formatTitle(response) : 'Unknown'
}

const calculateExponentialBackoffTimeInMs = (retriesLeft: number) => {
    return 1000 * Math.pow(2, 5 - retriesLeft)
}
