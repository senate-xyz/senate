import { initTRPC, TRPCError } from '@trpc/server'

import { type Context } from './context'

export const t = initTRPC.context<Context>().create()

export const router = t.router

const isAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
    }
    return next({
        ctx: {
            session: { ...ctx.session, user: ctx.session.user }
        }
    })
})

export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(isAuthed)
