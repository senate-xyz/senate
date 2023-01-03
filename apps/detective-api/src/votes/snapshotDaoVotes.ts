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
        include: { dao: true }
    })

    logger.log({
        action: 'updateSnapshotDaoVotes',
        details: 'daohandler',
        item: daoHandler
    })

    logger.log({ action: 'updateSnapshotDaoVotes', details: 'search' })

    let votes
    try {
        votes = await axios
            .get('https://hub.snapshot.org/graphql', {
                method: 'POST',
                data: JSON.stringify({
                    query: ` {
                    votes(orderBy: "created", orderDirection: asc, where: {voter_in: [${voters.map(
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
                }
                `
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
                console.log(e)
                return
            })

        logger.log({
            action: 'updateSnapshotDaoVotes',
            details: 'result',
            item: { count: votes.length }
        })

        // TODO support multiple choice vote
        if (votes) {
            for (const vote of votes) {
                const proposal = await prisma.proposal.findFirst({
                    where: {
                        externalId: vote.proposal.id,
                        daoId: daoHandler.daoId,
                        daoHandlerId: daoHandler.id
                    }
                })

                if (!proposal) {
                    logger.log({
                        action: 'updateSnapshotDaoVotes',
                        details: 'err',
                        item: {
                            err: `Snapshot proposal with externalId ${vote.proposal.id} does not exist in DB`
                        }
                    })

                    results.set(vote.voter, 'nok')
                    continue
                }

                if (!vote.proposal.id) {
                    logger.log({
                        action: 'updateSnapshotDaoVotes',
                        details: 'err',
                        item: {
                            err: 'Bad proposal id'
                        }
                    })

                    results.set(vote.voter, 'nok')
                    continue
                }

                await prisma.voteOption.deleteMany({
                    where: {
                        voterAddress: vote.voter,
                        voteDaoId: daoHandler.daoId,
                        voteProposalId: proposal.id
                    }
                })

                await prisma.vote
                    .upsert({
                        where: {
                            voterAddress_daoId_proposalId: {
                                voterAddress: vote.voter,
                                daoId: daoHandler.daoId,
                                proposalId: proposal.id
                            }
                        },
                        update: {
                            options: {
                                create: {
                                    option:
                                        vote.choice.length > 0
                                            ? String(vote.choice[0])
                                            : String(vote.choice),
                                    optionName:
                                        vote.proposal.choices[
                                            vote.choice - 1
                                        ] ?? 'No name'
                                }
                            }
                        },
                        create: {
                            voterAddress: vote.voter,
                            daoId: daoHandler.daoId,
                            proposalId: proposal.id,
                            daoHandlerId: daoHandler.id,
                            options: {
                                create: {
                                    option:
                                        vote.choice.length > 0
                                            ? String(vote.choice[0])
                                            : String(vote.choice),
                                    optionName:
                                        vote.proposal.choices[
                                            vote.choice - 1
                                        ] ?? 'No name'
                                }
                            }
                        }
                    })
                    .then((r) => {
                        logger.log({
                            action: 'updateSnapshotDaoVotes',
                            details: 'upsert',
                            item: r
                        })
                        return
                    })
                    .catch((e) => {
                        logger.log({
                            action: 'updateSnapshotDaoVotes',
                            details: 'upsert',
                            item: {
                                err: e
                            }
                        })
                        results.set(vote.voter, 'nok')
                    })
            }
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
