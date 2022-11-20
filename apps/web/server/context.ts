import { type inferAsyncReturnType } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import { type Session } from 'next-auth'
import { getAuthOptions as nextAuthOptions } from '../pages/api/auth/[...nextauth]'
import { unstable_getServerSession } from 'next-auth'
import { prisma } from '@senate/database'
import * as trpcNext from '@trpc/server/adapters/next'
import { getUser, User } from '../server-rsc/getUser'

type CreateContextOptions = {
    session: Session | null
}

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://beta.create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
    return {
        session: opts.session,
        prisma,
    }
}

export async function createContext(
    opts: // HACKs because we can't import `next/cookies` in `/api`-routes
    | {
              type: 'rsc'
              getUser: typeof getUser
          }
        | (trpcNext.CreateNextContextOptions & { type: 'api' })
) {
    // for API-response caching see https://trpc.io/docs/caching

    if (opts.type === 'rsc') {
        // RSC
        return {
            type: opts.type,
            user: await opts.getUser(),
        }
    }
    const authOptions = nextAuthOptions(opts.req)
    const session = await unstable_getServerSession(
        opts.req,
        opts.res,
        authOptions
    )

    return {
        type: opts.type,
        user: session?.user,
    }
}

export type Context = inferAsyncReturnType<typeof createContext>
