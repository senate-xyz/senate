import { RefreshStatus, prisma } from '@senate/database'

export const createVoterHandlers = async () => {
    const votersCnt = await prisma.voter.count({})
    const daoHandlersCnt = await prisma.dAOHandler.count({})
    const voterHandlersCnt = await prisma.voterHandler.count({})

    console.log({
        action: 'createVoterHandlers',
        details: 'start'
    })

    if (voterHandlersCnt >= votersCnt * daoHandlersCnt) {
        console.log({
            action: 'createVoterHandlers',
            details: 'skip'
        })
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

    console.log({
        action: 'createVoterHandlers',
        details: 'end'
    })
}
