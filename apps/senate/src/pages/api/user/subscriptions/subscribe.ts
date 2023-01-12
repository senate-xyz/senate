import { prisma } from '@senate/database'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { daoId, dailyEmails } = req.body

    const session = await getSession({ req })

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
