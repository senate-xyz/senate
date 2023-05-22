import { Prisma, PrismaClient } from '@prisma/client'
import { log_prisma } from '@senate/axiom'
import { type IBackOffOptions, backOff } from 'exponential-backoff'
export type { JsonArray, JsonValue } from 'type-fest'

export {
    type PrismaClient,
    type proposal as Proposal,
    type voter as Voter,
    type voterhandler as VoterHandler,
    type vote as Vote,
    type subscription as Subscription,
    type dao as DAO,
    type user as User,
    RefreshStatus,
    DAOHandlerType,
    ProposalState,
    MagicUserState,
    type daohandler as DAOHandler
} from '@prisma/client'

export type Decoder = {
    address?: string
    proposalUrl?: string
    space?: string

    //makerpools
    address_vote?: string
    address_create?: string
}

export type RefreshArgs = {
    voters: string[]
}

export type ProposalType = Prisma.proposalGetPayload<{
    include: { votes: true; dao: true }
}>

export type SubscriptionType = Prisma.subscriptionGetPayload<{
    include: { dao: true }
}>

export type DAOHandlerWithDAO = Prisma.daohandlerGetPayload<{
    include: { dao: true }
}>

export type DAOType = Prisma.daoGetPayload<{
    include: {
        handlers: true
        subscriptions: true
    }
}>

export type UserWithSubscriptionsAndVotingAddresses = Prisma.userGetPayload<{
    include: {
        subscriptions: true
        voters: true
    }
}>

export const Serializable = Prisma.TransactionIsolationLevel.Serializable

function RetryTransactions(options?: Partial<IBackOffOptions>) {
    return Prisma.defineExtension((prisma) =>
        prisma.$extends({
            client: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                $transaction(...args: any) {
                    return backOff(
                        // eslint-disable-next-line prefer-spread
                        () => prisma.$transaction.apply(prisma, args),
                        {
                            retry: (e) => {
                                // Retry the transaction only if the error was due to a write conflict or deadlock
                                // See: https://www.prisma.io/docs/reference/api-reference/error-reference#p2034
                                log_prisma.log({
                                    level: 'warn',
                                    message: `Retrying prisma transaction`,
                                    error: e
                                })
                                return e.code === 'P2034' || e.code === 'P1001'
                            },
                            ...options
                        }
                    )
                }
            } as { $transaction: (typeof prisma)['$transaction'] }
        })
    )
}

const extendedPrismaClient = () => {
    const prisma = new PrismaClient()

    const extendedPrisma = prisma.$extends(
        RetryTransactions({
            jitter: 'full',
            numOfAttempts: 5
        })
    )

    return extendedPrisma
}

export type ExtendedPrismaClient = ReturnType<typeof extendedPrismaClient>

/**
 * Instantiate prisma client for Next.js:
 * https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices#solution
 */

declare global {
    // eslint-disable-next-line no-var
    var prisma: ExtendedPrismaClient | undefined
}

export const prisma = global.prisma || extendedPrismaClient()

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma
}
