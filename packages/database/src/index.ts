import { Prisma, PrismaClient } from '@prisma/client'
import { log_prisma } from '@senate/axiom'

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
    address?: string
    proposalUrl?: string
    space?: string

    proxyAddress?: string

    //makerpools
    address_vote?: string
    address_create?: string
}

export type RefreshArgs = {
    voters: string[]
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

function RetryTransactions() {
    return Prisma.defineExtension((prisma) =>
        prisma.$extends({
            client: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                $transaction(...args: any) {
                    // eslint-disable-next-line prefer-spread
                    let retries = 3

                    while (retries) {
                        try {
                            // eslint-disable-next-line prefer-spread
                            prisma.$transaction.apply(prisma, args)
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        } catch (e: any) {
                            log_prisma.log({
                                level: 'warn',
                                message: `Retrying prisma transaction - attempt ${retries}`,
                                error: e
                            })
                            if (e.code === 'P2034' || e.code === 'P1001')
                                retries--
                            if (!retries) {
                                throw e
                            }
                        }
                    }
                }
            } as { $transaction: (typeof prisma)['$transaction'] }
        })
    )
}

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const p = globalForPrisma.prisma || new PrismaClient()

export const prisma = p.$extends(RetryTransactions())
