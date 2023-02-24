import { prisma } from '@senate/database'
import { loadConfig, REFRESH_PROCESS_INTERVAL_MS } from './config'
import { createVoterHandlers } from './createHandlers'
import { processSnapshotProposals } from './process/snapshotProposals'
import { processSnapshotDaoVotes } from './process/snapshotDaoVotes'
import { processChainProposals } from './process/chainProposals'
import { processChainDaoVotes } from './process/chainDaoVotes'
import { log_ref } from '@senate/axiom'
import { addSnapshotDaoVotes } from './populate/addSnapshotDaoVotes'
import { addSnapshotProposalsToQueue } from './populate/addSnapshotProposals'
import { addChainDaoVotes } from './populate/addChainDaoVotes'
import { addChainProposalsToQueue } from './populate/addChainProposals'

const main = async () => {
    log_ref.log({
        level: 'info',
        message: `Started refresher`
    })

    await loadConfig()
    await createVoterHandlers()

    setInterval(async () => {
        await prismaLogs()
    }, 10000)

    setInterval(async () => {
        await loadConfig()
        await createVoterHandlers()

        await addSnapshotProposalsToQueue()
        await addSnapshotDaoVotes()

        await addChainProposalsToQueue()
        await addChainDaoVotes()
    }, 1000)

    while (true) {
        const start = Date.now()

        const hasQueue = await prisma.refreshQueue.count()

        if (hasQueue) {
            processSnapshotProposals()
            processSnapshotDaoVotes()
            processChainProposals()
            processChainDaoVotes()
        }

        while (Date.now() - start < REFRESH_PROCESS_INTERVAL_MS) {
            await sleep(10)
        }
    }
}

main()

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const prismaLogs = async () =>
    log_ref.log({
        level: 'info',
        message: 'Prisma metrics',

        prisma_client_queries_total: (
            await prisma.$metrics.json()
        ).counters.find((metric) => metric.key == 'prisma_client_queries_total')
            ?.value,
        prisma_datasource_queries_total: (
            await prisma.$metrics.json()
        ).counters.find(
            (metric) => metric.key == 'prisma_datasource_queries_total'
        )?.value,
        prisma_pool_connections_open: (
            await prisma.$metrics.json()
        ).counters.find(
            (metric) => metric.key == 'prisma_pool_connections_open'
        )?.value,

        prisma_client_queries_active: (
            await prisma.$metrics.json()
        ).gauges.find((metric) => metric.key == 'prisma_client_queries_active')
            ?.value,
        prisma_client_queries_wait: (await prisma.$metrics.json()).gauges.find(
            (metric) => metric.key == 'prisma_client_queries_wait'
        )?.value,
        prisma_pool_connections_busy: (
            await prisma.$metrics.json()
        ).gauges.find((metric) => metric.key == 'prisma_pool_connections_busy')
            ?.value,
        prisma_pool_connections_idle: (
            await prisma.$metrics.json()
        ).gauges.find((metric) => metric.key == 'prisma_pool_connections_idle')
            ?.value,
        prisma_pool_connections_opened_total: (
            await prisma.$metrics.json()
        ).gauges.find(
            (metric) => metric.key == 'prisma_pool_connections_opened_total'
        )?.value
    })
