import '../../styles/globals.css'
import { DashboardRow } from '../../components/views/dashboard/table/DashboardRow'
import { ComponentMeta, ComponentStory } from '@storybook/react'

export default {
    title: 'Dashboard/DashboardRow',
    component: DashboardRow,
} as ComponentMeta<typeof DashboardRow>

export const Primary: ComponentStory<typeof DashboardRow> = (args) => (
    <DashboardRow {...args} />
)

Primary.args = {
    proposal: {
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
}
