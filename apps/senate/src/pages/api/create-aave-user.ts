import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@senate/database'
import { z } from 'zod'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const existingUser = await prisma.user.findFirst({
        where: { email: req.body.email }
    })

    if (existingUser) {
        res.status(500).json({ email: req.body.email, result: 'failed' })
        return
    }

    const schema = z.coerce.string().email().min(5)

    try {
        schema.parse(req.body.email)
    } catch {
        res.status(500).json({ email: req.body.email, result: 'failed' })
        return
    }

    const newUser = await prisma.user.create({
        data: {
            email: req.body.email,
            isaaveuser: true
        }
    })

    res.status(200).json({ email: newUser.email, result: 'success' })
}
