import '../../styles/globals.css'
import { TrackerHeader } from '../../components/views/tracker/Tracker'
import { ComponentMeta, ComponentStory } from '@storybook/react'

export default {
    title: 'Tracker/TrackerHeader',
    component: TrackerHeader,
} as ComponentMeta<typeof TrackerHeader>

const Template: ComponentStory<typeof TrackerHeader> = (args) => (
    <TrackerHeader {...args} />
)

export const withShare = Template.bind({})
withShare.args = {
    shareButton: true,
}

export const withoutShare = Template.bind({})
withoutShare.args = {
    shareButton: false,
}
