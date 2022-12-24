import { prisma } from '@senate/database'
import { RefreshStatus, Subscription } from '@senate/common-types'
import fetch from 'node-fetch'
import * as cron from 'node-cron'

const main = () => {
    console.log('Refresher start')

    cron.schedule('*/10 * * * * *', async () => {
        console.log('Running refresher')
        refreshDaos()
        refreshUsers()
    })

    cron.schedule(
        process.env.REFRESHER_INTERVAL ?? '*/10 * * * *',
        async () => {
            console.log('Auto refresh request')
            await autoRefreshRequest()
        }
    )

    cron.schedule(
        process.env.REFRESHER_FORCE_INTERVAL ?? '5 */3 * * *',
        async () => {
            console.log('Auto force refresh request')
            await autoForceRefreshRequest()
        }
    )
}

const autoRefreshRequest = async () => {
    await prisma.dAO.updateMany({
        where: {
            refreshStatus: RefreshStatus.DONE,
        },
        data: {
            refreshStatus: RefreshStatus.NEW,
        },
    })
    await prisma.voter.updateMany({
        where: {
            refreshStatus: RefreshStatus.DONE,
        },
        data: {
            refreshStatus: RefreshStatus.NEW,
        },
    })
}

const autoForceRefreshRequest = async () => {
    await prisma.dAO.updateMany({
        where: {
            refreshStatus: RefreshStatus.PENDING,
        },
        data: {
            refreshStatus: RefreshStatus.NEW,
        },
    })
    await prisma.voter.updateMany({
        where: {
            refreshStatus: RefreshStatus.PENDING,
        },
        data: {
            refreshStatus: RefreshStatus.NEW,
        },
    })
}
const refreshDaos = async () => {
    console.log('Refresh DAOs')

    const daos = await prisma.dAO.findMany({
        where: {
            refreshStatus: RefreshStatus.NEW,
        },
        take: 10,
    })

    if (!daos.length) {
        console.log('No DAOs to refresh.')
        return
    } else console.log(`Refreshing ${daos.length} DAOs`)

    for await (const dao of daos) {
        await prisma.dAO.update({
            where: {
                id: dao.id,
            },
            data: {
                refreshStatus: RefreshStatus.PENDING,
            },
        })

        console.log(
            `Refresh - PENDING - ${dao.name} (${dao.id}) at ${dao.lastRefresh}`
        )

        await new Promise((resolve) => setTimeout(resolve, 1000))

        fetch(`${process.env.DETECTIVE_URL}/updateProposals?daoId=${dao.id}`, {
            method: 'POST',
        })
            .then(async (res) => {
                if (res.ok) {
                    console.log(
                        `Refresh - DONE - ${dao.name} (${dao.id}) at ${dao.lastRefresh}`
                    )
                    await prisma.dAO.update({
                        where: {
                            id: dao.id,
                        },
                        data: {
                            refreshStatus: RefreshStatus.DONE,
                            lastRefresh: new Date(),
                        },
                    })
                }
                return
            })
            .catch((e) => {
                console.log(e)
            })
    }
}

const refreshUsers = async () => {
    console.log('Refresh Voters')

    const voters = await prisma.voter.findMany({
        where: {
            refreshStatus: RefreshStatus.NEW,
        },
    })

    if (!voters.length) {
        console.log('No users to refresh.')
        return
    } else console.log(`Refreshing ${voters.length} voters`)

    for (const voter of voters) {
        console.log(`Refresh voter: ${voter.address} (${voter.id})`)

        const users = await prisma.user.findMany({
            where: {
                voters: {
                    some: {
                        id: voter.id,
                    },
                },
            },
            include: {
                subscriptions: true,
            },
        })

        const subs = users.map((user) => user.subscriptions)

        let totalSubs: Subscription[] = []

        for (const sub of subs) {
            totalSubs = [...sub]
        }

        if (totalSubs.length) {
            await prisma.voter.update({
                where: {
                    id: voter.id,
                },
                data: {
                    refreshStatus: RefreshStatus.PENDING,
                },
            })
        } else {
            //nothing to update
            await prisma.voter.update({
                where: {
                    id: voter.id,
                },
                data: {
                    refreshStatus: RefreshStatus.DONE,
                    lastRefresh: new Date(),
                },
            })
        }

        for await (const sub of totalSubs) {
            console.log(
                `Refresh - PENDING - voter ${voter.address} - daoId ${sub.daoId} -> ${process.env.DETECTIVE_URL}/updateVotes?daoId=${sub.daoId}&voterAddress=${voter.address}`
            )

            await new Promise((resolve) => setTimeout(resolve, 1000))

            fetch(
                `${process.env.DETECTIVE_URL}/updateVotes?daoId=${sub.daoId}&voterAddress=${voter.address}`,
                {
                    method: 'POST',
                }
            )
                .then(async (res) => {
                    if (res.ok) {
                        console.log(
                            `Refresh - DONE -  voter ${voter.address} - ${sub.daoId} -> ${process.env.DETECTIVE_URL}/updateVotes?daoId=${sub.daoId}&voterAddress=${voter.address}`
                        )
                        await prisma.voter.update({
                            where: {
                                id: voter.id,
                            },
                            data: {
                                refreshStatus: RefreshStatus.DONE,
                                lastRefresh: new Date(),
                            },
                        })
                    }
                    return
                })
                .catch((e) => {
                    console.log(e)
                })
        }
    }
}

main()
