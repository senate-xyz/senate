import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { log_pd } from '@senate/axiom'

const PORT = process.env.PORT || 3100

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    const server = await app.listen(PORT)
    server.setTimeout(1800000)

    log_pd.log({
        level: 'info',
        message: 'Started detective',
        data: {
            port: PORT
        }
    })
}
bootstrap()
