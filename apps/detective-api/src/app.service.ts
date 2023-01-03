import { Injectable, Logger } from '@nestjs/common'

// import { DAOHandlerType } from '@prisma/client'
// import { updateGovernorBravoProposals } from './proposals/governorBravoProposals'
// import { updateMakerPolls } from './proposals/makerPolls'
// import { updateMakerProposals } from './proposals/makerProposals'
import { updateSnapshotProposals } from './proposals/snapshotProposals'
import { updateSnapshotDaoVotes } from './votes/snapshotDaoVotes'
import { updateAaveChainProposals } from './proposals/aaveChainProposals'
import { updateUniswapChainProposals } from './proposals/uniswapChainProposals'
import { updateCompoundChainProposals } from './proposals/compoundChainProposals'
import { updateMakerChainProposals } from './proposals/makerChainProposals'
import { updateMakerChainPolls } from './proposals/makerChainPolls'
// import { updateGovernorBravoVotes } from './votes/governorBravoVotes'
// import { updateMakerPollVotes } from './votes/makerPollVotes'
// import { updateMakerVotes } from './votes/makerVotes'
// import { updateSnapshotVotes } from './votes/snapshotVotes'

@Injectable()
export class AppService {
    private readonly logger = new Logger(AppService.name)

    async updateSnapshotProposals(
        daoHandlerIds: string[],
        minCreatedAt: number
    ): Promise<Array<{ daoHandlerId: string; response: string }>> {
        return await updateSnapshotProposals(daoHandlerIds, minCreatedAt)
    }

    async updateSnapshotDaoVotes(
        daoHandlerId: string,
        voters: [string]
    ): Promise<Array<{ voterAddress: string; response: string }>> {
        return await updateSnapshotDaoVotes(daoHandlerId, voters)
    }

    async updateAaveChainProposals(
        daoHandlerId: string,
        minBlockNumber: number
    ): Promise<Array<{ daoHandlerId: string; response: string }>> {
        return await updateAaveChainProposals(daoHandlerId, minBlockNumber)
    }

    async updateCompoundChainProposals(
        daoHandlerId: string,
        minBlockNumber: number
    ): Promise<Array<{ daoHandlerId: string; response: string }>> {
        return await updateCompoundChainProposals(daoHandlerId, minBlockNumber)
    }

    async updateUniswapChainProposals(
        daoHandlerId: string,
        minBlockNumber: number
    ): Promise<Array<{ daoHandlerId: string; response: string }>> {
        return await updateUniswapChainProposals(daoHandlerId, minBlockNumber)
    }

    async updateMakerChainProposals(
        daoHandlerId: string,
        minBlockNumber: number
    ): Promise<Array<{ daoHandlerId: string; response: string }>> {
        return await updateMakerChainProposals(daoHandlerId, minBlockNumber)
    }

    async updateMakerChainPolls(
        daoHandlerId: string,
        minBlockNumber: number
    ): Promise<Array<{ daoHandlerId: string; response: string }>> {
        return await updateMakerChainPolls(daoHandlerId, minBlockNumber)
    }
}
