import '../../styles/globals.css'
import { DashboardTable } from '../../components/views/dashboard/table/DashboardTable'
import { ComponentMeta, ComponentStory } from '@storybook/react'

export default {
    title: 'Dashboard/DashboardTable',
    component: DashboardTable,
} as ComponentMeta<typeof DashboardTable>

export const Primary: ComponentStory<typeof DashboardTable> = (args) => (
    <DashboardTable {...args} />
)

Primary.args = {
    proposals: [
        {
            id: 'cl9zcenqx00ik7yipbcksjvgx',
            externalId: '113',
            name: 'Chaos Labs Risk Platform Proposal',
            daoId: 'cl9zbtbgb00007ygci5wct46m',
            daoHandlerId: 'cl9zbtbgb00017ygc94j94mwr',
            proposalType: 'BRAVO',
            data: {
                timeEnd: 1667552411,
                timeStart: 1667322011,
                timeCreated: 1667235611,
            },
            url: 'https://app.aave.com/governance/proposal/?proposalId=113',
            dao: {
                id: 'cl9zbtbgb00007ygci5wct46m',
                name: 'Aave',
                picture:
                    'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
                handlers: [
                    {
                        type: 'BRAVO1',
                    },
                    {
                        type: 'SNAPSHOT',
                    },
                ],
            },
            votes: [],
        },
        {
            id: 'cl9zcepjv00io7yiphfjfjnp5',
            externalId:
                '0xedb87c640a24dadde80f39db547d8ea913483b638efb045fc9ac1a4132d7b78f',
            name: '[ARC] - ERC4626 Strategies as Productive Collateral',
            daoId: 'cl9zbtbgb00007ygci5wct46m',
            daoHandlerId: 'cl9zbtbgb00027ygc9g6ms9gz',
            proposalType: 'SNAPSHOT',
            data: {
                timeEnd: 1668095940,
                timeStart: 1667448000,
                timeCreated: 1667360989,
            },
            url: 'https://snapshot.org/#/aave.eth/proposal/0xedb87c640a24dadde80f39db547d8ea913483b638efb045fc9ac1a4132d7b78f',
            dao: {
                id: 'cl9zbtbgb00007ygci5wct46m',
                name: 'Aave',
                picture:
                    'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
                handlers: [
                    {
                        type: 'BRAVO1',
                    },
                    {
                        type: 'SNAPSHOT',
                    },
                ],
            },
            votes: [],
        },
        {
            id: 'cl9zcepjv00ip7yipbegqyiyk',
            externalId:
                'bafkreidmj5twyypvk3se7nojlgw44zdcoz3d3szgddx2viug65grf42uce',
            name: 'Staked ATokens, A New Aave Primitive Exploring Vote-Escrow Economies ',
            daoId: 'cl9zbtbgb00007ygci5wct46m',
            daoHandlerId: 'cl9zbtbgb00027ygc9g6ms9gz',
            proposalType: 'SNAPSHOT',
            data: {
                timeEnd: 1667656800,
                timeStart: 1667397600,
                timeCreated: 1667306198,
            },
            url: 'https://snapshot.org/#/aave.eth/proposal/bafkreidmj5twyypvk3se7nojlgw44zdcoz3d3szgddx2viug65grf42uce',
            dao: {
                id: 'cl9zbtbgb00007ygci5wct46m',
                name: 'Aave',
                picture:
                    'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
                handlers: [
                    {
                        type: 'BRAVO1',
                    },
                    {
                        type: 'SNAPSHOT',
                    },
                ],
            },
            votes: [],
        },
        {
            id: 'cl9zcepjw00ir7yipwytokqxl',
            externalId:
                '0x2883dabd44037a92dd41139669513659d3850dd080142d8e0825c4dee76fa12a',
            name: 'Security and Agility of Aave Smart Contracts via Continuous Formal Verification',
            daoId: 'cl9zbtbgb00007ygci5wct46m',
            daoHandlerId: 'cl9zbtbgb00027ygc9g6ms9gz',
            proposalType: 'SNAPSHOT',
            data: {
                timeEnd: 1667503939,
                timeStart: 1667244739,
                timeCreated: 1667245736,
            },
            url: 'https://snapshot.org/#/aave.eth/proposal/0x2883dabd44037a92dd41139669513659d3850dd080142d8e0825c4dee76fa12a',
            dao: {
                id: 'cl9zbtbgb00007ygci5wct46m',
                name: 'Aave',
                picture:
                    'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
                handlers: [
                    {
                        type: 'BRAVO1',
                    },
                    {
                        type: 'SNAPSHOT',
                    },
                ],
            },
            votes: [],
        },
        {
            id: 'cl9zcepjw00it7yiprqirx3nn',
            externalId:
                '0x8257d8c7681a3587a61f0d97997045c4d35815031d56386c854afa66f0d04351',
            name: 'Deploy Aave V3 to zkSync 2.0 Testnet',
            daoId: 'cl9zbtbgb00007ygci5wct46m',
            daoHandlerId: 'cl9zbtbgb00027ygc9g6ms9gz',
            proposalType: 'SNAPSHOT',
            data: {
                timeEnd: 1667401200,
                timeStart: 1667142000,
                timeCreated: 1667055731,
            },
            url: 'https://snapshot.org/#/aave.eth/proposal/0x8257d8c7681a3587a61f0d97997045c4d35815031d56386c854afa66f0d04351',
            dao: {
                id: 'cl9zbtbgb00007ygci5wct46m',
                name: 'Aave',
                picture:
                    'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
                handlers: [
                    {
                        type: 'BRAVO1',
                    },
                    {
                        type: 'SNAPSHOT',
                    },
                ],
            },
            votes: [],
        },
        {
            id: 'cl9zcfao200qi7yipwjyfjjnw',
            externalId: '892',
            name: 'Activate Liquidations for Stablecoin Vaults to Clear Bad Debt - October 31, 2022\n',
            daoId: 'cl9zbtd5c000a7ygcl0exngl0',
            daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1667491200,
                timeStart: 1667232000,
                timeCreated: 1586867400,
            },
            url: 'https://vote.makerdao.com/polling/QmSvAa5',
            dao: {
                id: 'cl9zbtd5c000a7ygcl0exngl0',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
                handlers: [
                    {
                        type: 'MAKER_EXECUTIVE',
                    },
                    {
                        type: 'MAKER_POLL_CREATE',
                    },
                    {
                        type: 'MAKER_POLL_VOTE',
                    },
                ],
            },
            votes: [
                {
                    id: 'cl9zcokog00we7yippx45ef3l',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'cl9zcfao200qi7yipwjyfjjnw',
                    daoId: 'cl9zbtd5c000a7ygcl0exngl0',
                    daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
                    options: [
                        {
                            id: 'cl9zcokog00wf7yip10g8iyvm',
                            option: '2',
                            optionName: 'Yes',
                            voterAddress:
                                '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                            voteDaoId: 'cl9zbtd5c000a7ygcl0exngl0',
                            voteProposalId: 'cl9zcfao200qi7yipwjyfjjnw',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zcfc6m00qk7yiph987vxy3',
            externalId: '893',
            name: 'One Month Budget Extension for Strategic Happiness Core Unit - October 31, 2022\n',
            daoId: 'cl9zbtd5c000a7ygcl0exngl0',
            daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1667491200,
                timeStart: 1667232000,
                timeCreated: 1586868900,
            },
            url: 'https://vote.makerdao.com/polling/QmbpGs3',
            dao: {
                id: 'cl9zbtd5c000a7ygcl0exngl0',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
                handlers: [
                    {
                        type: 'MAKER_EXECUTIVE',
                    },
                    {
                        type: 'MAKER_POLL_CREATE',
                    },
                    {
                        type: 'MAKER_POLL_VOTE',
                    },
                ],
            },
            votes: [
                {
                    id: 'cl9zcomhw00wj7yipjmnboy7i',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'cl9zcfc6m00qk7yiph987vxy3',
                    daoId: 'cl9zbtd5c000a7ygcl0exngl0',
                    daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
                    options: [
                        {
                            id: 'cl9zcomhw00wk7yipldkzb4u5',
                            option: '2',
                            optionName: 'Yes',
                            voterAddress:
                                '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                            voteDaoId: 'cl9zbtd5c000a7ygcl0exngl0',
                            voteProposalId: 'cl9zcfc6m00qk7yiph987vxy3',
                        },
                    ],
                },
            ],
        },
        {
            id: 'cl9zcfdp100ql7yipn2teehlg',
            externalId: '894',
            name: 'PPG - Open Market Committee Proposal - October 31, 2022\n',
            daoId: 'cl9zbtd5c000a7ygcl0exngl0',
            daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
            proposalType: 'MAKER_POLL',
            data: {
                timeEnd: 1667491200,
                timeStart: 1667232000,
                timeCreated: 1586870800,
            },
            url: 'https://vote.makerdao.com/polling/QmahDuN',
            dao: {
                id: 'cl9zbtd5c000a7ygcl0exngl0',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
                handlers: [
                    {
                        type: 'MAKER_EXECUTIVE',
                    },
                    {
                        type: 'MAKER_POLL_CREATE',
                    },
                    {
                        type: 'MAKER_POLL_VOTE',
                    },
                ],
            },
            votes: [
                {
                    id: 'cl9zcoob700wo7yip3sfom8b1',
                    voterAddress: '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                    proposalId: 'cl9zcfdp100ql7yipn2teehlg',
                    daoId: 'cl9zbtd5c000a7ygcl0exngl0',
                    daoHandlerId: 'cl9zbtd5c000d7ygcbxjcwas9',
                    options: [
                        {
                            id: 'cl9zcoob700wp7yipbzptd6yp',
                            option: '1',
                            optionName: 'Yes',
                            voterAddress:
                                '0x8804d391472126dA56b9a560AEf6C6d5AAA7607B',
                            voteDaoId: 'cl9zbtd5c000a7ygcl0exngl0',
                            voteProposalId: 'cl9zcfdp100ql7yipn2teehlg',
                        },
                    ],
                },
            ],
        },
    ],
}
