import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@senate/database'
import { z } from 'zod'
import { ServerClient } from 'postmark'
import { MagicUserState } from '@senate/database'

const emailClient = new ServerClient(
    process.env.POSTMARK_TOKEN ?? 'Missing Token'
)

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const email = req.body.email

    const uniswap = await prisma.dao.findFirst({
        where: {
            name: 'Uniswap'
        }
    })

    const existingUser = await prisma.user.findFirst({
        where: { email: email }
    })

    if (existingUser) {
        if (existingUser.verifiedemail && existingUser.isuniswapuser) {
            res.status(200).json({
                email: existingUser.email,
                result: 'existing'
            })
        } else {
            const challengeCode = Math.random().toString(36).substring(2)

            await prisma.user.update({
                where: {
                    id: existingUser.id
                },
                data: {
                    isuniswapuser: MagicUserState.ENABLED,
                    challengecode: challengeCode,
                    verifiedemail: false
                }
            })

            emailClient.sendEmail({
                From: 'info@senatelabs.xyz',
                To: String(existingUser.email),
                Subject: 'Confirm your email',
                TextBody: `${process.env.NEXT_PUBLIC_WEB_URL}/verify/verify-uniswap-user/${challengeCode}`
            })

            res.status(200).json({
                email: existingUser.email,
                result: 'success'
            })
        }

        await prisma.subscription.createMany({
            data: {
                userid: existingUser.id,
                daoid: String(uniswap?.id)
            },
            skipDuplicates: true
        })

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

    const newUser = await prisma.user.create({
        data: {
            email: email,
            isuniswapuser: MagicUserState.ENABLED,
            challengecode: challengeCode
        }
    })

    await prisma.subscription.createMany({
        data: {
            userid: newUser.id,
            daoid: String(uniswap?.id)
        },
        skipDuplicates: true
    })

    emailClient.sendEmail({
        From: 'info@senatelabs.xyz',
        To: String(newUser.email),
        Subject: 'Confirm your email',
        TextBody: `${process.env.NEXT_PUBLIC_WEB_URL}/verify/verify-uniswap-user/${challengeCode}`
    })

    res.status(200).json({ email: newUser.email, result: 'success' })
}
