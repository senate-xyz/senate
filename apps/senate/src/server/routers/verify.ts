import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { prisma } from '@senate/database'
import { verifyMessage } from 'ethers/lib/utils.js'
import { SiweMessage } from 'siwe'

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
                email: z.string().email(),
                message: z.string(),
                signature: z.string()
            })
        )
        .mutation(async ({ input }) => {
            try {
                const address = verifyMessage(input.message, input.signature)

                if (!address) {
                    return
                }

                await prisma.user.updateMany({
                    where: {
                        challengecode: input.challenge,
                        verifiedemail: false
                    },
                    data: {
                        email: input.email,
                        address: address,
                        verifiedemail: true,
                        verifiedaddress: true,
                        challengecode: ''
                    }
                })
            } catch {
                console.log('bad email verify signature')
            }
        })
})
