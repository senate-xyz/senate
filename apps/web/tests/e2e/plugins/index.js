import { prisma } from '@senate/database'

module.exports = (on) => {
    on('task', {
        deleteAllSubscriptions: async () => {
            const user = prisma.user.findFirstOrThrow({
                where: {
                    name: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
                },
            })

            await prisma.subscription.deleteMany({
                where: { userId: (await user).id },
            })
        },
    })
}
