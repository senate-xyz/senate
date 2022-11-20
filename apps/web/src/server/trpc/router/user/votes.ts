import { prisma } from '@senate/database'
import { RefreshStatus } from '@senate/common-types'
import { router, publicProcedure } from '../../trpc'

export const userVotesRouter = router({
    refreshVotes: publicProcedure.mutation(async ({ ctx }) => {
        const user = await prisma.user
            .findFirstOrThrow({
                where: {
                    name: { equals: String(ctx.session?.user?.name) },
                },
                select: {
                    id: true,
                },
            })
            .catch(() => {
                return { id: '0' }
            })

        const voters = await prisma.voter.findMany({
            where: {
                users: {
                    some: { id: user.id },
                },
            },
        })

        await prisma.voter.updateMany({
            where: {
                id: {
                    in: voters.map((voter) => voter.id),
                },
            },
            data: {
                refreshStatus: RefreshStatus.NEW,
            },
        })
        return true
    }),
})
