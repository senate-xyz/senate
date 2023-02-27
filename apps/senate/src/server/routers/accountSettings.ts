import { router, privateProcedure } from '../trpc'
import { z } from 'zod'
import { prisma } from '@senate/database'
import { clerkClient } from '@clerk/nextjs/server'

export const accountSettingsRouter = router({
    setEmail: privateProcedure
        .input(
            z.object({
                email: z.string().email()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const clerkUser = await clerkClient.users.getUser(
                ctx.auth?.userId || ''
            )

            const user = await prisma.user.upsert({
                where: {
                    name: String(clerkUser.web3Wallets[0]?.web3Wallet)
                },
                create: {
                    name: String(clerkUser.web3Wallets[0]?.web3Wallet),
                    email: input.email
                },
                update: { email: input.email }
            })

            return user
        }),

    getEmail: privateProcedure.query(async ({ ctx }) => {
        const clerkUser = await clerkClient.users.getUser(
            ctx.auth?.userId || ''
        )

        const user = await prisma.user.findFirst({
            where: {
                name: {
                    equals: String(clerkUser.web3Wallets[0]?.web3Wallet)
                }
            }
        })

        return user?.email
    }),

    voters: privateProcedure.query(async ({ ctx }) => {
        const clerkUser = await clerkClient.users.getUser(
            ctx.auth?.userId || ''
        )

        const user = await prisma.user.findFirst({
            where: {
                name: {
                    equals: String(clerkUser.web3Wallets[0]?.web3Wallet)
                }
            },
            include: {
                voters: true
            }
        })

        return user?.voters
    }),

    addVoter: privateProcedure
        .input(
            z.object({
                address: z.string().startsWith('0x').length(42)
            })
        )
        .mutation(async ({ input, ctx }) => {
            const clerkUser = await clerkClient.users.getUser(
                ctx.auth?.userId || ''
            )

            const user = await prisma.user.findFirst({
                where: {
                    name: {
                        equals: String(clerkUser.web3Wallets[0]?.web3Wallet)
                    }
                }
            })

            const result = await prisma.user.update({
                where: {
                    id: user?.id
                },
                data: {
                    voters: {
                        connectOrCreate: {
                            where: {
                                address: input.address
                            },
                            create: {
                                address: input.address
                            }
                        }
                    }
                }
            })

            return result
        }),

    removeVoter: privateProcedure
        .input(
            z.object({
                address: z.string().startsWith('0x').length(42)
            })
        )
        .mutation(async ({ input, ctx }) => {
            const clerkUser = await clerkClient.users.getUser(
                ctx.auth?.userId || ''
            )

            const user = await prisma.user.findFirst({
                where: {
                    name: {
                        equals: String(clerkUser.web3Wallets[0]?.web3Wallet)
                    }
                }
            })

            const result = await prisma.user.update({
                where: {
                    id: user?.id
                },
                data: {
                    voters: {
                        disconnect: {
                            address: input.address
                        }
                    }
                }
            })

            return result
        }),

    setTerms: privateProcedure
        .input(
            z.object({
                value: z.boolean()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const clerkUser = await clerkClient.users.getUser(
                ctx.auth?.userId || ''
            )

            const user = await prisma.user.upsert({
                where: {
                    name: String(clerkUser.web3Wallets[0]?.web3Wallet)
                },
                create: {
                    name: String(clerkUser.web3Wallets[0]?.web3Wallet),
                    acceptedTerms: input.value
                },
                update: { acceptedTerms: input.value }
            })

            return user
        }),

    getUser: privateProcedure.query(async ({ ctx }) => {
        const clerkUser = await clerkClient.users.getUser(
            ctx.auth?.userId || ''
        )

        const user = await prisma.user.findFirst({
            where: {
                name: {
                    equals: String(clerkUser.web3Wallets[0]?.web3Wallet)
                }
            }
        })

        return user
    }),

    updateDailyEmails: privateProcedure
        .input(
            z.object({
                dailyBulletin: z.boolean()
            })
        )
        .mutation(async ({ input, ctx }) => {
            const clerkUser = await clerkClient.users.getUser(
                ctx.auth?.userId || ''
            )

            const user = await prisma.user.upsert({
                where: {
                    name: String(clerkUser.web3Wallets[0]?.web3Wallet)
                },
                create: {
                    name: String(clerkUser.web3Wallets[0]?.web3Wallet),
                    dailyBulletin: input.dailyBulletin
                },
                update: { dailyBulletin: input.dailyBulletin }
            })

            return user
        })
})
