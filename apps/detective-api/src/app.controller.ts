import { Controller, Logger, Post, Query } from '@nestjs/common'
import { AppService } from './app.service'
import { DAOHandlerType, prisma } from '@senate/database'

@Controller('api')
export class AppController {
    private readonly logger = new Logger(AppController.name)

    constructor(private readonly appService: AppService) {}

    @Post('updateSnapshotProposals')
    async updateSnapshotProposals(
        @Query('daoHandlerIds') daoHandlerIds: string[],
        @Query('minCreatedAt') minCreatedAt: number
    ) {
        const response = await this.appService.updateSnapshotProposals(
            daoHandlerIds,
            minCreatedAt
        )
        return response
    }

    @Post('updateSnapshotDaoVotes')
    async updateSnapshotDaoVotes(
        @Query('daoHandlerId') daoHandlerId: string,
        @Query('voters') voters: [string]
    ) {
        const response = await this.appService.updateSnapshotDaoVotes(
            daoHandlerId,
            voters
        )
        return response
    }

    @Post('updateChainProposals')
    async updateChainProposals(
        @Query('daoHandlerId') daoHandlerId: string,
        @Query('minBlockNumber') minBlockNumber: number
    ) {
        let response = [{ daoHandlerId: daoHandlerId, response: 'nok' }]

        const daoHandler = await prisma.dAOHandler.findFirst({
            where: {
                id: daoHandlerId
            }
        })

        switch (daoHandler.type) {
            case DAOHandlerType.AAVE_CHAIN:
                response = await this.appService.updateAaveChainProposals(
                    daoHandlerId,
                    minBlockNumber
                )
                break
            case DAOHandlerType.COMPOUND_CHAIN:
                response = await this.appService.updateCompoundChainProposals(
                    daoHandlerId,
                    minBlockNumber
                )
                break
            case DAOHandlerType.MAKER_EXECUTIVE:
                response = await this.appService.updateMakerChainProposals(
                    daoHandlerId,
                    minBlockNumber
                )
                break
            case DAOHandlerType.MAKER_POLL_CREATE:
                response = await this.appService.updateMakerChainPolls(
                    daoHandlerId,
                    minBlockNumber
                )
                break
            case DAOHandlerType.UNISWAP_CHAIN:
                response = await this.appService.updateUniswapChainProposals(
                    daoHandlerId,
                    minBlockNumber
                )
                break
        }

        return response
        //return response
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
