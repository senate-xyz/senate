import { prisma } from '@senate/database'
import superagent from 'superagent'

export const updateSnapshotDaoVotes = async (
    daoHandlerId: string,
    voters: string[]
) => {
    const daoHandler = await prisma.dAOHandler.findFirstOrThrow({
        where: { id: daoHandlerId },
        include: {
            dao: true
        }
    })

    let lastVoteCreated = (
        await prisma.voterHandler.findFirst({
            where: {
                daoHandlerId: daoHandler.id
            },
            orderBy: {
                lastSnapshotVoteCreatedTimestamp: 'desc'
            }
        })
    ).lastSnapshotVoteCreatedTimestamp

    if (lastVoteCreated > daoHandler.lastSnapshotProposalCreatedTimestamp)
        lastVoteCreated = daoHandler.lastSnapshotProposalCreatedTimestamp

    const graphqlQuery = `{votes(first:100, orderBy: "created", orderDirection: asc, where: {voter_in: [${voters.map(
        (voter) => `"${voter}"`
    )}], space: "${daoHandler.decoder['space']}", created_gt: ${
        lastVoteCreated ? lastVoteCreated.valueOf() / 1000 : 0
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
            if (res.status == 200) return false
            if (err) return true
        })
        .then((response) => {
            return response.body.data.votes
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
            continue
        }

        if (
            votes.filter((vote) => vote.proposal.id == snapshotProposalId)
                .length == proposal.votes.length
        ) {
            continue
        }

        const votesForProposal = votes.filter(
            (vote) => vote.proposal.id == snapshotProposalId
        )

        const newestVote = new Date(
            Math.max(...votes.map((vote) => vote.created)) * 1000
        )

        await prisma.vote.createMany({
            data: votesForProposal.map((vote) => {
                return {
                    voterAddress: vote.voter,
                    daoId: daoHandler.daoId,
                    proposalId: proposal.id,
                    daoHandlerId: daoHandler.id,
                    choiceId:
                        vote.choice.length > 0
                            ? String(vote.choice[0])
                            : String(vote.choice),
                    choice: vote.proposal.choices[vote.choice - 1] ?? 'No name'
                }
            }),
            skipDuplicates: true
        })

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
                lastChainVoteCreatedBlock: 0,
                lastSnapshotVoteCreatedTimestamp: new Date(newestVote)
            }
        })
    }

    const result = new Map()
    voters.map((voter) => result.set(voter, 'ok'))

    const resultsArray = Array.from(result, ([name, value]) => ({
        voterAddress: name,
        response: value
    }))

    return resultsArray
}
