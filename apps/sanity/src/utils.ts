import { prisma, type JsonValue } from '@senate/database'
import superagent from 'superagent'
import ethers from 'ethers'
import {config} from 'dotenv'

config()

interface AbiResult {
    abi: string
    response: 'OK' | 'NOK'
}

export const getAbi = async (
    address: string,
    provider: 'ethereum' | 'arbitrum'
): Promise<string> => {
    const baseURL =
        provider === 'ethereum'
            ? 'https://api.etherscan.io'
            : 'https://api.arbiscan.io'
    const apiKey =
        provider === 'ethereum'
            ? process.env.ETHERSCAN_API_KEY
            : process.env.ARBISCAN_API_KEY
    const apiUrl = `${baseURL}/api?module=contract&action=getabi&address=${address}&apikey=${apiKey}`

    const fetchAbi = async () => {
        const response = await superagent
            .get(apiUrl)
            .type('application/json')
            .retry(3, async (err) => {
                if (err) {
                    await new Promise((resolve) => setTimeout(resolve, 1000))
                    return true
                }
                return false
            })

        return response.body
    }

    const contract = await prisma.contract.findFirst({
        where: {
            address: address
        }
    })

    if (!contract) {
        const result: AbiResult = { abi: 'none', response: 'NOK' }

        while (result.response === 'NOK') {
            const data = await fetchAbi()

            if (data.message === 'OK') {
                try {
                    await prisma.contract.createMany({
                        data: {
                            address: address,
                            abi: data.result
                        },
                        skipDuplicates: true
                    })
                } catch (err) {
                    console.error(err)
                }

                result.abi = data.result
                result.response = 'OK'
            } else {
                await new Promise((resolve) => setTimeout(resolve, 1000))
            }
        }

        return result.abi
    }

    return contract.abi
}


export const getClosestBlock = async (timestamp: number, provider: ethers.JsonRpcProvider): Promise<number> => {
    let minClosestBlock = 0
    let maxClosestBlock = await provider.getBlockNumber()

    while (minClosestBlock < maxClosestBlock) {
        const middleBlock = Math.floor((minClosestBlock + maxClosestBlock) / 2)
        const middleBlockTimestamp = (await provider.getBlock(middleBlock)).timestamp

        if (timestamp < middleBlockTimestamp * 1000) {
            maxClosestBlock = middleBlock - 1
        } else if (timestamp > middleBlockTimestamp * 1000) {
            minClosestBlock = middleBlock + 1
        }
    }

    return minClosestBlock
}

export const callApiWithDelayedRetries = async (
    graphqlQuery: string,
    retries: number
) : Promise<any> => {
    let result
    let retriesLeft = retries
    while (retriesLeft) {
        try {
            result = await superagent
                .get('https://hub.snapshot.org/graphql')
                .query({
                    query: graphqlQuery
                })
                .timeout({
                    response: 10000,
                    deadline: 30000
                })
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .then((response: { body: { data: any } }) => {
                    return response.body.data
                })

            break
        } catch (e) {
            retriesLeft--

            if (!retriesLeft) {
                throw e
            }

            await new Promise((resolve) =>
                setTimeout(
                    resolve,
                    calculateExponentialBackoffTimeInMs(retries, retriesLeft)
                )
            )
        }
    }

    return result
}

const calculateExponentialBackoffTimeInMs = (
    totalRetries: number,
    retriesLeft: number
) => {
    return 1000 * Math.pow(2, totalRetries - retriesLeft)
}