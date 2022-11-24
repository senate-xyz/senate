import { config } from 'dotenv'
import axios from 'axios'
import { ServerClient } from 'postmark'
import { schedule } from 'node-cron'
import { prisma } from '@senate/database'
import { RoundupNotificationType } from '@prisma/client'
import {
    Proposal,
    Subscription,
    UserWithVotingAddresses,
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

    console.log('running a task every 30 second')

    const lastMonthProposals: Proposal[] = await prisma.proposal.findMany({
        where: {
            addedAt: {
                gte: now - oneMonth,
            },
        },
    })

    await clearNotificationsTable();
    await addNewProposals(lastMonthProposals);
    await addEndingProposals(lastMonthProposals);
    await addPastProposals(lastMonthProposals);
    
    await sendRoundupEmails();

    console.log("Emails have been sent");
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
                            daoId: proposal.daoId,
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
    console.log('Adding ending proposals...')

    const proposals = lastMonthProposals.filter(
        (proposal) =>
            proposal.data?.['timeEnd'] <= now + threeDays &&
            proposal.data?.['timeEnd'] > now
    )

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
                if (res) console.log(`Inserted ${res.length} notifications`)
                else console.log('Inserted 0 notifications')

                return res
            })
    }

    console.log('\n')
}

const addPastProposals = async (lastMonthProposals: Proposal[]) => {
    console.log('Adding new proposal notifications...')

    const proposals = lastMonthProposals.filter(
        (proposal) => proposal.data?.['timeEnd'] <= now &&
            proposal.data?.['timeEnd'] >= now - oneDay
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
                if (res) console.log(`Inserted ${res.length} notifications`)
                else console.log('Inserted 0 notifications')

                return res
            })
    }

    console.log('\n')
}

const formatEmailTableData = async (user: UserWithVotingAddresses, notificationType: RoundupNotificationType): Promise<any> => {
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
        let voted = await userVoted(user.voters, notification.proposalId, notification.daoId);
        const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };

        let countdownUrl = await generateCountdownGifUrl(notification.proposal.data?.['timeEnd']);

        return {
            votingStatus: voted ? "Voted" : "Not voted yet",
            rowBackground: voted ? "green" : "red",
            proposalName: notification.proposal.name,
            proposalUrl: notification.proposal.url,
            daoLogoUrl: notification.proposal.dao.picture,
            endDateUTC: formatTwoDigit(new Date(notification.proposal.data?.['timeEnd']).getUTCDate()),
            endMonthUTC: formatTwoDigit(new Date(notification.proposal.data?.['timeEnd']).getUTCMonth() + 1),
            endYearUTC: new Date(notification.proposal.data?.['timeEnd']).getUTCFullYear(),
            endHoursUTC: formatTwoDigit(new Date(notification.proposal.data?.['timeEnd']).getUTCHours()),
            endMinutesUTC: formatTwoDigit(new Date(notification.proposal.data?.['timeEnd']).getUTCMinutes()),
            daysLeft: getDaysDifference(now, notification.proposal.data?.['timeEnd']),
            hoursLeft: getHoursDifference(now, notification.proposal.data?.['timeEnd']),
            minutesLeft: getMinutesDifference(now, notification.proposal.data?.['timeEnd']),
            dateString: new Date(notification.proposal.data?.['timeEnd']).toLocaleDateString(undefined, dateOptions),
            countdownUrl: countdownUrl
        }
    });

    return Promise.all(promises);
}

const formatTwoDigit = (timeUnit: number) : string => {
    let timeUnitStr = timeUnit.toString();
    return timeUnitStr.length == 1 ? "0" + timeUnitStr : timeUnitStr;
}

const generateCountdownGifUrl = async (endTimestamp: string): Promise<string> => {
    let url = "";

    let yearUTC = new Date(endTimestamp).getUTCFullYear()
    let monthUTC = formatTwoDigit(new Date(endTimestamp).getUTCMonth() + 1)
    let dateUTC = formatTwoDigit(new Date(endTimestamp).getUTCDate())
    let hoursUTC = formatTwoDigit(new Date(endTimestamp).getUTCHours())
    let minutesUTC = formatTwoDigit(new Date(endTimestamp).getUTCMinutes())

    let endTimeString = `${yearUTC}-${monthUTC}-${dateUTC} ${hoursUTC}:${minutesUTC}:00`;

    try {
        const response = await axios({
            url: 'https://countdownmail.com/api/create',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Accept-Encoding': 'null',
                'Authorization': process.env.VOTING_COUNTDOWN_TOKEN,
            },
            data: {
                skin_id: 6,
                name: "Voting countdown",
                time_end: endTimeString,
                time_zone: "UTC",
                font_family: "Roboto-Bold",
                color_primary: "333333",
                color_text: "333333",
                color_bg: "F0F3F3",
                transparent: "1",
                font_size: "21",
                expired_mes_on: 1,
                expired_mes: "Voting ended",
                day: "1",
                days: "days",
                hours: "hours",
                minutes: "minutes",
                seconds: "seconds"
            }
        });

        url = response.data.message.src;
    } catch (error) {
        console.error(error);
    }

    return url;

}

const sendRoundupEmails = async () => {
    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const todaysDate = new Date(Date.now()).toLocaleDateString(undefined, dateOptions);

    const users = await prisma.user.findMany({
        include: {
            voters: true
        }
    })

    for (const user of users) {
        let endingSoonProposalsData = await formatEmailTableData(user, RoundupNotificationType.ENDING_SOON);
        let newProposalsData = await formatEmailTableData(user, RoundupNotificationType.NEW);
        let pastProposalsData = await formatEmailTableData(user, RoundupNotificationType.PAST);

        let response = await client.sendEmailWithTemplate({
        "TemplateAlias": "roundup",
        "TemplateModel": {
                "todaysDate": todaysDate,
                "endingSoonProposals": endingSoonProposalsData,
                "endingSoonProposalsTableCssClass": endingSoonProposalsData.length > 0 ? "show" : "hide",
                "endingSoonProposalsNoDataBoxCssClass": endingSoonProposalsData.length > 0 ? "hide" : "show",

                "newProposals": newProposalsData,
                "newProposalsTableCssClass": newProposalsData.length > 0 ? "show" : "hide",
                "newProposalsNoDataBoxCssClass": newProposalsData.length > 0 ? "hide" : "show",

                "pastProposals": pastProposalsData,
                "pastProposalsTableCssClass": pastProposalsData.length > 0 ? "show" : "hide",
                "pastProposalsNoDataBoxCssClass": pastProposalsData.length > 0 ? "hide" : "show",
            },
            "InlineCss": true,
            "From": "info@senatelabs.xyz",
            // "To": `${"eugen.ptr@gmail.com"}`,
            "To": `${user.email}`,
            "Bcc": "kohh.reading@gmail.com,eugen.ptr@gmail.com,contact@andreiv.com,paulo@hey.com",
            "Tag": "Daily Roundup",
            "Headers": [
                {
                    "Name": "CUSTOM-HEADER",
                    "Value": "value"
                }
            ],
            "TrackOpens": true,
            "Metadata": {
                "color": "blue",
                "client-id": "12345"
            },
            "MessageStream": "outbound"
        })

        console.log(`Email sent to ${user.email}`, response);
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
