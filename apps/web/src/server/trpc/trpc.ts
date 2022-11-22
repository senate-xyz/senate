import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'

import { type Context } from './context'

const t = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter({ shape }) {
        return shape
    },
})

export const router = t.router

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure

/**
 * Reusable middleware to ensure
 * users are logged in
 */
const isAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
    }
    return next({
        ctx: {
            // infers the `session` as non-nullable
            session: { ...ctx.session, user: ctx.session.user },
        },
    })
})

/**
 * Protected procedure
 **/
export const protectedProcedure = t.procedure.use(isAuthed)

export type RpcResponse<Data> = RpcSuccessResponse<Data> | RpcErrorResponse

export type RpcSuccessResponse<Data> = {
    id: null
    result: { type: 'data'; data: Data }
}

export type RpcErrorResponse = {
    id: null
    error: {
        message: string
        code: number
        data: {
            code: string
            httpStatus: number
            stack: string
            path: string //TQuery
        }
    }
}

// According to JSON-RPC 2.0 and tRPC documentation.
// https://trpc.io/docs/rpc
export const jsonRpcSuccessResponse = (data: unknown) => ({
    id: null,
    result: { type: 'data', data },
})
