import { router, privateProcedure } from '../trpc'
import { NotificationType, prisma } from '@senate/database'

export const testingRouter = router({
    randomQuorumAlert: privateProcedure.mutation(async ({ ctx }) => {
        const username = await ctx.user.name

        const proposalsCount = await prisma.proposal.count()

        const randomNumber = Math.floor(Math.random() * proposalsCount)

        const randomProposal = await prisma.proposal.findFirst({
            skip: randomNumber
        })

        const user = await prisma.user.findFirst({
            where: {
                address: {
                    equals: String(username)
                }
            }
        })

        await prisma.notification.create({
            data: {
                proposalid: String(randomProposal?.id),
                userid: String(user?.id),
                type: NotificationType.QUORUM_NOT_REACHED_EMAIL
            }
        })
    }),

    lastQuorumAlert: privateProcedure.mutation(async ({ ctx }) => {
        const username = await ctx.user.name

        const firstProposal = await prisma.proposal.findFirst({
            orderBy: {
                timeend: 'desc'
            }
        })

        const user = await prisma.user.findFirst({
            where: {
                address: {
                    equals: String(username)
                }
            }
        })

        await prisma.notification.create({
            data: {
                proposalid: String(firstProposal?.id),
                userid: String(user?.id),
                type: NotificationType.QUORUM_NOT_REACHED_EMAIL
            }
        })
    }),
    lastAaveQuorumAlert: privateProcedure.mutation(async ({ ctx }) => {
        const username = await ctx.user.name

        const firstProposal = await prisma.proposal.findFirst({
            where: {
                dao: {
                    name: 'Aave'
                }
            },
            orderBy: {
                timeend: 'desc'
            }
        })

        const user = await prisma.user.findFirst({
            where: {
                address: {
                    equals: String(username)
                }
            }
        })

        await prisma.notification.create({
            data: {
                proposalid: String(firstProposal?.id),
                userid: String(user?.id),
                type: NotificationType.QUORUM_NOT_REACHED_EMAIL
            }
        })
    }),
    lastUniswapQuorumAlert: privateProcedure.mutation(async ({ ctx }) => {
        const username = await ctx.user.name

        const firstProposal = await prisma.proposal.findFirst({
            where: {
                dao: {
                    name: 'Uniswap'
                }
            },
            orderBy: {
                timeend: 'desc'
            }
        })

        const user = await prisma.user.findFirst({
            where: {
                address: {
                    equals: String(username)
                }
            }
        })

        await prisma.notification.create({
            data: {
                proposalid: String(firstProposal?.id),
                userid: String(user?.id),
                type: NotificationType.QUORUM_NOT_REACHED_EMAIL
            }
        })
    }),
    deleteDispatchedNotifications: privateProcedure.mutation(
        async ({ ctx }) => {
            const username = await ctx.user.name
            const user = await prisma.user.findFirst({
                where: {
                    address: {
                        equals: String(username)
                    }
                }
            })
            await prisma.notification.deleteMany({
                where: { userid: user?.id }
            })
        }
    ),
    sendBulletin: privateProcedure.mutation(async ({ ctx }) => {
        const username = await ctx.user.name
        const user = await prisma.user.findFirst({
            where: {
                address: {
                    equals: String(username)
                }
            }
        })

        const proposalsCount = await prisma.proposal.count()

        const randomNumber = Math.floor(Math.random() * proposalsCount)

        const randomProposal = await prisma.proposal.findFirst({
            skip: randomNumber
        })

        await prisma.notification.create({
            data: {
                userid: String(user?.id),
                proposalid: String(randomProposal?.id),
                type: NotificationType.TRIGGER_BULLETIN_EMAIL
            }
        })
    })
})
