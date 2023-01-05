import { InternalServerErrorException } from '@nestjs/common'
import { axiom } from '@senate/axiom'
import { DAOHandlerType, prisma } from '@senate/database'
import axios from 'axios'

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

    await axiom.datasets.ingestEvents(
        `proposal-detective-${process.env.AXIOM_DEPLOYMENT}`,
        [
            {
                event: 'updateSnapshotDaoVotes',
                details: `run`,
                item: { daoHandler: daoHandler, voters: voters }
            }
        ]
    )

    const searchQuery = `{votes(first:1000, skip: ${
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

    await axiom.datasets.ingestEvents(
        `proposal-detective-${process.env.AXIOM_DEPLOYMENT}`,
        [
            {
                event: 'updateSnapshotDaoVotes',
                details: `run`,
                item: { searchQuery: searchQuery }
            }
        ]
    )

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
            .catch(async (e) => {
                await axiom.datasets.ingestEvents(
                    `proposal-detective-${process.env.AXIOM_DEPLOYMENT}`,
                    [
                        {
                            event: 'updateSnapshotDaoVotes',
                            details: `run`,
                            err: JSON.stringify(e)
                        }
                    ]
                )

                return
            })

        //sanitize
        const votes = res.filter(
            (vote) => vote.proposal != null && vote.proposal.id != null
        )

        await axiom.datasets.ingestEvents(
            `proposal-detective-${process.env.AXIOM_DEPLOYMENT}`,
            [
                {
                    event: 'updateSnapshotDaoVotes',
                    details: `run`,
                    item: { res: votes }
                }
            ]
        )

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
                await axiom.datasets.ingestEvents(
                    `proposal-detective-${process.env.AXIOM_DEPLOYMENT}`,
                    [
                        {
                            event: 'updateSnapshotDaoVotes',
                            details: `update-voter`,
                            err: `did not find proposal ${snapshotProposalId}`
                        }
                    ]
                )
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
                .then(async (res) => {
                    await axiom.datasets.ingestEvents(
                        `proposal-detective-${process.env.AXIOM_DEPLOYMENT}`,
                        [
                            {
                                event: 'updateSnapshotDaoVotes',
                                details: `update-voters`,
                                item: res
                            }
                        ]
                    )

                    return
                })
                .catch(async (e) => {
                    await axiom.datasets.ingestEvents(
                        `proposal-detective-${process.env.AXIOM_DEPLOYMENT}`,
                        [
                            {
                                event: 'updateSnapshotDaoVotes',
                                details: `update-voters`,
                                err: JSON.stringify(e)
                            }
                        ]
                    )
                    console.log(e)
                    votes
                        .filter(
                            (vote) => vote.proposal.id == snapshotProposalId
                        )
                        .map((vote) => results.set(vote.voter, 'nok'))
                })
        }
    } catch (e) {
        await axiom.datasets.ingestEvents(
            `proposal-detective-${process.env.AXIOM_DEPLOYMENT}`,
            [
                {
                    event: 'updateSnapshotDaoVotes',
                    details: `run`,
                    err: JSON.stringify(e)
                }
            ]
        )
        console.log(e)
        throw new InternalServerErrorException()
    }

    const resultsArray = Array.from(results, ([name, value]) => ({
        voterAddress: name,
        response: value
    }))

    await axiom.datasets.ingestEvents(
        `proposal-detective-${process.env.AXIOM_DEPLOYMENT}`,
        [
            {
                event: 'updateSnapshotDaoVotes',
                details: `success`,
                item: { proposals: resultsArray, response: resultsArray }
            }
        ]
    )

    return resultsArray
}
