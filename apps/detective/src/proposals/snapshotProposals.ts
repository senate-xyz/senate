import { prisma, DAOHandler } from '@senate/database'
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

    let proposals

    const graphqlQuery = `{
                proposals (
                    first: 100, 
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

    try {
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
                if (res.status == 200) return false
                if (err) return true
            })
            .then((response) => {
                return response.body.data.proposals
            })
            .catch(async (e) => {
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
        for (const daoHandlerId of daoHandlerIds) {
            results.push({ daoHandlerId: daoHandlerId, response: 'nok' })
        }
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
            await prisma.dAOHandler.update({
                where: {
                    id: daoHandler.id
                },
                data: {
                    lastChainProposalCreatedBlock: 0,
                    lastSnapshotProposalCreatedTimestamp: new Date()
                }
            })
            return 'ok'
        })
        .catch(async (e) => {
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
