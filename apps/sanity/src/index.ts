import {
    prisma,
    DAOHandler,
    DAOHandlerType,
    Decoder,
    JsonValue
    Proposal
} from '@senate/database'

import { config } from 'dotenv'
import { schedule } from 'node-cron'
import superagent from 'superagent'
import { log_sanity } from '@senate/axiom'

config()

type GraphQLVote = {
    id: string
    voter: string
    choice: JsonValue
    created: number
    proposal: {
        id: string
        title: string
        created: number
        start: number
        end: number
        link: string
    }
}

type GraphQLProposal = {
    id: string
    title: string
    created: number
    start: number
    end: number
    link: string
}

// Cron job which runs whenever dictated by env var OR on Feb 31st if env var is missing
schedule('15 * * * *', async () => {
    log_sanity.log({
        level: 'info',
        message: 'Starting sanity check for snapshot votes',
        date: new Date(Date.now())
    })

    const SEARCH_FROM: number = Date.now() - 6 * 60 * 60 * 1000 // minutes * seconds * milliseconds
    const SEARCH_TO: number = Date.now() - 15 * 60 * 1000 //  minutes * seconds * milliseconds

    try {
        const daoHandlers: DAOHandler[] = await prisma.dAOHandler.findMany({
            where: {
                type: DAOHandlerType.SNAPSHOT
            }
        })

        await checkAndSanitizeVotesRoutine(daoHandlers, SEARCH_FROM, SEARCH_TO)
        await checkAndSanitizeProposalsRoutine(
            daoHandlers,
            SEARCH_FROM,
            SEARCH_TO
        )
    } catch (error) {
        log_sanity.log({
            level: 'error',
            message: `Failed sanity check for snapshot votes`,
            error: error
        })
    }
})

const checkAndSanitizeVotesRoutine = async (
    daoHandlers: DAOHandler[],
    fromTimestamp: number,
    toTimestamp: number
): Promise<void> => {
    const missingVotes: Map<string, GraphQLVote[]> = new Map()

    for (const daoHandler of daoHandlers) {

        const voterAddresses: string[] = (
            await prisma.voterHandler.findMany({
                where: {
                    daoHandlerId: daoHandler.id
                },
                select: {
                    voter: {
                        select: {
                            address: true
                        }
                    }
                }
            })
        ).map((voterHandler) => voterHandler.voter.address)

        const votesFromDatabase = await fetchVotesFromDatabase(
            new Date(fromTimestamp),
            new Date(toTimestamp),
            voterAddresses,
            daoHandler.id
        )
        const votesFromSnapshotAPI = await fetchVotesFromSnapshotAPI(
            Math.floor(fromTimestamp / 1000),
            Math.floor(toTimestamp / 1000),
            voterAddresses,
            (daoHandler.decoder as Decoder).space
        )

        const votesNotInDatabase : GraphQLVote[] = votesFromSnapshotAPI.filter(
            (vote) => 
                !votesFromDatabase.some(
                    (voteFromDatabase) => 
                        voteFromDatabase.proposal.externalId === vote.proposal.id &&
                        voteFromDatabase.voterAddress === vote.voter
                )
        )

        missingVotes.set(
            (daoHandler.decoder as Decoder).space,
            votesNotInDatabase
        )
    }

    // Differences between database and snapshot api for each space
    const spacesMissingVotes = Array.from(missingVotes, ([space, votes]) => ({
        space,
        votes
    })).filter((item) => item.votes.length > 0)

    const totalVotesMissing = spacesMissingVotes.reduce(
        (acc, item) => acc + item.votes.length,
        0
    )

    if (spacesMissingVotes.length > 0) {
        log_sanity.log({
            level: 'warn',
            message: `Missing votes (${totalVotesMissing}) found in ${spacesMissingVotes.length} spaces`,
            missingVotes: spacesMissingVotes,
            searchFrom: new Date(fromTimestamp),
            searchTo: new Date(toTimestamp)
        })

        //TODO: implement sanitization
        // Set voterHandler snapshotIndex back so that the vote is re-fetched
    }

}

const checkAndSanitizeProposalsRoutine = async (
    daoHandlers: DAOHandler[],
    fromTimestamp: number,
    toTimestamp: number
) => {
    for (const daoHandler of daoHandlers) {
        const proposalsFromDatabase = await fetchProposalsFromDatabase(
            daoHandler.id,
            new Date(fromTimestamp),
            new Date(toTimestamp)
        )

        const proposalsFromSnapshotAPI: GraphQLProposal[] =
            await fetchProposalsFromSnapshotAPI(
                (daoHandler.decoder as Decoder).space,
                Math.floor(fromTimestamp / 1000),
                Math.floor(toTimestamp / 1000)
            )

        const proposalsNotOnSnapshot: Proposal[] = proposalsFromDatabase.filter(
            (proposal: Proposal) => {
                proposalsFromSnapshotAPI
                .map(
                    (proposal: GraphQLProposal) => proposal.id
                )
                .includes(proposal.externalId) === false
            }
        )

        const proposalsNotInDatabase: GraphQLProposal[] = proposalsFromSnapshotAPI.filter(
            (proposal: GraphQLProposal) => {
                proposalsFromDatabase
                .map(
                    (proposal: Proposal) => proposal.externalId
                )
                .includes(proposal.id) === false
            }
        )

        if (proposalsNotOnSnapshot.length > 0) {
            // we have proposals which have been removed from snapshot. need to purge them from the database.
            log_sanity.log({
                level: 'warn',
                message: `Found ${proposalsNotOnSnapshot.length} proposals to remove`,
                proposals: proposalsNotOnSnapshot,

            })
   
            //  await prisma.proposal.deleteMany({
            //     where: {
            //         id: {
            //             in: proposalsNotOnSnapshot.map((proposal) => proposal.id)
            //         }
            //     }
            // })
        }

        if (proposalsNotInDatabase.length > 0) {
            // we are missing proposals from the database. need to set the snapshotIndex backwards to fetch them
            log_sanity.log({
                level: 'warn',
                message: `Missing proposals: ${proposalsFromDatabase.length} proposals `,
                proposals: proposalsNotOnSnapshot,

            })
        }
    }
}   

const fetchProposalsFromSnapshotAPI = async (
    space: string,
    searchFrom: number,
    searchTo: number
): Promise<GraphQLProposal[]> => {
    const graphqlQuery = `{
        proposals(
            first:1000,
            orderBy: "created",
            orderDirection: asc,
            where: {
                space: "${space}",
                created_gte: ${searchFrom},
                created_lte: ${searchTo}
            }
        ) 
        {
            id
            title
            body
            created
            start
            end
            link
        }
    }`

    return (await superagent
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
        .then((response: { body: { data: { proposals: GraphQLProposal[] } } }) => {
            return response.body.data.proposals
        })) as GraphQLProposal[]
}

const fetchProposalsFromDatabase = async (
    daoHandlerId: string,
    searchFrom: Date,
    searchTo: Date
): Promise<Proposal[]> => {
    return await prisma.proposal.findMany({
        where: {
            daoHandlerId: daoHandlerId,
            timeCreated: {
                gte: searchFrom,
                lte: searchTo
            }
        }
    })
}

const fetchVotesFromDatabase = async (
    SEARCH_FROM: Date,
    SEARCH_TO: Date,
    voterAddresses: string[],
    daoHandlerId: string
) => {
    return await prisma.vote.findMany({
        where: {
            daoHandlerId: daoHandlerId,
            voterAddress: {
                in: voterAddresses
            },
            timeCreated: {
                gte: SEARCH_FROM,
                lte: SEARCH_TO
            }
        },
        select: {
            voterAddress: true,
            proposal: {
                select: {
                    externalId: true
                }
            }
        }
    })
}

const fetchVotesFromSnapshotAPI = async (
    searchFrom: number,
    searchTo: number,
    voterAddresses: string[],
    space: string
) => {
    const graphqlQuery = `{
        votes(
            first:1000,
            orderBy: "created",
            orderDirection: asc,
            where: {
                voter_in: [${voterAddresses.map((voter) => `"${voter}"`)}], 
                space: "${space}",
                created_gte: ${searchFrom},
                created_lte: ${searchTo}
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
                title
                body
                created
                start
                end
                link    
            }        
        }
    }`

    return (await superagent
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
        })
    ) as GraphQLVote[]
}
