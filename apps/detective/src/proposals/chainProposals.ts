import { log_pd } from '@senate/axiom'
import { prisma } from '@senate/database'
import { ethers } from 'ethers'
import { aaveProposals } from './chain/aave'
import { compoundProposals } from './chain/compound'
import { makerExecutiveProposals } from './chain/makerExecutive'
import { makerPolls } from './chain/makerPoll'
import { uniswapProposals } from './chain/uniswap'

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
    log_pd.log({
        level: 'info',
        message: `New proposals update for ${daoHandler.dao.name} - ${daoHandler.type}`,
        data: {
            daoHandlerId: daoHandlerId,
            minBlockNumber: minBlockNumber
        }
    })

    if (!daoHandler.decoder) {
        log_pd.log({
            level: 'error',
            message: 'Could not get daoHandler decoder'
        })
        return [{ daoHandlerId: daoHandlerId, response: 'nok' }]
    }

    try {
        let result: Result[], currentBlock: number

        try {
            currentBlock = await senateProvider.getBlockNumber()
        } catch (e) {
            currentBlock = await infuraProvider.getBlockNumber()
        }

        const fromBlock = Math.max(minBlockNumber, 0)
        const toBlock =
            currentBlock - fromBlock > 1000000
                ? fromBlock + 1000000
                : currentBlock

        const provider =
            currentBlock - 50 > fromBlock ? infuraProvider : senateProvider

        log_pd.log({
            level: 'info',
            message: `Search interval for ${daoHandler.dao.name} - ${daoHandler.type}`,
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

        if (!result.length && toBlock == currentBlock) {
            log_pd.log({
                level: 'info',
                message: `No new proposals. Skip insert ${daoHandler.dao.name} - ${daoHandler.type}`
            })
            await prisma.dAOHandler.update({
                where: {
                    id: daoHandler.id
                },
                data: {
                    lastChainProposalCreatedBlock: toBlock,
                    lastSnapshotProposalCreatedTimestamp: new Date(0)
                }
            })
        } else {
            log_pd.log({
                level: 'info',
                message: `Got proposals for ${daoHandler.dao.name} - ${daoHandler.type}`,
                data: {
                    proposals: result
                }
            })

            await prisma.proposal
                .createMany({
                    data: result,
                    skipDuplicates: true
                })
                .then(async (r) => {
                    log_pd.log({
                        level: 'info',
                        message: `Upserted new proposals for ${daoHandler.dao.name} - ${daoHandler.type}`,
                        data: {
                            proposals: r,
                            lastChainProposalCreatedBlock: toBlock
                        }
                    })
                    await prisma.dAOHandler.update({
                        where: {
                            id: daoHandler.id
                        },
                        data: {
                            lastChainProposalCreatedBlock: toBlock,
                            lastSnapshotProposalCreatedTimestamp: new Date(0)
                        }
                    })
                    return
                })
                .catch(async (e) => {
                    response = 'nok'
                    log_pd.log({
                        level: 'error',
                        message: `Could not upsert new proposals for ${daoHandler.dao.name} - ${daoHandler.type}`,
                        data: { proposals: result, error: e }
                    })
                })
        }
    } catch (e) {
        response = 'nok'
        log_pd.log({
            level: 'error',
            message: `Could not get new proposals for ${daoHandler.dao.name} - ${daoHandler.type}`,
            data: {
                error: e
            }
        })
    }

    log_pd.log({
        level: 'info',
        message: `Succesfully updated proposals for ${daoHandler.dao.name} - ${daoHandler.type}`,
        data: {
            result: [{ daoHandlerId: daoHandlerId, response: response }]
        }
    })

    return [{ daoHandlerId: daoHandlerId, response: response }]
}
