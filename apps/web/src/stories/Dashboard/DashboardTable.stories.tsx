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
            id: 'claccppha003y7yr4wpfubrq2',
            externalId: '114',
            name: 'Unknown',
            daoId: 'clabprufv00007yx2qcjlpin5',
            daoHandlerId: 'clabprufv00017yx2xpkqyzz0',
            proposalType: 'BRAVO',
            data: {
                timeEnd: 1668242279,
                timeStart: 1668011879,
                timeCreated: 1667925479,
            },
            url: 'https://app.aave.com/governance/proposal/?proposalId=114',
            dao: {
                id: 'clabprufv00007yx2qcjlpin5',
                name: 'Aave',
                picture:
                    'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T11:37:02.556Z'),
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
            id: 'claccpq4v00407yr48mq8rkqu',
            externalId: '115',
            name: 'Unknown',
            daoId: 'clabprufv00007yx2qcjlpin5',
            daoHandlerId: 'clabprufv00017yx2xpkqyzz0',
            proposalType: 'BRAVO',
            data: {
                timeEnd: 1668263807,
                timeStart: 1668033407,
                timeCreated: 1667947007,
            },
            url: 'https://app.aave.com/governance/proposal/?proposalId=115',
            dao: {
                id: 'clabprufv00007yx2qcjlpin5',
                name: 'Aave',
                picture:
                    'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T11:37:02.556Z'),
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
            id: 'claccpqrs00427yr4z6jpek8v',
            externalId: '116',
            name: 'Unknown',
            daoId: 'clabprufv00007yx2qcjlpin5',
            daoHandlerId: 'clabprufv00017yx2xpkqyzz0',
            proposalType: 'BRAVO',
            data: {
                timeEnd: 1668453359,
                timeStart: 1668222959,
                timeCreated: 1668136559,
            },
            url: 'https://app.aave.com/governance/proposal/?proposalId=116',
            dao: {
                id: 'clabprufv00007yx2qcjlpin5',
                name: 'Aave',
                picture:
                    'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T11:37:02.556Z'),
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
            id: 'clacdao3l00317y2lro96bg7b',
            externalId: '0xf2BF5b5DFcaf8f22306D786F6b18ffc9d91C7641',
            name: 'Maker Teleport Technical Deployment on StarkNet, Recognized Delegate Compensation Distribution for October, MOMC Parameter Changes - November 9, 2022',
            daoId: 'clabprugh000a7yx2w7sln5pa',
            daoHandlerId: 'clabprugh000b7yx28ze7ivgk',
            proposalType: 'MAKER_EXECUTIVE',
            data: {
                timeEnd: 1668244931,
                timeStart: 1667952000,
                timeCreated: 1667952000,
            },
            url: 'https://vote.makerdao.com/executive/0xf2BF5b5DFcaf8f22306D786F6b18ffc9d91C7641',
            dao: {
                id: 'clabprugh000a7yx2w7sln5pa',
                name: 'MakerDAO',
                picture:
                    'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T10:40:02.964Z'),
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
            votes: [],
        },
        {
            id: 'clacdz7nf00bp7y2lxq43g6ji',
            externalId:
                '0x907607fde21c051e6f2de1349d054c68b4e35ba09cf141db142c000987842fe6',
            name: '[BIP-111] Index Coop x Balancer DAO Partnership',
            daoId: 'clabprugm000o7yx2dzm6gwfv',
            daoHandlerId: 'clabprugm000p7yx2vxo128og',
            proposalType: 'SNAPSHOT',
            data: {
                timeEnd: 1668366000,
                timeStart: 1668106800,
                timeCreated: 1668106490,
            },
            url: 'https://snapshot.org/#/balancer.eth/proposal/0x907607fde21c051e6f2de1349d054c68b4e35ba09cf141db142c000987842fe6',
            dao: {
                id: 'clabprugm000o7yx2dzm6gwfv',
                name: 'Balancer',
                picture:
                    'https://s2.coinmarketcap.com/static/img/coins/64x64/5728.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T11:36:01.685Z'),
                handlers: [
                    {
                        type: 'SNAPSHOT',
                    },
                ],
            },
            votes: [],
        },
        {
            id: 'clacdz7nf00bq7y2l8iuy8h15',
            externalId:
                '0x31e02b04c53d8bfaa7d39dc988ab0691412b0e4ba4de2dd25fe7363caf2aa7fd',
            name: '[BIP-110] Enable T/WETH 80/20 Gauge w/2% emissions cap [Ethereum]',
            daoId: 'clabprugm000o7yx2dzm6gwfv',
            daoHandlerId: 'clabprugm000p7yx2vxo128og',
            proposalType: 'SNAPSHOT',
            data: {
                timeEnd: 1668366000,
                timeStart: 1668106800,
                timeCreated: 1668106402,
            },
            url: 'https://snapshot.org/#/balancer.eth/proposal/0x31e02b04c53d8bfaa7d39dc988ab0691412b0e4ba4de2dd25fe7363caf2aa7fd',
            dao: {
                id: 'clabprugm000o7yx2dzm6gwfv',
                name: 'Balancer',
                picture:
                    'https://s2.coinmarketcap.com/static/img/coins/64x64/5728.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T11:36:01.685Z'),
                handlers: [
                    {
                        type: 'SNAPSHOT',
                    },
                ],
            },
            votes: [],
        },
        {
            id: 'clacdz7nf00br7y2lvx2ekm9d',
            externalId:
                '0xe41049f4ae8e37d5fe8e649f41f334fa0b5f41e405a746541e893238a0267ea4',
            name: "[BIP-109] Whitelist Aragon Gnosis Safe for Balancer's VotingEscrow",
            daoId: 'clabprugm000o7yx2dzm6gwfv',
            daoHandlerId: 'clabprugm000p7yx2vxo128og',
            proposalType: 'SNAPSHOT',
            data: {
                timeEnd: 1668366000,
                timeStart: 1668106800,
                timeCreated: 1668106260,
            },
            url: 'https://snapshot.org/#/balancer.eth/proposal/0xe41049f4ae8e37d5fe8e649f41f334fa0b5f41e405a746541e893238a0267ea4',
            dao: {
                id: 'clabprugm000o7yx2dzm6gwfv',
                name: 'Balancer',
                picture:
                    'https://s2.coinmarketcap.com/static/img/coins/64x64/5728.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T11:36:01.685Z'),
                handlers: [
                    {
                        type: 'SNAPSHOT',
                    },
                ],
            },
            votes: [],
        },
        {
            id: 'clacdz7ng00bs7y2linocaf3x',
            externalId:
                '0x9d8c07846c17f6b229bd7a2596e1c6e8ac7550f1fafdf1c354d7d059c92aae89',
            name: '[BIP-108] Enable SD/MaticX 80/20 Gauge with 2% emissions cap (Polygon)',
            daoId: 'clabprugm000o7yx2dzm6gwfv',
            daoHandlerId: 'clabprugm000p7yx2vxo128og',
            proposalType: 'SNAPSHOT',
            data: {
                timeEnd: 1668366000,
                timeStart: 1668106800,
                timeCreated: 1668106198,
            },
            url: 'https://snapshot.org/#/balancer.eth/proposal/0x9d8c07846c17f6b229bd7a2596e1c6e8ac7550f1fafdf1c354d7d059c92aae89',
            dao: {
                id: 'clabprugm000o7yx2dzm6gwfv',
                name: 'Balancer',
                picture:
                    'https://s2.coinmarketcap.com/static/img/coins/64x64/5728.png',
                refreshStatus: 'DONE',
                lastRefresh: new Date('2022-11-11T11:36:01.685Z'),
                handlers: [
                    {
                        type: 'SNAPSHOT',
                    },
                ],
            },
            votes: [],
        },
    ],
}
