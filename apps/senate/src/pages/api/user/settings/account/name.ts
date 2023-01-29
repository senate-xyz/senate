import { prisma } from '@senate/database'
import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]'

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { method } = req

    const session = await getServerSession(req, res, authOptions())

    let user
    switch (method) {
        case 'GET':
            user = await prisma.user.findFirst({
                where: {
                    name: String(session?.user?.name)
                },
                select: { name: true }
            })
            break

        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }

    res.json({ userName: user?.name })
}
