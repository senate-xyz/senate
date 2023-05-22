import { NextApiRequest, NextApiResponse } from 'next'
import { MagicUserState, prisma } from '@senate/database'
import { z } from 'zod'
import { ServerClient } from 'postmark'

const emailClient = new ServerClient(
    process.env.POSTMARK_TOKEN ?? 'Missing Token'
)

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const email = req.body.email

    const existingUser = await prisma.user.findFirst({
        where: { email: email }
    })

    if (existingUser) {
        if (
            existingUser.verifiedemail &&
            existingUser.isuniswapuser == 'ENABLED'
        ) {
            res.status(200).json({
                email: existingUser.email,
                result: 'existing'
            })
        } else if (
            existingUser.verifiedemail &&
            existingUser.isuniswapuser != 'ENABLED'
        ) {
            const challengeCode = Math.random().toString(36).substring(2)

            await prisma.user.update({
                where: {
                    id: existingUser.id
                },
                data: {
                    isuniswapuser: MagicUserState.VERIFICATION,
                    challengecode: challengeCode
                }
            })

            emailClient.sendEmail({
                From: 'info@senatelabs.xyz',
                To: String(existingUser.email),
                Subject: 'Confirm your subscription',
                TextBody: `Confirm your subscription to Uniswap : ${process.env.NEXT_PUBLIC_WEB_URL}/verify/subscribe-discouse/uniswap/${challengeCode}`
            })

            res.status(200).json({
                email: existingUser.email,
                result: 'success'
            })
        } else if (!existingUser.verifiedemail) {
            const challengeCode = Math.random().toString(36).substring(2)

            await prisma.user.update({
                where: {
                    id: existingUser.id
                },
                data: {
                    challengecode: challengeCode
                }
            })

            emailClient.sendEmail({
                From: 'info@senatelabs.xyz',
                To: String(existingUser.email),
                Subject: 'Verify your email first!',
                TextBody: `Ooops, you wanted to subscribe to Uniswap but your email is not yet verified. Verify your email first and then try subscribing again! \n${process.env.NEXT_PUBLIC_WEB_URL}/verify/subscribe-discouse/aave/${challengeCode}`
            })
        }
    } else {
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
                verifiedemail: false,
                isuniswapuser: MagicUserState.VERIFICATION,
                emaildailybulletin: true,
                emailquorumwarning: true,
                challengecode: challengeCode
            }
        })

        emailClient.sendEmail({
            From: 'info@senatelabs.xyz',
            To: String(newUser.email),
            Subject: 'Confirm your email',
            TextBody: `Signup to Uniswap with Senate: ${process.env.NEXT_PUBLIC_WEB_URL}/verify/signup-discouse/uniswap/${challengeCode}`
        })

        res.status(200).json({ email: newUser.email, result: 'success' })
    }
}
