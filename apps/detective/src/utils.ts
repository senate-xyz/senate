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
            const result = { abi: 'none', response: 'NOK' }

            while (result.response == 'NOK')
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
                    .retry(3, async (err) => {
                        if (err) {
                            await new Promise((f) => setTimeout(f, 1000))
                            return true
                        }
                        return false
                    })
                    .then((res) => res.body)
                    .then(async (data) => {
                        if (data.message == 'OK') {
                            try {
                                await prisma.contract.create({
                                    data: {
                                        address: address,
                                        abi: data.result
                                    }
                                })
                            } catch {}
                            result.abi = data.result
                            result.response = 'OK'
                        } else await new Promise((f) => setTimeout(f, 1000))
                    })

            return result
        })

    return contract.abi
}

export default getAbi
