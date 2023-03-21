import { log_ref } from '@senate/axiom'
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

export const prismaLogs = async () =>
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
