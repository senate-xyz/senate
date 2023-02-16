import { prisma, Decoder } from '@senate/database'
import { log_pd } from '@senate/axiom'
import superagent from 'superagent'

type GraphQLProposal = {
    id: string
    title: string
    body: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    choices: any
    scores: number[]
    scores_total: number
    created: number
    start: number
    end: number
    link: string
    space: {
        id: string
    }
}

export const updateSnapshotProposals = async (
    daoHandlerId: string
): Promise<Array<{ daoHandlerId: string; response: string }>> => {
    let response = 'nok'

    const daoHandler = await prisma.dAOHandler.findFirstOrThrow({
        where: { id: daoHandlerId },
        include: { dao: true }
    })

    const oldIndex = await daoHandler.snapshotIndex.getTime()

    const space = (daoHandler.decoder as Decoder).space

    let proposals

    const graphqlQuery = `{
                proposals (
                    first: 1000, 
                    where: {
                    space: "${space}",
                    created_gt: ${Math.floor(oldIndex / 1000)}
                    },
                    orderBy: "created",
                    orderDirection: asc
                ) {
                    id
                    title
                    body
                    choices
                    scores
                    scores_total
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
        proposals = (await superagent
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
            .then((response) => {
                return response.body.data.proposals
            })) as GraphQLProposal[]

        let newIndex = Date.now()
        if (proposals.length) {
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
                        choices: proposal.choices,
                        scores: proposal.scores,
                        scoresTotal: proposal.scores_total,
                        url: proposal.link
                    }
                }),
                skipDuplicates: true
            })
            newIndex =
                Math.max(...proposals.map((proposal) => proposal.created)) *
                1000
        }

        await prisma.dAOHandler.update({
            where: {
                id: daoHandler.id
            },
            data: {
                chainIndex: 1920000,
                snapshotIndex: new Date(newIndex)
            }
        })

        response = 'ok'
    } catch (e) {
        log_pd.log({
            level: 'error',
            message: `Search for proposals ${daoHandler.dao.name} - ${daoHandler.type}`,
            searchType: 'PROPOSALS',
            sourceType: 'SNAPSHOT',
            created_gt: Math.floor(oldIndex / 1000),
            proposals: proposals,
            errorName: (e as Error).name,
            errorMessage: (e as Error).message,
            errorStack: (e as Error).stack
        })
    }

    const res = [{ daoHandlerId: daoHandlerId, response: response }]

    log_pd.log({
        level: 'info',
        message: `Search for proposals ${daoHandler.dao.name} - ${daoHandler.type}`,
        searchType: 'PROPOSALS',
        sourceType: 'SNAPSHOT',
        created_gt: Math.floor(oldIndex / 1000),
        proposals: proposals,
        response: res
    })

    return res
}
