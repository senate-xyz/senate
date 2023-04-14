import {
    prisma,
    type DAOHandler,
    DAOHandlerType,
    type Decoder,
    type JsonValue
} from '@senate/database'

import { schedule } from 'node-cron'
import { log_sanity } from '@senate/axiom'
import { callApiWithDelayedRetries } from '../utils'

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

// Cron job which runs whenever dictated by env var OR on Feb 31st if env var is missing
export const snapshotVotesSanity = schedule('0 * * * *', async () => {
    log_sanity.log({
        level: 'info',
        message: '[VOTES] Starting sanity check for snapshot votes',
        date: new Date(Date.now())
    })

    const SEARCH_FROM: number = Date.now() - 24 * 60 * 60 * 1000 // hours * minutes * seconds * milliseconds
    const SEARCH_TO: number = Date.now() - 15 * 60 * 1000 //  minutes * seconds * milliseconds

    try {
        const daoHandlers: DAOHandler[] = await prisma.daohandler.findMany({
            where: {
                type: DAOHandlerType.SNAPSHOT
            }
        })

        await checkAndSanitizeVotesRoutine(daoHandlers, SEARCH_FROM, SEARCH_TO)
    } catch (error) {
        log_sanity.log({
            level: 'error',
            message: `[VOTES] Failed sanity check for snapshot votes`,
            error: error
        })
    }

    log_sanity.log({
        level: 'info',
        message: '[VOTES] FINISHED sanity check for snapshot votes'
    })
})

const checkAndSanitizeVotesRoutine = async (
    daoHandlers: DAOHandler[],
    fromTimestamp: number,
    toTimestamp: number
): Promise<void> => {
    const missingVotes: Map<string, GraphQLVote[]> = new Map()

    for (const daoHandler of daoHandlers) {
        const voterAddresses: string[] = (
            await prisma.voterhandler.findMany({
                where: {
                    daohandlerid: daoHandler.id
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

        const votesNotInDatabase: GraphQLVote[] = votesFromSnapshotAPI.filter(
            (vote) => {
                return !votesFromDatabase.some(
                    (voteFromDatabase) =>
                        voteFromDatabase.proposal.externalid ===
                            vote.proposal.id &&
                        voteFromDatabase.voteraddress === vote.voter
                )
            }
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

const fetchVotesFromDatabase = async (
    SEARCH_FROM: Date,
    SEARCH_TO: Date,
    voterAddresses: string[],
    daoHandlerId: string
) => {
    return await prisma.vote.findMany({
        where: {
            daohandlerid: daoHandlerId,
            voteraddress: {
                in: voterAddresses
            },
            timecreated: {
                gte: SEARCH_FROM,
                lte: SEARCH_TO
            }
        },
        select: {
            voteraddress: true,
            proposal: {
                select: {
                    externalid: true
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
    let result: GraphQLVote[] = []

    try {
        for (let i = 0; i < voterAddresses.length; i += 100) {
            const addresses = voterAddresses.slice(
                i,
                Math.min(i + 100, voterAddresses.length)
            )
    
            const graphqlQuery = `{
                votes(
                    first:1000,
                    orderBy: "created",
                    orderDirection: asc,
                    where: {
                        voter_in: [${addresses.map((voter) => `"${voter}"`)}],
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
    
            const data = await callApiWithDelayedRetries(graphqlQuery, 5)
            result = result.concat(data.votes as GraphQLVote[])
        }
    } catch (e) {
        log_sanity.log({
            level: 'error',
            message: 'Failed to fetch voting data from snapshot.',
            errorName: (e as Error).name,
            errorMessage: (e as Error).message,
            errorStack: (e as Error).stack,
        })

        throw e
    }

    return result 
}