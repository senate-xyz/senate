import { log_node, log_pd } from '@senate/axiom'
import { prisma } from '@senate/database'
import { ethers } from 'ethers'
import { getAaveVotes } from './chain/aave'
import { getMakerExecutiveVotes } from './chain/makerExecutive'
import { getUniswapVotes } from './chain/uniswap'
import { getMakerPollVotes } from './chain/makerPoll'
import { getCompoundVotes } from './chain/compound'

const infuraProvider = new ethers.providers.JsonRpcProvider({
    url: String(process.env.INFURA_NODE_URL)
})

const senateProvider = new ethers.providers.JsonRpcProvider({
    url: String(process.env.SENATE_NODE_URL)
})

interface Result {
    votes: {
        voterAddress: string
        daoId: string
        proposalId: string
        daoHandlerId: string
        choiceId: string
        choice: string
    }[]
    newLastVoteBlock: number
}

export const updateChainDaoVotes = async (
    daoHandlerId: string,
    voters: [string]
) => {
    if (!Array.isArray(voters)) voters = [voters]

    const daoHandler = await prisma.dAOHandler.findFirstOrThrow({
        where: { id: daoHandlerId },
        include: {
            dao: {
                include: {
                    votes: { where: { daoHandlerId: daoHandlerId } }
                }
            }
        }
    })

    log_pd.log({
        level: 'info',
        message: `New votes update for ${daoHandler.dao.name} - ${daoHandler.type}`,
        data: {
            daoHandlerId: daoHandlerId,
            voters: voters
        }
    })

    const results = new Map()

    for (const voterAddress of voters) {
        results.set(voterAddress, 'ok')

        const voterHandler = await prisma.voterHandler.findFirstOrThrow({
            where: {
                daoHandlerId: daoHandlerId,
                voter: {
                    is: {
                        address: voterAddress
                    }
                }
            }
        })

        let result: Result, provider
        const lastVoteBlock =
            Number(voterHandler.lastChainVoteCreatedBlock) ?? 0
        const currentBlock = await senateProvider.getBlockNumber()

        log_node.log({
            level: 'info',
            message: `getBlockNumber`,
            data: {}
        })
        if (lastVoteBlock < currentBlock - 120) {
            provider = infuraProvider
            log_pd.log({
                level: 'info',
                message: `Using Infura provider for votes ${voterAddress} - ${daoHandler.dao.name} - ${daoHandler.type}`,
                data: {
                    daoHandlerId: daoHandlerId,
                    lastVoteBlock: lastVoteBlock,
                    provider: 'Infura'
                }
            })
        } else {
            provider = senateProvider
            log_pd.log({
                level: 'info',
                message: `Using Senate provider for votes ${voterAddress} - ${daoHandler.dao.name} - ${daoHandler.type}`,
                data: {
                    daoHandlerId: daoHandlerId,
                    lastVoteBlock: lastVoteBlock,
                    provider: 'Senate'
                }
            })
        }

        try {
            switch (daoHandler.type) {
                case 'AAVE_CHAIN':
                    result = await getAaveVotes(
                        provider,
                        daoHandler,
                        voterAddress,
                        lastVoteBlock
                    )
                    break
                case 'COMPOUND_CHAIN':
                    result = await getCompoundVotes(
                        provider,
                        daoHandler,
                        voterAddress,
                        lastVoteBlock
                    )
                    break
                case 'MAKER_EXECUTIVE':
                    result = await getMakerExecutiveVotes(
                        provider,
                        daoHandler,
                        voterAddress,
                        lastVoteBlock
                    )
                    break
                case 'MAKER_POLL':
                    result = await getMakerPollVotes(
                        provider,
                        daoHandler,
                        voterAddress,
                        lastVoteBlock
                    )
                    break
                case 'UNISWAP_CHAIN':
                    result = await await getUniswapVotes(
                        provider,
                        daoHandler,
                        voterAddress,
                        lastVoteBlock
                    )
                    break
            }

            if (!result.votes) {
                log_pd.log({
                    level: 'info',
                    message: `Nothing to update for ${voterAddress} in ${daoHandler.dao.name} - ${daoHandler.type}`,
                    data: { lastChainVoteCreatedBlock: result.newLastVoteBlock }
                })
                await prisma.voterHandler.update({
                    where: {
                        id: voterHandler.id
                    },
                    data: {
                        lastChainVoteCreatedBlock: result.newLastVoteBlock
                    }
                })
                continue
            }

            log_pd.log({
                level: 'info',
                message: `Updating votes for ${voterAddress} in ${daoHandler.dao.name} - ${daoHandler.type}`,
                data: {
                    vote: result.votes
                }
            })

            await prisma.vote
                .createMany({
                    data: result.votes,
                    skipDuplicates: true
                })
                .then(async (r) => {
                    log_pd.log({
                        level: 'info',
                        message: `Updated votes for ${voterAddress} in ${daoHandler.dao.name} - ${daoHandler.type}`,
                        data: {
                            vote: r
                        }
                    })
                    await prisma.voterHandler.update({
                        where: {
                            id: voterHandler.id
                        },
                        data: {
                            lastChainVoteCreatedBlock: result.newLastVoteBlock
                        }
                    })
                    return
                })
                .catch(async (e) => {
                    results.set(voterAddress, 'nok')
                    log_pd.log({
                        level: 'error',
                        message: `Could not update votes for ${voterAddress} in ${daoHandler.dao.name} - ${daoHandler.type}`,
                        data: {
                            location: 'prisma createMany',
                            error: e,
                            votes: result.votes
                        }
                    })
                })
        } catch (e) {
            results.set(voterAddress, 'nok')
            log_pd.log({
                level: 'error',
                message: `Could not update votes for ${voterAddress} in ${daoHandler.dao.name} - ${daoHandler.type}`,
                data: {
                    location: 'try wrap',
                    error: e,
                    errorString: String(e)
                }
            })
        }
    }

    const resultsArray = Array.from(results, ([name, value]) => ({
        voterAddress: name,
        response: value
    }))

    log_pd.log({
        level: 'info',
        message: `Succesfully updated votes for ${daoHandler.dao.name} - ${daoHandler.type}`,
        data: {
            result: resultsArray
        }
    })

    return resultsArray
}
