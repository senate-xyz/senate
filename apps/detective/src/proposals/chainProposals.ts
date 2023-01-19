import { InternalServerErrorException } from '@nestjs/common'
import { log_pd } from '@senate/axiom'
import { prisma } from '@senate/database'
import { ethers } from 'ethers'
import { aaveProposals } from './chain/aave'
import { compoundProposals } from './chain/compound'
import { makerExecutiveProposals } from './chain/makerExecutive'
import { makerPolls } from './chain/makerPoll'
import { uniswapProposals } from './chain/uniswap'

const infuraProvider = new ethers.providers.JsonRpcProvider({
    url: String(process.env.INFURA_NODE_URL)
})

const senateProvider = new ethers.providers.JsonRpcProvider({
    url: String(process.env.SENATE_NODE_URL)
})

interface Result {
    proposals: {
        externalId: string
        name: string
        daoId: string
        daoHandlerId: string
        timeEnd: Date
        timeStart: Date
        timeCreated: Date
        data: any
        url: string
    }[]
    lastBlock: number
}

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
        let result: Result, provider, currentBlock, senateOnline
        try {
            currentBlock = await senateProvider.getBlockNumber()
            senateOnline = true
        } catch (e) {
            currentBlock = await infuraProvider.getBlockNumber()
        }

        log_pd.log({
            level: 'info',
            message: `Current block`,
            data: {
                currentBlock: currentBlock
            }
        })

        if (minBlockNumber < currentBlock - 50 || !senateOnline) {
            provider = infuraProvider
            log_pd.log({
                level: 'info',
                message: `Using Infura provider for proposals ${daoHandler.dao.name} - ${daoHandler.type}`,
                data: {
                    daoHandlerId: daoHandlerId,
                    minBlockNumber: minBlockNumber,
                    provider: 'Infura'
                }
            })
        } else {
            provider = senateProvider
            log_pd.log({
                level: 'info',
                message: `Using Senate provider for proposals ${daoHandler.dao.name} - ${daoHandler.type}`,
                data: {
                    daoHandlerId: daoHandlerId,
                    minBlockNumber: minBlockNumber,
                    provider: 'Senate'
                }
            })
        }

        switch (daoHandler.type) {
            case 'AAVE_CHAIN':
                result = await aaveProposals(
                    provider,
                    daoHandler,
                    minBlockNumber
                )
                break
            case 'COMPOUND_CHAIN':
                result = await compoundProposals(
                    provider,
                    daoHandler,
                    minBlockNumber
                )
                break
            case 'MAKER_EXECUTIVE':
                result = await makerExecutiveProposals(
                    provider,
                    daoHandler,
                    minBlockNumber
                )
                break
            case 'MAKER_POLL':
                result = await makerPolls(provider, daoHandler, minBlockNumber)
                break
            case 'UNISWAP_CHAIN':
                result = await uniswapProposals(
                    provider,
                    daoHandler,
                    minBlockNumber
                )
                break
        }

        log_pd.log({
            level: 'info',
            message: `Got proposals for ${daoHandler.dao.name} - ${daoHandler.type}`,
            data: {
                count: result.proposals.length,
                lastBlock: result.lastBlock
            }
        })

        await prisma.proposal
            .createMany({
                data: result.proposals,
                skipDuplicates: true
            })
            .then(async (r) => {
                log_pd.log({
                    level: 'info',
                    message: `Upserted new proposals for ${daoHandler.dao.name} - ${daoHandler.type}`,
                    data: {
                        count: r.count,
                        lastChainProposalCreatedBlock: result.lastBlock
                    }
                })
                await prisma.dAOHandler.update({
                    where: {
                        id: daoHandler.id
                    },
                    data: {
                        lastChainProposalCreatedBlock: result.lastBlock,
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
                    data: { proposals: result.proposals, error: e }
                })
            })
    } catch (e) {
        response = 'nok'
        log_pd.log({
            level: 'error',
            message: `Could not get new proposals for ${daoHandler.dao.name} - ${daoHandler.type}`,
            data: {
                error: e
            }
        })
        throw new InternalServerErrorException()
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
