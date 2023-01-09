import { InternalServerErrorException } from '@nestjs/common'
import { prisma } from '@senate/database'
import { DAOHandler } from '@prisma/client'

import axios from 'axios'
import { log_pd } from '@senate/axiom'
import superagent from 'superagent'

export const updateSnapshotProposals = async (
    daoHandlerIds: string[],
    minCreatedAt: number
): Promise<Array<{ daoHandlerId: string; response: string }>> => {
    const results: Array<{ daoHandlerId: string; response: string }> = []

    const daoHandlerToSnapshotSpaceMap: Map<DAOHandler, string> =
        await getSnapshotSpaces(daoHandlerIds)
    const spacesArray = Array.from(daoHandlerToSnapshotSpaceMap.values())

    log_pd.log({
        level: 'info',
        message: `New proposals update for ${spacesArray}}`,
        data: {
            daoHandlerId: daoHandlerToSnapshotSpaceMap[0],
            minCreatedAt: minCreatedAt
        }
    })

    let proposals

    const graphqlQuery = `{
                proposals (
                    first: 1000, 
                    where: {
                    space_in: [${spacesArray.map((space) => `"${space}"`)}],
                    created_gt: ${Math.floor(minCreatedAt / 1000)}
                    },
                    orderBy: "created",
                    orderDirection: asc
                ) {
                    id
                    title
                    body
                    created
                    start
                    end
                    link
                    space
                    {
                        id
                    }
                }
                }`

    log_pd.log({
        level: 'info',
        message: `GraphQL query for ${spacesArray}`,
        data: {
            query: graphqlQuery
        }
    })

    try {
        let tries = 0
        proposals = await superagent
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
                        message: `Retry GraphQL query for ${spacesArray}`,
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
                    message: `GraphQL query response for ${spacesArray}`,
                    data: {
                        response: JSON.stringify(response)
                    }
                })
                return response.body.data.proposals
            })
            .catch(async (e) => {
                log_pd.log({
                    level: 'error',
                    message: `GraphQL error for ${spacesArray}`,
                    data: {
                        error: JSON.stringify(e)
                    }
                })
                return
            })

        for (const [daoHandler, space] of daoHandlerToSnapshotSpaceMap) {
            proposals = proposals.filter(
                (proposal) => proposal.space.id === space
            )
            const response: string = await upsertSnapshotProposals(
                daoHandler,
                space,
                proposals
            )
            results.push({ daoHandlerId: daoHandler.id, response: response })
        }
    } catch (e) {
        log_pd.log({
            level: 'error',
            message: `Could not update proposals for ${spacesArray}`,
            data: {
                error: e
            }
        })
        throw new InternalServerErrorException()
    }

    return results
}

const upsertSnapshotProposals = async (
    daoHandler: DAOHandler,
    space: string,
    proposals: any[]
): Promise<string> => {
    const result = await prisma.proposal
        .createMany({
            data: proposals.map((proposal) => {
                return {
                    externalId: proposal.id,
                    name: String(proposal.title),
                    daoId: daoHandler.daoId,
                    daoHandlerId: daoHandler.id,
                    timeEnd: new Date(proposal.end * 1000),
                    timeStart: new Date(proposal.start * 1000),
                    timeCreated: new Date(proposal.created * 1000),
                    data: {},
                    url: proposal.link
                }
            }),
            skipDuplicates: true
        })
        .then(async (r) => {
            log_pd.log({
                level: 'info',
                message: `Upserted proposals for ${space}`,
                data: {
                    proposals: r
                }
            })
            return 'ok'
        })
        .catch(async (e) => {
            log_pd.log({
                level: 'error',
                message: `Could not upsert proposals proposals for ${space}`,
                data: {
                    proposals: e
                }
            })
            return 'nok'
        })

    return result
}

const getSnapshotSpaces = async (
    daoHandlerIds: string[]
): Promise<Map<DAOHandler, string>> => {
    const snapshotDaoHandlers = await prisma.dAOHandler.findMany({
        where: {
            id: {
                in: daoHandlerIds
            }
        },
        include: { dao: true }
    })

    const map = new Map<DAOHandler, string>()
    for (const snapshotDaoHandler of snapshotDaoHandlers) {
        if (snapshotDaoHandler.decoder && snapshotDaoHandler.decoder['space']) {
            map.set(snapshotDaoHandler, snapshotDaoHandler.decoder['space'])
        }
    }

    return map
}
