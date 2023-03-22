//import { log_ref } from '@senate/axiom'
import { prisma } from '@senate/database'
import { type NumberValue, scaleTime } from 'd3-scale'

export const thresholdsTime =
    (n: number) =>
    (
        _data: ArrayLike<Date>,
        min: Date | NumberValue,
        max: Date | NumberValue
    ) =>
        scaleTime().domain([min, max]).ticks(n)

export const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))

interface PrismaMetric {
    key: string
    value?: number
}

interface PrismaMetrics {
    counters: PrismaMetric[]
    gauges: PrismaMetric[]
}

export const prismaLogs = async () => {
    const metrics: PrismaMetrics = await prisma.$metrics.json()

    const logMetrics = {
        prisma_client_queries_total: metrics.counters.find(
            (metric) => metric.key === 'prisma_client_queries_total'
        )?.value,
        prisma_datasource_queries_total: metrics.counters.find(
            (metric) => metric.key === 'prisma_datasource_queries_total'
        )?.value,
        prisma_pool_connections_open: metrics.counters.find(
            (metric) => metric.key === 'prisma_pool_connections_open'
        )?.value,
        prisma_client_queries_active: metrics.gauges.find(
            (metric) => metric.key === 'prisma_client_queries_active'
        )?.value,
        prisma_client_queries_wait: metrics.gauges.find(
            (metric) => metric.key === 'prisma_client_queries_wait'
        )?.value,
        prisma_pool_connections_busy: metrics.gauges.find(
            (metric) => metric.key === 'prisma_pool_connections_busy'
        )?.value,
        prisma_pool_connections_idle: metrics.gauges.find(
            (metric) => metric.key === 'prisma_pool_connections_idle'
        )?.value,
        prisma_pool_connections_opened_total: metrics.gauges.find(
            (metric) => metric.key === 'prisma_pool_connections_opened_total'
        )?.value
    }

    // log_ref.log({
    //     level: 'info',
    //     message: 'Prisma metrics',
    //     ...logMetrics
    // })
}
