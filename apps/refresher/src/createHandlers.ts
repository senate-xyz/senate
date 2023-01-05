import { log_ref } from '@senate/axiom'
import { RefreshStatus, prisma } from '@senate/database'

export const createVoterHandlers = async () => {
    const votersCnt = await prisma.voter.count({})
    const daoHandlersCnt = await prisma.dAOHandler.count({})
    const voterHandlersCnt = await prisma.voterHandler.count({})

    if (voterHandlersCnt >= votersCnt * daoHandlersCnt) {
        console.log({
            action: 'createVoterHandlers',
            details: 'skip'
        })
        return
    }

    log_ref.log({
        level: 'info',
        message: `Create vote handlers`
    })

    const voters = await prisma.voter.findMany({})
    const daoHandlers = await prisma.dAOHandler.findMany({})

    for (const voter of voters) {
        await prisma.voterHandler
            .createMany({
                data: daoHandlers.map((daoHandler) => {
                    return {
                        daoHandlerId: daoHandler.id,
                        voterId: voter.id,
                        refreshStatus: RefreshStatus.NEW
                    }
                }),
                skipDuplicates: true
            })
            .then((r) => {
                log_ref.log({
                    level: 'info',
                    message: `Created vote handlers`,
                    data: { voteHandlers: r }
                })
                return
            })
            .catch((e) => {
                log_ref.log({
                    level: 'error',
                    message: `Failed to create vote handlers`,
                    data: { error: e }
                })
            })
    }
}
