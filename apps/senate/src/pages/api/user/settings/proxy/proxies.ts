import { prisma } from '@senate/database'
import { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]'

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await unstable_getServerSession(req, res, authOptions())

    const proxyAddresses = await prisma.voter.findMany({
        where: {
            users: {
                some: {
                    name: { equals: String(session?.user?.name) }
                }
            }
        }
    })

    const result = proxyAddresses?.map((proxy) => proxy.address)

    res.json({ proxies: result })
}
