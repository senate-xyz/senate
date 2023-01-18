import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { log_pd } from '@senate/axiom'
import { prisma } from '@senate/database'

const PORT = process.env.PORT || 3100

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    await app.listen(PORT)

    log_pd.log({
        level: 'info',
        message: 'Started detective',
        data: {
            port: PORT
        }
    })

    setInterval(async () => {
        log_pd.log({
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
    }, 1000 * 10)
}
bootstrap()
