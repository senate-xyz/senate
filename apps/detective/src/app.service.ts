import { Injectable } from '@nestjs/common'

import { updateSnapshotProposals } from './proposals/snapshotProposals'
import { updateSnapshotDaoVotes } from './votes/snapshotDaoVotes'
import { updateChainProposals } from './proposals/chainProposals'
import { updateChainDaoVotes } from './votes/chainDaoVotes'

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
        voters: string[]
    ): Promise<Array<{ voterAddress: string; response: string }>> {
        return await updateSnapshotDaoVotes(daoHandlerId, voters)
    }

    //CHAIN PROPOSALS
    async updateChainProposals(
        daoHandlerId: string,
        minBlockNumber: number
    ): Promise<Array<{ daoHandlerId: string; response: string }>> {
        return await updateChainProposals(daoHandlerId, minBlockNumber)
    }

    //CHAIN VOTES
    async updateChainDaoVotes(
        daoHandlerId: string,
        voters: string[]
    ): Promise<Array<{ voterAddress: string; response: string }>> {
        return await updateChainDaoVotes(daoHandlerId, voters)
    }
}
