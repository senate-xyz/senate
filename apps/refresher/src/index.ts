import { config, loadConfig } from './config'
import { createVoterHandlers } from './createHandlers'
import { addChainProposalsToQueue } from './populate/addChainProposals'
import { addChainDaoVotes } from './populate/addChainDaoVotes'
import { addSnapshotDaoVotes } from './populate/addSnapshotDaoVotes'
import { addSnapshotProposalsToQueue } from './populate/addSnapshotProposals'
import { scheduleJob } from 'node-schedule'
import { log_ref } from '@senate/axiom'
import { Prisma, PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

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
import type { InterfaceAbi } from 'ethers'
import { processChainDaoVotes } from './process/chainDaoVotes'
import { processChainProposals } from './process/chainProposals'
import { processSnapshotDaoVotes } from './process/snapshotDaoVotes'
import { processSnapshotProposals } from './process/snapshotProposals'

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

const main = async () => {
    log_ref.log({
        level: 'info',
        message: `Started refresher`
    })

    await loadConfig()
    await createVoterHandlers()

    scheduleJob('* * * * * *', async () => {
        await createVoterHandlers()

        await addSnapshotProposalsToQueue()
        await addSnapshotDaoVotes()

        await addChainProposalsToQueue()
        await addChainDaoVotes()
    })

    setInterval(async () => {
        const hasQueue = await prisma.refreshQueue.count()

        if (hasQueue) {
            processSnapshotProposals()
            processSnapshotDaoVotes()
            processChainProposals()
            processChainDaoVotes()
        }
    }, config.REFRESH_PROCESS_INTERVAL_MS)
}

main()
