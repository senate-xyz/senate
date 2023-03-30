import { log_pd } from '@senate/axiom'
import { prisma, Decoder, JsonValue } from '@senate/database'
import axios from 'axios'
import { ethers } from 'ethers'

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

    const daoHandler = await prisma.daohandler.findFirstOrThrow({
        where: { id: daoHandlerId },
        include: {
            dao: true
        }
    })

    const voterHandlers = await prisma.voterhandler.findMany({
        where: {
            daohandlerid: daoHandlerId,
            voter: {
                address: { in: voters }
            }
        }
    })

    const oldestVote = Math.min(
        ...voterHandlers.map((voterHandler) =>
            voterHandler.snapshotindex.getTime()
        )
    )

    // Start search from whichever timestamp is earlier
    const searchFromTimestamp =
        oldestVote < daoHandler.snapshotindex.getTime()
            ? oldestVote
            : daoHandler.snapshotindex.getTime()

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
            (await axios
                .get('https://hub.snapshot.org/graphql', {
                    params: { query: graphqlQuery },
                    timeout: 5 * 60 * 1000
                })
                .then((response) => {
                    return response.data.data.votes
                })) as GraphQLVote[]
        ).filter((vote) => vote.proposal != null && vote.proposal.id != null)

        const proposalIds = [...new Set(votes.map((vote) => vote.proposal.id))]

        for (const snapshotProposalId of proposalIds) {
            const proposal = await prisma.proposal.findFirst({
                where: {
                    externalid: snapshotProposalId,
                    daoid: daoHandler.daoid,
                    daohandlerid: daoHandler.id
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

            if (proposal.timeend.getTime() < new Date().getTime())
                await prisma.vote.createMany({
                    data: votesForProposal.map((vote) => {
                        return {
                            timecreated: new Date(vote.created * 1000),
                            choice: vote.choice,
                            votingpower: vote.vp,
                            reason: vote.reason,

                            voteraddress: ethers.getAddress(vote.voter),
                            daoid: daoHandler.daoid,
                            proposalid: proposal.id,
                            daohandlerid: daoHandler.id
                        }
                    }),
                    skipDuplicates: true
                })
            else
                await prisma.$transaction(
                    votesForProposal.map((vote) => {
                        return prisma.vote.upsert({
                            where: {
                                voteraddress_daoid_proposalid: {
                                    voteraddress: ethers.getAddress(vote.voter),
                                    daoid: daoHandler.daoid,
                                    proposalid: proposal.id
                                }
                            },
                            create: {
                                timecreated: new Date(vote.created * 1000),
                                choice: vote.choice,
                                votingpower: vote.vp,
                                reason: vote.reason,

                                voteraddress: ethers.getAddress(vote.voter),
                                daoid: daoHandler.daoid,
                                proposalid: proposal.id,
                                daohandlerid: daoHandler.id
                            },
                            update: {
                                timecreated: new Date(vote.created * 1000),
                                choice: vote.choice,
                                votingpower: vote.vp,
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
            Number(daoHandler.snapshotindex.getTime()),
            searchToTimestmap
        )

        await prisma.voterhandler.updateMany({
            where: {
                voter: {
                    address: {
                        in: voters.map((voter) => voter)
                    }
                },
                daohandlerid: daoHandler.id
            },
            data: {
                chainindex: 1920000,
                snapshotindex: new Date(newIndex)
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
            errorStack: (e as Error).stack,
            response: Array.from(result, ([name, value]) => ({
                voterAddress: name,
                response: value
            }))
        })
    }

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
        response: Array.from(result, ([name, value]) => ({
            voterAddress: name,
            response: value
        }))
    })

    return Array.from(result, ([name, value]) => ({
        voterAddress: name,
        response: value
    }))
}
