import { log_pd } from '@senate/axiom'
import { DAOHandlerType, prisma } from '@senate/database'
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
    voterAddress: string
    success: boolean
    votes: {
        voterAddress: string
        daoId: string
        proposalId: string
        daoHandlerId: string
        choiceId: string
        choice: string
    }[]
}

export const updateChainDaoVotes = async (
    daoHandlerId: string,
    voters: [string]
) => {
    if (!Array.isArray(voters)) voters = [voters]

    const result = new Map()
    voters.map((voter) => result.set(voter, 'nok'))

    const daoHandler = await prisma.dAOHandler.findFirstOrThrow({
        where: { id: daoHandlerId },
        include: {
            dao: {
                include: {
                    votes: { where: { daoHandlerId: daoHandlerId } },
                    proposals: { where: { daoHandlerId: daoHandlerId } }
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

    const voterHandlers = await prisma.voterHandler.findMany({
        where: {
            daoHandlerId: daoHandlerId,
            voter: {
                address: { in: voters }
            }
        },
        include: {
            voter: true
        }
    })

    const voterAddresses = voterHandlers.map(
        (voterHandler) => voterHandler.voter.address
    )

    const lastVoteBlock = Math.min(
        ...voterHandlers.map((voterHandler) =>
            Number(voterHandler.lastChainVoteCreatedBlock)
        )
    )

    let results: Result[] = [],
        currentBlock: number

    try {
        currentBlock = await senateProvider.getBlockNumber()
    } catch (e) {
        currentBlock = await infuraProvider.getBlockNumber()
    }

    const blockBatch =
        daoHandler.type == DAOHandlerType.MAKER_EXECUTIVE ? 100000 : 1000000 //maker is really slow so we refresh 100k batches

    const fromBlock = Math.max(lastVoteBlock, 0)
    const toBlock =
        currentBlock - fromBlock > blockBatch
            ? fromBlock + blockBatch
            : currentBlock

    const provider =
        currentBlock - 50 > fromBlock ? infuraProvider : senateProvider

    log_pd.log({
        level: 'info',
        message: `Search interval for ${voterAddresses} - ${daoHandler.dao.name} - ${daoHandler.type}`,
        data: {
            currentBlock: currentBlock,
            fromBlock: fromBlock,
            toBlock: toBlock,
            provider: provider.connection.url
        }
    })

    switch (daoHandler.type) {
        case 'AAVE_CHAIN':
            results = await getAaveVotes(
                provider,
                daoHandler,
                voterAddresses,
                fromBlock,
                toBlock
            )
            break
        case 'COMPOUND_CHAIN':
            results = await getCompoundVotes(
                provider,
                daoHandler,
                voterAddresses,
                fromBlock,
                toBlock
            )
            break
        case 'MAKER_EXECUTIVE':
            results = await getMakerExecutiveVotes(
                provider,
                daoHandler,
                voterAddresses,
                fromBlock,
                toBlock
            )
            break
        case 'MAKER_POLL':
            results = await getMakerPollVotes(
                provider,
                daoHandler,
                voterAddresses,
                fromBlock,
                toBlock
            )
            break
        case 'UNISWAP_CHAIN':
            results = await getUniswapVotes(
                provider,
                daoHandler,
                voterAddresses,
                fromBlock,
                toBlock
            )
            break
    }

    results
        .filter((res) => res.success)
        .map((res) => {
            result.set(res.voterAddress, 'ok')
        })

    await prisma.voterHandler.updateMany({
        where: {
            voter: {
                address: {
                    in: results
                        .filter((res) => !res.success)
                        .map((res) => res.voterAddress)
                }
            },
            daoHandlerId: daoHandler.id
        },
        data: {
            lastChainVoteCreatedBlock: fromBlock,
            lastSnapshotVoteCreatedTimestamp: new Date(0)
        }
    })

    await prisma.voterHandler.updateMany({
        where: {
            voter: {
                address: {
                    in: results
                        .filter((res) => res.success && !res.votes)
                        .map((res) => res.voterAddress)
                }
            },
            daoHandlerId: daoHandler.id
        },
        data: {
            lastChainVoteCreatedBlock: toBlock,
            lastSnapshotVoteCreatedTimestamp: new Date(0)
        }
    })

    await prisma.vote
        .createMany({
            data: results.map((res) => res.votes).flat(2),
            skipDuplicates: true
        })
        .then(async (r) => {
            log_pd.log({
                level: 'info',
                message: `Updated votes for ${voterAddresses} in ${daoHandler.dao.name} - ${daoHandler.type}`,
                data: {
                    vote: r,
                    newLastVoteBlock: toBlock
                }
            })
            await prisma.voterHandler.updateMany({
                where: {
                    voter: {
                        address: {
                            in: results
                                .filter((res) => res.success && res.votes)
                                .map((res) => res.voterAddress)
                        }
                    },
                    daoHandlerId: daoHandler.id
                },
                data: {
                    lastChainVoteCreatedBlock: toBlock,
                    lastSnapshotVoteCreatedTimestamp: new Date(0)
                }
            })
            return
        })
        .catch(async (e) => {
            log_pd.log({
                level: 'error',
                message: `Could not update votes for ${voterAddresses} in ${daoHandler.dao.name} - ${daoHandler.type}`,
                data: {
                    location: 'prisma createMany',
                    error: e
                }
            })
        })

    log_pd.log({
        level: 'info',
        message: `Succesfully updated votes for ${daoHandler.dao.name} - ${daoHandler.type}`,
        data: {
            result: result
        }
    })
    const resultsArray = Array.from(result, ([name, value]) => ({
        voterAddress: name,
        response: value
    }))

    return resultsArray
}
