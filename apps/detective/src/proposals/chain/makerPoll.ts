import { log_pd } from '@senate/axiom'
import { DAOHandler } from '@senate/database'
import { Decoder } from '@senate/database'
import axios from 'axios'
import {AxiosError} from 'axios'
import { ethers } from 'ethers'
import getAbi from '../../utils'

interface PollResults {
    choices: string[],
    scores: number[]
}

export const makerPolls = async (
    provider: ethers.JsonRpcProvider,
    daoHandler: DAOHandler,
    fromBlock: number,
    toBlock: number
) => {
    const abi = await getAbi(
        (daoHandler.decoder as Decoder).address_create,
        'ethereum'
    )

    const govIface = new ethers.Interface(abi)

    const logs = await provider.getLogs({
        fromBlock: fromBlock,
        toBlock: toBlock,
        address: (daoHandler.decoder as Decoder).address_create,
        topics: [govIface.getEvent('PollCreated').topicHash]
    })

    const args = logs.map((log) => ({
        txBlock: log.blockNumber,
        txHash: log.transactionHash,
        eventData: govIface.parseLog({
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
            const resultsData : PollResults = await fetchResultsData(proposalOnChainId)

            if (!title || !resultsData)
                return null

            return {
                externalId: proposalOnChainId,
                name: String(title).slice(0, 1024),
                daoId: daoHandler.daoid,
                daoHandlerId: daoHandler.id,
                timeEnd: new Date(votingEndsTimestamp * 1000),
                timeStart: new Date(votingStartsTimestamp * 1000),
                timeCreated: new Date(proposalCreatedTimestamp * 1000),
                blockCreated: arg.txBlock,
                choices: resultsData.choices,
                scores: resultsData.scores,
                scoresTotal: resultsData.scores.reduce((acc, score) => acc + score, 0),
                quorum: 0,
                url: proposalUrl
            }
        })
    )

    return proposals.filter((proposal) => proposal)
}

const fetchResultsData = async (pollChainId: string) : Promise<PollResults> => {
    let results : PollResults = {
        choices: [],
        scores: []
    }

    try {
        let retriesLeft = 5
        while (retriesLeft) {
            try {
                const response = await (await axios.get(`https://vote.makerdao.com/api/polling/tally/${pollChainId}`)).data

                const choices = []
                const scores = []

                for (let result of response.results) {
                    choices[result.optionId] = result.optionName
                    scores[result.optionId] = parseFloat(result.mkrSupport)
                }

                results = {
                    choices,
                    scores
                }

                break
            } catch (err) {
                if ((err as AxiosError).code === '404') {
                    results = null
                    throw err
                }
    
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
            level: 'error',
            message: `Error fetching results for Maker poll ${pollChainId}`,
            errorName: (e as Error).name,
            errorMessage: (e as Error).message,
            errorStack: (e as Error).stack,
        })

    }

    return results
}

const formatTitle = (text: string): string => {
    const temp = text.split('summary:')[0].split('title: ')[1]

    return temp
}

const getProposalTitle = async (
    url: string,
    onChainId: string
): Promise<string> => {
    let result = 'Unknown'

    //check if url is valid - when not valid, axios throws an error which does not get caught by the catch block
    if (!url || !(url.startsWith('https://') || url.startsWith('http://'))) {
        log_pd.log({
            level: 'error',
            message: `URL Invalid! Cannot fetch title for Maker poll ${onChainId}`
        })
        return null
    }

    try {
        let retriesLeft = 5
        while (retriesLeft) {
            try {
                const responseBody = await (await axios.get(url)).data
                result = formatTitle(responseBody)
                break
            } catch (err) {
                if ((err as AxiosError).code !== '429') {
                    result = null
                    throw err
                }

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
            level: 'error',
            message: `Error fetching title for Maker poll ${onChainId}`,
            errorName: (e as Error).name,
            errorMessage: (e as Error).message,
            errorStack: (e as Error).stack,
        })
    }

    return result
}

const calculateExponentialBackoffTimeInMs = (retriesLeft: number) => {
    return 1000 * Math.pow(2, 5 - retriesLeft)
}
