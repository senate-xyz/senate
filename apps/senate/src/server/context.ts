import { type inferAsyncReturnType } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import { type Session } from 'next-auth'

import { getServerAuthSession } from './get-server-auth-session'
import { type PrismaClient, prisma } from '@senate/database'

type CreateContextOptions = {
    session: Session | null
    prisma: PrismaClient
}

export const createContextInner = async (opts: CreateContextOptions) => {
    return {
        session: opts.session,
        prisma: prisma
    }
}

export const createTrpcContext = async (opts?: CreateNextContextOptions) => {
    if (!opts) return Promise.resolve({ session: null, prisma: prisma })

    const { req, res } = opts

    // Get the session from the server using the unstable_getServerSession wrapper function
    const session = await getServerAuthSession({ req, res })

    return await createContextInner({
        session,
        prisma
    })
}

export type Context = inferAsyncReturnType<typeof createTrpcContext>
