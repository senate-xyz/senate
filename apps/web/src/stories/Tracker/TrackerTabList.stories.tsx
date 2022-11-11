import '../../styles/globals.css'
import { TrackerTabList } from '../../components/views/tracker/Tracker'
import { ComponentMeta, ComponentStory } from '@storybook/react'

export default {
    title: 'Tracker/TrackerTabList',
    component: TrackerTabList,
} as ComponentMeta<typeof TrackerTabList>

const Template: ComponentStory<typeof TrackerTabList> = (args) => (
    <TrackerTabList {...args} />
)

export const Primary = Template.bind({})
Primary.args = {
    daosTabs: [
        {
            id: 'clabprufv00007yx2qcjlpin5',
            name: 'Aave',
            picture:
                'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
            refreshStatus: 'DONE',
            lastRefresh: new Date('2022-11-11T11:37:02.556Z'),
        },
        {
            id: 'clabprugh000a7yx2w7sln5pa',
            name: 'MakerDAO',
            picture:
                'https://seeklogo.com/images/M/maker-mkr-logo-FAA728D102-seeklogo.com.png',
            refreshStatus: 'DONE',
            lastRefresh: new Date('2022-11-11T10:40:02.964Z'),
        },
    ],
}
