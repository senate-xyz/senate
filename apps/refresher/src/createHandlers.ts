import { log_ref } from '@senate/axiom'
import { RefreshStatus, prisma } from '@senate/database'

export const createVoterHandlers = async () => {
    const votersCnt = await prisma.voter.count({})
    const daoHandlersCnt = await prisma.dAOHandler.count({})
    const voterHandlersCnt = await prisma.voterHandler.count({})

    if (voterHandlersCnt >= votersCnt * daoHandlersCnt) {
        return
    }

    const voters = await prisma.voter.findMany({})
    const daoHandlers = await prisma.dAOHandler.findMany({})

    for (const voter of voters) {
        await prisma.voterHandler.createMany({
            data: daoHandlers.map((daoHandler) => {
                return {
                    daoHandlerId: daoHandler.id,
                    voterId: voter.id,
                    refreshStatus: RefreshStatus.NEW
                }
            }),
            skipDuplicates: true
        })
    }
}
