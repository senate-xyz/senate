import { InternalServerErrorException, Logger } from '@nestjs/common'
import { prisma } from '@senate/database'
import { DAOHandler } from '@prisma/client'

import axios from 'axios'

const logger = new Logger('SnapshotProposals')

export const updateSnapshotProposals = async (
    daoHandlerIds: string[],
    minCreatedAt: number
): Promise<Array<{ daoHandlerId: string; response: string }>> => {
    const results: Array<{ daoHandlerId: string; response: string }> = []

    const daoHandlerToSnapshotSpaceMap: Map<DAOHandler, string> =
        await getSnapshotSpaces(daoHandlerIds)
    const spacesArray = Array.from(daoHandlerToSnapshotSpaceMap.values())
    console.log('Spaces Array: ', spacesArray)

    logger.log(`Searching snapshot proposals for spaces: ${spacesArray}`)
    let proposals

    try {
        proposals = await axios
            .get('https://hub.snapshot.org/graphql', {
                method: 'POST',
                data: JSON.stringify({
                    query: `{
                proposals (
                    first:1000,
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
                }),
                headers: {
                    'content-type': 'application/json'
                }
            })
            .then((response) => {
                return response.data
            })
            .then((data) => {
                return data.data.proposals
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
    } catch (err) {
        logger.error('Error while updating snapshot proposals', err)
        throw new InternalServerErrorException()
    }

    return results
}

const upsertSnapshotProposals = async (
    daoHandler: DAOHandler,
    space: string,
    proposals: any[]
): Promise<string> => {
    const result = await prisma
        .$transaction(
            proposals.map((proposal) =>
                prisma.proposal.upsert({
                    where: {
                        externalId_daoId: {
                            daoId: daoHandler.daoId,
                            externalId: proposal.id
                        }
                    },
                    update: {},
                    create: {
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
                })
            )
        )
        .then((res) => {
            logger.log(
                `upserted ${res.length} snapshot proposals for space ${space}`
            )
            return 'ok'
        })
        .catch((err) => {
            logger.error('Error while upserting snapshot proposals', err)
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
        }
    })

    const map = new Map<DAOHandler, string>()
    for (const snapshotDaoHandler of snapshotDaoHandlers) {
        if (snapshotDaoHandler.decoder && snapshotDaoHandler.decoder['space']) {
            map.set(snapshotDaoHandler, snapshotDaoHandler.decoder['space'])
        }
    }

    return map
}
