import { prisma } from '@senate/database'
import superagent from 'superagent'

interface AbiResult {
    abi: string
    response: 'OK' | 'NOK'
}

const getAbi = async (
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
                    await prisma.contract.create({
                        data: {
                            address: address,
                            abi: data.result
                        }
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

export default getAbi
