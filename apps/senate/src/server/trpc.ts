import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'

import { type Context } from './context'

const tc = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter({ shape }) {
        return shape
    }
})

export const router = tc.router

const isAuthed = tc.middleware(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
    }
    return next({
        ctx: {
            session: { ...ctx.session, user: ctx.session.user }
        }
    })
})

export const publicProcedure = tc.procedure
export const protectedProcedure = tc.procedure.use(isAuthed)
