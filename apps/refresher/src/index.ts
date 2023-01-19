import { prisma, RefreshType } from '@senate/database'
import * as cron from 'node-cron'
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

let RUNNING_PROCESS_QUEUE = false

const main = async () => {
    log_ref.log({
        level: 'info',
        message: `Started refresher`
    })
    await loadConfig()

    setInterval(async () => {
        processQueue()
    }, 1000)

    cron.schedule('*/10 * * * * *', async () => {
        log_ref.log({
            level: 'info',
            message: 'Prisma metrics',
            data: {
                prisma_client_queries_total: (
                    await prisma.$metrics.json()
                ).counters.find(
                    (metric) => metric.key == 'prisma_client_queries_total'
                )?.value,
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
                ).gauges.find(
                    (metric) => metric.key == 'prisma_client_queries_active'
                )?.value,
                prisma_client_queries_wait: (
                    await prisma.$metrics.json()
                ).gauges.find(
                    (metric) => metric.key == 'prisma_client_queries_wait'
                )?.value,
                prisma_pool_connections_busy: (
                    await prisma.$metrics.json()
                ).gauges.find(
                    (metric) => metric.key == 'prisma_pool_connections_busy'
                )?.value,
                prisma_pool_connections_idle: (
                    await prisma.$metrics.json()
                ).gauges.find(
                    (metric) => metric.key == 'prisma_pool_connections_idle'
                )?.value,
                prisma_pool_connections_opened_total: (
                    await prisma.$metrics.json()
                ).gauges.find(
                    (metric) =>
                        metric.key == 'prisma_pool_connections_opened_total'
                )?.value
            }
        })
        await loadConfig()

        await createVoterHandlers()

        await addSnapshotProposalsToQueue()
        await addSnapshotDaoVotes()

        //await addChainProposalsToQueue()
        //await addChainDaoVotes()
    })
}

const processQueue = async () => {
    if (RUNNING_PROCESS_QUEUE == true) return
    RUNNING_PROCESS_QUEUE = true

    const item = await prisma.refreshQueue.findFirst({
        orderBy: { priority: 'desc' }
    })

    if (!item) {
        RUNNING_PROCESS_QUEUE = false
        return
    }

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

    await prisma.refreshQueue.delete({
        where: { id: item?.id }
    })

    RUNNING_PROCESS_QUEUE = false
}

main()
