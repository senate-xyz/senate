import {
    type ArgumentsHost,
    Body,
    Catch,
    Controller,
    type ExceptionFilter,
    type HttpAdapterHost,
    HttpException,
    HttpStatus,
    ParseArrayPipe,
    Post
} from '@nestjs/common'
import { AppService } from './app.service'
import { log_pd } from '@senate/axiom'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: Error, host: ArgumentsHost): void {
        log_pd.log({
            level: 'error',
            message: `AllExceptionsFilter`,
            errorMessage: exception.message,
            errorStack: exception.stack
        })

        // In certain situations `httpAdapter` might not be available in the
        // constructor method, thus we should resolve it here.
        const { httpAdapter } = this.httpAdapterHost

        const ctx = host.switchToHttp()

        const httpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR

        const responseBody = {
            statusCode: httpStatus,
            timestamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(ctx.getRequest())
        }

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus)
    }
}

@Controller('api')
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Post('updateSnapshotDaoVotes')
    async updateSnapshotDaoVotes(
        @Body('daoHandlerId') daoHandlerId: string,
        @Body('voters', new ParseArrayPipe({ items: String, separator: '&' }))
        voters: string[]
    ) {
        const response = await this.appService.updateSnapshotDaoVotes(
            daoHandlerId,
            voters
        )

        return response
    }

    @Post('updateChainDaoVotes')
    async updateChainDaoVotes(
        @Body('daoHandlerId') daoHandlerId: string,
        @Body('voters', new ParseArrayPipe({ items: String, separator: '&' }))
        voters: string[]
    ) {
        const response = await this.appService.updateChainDaoVotes(
            daoHandlerId,
            voters
        )

        return response
    }

    @Post('updateSnapshotProposals')
    async updateSnapshotProposals(@Body('daoHandlerId') daoHandlerId: string) {
        const response = await this.appService.updateSnapshotProposals(
            daoHandlerId
        )

        return response
    }

    @Post('updateChainProposals')
    async updateChainProposals(@Body('daoHandlerId') daoHandlerId: string) {
        const response = await this.appService.updateChainProposals(
            daoHandlerId
        )

        return response
    }
}
