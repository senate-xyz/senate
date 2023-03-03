import { log_pd } from '@senate/axiom'
import { prisma, Decoder, JsonValue } from '@senate/database'
import { ethers } from 'ethers'
import superagent from 'superagent'

type GraphQLVote = {
    id: string
    voter: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    choice: JsonValue
    created: number
    reason: string
    vp: number
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
            voterHandler.snapshotIndex.getTime()
        )
    )

    // Start search from whichever timestamp is earlier
    const searchFromTimestamp =
        oldestVote < daoHandler.snapshotIndex.getTime()
            ? oldestVote
            : daoHandler.snapshotIndex.getTime()

    const graphqlQuery = `{
        votes(
            first:1000,
            orderBy: "created",
            orderDirection: asc,
            where: {
                voter_in: [${voters.map((voter) => `"${voter}"`)}], 
                space: "${(daoHandler.decoder as Decoder).space}",
                created_gte: ${
                    searchFromTimestamp
                        ? Math.floor(searchFromTimestamp / 1000)
                        : 0
                }
            }
        ) 
        {
            id
            voter
            choice
            reason
            vp
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
        const votes = (
            (await superagent
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
                .then(
                    (response: {
                        body: { data: { votes: GraphQLVote[] } }
                    }) => {
                        return response.body.data.votes
                    }
                )) as GraphQLVote[]
        ).filter((vote) => vote.proposal != null && vote.proposal.id != null)

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

            if (proposal.timeEnd.getTime() < new Date().getTime())
                await prisma.vote.createMany({
                    data: votesForProposal.map((vote) => {
                        return {
                            timeCreated: new Date(vote.created * 1000),
                            choice: vote.choice,
                            votingPower: vote.vp,
                            reason: vote.reason,

                            voterAddress: ethers.getAddress(vote.voter),
                            daoId: daoHandler.daoId,
                            proposalId: proposal.id,
                            daoHandlerId: daoHandler.id
                        }
                    }),
                    skipDuplicates: true
                })
            else
                await prisma.$transaction(
                    votesForProposal.map((vote) => {
                        return prisma.vote.upsert({
                            where: {
                                voterAddress_daoId_proposalId: {
                                    voterAddress: ethers.getAddress(vote.voter),
                                    daoId: daoHandler.daoId,
                                    proposalId: proposal.id
                                }
                            },
                            create: {
                                timeCreated: new Date(vote.created * 1000),
                                choice: vote.choice,
                                votingPower: vote.vp,
                                reason: vote.reason,

                                voterAddress: ethers.getAddress(vote.voter),
                                daoId: daoHandler.daoId,
                                proposalId: proposal.id,
                                daoHandlerId: daoHandler.id
                            },
                            update: {
                                timeCreated: new Date(vote.created * 1000),
                                choice: vote.choice,
                                votingPower: vote.vp,
                                reason: vote.reason
                            }
                        })
                    })
                )
        }

        const searchToTimestmap = Math.max(
            ...votes.map((vote) => vote.created * 1000),
            searchFromTimestamp
        )

        const newIndex = Math.min(
            Number(daoHandler.snapshotIndex.getTime()),
            searchToTimestmap
        )

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
                chainIndex: 1920000,
                snapshotIndex: new Date(newIndex)
            }
        })

        voters.map((voter) => result.set(voter, 'ok'))
    } catch (e) {
        log_pd.log({
            level: 'error',
            message: `Search for votes ${daoHandler.dao.name} - ${daoHandler.type}`,
            searchType: 'VOTES',
            sourceType: 'SNAPSHOT',
            created_gte: searchFromTimestamp
                ? Math.floor(searchFromTimestamp / 1000)
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
        created_gte: searchFromTimestamp
            ? Math.floor(searchFromTimestamp / 1000)
            : 0,
        space: (daoHandler.decoder as Decoder).space,
        query: graphqlQuery,
        voters: voters,
        votes: votes,
        response: res
    })

    return res
}
