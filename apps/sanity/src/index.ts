import {
    prisma,
    DAOHandler,
    DAOHandlerType,
    Decoder,
    JsonValue
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

// Cron job which runs whenever dictated by env var OR on Feb 31st if env var is missing
schedule('15 * * * *', async () => {
    log_sanity.log({
        level: 'info',
        message: 'Starting sanity check for snapshot votes',
        date: new Date(Date.now())
    })

    const SEARCH_FROM: number = Date.now() - 76 * 60 * 1000 // minutes * seconds * milliseconds
    const SEARCH_TO: number = Date.now() - 15 * 60 * 1000 //  minutes * seconds * milliseconds
    const votesCount = new Map<string, number>()

    try {
        const daoHandlers: DAOHandler[] = await prisma.dAOHandler.findMany({
            where: {
                type: DAOHandlerType.SNAPSHOT
            }
        })

        for (const daoHandler of daoHandlers) {
            // Fetch the addresses from all voterHandlers linked to the daoHandler
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

            const votesFromDatabase = await prisma.vote.findMany({
                where: {
                    daoHandlerId: daoHandler.id,
                    voterAddress: {
                        in: voterAddresses
                    },
                    createdAt: {
                        gte: new Date(SEARCH_FROM),
                        lte: new Date(SEARCH_TO)
                    }
                }
            })

            const graphqlQuery = `{
                    votes(
                        first:1000,
                        orderBy: "created",
                        orderDirection: asc,
                        where: {
                            voter_in: [${voterAddresses.map(
                                (voter) => `"${voter}"`
                            )}], 
                            space: "${(daoHandler.decoder as Decoder).space}",
                            created_gte: ${Math.floor(SEARCH_FROM / 1000)},
                            created_lte: ${Math.floor(SEARCH_TO / 1000)}
                        }) {
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

            const votesFromSnapshot = (await superagent
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

            console.log(
                `[SNAPSHOT] Found ${votesFromSnapshot.length} votes from ${voterAddresses.length} addresses \n`
            )

            votesCount.set(
                (daoHandler.decoder as Decoder).space,
                votesFromDatabase.length - votesFromSnapshot.length
            )
        }

        // Differences between database and snapshot api for each space
        const differences = Array.from(
            votesCount,
            ([space, countDifference]) => ({
                space,
                countDifference
            })
        ).filter((item) => item.countDifference != 0)

        const totalVotesCountDiffrenece = differences.reduce(
            (acc, item) => acc + item.countDifference,
            0
        )

        if (differences.length > 0) {
            log_sanity.log({
                level: 'warn',
                message: `Found ${totalVotesCountDiffrenece} differences in ${differences.length} spaces`,
                differences: differences,
                searchFrom: new Date(SEARCH_FROM),
                searchTo: new Date(SEARCH_TO)
            })
        }
    } catch (error) {
        log_sanity.log({
            level: 'error',
            message: `Failed sanity check for snapshot votes`,
            error: error
        })
    }
})
