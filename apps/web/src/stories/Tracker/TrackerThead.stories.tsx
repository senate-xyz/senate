import '../../styles/globals.css'
import { TrackerThead } from '../../components/views/tracker/table/TrackerTable'
import { ComponentMeta, ComponentStory } from '@storybook/react'

export default {
    title: 'Tracker/TrackerThead',
    component: TrackerThead,
} as ComponentMeta<typeof TrackerThead>

const Template: ComponentStory<typeof TrackerThead> = () => <TrackerThead />

export const Primary = Template.bind({})
