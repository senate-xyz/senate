import { router } from '../../trpc'

import { appRouter } from '../_app'
import { userProposalsRouter } from './proposals'
import { userSubscriptionsRouter } from './subscriptions'
import { userVotersRouter } from './voters'
import { userVotesRouter } from './votes'

export const userRouter = router({
    proposals: userProposalsRouter,
    subscriptions: userSubscriptionsRouter,
    voters: userVotersRouter,
    votes: userVotesRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
