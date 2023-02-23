import { log_pd } from '@senate/axiom'
import { DAOHandler, ProposalState } from '@senate/database'
import { Decoder } from '@senate/database'
import axios from 'axios'
import { ethers } from 'ethers'

export const makerPolls = async (
    provider: ethers.JsonRpcProvider,
    daoHandler: DAOHandler,
    fromBlock: number,
    toBlock: number
) => {
    const pollingContractIface = new ethers.Interface(
        (daoHandler.decoder as Decoder).abi_create
    )
    const logs = await provider.getLogs({
        fromBlock: fromBlock,
        toBlock: toBlock,
        address: (daoHandler.decoder as Decoder).address_create,
        topics: [pollingContractIface.getEvent('PollCreated').topicHash]
    })

    const args = logs.map((log) => ({
        txBlock: log.blockNumber,
        txHash: log.transactionHash,
        eventData: pollingContractIface.parseLog({
            topics: log.topics as string[],
            data: log.data
        }).args
    }))

    const proposals = await Promise.all(
        args.map(async (arg) => {
            const proposalOnChainId = Number(arg.eventData.pollId).toString()

            const proposalUrl =
                (daoHandler.decoder as Decoder).proposalUrl + proposalOnChainId
            const proposalCreatedTimestamp = Number(arg.eventData.blockCreated)
            const votingStartsTimestamp = Number(arg.eventData.startDate)
            const votingEndsTimestamp = Number(arg.eventData.endDate)
            const title = await getProposalTitle(
                arg.eventData.url,
                proposalOnChainId
            )

            return {
                externalId: proposalOnChainId,
                name: String(title).slice(0, 1024),
                daoId: daoHandler.daoId,
                daoHandlerId: daoHandler.id,
                timeEnd: new Date(votingEndsTimestamp * 1000),
                timeStart: new Date(votingStartsTimestamp * 1000),
                timeCreated: new Date(proposalCreatedTimestamp * 1000),
                choices: ['For', 'Against'],
                scores: [0, 0],
                scoresTotal: 0,
                state: ProposalState.CLOSED,
                url: proposalUrl
            }
        })
    )

    //we know for sure this is a bad proposal
    return proposals.filter((proposal) => proposal.externalId != '1')
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

    //check if url is valid - when not valid, axios throws an error which does not get caught by the catch block
    if (!url || !(url.startsWith('https://') || url.startsWith('http://'))) {
        log_pd.log({
            level: 'error',
            message: `URL Invalid! Cannot fetch title for Maker poll ${onChainId}`
        })
        return 'Unknown'
    }

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

                log_pd.log({
                    level: 'warn',
                    message: `Retrying fetching title for Maker poll ${onChainId}`,
                    data: {
                        retriesLeft: retriesLeft
                    }
                })
            }
        }
    } catch (e) {
        log_pd.log({
            level: 'error',
            message: `Error fetching title for Maker poll ${onChainId}`
        })
    }

    return response ? formatTitle(response) : 'Unknown'
}

const calculateExponentialBackoffTimeInMs = (retriesLeft: number) => {
    return 1000 * Math.pow(2, 5 - retriesLeft)
}
