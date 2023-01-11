import { type inferAsyncReturnType } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import { type Session } from 'next-auth'

import { getServerAuthSession } from '../common/get-server-auth-session'
import { prismaNextjs } from '@senate/database'

type CreateContextOptions = {
    session: Session | null
}

export const createContextInner = async (opts: CreateContextOptions) => {
    return {
        session: opts.session,
        prismaNextjs
    }
}

export const createTrpcContext = async (opts: CreateNextContextOptions) => {
    const { req, res } = opts

    // Get the session from the server using the unstable_getServerSession wrapper function
    const session = await getServerAuthSession({ req, res })

    return await createContextInner({
        session
    })
}

export type Context = inferAsyncReturnType<typeof createTrpcContext>
