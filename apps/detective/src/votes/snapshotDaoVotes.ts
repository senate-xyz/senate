import { InternalServerErrorException } from '@nestjs/common'
import { log_pd } from '@senate/axiom'

import { DAOHandlerType, prisma } from '@senate/database'
import superagent from 'superagent'

export const updateSnapshotDaoVotes = async (
    daoHandlerId: string,
    voters: [string]
) => {
    if (!Array.isArray(voters)) voters = [voters]

    const results = new Map()
    voters.map((voter) => results.set(voter, 'ok'))

    const daoHandler = await prisma.dAOHandler.findFirstOrThrow({
        where: { id: daoHandlerId, type: DAOHandlerType.SNAPSHOT },
        include: {
            dao: {
                include: { votes: { where: { daoHandlerId: daoHandlerId } } }
            }
        }
    })

    log_pd.log({
        level: 'info',
        message: `New votes update for ${daoHandler.dao.name} - ${daoHandler.type}`,
        data: {
            daoHandlerId: daoHandlerId,
            voters: voters
        }
    })

    const lastCreated = await prisma.voterHandler.findFirst({
        where: {
            daoHandlerId: daoHandler.id
        },
        orderBy: {
            lastSnapshotVoteCreatedTimestamp: 'desc'
        }
    })

    const graphqlQuery = `{votes(first:1000, orderBy: "created", orderDirection: asc, where: {voter_in: [${voters.map(
        (voter) => `"${voter}"`
    )}], space: "${daoHandler.decoder['space']}", created_gt: ${
        lastCreated.lastSnapshotVoteCreatedTimestamp
            ? lastCreated.lastSnapshotVoteCreatedTimestamp.valueOf() / 1000
            : 0
    }}) {
                    id
                    voter
                    choice
                    created
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

    log_pd.log({
        level: 'info',
        message: `GraphQL query for ${daoHandler.dao.name} - ${daoHandler.type}`,
        data: {
            query: graphqlQuery
        }
    })

    try {
        let tries = 0
        const res = await superagent
            .get('https://hub.snapshot.org/graphql')
            .query({
                query: graphqlQuery
            })
            .timeout({
                response: 5000,
                deadline: 30000
            })
            .retry(3, (err, res) => {
                tries++
                if (tries > 1)
                    log_pd.log({
                        level: 'warn',
                        message: `Retry GraphQL query for ${daoHandler.dao.name} - ${daoHandler.type}`,
                        data: {
                            query: graphqlQuery,
                            error: JSON.stringify(err),
                            res: JSON.stringify(res)
                        }
                    })
            })
            .then((response) => {
                log_pd.log({
                    level: 'info',
                    message: `GraphQL query response for ${daoHandler.dao.name} - ${daoHandler.type}`,
                    data: {
                        response: JSON.stringify(response)
                    }
                })
                return response.body.data.votes
            })
            .catch(async (e) => {
                log_pd.log({
                    level: 'error',
                    message: `GraphQL error for ${daoHandler.dao.name} - ${daoHandler.type}`,
                    data: {
                        error: JSON.stringify(e)
                    }
                })
                return
            })

        //sanitize
        const votes = res.filter(
            (vote) => vote.proposal != null && vote.proposal.id != null
        )

        const proposalIds = [...new Set(votes.map((vote) => vote.proposal.id))]

        for (const snapshotProposalId of proposalIds) {
            const proposal = await prisma.proposal.findFirst({
                where: {
                    externalId: snapshotProposalId,
                    daoId: daoHandler.daoId,
                    daoHandlerId: daoHandler.id
                },
                include: {
                    votes: true
                }
            })

            if (!proposal) {
                votes
                    .filter((vote) => vote.proposal.id == snapshotProposalId)
                    .map((vote) => results.set(vote.voter.toLowerCase(), 'nok'))

                continue
            }

            if (
                votes.filter((vote) => vote.proposal.id == snapshotProposalId)
                    .length == proposal.votes.length
            )
                continue

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
                .then(async (r) => {
                    log_pd.log({
                        level: 'info',
                        message: `Updated votes for ${votes
                            .filter(
                                (vote) => vote.proposal.id == snapshotProposalId
                            )
                            .map((vote) => vote.voter)} in ${
                            daoHandler.dao.name
                        } - ${daoHandler.type}`,
                        data: {
                            vote: r
                        }
                    })

                    return
                })
                .catch(async (e) => {
                    votes
                        .filter(
                            (vote) => vote.proposal.id == snapshotProposalId
                        )
                        .map((vote) => results.set(vote.voter, 'nok'))

                    log_pd.log({
                        level: 'error',
                        message: `Could not update votes for ${votes
                            .filter(
                                (vote) => vote.proposal.id == snapshotProposalId
                            )
                            .map((vote) => vote.voter)} in ${
                            daoHandler.dao.name
                        } - ${daoHandler.type}`,
                        data: {
                            error: e
                        }
                    })
                })
        }

        await prisma.voterHandler.updateMany({
            where: {
                voter: { address: { in: voters } }
            },
            data: {
                lastSnapshotVoteCreatedTimestamp: new Date(
                    Math.min(...votes.map((vote) => vote.created)) * 1000
                )
            }
        })
    } catch (e) {
        log_pd.log({
            level: 'error',
            message: `Could not update votes for ${voters} in ${daoHandler.dao.name} - ${daoHandler.type}`,
            data: {
                error: e
            }
        })
        throw new InternalServerErrorException()
    }

    const resultsArray = Array.from(results, ([name, value]) => ({
        voterAddress: name,
        response: value
    }))

    return resultsArray
}
