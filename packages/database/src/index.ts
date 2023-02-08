import { Prisma, PrismaClient } from '@prisma/client'
import { IBackOffOptions, backOff } from 'exponential-backoff'
import { log_prisma } from '@senate/axiom'
import type { InterfaceAbi } from 'ethers'

export type { JsonArray, JsonValue } from 'type-fest'

export {
    type PrismaClient,
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

export type Decoder = {
    abi?: InterfaceAbi
    address?: string
    proposalUrl?: string
    space?: string

    //makerpools
    address_vote?: string
    address_create?: string
    abi_vote?: string
    abi_create?: string
}

export type ProposalType = Prisma.ProposalGetPayload<{
    include: { votes: true; dao: true }
}>

export type SubscriptionType = Prisma.SubscriptionGetPayload<{
    include: { dao: true }
}>

export type DAOHandlerWithDAO = Prisma.DAOHandlerGetPayload<{
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

function RetryTransactions(options?: Partial<IBackOffOptions>) {
    return Prisma.defineExtension((prisma) =>
        prisma.$extends({
            client: {
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

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const p = globalForPrisma.prisma || new PrismaClient()

export const prisma = p.$extends(
    RetryTransactions({
        jitter: 'full',
        numOfAttempts: 3
    })
)
