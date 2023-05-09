import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@senate/database'
import { z } from 'zod'
import { ServerClient } from 'postmark'

const client = new ServerClient(process.env.POSTMARK_TOKEN ?? 'Missing Token')

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const email = req.body.email

    const existingUser = await prisma.user.findFirst({
        where: { email: email }
    })

    if (existingUser) {
        res.status(500).json({ email: email, result: 'failed' })
        return
    }

    const schema = z.coerce.string().email()

    try {
        schema.parse(email)
    } catch {
        res.status(500).json({ email: email, result: 'failed' })
        return
    }

    const challengeCode = Math.random().toString(36).substring(2)
    console.log(challengeCode)

    const newUser = await prisma.user.create({
        data: {
            email: email,
            isuniswapuser: true,
            challengecode: challengeCode
        }
    })

    client.sendEmail({
        From: 'info@senatelabs.xyz',
        To: newUser.email,
        Subject: 'Confirm your email',
        TextBody: `${process.env.NEXT_PUBLIC_WEB_URL}/verify/${challengeCode}`
    })

    res.status(200).json({ email: newUser.email, result: 'success' })
}
