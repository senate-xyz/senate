import { prisma } from '@senate/database'
import superagent from 'superagent'

const getAbi = async (address: string, provider: 'ethereum' | 'arbitrum') => {
    const contract = await prisma.contract
        .findFirstOrThrow({
            where: {
                address: address
            }
        })
        .catch(async () => {
            const result = { abi: 'none' }

            await superagent
                .get(
                    `${
                        provider === 'ethereum'
                            ? 'https://api.etherscan.io'
                            : 'https://api.arbiscan.io'
                    }/api?module=contract&action=getabi&address=${address}&apikey=${
                        provider === 'ethereum'
                            ? process.env.ETHERSCAN_API_KEY
                            : process.env.ARBISCAN_API_KEY
                    }`
                )
                .type('application/json')
                .retry(3, async (err, res) => {
                    if (res.status === 201) return false
                    if (err) {
                        await new Promise((f) => setTimeout(f, 1000))
                        return true
                    }
                    return false
                })
                .then((res) => res.body)
                .then(async (data) => {
                    await prisma.contract.create({
                        data: {
                            address: address,
                            abi: data.result
                        }
                    })
                    result.abi = data.result
                })

            return result
        })

    return contract.abi
}

export default getAbi
