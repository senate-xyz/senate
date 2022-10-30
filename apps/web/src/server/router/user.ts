import { createProtectedRouter } from './context'
import { prisma } from '@senate/database'
import { z } from 'zod'

const queryUserProxyAddreses = {
    async resolve({ ctx }) {
        const user = await prisma.user
            .findFirstOrThrow({
                where: {
                    address: { equals: String(ctx.session.user.name) },
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
    },
}

const mutationUserAddProxy = {
    input: z.object({
        address: z.string().startsWith('0x').length(42),
    }),
    async resolve({ ctx, input }) {
        const user = await prisma.user
            .findFirstOrThrow({
                where: {
                    address: { equals: String(ctx.session.user.name) },
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
    },
}

const mutationUserRemoveProxy = {
    input: z.object({
        address: z.string(),
    }),
    async resolve({ ctx, input }) {
        const user = await prisma.user
            .findFirstOrThrow({
                where: {
                    address: { equals: String(ctx.session.user.name) },
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
    },
}

const queryUserProposals = {
    async resolve({ ctx }) {
        const user = await prisma.user
            .findFirstOrThrow({
                where: {
                    address: { equals: String(ctx.session.user.name) },
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
    },
}
const queryUserDaos = {
    async resolve({ ctx }) {
        const user = await prisma.user
            .findFirstOrThrow({
                where: {
                    address: { equals: String(ctx.session.user.name) },
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
    },
}
const mutationUserSubscribe = {
    input: z.object({
        daoId: z.string(),
    }),
    async resolve({ ctx, input }) {
        const user = await prisma.user
            .findFirstOrThrow({
                where: {
                    address: { equals: String(ctx.session.user.name) },
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
    },
}
const mutationUserUnsubscribe = {
    input: z.object({
        daoId: z.string(),
    }),
    async resolve({ ctx, input }) {
        const user = await prisma.user
            .findFirstOrThrow({
                where: {
                    address: { equals: String(ctx.session.user.name) },
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
    },
}
// Example router with queries that can only be hit if the user requesting is signed in
export const userRouter = createProtectedRouter()
    .query('getSession', {
        resolve({ ctx }) {
            return ctx.session
        },
    })
    .query('proposals', queryUserProposals)
    .query('daos', queryUserDaos)
    .mutation('subscribe', mutationUserSubscribe)
    .mutation('unsubscribe', mutationUserUnsubscribe)
    .query('proxyAddresses', queryUserProxyAddreses)
    .mutation('addProxy', mutationUserAddProxy)
    .mutation('removeProxy', mutationUserRemoveProxy)
