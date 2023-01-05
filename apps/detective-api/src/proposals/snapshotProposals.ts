import { InternalServerErrorException } from '@nestjs/common'
import { prisma } from '@senate/database'
import { DAOHandler } from '@prisma/client'

import axios from 'axios'
import { axiom } from '@senate/axiom'

export const updateSnapshotProposals = async (
    daoHandlerIds: string[],
    minCreatedAt: number
): Promise<Array<{ daoHandlerId: string; response: string }>> => {
    const results: Array<{ daoHandlerId: string; response: string }> = []

    const daoHandlerToSnapshotSpaceMap: Map<DAOHandler, string> =
        await getSnapshotSpaces(daoHandlerIds)
    const spacesArray = Array.from(daoHandlerToSnapshotSpaceMap.values())

    await axiom.datasets.ingestEvents(
        `proposal-detective-${process.env.AXIOM_DEPLOYMENT}`,
        [
            {
                event: 'updateSnapshotProposals',
                details: `run`,
                item: {
                    daoHandlers: daoHandlerIds,
                    minCreatedAt: minCreatedAt,
                    spaces: spacesArray
                }
            }
        ]
    )

    let proposals

    try {
        proposals = await axios
            .get('https://hub.snapshot.org/graphql', {
                method: 'POST',
                data: JSON.stringify({
                    query: `{
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
            .catch(async (e) => {
                await axiom.datasets.ingestEvents(
                    `proposal-detective-${process.env.AXIOM_DEPLOYMENT}`,
                    [
                        {
                            event: 'updateSnapshotProposals',
                            details: `graphql`,
                            err: JSON.stringify(e)
                        }
                    ]
                )
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
        await axiom.datasets.ingestEvents(
            `proposal-detective-${process.env.AXIOM_DEPLOYMENT}`,
            [
                {
                    event: 'updateSnapshotProposals',
                    details: 'run',
                    err: JSON.stringify(e)
                }
            ]
        )
        throw new InternalServerErrorException()
    }
    await axiom.datasets.ingestEvents(
        `proposal-detective-${process.env.AXIOM_DEPLOYMENT}`,
        [
            {
                event: 'updateSnapshotProposals',
                details: `success`,
                item: { proposals: proposals.length, response: results }
            }
        ]
    )

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
            await axiom.datasets.ingestEvents(
                `proposal-detective-${process.env.AXIOM_DEPLOYMENT}`,
                [
                    {
                        event: 'updateSnapshotProposals',
                        details: `new-proposal`,
                        item: { proposal: r }
                    }
                ]
            )

            return 'ok'
        })
        .catch(async (e) => {
            await axiom.datasets.ingestEvents(
                `proposal-detective-${process.env.AXIOM_DEPLOYMENT}`,
                [
                    {
                        event: 'updateSnapshotProposals',
                        details: `new-proposal`,
                        err: JSON.stringify(e)
                    }
                ]
            )
            console.log(e)

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
