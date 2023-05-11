import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { prisma } from '@senate/database'
import { verifyMessage } from 'viem'

export const verifyRouter = router({
    userOfChallenge: publicProcedure
        .input(
            z.object({
                challenge: z.string()
            })
        )
        .query(async ({ input }) => {
            const user = await prisma.user.findFirst({
                where: {
                    challengecode: input.challenge
                }
            })

            return user
        }),

    verifyUser: publicProcedure
        .input(
            z.object({
                challenge: z.string(),
                address: z.string().startsWith('0x'),
                email: z.string().email(),
                message: z.string(),
                signature: z.string()
            })
        )
        .mutation(async ({ input }) => {
            try {
                const challengeRegex = /(?<=challenge:\s)[a-zA-Z0-9]+/
                const challengeMatch = input.message.match(challengeRegex)

                if (!challengeMatch) return
                if (challengeMatch[0] != input.challenge) return

                const emailRegex =
                    /(?<=email:\s)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/

                const emailMatch = input.message.match(emailRegex)

                if (!emailMatch) return
                if (emailMatch[0] != input.email) return

                const valid = verifyMessage({
                    address: input.address as `0x${string}`,
                    message: input.message,
                    signature: input.signature as `0x${string}`
                })
                if (!valid) return

                await prisma.user.updateMany({
                    where: {
                        challengecode: input.challenge,
                        verifiedemail: false
                    },
                    data: {
                        email: input.email,
                        address: input.address,
                        verifiedemail: true,
                        verifiedaddress: true,
                        challengecode: '',
                        acceptedterms: true,
                        acceptedtermstimestamp: new Date()
                    }
                })
            } catch {
                console.log('bad email verify signature')
            }
        })
})
