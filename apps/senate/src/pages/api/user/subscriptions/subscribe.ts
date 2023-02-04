import { prisma } from '@senate/database'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]'

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { daoId } = req.body

    const session = await getServerSession(req, res, authOptions())

    const user = await prisma.user
        .findFirstOrThrow({
            where: {
                name: { equals: String(session?.user?.name) }
            },
            select: {
                id: true,
                voters: true
            }
        })
        .catch(() => {
            return { id: '0', voters: [] }
        })

    const result = await prisma.subscription
        .upsert({
            where: {
                userId_daoId: {
                    userId: user.id,
                    daoId: daoId
                }
            },
            update: {},
            create: {
                userId: user.id,
                daoId: daoId
            }
        })
        .then(() => {
            return true
        })
        .catch(() => {
            return false
        })

    res.json(result)
}
