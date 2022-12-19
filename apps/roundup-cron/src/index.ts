import { config } from 'dotenv'
import axios from 'axios'
import { ServerClient } from 'postmark'
import { schedule } from 'node-cron'
import { prisma } from '@senate/database'
import { RoundupNotificationType } from '@prisma/client'
import {
    Subscription,
    UserWithVotingAddresses,
    Voter,
    Proposal
} from '@senate/common-types'

config()

const client = new ServerClient(process.env.POSTMARK_TOKEN ?? 'Missing Token')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const oneMonth = 2592000000
const threeDays = 259200000
const oneDay = 86400000
const now: number = Date.now()

// Cron job which runs whenever dictated by env var OR on Feb 31st if env var is missing
schedule(
    String(process.env.ROUNDUP_CRON_INTERVAL) ?? '* * 31 2 *',
    async function () {
        if (!Boolean(process.env.ROUNDUP_ENABLE)) return

        console.log('Starting roundup cron job...')
        await clearNotificationsTable()
        console.log('Notifications table cleared')
        await addNewProposals()
        console.log('New proposals added')
    //     await addEndingProposals()
    //     console.log('Ending proposals added')
    //     await addPastProposals()
    //     console.log('Past proposals added')

    //     await sendRoundupEmails()
    //     console.log('Emails have been sent')
    }
)

const clearNotificationsTable = async () => {
    console.log('Clearing notifications table...')
    await prisma.notification.deleteMany()
}

const insertNotifications = async (proposals: Proposal[], type: RoundupNotificationType) => {
    
    for (const proposal of proposals) {

        //Get users which should be notified
        const users = await prisma.user.findMany({
            where: {
                email: {
                    not: ''
                },
                userSettings: {
                    dailyBulletinEmail: true
                },
                subscriptions: {
                    some: {
                        daoId: proposal.daoId
                    }
                }
            },
            select: {
                id: true,
            }
        })

        await prisma
            .$transaction(
                users.map((user) => {
                    return prisma.notification.upsert({
                        where: {
                            proposalId_userId_type: {
                                proposalId: proposal.id,
                                userId: user.id,
                                type: type,
                            },
                        },
                        update: {},
                        create: {
                            userId: user.id,
                            proposalId: proposal.id,
                            daoId: proposal.daoId,
                            type: RoundupNotificationType.NEW,
                        },
                    })
                })
            )
            .then((res) => {
                return res
            })
    }
}

const addNewProposals = async () => {
    console.log('Adding new proposal notifications...')

    const proposals = await prisma.proposal.findMany({
        where: {
            timeCreated: {
                gte: new Date(now - oneDay),
            },
        },
        orderBy: {
            timeEnd: 'asc',
        },
    })

    if (proposals) {
        console.log(`Found ${proposals.length} new proposals`)
    } else {
        console.log(`Found 0 new proposals`)
    }

    insertNotifications(proposals, RoundupNotificationType.NEW)

    console.log('\n')
}

const addEndingProposals = async () => {
    console.log('Adding ending proposals...')

    const proposals = await prisma.proposal.findMany({
        where: {
            AND: [
                {
                    timeEnd: {
                        lte: new Date(now + threeDays),
                    },
                },
                {
                    timeEnd: {
                        gt: new Date(now),
                    },
                },
            ],
        },
        orderBy: {
            timeEnd: 'asc',
        },
    })

    if (proposals) {
        console.log(`Found ${proposals.length} ending soon proposals`)
    } else {
        console.log(`Found 0 ending soon proposals`)
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
                                type: RoundupNotificationType.ENDING_SOON,
                            },
                        },
                        update: {},
                        create: {
                            userId: subscription.userId,
                            proposalId: proposal.id,
                            daoId: proposal.daoId,
                            type: RoundupNotificationType.ENDING_SOON,
                        },
                    })
                })
            )
            .then((res) => {
                return res
            })
    }

    console.log('\n')
}

const addPastProposals = async () => {
    console.log('Adding new proposal notifications...')

    const proposals = await prisma.proposal.findMany({
        where: {
            AND: [
                {
                    timeEnd: {
                        lte: new Date(now),
                    },
                },
                {
                    timeEnd: {
                        gte: new Date(now - oneDay),
                    },
                },
            ],
        },
        orderBy: {
            timeEnd: 'desc',
        },
    })

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
                                type: RoundupNotificationType.PAST,
                            },
                        },
                        update: {},
                        create: {
                            userId: subscription.userId,
                            proposalId: proposal.id,
                            daoId: proposal.daoId,
                            type: RoundupNotificationType.PAST,
                        },
                    })
                })
            )
            .then((res) => {
                return res
            })
    }

    console.log('\n')
}

const formatEmailTableData = async (
    user: UserWithVotingAddresses,
    notificationType: RoundupNotificationType
): Promise<any> => {
    const proposals = await prisma.notification.findMany({
        where: {
            userId: user.id,
            type: notificationType,
        },
        include: {
            proposal: {
                include: {
                    dao: true,
                },
            },
        },
    })

    const promises = proposals.map(async (notification) => {
        const voted = await userVoted(
            user.voters,
            notification.proposalId,
            notification.daoId
        )
        const dateOptions: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }

        const countdownUrl = await generateCountdownGifUrl(
            notification.proposal.timeEnd
        )

        const votingStatus = voted
            ? 'Voted'
            : notificationType == RoundupNotificationType.PAST
            ? "Didn't vote"
            : 'Not voted yet'

        const votingStatusIconUrl = voted
            ? process.env.WEBAPP_URL + '/assets/Icon/Voted.png'
            : notificationType == RoundupNotificationType.PAST
            ? process.env.WEBAPP_URL + '/assets/Icon/DidntVote.png'
            : process.env.WEBAPP_URL + '/assets/Icon/NotVotedYet.png'

        return {
            votingStatus: votingStatus,
            votingStatusIconUrl: votingStatusIconUrl,
            proposalName:
                notification.proposal.name.length > 100
                    ? notification.proposal.name.substring(0, 100) + '...'
                    : notification.proposal.name,
            proposalUrl: notification.proposal.url,
            daoLogoUrl:
                process.env.WEBAPP_URL + notification.proposal.dao.picture,
            endHoursUTC: formatTwoDigit(
                notification.proposal.timeEnd.getUTCHours()
            ),
            endMinutesUTC: formatTwoDigit(
                notification.proposal.timeEnd.getUTCMinutes()
            ),
            endDateString: notification.proposal.timeEnd.toLocaleDateString(
                undefined,
                dateOptions
            ),
            countdownUrl: countdownUrl,
        }
    })

    return Promise.all(promises)
}

const formatTwoDigit = (timeUnit: number): string => {
    const timeUnitStr = timeUnit.toString()
    return timeUnitStr.length == 1 ? '0' + timeUnitStr : timeUnitStr
}

const generateCountdownGifUrl = async (endTime: Date): Promise<string> => {
    let url = ''

    const yearUTC = endTime.getUTCFullYear()
    const monthUTC = formatTwoDigit(endTime.getUTCMonth() + 1)
    const dateUTC = formatTwoDigit(endTime.getUTCDate())
    const hoursUTC = formatTwoDigit(endTime.getUTCHours())
    const minutesUTC = formatTwoDigit(endTime.getUTCMinutes())

    const endTimeString = `${yearUTC}-${monthUTC}-${dateUTC} ${hoursUTC}:${minutesUTC}:00`

    try {
        const response = await axios({
            url: 'https://countdownmail.com/api/create',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Accept-Encoding': 'null',
                Authorization: process.env.VOTING_COUNTDOWN_TOKEN,
            },
            data: {
                skin_id: 6,
                name: 'Voting countdown',
                time_end: endTimeString,
                time_zone: 'UTC',
                font_family: 'Roboto-Medium',
                label_font_family: 'RobotoCondensed-Light',
                color_primary: '000000',
                color_text: '000000',
                color_bg: 'FFFFFF',
                transparent: '0',
                font_size: 26,
                label_font_size: 8,
                expired_mes_on: 1,
                expired_mes: 'Proposal Ended',
                day: '1',
                days: 'days',
                hours: 'hours',
                minutes: 'minutes',
                seconds: 'seconds',
                advanced_params: {
                    separator_color: 'FFFFFF',
                    labels_color: '000000',
                },
            },
        })

        url = response.data.message.src
    } catch (error) {
        console.error(error)
    }

    return url
}

const sendRoundupEmails = async () => {
    const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }
    const todaysDate = new Date(now).toLocaleDateString(undefined, dateOptions)

    const users = await prisma.user.findMany({
        include: {
            voters: true,
        },
    })

    for (const user of users) {
        if (!user.email) continue

        const endingSoonProposalsData = await formatEmailTableData(
            user,
            RoundupNotificationType.ENDING_SOON
        )
        const newProposalsData = await formatEmailTableData(
            user,
            RoundupNotificationType.NEW
        )
        const pastProposalsData = await formatEmailTableData(
            user,
            RoundupNotificationType.PAST
        )

        const to: string =
            process.env.EXEC_ENV === 'PROD'
                ? String(user.email)
                : String(process.env.TEST_EMAIL)

        const response = await client.sendEmailWithTemplate({
            TemplateAlias: 'daily-bulletin',
            TemplateModel: {
                senateLogoUrl:
                    process.env.WEBAPP_URL + '/assets/Senate_Logo/64/White.png',
                todaysDate: todaysDate,
                endingSoonProposals: endingSoonProposalsData,
                endingSoonProposalsTableCssClass:
                    endingSoonProposalsData.length > 0 ? 'show' : 'hide',
                endingSoonProposalsNoDataBoxCssClass:
                    endingSoonProposalsData.length > 0 ? 'hide' : 'show',

                newProposals: newProposalsData,
                newProposalsTableCssClass:
                    newProposalsData.length > 0 ? 'show' : 'hide',
                newProposalsNoDataBoxCssClass:
                    newProposalsData.length > 0 ? 'hide' : 'show',

                pastProposals: pastProposalsData,
                pastProposalsTableCssClass:
                    pastProposalsData.length > 0 ? 'show' : 'hide',
                pastProposalsNoDataBoxCssClass:
                    pastProposalsData.length > 0 ? 'hide' : 'show',

                twitterIconUrl:
                    process.env.WEBAPP_URL + '/assets/Icon/TwitterWhite.png',
                discordIconUrl:
                    process.env.WEBAPP_URL + '/assets/Icon/DiscordWhite.png',
                githubIconUrl:
                    process.env.WEBAPP_URL + '/assets/Icon/GithubWhite.png',
            },
            InlineCss: true,
            From: 'info@senatelabs.xyz',
            To: to,
            Bcc: process.env.ROUNDUP_BCC_EMAILS ?? '',
            Tag: 'Daily Bulletin',
            TrackOpens: true,
            MessageStream: 'outbound',
        })

        console.log(`Email sent to ${user.email}`, response)
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
    const daysDifference = getDaysDifference(timestamp1, timestamp2)
    const hoursDifference = getHoursDifference(timestamp1, timestamp2)
    const minutesDifference = Math.floor(timestampDifference / 1000 / 60)

    return minutesDifference - daysDifference * 24 * 60 - hoursDifference * 60
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

        if (vote) voted = true
    }

    return voted
}
