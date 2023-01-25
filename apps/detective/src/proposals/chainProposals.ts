import { DAOHandlerType, prisma } from '@senate/database'
import { ethers } from 'ethers'
import { aaveProposals } from './chain/aave'
import { compoundProposals } from './chain/compound'
import { makerExecutiveProposals } from './chain/makerExecutive'
import { makerPolls } from './chain/makerPoll'
import { uniswapProposals } from './chain/uniswap'
import { log_pd } from '@senate/axiom'

interface Result {
    externalId: string
    name: string
    daoId: string
    daoHandlerId: string
    timeEnd: Date
    timeStart: Date
    timeCreated: Date
    url: any
}

const infuraProvider = new ethers.providers.JsonRpcProvider({
    url: String(process.env.INFURA_NODE_URL)
})

const senateProvider = new ethers.providers.JsonRpcProvider({
    url: String(process.env.SENATE_NODE_URL)
})

export const updateChainProposals = async (
    daoHandlerId: string,
    minBlockNumber: number
) => {
    let response = 'nok'
    const daoHandler = await prisma.dAOHandler.findFirst({
        where: { id: daoHandlerId },
        include: { dao: true }
    })

    if (!daoHandler.decoder) {
        return [{ daoHandlerId: daoHandlerId, response: 'nok' }]
    }

    let proposals: Result[], currentBlock: number

    try {
        currentBlock = await senateProvider.getBlockNumber()
    } catch (e) {
        currentBlock = await infuraProvider.getBlockNumber()
    }

    const blockBatchSize =
        daoHandler.type == DAOHandlerType.MAKER_EXECUTIVE ? 100000 : 1000000

    const fromBlock = Math.max(minBlockNumber, 0)
    const toBlock =
        currentBlock - fromBlock > blockBatchSize
            ? fromBlock + blockBatchSize
            : currentBlock

    const provider: ethers.providers.JsonRpcProvider =
        currentBlock - 50 > fromBlock ? infuraProvider : senateProvider

    try {
        switch (daoHandler.type) {
            case 'AAVE_CHAIN':
                proposals = await aaveProposals(
                    provider,
                    daoHandler,
                    fromBlock,
                    toBlock
                )
                break
            case 'COMPOUND_CHAIN':
                proposals = await compoundProposals(
                    provider,
                    daoHandler,
                    fromBlock,
                    toBlock
                )
                break
            case 'MAKER_EXECUTIVE':
                proposals = await makerExecutiveProposals(
                    provider,
                    daoHandler,
                    fromBlock,
                    toBlock
                )
                break
            case 'MAKER_POLL':
                proposals = await makerPolls(
                    provider,
                    daoHandler,
                    fromBlock,
                    toBlock
                )
                break
            case 'UNISWAP_CHAIN':
                proposals = await uniswapProposals(
                    provider,
                    daoHandler,
                    fromBlock,
                    toBlock
                )
                break
        }

        if (proposals.length || toBlock != currentBlock) {
            await prisma.proposal.createMany({
                data: proposals,
                skipDuplicates: true
            })
        }

        await prisma.dAOHandler.update({
            where: {
                id: daoHandler.id
            },
            data: {
                lastChainProposalCreatedBlock: toBlock,
                lastSnapshotProposalCreatedTimestamp: new Date(0)
            }
        })

        response = 'ok'
    } catch (e: any) {
        log_pd.log({
            level: 'error',
            message: `Search for proposals ${daoHandler.dao.name} - ${daoHandler.type}`,
            searchType: 'PROPOSALS',
            sourceType: 'CHAIN',
            currentBlock: currentBlock,
            fromBlock: fromBlock,
            toBlock: toBlock,
            provider: provider.connection.url,
            proposalsCount: proposals.length,
            errorMessage: e.message,
            errorStack: e.stack
        })
    }

    const res = [{ daoHandlerId: daoHandlerId, response: response }]

    log_pd.log({
        level: 'info',
        message: `Search for proposals ${daoHandler.dao.name} - ${daoHandler.type}`,
        searchType: 'PROPOSALS',
        sourceType: 'CHAIN',
        currentBlock: currentBlock,
        fromBlock: fromBlock,
        toBlock: toBlock,
        provider: provider.connection.url,
        proposalsCouht: proposals.length,
        response: res
    })

    return res
}
