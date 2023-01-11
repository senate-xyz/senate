import { router } from '../../trpc'

import { trpcAppRouter } from '../trpcAppRouter'
import { userProposalsRouter } from './proposals'
import { userSubscriptionsRouter } from './subscriptions'
import { userSettingsRouter } from './settings'
import { userVotesRouter } from './votes'

export const userRouter = router({
    proposals: userProposalsRouter,
    subscriptions: userSubscriptionsRouter,
    settings: userSettingsRouter,
    votes: userVotesRouter
})

// export type definition of API
export type UserRouter = typeof trpcAppRouter
