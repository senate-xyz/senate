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
    data: any
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
    let response = 'ok'
    const daoHandler = await prisma.dAOHandler.findFirst({
        where: { id: daoHandlerId },
        include: { dao: true }
    })

    if (!daoHandler.decoder) {
        return [{ daoHandlerId: daoHandlerId, response: 'nok' }]
    }

    try {
        let result: Result[], currentBlock: number

        try {
            currentBlock = await senateProvider.getBlockNumber()
        } catch (e) {
            currentBlock = await infuraProvider.getBlockNumber()
        }

        const blockBatchSize =
            daoHandler.type == DAOHandlerType.MAKER_EXECUTIVE ? 500000 : 5000000

        const fromBlock = Math.max(minBlockNumber, 0)
        const toBlock =
            currentBlock - fromBlock > blockBatchSize
                ? fromBlock + blockBatchSize
                : currentBlock

        const provider: ethers.providers.JsonRpcProvider =
            currentBlock - 50 > fromBlock ? infuraProvider : senateProvider

        log_pd.log({
            level: 'info',
            message: `Search interval for proposals ${daoHandler.dao.name} - ${daoHandler.type}`,
            data: {
                currentBlock: currentBlock,
                fromBlock: fromBlock,
                toBlock: toBlock,
                provider: provider.connection.url
            }
        })

        switch (daoHandler.type) {
            case 'AAVE_CHAIN':
                result = await aaveProposals(
                    provider,
                    daoHandler,
                    fromBlock,
                    toBlock
                )
                break
            case 'COMPOUND_CHAIN':
                result = await compoundProposals(
                    provider,
                    daoHandler,
                    fromBlock,
                    toBlock
                )
                break
            case 'MAKER_EXECUTIVE':
                result = await makerExecutiveProposals(
                    provider,
                    daoHandler,
                    fromBlock,
                    toBlock
                )
                break
            case 'MAKER_POLL':
                result = await makerPolls(
                    provider,
                    daoHandler,
                    fromBlock,
                    toBlock
                )
                break
            case 'UNISWAP_CHAIN':
                result = await uniswapProposals(
                    provider,
                    daoHandler,
                    fromBlock,
                    toBlock
                )
                break
        }

        if (result.length || toBlock != currentBlock) {
            await prisma.proposal.createMany({
                data: result,
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
    } catch (e) {
        response = 'nok'
        console.log(e)
        log_pd.log({
            level: 'error',
            message: `Error fetching proposals for ${daoHandler.dao.name}`,
            error: e
        })
    }

    return [{ daoHandlerId: daoHandlerId, response: response }]
}
