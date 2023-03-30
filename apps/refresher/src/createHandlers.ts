import { prisma, RefreshStatus } from '@senate/database'

export const createVoterHandlers = async () => {
    const votersCnt = await prisma.voter.count({})
    const daoHandlersCnt = await prisma.daohandler.count({})
    const voterHandlersCnt = await prisma.voterhandler.count({})

    if (voterHandlersCnt >= votersCnt * daoHandlersCnt) {
        return
    }

    const voters = await prisma.voter.findMany({})
    const daoHandlers = await prisma.daohandler.findMany({})

    for (const voter of voters) {
        await prisma.voterhandler.createMany({
            data: daoHandlers.map((daoHandler) => {
                return {
                    daohandlerid: daoHandler.id,
                    voterid: voter.id,
                    refreshstatus: RefreshStatus.NEW
                }
            }),
            skipDuplicates: true
        })
    }
}
