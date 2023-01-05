import { Injectable } from '@nestjs/common'

import { updateSnapshotProposals } from './proposals/snapshotProposals'
import { updateSnapshotDaoVotes } from './votes/snapshotDaoVotes'
import { updateAaveChainProposals } from './proposals/aaveChainProposals'
import { updateUniswapChainProposals } from './proposals/uniswapChainProposals'
import { updateCompoundChainProposals } from './proposals/compoundChainProposals'
import { updateMakerChainExecutiveProposals } from './proposals/makerChainExecutiveProposals'
import { updateMakerChainPolls } from './proposals/makerChainPolls'
import { updateAaveChainDaoVotes } from './votes/aaveChainDaoVotes'
import { updateCompoundChainDaoVotes } from './votes/compoundChainDaoVotes'
import { updateMakerExecutiveChainDaoVotes } from './votes/makerExecutiveChainDaoVotes'
import { updateMakerPollChainDaoVotes } from './votes/makerPollChainDaoVotes'
import { updateUniswapChainDaoVotes } from './votes/uniswapChainDaoVotes'

@Injectable()
export class AppService {
    //SNAPSHOT PROPOSALS

    async updateSnapshotProposals(
        daoHandlerIds: string[],
        minCreatedAt: number
    ): Promise<Array<{ daoHandlerId: string; response: string }>> {
        return await updateSnapshotProposals(daoHandlerIds, minCreatedAt)
    }

    //SNAPSHOT VOTES
    async updateSnapshotDaoVotes(
        daoHandlerId: string,
        voters: [string]
    ): Promise<Array<{ voterAddress: string; response: string }>> {
        return await updateSnapshotDaoVotes(daoHandlerId, voters)
    }

    //CHAIN PROPOSALS

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

    async updateMakerChainExecutiveProposals(
        daoHandlerId: string,
        minBlockNumber: number
    ): Promise<Array<{ daoHandlerId: string; response: string }>> {
        return await updateMakerChainExecutiveProposals(
            daoHandlerId,
            minBlockNumber
        )
    }

    async updateMakerChainPolls(
        daoHandlerId: string,
        minBlockNumber: number
    ): Promise<Array<{ daoHandlerId: string; response: string }>> {
        return await updateMakerChainPolls(daoHandlerId, minBlockNumber)
    }

    //CHAIN VOTES

    async updateAaveChainDaoVotes(
        daoHandlerId: string,
        voters: [string]
    ): Promise<Array<{ voterAddress: string; response: string }>> {
        return await updateAaveChainDaoVotes(daoHandlerId, voters)
    }

    async updateCompoundChainDaoVotes(
        daoHandlerId: string,
        voters: [string]
    ): Promise<Array<{ voterAddress: string; response: string }>> {
        return await updateCompoundChainDaoVotes(daoHandlerId, voters)
    }

    async updateMakerExecutiveChainDaoVotes(
        daoHandlerId: string,
        voters: [string]
    ): Promise<Array<{ voterAddress: string; response: string }>> {
        return await updateMakerExecutiveChainDaoVotes(daoHandlerId, voters)
    }

    async updateMakerPollChainDaoVotes(
        daoHandlerId: string,
        voters: [string]
    ): Promise<Array<{ voterAddress: string; response: string }>> {
        return await updateMakerPollChainDaoVotes(daoHandlerId, voters)
    }

    async updateUniswapChainDaoVotes(
        daoHandlerId: string,
        voters: [string]
    ): Promise<Array<{ voterAddress: string; response: string }>> {
        return await updateUniswapChainDaoVotes(daoHandlerId, voters)
    }
}
