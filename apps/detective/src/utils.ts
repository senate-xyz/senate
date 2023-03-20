import { prisma } from '@senate/database'
import superagent from 'superagent'

const getAbi = async (address: string, provider: 'ethereum' | 'arbitrum') => {
    const abi = await prisma.abis
        .findFirstOrThrow({
            where: {
                address: address
            }
        })
        .catch(async () => {
            if (provider === 'ethereum') {
                await superagent
                    .get(
                        `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${process.env.ETHERSCAN_API_KEY}`
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
                        console.log(`Got new abi for ${address}`)
                        if (data.message == 'OK') {
                            const abi = await prisma.abis.create({
                                data: {
                                    address: address,
                                    abi: data.result
                                }
                            })
                            return abi
                        } else return ''
                    })
            } else if (provider === 'arbitrum') {
            } else return
        })

    return abi
}

export default getAbi
