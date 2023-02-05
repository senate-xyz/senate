import { prisma, RefreshQueue, RefreshType } from '@senate/database'
import { loadConfig } from './config'
import { createVoterHandlers } from './createHandlers'
import { processSnapshotProposals } from './process/snapshotProposals'
import { processSnapshotDaoVotes } from './process/snapshotDaoVotes'
import { addSnapshotDaoVotes } from './populate/addSnapshotDaoVotes'
import { processChainProposals } from './process/chainProposals'
import { addChainDaoVotes } from './populate/addChainDaoVotes'
import { processChainDaoVotes } from './process/chainDaoVotes'
import { addChainProposalsToQueue } from './populate/addChainProposals'
import { addSnapshotProposalsToQueue } from './populate/addSnapshotProposals'
import { log_ref } from '@senate/axiom'

const main = async () => {
    log_ref.log({
        level: 'info',
        message: `Started refresher`
    })

    await loadConfig()
    await createVoterHandlers()

    setInterval(async () => {
        prismaLogs()
        await loadConfig()
        await createVoterHandlers()
    }, 1000)

    setInterval(async () => {
        await addSnapshotProposalsToQueue()
        await addSnapshotDaoVotes()

        await addChainProposalsToQueue()
        await addChainDaoVotes()
    }, 1000)

    while (true) {
        const start = Date.now()

        const item = await prisma.refreshQueue.findFirst({
            orderBy: { priority: 'desc' }
        })

        if (item) {
            processQueue(item)

            await prisma.refreshQueue.delete({
                where: { id: item?.id }
            })
        }

        while (Date.now() - start < 335) {
            await sleep(1)
        }
    }
}

const processQueue = async (item: RefreshQueue) => {
    switch (item.refreshType) {
        case RefreshType.DAOSNAPSHOTPROPOSALS:
            processSnapshotProposals(item)
            break

        case RefreshType.DAOSNAPSHOTVOTES: {
            processSnapshotDaoVotes(item)
            break
        }

        case RefreshType.DAOCHAINPROPOSALS: {
            processChainProposals(item)
            break
        }

        case RefreshType.DAOCHAINVOTES: {
            processChainDaoVotes(item)
            break
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
        prisma_pool_connections_opened_total: (
            await prisma.$metrics.json()
        ).counters.find(
            (metric) => metric.key == 'prisma_pool_connections_opened_total'
        )?.value,
        prisma_pool_connections_closed_total: (
            await prisma.$metrics.json()
        ).counters.find(
            (metric) => metric.key == 'prisma_pool_connections_closed_total'
        )?.value,

        prisma_pool_connections_open: (
            await prisma.$metrics.json()
        ).gauges.find((metric) => metric.key == 'prisma_pool_connections_open')
            ?.value,
        prisma_pool_connections_busy: (
            await prisma.$metrics.json()
        ).gauges.find((metric) => metric.key == 'prisma_pool_connections_busy')
            ?.value,
        prisma_pool_connections_idle: (
            await prisma.$metrics.json()
        ).gauges.find((metric) => metric.key == 'prisma_pool_connections_idle')
            ?.value,
        prisma_client_queries_active: (
            await prisma.$metrics.json()
        ).gauges.find((metric) => metric.key == 'prisma_client_queries_active')
            ?.value,
        prisma_client_queries_wait: (await prisma.$metrics.json()).gauges.find(
            (metric) => metric.key == 'prisma_client_queries_wait'
        )?.value
    })
