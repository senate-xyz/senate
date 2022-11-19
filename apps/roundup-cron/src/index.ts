import { config } from 'dotenv'
import { ServerClient } from 'postmark'
import { schedule } from 'node-cron'
import { prisma } from '@senate/database'
import { RoundupNotificationType } from '@prisma/client'
import {
    Proposal,
    Subscription,
    SubscriptionWithProxies,
    Voter,
} from '@senate/common-types'

config()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const client = new ServerClient(process.env.POSTMARK_TOKEN ?? 'Missing Token')
const oneMonth = 2592000000
const threeDays = 259200000
const oneDay = 86400000
const now: number = Date.now()

// Creating a cron job which runs on every 10 second
schedule('*/15 * * * * *', async function () {
    if (!Boolean(process.env.ROUNDUP_ENABLE)) return

    console.log('running a task every 15 second')

    const lastMonthProposals: Proposal[] = await prisma.proposal.findMany({
        where: {
            addedAt: {
                gte: now - oneMonth,
            },
        },
    })

    await clearNotificationsTable()
    await addNewProposals(lastMonthProposals)
    await addEndingProposals(lastMonthProposals)
    await addRecentVotes()

    const notifications = await prisma.notification.findMany()
    console.log(notifications)

    sendRoundupEmails()
})

const clearNotificationsTable = async () => {
    console.log('Clearing notifications table...')
    await prisma.notification.deleteMany()
}

const addNewProposals = async (lastMonthProposals: Proposal[]) => {
    console.log('Adding new proposal notifications...')

    const proposals = lastMonthProposals.filter(
        (proposal) => proposal.data?.['timeCreated'] >= now - oneDay
    )

    if (proposals) {
        console.log(`Found ${proposals.length} new proposals`)
    } else {
        console.log(`Found 0 new proposals`)
    }

    for (const proposal of proposals) {
        const subscriptions: Subscription[] =
            await prisma.subscription.findMany({
                where: {
                    daoId: proposal.daoId,
                },
            })

        await prisma
            .$transaction(
                subscriptions.map((subscription: Subscription) => {
                    return prisma.notification.upsert({
                        where: {
                            proposalId_userId_type: {
                                proposalId: proposal.id,
                                userId: subscription.userId,
                                type: RoundupNotificationType.NEW,
                            },
                        },
                        update: {},
                        create: {
                            userId: subscription.userId,
                            proposalId: proposal.id,
                            type: RoundupNotificationType.NEW,
                        },
                    })
                })
            )
            .then((res) => {
                if (res) console.log(`Inserted ${res.length} notifications`)
                else console.log('Inserted 0 notifications')

                return res
            })
    }

    console.log('\n')
}

const addEndingProposals = async (lastMonthProposals: Proposal[]) => {
    console.log('Adding voting due proposal notifications...')

    console.log('Last month proposals: ', lastMonthProposals.length)

    const proposals = lastMonthProposals.filter(
        (proposal) =>
            proposal.data?.['timeEnd'] <= now + threeDays &&
            proposal.data?.['timeEnd'] > now
    )

    console.log('About to end proposals: ', proposals.length, proposals[0])

    if (proposals) {
        console.log(`Found ${proposals.length} ending soon proposals`)
    } else {
        console.log(`Found 0 ending soon proposals`)
    }

    for (const proposal of proposals) {
        const subscriptions: SubscriptionWithProxies[] =
            await prisma.subscription.findMany({
                where: {
                    daoId: proposal.daoId,
                },
                include: {
                    user: {
                        select: {
                            voters: true,
                        },
                    },
                },
            })

        for (const subscription of subscriptions) {
            const userHasVoted = await userVoted(
                subscription.user.voters,
                proposal.id,
                proposal.daoId
            )
            if (!userHasVoted) {
                console.log(
                    `User ${subscription.userId} hasn't voted for ${proposal.name}`
                )
                await prisma.notification.upsert({
                    where: {
                        proposalId_userId_type: {
                            proposalId: proposal.id,
                            userId: subscription.userId,
                            type: RoundupNotificationType.ENDING_SOON,
                        },
                    },
                    update: {},
                    create: {
                        userId: subscription.userId,
                        proposalId: proposal.id,
                        type: RoundupNotificationType.ENDING_SOON,
                    },
                })
            } else {
                console.log(
                    `User ${subscription.userId} has already voted for ${proposal.name}`
                )
            }
        }
    }

    console.log('\n')
}

const addRecentVotes = async () => {
    // Get votes added within 24hrs
    const votes = await prisma.vote.findMany({
        where: {
            addedAt: {
                gt: now - oneDay,
            },
        },
        include: {
            voter: {
                include: {
                    users: true,
                },
            },
        },
    })

    console.log('Recent votes', votes)

    for (const vote of votes) {
        for (const user of vote.voter.users) {
            // if (user subscribed to DAO)
            await prisma.notification.upsert({
                where: {
                    proposalId_userId_type: {
                        proposalId: vote.proposalId,
                        userId: user.id,
                        type: RoundupNotificationType.VOTED,
                    },
                },
                update: {},
                create: {
                    userId: user.id,
                    proposalId: vote.proposalId,
                    type: RoundupNotificationType.VOTED,
                },
            })
        }
    }
}

const sendRoundupEmails = async () => {
    const users = await prisma.user.findMany()
    for (const user of users) {
        const endingSoonNotifs = (
            await prisma.notification.findMany({
                where: {
                    userId: user.id,
                    type: RoundupNotificationType.ENDING_SOON,
                },
                include: {
                    proposal: {
                        include: {
                            dao: true,
                        },
                    },
                },
            })
        ).map((notification) => {
            return {
                proposalName: notification.proposal.name,
                proposalUrl: notification.proposal.url,
                daoLogo: notification.proposal.dao.picture,
                timeEnd: new Date(notification.proposal.data?.['timeEnd']),
                daysLeft: getDaysDifference(
                    now,
                    notification.proposal.data?.['timeEnd']
                ),
                hoursLeft: getHoursDifference(
                    now,
                    notification.proposal.data?.['timeEnd']
                ),
                minutesLeft: getMinutesDifference(
                    now,
                    notification.proposal.data?.['timeEnd']
                ),
            }
        })

        console.log('Time now', new Date(now))
        console.log('Ending soon votes', endingSoonNotifs)

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const newProposalsNotifs = (
            await prisma.notification.findMany({
                where: {
                    userId: user.id,
                    type: RoundupNotificationType.NEW,
                },
                include: {
                    proposal: {
                        include: {
                            dao: true,
                        },
                    },
                },
            })
        ).map((notification) => {
            return {
                proposalName: notification.proposal.name,
                proposalUrl: notification.proposal.url,
                daoLogo: notification.proposal.dao.picture,
                timeEnd: new Date(notification.proposal.data?.['timeEnd']),
                daysLeft: getDaysDifference(
                    now,
                    notification.proposal.data?.['timeEnd']
                ),
                hoursLeft: getHoursDifference(
                    now,
                    notification.proposal.data?.['timeEnd']
                ),
                minutesLeft: getMinutesDifference(
                    now,
                    notification.proposal.data?.['timeEnd']
                ),
            }
        })

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const votedProposalsNotifs = (
            await prisma.notification.findMany({
                where: {
                    userId: user.id,
                    type: RoundupNotificationType.VOTED,
                },
                include: {
                    proposal: {
                        include: {
                            dao: true,
                        },
                    },
                },
            })
        ).map((notification) => {
            return {
                proposalName: notification.proposal.name,
                proposalUrl: notification.proposal.url,
                daoLogo: notification.proposal.dao.picture,
                timeEnd: new Date(notification.proposal.data?.['timeEnd']),
                daysLeft: getDaysDifference(
                    now,
                    notification.proposal.data?.['timeEnd']
                ),
                hoursLeft: getHoursDifference(
                    now,
                    notification.proposal.data?.['timeEnd']
                ),
                minutesLeft: getMinutesDifference(
                    now,
                    notification.proposal.data?.['timeEnd']
                ),
            }
        })

        // client.sendEmailWithTemplate({
        //     "TemplateAlias": "roundup",
        //     "TemplateModel": {
        //       "endingSoonNotifs": endingSoonNotifs,
        //       "newProposalsNotifs": newProposalsNotifs,
        //       "votedProposalsNotifs": votedProposalsNotifs
        //     },
        //     "InlineCss": true,
        //     "From": "info@senatelabs.xyz",
        //     "To": `${user.email}`,
        //     //"Bcc": "eugenptr@gmail.com,kohnagata@gmail.com,contact@andreiv.com,paulo@hey.com",
        //     "Tag": "Daily Roundup",
        //     "Headers": [
        //       {
        //         "Name": "CUSTOM-HEADER",
        //         "Value": "value"
        //       }
        //     ],
        //     "TrackOpens": true,
        //     "Metadata": {
        //         "color":"blue",
        //         "client-id":"12345"
        //      },
        //      "MessageStream": "outbound"
        //   })
    }
}

const getDaysDifference = (timestamp1: number, timestamp2: number): number => {
    const timestampDifference = timestamp2 - timestamp1
    const daysDifference = Math.floor(timestampDifference / 1000 / 60 / 60 / 24)

    return daysDifference
}

const getHoursDifference = (timestamp1: number, timestamp2: number): number => {
    const timestampDifference = timestamp2 - timestamp1
    const daysDifference = getDaysDifference(timestamp1, timestamp2)
    const hoursDifference = Math.floor(timestampDifference / 1000 / 60 / 60)

    return hoursDifference - daysDifference * 24
}

const getMinutesDifference = (
    timestamp1: number,
    timestamp2: number
): number => {
    const timestampDifference = timestamp2 - timestamp1
    const hoursDifference = getHoursDifference(timestamp1, timestamp2)
    const minutesDifference = Math.floor(timestampDifference / 1000 / 60)

    return minutesDifference - hoursDifference * 60
}

const userVoted = async (
    voters: Voter[],
    proposalId: string,
    daoId: string
) => {
    let voted = false
    for (const voter of voters) {
        const vote = await prisma.vote.findFirst({
            where: {
                voterAddress: voter.address,
                daoId: daoId,
                proposalId: proposalId,
            },
        })

        console.log(
            `Proxy address ${voter.address} has vote ${vote} for proposal ${proposalId} in DAO ${daoId}`
        )

        if (vote) voted = true
    }

    console.log('User has voted: ', voted)

    return voted
}
