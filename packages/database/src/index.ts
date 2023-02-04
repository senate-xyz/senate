import type { Prisma } from '@prisma/client'

export * from './client'

export {
    type PrismaClient,
    type PrismaPromise,
    type Proposal,
    type Voter,
    type VoterHandler,
    type Vote,
    type Subscription,
    type RefreshQueue,
    type DAO,
    type Notification,
    type User,
    RefreshStatus,
    RefreshType,
    DAOHandlerType,
    RoundupNotificationType,
    type DAOHandler
} from '@prisma/client'

export type ProposalType = Prisma.ProposalGetPayload<{
    include: { votes: true; dao: true }
}>

export type SubscriptionType = Prisma.SubscriptionGetPayload<{
    include: { dao: true }
}>

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
