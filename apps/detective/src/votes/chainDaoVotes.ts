import { log_pd } from '@senate/axiom'
import { DAOHandlerType, prisma } from '@senate/database'
import { ethers } from 'ethers'
import { getAaveVotes } from './chain/aave'
import { getMakerExecutiveVotes } from './chain/makerExecutive'
import { getUniswapVotes } from './chain/uniswap'
import { getENSVotes } from './chain/ens'
import { getMakerPollVotes } from './chain/makerPoll'
import { getMakerPollVotesFromArbitrum } from './chain/makerPollArbitrum'
import { getCompoundVotes } from './chain/compound'
import superagent from 'superagent'

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
    voters: string[]
) => {
    const result = new Map()
    voters.map((voter) => result.set(voter, 'nok'))

    const daoHandler = await prisma.dAOHandler.findFirstOrThrow({
        where: { id: daoHandlerId },
        include: {
            dao: true,
            proposals: true
        }
    })

    const voterHandlers = await prisma.voterHandler.findMany({
        where: {
            daoHandlerId: daoHandlerId,
            voter: {
                address: { in: voters }
            }
        }
    })

    const firstProposalTimestamp = Math.floor(
        Math.min(
            ...daoHandler.proposals
                .filter((p) => p.timeCreated.valueOf() > 0)
                .map((p) => p.timeCreated.valueOf())
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

    const lastVoteBlock = Math.min(
        ...voterHandlers.map((voterHandler) =>
            Number(voterHandler.lastChainVoteCreatedBlock)
        )
    )

    let votes: Result[] = [],
        currentBlock: number

    try {
        currentBlock = await senateProvider.getBlockNumber()
    } catch (e) {
        currentBlock = await infuraProvider.getBlockNumber()
    }

    let blockBatchSize = Math.floor(40000000 / voters.length)
    if (daoHandler.type == DAOHandlerType.MAKER_EXECUTIVE)
        blockBatchSize = Math.floor(blockBatchSize / 10)

    let fromBlock = Math.max(lastVoteBlock, 0)

    if (fromBlock < firstProposalBlock) fromBlock = firstProposalBlock

    let toBlock =
        currentBlock - fromBlock > blockBatchSize
            ? fromBlock + blockBatchSize
            : currentBlock

    //NOTE to future self: Maker Arbitrum's daoHandler.lastChainProposalCreatedBlock is always 0
    if (
        toBlock > daoHandler.lastChainProposalCreatedBlock &&
        toBlock != currentBlock
    )
        toBlock = Number(daoHandler.lastChainProposalCreatedBlock)

    if (fromBlock > toBlock) fromBlock = toBlock

    const provider: ethers.providers.JsonRpcProvider =
        currentBlock - 50 > fromBlock ? infuraProvider : senateProvider

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
                const arbitrumProvider = new ethers.providers.JsonRpcProvider(
                    process.env.ARBITRUM_NODE_URL
                )
                const toBlockArbitrum = await arbitrumProvider.getBlockNumber()
                console.log('ARBITRUM FROM BLOCK: ', fromBlock)
                console.log('ARBITRUM TO BLOCK: ', toBlockArbitrum)
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
        }

        const successfulResults = votes.filter((res) => res.success)

        if (successfulResults.length)
            await prisma.vote.createMany({
                data: successfulResults.map((res) => res.votes).flat(2),
                skipDuplicates: true
            })

        await prisma.voterHandler.updateMany({
            where: {
                voter: {
                    address: {
                        in: successfulResults.map((res) => res.voterAddress)
                    }
                },
                daoHandlerId: daoHandler.id
            },
            data: {
                lastChainVoteCreatedBlock: toBlock,
                lastSnapshotVoteCreatedDate: new Date(0)
            }
        })

        successfulResults.map((res) => {
            result.set(res.voterAddress, 'ok')
        })
    } catch (e: any) {
        log_pd.log({
            level: 'error',
            message: `Search for votes ${daoHandler.dao.name} - ${daoHandler.type}`,
            searchType: 'VOTES',
            sourceType: 'CHAIN',
            currentBlock: currentBlock,
            fromBlock: fromBlock,
            toBlock: toBlock,
            votersCount: voters.length,
            votesCount: votes.length,
            provider: provider.connection.url,
            errorMessage: e.message,
            errorStack: e.stack
        })
        console.log(e)
    }

    const res = Array.from(result, ([name, value]) => ({
        voterAddress: name,
        response: value
    }))

    log_pd.log({
        level: 'info',
        message: `Search for votes ${daoHandler.dao.name} - ${daoHandler.type}`,
        searchType: 'VOTES',
        sourceType: 'CHAIN',
        currentBlock: currentBlock,
        fromBlock: fromBlock,
        toBlock: toBlock,
        votersCount: voters.length,
        votesCount: votes.length,
        provider: provider.connection.url,
        response: res
    })

    return res
}
