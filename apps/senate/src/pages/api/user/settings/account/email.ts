import { prisma } from '@senate/database'
import { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]'
import { z } from 'zod'

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { body, method } = req

    const session = await unstable_getServerSession(req, res, authOptions())

    let user
    switch (method) {
        case 'GET':
            user = await prisma.user.findFirst({
                where: {
                    name: String(session?.user?.name)
                },
                select: { email: true }
            })
            break
        case 'POST':
            const emailFilter = z.string().email()
            const { emailAddress } = JSON.parse(body)

            if (emailFilter.parse(emailAddress))
                user = await prisma.user.update({
                    where: {
                        name: String(session?.user?.name)
                    },
                    data: {
                        email: emailAddress
                    },
                    select: {
                        email: true
                    }
                })
            break
        default:
            res.setHeader('Allow', ['GET', 'POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }

    res.json({ emailAddress: user?.email })
}
