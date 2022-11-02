import { Controller, Logger, Post, Query } from '@nestjs/common'
import { AppService } from './app.service'

@Controller('api')
export class AppController {
    private readonly logger = new Logger(AppController.name)

    constructor(private readonly appService: AppService) {}

    @Post('updateProposals')
    async updateProposals(@Query('daoId') daoId: string) {
        await this.appService.updateProposals(daoId)
        return 'OK'
    }

    @Post('updateVotes')
    async updateVotes(
        @Query('daoId') daoId: string,
        @Query('voterAddress') voterAddress: string
    ) {
        await this.appService.updateVotes(daoId, voterAddress)
        return 'OK'
    }
}
