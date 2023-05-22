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
        if (existingUser.verifiedemail && existingUser.isaaveuser) {
            res.status(200).json({
                email: existingUser.email,
                result: 'existing'
            })
        } else if (existingUser.verifiedemail && !existingUser.isaaveuser) {
            const challengeCode = Math.random().toString(36).substring(2)

            await prisma.user.update({
                where: {
                    id: existingUser.id
                },
                data: {
                    isaaveuser: MagicUserState.VERIFICATION,
                    challengecode: challengeCode
                }
            })

            emailClient.sendEmail({
                From: 'info@senatelabs.xyz',
                To: String(existingUser.email),
                Subject: 'Confirm your subscription',
                TextBody: `${process.env.NEXT_PUBLIC_WEB_URL}/verify/subscribe-discouse/aave/${challengeCode}`
            })

            res.status(200).json({
                email: existingUser.email,
                result: 'success'
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
                isaaveuser: MagicUserState.VERIFICATION,
                emaildailybulletin: true,
                emailquorumwarning: true,
                challengecode: challengeCode
            }
        })

        emailClient.sendEmail({
            From: 'info@senatelabs.xyz',
            To: String(newUser.email),
            Subject: 'Confirm your email',
            TextBody: `${process.env.NEXT_PUBLIC_WEB_URL}/verify/signup-discouse/aave/${challengeCode}`
        })

        res.status(200).json({ email: newUser.email, result: 'success' })
    }

    res.status(200).json({ email: email, result: 'failed' })
}
