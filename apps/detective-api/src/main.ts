import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { axiom } from '@senate/axiom'

const PORT = process.env.PORT || 3100

async function bootstrap() {
    ;(BigInt.prototype as any).toJSON = function () {
        return this.toString()
    }

    const app = await NestFactory.create(AppModule, {
        logger: console
    })
    await app.listen(PORT)

    await axiom.datasets.ingestEvents(
        `proposal-detective-${process.env.AXIOM_DEPLOYMENT}`,
        [
            {
                event: 'start',
                details: `detective-start`,
                item: { message: `Detective API running on port ${PORT}... ` }
            }
        ]
    )
}
bootstrap()
