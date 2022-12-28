import { RefreshStatus } from '@senate/database'
import { router, protectedProcedure } from '../../trpc'

export const userVotesRouter = router({
    refreshVotes: protectedProcedure.mutation(async ({ ctx }) => {
        const user = await ctx.prisma.user
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

        const voters = await ctx.prisma.voter.findMany({
            where: {
                users: {
                    some: { id: user.id },
                },
            },
        })

        await ctx.prisma.voterHandler.updateMany({
            where: {
                voterId: {
                    in: voters.map((voter) => voter.id),
                },
            },
            data: {
                refreshStatus: RefreshStatus.NEW,
            },
        })
    }),
})
