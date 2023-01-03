import { InternalServerErrorException, Logger } from '@nestjs/common'
import { DAOHandlerType, prisma } from '@senate/database'
import axios from 'axios'

const logger = new Logger('SnapshotDaoVotes')

export const updateSnapshotDaoVotes = async (
    daoHandlerId: string,
    voters: [string]
) => {
    logger.log({ action: 'updateSnapshotDaoVotes', details: 'start' })
    if (!Array.isArray(voters)) voters = [voters]

    const results = new Map()
    voters.map((voter) => results.set(voter, 'ok'))

    logger.log({
        action: 'updateSnapshotDaoVotes',
        details: 'voters',
        item: voters
    })

    const daoHandler = await prisma.dAOHandler.findFirstOrThrow({
        where: { id: daoHandlerId, type: DAOHandlerType.SNAPSHOT },
        include: {
            dao: {
                include: { votes: { where: { daoHandlerId: daoHandlerId } } }
            }
        }
    })

    logger.log({
        action: 'updateSnapshotDaoVotes',
        details: 'daohandler',
        item: daoHandler
    })

    const searchQuery = `{votes(first:100, skip: ${
        daoHandler.dao.votes.length
    } orderBy: "created", orderDirection: asc, where: {voter_in: [${voters.map(
        (voter) => `"${voter}"`
    )}], space: "${daoHandler.decoder['space']}"}) {
                    id
                    voter
                    choice
                    proposal {
                        id
                        choices
                        title
                        body
                        created
                        start
                        end
                        link
                        }
                    }
                }`
    logger.log({
        action: 'updateSnapshotDaoVotes',
        details: 'search',
        item: searchQuery
    })

    try {
        const res = await axios
            .get('https://hub.snapshot.org/graphql', {
                method: 'POST',
                data: JSON.stringify({
                    query: searchQuery
                }),
                headers: {
                    'content-type': 'application/json'
                }
            })
            .then((response) => {
                if (response.status == 429) throw new Error('Too many requests')
                return response.data
            })
            .then((data) => {
                return data.data.votes
            })
            .catch((e) => {
                logger.log({
                    action: 'updateSnapshotDaoVotes',
                    details: 'search',
                    item: { err: e }
                })
                return
            })

        //sanitize
        const votes = res.filter(
            (vote) => vote.proposal != null && vote.proposal.id != null
        )

        logger.log({
            action: 'updateSnapshotDaoVotes',
            details: 'result',
            item: { count: votes.length }
        })

        const proposalIds = [...new Set(votes.map((vote) => vote.proposal.id))]

        for (const snapshotProposalId of proposalIds) {
            const proposal = await prisma.proposal.findFirst({
                where: {
                    externalId: snapshotProposalId,
                    daoId: daoHandler.daoId,
                    daoHandlerId: daoHandler.id
                }
            })

            if (!proposal) {
                logger.log({
                    action: 'updateSnapshotDaoVotes',
                    details: 'proposal not found',
                    item: { id: snapshotProposalId }
                })
                continue
            }

            await prisma.vote
                .createMany({
                    data: votes
                        .filter(
                            (vote) => vote.proposal.id == snapshotProposalId
                        )
                        .map((vote) => {
                            return {
                                voterAddress: vote.voter,
                                daoId: daoHandler.daoId,
                                proposalId: proposal.id,
                                daoHandlerId: daoHandler.id,
                                choiceId:
                                    vote.choice.length > 0
                                        ? String(vote.choice[0])
                                        : String(vote.choice),
                                choice:
                                    vote.proposal.choices[vote.choice - 1] ??
                                    'No name'
                            }
                        }),
                    skipDuplicates: true
                })
                .then((res) => {
                    logger.log({
                        action: 'updateSnapshotDaoVotes',
                        details: 'createMany',
                        item: res
                    })
                    return
                })
                .catch((e) => {
                    logger.log({
                        action: 'updateSnapshotDaoVotes',
                        details: 'createMany',
                        item: {
                            err: e,
                            daoHandler: daoHandler,
                            dao: daoHandler.dao,
                            proposal: proposal
                        }
                    })

                    votes
                        .filter(
                            (vote) => vote.proposal.id == snapshotProposalId
                        )
                        .map((vote) => results.set(vote.voter, 'nok'))
                })
        }
    } catch (e) {
        logger.log({
            action: 'updateSnapshotDaoVotes',
            details: 'upsert',
            item: {
                err: e
            }
        })
        throw new InternalServerErrorException()
    }

    const resultsArray = Array.from(results, ([name, value]) => ({
        voterAddress: name,
        response: value
    }))

    logger.log({
        action: 'updateSnapshotDaoVotes',
        details: 'result',
        item: resultsArray
    })
    return resultsArray
}
