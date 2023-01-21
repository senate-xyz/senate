import {
    ArgumentsHost,
    Catch,
    Controller,
    ExceptionFilter,
    HttpAdapterHost,
    HttpException,
    HttpStatus,
    ParseArrayPipe,
    Post,
    Query
} from '@nestjs/common'
import { AppService } from './app.service'
import { log_pd } from '@senate/axiom'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: unknown, host: ArgumentsHost): void {
        log_pd.log({
            level: 'error',
            message: `AllExceptionsFilter`,
            error: exception
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
        @Query('daoHandlerId') daoHandlerId: string,
        @Query('voters', new ParseArrayPipe({ items: String, separator: '&' }))
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
        @Query('daoHandlerId') daoHandlerId: string,
        @Query('voters', new ParseArrayPipe({ items: String, separator: '&' }))
        voters: string[]
    ) {
        const response = await this.appService.updateChainDaoVotes(
            daoHandlerId,
            voters
        )

        return response
    }

    @Post('updateSnapshotProposals')
    async updateSnapshotProposals(
        @Query('daoHandlerId') daoHandlerId: string,
        @Query('minCreatedAt') minCreatedAt: number
    ) {
        const response = await this.appService.updateSnapshotProposals(
            daoHandlerId,
            minCreatedAt
        )

        return response
    }

    @Post('updateChainProposals')
    async updateChainProposals(
        @Query('daoHandlerId') daoHandlerId: string,
        @Query('minBlockNumber') minBlockNumber: number
    ) {
        const response = await this.appService.updateChainProposals(
            daoHandlerId,
            minBlockNumber
        )

        return response
    }
}
