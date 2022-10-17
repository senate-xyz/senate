import aaveGovBravo from './abis/aaveGovBravo.json'
import { prisma } from './client'
import { DAOHandlerType, ProposalType } from '@prisma/client'

async function main() {
    const testUser = await prisma.user.upsert({
        where: {
            address: '0xCdB792c14391F7115Ba77A7Cd27f724fC9eA2091',
        },
        update: {},
        create: {
            address: '0xCdB792c14391F7115Ba77A7Cd27f724fC9eA2091',
        },
    })

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
                            latestBlock: 0,
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

    const ens = await prisma.dAO.upsert({
        where: { name: 'ENS' },
        update: {},
        create: {
            name: 'ENS',
            picture:
                'https://cdn.stamp.fyi/space/ens.eth?s=160&cb=bc8a2856691e05ab',
            handlers: {
                create: [
                    {
                        type: DAOHandlerType.SNAPSHOT,
                        decoder: {
                            space: 'ens.eth',
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

    await prisma.subscription.upsert({
        where: {
            userId_daoId: {
                userId: testUser.id,
                daoId: String(aave?.id),
            },
        },
        update: {},
        create: {
            userId: testUser.id,
            daoId: String(aave?.id),
        },
    })

    await prisma.subscription.upsert({
        where: {
            userId_daoId: {
                userId: testUser.id,
                daoId: String(ens?.id),
            },
        },
        update: {},
        create: {
            userId: testUser.id,
            daoId: String(ens?.id),
        },
    })

    await prisma.proposal.upsert({
        where: {
            externalId_daoId: {
                daoId: ens?.id,
                externalId: '3',
            },
        },
        update: {},
        create: {
            externalId: '3',
            name: 'ENS proposal test snapshot',
            description: 'Test description',
            daoId: ens?.id,
            daoHandlerId: ens?.handlers[0].id,
            proposalType: ProposalType.SNAPSHOT,
            data: {
                timeStart: 1664975385,
                timeEnd: 1665975385,
            },
        },
    })

    const testProposal = await prisma.proposal.upsert({
        where: {
            externalId_daoId: {
                daoId: aave?.id,
                externalId: '1',
            },
        },
        update: {},
        create: {
            externalId: '1',
            name: 'Aave proposal test snapshot',
            description: 'Test description',
            daoId: aave?.id,
            daoHandlerId: aave?.handlers[0].id,
            proposalType: ProposalType.SNAPSHOT,
            data: {
                timeStart: 1664975385,
                timeEnd: 1665975385,
            },
        },
    })

    const testProposal2 = await prisma.proposal.upsert({
        where: {
            externalId_daoId: {
                daoId: aave?.id,
                externalId: '2',
            },
        },
        update: {},
        create: {
            externalId: '2',
            name: 'Aave proposal test bravo',
            description: 'Test description 2',
            daoId: aave?.id,
            daoHandlerId: aave?.handlers[0].id,
            proposalType: ProposalType.BRAVO1,
            data: {
                timeStart: 1664975385,
                timeEnd: 1665975385,
            },
        },
    })

    await prisma.vote.upsert({
        where: {
            userId_daoId_proposalId: {
                userId: testUser.id,
                daoId: aave?.id,
                proposalId: testProposal.id,
            },
        },
        update: {},
        create: {
            userId: testUser.id,
            daoId: aave?.id,
            proposalId: testProposal.id,
            daoHandlerId: aave?.handlers[0].id,
            options: {
                create: {
                    option: '1',
                    optionName: 'Yes',
                },
            },
        },
    })

    await prisma.vote.upsert({
        where: {
            userId_daoId_proposalId: {
                userId: testUser.id,
                daoId: aave?.id,
                proposalId: testProposal2.id,
            },
        },
        update: {},
        create: {
            userId: testUser.id,
            daoId: aave?.id,
            proposalId: testProposal2.id,
            daoHandlerId: aave?.handlers[0].id,
            options: {
                create: {
                    option: '0',
                    optionName: 'No',
                },
            },
        },
    })
}

main()
