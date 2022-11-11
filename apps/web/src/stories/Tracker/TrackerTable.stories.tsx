import '../../styles/globals.css'
import { TrackerTable } from '../../components/views/tracker/table/TrackerTable'
import { ComponentMeta, ComponentStory } from '@storybook/react'

export default {
    title: 'Tracker/TrackerTable',
    component: TrackerTable,
} as ComponentMeta<typeof TrackerTable>

const Template: ComponentStory<typeof TrackerTable> = (args) => (
    <TrackerTable {...args} />
)

export const Primary = Template.bind({})
Primary.args = {
    votes: [
        {
            id: 'claccprkl004g7yr4u5vescmi',
            externalId:
                '0x1d85c2688b000a9249668c7eb16d59095bb74cb9f0c244140ceb94c95a7ab877',
            name: '[ARC] Risk Parameter Updates for Aave V2: 2022-10-06',
            daoId: 'clabprufv00007yx2qcjlpin5',
            daoHandlerId: 'clabprufv00027yx2q4upminp',
            proposalType: 'SNAPSHOT',
            data: {
                timeEnd: 1665522000,
                timeStart: 1665111456,
                timeCreated: 1665111486,
            },
            url: 'https://snapshot.org/#/aave.eth/proposal/0x1d85c2688b000a9249668c7eb16d59095bb74cb9f0c244140ceb94c95a7ab877',
            dao: {
                id: 'clabprufv00007yx2qcjlpin5',
                name: 'Aave',
                picture:
                    'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T11:37:02.556Z'),
            },
            votes: [
                {
                    id: 'clacd0hs6000j7y2lizgfsn2k',
                    voterAddress: '0x5B3bFfC0bcF8D4cAEC873fDcF719F60725767c98',
                    proposalId: 'claccprkl004g7yr4u5vescmi',
                    daoId: 'clabprufv00007yx2qcjlpin5',
                    daoHandlerId: 'clabprufv00027yx2q4upminp',
                    options: [
                        {
                            optionName: 'YAE',
                        },
                    ],
                },
            ],
        },
        {
            id: 'claccprkl004h7yr41f3xnllb',
            externalId:
                '0xad105e87d4df487bbe1daec2cd94ca49d1ea595901f5773c1804107539288b59',
            name: 'Chaos Labs <> Aave',
            daoId: 'clabprufv00007yx2qcjlpin5',
            daoHandlerId: 'clabprufv00027yx2q4upminp',
            proposalType: 'SNAPSHOT',
            data: {
                timeEnd: 1665331200,
                timeStart: 1664813293,
                timeCreated: 1664813401,
            },
            url: 'https://snapshot.org/#/aave.eth/proposal/0xad105e87d4df487bbe1daec2cd94ca49d1ea595901f5773c1804107539288b59',
            dao: {
                id: 'clabprufv00007yx2qcjlpin5',
                name: 'Aave',
                picture:
                    'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T11:37:02.556Z'),
            },
            votes: [
                {
                    id: 'clacd0hsb000q7y2lgsxkohk3',
                    voterAddress: '0x5B3bFfC0bcF8D4cAEC873fDcF719F60725767c98',
                    proposalId: 'claccprkl004h7yr41f3xnllb',
                    daoId: 'clabprufv00007yx2qcjlpin5',
                    daoHandlerId: 'clabprufv00027yx2q4upminp',
                    options: [
                        {
                            optionName: ' Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'claccprkl004j7yr4p1gkdq8m',
            externalId:
                '0x584eb4e0f79e1d9dcdd99b3a0c831bfc3c654af3f8f619d5f68eae23cd9cb149',
            name: 'Aave v3 Ethereum. Approval of path forward',
            daoId: 'clabprufv00007yx2qcjlpin5',
            daoHandlerId: 'clabprufv00027yx2q4upminp',
            proposalType: 'SNAPSHOT',
            data: {
                timeEnd: 1665482400,
                timeStart: 1664877600,
                timeCreated: 1664807328,
            },
            url: 'https://snapshot.org/#/aave.eth/proposal/0x584eb4e0f79e1d9dcdd99b3a0c831bfc3c654af3f8f619d5f68eae23cd9cb149',
            dao: {
                id: 'clabprufv00007yx2qcjlpin5',
                name: 'Aave',
                picture:
                    'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T11:37:02.556Z'),
            },
            votes: [
                {
                    id: 'clacd0hrv000b7y2l1fqhz2w8',
                    voterAddress: '0x5B3bFfC0bcF8D4cAEC873fDcF719F60725767c98',
                    proposalId: 'claccprkl004j7yr4p1gkdq8m',
                    daoId: 'clabprufv00007yx2qcjlpin5',
                    daoHandlerId: 'clabprufv00027yx2q4upminp',
                    options: [
                        {
                            optionName: 'Deploy a new Aave v3 Ethereum',
                        },
                    ],
                },
            ],
        },
        {
            id: 'claccprkm004o7yr45w0x3xyq',
            externalId:
                '0x765d1e018f32d7deb8d7b06dc55ac054f75891805a8f6befc2a8d7f497851540',
            name: 'Risk Parameter Updates for Aave V2: 2022-09-22',
            daoId: 'clabprufv00007yx2qcjlpin5',
            daoHandlerId: 'clabprufv00027yx2q4upminp',
            proposalType: 'SNAPSHOT',
            data: {
                timeEnd: 1664312400,
                timeStart: 1663914136,
                timeCreated: 1663914165,
            },
            url: 'https://snapshot.org/#/aave.eth/proposal/0x765d1e018f32d7deb8d7b06dc55ac054f75891805a8f6befc2a8d7f497851540',
            dao: {
                id: 'clabprufv00007yx2qcjlpin5',
                name: 'Aave',
                picture:
                    'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T11:37:02.556Z'),
            },
            votes: [
                {
                    id: 'clacd0hsg000x7y2lezsk2kf5',
                    voterAddress: '0x5B3bFfC0bcF8D4cAEC873fDcF719F60725767c98',
                    proposalId: 'claccprkm004o7yr45w0x3xyq',
                    daoId: 'clabprufv00007yx2qcjlpin5',
                    daoHandlerId: 'clabprufv00027yx2q4upminp',
                    options: [
                        {
                            optionName: 'YAE',
                        },
                    ],
                },
            ],
        },
        {
            id: 'claccprkm004r7yr42gwbp7dq',
            externalId:
                '0xdaa660ea59f8678748d6f133d7d7ed70b941798aa9a0044a16a1285d09e26bf5',
            name: '[ARC] Whitelist Balancer’s Liquidity Mining Claim',
            daoId: 'clabprufv00007yx2qcjlpin5',
            daoHandlerId: 'clabprufv00027yx2q4upminp',
            proposalType: 'SNAPSHOT',
            data: {
                timeEnd: 1663973940,
                timeStart: 1663542060,
                timeCreated: 1663436462,
            },
            url: 'https://snapshot.org/#/aave.eth/proposal/0xdaa660ea59f8678748d6f133d7d7ed70b941798aa9a0044a16a1285d09e26bf5',
            dao: {
                id: 'clabprufv00007yx2qcjlpin5',
                name: 'Aave',
                picture:
                    'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T11:37:02.556Z'),
            },
            votes: [
                {
                    id: 'clacd0hsl00157y2lbm65rmxl',
                    voterAddress: '0x5B3bFfC0bcF8D4cAEC873fDcF719F60725767c98',
                    proposalId: 'claccprkm004r7yr42gwbp7dq',
                    daoId: 'clabprufv00007yx2qcjlpin5',
                    daoHandlerId: 'clabprufv00027yx2q4upminp',
                    options: [
                        {
                            optionName: 'YAE',
                        },
                    ],
                },
            ],
        },
        {
            id: 'claccprkn00517yr4pahq1mdz',
            externalId:
                '0x519f6ecb17b00eb9c2c175c586173b15cfa5199247903cda9ddab48763ddb035',
            name: '[ARC] Ethereum v2 Reserve Factor - aFEI Holding Update ',
            daoId: 'clabprufv00007yx2qcjlpin5',
            daoHandlerId: 'clabprufv00027yx2q4upminp',
            proposalType: 'SNAPSHOT',
            data: {
                timeEnd: 1661763600,
                timeStart: 1661446800,
                timeCreated: 1661363906,
            },
            url: 'https://snapshot.org/#/aave.eth/proposal/0x519f6ecb17b00eb9c2c175c586173b15cfa5199247903cda9ddab48763ddb035',
            dao: {
                id: 'clabprufv00007yx2qcjlpin5',
                name: 'Aave',
                picture:
                    'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T11:37:02.556Z'),
            },
            votes: [
                {
                    id: 'clacd0hst001k7y2lbkpnrbct',
                    voterAddress: '0x5B3bFfC0bcF8D4cAEC873fDcF719F60725767c98',
                    proposalId: 'claccprkn00517yr4pahq1mdz',
                    daoId: 'clabprufv00007yx2qcjlpin5',
                    daoHandlerId: 'clabprufv00027yx2q4upminp',
                    options: [
                        {
                            optionName: 'YAE',
                        },
                    ],
                },
            ],
        },
        {
            id: 'claccprkn00527yr4uki8l5x7',
            externalId:
                '0x19df23070be999efbb7caf6cd35c320eb74dd119bcb15d003dc2e82c2bbd0d94',
            name: '[ARC] Risk Parameter Updates for Ethereum Aave v2 Market',
            daoId: 'clabprufv00007yx2qcjlpin5',
            daoHandlerId: 'clabprufv00027yx2q4upminp',
            proposalType: 'SNAPSHOT',
            data: {
                timeEnd: 1661763600,
                timeStart: 1661446800,
                timeCreated: 1661363746,
            },
            url: 'https://snapshot.org/#/aave.eth/proposal/0x19df23070be999efbb7caf6cd35c320eb74dd119bcb15d003dc2e82c2bbd0d94',
            dao: {
                id: 'clabprufv00007yx2qcjlpin5',
                name: 'Aave',
                picture:
                    'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T11:37:02.556Z'),
            },
            votes: [
                {
                    id: 'clacd0hsp001d7y2lzn26drh8',
                    voterAddress: '0x5B3bFfC0bcF8D4cAEC873fDcF719F60725767c98',
                    proposalId: 'claccprkn00527yr4uki8l5x7',
                    daoId: 'clabprufv00007yx2qcjlpin5',
                    daoHandlerId: 'clabprufv00027yx2q4upminp',
                    options: [
                        {
                            optionName: 'YAE',
                        },
                    ],
                },
            ],
        },
        {
            id: 'claccprkn005b7yr4dnfg4dqj',
            externalId:
                '0x88e896a245ffeda703e0b8f5494f3e66628be6e32a7243e3341b545c2972857f',
            name: '[ARC] Add MaticX to Polygon v3 Market',
            daoId: 'clabprufv00007yx2qcjlpin5',
            daoHandlerId: 'clabprufv00027yx2q4upminp',
            proposalType: 'SNAPSHOT',
            data: {
                timeEnd: 1661122740,
                timeStart: 1660518060,
                timeCreated: 1660401177,
            },
            url: 'https://snapshot.org/#/aave.eth/proposal/0x88e896a245ffeda703e0b8f5494f3e66628be6e32a7243e3341b545c2972857f',
            dao: {
                id: 'clabprufv00007yx2qcjlpin5',
                name: 'Aave',
                picture:
                    'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T11:37:02.556Z'),
            },
            votes: [
                {
                    id: 'clacd0hsx001r7y2llp5985ht',
                    voterAddress: '0x5B3bFfC0bcF8D4cAEC873fDcF719F60725767c98',
                    proposalId: 'claccprkn005b7yr4dnfg4dqj',
                    daoId: 'clabprufv00007yx2qcjlpin5',
                    daoHandlerId: 'clabprufv00027yx2q4upminp',
                    options: [
                        {
                            optionName: 'YAE',
                        },
                    ],
                },
            ],
        },
        {
            id: 'claccprko005o7yr4ujcfa3pa',
            externalId:
                '0xb17b3294dcb08316cb623c717add7f82df54948d558992f886be59d0958e9b24',
            name: 'Greenlight for GHO',
            daoId: 'clabprufv00007yx2qcjlpin5',
            daoHandlerId: 'clabprufv00027yx2q4upminp',
            proposalType: 'SNAPSHOT',
            data: {
                timeEnd: 1659261600,
                timeStart: 1659011100,
                timeCreated: 1658924851,
            },
            url: 'https://snapshot.org/#/aave.eth/proposal/0xb17b3294dcb08316cb623c717add7f82df54948d558992f886be59d0958e9b24',
            dao: {
                id: 'clabprufv00007yx2qcjlpin5',
                name: 'Aave',
                picture:
                    'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T11:37:02.556Z'),
            },
            votes: [
                {
                    id: 'clacd0ht7002f7y2ljtghe30p',
                    voterAddress: '0x5B3bFfC0bcF8D4cAEC873fDcF719F60725767c98',
                    proposalId: 'claccprko005o7yr4ujcfa3pa',
                    daoId: 'clabprufv00007yx2qcjlpin5',
                    daoHandlerId: 'clabprufv00027yx2q4upminp',
                    options: [
                        {
                            optionName: 'YAE',
                        },
                    ],
                },
            ],
        },
        {
            id: 'claccprko005s7yr417n4es8b',
            externalId:
                'bafkreieeyh6pbqwhgryo6v67oxlmnfhaptrgkc3u7y6bvz2y3jdkxgrrh4',
            name: 'ARC: Extend the Safety Module Protection to Aave V2 Arc',
            daoId: 'clabprufv00007yx2qcjlpin5',
            daoHandlerId: 'clabprufv00027yx2q4upminp',
            proposalType: 'SNAPSHOT',
            data: {
                timeEnd: 1659294000,
                timeStart: 1658862000,
                timeCreated: 1658866422,
            },
            url: 'https://snapshot.org/#/aave.eth/proposal/bafkreieeyh6pbqwhgryo6v67oxlmnfhaptrgkc3u7y6bvz2y3jdkxgrrh4',
            dao: {
                id: 'clabprufv00007yx2qcjlpin5',
                name: 'Aave',
                picture:
                    'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T11:37:02.556Z'),
            },
            votes: [
                {
                    id: 'clacd0ht400277y2lu7w963j7',
                    voterAddress: '0x5B3bFfC0bcF8D4cAEC873fDcF719F60725767c98',
                    proposalId: 'claccprko005s7yr417n4es8b',
                    daoId: 'clabprufv00007yx2qcjlpin5',
                    daoHandlerId: 'clabprufv00027yx2q4upminp',
                    options: [
                        {
                            optionName: 'YAE - Do Extend SM to ARC market',
                        },
                    ],
                },
            ],
        },
        {
            id: 'claccprkp005x7yr4as71hxfe',
            externalId:
                'bafkreigdmcfmwvnxfolpds4xkdicgrszgmknig7pz2r2t37tltupdpyfu4',
            name: 'Risk-Off Framework for the Aave Protocol',
            daoId: 'clabprufv00007yx2qcjlpin5',
            daoHandlerId: 'clabprufv00027yx2q4upminp',
            proposalType: 'SNAPSHOT',
            data: {
                timeEnd: 1659153540,
                timeStart: 1658516400,
                timeCreated: 1658427706,
            },
            url: 'https://snapshot.org/#/aave.eth/proposal/bafkreigdmcfmwvnxfolpds4xkdicgrszgmknig7pz2r2t37tltupdpyfu4',
            dao: {
                id: 'clabprufv00007yx2qcjlpin5',
                name: 'Aave',
                picture:
                    'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T11:37:02.556Z'),
            },
            votes: [
                {
                    id: 'clacd0ht0001z7y2lccjxko16',
                    voterAddress: '0x5B3bFfC0bcF8D4cAEC873fDcF719F60725767c98',
                    proposalId: 'claccprkp005x7yr4as71hxfe',
                    daoId: 'clabprufv00007yx2qcjlpin5',
                    daoHandlerId: 'clabprufv00027yx2q4upminp',
                    options: [
                        {
                            optionName: '3%',
                        },
                    ],
                },
            ],
        },
        {
            id: 'clacdap7n00337y2l23e92tjv',
            externalId: '877',
            name: 'Whitelist Oasis.app on rETHUSD Oracle (MIP10c9-SP31) - October 10, 2022\n',
            daoId: 'clabprugh000a7yx2w7sln5pa',
            daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1665676800,
                timeStart: 1665417600,
                timeCreated: 1571844100,
            },
            url: 'https://vote.makerdao.com/polling/QmZzFPF',
            dao: {
                id: 'clabprugh000a7yx2w7sln5pa',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T10:40:02.964Z'),
            },
            votes: [
                {
                    id: 'clacdiprf006g7y2lfhghqygz',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'clacdap7n00337y2l23e92tjv',
                    daoId: 'clabprugh000a7yx2w7sln5pa',
                    daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'clacdapf900347y2lqs40ar5m',
            externalId: '878',
            name: 'Change PSM-GUSD-A Parameters - October 10, 2022\n',
            daoId: 'clabprugh000a7yx2w7sln5pa',
            daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1665676800,
                timeStart: 1665417600,
                timeCreated: 1571845600,
            },
            url: 'https://vote.makerdao.com/polling/QmYffkv',
            dao: {
                id: 'clabprugh000a7yx2w7sln5pa',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T10:40:02.964Z'),
            },
            votes: [
                {
                    id: 'clacdiprl006l7y2ly2tpv1q7',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'clacdapf900347y2lqs40ar5m',
                    daoId: 'clabprugh000a7yx2w7sln5pa',
                    daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'clacdapoa00357y2liorkhona',
            externalId: '879',
            name: 'End DAI Funding For Sourcecred - October 10, 2022\n',
            daoId: 'clabprugh000a7yx2w7sln5pa',
            daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1665676800,
                timeStart: 1665417600,
                timeCreated: 1571846900,
            },
            url: 'https://vote.makerdao.com/polling/QmYNSoy',
            dao: {
                id: 'clabprugh000a7yx2w7sln5pa',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T10:40:02.964Z'),
            },
            votes: [
                {
                    id: 'clacdiprp006q7y2lg2f316zr',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'clacdapoa00357y2liorkhona',
                    daoId: 'clabprugh000a7yx2w7sln5pa',
                    daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'clacdapva00367y2l7py0qvow',
            externalId: '880',
            name: 'MOMC Guidance - Remove ETH Supply Yield And Liquidity Incentives From D3M Target Borrow Rate Calculations - October 10, 2022\n',
            daoId: 'clabprugh000a7yx2w7sln5pa',
            daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1665676800,
                timeStart: 1665417600,
                timeCreated: 1571848200,
            },
            url: 'https://vote.makerdao.com/polling/QmSvCFp',
            dao: {
                id: 'clabprugh000a7yx2w7sln5pa',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T10:40:02.964Z'),
            },
            votes: [
                {
                    id: 'clacdiprs006v7y2lqjga5l9t',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'clacdapva00367y2l7py0qvow',
                    daoId: 'clabprugh000a7yx2w7sln5pa',
                    daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'clacdaq3s00387y2lditg5fy5',
            externalId: '881',
            name: 'MOMC Guidance - Allowed Spread Between D3M Target Borrow Rate And ETH-A Stability Fee October 10, 2022\n',
            daoId: 'clabprugh000a7yx2w7sln5pa',
            daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1665676800,
                timeStart: 1665417600,
                timeCreated: 1571852600,
            },
            url: 'https://vote.makerdao.com/polling/QmbbdsR',
            dao: {
                id: 'clabprugh000a7yx2w7sln5pa',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T10:40:02.964Z'),
            },
            votes: [
                {
                    id: 'clacdiprv00707y2lv750usjg',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'clacdaq3s00387y2lditg5fy5',
                    daoId: 'clabprugh000a7yx2w7sln5pa',
                    daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'clacdaqbr003a7y2lxumrbxv3',
            externalId: '882',
            name: 'Ratification Poll for Endgame Prelaunch MIP Set - October 10, 2022\n',
            daoId: 'clabprugh000a7yx2w7sln5pa',
            daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1666627200,
                timeStart: 1665417600,
                timeCreated: 1571854900,
            },
            url: 'https://vote.makerdao.com/polling/QmTmS5N',
            dao: {
                id: 'clabprugh000a7yx2w7sln5pa',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T10:40:02.964Z'),
            },
            votes: [
                {
                    id: 'clacdips000757y2lkn6g2f7c',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'clacdaqbr003a7y2lxumrbxv3',
                    daoId: 'clabprugh000a7yx2w7sln5pa',
                    daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'clacdaqj9003c7y2l451rgm8g',
            externalId: '883',
            name: 'Ratification Poll for Offboarding the Strategic Happiness Core Unit - SH-001 (MIP39c3-SP3) - October 10, 2022\n',
            daoId: 'clabprugh000a7yx2w7sln5pa',
            daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1666627200,
                timeStart: 1665417600,
                timeCreated: 1571856500,
            },
            url: 'https://vote.makerdao.com/polling/QmdUv8L',
            dao: {
                id: 'clabprugh000a7yx2w7sln5pa',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T10:40:02.964Z'),
            },
            votes: [
                {
                    id: 'clacdips5007a7y2loznvygis',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'clacdaqj9003c7y2l451rgm8g',
                    daoId: 'clabprugh000a7yx2w7sln5pa',
                    daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'clacdaqqy003d7y2lr7iffjlu',
            externalId: '884',
            name: 'Ratification Poll for Offboarding the Events Core Unit - EVENTS-001 (MIP39c3-SP4) - October 10, 2022\n',
            daoId: 'clabprugh000a7yx2w7sln5pa',
            daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1666627200,
                timeStart: 1665417600,
                timeCreated: 1571857200,
            },
            url: 'https://vote.makerdao.com/polling/QmbP2Xd',
            dao: {
                id: 'clabprugh000a7yx2w7sln5pa',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T10:40:02.964Z'),
            },
            votes: [
                {
                    id: 'clacdips8007f7y2lcfmy67x5',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'clacdaqqy003d7y2lr7iffjlu',
                    daoId: 'clabprugh000a7yx2w7sln5pa',
                    daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'clacdaqz1003f7y2ljrebdebr',
            externalId: '885',
            name: 'Ratification Poll for Offboarding the Real-World Finance Core Unit - RWF-001 (MIP39c3-SP5) - October 10, 2022\n',
            daoId: 'clabprugh000a7yx2w7sln5pa',
            daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1666627200,
                timeStart: 1665417600,
                timeCreated: 1571858300,
            },
            url: 'https://vote.makerdao.com/polling/QmX68eH',
            dao: {
                id: 'clabprugh000a7yx2w7sln5pa',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T10:40:02.964Z'),
            },
            votes: [
                {
                    id: 'clacdipsa007k7y2ls2syiv6i',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'clacdaqz1003f7y2ljrebdebr',
                    daoId: 'clabprugh000a7yx2w7sln5pa',
                    daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'clacdar6p003g7y2lef54rn02',
            externalId: '886',
            name: 'Ratification Poll for Coinbase USDC Institutional Rewards (MIP81) - October 10, 2022\n',
            daoId: 'clabprugh000a7yx2w7sln5pa',
            daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1666627200,
                timeStart: 1665417600,
                timeCreated: 1571859800,
            },
            url: 'https://vote.makerdao.com/polling/QmbMaQ9',
            dao: {
                id: 'clabprugh000a7yx2w7sln5pa',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T10:40:02.964Z'),
            },
            votes: [
                {
                    id: 'clacdipsd007p7y2lrhx5g077',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'clacdar6p003g7y2lef54rn02',
                    daoId: 'clabprugh000a7yx2w7sln5pa',
                    daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'clacdardq003i7y2lq72uux21',
            externalId: '887',
            name: 'Ratification Poll for Monetalis-Coinbase Appaloosa (MIP82) - October 10, 2022\n',
            daoId: 'clabprugh000a7yx2w7sln5pa',
            daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1666627200,
                timeStart: 1665417600,
                timeCreated: 1571860400,
            },
            url: 'https://vote.makerdao.com/polling/QmRVN2S',
            dao: {
                id: 'clabprugh000a7yx2w7sln5pa',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T10:40:02.964Z'),
            },
            votes: [
                {
                    id: 'clacdipsg007v7y2liccpybsf',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'clacdardq003i7y2lq72uux21',
                    daoId: 'clabprugh000a7yx2w7sln5pa',
                    daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'clacdarl7003k7y2lgrichus3',
            externalId: '888',
            name: 'Ratification Poll for Legal And Commercial Risk Domain Work on Greenlit Collateral BlockTower Credit - RWA Arranger SPF (MIP55c3-SP9) - October 10, 2022\n',
            daoId: 'clabprugh000a7yx2w7sln5pa',
            daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1666627200,
                timeStart: 1665417600,
                timeCreated: 1571862000,
            },
            url: 'https://vote.makerdao.com/polling/QmcV2pM',
            dao: {
                id: 'clabprugh000a7yx2w7sln5pa',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T10:40:02.964Z'),
            },
            votes: [
                {
                    id: 'clacdipsj00807y2lubbjj7r7',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'clacdarl7003k7y2lgrichus3',
                    daoId: 'clabprugh000a7yx2w7sln5pa',
                    daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'clacdarus003m7y2lr04cg6l6',
            externalId: '889',
            name: 'Ratification Poll for Facilitator Offboarding Process (MIP41c5) adjustments (MIP4c2-SP26) - October 10, 2022\n',
            daoId: 'clabprugh000a7yx2w7sln5pa',
            daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1666627200,
                timeStart: 1665417600,
                timeCreated: 1571863100,
            },
            url: 'https://vote.makerdao.com/polling/QmYgLJ1',
            dao: {
                id: 'clabprugh000a7yx2w7sln5pa',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T10:40:02.964Z'),
            },
            votes: [
                {
                    id: 'clacdipsn00867y2ln0j4hrx8',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'clacdarus003m7y2lr04cg6l6',
                    daoId: 'clabprugh000a7yx2w7sln5pa',
                    daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'clacdas3w003o7y2ld59tlemq',
            externalId: '890',
            name: 'Ratification Poll for Facilitator Offboarding - RWF-001 (MIP41c5-SP12) - October 10, 2022\n',
            daoId: 'clabprugh000a7yx2w7sln5pa',
            daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1666627200,
                timeStart: 1665417600,
                timeCreated: 1571863800,
            },
            url: 'https://vote.makerdao.com/polling/QmRp4bD',
            dao: {
                id: 'clabprugh000a7yx2w7sln5pa',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T10:40:02.964Z'),
            },
            votes: [
                {
                    id: 'clacdipsp008b7y2lrj48qx56',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'clacdas3w003o7y2ld59tlemq',
                    daoId: 'clabprugh000a7yx2w7sln5pa',
                    daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'clacdascl003q7y2la8nlh2e1',
            externalId: '891',
            name: 'MIP65 Asset Reallocation - October 24, 2022 \n',
            daoId: 'clabprugh000a7yx2w7sln5pa',
            daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1666886400,
                timeStart: 1666627200,
                timeCreated: 1581845300,
            },
            url: 'https://vote.makerdao.com/polling/QmSfMtT',
            dao: {
                id: 'clabprugh000a7yx2w7sln5pa',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T10:40:02.964Z'),
            },
            votes: [
                {
                    id: 'clacdipst008g7y2lwbvon7t9',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'clacdascl003q7y2la8nlh2e1',
                    daoId: 'clabprugh000a7yx2w7sln5pa',
                    daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'clacdaslj003r7y2loxizeixn',
            externalId: '892',
            name: 'Activate Liquidations for Stablecoin Vaults to Clear Bad Debt - October 31, 2022\n',
            daoId: 'clabprugh000a7yx2w7sln5pa',
            daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1667491200,
                timeStart: 1667232000,
                timeCreated: 1586867400,
            },
            url: 'https://vote.makerdao.com/polling/QmSvAa5',
            dao: {
                id: 'clabprugh000a7yx2w7sln5pa',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T10:40:02.964Z'),
            },
            votes: [
                {
                    id: 'clacdipsx008m7y2lflbls8zb',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'clacdaslj003r7y2loxizeixn',
                    daoId: 'clabprugh000a7yx2w7sln5pa',
                    daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'clacdassk003s7y2ln4b4vr6e',
            externalId: '893',
            name: 'One Month Budget Extension for Strategic Happiness Core Unit - October 31, 2022\n',
            daoId: 'clabprugh000a7yx2w7sln5pa',
            daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1667491200,
                timeStart: 1667232000,
                timeCreated: 1586868900,
            },
            url: 'https://vote.makerdao.com/polling/QmbpGs3',
            dao: {
                id: 'clabprugh000a7yx2w7sln5pa',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T10:40:02.964Z'),
            },
            votes: [
                {
                    id: 'clacdipt1008s7y2l6y4vmuls',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'clacdassk003s7y2ln4b4vr6e',
                    daoId: 'clabprugh000a7yx2w7sln5pa',
                    daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'clacdat08003u7y2l0k8ub6jq',
            externalId: '894',
            name: 'PPG - Open Market Committee Proposal - October 31, 2022\n',
            daoId: 'clabprugh000a7yx2w7sln5pa',
            daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1667491200,
                timeStart: 1667232000,
                timeCreated: 1586870800,
            },
            url: 'https://vote.makerdao.com/polling/QmahDuN',
            dao: {
                id: 'clabprugh000a7yx2w7sln5pa',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T10:40:02.964Z'),
            },
            votes: [
                {
                    id: 'clacdipt5008y7y2lxgna1t4i',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'clacdat08003u7y2l0k8ub6jq',
                    daoId: 'clabprugh000a7yx2w7sln5pa',
                    daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
        {
            id: 'clacdat8x003w7y2l0rjxxilf',
            externalId: '895',
            name: 'Add the Compound V2 DAI Direct Deposit Module (D3M) - November 7, 2022\n',
            daoId: 'clabprugh000a7yx2w7sln5pa',
            daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1668096000,
                timeStart: 1667836800,
                timeCreated: 1591888700,
            },
            url: 'https://vote.makerdao.com/polling/QmWYfgY',
            dao: {
                id: 'clabprugh000a7yx2w7sln5pa',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T10:40:02.964Z'),
            },
            votes: [
                {
                    id: 'clacdipt900937y2l5zb8gtug',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'clacdat8x003w7y2l0rjxxilf',
                    daoId: 'clabprugh000a7yx2w7sln5pa',
                    daoHandlerId: 'clabprugh000d7yx2rdt44wfw',
                    options: [
                        {
                            optionName: 'Yes',
                        },
                    ],
                },
            ],
        },
    ],
    selectedDao: 'MakerDAO',
}
