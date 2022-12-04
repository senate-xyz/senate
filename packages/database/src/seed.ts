/* eslint-disable @typescript-eslint/no-unused-vars */
import aaveGovBravo from './abis/aaveGovBravo.json'
import makerChief from './abis/makerChief.json'
import makerPollCreate from './abis/makerPollCreate.json'
import makerPollVote from './abis/makerPollVote.json'
import uniswapGovBravo from './abis/uniswapGovBravo.json'
import compoundGovBravo from './abis/compoundGovBravo.json'
import { prisma } from './client'
import { DAOHandlerType, RefreshStatus } from '@prisma/client'

async function main() {
    const aave = await prisma.dAO.upsert({
        where: { name: 'Aave' },
        update: {},
        create: {
            name: 'Aave',
            picture: '/assets/Project_Icons/aave.png',
            handlers: {
                create: [
                    {
                        type: DAOHandlerType.BRAVO1,
                        decoder: {
                            address:
                                '0xEC568fffba86c094cf06b22134B23074DFE2252c',
                            abi: aaveGovBravo.abi,
                            latestProposalBlock: 10000000,
                            proposalUrl:
                                'https://app.aave.com/governance/proposal/?proposalId=',
                        },
                    },
                    {
                        type: DAOHandlerType.SNAPSHOT,
                        decoder: {
                            space: 'aave.eth',
                            proposalsCount: 0,
                        },
                    },
                ],
            },
            refreshStatus: RefreshStatus.DONE,
            lastRefresh: new Date(),
        },
        include: {
            handlers: true,
        },
    })

    const maker = await prisma.dAO.upsert({
        where: { name: 'MakerDAO' },
        update: {},
        create: {
            name: 'MakerDAO',
            picture: '/assets/Project_Icons/maker-dao.png',
            handlers: {
                create: [
                    {
                        type: DAOHandlerType.MAKER_EXECUTIVE,
                        decoder: {
                            address:
                                '0x0a3f6849f78076aefaDf113F5BED87720274dDC0',
                            abi: makerChief.abi,
                            latestProposalBlock: 15876682,
                            proposalUrl: 'https://vote.makerdao.com/executive/',
                        },
                    },
                    {
                        type: DAOHandlerType.MAKER_POLL_CREATE,
                        decoder: {
                            address:
                                '0xf9be8f0945acddeedaa64dfca5fe9629d0cf8e5d',
                            abi: makerPollCreate.abi,
                            latestProposalBlock: 15876682,
                            proposalUrl: 'https://vote.makerdao.com/polling/',
                        },
                    },
                    {
                        type: DAOHandlerType.MAKER_POLL_VOTE,
                        decoder: {
                            address:
                                '0xD3A9FE267852281a1e6307a1C37CDfD76d39b133',
                            abi: makerPollVote.abi,
                        },
                    },
                ],
            },
            refreshStatus: RefreshStatus.DONE,
            lastRefresh: new Date(),
        },
        include: {
            handlers: true,
        },
    })

    const balancer = await prisma.dAO.upsert({
        where: { name: 'Balancer' },
        update: {},
        create: {
            name: 'Balancer',
            picture: '/assets/Project_Icons/balancer.png',
            handlers: {
                create: [
                    {
                        type: DAOHandlerType.SNAPSHOT,
                        decoder: {
                            space: 'balancer.eth',
                            proposalsCount: 0,
                        },
                    },
                ],
            },
            refreshStatus: RefreshStatus.DONE,
            lastRefresh: new Date(),
        },
        include: {
            handlers: true,
        },
    })

    const optimism = await prisma.dAO.upsert({
        where: { name: 'Optimism' },
        update: {},
        create: {
            name: 'Optimism',
            picture: '/assets/Project_Icons/optimism.png',
            handlers: {
                create: [
                    {
                        type: DAOHandlerType.SNAPSHOT,
                        decoder: {
                            space: 'opcollective.eth',
                            proposalsCount: 0,
                        },
                    },
                ],
            },
            refreshStatus: RefreshStatus.DONE,
            lastRefresh: new Date(),
        },
        include: {
            handlers: true,
        },
    })

    const elementFinance = await prisma.dAO.upsert({
        where: { name: 'Element' },
        update: {},
        create: {
            name: 'Element',
            picture: '/assets/Project_Icons/element.png',
            handlers: {
                create: [
                    {
                        type: DAOHandlerType.SNAPSHOT,
                        decoder: {
                            space: 'elfi.eth',
                            proposalsCount: 0,
                        },
                    },
                ],
            },
            refreshStatus: RefreshStatus.DONE,
            lastRefresh: new Date(),
        },
        include: {
            handlers: true,
        },
    })

    const oneInch = await prisma.dAO.upsert({
        where: { name: '1inch' },
        update: {},
        create: {
            name: '1inch',
            picture: '/assets/Project_Icons/1inch.png',
            handlers: {
                create: [
                    {
                        type: DAOHandlerType.SNAPSHOT,
                        decoder: {
                            space: '1inch.eth',
                            proposalsCount: 0,
                        },
                    },
                ],
            },
            refreshStatus: RefreshStatus.DONE,
            lastRefresh: new Date(),
        },
        include: {
            handlers: true,
        },
    })

    const hop = await prisma.dAO.upsert({
        where: { name: 'Hop Protocol' },
        update: {},
        create: {
            name: 'Hop Protocol',
            picture: '/assets/Project_Icons/hop-exchange.png',
            handlers: {
                create: [
                    {
                        type: DAOHandlerType.SNAPSHOT,
                        decoder: {
                            space: 'hop.eth',
                            proposalsCount: 0,
                        },
                    },
                ],
            },
            refreshStatus: RefreshStatus.DONE,
            lastRefresh: new Date(),
        },
        include: {
            handlers: true,
        },
    })

    const safe = await prisma.dAO.upsert({
        where: { name: 'SafeDAO' },
        update: {},
        create: {
            name: 'SafeDAO',
            picture: '/assets/Project_Icons/gnosis.png',
            handlers: {
                create: [
                    {
                        type: DAOHandlerType.SNAPSHOT,
                        decoder: {
                            space: 'safe.eth',
                            proposalsCount: 0,
                        },
                    },
                ],
            },
            refreshStatus: RefreshStatus.DONE,
            lastRefresh: new Date(),
        },
        include: {
            handlers: true,
        },
    })

    const compound = await prisma.dAO.upsert({
        where: { name: 'Compound' },
        update: {},
        create: {
            name: 'Compound',
            picture: '/assets/Project_Icons/compound.png',
            handlers: {
                create: [
                    {
                        type: DAOHandlerType.BRAVO2,
                        decoder: {
                            address:
                                '0xc0Da02939E1441F497fd74F78cE7Decb17B66529',
                            abi: compoundGovBravo.abi,
                            latestProposalBlock: 10000000,
                            proposalUrl:
                                'https://compound.finance/governance/proposals/',
                        },
                    },
                    {
                        type: DAOHandlerType.SNAPSHOT,
                        decoder: {
                            space: 'comp-vote.eth',
                            proposalsCount: 0,
                        },
                    },
                ],
            },
            refreshStatus: RefreshStatus.DONE,
            lastRefresh: new Date(),
        },
        include: {
            handlers: true,
        },
    })

    const synthetix = await prisma.dAO.upsert({
        where: { name: 'Synthetix' },
        update: {},
        create: {
            name: 'Synthetix',
            picture: '/assets/Project_Icons/synthetix.png',
            handlers: {
                create: [
                    {
                        type: DAOHandlerType.SNAPSHOT,
                        decoder: {
                            space: 'snxgov.eth',
                            proposalsCount: 0,
                        },
                    },
                ],
            },
            refreshStatus: RefreshStatus.DONE,
            lastRefresh: new Date(),
        },
        include: {
            handlers: true,
        },
    })

    const dydx = await prisma.dAO.upsert({
        where: { name: 'dYdX' },
        update: {},
        create: {
            name: 'dYdX',
            picture: '/assets/Project_Icons/dYdX.png',
            handlers: {
                create: [
                    {
                        type: DAOHandlerType.SNAPSHOT,
                        decoder: {
                            space: 'dydxgov.eth',
                            proposalsCount: 0,
                        },
                    },
                ],
            },
            refreshStatus: RefreshStatus.DONE,
            lastRefresh: new Date(),
        },
        include: {
            handlers: true,
        },
    })

    const uniswap = await prisma.dAO.upsert({
        where: { name: 'Uniswap' },
        update: {},
        create: {
            name: 'Uniswap',
            picture: '/assets/Project_Icons/uniswap.png',
            handlers: {
                create: [
                    {
                        type: DAOHandlerType.BRAVO2,
                        decoder: {
                            address:
                                '0x408ED6354d4973f66138C91495F2f2FCbd8724C3',
                            abi: uniswapGovBravo.abi,
                            latestProposalBlock: 10000000,
                            proposalUrl: 'https://app.uniswap.org/#/vote/',
                        },
                    },
                    {
                        type: DAOHandlerType.SNAPSHOT,
                        decoder: {
                            space: 'uniswap',
                            proposalsCount: 0,
                        },
                    },
                ],
            },
            refreshStatus: RefreshStatus.DONE,
            lastRefresh: new Date(),
        },
        include: {
            handlers: true,
        },
    })
}

main()
