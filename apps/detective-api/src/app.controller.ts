import { Controller, Logger, Post, Query } from '@nestjs/common'
import { AppService } from './app.service'

@Controller('api')
export class AppController {
    private readonly logger = new Logger(AppController.name)

    constructor(private readonly appService: AppService) {}

    @Post('updateSnapshotProposals')
    async updateProposals(
        @Query('daoHandlerIds') daoHandlerIds: string[],
        @Query('minCreatedAt') minCreatedAt: number
    ) {
        const response = await this.appService.updateSnapshotProposals(
            daoHandlerIds,
            minCreatedAt
        )
        return response
    }

    // @Post('updateVotes')
    // async updateVotes(
    //     @Query('daoId') daoId: string,
    //     @Query('voterAddress') voterAddress: string
    // ) {
    //     await this.appService.updateVotes(daoId, voterAddress)
    //     return 'OK'
    // }
}
