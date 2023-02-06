import { prisma } from '@senate/database'
import { log_pd } from '@senate/axiom'
import superagent from 'superagent'

export const updateSnapshotProposals = async (
    daoHandlerId: string,
    minCreatedAt: number
): Promise<Array<{ daoHandlerId: string; response: string }>> => {
    let response = 'nok'

    const daoHandler = await prisma.dAOHandler.findFirst({
        where: { id: daoHandlerId },
        include: { dao: true }
    })

    const space = daoHandler.decoder['space']

    let proposals

    const graphqlQuery = `{
                proposals (
                    first: 1000, 
                    where: {
                    space_in: ["${space}"],
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
                response: 10000,
                deadline: 30000
            })
            .retry(3, (err, res) => {
                if (err) return true
                if (res.status == 200) return false
            })
            .then((response) => {
                return response.body.data.proposals
            })

        if (proposals.length)
            await prisma.proposal.createMany({
                data: proposals.map((proposal) => {
                    return {
                        externalId: proposal.id,
                        name: String(proposal.title),
                        daoId: daoHandler.daoId,
                        daoHandlerId: daoHandler.id,
                        timeEnd: new Date(proposal.end * 1000),
                        timeStart: new Date(proposal.start * 1000),
                        timeCreated: new Date(proposal.created * 1000),
                        url: proposal.link
                    }
                }),
                skipDuplicates: true
            })

        const newMaxCreated = proposals.length
            ? Math.max(...proposals.map((proposal) => proposal.created)) * 1000
            : Date.now()

        await prisma.dAOHandler.update({
            where: {
                id: daoHandler.id
            },
            data: {
                lastChainProposalCreatedBlock: 0,
                lastSnapshotProposalCreatedDate: new Date(newMaxCreated)
            }
        })

        response = 'ok'
    } catch (e: any) {
        log_pd.log({
            level: 'error',
            message: `Search for proposals ${daoHandler.dao.name} - ${daoHandler.type}`,
            searchType: 'PROPOSALS',
            sourceType: 'SNAPSHOT',
            created_gt: Math.floor(minCreatedAt / 1000),
            proposalsCount: proposals.length ?? 0,
            errorMessage: e.message,
            errorStack: e.stack
        })
    }

    const res = [{ daoHandlerId: daoHandlerId, response: response }]

    log_pd.log({
        level: 'info',
        message: `Search for proposals ${daoHandler.dao.name} - ${daoHandler.type}`,
        searchType: 'PROPOSALS',
        sourceType: 'SNAPSHOT',
        created_gt: Math.floor(minCreatedAt / 1000),
        proposalsCount: proposals.length ?? 0,
        response: res
    })

    return res
}
