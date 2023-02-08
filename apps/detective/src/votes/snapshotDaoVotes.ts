import { log_pd } from '@senate/axiom'
import { Decoder } from '@senate/database'
import { prisma } from '@senate/database'
import { ethers } from 'ethers'
import superagent from 'superagent'

type GraphQLVote = {
    id: string
    voter: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    choice: any
    created: number
    proposal: {
        id: string
        choices: string[]
        title: string
        body: string
        created: number
        start: number
        end: number
        link: string
    }
}

export const updateSnapshotDaoVotes = async (
    daoHandlerId: string,
    voters: string[]
) => {
    const result = new Map()
    voters.map((voter) => result.set(voter, 'nok'))

    const daoHandler = await prisma.dAOHandler.findFirstOrThrow({
        where: { id: daoHandlerId },
        include: {
            dao: true
        }
    })

    const voterHandlers = await prisma.voterHandler.findMany({
        where: {
            daoHandlerId: daoHandlerId,
            voter: {
                address: { in: voters }
            }
        }
    })

    const oldestVote = Math.min(
        ...voterHandlers.map((voterHandler) =>
            voterHandler.lastSnapshotRefresh.getTime()
        )
    )

    // Start search from whichever timestamp is earlier
    const searchFromTimestamp =
        oldestVote < daoHandler.lastSnapshotRefresh.getTime()
            ? oldestVote
            : daoHandler.lastSnapshotRefresh.getTime()

    const searchToTimestamp = daoHandler.lastSnapshotRefresh.getTime()

    const graphqlQuery = `{
        votes(
            first:1000,
            orderBy: "created",
            orderDirection: asc,
            where: {
                voter_in: [${voters.map((voter) => `"${voter}"`)}], 
                space: "${(daoHandler.decoder as Decoder).space}",
                created_lt: ${
                    searchToTimestamp ? Math.floor(searchToTimestamp / 1000) : 0
                },
                created_gt: ${
                    searchFromTimestamp
                        ? Math.floor(searchFromTimestamp / 1000)
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

    let votes
    try {
        const res = (await superagent
            .get('https://hub.snapshot.org/graphql')
            .query({
                query: graphqlQuery
            })
            .timeout({
                response: 10000,
                deadline: 30000
            })
            .retry(3, (err, res) => {
                if (err) return true
                if (res.status == 200) return false
                return true
            })
            .then((response: { body: { data: { votes: GraphQLVote[] } } }) => {
                return response.body.data.votes
            })) as GraphQLVote[]

        //sanitize
        votes = res.filter(
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
                continue
            }

            const votesForProposal = votes.filter(
                (vote) => vote.proposal.id == snapshotProposalId
            )

            if (votesForProposal.length) {
                await prisma.vote.createMany({
                    data: votesForProposal.map((vote) => {
                        return {
                            voterAddress: ethers.getAddress(vote.voter),
                            daoId: daoHandler.daoId,
                            proposalId: proposal.id,
                            daoHandlerId: daoHandler.id,
                            choiceId: JSON.stringify(vote.choice),
                            choice: vote.choice
                                ? Array.isArray(vote.choice)
                                    ? JSON.stringify(
                                          vote.choice.map(
                                              (choice: number) =>
                                                  vote.proposal.choices[
                                                      choice - 1
                                                  ]
                                          )
                                      )
                                    : JSON.stringify(
                                          vote.proposal.choices[vote.choice - 1]
                                      )
                                : 'No choice'
                        }
                    }),
                    skipDuplicates: true
                })
            }

            const newestVote = votes.length
                ? Math.max(...votes.map((vote) => vote.created * 1000))
                : searchToTimestamp
                ? searchToTimestamp
                : 0

            await prisma.voterHandler.updateMany({
                where: {
                    voter: {
                        address: {
                            in: voters.map((voter) => voter)
                        }
                    },
                    daoHandlerId: daoHandler.id
                },
                data: {
                    lastChainRefresh: 0,
                    lastSnapshotRefresh: new Date(newestVote)
                }
            })
        }

        voters.map((voter) => result.set(voter, 'ok'))
    } catch (e) {
        log_pd.log({
            level: 'error',
            message: `Search for votes ${daoHandler.dao.name} - ${daoHandler.type}`,
            searchType: 'VOTES',
            sourceType: 'SNAPSHOT',
            created_gt: searchFromTimestamp
                ? Math.floor(searchFromTimestamp / 1000)
                : 0,
            created_lt: searchToTimestamp
                ? Math.floor(searchToTimestamp / 1000)
                : 0,
            space: (daoHandler.decoder as Decoder).space,
            query: graphqlQuery,
            voters: voters,
            votes: votes,
            errorName: (e as Error).name,
            errorMessage: (e as Error).message,
            errorStack: (e as Error).stack
        })
    }

    const res = Array.from(result, ([name, value]) => ({
        voterAddress: name,
        response: value
    }))

    log_pd.log({
        level: 'info',
        message: `Search for votes ${daoHandler.dao.name} - ${daoHandler.type}`,
        searchType: 'VOTES',
        sourceType: 'SNAPSHOT',
        created_gt: searchFromTimestamp
            ? Math.floor(searchFromTimestamp / 1000)
            : 0,
        created_lt: searchToTimestamp
            ? Math.floor(searchToTimestamp / 1000)
            : 0,
        space: (daoHandler.decoder as Decoder).space,
        query: graphqlQuery,
        voters: voters,
        votes: votes,
        response: res
    })

    return res
}
