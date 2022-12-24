import axios from 'axios'
import { prisma } from '@senate/database'
import { DAOHandler } from '@senate/common-types'
import { Logger, InternalServerErrorException } from '@nestjs/common'

const logger = new Logger('SnapshotVotes')

export const updateSnapshotVotes = async (
    daoHandler: DAOHandler,
    voterAddress: string,
    daoName: string
) => {
    const currentVotesCount = await prisma.vote.count({
        where: {
            AND: [
                { daoHandlerId: daoHandler.id },
                { voterAddress: voterAddress },
            ],
        },
    })

    const latestProposal = await prisma.proposal.findFirst({
        where: {
            daoHandlerId: daoHandler.id,
        },
        orderBy: {
            timeCreated: 'desc',
        },
    })

    if (!latestProposal) return

    logger.log(`Updating Snapshot votes for ${voterAddress}`)
    let votes

    try {
        votes = await axios
            .get('https://hub.snapshot.org/graphql', {
                method: 'POST',
                data: JSON.stringify({
                    query: ` {
  votes(first: 10, skip: ${currentVotesCount}, orderBy: "created", orderDirection: asc, where: {voter: ${voterAddress}, space: ${
                        daoHandler.decoder['space']
                    }, created_lt: ${latestProposal.timeCreated.valueOf()}}) {
    id
    voter
    choice
    proposal {
      id
      choices
      title
      body
      created
      start
      end
      link
    }
  }
}
`,
                }),
                headers: {
                    'content-type': 'application/json',
                },
            })
            .then((response) => {
                if (response.status == 429) throw new Error('Too many requests')
                return response.data
            })
            .then((data) => {
                return data.data.votes
            })
            .catch((e) => {
                console.log(e)
                return
            })

        //TODO support multiple choice vote
        if (votes)
            for (const vote of votes) {
                const proposal = await prisma.proposal.findFirst({
                    where: {
                        externalId: vote.proposal.id,
                        daoId: daoHandler.daoId,
                        daoHandlerId: daoHandler.id,
                    },
                })

                if (!proposal) {
                    console.log(
                        `Snapshot proposal with externalId ${vote.proposal.id} does not exist in DB`
                    )
                    continue
                }

                if (!vote.proposal.id) {
                    console.log('Bad proposal id')
                    continue
                }

                const votedOptions = getVotedOptions(
                    vote.choice,
                    vote.proposal.choices,
                    voterAddress,
                    daoHandler.daoId,
                    proposal.id
                )

                await prisma.voteOption.deleteMany({
                    where: {
                        voterAddress: voterAddress,
                        voteDaoId: daoHandler.daoId,
                        voteProposalId: proposal.id,
                    },
                })

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                for (const votedOption of votedOptions) {
                    await prisma.vote.upsert({
                        where: {
                            voterAddress_daoId_proposalId: {
                                voterAddress: voterAddress,
                                daoId: daoHandler.daoId,
                                proposalId: proposal.id,
                            },
                        },
                        update: {
                            options: {
                                create: {
                                    option:
                                        vote.choice.length > 0
                                            ? String(vote.choice[0])
                                            : String(vote.choice),
                                    optionName:
                                        vote.proposal.choices[
                                            vote.choice - 1
                                        ] ?? 'No name',
                                },
                            },
                        },
                        create: {
                            voterAddress: voterAddress,
                            daoId: daoHandler.daoId,
                            proposalId: proposal.id,
                            daoHandlerId: daoHandler.id,
                            options: {
                                create: {
                                    option:
                                        vote.choice.length > 0
                                            ? String(vote.choice[0])
                                            : String(vote.choice),
                                    optionName:
                                        vote.proposal.choices[
                                            vote.choice - 1
                                        ] ?? 'No name',
                                },
                            },
                        },
                    })
                }
            }
    } catch (err) {
        logger.error('Error while updating snapshot votes', err)
        throw new InternalServerErrorException()
    }

    console.log(
        `updated ${votes.length} snapshot votes for ${voterAddress} in ${daoName}`
    )
}

const getVotedOptions = (
    choices: [] | number,
    proposalChoices: [],
    userId: string,
    daoId: string,
    proposalId: string
) => {
    const options = []

    if (Array.isArray(choices)) {
        for (let i = 0; i < choices.length; i++) {
            options.push({
                option: String(choices[i]),
                optionName: proposalChoices[choices[i] - 1] ?? 'No name',
                voteUserId: userId,
                voteDaoId: daoId,
                voteProposalId: proposalId,
            })
        }
    } else {
        options.push({
            option: String(choices),
            optionName: proposalChoices[choices - 1] ?? 'No name',
        })
    }

    return options
}
