import { log_pd } from '@senate/axiom'
import { DAOHandlerType, JsonValue, prisma } from '@senate/database'
import { ethers } from 'ethers'
import { getAaveVotes } from './chain/aave'
import { getMakerExecutiveVotes } from './chain/makerExecutive'
import { getUniswapVotes } from './chain/uniswap'
import { getENSVotes } from './chain/ens'
import { getGitcoinVotes } from './chain/gitcoin'
import { getHopVotes } from './chain/hop'
import { getDydxVotes } from './chain/dydx'
import { getMakerPollVotes } from './chain/makerPoll'
import { getMakerPollVotesFromArbitrum } from './chain/makerPollArbitrum'
import { getCompoundVotes } from './chain/compound'
import superagent from 'superagent'

const provider = new ethers.JsonRpcProvider(
    String(process.env.ALCHEMY_NODE_URL)
)

interface Result {
    voteraddress: string
    success: boolean
    votes: {
        blockcreated: number
        voteraddress: string
        daoid: string
        proposalid: string
        daohandlerid: string
        choice: JsonValue
        reason: string
        votingpower: number
        proposalactive: boolean
    }[]
}

export const updateChainDaoVotes = async (
    daoHandlerId: string,
    voters: string[]
) => {
    const result = new Map()
    voters.map((voter) => result.set(voter, 'nok'))

    const daoHandler = await prisma.daohandler.findFirstOrThrow({
        where: { id: daoHandlerId },
        include: {
            dao: true,
            proposals: true
        }
    })

    const voterHandlers = await prisma.voterhandler.findMany({
        where: {
            daohandlerid: daoHandlerId,
            voter: {
                address: { in: voters }
            }
        }
    })

    const firstProposalTimestamp = Math.floor(
        Math.min(
            ...daoHandler.proposals
                .filter((p) => p.timecreated.valueOf() > 0)
                .map((p) => p.timecreated.valueOf())
        ) / 1000
    )

    const firstProposalBlock = await superagent
        .get(`https://coins.llama.fi/block/ethereum/${firstProposalTimestamp}`)
        .then((response) => {
            return JSON.parse(response.text).height
        })
        .catch(() => {
            return 0
        })

    const oldestVoteBlock = Math.min(
        ...voterHandlers.map((voterHandler) => Number(voterHandler.chainindex))
    )

    let votes: Result[] = []

    const currentBlock = await provider.getBlockNumber()

    let blockBatchSize = Math.floor(40000000 / voters.length)
    if (daoHandler.type == DAOHandlerType.MAKER_EXECUTIVE)
        blockBatchSize = Math.floor(blockBatchSize / 10)

    if (blockBatchSize > 100000) blockBatchSize = 100000

    let fromBlock = Math.max(oldestVoteBlock, 0)

    if (fromBlock < firstProposalBlock) fromBlock = firstProposalBlock

    const toBlock =
        currentBlock - fromBlock > blockBatchSize
            ? fromBlock + blockBatchSize
            : currentBlock

    if (fromBlock > toBlock) fromBlock = toBlock

    try {
        switch (daoHandler.type) {
            case 'AAVE_CHAIN':
                votes = await getAaveVotes(
                    provider,
                    daoHandler,
                    voters,
                    fromBlock,
                    toBlock
                )
                break
            case 'COMPOUND_CHAIN':
                votes = await getCompoundVotes(
                    provider,
                    daoHandler,
                    voters,
                    fromBlock,
                    toBlock
                )
                break
            case 'MAKER_EXECUTIVE':
                votes = await getMakerExecutiveVotes(
                    provider,
                    daoHandler,
                    voters,
                    fromBlock,
                    toBlock
                )
                break
            case 'MAKER_POLL':
                votes = await getMakerPollVotes(
                    provider,
                    daoHandler,
                    voters,
                    fromBlock,
                    toBlock
                )
                break
            case 'UNISWAP_CHAIN':
                votes = await getUniswapVotes(
                    provider,
                    daoHandler,
                    voters,
                    fromBlock,
                    toBlock
                )
                break
            case 'MAKER_POLL_ARBITRUM':
                const arbitrumProvider = new ethers.JsonRpcProvider(
                    process.env.ARBITRUM_NODE_URL
                )
                const toBlockArbitrum = await arbitrumProvider.getBlockNumber()
                votes = await getMakerPollVotesFromArbitrum(
                    arbitrumProvider,
                    daoHandler,
                    voters,
                    fromBlock,
                    toBlockArbitrum
                )
                break
            case 'ENS_CHAIN':
                votes = await getENSVotes(
                    provider,
                    daoHandler,
                    voters,
                    fromBlock,
                    toBlock
                )
                break
            case 'GITCOIN_CHAIN':
                votes = await getGitcoinVotes(
                    provider,
                    daoHandler,
                    voters,
                    fromBlock,
                    toBlock
                )
                break
            case 'HOP_CHAIN':
                votes = await getHopVotes(
                    provider,
                    daoHandler,
                    voters,
                    fromBlock,
                    toBlock
                )
                break
            case 'DYDX_CHAIN':
                votes = await getDydxVotes(
                    provider,
                    daoHandler,
                    voters,
                    fromBlock,
                    toBlock
                )
                break
            default:
                votes = []
        }

        const successfulResults = votes.filter((res) => res.success)

        const successfulVotes = successfulResults
            .map((res) => res.votes)
            .flat(2)

        const closedVotes = successfulVotes
            .filter((vote) => vote.proposalactive == false)
            .map((vote) => {
                return {
                    voteraddress: vote.voteraddress,
                    daoid: vote.daoid,
                    proposalid: vote.proposalid,
                    daohandlerid: vote.daohandlerid,
                    choice: vote.choice,
                    reason: vote.reason,
                    votingpower: vote.votingpower
                }
            })

        const openVotes = successfulVotes.filter(
            (vote) => vote.proposalactive == true
        )

        await prisma.vote.createMany({
            data: closedVotes,
            skipDuplicates: true
        })

        await prisma.$transaction(
            openVotes.map((vote) => {
                return prisma.vote.upsert({
                    where: {
                        voteraddress_daoid_proposalid: {
                            voteraddress: vote.voteraddress,
                            daoid: vote.daoid,
                            proposalid: vote.proposalid
                        }
                    },
                    create: {
                        blockcreated: vote.blockcreated,
                        choice: vote.choice,
                        votingpower: vote.votingpower,
                        reason: vote.reason,

                        voteraddress: vote.voteraddress,
                        daoid: vote.daoid,
                        proposalid: vote.proposalid,
                        daohandlerid: vote.daohandlerid
                    },
                    update: {
                        choice: vote.choice,
                        votingpower: vote.votingpower,
                        reason: vote.reason
                    }
                })
            })
        )

        const newIndex = Math.min(Number(daoHandler.chainindex), toBlock)

        await prisma.voterhandler.updateMany({
            where: {
                voter: {
                    address: {
                        in: successfulResults.map((res) => res.voteraddress)
                    }
                },
                daohandlerid: daoHandler.id
            },
            data: {
                chainindex: newIndex,
                snapshotindex: new Date('2009-01-09T04:54:25.00Z')
            }
        })

        successfulResults.map((res) => {
            result.set(res.voteraddress, 'ok')
        })
    } catch (e) {
        log_pd.log({
            level: 'error',
            message: `Search for votes ${daoHandler.dao.name} - ${daoHandler.type}`,
            searchType: 'VOTES',
            sourceType: 'CHAIN',
            currentBlock: currentBlock,
            fromBlock: fromBlock,
            toBlock: toBlock,
            voters: voters,
            votes: votes,
            provider: provider._getConnection().url,
            errorName: (e as Error).name,
            errorMessage: (e as Error).message,
            errorStack: (e as Error).stack,
            response: Array.from(result, ([name, value]) => ({
                voterAddress: name,
                response: value
            }))
        })
    }

    log_pd.log({
        level: 'info',
        message: `FINISHED updating voters ${daoHandler.dao.name} - ${daoHandler.type}`,
        searchType: 'VOTES',
        sourceType: 'CHAIN',
        currentBlock: currentBlock,
        fromBlock: fromBlock,
        toBlock: toBlock,
        voters: voters,
        votes: votes,
        provider: provider._getConnection().url,
        response: Array.from(result, ([name, value]) => ({
            voterAddress: name,
            response: value
        }))
    })

    return Array.from(result, ([name, value]) => ({
        voterAddress: name,
        response: value
    }))
}
