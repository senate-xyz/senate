import '../../styles/globals.css'
import { TrackerTab } from '../../components/views/tracker/Tracker'
import { ComponentMeta, ComponentStory } from '@storybook/react'

export default {
    title: 'Tracker/TrackerTab',
    component: TrackerTab,
} as ComponentMeta<typeof TrackerTab>

const Template: ComponentStory<typeof TrackerTab> = (args) => (
    <TrackerTab {...args} />
)
export const Primary = Template.bind({})
Primary.args = {
    daoName: 'Aave',
    daoPicture:
        'https://s2.coinmarketcap.com/static/img/coins/200x200/7278.png',
}
