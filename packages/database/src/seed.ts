import aaveGovBravo from './abis/aaveGovBravo.json'
import makerChief from './abis/makerChief.json'
import makerPollCreate from './abis/makerPollCreate.json'
import makerPollVote from './abis/makerPollVote.json'
import { prisma } from './client'
import { DAOHandlerType, ProposalType } from '@prisma/client'

async function main() {
    const aave = await prisma.dAO.upsert({
        where: { name: 'Aave' },
        update: {},
        create: {
            name: 'Aave',
            picture:
                'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
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
            picture:
                'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
            handlers: {
                create: [
                    {
                        type: DAOHandlerType.MAKER_EXECUTIVE,
                        decoder: {
                            address:
                                '0x0a3f6849f78076aefaDf113F5BED87720274dDC0',
                            abi: makerChief.abi,
                            latestProposalBlock: 15682797,
                            proposalUrl: 'https://vote.makerdao.com/executive/',
                        },
                    },
                    {
                        type: DAOHandlerType.MAKER_POLL_CREATE,
                        decoder: {
                            address:
                                '0xf9be8f0945acddeedaa64dfca5fe9629d0cf8e5d',
                            abi: makerPollCreate.abi,
                            latestProposalBlock: 15682797,
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
        },
        include: {
            handlers: true,
        },
    })

    const testUserMaker = await prisma.user.upsert({
        where: {
            address: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
        },
        update: {},
        create: {
            address: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
        },
    })

    const testDelegateContractMaker = await prisma.user.upsert({
        where: {
            address: '0xa6ca9f4210960dcf667f397bb24f5d023b7eacc8',
        },
        update: {},
        create: {
            address: '0xa6ca9f4210960dcf667f397bb24f5d023b7eacc8',
        },
    })

    const testUserAave = await prisma.user.upsert({
        where: {
            address: '0x5B3bFfC0bcF8D4cAEC873fDcF719F60725767c98',
        },
        update: {},
        create: {
            address: '0x5B3bFfC0bcF8D4cAEC873fDcF719F60725767c98',
        },
    })
}

main()
