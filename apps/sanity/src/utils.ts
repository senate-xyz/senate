import { prisma } from '@senate/database'
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

    // console.log("Binary search output")
    // console.log("Searching for closest block to", new Date(timestamp))
    while (minClosestBlock < maxClosestBlock) {
        const middleBlock = Math.floor((minClosestBlock + maxClosestBlock) / 2)
        const middleBlockTimestamp = (await provider.getBlock(middleBlock)).timestamp

        // console.log("Height: ", height)
        // console.log("Min block", minClosestBlock)
        // console.log("Max block", maxClosestBlock)
        // console.log("Mid block", middleBlock)
        // console.log("Mid block timestamp", new Date(middleBlockTimestamp * 1000))
        // console.log("\n")

        if (timestamp < middleBlockTimestamp * 1000) {
            maxClosestBlock = middleBlock - 1
        } else if (timestamp > middleBlockTimestamp * 1000) {
            minClosestBlock = middleBlock + 1
        }
    }

    console.log("Input timestamp", new Date(timestamp))
    console.log("Closest block timestamp", new Date((await provider.getBlock(minClosestBlock)).timestamp * 1000) )
    console.log("Closest block:", minClosestBlock)
    return minClosestBlock
}