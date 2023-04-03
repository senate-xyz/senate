import { JsonValue, prisma } from '@senate/database'
import { ethers } from 'ethers'
import { aaveProposals } from './chain/aave'
import { compoundProposals } from './chain/compound'
import { makerExecutiveProposals } from './chain/makerExecutive'
import { makerPolls } from './chain/makerPoll'
import { uniswapProposals } from './chain/uniswap'
import { ensProposals } from './chain/ens'
import { gitcoinProposals } from './chain/gitcoin'
import { hopProposals } from './chain/hop'
import { dydxProposals } from './chain/dydx'
import { log_pd } from '@senate/axiom'

interface Result {
    externalId: string
    name: string
    daoId: string
    daoHandlerId: string
    timeEnd: Date
    timeStart: Date
    timeCreated: Date
    blockCreated: number
    choices: JsonValue
    scores: JsonValue
    scoresTotal: number
    quorum: number
    url: string
}

const provider = new ethers.JsonRpcProvider(
    String(process.env.ALCHEMY_NODE_URL)
)

export const updateChainProposals = async (daoHandlerId: string) => {
    let response = 'nok'
    const daoHandler = await prisma.daohandler.findFirstOrThrow({
        where: { id: daoHandlerId },
        include: { dao: true }
    })

    if (!daoHandler.decoder) {
        return [{ daoHandlerId: daoHandlerId, response: 'nok' }]
    }

    let proposals: Result[]

    const currentBlock = await provider.getBlockNumber()

    const minBlockNumber = Number(daoHandler.chainindex)

    // const blockBatchSize =
    //     daoHandler.type == DAOHandlerType.MAKER_EXECUTIVE ? 100000 : 1000000

    const blockBatchSize = Number(daoHandler.refreshspeed)

    const fromBlock = Math.max(minBlockNumber, 1920000)
    const toBlock =
        currentBlock - fromBlock > blockBatchSize
            ? fromBlock + blockBatchSize
            : currentBlock

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
            case 'ENS_CHAIN':
                proposals = await ensProposals(
                    provider,
                    daoHandler,
                    fromBlock,
                    toBlock
                )
                break
            case 'GITCOIN_CHAIN':
                proposals = await gitcoinProposals(
                    provider,
                    daoHandler,
                    fromBlock,
                    toBlock
                )
                break
            case 'HOP_CHAIN':
                proposals = await hopProposals(
                    provider,
                    daoHandler,
                    fromBlock,
                    toBlock
                )
                break
            case 'DYDX_CHAIN':
                proposals = await dydxProposals(
                    provider,
                    daoHandler,
                    fromBlock,
                    toBlock
                )
                break
            default:
                proposals = []
        }

        await prisma.$transaction(
            proposals.map((proposal) => {
                return prisma.proposal.upsert({
                    where: {
                        externalid_daoid: {
                            externalid: proposal.externalId,
                            daoid: proposal.daoId
                        }
                    },
                    update: {
                        choices: proposal.choices,
                        scores: proposal.scores,
                        scorestotal: proposal.scoresTotal
                    },
                    create: {
                        name: proposal.name,
                        externalid: proposal.externalId,
                        choices: proposal.choices,
                        scores: proposal.scores,
                        scorestotal: proposal.scoresTotal,
                        quorum: proposal.quorum,
                        blockcreated: proposal.blockCreated,
                        timecreated: proposal.timeCreated,
                        timestart: proposal.timeStart,
                        timeend: proposal.timeEnd,
                        url: proposal.url,

                        daoid: daoHandler.daoid,
                        daohandlerid: daoHandler.id
                    }
                })
            })
        )

        const openProposals = proposals.filter(
            (proposal) => proposal.timeEnd.getTime() > new Date().getTime()
        )

        let newIndex

        if (openProposals.length) {
            newIndex = Math.min(...openProposals.map((p) => p.blockCreated))
        } else {
            newIndex = toBlock
        }

        log_pd.log({
            level: 'info',
            message: `${daoHandler.type} open proposals`,
            openProposals: openProposals,
            newIndex: newIndex
        })

        await prisma.daohandler.update({
            where: {
                id: daoHandler.id
            },
            data: {
                chainindex: newIndex,
                snapshotindex: new Date('2009-01-09T04:54:25.00Z')
            }
        })

        response = 'ok'
    } catch (e) {
        log_pd.log({
            level: 'error',
            message: `Search for proposals ${daoHandler.dao.name} - ${daoHandler.type}`,
            searchType: 'PROPOSALS',
            sourceType: 'CHAIN',
            currentBlock: currentBlock,
            fromBlock: fromBlock,
            toBlock: toBlock,
            proposals: proposals,
            provider: provider._getConnection().url,
            errorName: (e as Error).name,
            errorMessage: (e as Error).message,
            errorStack: (e as Error).stack,
            response: [{ daoHandlerId: daoHandlerId, response: response }]
        })
    }

    log_pd.log({
        level: 'info',
        message: `FINISHED updating proposals ${daoHandler.dao.name} - ${daoHandler.type}`,
        searchType: 'PROPOSALS',
        sourceType: 'CHAIN',
        currentBlock: currentBlock,
        fromBlock: fromBlock,
        toBlock: toBlock,
        proposals: proposals,
        provider: provider._getConnection().url,
        response: [{ daoHandlerId: daoHandlerId, response: response }]
    })

    return [{ daoHandlerId: daoHandlerId, response: response }]
}
