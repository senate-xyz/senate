import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    await app.listen(3100)
    console.log('detective api is running')
}
bootstrap()
