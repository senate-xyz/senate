import { prisma } from '@senate/database'
import { z } from 'zod'
import { router, publicProcedure } from '../trpc'

export const userRouter = router({
    proxyAddreses: publicProcedure.query(async ({ ctx }) => {
        const user = await prisma.user
            .findFirstOrThrow({
                where: {
                    address: { equals: String(ctx.session?.user?.name) },
                },
                select: {
                    id: true,
                },
            })
            .catch(() => {
                return { id: '0' }
            })

        const proxyAddresses = await prisma.userProxy.findMany({
            where: {
                user: user,
            },
        })
        return proxyAddresses
    }),
    addProxy: publicProcedure
        .input(
            z.object({
                address: z.string().startsWith('0x').length(42),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = await prisma.user
                .findFirstOrThrow({
                    where: {
                        address: { equals: String(ctx.session?.user?.name) },
                    },
                    select: {
                        id: true,
                    },
                })
                .catch(() => {
                    return { id: '0' }
                })

            await prisma.userProxy.upsert({
                where: {
                    id: 'id',
                },
                update: {
                    address: input.address,
                    userId: user.id,
                },
                create: {
                    userId: user.id,
                    address: input.address,
                },
            })
        }),
    userRemoveProxy: publicProcedure
        .input(
            z.object({
                address: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = await prisma.user
                .findFirstOrThrow({
                    where: {
                        address: { equals: String(ctx.session?.user?.name) },
                    },
                    select: {
                        id: true,
                    },
                })
                .catch(() => {
                    return { id: '0' }
                })
            await prisma.userProxy.deleteMany({
                where: {
                    userId: user.id,
                    address: input.address,
                },
            })
        }),
    userProposals: publicProcedure.query(async ({ ctx }) => {
        const user = await prisma.user
            .findFirstOrThrow({
                where: {
                    address: { equals: String(ctx.session?.user?.name) },
                },
                select: {
                    id: true,
                },
            })
            .catch(() => {
                return { id: '0' }
            })

        const userSubscriptions = await prisma.subscription.findMany({
            where: {
                AND: {
                    userId: user?.id,
                },
            },
            select: {
                daoId: true,
            },
        })

        const userProposals = await prisma.proposal.findMany({
            where: {
                daoId: {
                    in: userSubscriptions.map((sub) => sub.daoId),
                },
            },
            include: {
                dao: {
                    include: {
                        handlers: {
                            select: {
                                type: true,
                            },
                        },
                    },
                },
                votes: {
                    where: {
                        userId: user?.id,
                    },
                    include: {
                        user: true,
                    },
                },
            },
        })

        return userProposals
    }),
    userDaos: publicProcedure.query(async ({ ctx }) => {
        const user = await prisma.user
            .findFirstOrThrow({
                where: {
                    address: { equals: String(ctx.session?.user?.name) },
                },
                select: {
                    id: true,
                },
            })
            .catch(() => {
                return { id: '0' }
            })

        const daosList = await prisma.dAO.findMany({
            where: {},
            orderBy: {
                id: 'asc',
            },
            distinct: 'id',
            include: {
                handlers: true,
                subscriptions: {
                    where: {
                        userId: { contains: user.id },
                    },
                },
            },
        })
        return daosList
    }),
    userSubscribe: publicProcedure
        .input(
            z.object({
                daoId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = await prisma.user
                .findFirstOrThrow({
                    where: {
                        address: { equals: String(ctx.session?.user?.name) },
                    },
                    select: {
                        id: true,
                    },
                })
                .catch(() => {
                    return { id: '0' }
                })

            await prisma.subscription
                .upsert({
                    where: {
                        userId_daoId: {
                            userId: user.id,
                            daoId: input.daoId,
                        },
                    },
                    update: {},
                    create: {
                        userId: user.id,
                        daoId: input.daoId,
                    },
                })
                .then((res) => {
                    return res
                })
        }),

    userUnsubscribe: publicProcedure
        .input(
            z.object({
                daoId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = await prisma.user
                .findFirstOrThrow({
                    where: {
                        address: { equals: String(ctx.session?.user?.name) },
                    },
                    select: {
                        id: true,
                    },
                })
                .catch(() => {
                    return { id: '0' }
                })

            await prisma.subscription
                .delete({
                    where: {
                        userId_daoId: {
                            userId: user.id,
                            daoId: input.daoId,
                        },
                    },
                })
                .then(() => {
                    return true
                })
        }),
})
