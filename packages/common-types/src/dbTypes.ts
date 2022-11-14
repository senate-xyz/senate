import {
    Prisma,
    ProposalType as ProposalTypePrisma,
    DAOHandlerType as DAOHandlerTypePrisma,
    Subscription as SubscriptionModelPrisma,
    DAO as DAOModelPrisma,
    Proposal as ProposalModelPrisma,
    Vote as VoteModelPrisma,
    User as UserModelPrisma,
    DAOHandler as DAOHandlerModelPrisma,
    VoteOption as VoteOptionModelPrisma,
    RefreshStatus as RefreshStatusPrisma,
    Voter as VoterPrisma,
} from '@prisma/client'

export const ProposalType = ProposalTypePrisma
export const DAOHandlerType = DAOHandlerTypePrisma
export const RefreshStatus = RefreshStatusPrisma
export type DAO = DAOModelPrisma
export type Subscription = SubscriptionModelPrisma
export type Vote = VoteModelPrisma
export type Proposal = ProposalModelPrisma
export type User = UserModelPrisma
export type DAOHandler = DAOHandlerModelPrisma
export type VoteOption = VoteOptionModelPrisma
export type Voter = VoterPrisma

export type DAOType = Prisma.DAOGetPayload<{
    include: {
        handlers: true
        subscriptions: true
    }
}>

export type TrackerProposalType = Prisma.ProposalGetPayload<{
    include: {
        dao: true
        votes: true
    }
}>

export type SubscriptionWithProxies = Prisma.SubscriptionGetPayload<{
    include: {
        user: {
            select: {
                voters: true
            }
        }
    }
}>

export type PrismaJsonObject = Prisma.JsonObject
