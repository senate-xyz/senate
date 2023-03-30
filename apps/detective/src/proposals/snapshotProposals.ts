import { prisma, Decoder } from '@senate/database'
import { log_pd } from '@senate/axiom'
import axios from 'axios'

type GraphQLProposal = {
    id: string
    title: string
    body: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    choices: any
    scores: number[]
    scores_total: number
    quorum: number
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

    const daoHandler = await prisma.daohandler.findFirstOrThrow({
        where: { id: daoHandlerId },
        include: { dao: true }
    })

    const oldIndex = await daoHandler.snapshotindex.getTime()

    const space = (daoHandler.decoder as Decoder).space

    let proposals

    const graphqlQuery = `{
        proposals (
            first: 1000, 
            where: {
            space: "${space}",
            created_gte: ${Math.floor(oldIndex / 1000)}
            },
            orderBy: "created",
            orderDirection: asc
        ) 
        {
            id
            title
            body
            choices
            scores
            scores_total
            created
            start
            end
            quorum
            state
            link
            space
            {
                id
            }
        }
    }`

    try {
        const proposals = (await axios
            .get('https://hub.snapshot.org/graphql', {
                params: { query: graphqlQuery },
                timeout: 5 * 60 * 1000
            })
            .then((response) => {
                return response.data.data.proposals
            })) as GraphQLProposal[]

        await prisma.$transaction(
            proposals.map((proposal) => {
                return prisma.proposal.upsert({
                    where: {
                        externalid_daoid: {
                            externalid: proposal.id,
                            daoid: daoHandler.daoid
                        }
                    },
                    update: {
                        choices: proposal.choices,
                        scores: proposal.scores,
                        scorestotal: proposal.scores_total
                    },
                    create: {
                        name: String(proposal.title),
                        externalid: proposal.id,
                        choices: proposal.choices,
                        scores: proposal.scores,
                        scorestotal: proposal.scores_total,
                        quorum: proposal.quorum,
                        timecreated: new Date(proposal.created * 1000),
                        timestart: new Date(proposal.start * 1000),
                        timeend: new Date(proposal.end * 1000),
                        url: proposal.link,

                        daoid: daoHandler.daoid,
                        daohandlerid: daoHandler.id
                    }
                })
            })
        )

        const closedProposals = proposals.filter(
            (proposal) =>
                new Date(proposal.end * 1000).getTime() < new Date().getTime()
        )

        const openProposals = proposals.filter(
            (proposal) =>
                new Date(proposal.end * 1000).getTime() > new Date().getTime()
        )

        let newIndex

        if (openProposals.length > 0) {
            newIndex =
                Math.min(...openProposals.map((proposal) => proposal.created)) *
                1000
        } else if (closedProposals.length > 0) {
            newIndex =
                Math.max(
                    ...closedProposals.map((proposal) => proposal.created)
                ) * 1000
        } else {
            newIndex = oldIndex
        }

        await prisma.daohandler.update({
            where: {
                id: daoHandler.id
            },
            data: {
                chainindex: 1920000,
                snapshotindex: new Date(newIndex)
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
            errorStack: (e as Error).stack,
            response: [{ daoHandlerId: daoHandlerId, response: response }]
        })
    }

    log_pd.log({
        level: 'info',
        message: `Search for proposals ${daoHandler.dao.name} - ${daoHandler.type}`,
        searchType: 'PROPOSALS',
        sourceType: 'SNAPSHOT',
        created_gt: Math.floor(oldIndex / 1000),
        proposals: proposals,
        response: [{ daoHandlerId: daoHandlerId, response: response }]
    })

    return [{ daoHandlerId: daoHandlerId, response: response }]
}
