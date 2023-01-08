import { Controller, Get, Post, Query } from '@nestjs/common'
import { AppService } from './app.service'
import { DAOHandlerType, prisma } from '@senate/database'
import { log_pd } from '@senate/axiom'
import { ethers } from 'ethers'

const provider = new ethers.providers.JsonRpcProvider({
    url: String(process.env.PROVIDER_URL)
})

@Controller('api')
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('block')
    async block() {
        const block = await provider.getBlock(await provider.blockNumber)
        return { block: block, timestamp: new Date() }
    }

    @Post('updateSnapshotProposals')
    async updateSnapshotProposals(
        @Query('daoHandlerIds') daoHandlerIds: string[],
        @Query('minCreatedAt') minCreatedAt: number
    ) {
        log_pd.log({
            level: 'info',
            message: `/updateSnapshotProposals request`,
            data: {
                daoHandlerIds: daoHandlerIds,
                minCreatedAt: minCreatedAt
            }
        })

        const response = await this.appService.updateSnapshotProposals(
            daoHandlerIds,
            minCreatedAt
        )

        log_pd.log({
            level: 'info',
            message: `/updateSnapshotProposals response`,
            data: {
                response: response
            }
        })
        return response
    }

    @Post('updateSnapshotDaoVotes')
    async updateSnapshotDaoVotes(
        @Query('daoHandlerId') daoHandlerId: string,
        @Query('voters') voters: [string]
    ) {
        log_pd.log({
            level: 'info',
            message: `/updateSnapshotDaoVotes request`,
            data: {
                daoHandlerId: daoHandlerId,
                voters: voters
            }
        })

        const response = await this.appService.updateSnapshotDaoVotes(
            daoHandlerId,
            voters
        )

        log_pd.log({
            level: 'info',
            message: `/updateSnapshotProposals response`,
            data: {
                response: response
            }
        })
        return response
    }

    @Post('updateChainProposals')
    async updateChainProposals(
        @Query('daoHandlerId') daoHandlerId: string,
        @Query('minBlockNumber') minBlockNumber: number
    ) {
        log_pd.log({
            level: 'info',
            message: `/updateChainProposals request`,
            data: {
                daoHandlerId: daoHandlerId,
                minBlockNumber: minBlockNumber
            }
        })

        let response = [{ daoHandlerId: daoHandlerId, response: 'nok' }]

        response = await this.appService.updateChainProposals(
            daoHandlerId,
            minBlockNumber
        )

        log_pd.log({
            level: 'info',
            message: `/updateChainProposals response`,
            data: {
                response: response
            }
        })
        return response
    }

    @Post('updateChainDaoVotes')
    async updateChainDaoVotes(
        @Query('daoHandlerId') daoHandlerId: string,
        @Query('voters') voters: [string]
    ) {
        log_pd.log({
            level: 'info',
            message: `/updateChainDaoVotes request`,
            data: {
                daoHandlerId: daoHandlerId,
                voters: voters
            }
        })

        const response = await this.appService.updateChainDaoVotes(
            daoHandlerId,
            voters
        )

        log_pd.log({
            level: 'info',
            message: `/updateChainDaoVotes response`,
            data: {
                response: response
            }
        })

        return response
    }
}
