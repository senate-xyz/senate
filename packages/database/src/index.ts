import { Prisma, PrismaClient } from '@prisma/client'
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

    proxyAbi?: InterfaceAbi
    proxyAddress?: string

    //makerpools
    address_vote?: string
    address_create?: string
    abi_vote?: string
    abi_create?: string
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

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const p = globalForPrisma.prisma || new PrismaClient()

export const prisma = p
