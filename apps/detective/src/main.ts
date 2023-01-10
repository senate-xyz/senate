import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { log_pd } from '@senate/axiom'

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
}
bootstrap()
