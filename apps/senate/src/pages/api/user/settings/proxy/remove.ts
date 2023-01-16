import { prisma } from '@senate/database'
import { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]'

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { body, method } = req

    const session = await unstable_getServerSession(req, res, authOptions())

    let result
    switch (method) {
        case 'DELETE':
            const { proxy } = JSON.parse(body)

            result = await prisma.user
                .update({
                    where: {
                        name: String(session?.user?.name)
                    },
                    data: {
                        voters: {
                            disconnect: {
                                address: proxy
                            }
                        }
                    }
                })
                .then(() => {
                    return true
                })
                .catch(() => {
                    return false
                })
            break
        default:
            res.setHeader('Allow', ['DELETE'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }

    res.json({ result: result })
}
