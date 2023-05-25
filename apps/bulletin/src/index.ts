import {
    type Proposal,
    DAOHandlerType,
    type Subscription,
    type UserWithSubscriptionsAndVotingAddresses,
    type Voter,
    type DAO,
    type JsonArray,
    prisma,
    type DAOHandler,
    ProposalState
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

interface ProposalWithDaoAndHandler extends Proposal {
    dao: DAO
    daohandler: DAOHandler
}

interface GenericResult {
    checkboxImgUrl: string
    resultText: string
    highestScorePercentageDisplay: string
    highestScorePercentage: string
    barWidthPercentage: number
}

interface MakerExecutiveResult {
    checkboxImgUrl: string
    resultText: string
    mkrSupport: string
}

interface HighestScore {
    choice: string
    percentage: number
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
    result: GenericResult
    resultDisplay: string
    makerResult: MakerExecutiveResult
    makerResultDisplay: string
    hiddenResultDisplay: string
}

interface BulletinData {
    todaysDate: string
    newProposals: EmailTemplateRow[]
    endingProposals: EmailTemplateRow[]
    pastProposals: EmailTemplateRow[]
}

enum BulletinSection {
    ENDING_SOON = 0,
    NEW = 1,
    PAST = 2
}

let userEmailData: Map<string, BulletinData>
let proposalCountdownUrl: Map<string, string>

// Cron job which runs whenever dictated by env var OR on Feb 31st if env var is missing
schedule(
    String(process.env.BULLETIN_CRON_INTERVAL) ?? '* * 31 2 *',
    async function () {
        if (String(process.env.BULLETIN_ENABLE) !== 'true') return

        log_bul.log({
            level: 'info',
            message: 'Starting daily roundup',
            data: {
                today: new Date(Date.now())
            }
        })

        let errorsDetected = false

        try {
            userEmailData = new Map<string, BulletinData>()
            proposalCountdownUrl = new Map<string, string>()

            const dateOptions: Intl.DateTimeFormatOptions = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }

            const users: UserWithSubscriptionsAndVotingAddresses[] =
                await fetchUsersToBeNotified()

            for (const user of users) {
                const subscribedDaoIds = user.subscriptions.map(
                    (subscription: Subscription) => subscription.daoid
                )

                const endingProposals: ProposalWithDaoAndHandler[] =
                    await fetchEndingProposals(user.id, subscribedDaoIds)
                const newProposals: ProposalWithDaoAndHandler[] =
                    await fetchNewProposals(user.id, subscribedDaoIds)
                const pastProposals: ProposalWithDaoAndHandler[] =
                    await fetchPastProposals(user.id, subscribedDaoIds)

                const bulletinData: BulletinData = {
                    todaysDate: new Date(Date.now()).toLocaleDateString(
                        undefined,
                        dateOptions
                    ),
                    endingProposals: await formatEmailTableData(
                        user,
                        endingProposals,
                        BulletinSection.ENDING_SOON
                    ),
                    newProposals: await formatEmailTableData(
                        user,
                        newProposals,
                        BulletinSection.NEW
                    ),
                    pastProposals: await formatEmailTableData(
                        user,
                        pastProposals,
                        BulletinSection.PAST
                    )
                }

                userEmailData.set(user.email, bulletinData)
            }
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
                for (const [recipient, emailData] of userEmailData) {
                    const to: string =
                        process.env.EXEC_ENV === 'PROD'
                            ? String(recipient)
                            : String(process.env.TEST_EMAIL)

                    console.log('Sending email to ', recipient)

                    await sendBulletin(to, emailData)
                }
            }

            log_bul.log({
                level: 'info',
                message: 'Completed daily roundup',
                data: {}
            })
        }
    }
)

const fetchUsersToBeNotified = async (): Promise<
    UserWithSubscriptionsAndVotingAddresses[]
> => {
    try {
        const users = await prisma.user.findMany({
            where: {
                email: {
                    not: ''
                },
                dailybulletin: true,
                subscriptions: {
                    some: {
                        notificationsenabled: true
                    }
                }
            },
            include: {
                subscriptions: true,
                voters: true
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
                errorStack: (e as Error).stack
            }
        })
        throw new Error('Could not fetch users to be notified')
    }
}

const fetchNewProposals = async (
    userId: string,
    daoIds: string[]
): Promise<ProposalWithDaoAndHandler[]> => {
    try {
        const proposals = await prisma.proposal.findMany({
            where: {
                timecreated: {
                    gte: new Date(Date.now() - oneDay)
                },
                daoid: {
                    in: daoIds
                }
            },
            include: {
                dao: true,
                daohandler: true
            },
            orderBy: {
                timeend: 'asc'
            }
        })

        return proposals.filter((p) => p.state != ProposalState.CANCELED)
    } catch (e) {
        log_bul.log({
            level: 'error',
            message: 'Could not fetch new proposals for user' + userId,
            data: {
                errorName: (e as Error).name,
                errorMessage: (e as Error).message,
                errorStack: (e as Error).stack
            }
        })

        throw new Error('Could not fetch new proposals' + userId)
    }
}

const fetchEndingProposals = async (
    userId: string,
    daoIds: string[]
): Promise<ProposalWithDaoAndHandler[]> => {
    try {
        const proposals = await prisma.proposal.findMany({
            where: {
                AND: [
                    {
                        timeend: {
                            lte: new Date(Date.now() + threeDays)
                        }
                    },
                    {
                        timeend: {
                            gt: new Date(Date.now())
                        }
                    },
                    {
                        daoid: {
                            in: daoIds
                        }
                    }
                ]
            },
            include: {
                dao: true,
                daohandler: true
            },
            orderBy: {
                timeend: 'asc'
            }
        })

        return proposals.filter((p) => p.state != ProposalState.CANCELED)
    } catch (e) {
        log_bul.log({
            level: 'error',
            message: 'Could not fetch ending proposals for user' + userId,
            data: {
                errorName: (e as Error).name,
                errorMessage: (e as Error).message,
                errorStack: (e as Error).stack
            }
        })
        throw new Error('Could not fetch ending proposals for user' + userId)
    }
}

const fetchPastProposals = async (
    userId: string,
    daoIds: string[]
): Promise<ProposalWithDaoAndHandler[]> => {
    try {
        const proposals = await prisma.proposal.findMany({
            where: {
                AND: [
                    {
                        timeend: {
                            lte: new Date(Date.now())
                        }
                    },
                    {
                        timeend: {
                            gte: new Date(Date.now() - oneDay)
                        }
                    },
                    {
                        daoid: {
                            in: daoIds
                        }
                    }
                ]
            },
            include: {
                dao: true,
                daohandler: true
            },
            orderBy: {
                timeend: 'desc'
            }
        })

        return proposals.filter((p) => p.state != ProposalState.CANCELED)
    } catch (e) {
        log_bul.log({
            level: 'error',
            message: 'Could not fetch past proposals for user' + userId,
            data: {
                errorName: (e as Error).name,
                errorMessage: (e as Error).message,
                errorStack: (e as Error).stack
            }
        })
        throw new Error('Could not fetch past proposals for user' + userId)
    }
}

const formatEmailTableData = async (
    user: UserWithSubscriptionsAndVotingAddresses,
    proposals: ProposalWithDaoAndHandler[],
    bulletinSection: BulletinSection
): Promise<EmailTemplateRow[]> => {
    try {
        const tableRows: EmailTemplateRow[] = []

        for (const proposal of proposals) {
            tableRows.push(
                await formatEmailTemplateRow(user, proposal, bulletinSection)
            )
        }

        return tableRows
    } catch (error) {
        log_bul.log({
            level: 'error',
            message: 'Could not format email table data',
            data: { error, user }
        })
        throw new Error('Could not format email table data')
    }
}

const formatEmailTemplateRow = async (
    user: UserWithSubscriptionsAndVotingAddresses,
    proposal: ProposalWithDaoAndHandler,
    bulletinSection: BulletinSection
): Promise<EmailTemplateRow> => {
    let countdownUrl
    if (proposalCountdownUrl.has(proposal.id)) {
        countdownUrl = proposalCountdownUrl.get(proposal.id)
    } else {
        // await delay(1000)
        countdownUrl = await generateCountdownGifUrl(proposal.timeend)
        proposalCountdownUrl.set(proposal.id, countdownUrl)
    }

    const voted = await userVoted(user.voters, proposal.id, proposal.daoid)
    const votingStatus = voted
        ? 'Voted'
        : bulletinSection === BulletinSection.PAST
        ? "Didn't vote"
        : 'Not voted yet'

    const votingStatusIconUrl = voted
        ? `${process.env.NEXT_PUBLIC_WEB_URL}/assets/Icon/Voted.png`
        : bulletinSection === BulletinSection.PAST
        ? `${process.env.NEXT_PUBLIC_WEB_URL}/assets/Icon/DidntVote.png`
        : `${process.env.NEXT_PUBLIC_WEB_URL}/assets/Icon/NotVotedYet.png`

    const chainLogoUrl =
        proposal.daohandler.type === DAOHandlerType.SNAPSHOT
            ? encodeURI(
                  `${process.env.NEXT_PUBLIC_WEB_URL}/assets/Chain/Snapshot/snapshot.png`
              )
            : encodeURI(
                  `${process.env.NEXT_PUBLIC_WEB_URL}/assets/Chain/Ethereum/eth.png`
              )

    let result: GenericResult = null
    let makerResult: MakerExecutiveResult = null
    let resultDisplay, makerResultDisplay, hiddenResultDisplay

    // TODO: Replace hiddenResult workardound with proper implementation based on proposal state (:Hidden)
    // TODO: Add implementation for 'unabled to fetch results' case
    if (bulletinSection === BulletinSection.PAST) {
        const highestScore = getHighestScore(proposal)
        if (highestScore.percentage === 0 && Number(proposal.scorestotal) > 0) {
            hiddenResultDisplay = 'show'
            makerResultDisplay = 'hide'
            resultDisplay = 'hide'
        } else {
            if (isMakerProposal(proposal)) {
                makerResult = computeMakerExecutiveResult(proposal)

                hiddenResultDisplay = 'hide'
                makerResultDisplay = 'show'
                resultDisplay = 'hide'
            } else {
                result = computeGenericResult(proposal)

                hiddenResultDisplay = 'hide'
                makerResultDisplay = 'hide'
                resultDisplay = 'show'
            }
        }
    }

    return {
        votingStatus,
        votingStatusIconUrl: encodeURI(votingStatusIconUrl),
        proposalName:
            proposal.name.length > 69
                ? `${proposal.name.substring(0, 69)}...`
                : proposal.name,
        proposalUrl:
            proposal.daohandler.type === DAOHandlerType.SNAPSHOT
                ? encodeURI(proposal.url + '?app=senate')
                : encodeURI(proposal.url),
        daoLogoUrl: encodeURI(
            `${process.env.NEXT_PUBLIC_WEB_URL}${proposal.dao.picture}_medium.png`
        ),
        chainLogoUrl: chainLogoUrl,
        daoName: proposal.dao.name,
        endHoursUTC: formatTwoDigit(proposal.timeend.getUTCHours()),
        endMinutesUTC: formatTwoDigit(proposal.timeend.getUTCMinutes()),
        endDateString: proposal.timeend.toLocaleDateString(
            undefined,
            emailProposalEndDateStringFormat
        ),
        countdownUrl: encodeURI(countdownUrl),
        result: result,
        makerResult: makerResult,
        resultDisplay: resultDisplay,
        makerResultDisplay: makerResultDisplay,
        hiddenResultDisplay: hiddenResultDisplay
    }
}

const isMakerProposal = (proposal: ProposalWithDaoAndHandler) => {
    return proposal.daohandler.type === DAOHandlerType.MAKER_EXECUTIVE
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

const sendBulletin = async (to: string, data: BulletinData) => {
    try {
        await client.sendEmailWithTemplate({
            TemplateAlias: 'daily-bulletin-4',
            TemplateModel: {
                senateLogoUrl: encodeURI(
                    process.env.NEXT_PUBLIC_WEB_URL +
                        '/assets/Senate_Logo/64/White.png'
                ),
                todaysDate: data.todaysDate,
                endingSoonProposals: data.endingProposals,
                endingSoonProposalsTableCssClass:
                    data.endingProposals.length > 0 ? 'show' : 'hide',
                endingSoonProposalsNoDataBoxCssClass:
                    data.endingProposals.length > 0 ? 'hide' : 'show',

                newProposals: data.newProposals,
                newProposalsTableCssClass:
                    data.newProposals.length > 0 ? 'show' : 'hide',
                newProposalsNoDataBoxCssClass:
                    data.newProposals.length > 0 ? 'hide' : 'show',

                pastProposals: data.pastProposals,
                pastProposalsTableCssClass:
                    data.pastProposals.length > 0 ? 'show' : 'hide',
                pastProposalsNoDataBoxCssClass:
                    data.pastProposals.length > 0 ? 'hide' : 'show',

                twitterIconUrl: encodeURI(
                    process.env.NEXT_PUBLIC_WEB_URL +
                        '/assets/Icon/TwitterWhite.png'
                ),
                discordIconUrl: encodeURI(
                    process.env.NEXT_PUBLIC_WEB_URL +
                        '/assets/Icon/DiscordWhite.png'
                ),
                githubIconUrl: encodeURI(
                    process.env.NEXT_PUBLIC_WEB_URL +
                        '/assets/Icon/GithubWhite.png'
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
                email: to
            }
        })
    } catch (e) {
        log_bul.log({
            level: 'error',
            message: `Failed to send daily bulletin to ${to}`,
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
                    voteraddress: voter.address,
                    daoid: daoId,
                    proposalid: proposalId
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
function computeGenericResult(
    proposal: ProposalWithDaoAndHandler
): GenericResult {
    if (hasPassed(proposal)) {
        const highestScore = getHighestScore(proposal)

        return {
            checkboxImgUrl: `${process.env.NEXT_PUBLIC_WEB_URL}/assets/Icon/VoteIcon-Check.png`,
            resultText:
                highestScore.choice.length > 16
                    ? `${highestScore.choice.substring(0, 16)}...`
                    : highestScore.choice,
            highestScorePercentageDisplay: 'show',
            highestScorePercentage: highestScore.percentage.toFixed(2),
            barWidthPercentage: Math.floor(highestScore.percentage)
        }
    }

    return {
        checkboxImgUrl: `${process.env.NEXT_PUBLIC_WEB_URL}/assets/Icon/VoteIcon-Cross.png`,
        resultText: 'No Quorum',
        highestScorePercentageDisplay: 'hide',
        highestScorePercentage: '',
        barWidthPercentage: 0
    }
}

function getHighestScore(proposal: ProposalWithDaoAndHandler): HighestScore {
    let highestScore = 0
    let highestScoreIndex = 0
    const scores = proposal.scores as JsonArray

    for (let i = 0; i < scores.length; i++) {
        if (parseFloat(scores[i]!.toString()) > highestScore) {
            highestScore = parseFloat(scores[i]!.toString())
            highestScoreIndex = i
        }
    }

    return {
        choice: String((proposal.choices as JsonArray)[highestScoreIndex]),
        percentage: (highestScore / Number(proposal.scorestotal)) * 100
    }
}

function computeMakerExecutiveResult(
    proposal: ProposalWithDaoAndHandler
): MakerExecutiveResult {
    if (
        proposal.state == ProposalState.QUEUED ||
        proposal.state == ProposalState.EXECUTED
    ) {
        return {
            checkboxImgUrl: `${process.env.NEXT_PUBLIC_WEB_URL}/assets/Icon/VoteIcon-Check.png`,
            resultText: 'Passed',
            mkrSupport: (
                Number(proposal.scorestotal) / 1000000000000000000
            ).toFixed(2)
        }
    }

    return {
        checkboxImgUrl: `${process.env.NEXT_PUBLIC_WEB_URL}/assets/Icon/VoteIcon-Cross.png`,
        resultText: 'Did not pass',
        mkrSupport: (
            Number(proposal.scorestotal) / 1000000000000000000
        ).toFixed(2)
    }
}

function hasPassed(proposal: ProposalWithDaoAndHandler): boolean {
    return Number(proposal.scorestotal) > Number(proposal.quorum)
}
