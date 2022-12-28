import { Prisma } from '@prisma/client'

export * from './client'

export {
    type Proposal,
    type Voter,
    type Subscription,
    RefreshStatus,
    DAOHandlerType,
    RoundupNotificationType,
    type DAOHandler,
} from '@prisma/client'

export type DAOType = Prisma.DAOGetPayload<{
    include: {
        handlers: true
        subscriptions: true
    }
}>

export type UserWithVotingAddresses = Prisma.UserGetPayload<{
    include: {
        voters: true
    }
}>
