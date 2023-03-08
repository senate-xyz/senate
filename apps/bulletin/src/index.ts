import {
    type Proposal,
    DAOHandlerType,
    type UserWithVotingAddresses,
    type Voter,
    type DAO,
    type Notification,
    RoundupNotificationType,
    JsonArray,
    prisma,
    DAOHandler
} from '@senate/database'

import axios from 'axios'
import { config } from 'dotenv'
import { schedule } from 'node-cron'
import { ServerClient } from 'postmark'
import { log_bul } from '@senate/axiom'

config()

const client = new ServerClient(process.env.POSTMARK_TOKEN ?? 'Missing Token')
const threeDays = 259200000
const oneDay = 86400000

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const delay = (ms: number): Promise<any> => {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

const emailProposalEndDateStringFormat: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
}

interface EmailTemplateRow {
    votingStatus: string
    votingStatusIconUrl: string
    proposalName: string
    proposalUrl: string
    daoLogoUrl: string
    chainLogoUrl: string
    daoName: string
    endHoursUTC: string
    endMinutesUTC: string
    endDateString: string
    countdownUrl: string
    result: {
        highestScoreChoice: string
        highestScorePercentage: string
        barWidthPercentage: number
    }
    resultDisplay: string
    resultUnavailableDisplay: string
}

// Cron job which runs whenever dictated by env var OR on Feb 31st if env var is missing
schedule(
    String(process.env.BULLETIN_CRON_INTERVAL) ?? '* * 31 2 *',
    async function () {
        if (!Boolean(process.env.BULLETIN_ENABLE)) return

        log_bul.log({
            level: 'info',
            message: 'Starting daily roundup',
            data: {
                today: new Date(Date.now())
            }
        })

        let errorsDetected = false

        try {
            await clearNotificationsTable()

            const newProposals: Proposal[] = await fetchNewProposals()
            await insertNotifications(newProposals, RoundupNotificationType.NEW)

            const endingProposals: Proposal[] = await fetchEndingProposals()
            await insertNotifications(
                endingProposals,
                RoundupNotificationType.ENDING_SOON
            )

            const pastProposals: Proposal[] = await fetchPastProposals()
            await insertNotifications(
                pastProposals,
                RoundupNotificationType.PAST
            )
        } catch (e) {
            log_bul.log({
                level: 'error',
                message: 'Could not complete daily roundup',
                data: {
                    errorName: (e as Error).name,
                    errorMessage: (e as Error).message,
                    errorStack: (e as Error).stack
                }
            })
            errorsDetected = true
        } finally {
            if (errorsDetected) {
                await sendSorryPlsEmail()
            } else {
                await sendDailyBulletin()
            }

            log_bul.log({
                level: 'info',
                message: 'Completed daily roundup',
                data: {}
            })
        }
    }
)

const clearNotificationsTable = async () => {
    try {
        await prisma.notification.deleteMany()

        log_bul.log({
            level: 'info',
            message: 'Cleared notifications table'
        })
    } catch (e) {
        log_bul.log({
            level: 'error',
            message: 'Could not clear notifications table',
            data: {
                errorName: (e as Error).name,
                errorMessage: (e as Error).message,
                errorStack: (e as Error).stack
            }
        })
        throw new Error('Could not clear notifications table')
    }
}

const fetchUsersToBeNotifiedForProposal = async (
    proposal: Proposal,
    type: RoundupNotificationType
) => {
    try {
        const users = await prisma.user.findMany({
            where: {
                email: {
                    not: ''
                },
                dailyBulletin: true,
                subscriptions: {
                    some: {
                        daoId: proposal.daoId,
                        notificationsEnabled: true
                    }
                }
            },
            select: {
                id: true
            }
        })

        return users
    } catch (e) {
        log_bul.log({
            level: 'error',
            message: 'Could not fetch users to be notified',
            data: {
                errorName: (e as Error).name,
                errorMessage: (e as Error).message,
                errorStack: (e as Error).stack,
                proposal: proposal,
                type: type
            }
        })
        throw new Error('Could not fetch users to be notified')
    }
}

const insertNotifications = async (
    proposals: Proposal[],
    type: RoundupNotificationType
) => {
    try {
        for (const proposal of proposals) {
            //Get users which should be notified
            const users = await fetchUsersToBeNotifiedForProposal(
                proposal,
                type
            )

            //Insert notifications
            await prisma.$transaction(
                users.map((user) => {
                    return prisma.notification.upsert({
                        where: {
                            proposalId_userId_type: {
                                proposalId: proposal.id,
                                userId: user.id,
                                type: type
                            }
                        },
                        update: {},
                        create: {
                            userId: user.id,
                            proposalId: proposal.id,
                            daoId: proposal.daoId,
                            type: type
                        }
                    })
                })
            )
        }

        log_bul.log({
            level: 'info',
            message: 'Inserted notifications',
            data: {
                type: type,
                count: proposals.length
            }
        })
    } catch (e) {
        log_bul.log({
            level: 'error',
            message: 'Could not intsert notifications',
            data: {
                errorName: (e as Error).name,
                errorMessage: (e as Error).message,
                errorStack: (e as Error).stack
            }
        })

        throw new Error('Could not insert notifications')
    }
}

const fetchNewProposals = async () => {
    try {
        const proposals = await prisma.proposal.findMany({
            where: {
                timeCreated: {
                    gte: new Date(Date.now() - oneDay)
                }
            },
            orderBy: {
                timeEnd: 'asc'
            }
        })

        log_bul.log({
            level: 'info',
            message: 'Fetched new proposals',
            data: {
                count: proposals.length
            }
        })

        return proposals
    } catch (e) {
        log_bul.log({
            level: 'error',
            message: 'Could not fetch new proposals',
            data: {
                errorName: (e as Error).name,
                errorMessage: (e as Error).message,
                errorStack: (e as Error).stack
            }
        })

        throw new Error('Could not fetch new proposals')
    }
}

const fetchEndingProposals = async () => {
    try {
        const proposals = await prisma.proposal.findMany({
            where: {
                AND: [
                    {
                        timeEnd: {
                            lte: new Date(Date.now() + threeDays)
                        }
                    },
                    {
                        timeEnd: {
                            gt: new Date(Date.now())
                        }
                    }
                ]
            },
            orderBy: {
                timeEnd: 'asc'
            }
        })

        log_bul.log({
            level: 'info',
            message: 'Fetched ending proposals',
            data: {
                count: proposals.length
            }
        })

        return proposals
    } catch (e) {
        log_bul.log({
            level: 'error',
            message: 'Could not fetch ending proposals',
            data: {
                errorName: (e as Error).name,
                errorMessage: (e as Error).message,
                errorStack: (e as Error).stack
            }
        })
        throw new Error('Could not fetch ending proposals')
    }
}

const fetchPastProposals = async () => {
    try {
        const proposals = await prisma.proposal.findMany({
            where: {
                AND: [
                    {
                        timeEnd: {
                            lte: new Date(Date.now())
                        }
                    },
                    {
                        timeEnd: {
                            gte: new Date(Date.now() - oneDay)
                        }
                    }
                ]
            },
            orderBy: {
                timeEnd: 'desc'
            }
        })

        log_bul.log({
            level: 'info',
            message: 'Fetched past proposals',
            data: {
                count: proposals.length
            }
        })

        return proposals
    } catch (e) {
        log_bul.log({
            level: 'error',
            message: 'Could not fetch past proposals',
            data: {
                errorName: (e as Error).name,
                errorMessage: (e as Error).message,
                errorStack: (e as Error).stack
            }
        })
        throw new Error('Could not fetch past proposals')
    }
}

const formatEmailTableData = async (
    user: UserWithVotingAddresses,
    notificationType: RoundupNotificationType
): Promise<EmailTemplateRow[]> => {
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: user.id, type: notificationType },
            include: {
                proposal: {
                    include: {
                        dao: true,
                        daoHandler: true
                    }
                }
            }
        })

        const tableRows: EmailTemplateRow[] = []

        for (const notification of notifications) {
            tableRows.push(await formatEmailTemplateRow(notification, user))
        }

        return tableRows
    } catch (error) {
        log_bul.log({
            level: 'error',
            message: 'Could not format email table data',
            data: { error, user, notificationType }
        })
        throw new Error('Could not format email table data')
    }
}

const formatEmailTemplateRow = async (
    notification: Notification & {
        proposal: Proposal & { dao: DAO; daoHandler: DAOHandler }
    },
    user: UserWithVotingAddresses
): Promise<EmailTemplateRow> => {
    const voted = await userVoted(
        user.voters,
        notification.proposalId,
        notification.daoId
    )

    await delay(1000)
    const countdownUrl = await generateCountdownGifUrl(
        notification.proposal.timeEnd
    )

    const votingStatus = voted
        ? 'Voted'
        : notification.type === RoundupNotificationType.PAST
        ? "Didn't vote"
        : 'Not voted yet'

    const votingStatusIconUrl = voted
        ? `${process.env.WEB_URL}/assets/Icon/Voted.png`
        : notification.type === RoundupNotificationType.PAST
        ? `${process.env.WEB_URL}/assets/Icon/DidntVote.png`
        : `${process.env.WEB_URL}/assets/Icon/NotVotedYet.png`

    const chainLogoUrl =
        notification.proposal.daoHandler.type === DAOHandlerType.SNAPSHOT
            ? encodeURI(
                  `${process.env.WEB_URL}/assets/Chain/Snapshot/snapshot.png`
              )
            : encodeURI(`${process.env.WEB_URL}/assets/Chain/Ethereum/eth.png`)

    let result = null

    if (notification.type === RoundupNotificationType.PAST) {
        let highestScore = 0
        let highestScoreIndex = 0
        let highestScorePercentage = 0
        let highestScoreChoice = ''

        const scores = notification.proposal.scores as JsonArray

        for (const score of scores) {
            if (Number(score) > highestScore) {
                highestScore = Number(score)
                highestScoreIndex++
            }
        }

        highestScoreChoice = String(
            (notification.proposal.choices as JsonArray)[highestScoreIndex - 1]
        )

        highestScorePercentage =
            (highestScore / notification.proposal.scoresTotal) * 100

        result = {
            highestScoreChoice: highestScoreChoice.substring(0, 15),
            highestScorePercentage: highestScorePercentage.toFixed(2),
            barWidthPercentage: Math.floor(highestScorePercentage)
        }
    }

    return {
        votingStatus,
        votingStatusIconUrl: encodeURI(votingStatusIconUrl),
        proposalName:
            notification.proposal.name.length > 100
                ? `${notification.proposal.name.substring(0, 100)}...`
                : notification.proposal.name,
        proposalUrl: encodeURI(notification.proposal.url),
        daoLogoUrl: encodeURI(
            `${process.env.WEB_URL}${notification.proposal.dao.picture}_small.png`
        ),
        chainLogoUrl: chainLogoUrl,
        daoName: notification.proposal.dao.name,
        endHoursUTC: formatTwoDigit(
            notification.proposal.timeEnd.getUTCHours()
        ),
        endMinutesUTC: formatTwoDigit(
            notification.proposal.timeEnd.getUTCMinutes()
        ),
        endDateString: notification.proposal.timeEnd.toLocaleDateString(
            undefined,
            emailProposalEndDateStringFormat
        ),
        countdownUrl: encodeURI(countdownUrl),
        result: result,
        resultDisplay: isMakerProposal(notification.proposal) ? 'hide' : 'show',
        resultUnavailableDisplay: isMakerProposal(notification.proposal)
            ? 'show'
            : 'hide'
    }
}

const isMakerProposal = (
    proposal: Proposal & { dao: DAO; daoHandler: DAOHandler }
) => {
    return (
        proposal.daoHandler.type === DAOHandlerType.MAKER_EXECUTIVE ||
        proposal.daoHandler.type === DAOHandlerType.MAKER_POLL ||
        proposal.daoHandler.type === DAOHandlerType.MAKER_POLL_ARBITRUM
    )
}

const formatTwoDigit = (timeUnit: number): string => {
    const timeUnitStr = timeUnit.toString()
    return timeUnitStr.length == 1 ? '0' + timeUnitStr : timeUnitStr
}

const generateCountdownGifUrl = async (endTime: Date): Promise<string> => {
    try {
        const yearUTC = endTime.getUTCFullYear()
        const monthUTC = formatTwoDigit(endTime.getUTCMonth() + 1)
        const dateUTC = formatTwoDigit(endTime.getUTCDate())
        const hoursUTC = formatTwoDigit(endTime.getUTCHours())
        const minutesUTC = formatTwoDigit(endTime.getUTCMinutes())
        const endTimeString = `${yearUTC}-${monthUTC}-${dateUTC} ${hoursUTC}:${minutesUTC}:00`

        let retries = 10
        let response = null
        while (retries) {
            try {
                response = await axios({
                    url: 'https://countdownmail.com/api/create',
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'Accept-Encoding': 'null',
                        Authorization: process.env.VOTING_COUNTDOWN_TOKEN
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
                            labels_color: '000000'
                        }
                    }
                })
                break
            } catch (err) {
                retries--
                if (!retries) {
                    throw err
                }

                log_bul.log({
                    level: 'warn',
                    message:
                        'Coundownmail request failed. Retrying to generate countdown gif',
                    data: {
                        retriesLeft: retries
                    }
                })
                await delay(10000)
            }
        }

        if (
            !response ||
            !response.data ||
            !response.data.message ||
            !response.data.message.src
        ) {
            log_bul.log({
                level: 'error',
                message: 'Could not find gif URL in response',
                data: {
                    response: response
                }
            })
            return ''
        }

        return response.data.message.src
    } catch (e) {
        log_bul.log({
            level: 'error',
            message: 'Could not generate countdown gif',
            data: {
                errorName: (e as Error).name,
                errorMessage: (e as Error).message,
                errorStack: (e as Error).stack
            }
        })

        return ''
    }
}

const fetchUsersToBeNotified = async (): Promise<UserWithVotingAddresses[]> => {
    try {
        const users = await prisma.user.findMany({
            where: {
                email: {
                    not: ''
                },
                dailyBulletin: true,
                subscriptions: {
                    some: {
                        notificationsEnabled: true
                    }
                }
            },
            include: {
                voters: true
            }
        })

        log_bul.log({
            level: 'info',
            message: 'Fetched users with daily bulletin enabled',
            data: {}
        })

        return users
    } catch (e) {
        log_bul.log({
            level: 'error',
            message: 'Could not fetch users with daily bulletin enabled',
            data: {
                errorName: (e as Error).name,
                errorMessage: (e as Error).message,
                errorStack: (e as Error).stack
            }
        })
        throw Error('Could not fetch users with daily bulletin enabled')
    }
}

const sendDailyBulletin = async () => {
    const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }

    const todaysDate = new Date(Date.now()).toLocaleDateString(
        undefined,
        dateOptions
    )

    try {
        const users = await fetchUsersToBeNotified()

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

            await client.sendEmailWithTemplate({
                TemplateAlias: 'daily-bulletin-1',
                TemplateModel: {
                    senateLogoUrl: encodeURI(
                        process.env.WEB_URL + '/assets/Senate_Logo/64/White.png'
                    ),
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

                    twitterIconUrl: encodeURI(
                        process.env.WEB_URL + '/assets/Icon/TwitterWhite.png'
                    ),
                    discordIconUrl: encodeURI(
                        process.env.WEB_URL + '/assets/Icon/DiscordWhite.png'
                    ),
                    githubIconUrl: encodeURI(
                        process.env.WEB_URL + '/assets/Icon/GithubWhite.png'
                    )
                },
                InlineCss: true,
                From: 'info@senatelabs.xyz',
                To: to,
                Bcc: process.env.BULLETIN_BCC_EMAILS ?? '',
                Tag: 'Daily Bulletin',
                TrackOpens: true,
                MessageStream: 'outbound'
            })

            log_bul.log({
                level: 'info',
                message: 'Sent daily bulletin to user',
                data: {
                    email: user.email
                }
            })
        }
    } catch (e) {
        log_bul.log({
            level: 'error',
            message: 'Could not send daily bulletin',
            data: {
                errorName: (e as Error).name,
                errorMessage: (e as Error).message,
                errorStack: (e as Error).stack
            }
        })
    }
}

// TO BE IMPLEMENTED
const sendSorryPlsEmail = async () => {
    log_bul.log({
        level: 'info',
        message: 'Sending fallback email to users'
    })
}

const userVoted = async (
    voters: Voter[],
    proposalId: string,
    daoId: string
) => {
    try {
        let voted = false
        for (const voter of voters) {
            const vote = await prisma.vote.findFirst({
                where: {
                    voterAddress: voter.address,
                    daoId: daoId,
                    proposalId: proposalId
                }
            })

            if (vote) voted = true
        }

        return voted
    } catch (e) {
        log_bul.log({
            level: 'error',
            message: 'Could not check if user voted',
            data: {
                errorName: (e as Error).name,
                errorMessage: (e as Error).message,
                errorStack: (e as Error).stack
            }
        })
        throw Error('Could not check if user voted')
    }
}
