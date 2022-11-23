import {
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common'

import { DAOHandlerType } from '@prisma/client'
import { updateGovernorBravoProposals } from './proposals/governorBravoProposals'
import { updateMakerPolls } from './proposals/makerPolls'
import { updateMakerProposals } from './proposals/makerProposals'
import { updateSnapshotProposals } from './proposals/snapshotProposals'
import { updateGovernorBravoVotes } from './votes/governorBravoVotes'
import { updateMakerPollVotes } from './votes/makerPollVotes'
import { updateMakerVotes } from './votes/makerVotes'
import { updateSnapshotVotes } from './votes/snapshotVotes'

import { prisma } from '@senate/database'
import { RefreshStatus } from '@senate/common-types'

@Injectable()
export class AppService {
    private readonly logger = new Logger(AppService.name)

    async updateProposals(daoId: string) {
        const dao = await prisma.dAO
            .findFirstOrThrow({
                where: {
                    id: daoId,
                },
                include: {
                    handlers: true,
                    subscriptions: true,
                },
            })
            .catch((err) => {
                this.logger.error(err)
                throw new InternalServerErrorException()
            })

        if (!dao) {
            throw new NotFoundException('DAO not found')
        }

        for (const handler of dao.handlers) {
            this.logger.log(
                `Fetching proposals for ${dao.name}, handler: ${handler.type}.`
            )

            switch (handler.type) {
                case DAOHandlerType.SNAPSHOT:
                    await updateSnapshotProposals(dao.name, handler)
                    break

                case DAOHandlerType.BRAVO1 || DAOHandlerType.BRAVO2:
                    await updateGovernorBravoProposals(handler)
                    break

                case DAOHandlerType.MAKER_EXECUTIVE:
                    await updateMakerProposals(handler)
                    break

                case DAOHandlerType.MAKER_POLL_CREATE:
                    await updateMakerPolls(handler)
                    break

                default:
                    break
            }
        }

        await prisma.dAO.update({
            where: {
                id: dao.id,
            },
            data: {
                refreshStatus: RefreshStatus.DONE,
                lastRefresh: new Date(),
            },
        })
    }

    async updateVotes(daoId: string, voterAddress: string) {
        let dao;

        try {
            dao = await prisma.dAO.findFirst({
                where: {
                    id: daoId,
                },
                include: {
                    handlers: true,
                    subscriptions: true,
                },
            })
        } catch (err) {
            console.log(err)
            throw new InternalServerErrorException()
        }

        if (!dao) {
            throw new NotFoundException('DAO not found')
        }

        this.logger.log(
            `Updating votes for user ${voterAddress} in ${dao.name}`
        )

        for (const handler of dao.handlers) {
            this.logger.log(
                `Fetching votes for ${dao.name}, user ${voterAddress}, handler: ${handler.type}`
            )

            switch (handler.type) {
                case DAOHandlerType.SNAPSHOT:
                    await updateSnapshotVotes(handler, voterAddress, dao.name)
                    break

                case DAOHandlerType.BRAVO1 || DAOHandlerType.BRAVO2:
                    await updateGovernorBravoVotes(
                        handler,
                        voterAddress,
                        dao.name
                    )
                    break

                case DAOHandlerType.MAKER_EXECUTIVE:
                    await updateMakerVotes(handler, voterAddress)
                    break

                case DAOHandlerType.MAKER_POLL_VOTE:
                    await updateMakerPollVotes(handler, voterAddress)
                    break

                default:
                    break
            }
        }

        await prisma.voter.update({
            where: {
                address: voterAddress,
            },
            data: {
                refreshStatus: RefreshStatus.DONE,
                lastRefresh: new Date(),
            },
        })
    }
}
