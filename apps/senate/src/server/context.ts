import type * as trpc from '@trpc/server'
import type * as trpcNext from '@trpc/server/adapters/next'
import { getAuth } from '@clerk/nextjs/server'
import type {
    SignedInAuthObject,
    SignedOutAuthObject
} from '@clerk/nextjs/dist/api'

interface AuthContext {
    auth: SignedInAuthObject | SignedOutAuthObject
}

export const createContextInner = async ({ auth }: AuthContext) => {
    return {
        auth
    }
}
5
export const createContext = async (
    opts: trpcNext.CreateNextContextOptions
) => {
    return await createContextInner({ auth: getAuth(opts.req) })
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>
